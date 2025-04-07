import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService
	) {}

	private extractJwt(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		
		return type === 'Bearer' ? token : undefined;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();

		const token = this.extractJwt(request);

		if (!token) {
			throw new UnauthorizedException('Unauthorized');
		}

		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get<string>('JWT_SECRET'),
			});

			request.user = payload.user ?? payload;
		} catch {
			throw new UnauthorizedException('Unauthorized');
		}

		return true;
	}
}
