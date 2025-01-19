import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { User } from '@schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { IgApiClient } from 'instagram-private-api';
import { Model } from 'mongoose';

interface TokenStatus {
    isValid: boolean;
    lastChecked: Date;
    lastRefreshed: Date;
    nextCheckDate: Date;
}

interface InstagramUser {
    userId: string;
    username: string;
    password: string; // Encrypted
    token: string;
    tokenStatus: TokenStatus;
    scheduledPosts: Array<any>;
}

@Injectable()
export class TokenValidationService {
    private readonly logger = new Logger(User.name);
    private readonly TOKEN_CHECK_INTERVAL = 7;
    private readonly TOKEN_REFRESH_THRESHOLD = 60;

    constructor(
        @InjectModel('InstagramUser') private readonly userModel: Model<InstagramUser>,
        private readonly ig: IgApiClient
    ) {}

    async checkTokenValidity(userId: string): Promise<boolean> {
        try {
            const user = await this.userModel.findOne({ userId });
            await this.ig.state.deserialize(JSON.parse(user.token));

            // Tenta fazer uma requisição simples para validar o token
            await this.ig.user.info(userId);

            // Atualiza o status do token
            await this.updateTokenStatus(userId, true);
            return true;
        } catch (error) {
            await this.updateTokenStatus(userId, false);
            return false;
        }
    }

    private async updateTokenStatus(userId: string, isValid: boolean) {
        const nextCheckDate = new Date();
        nextCheckDate.setDate(nextCheckDate.getDate() + this.TOKEN_CHECK_INTERVAL);

        await this.userModel.updateOne(
            { userId },
            {
                $set: {
                    'tokenStatus.isValid': isValid,
                    'tokenStatus.lastChecked': new Date(),
                    'tokenStatus.nextCheckDate': nextCheckDate,
                },
            }
        );
    }

    private async refreshToken(userId: string): Promise<boolean> {
        try {
            const user = await this.userModel.findOne({ userId });
            const decryptedPassword = await bcrypt.(user.password);

            // Gera novo device e faz login
            this.ig.state.generateDevice(user.username);
            await this.ig.account.login(user.username, decryptedPassword);

            // Salva novo token
            const newToken = await this.ig.state.serialize();

            await this.userModel.updateOne(
                { userId },
                {
                    $set: {
                        token: JSON.stringify(newToken),
                        'tokenStatus.lastRefreshed': new Date(),
                        'tokenStatus.isValid': true,
                    },
                }
            );

            this.logger.log(`Token refreshed successfully for user ${userId}`);
            return true;
        } catch (error) {
            this.logger.error(`Failed to refresh token for user ${userId}`, error);
            return false;
        }
    }

    // Verifica tokens próximos do vencimento
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async checkTokensForRefresh() {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + this.TOKEN_REFRESH_THRESHOLD);

        const usersToRefresh = await this.userModel.find({
            'tokenStatus.lastRefreshed': {
                $lt: thresholdDate,
            },
        });

        for (const user of usersToRefresh) {
            await this.refreshToken(user.userId);
        }
    }

    // Validação pré-publicação
    async ensureValidTokenForPost(userId: string): Promise<boolean> {
        const isValid = await this.checkTokenValidity(userId);
        if (!isValid) {
            return await this.refreshToken(userId);
        }
        return true;
    }
}
