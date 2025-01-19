import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '@schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {}

    async authenticate({ email, password }: LoginDto) {
        const user = await this.userModel.findOne({ email }, { email: 1, password: 1, name: 1, _id: 1 }).lean(true);

        if (!user) {
            const FAKE_PASSWORD = '$2a$12$4NNIgYdnWkr4B30pT5i3feDEzWivfxyOK.oNSxk7G3GzGAVfB6vEC';
            await bcrypt.compare(password, FAKE_PASSWORD);
            throw new UnauthorizedException('Invalid credentials');
        }

        const doesPasswordMatch = await bcrypt.compare(password, user.password);

        if (!doesPasswordMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.generateToken({ user });

        return {
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        };
    }

    async register({ name, email, password }: RegisterDto) {
        const alreadyUser = await this.userModel.findOne({ email });

        if (alreadyUser) {
            throw new UnauthorizedException('Registration failed');
        }

        const password_hash = await bcrypt.hash(password, 12);

        await this.userModel.create({
            name,
            email,
            password: password_hash,
        });

        return {
            message: 'User created successfully',
        };
    }

    async generateToken({ user }) {
        const payload = { userId: user._id, email: user.email };

        return this.jwtService.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: '1d',
        });
    }
}
