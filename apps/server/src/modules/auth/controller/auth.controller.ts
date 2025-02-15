import {
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	Patch,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	async create(@Body() createAuthDto: LoginDto, @Res() res: Response) {
		const response = await this.authService.authenticate({ ...createAuthDto, res });
		return res.send(response);
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}

	@Patch('refresh')
	@HttpCode(HttpStatus.OK)
	async refreshToken(@Req() req: Request) {
		try {
			return this.authService.refreshToken(req);
		} catch {
			throw new UnauthorizedException('INVALID_REFRESH_TOKEN');
		}
	}

	@Delete('logout')
	@HttpCode(HttpStatus.OK)
	async logout(@Res() res: Response) {
		const response = await this.authService.logout(res);
		return res.send(response);
	}
}
