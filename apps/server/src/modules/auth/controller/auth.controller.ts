import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createAuthDto: LoginDto, @Res() res: Response) {
		const response = await this.authService.authenticate({ ...createAuthDto, res });
		return res.send(response);
	}

	@Post('register')
	@HttpCode(HttpStatus.OK)
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}
}
