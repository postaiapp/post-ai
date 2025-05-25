import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AuthToken } from '@models/auth-token.model';
import { MetaAuthService } from '@modules/meta/services/meta-auth.service';
import PQueue from 'p-queue';
import moment from 'moment';
import { CronExpression } from '@nestjs/schedule';

@Injectable()
export class RefreshTokensCron {
	private readonly logger = new Logger(RefreshTokensCron.name);
	private readonly queue: PQueue;

	constructor(private readonly metaAuthService: MetaAuthService) {
		this.queue = new PQueue({ concurrency: 50 });
	}

	@Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
	async refreshTokens() {
		this.logger.log('Starting Instagram tokens refresh');

		try {
			const tokens = await AuthToken.findAll({
				where: {
					name: 'instagram_token',
				},
			});

			this.logger.log(`Found ${tokens.length} tokens to refresh`);

			const refreshPromises = tokens.map(token =>
				this.queue.add(async () => {
					try {
						const { access_token: newToken } =
							await this.metaAuthService.refreshLongLivedToken(token.access_token);

						await token.update({
							access_token: newToken,
							expires_at: moment().add(60, 'days').format(),
						});

						this.logger.log(
							`Successfully refreshed token for user_platform_id: ${token.user_platform_id}`,
						);
					} catch (error) {
						this.logger.error(
							`Failed to refresh token for user_platform_id: ${token.user_platform_id}`,
							error,
						);
					}
				}),
			);

			await Promise.all(refreshPromises);

			this.logger.log('Instagram tokens refresh completed');
		} catch (error) {
			this.logger.error('Error during tokens refresh:', error);
		}
	}
}
