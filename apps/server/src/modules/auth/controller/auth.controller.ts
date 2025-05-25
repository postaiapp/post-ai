import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';
import BaseController from '@utils/base-controller';

@ApiTags('Auth')
@Controller('auth')
export class AuthController extends BaseController {
	constructor(private readonly authService: AuthService) {
		super();
	}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiBody({
		schema: {
			example: {
				email: 'user@example.com',
				password: 'yourpassword',
			},
		},
	})
	async create(@Body() createAuthDto: LoginDto, @Res() res: Response) {
		try {
			const response = await this.authService.authenticate({ ...createAuthDto });

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiBody({
		schema: {
			example: {
				name: 'John Doe',
				email: 'john@example.com',
				password: 'securepassword',
			},
		},
	})
	async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
		try {
			const response = await this.authService.register(registerDto);

			return this.sendSuccess({ data: response, res });
		} catch (error) {
			return this.sendError({ error, res });
		}
	}
}
