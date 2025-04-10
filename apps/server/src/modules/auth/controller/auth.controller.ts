import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Res
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginDto, RegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post()
	@HttpCode(HttpStatus.OK)
	@ApiBody({
		schema: {
			example: {
				email: "user@example.com",
				password: "yourpassword"
			}
		}
	})
	async create(@Body() createAuthDto: LoginDto, @Res() res: Response) {
		const response = await this.authService.authenticate({ ...createAuthDto, res });
		return res.send(response);
	}

	@Post('register')
	@HttpCode(HttpStatus.CREATED)
	@ApiBody({
		schema: {
			example: {
				name: "John Doe",
				email: "john@example.com",
				password: "securepassword"
			}
		}
	})
	register(@Body() registerDto: RegisterDto) {
		return this.authService.register(registerDto);
	}
}
