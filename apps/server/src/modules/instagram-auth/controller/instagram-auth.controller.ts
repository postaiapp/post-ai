import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Post, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import { DeleteInstagramAuthDto, InstagramAuthDto } from '../dto/instagram-auth.dto';
import { InstagramAuthService } from '../services/instagram-auth.service';
import { mappingIntegrationsErrors } from '@constants/errors';
import { ApiTags, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Instagram')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('instagram')
export class InstagramAuthController {
	private readonly logger = new Logger(InstagramAuthService.name);

	constructor(private readonly instagramAuthService: InstagramAuthService) {}

	@Post()
	@HttpCode(201)
	@ApiBody({
		schema: {
			example: {
				username: "instagramuser",
				password: "instagrampass"
			}
		}
	})
	async create(@Body() body: InstagramAuthDto, @Meta() meta: MetaType) {
		try {
			return await this.instagramAuthService.createAccount(body, meta);
		} catch (error) {
			const { logger, Exception, status, exceptionMessage } = mappingIntegrationsErrors(error, body.username);

			this.logger.error(logger);
			throw new Exception(exceptionMessage, status);
		}
	}

	@Post('login')
	@HttpCode(200)
	@ApiBody({
		schema: {
			example: {
				username: "instagramuser",
				password: "instagrampass"
			}
		}
	})
	async login(@Body() body: InstagramAuthDto, @Meta() meta: MetaType) {
		try {
			return await this.instagramAuthService.login(body, meta);
		} catch (error) {
			const { logger, exceptionMessage, status, Exception } = mappingIntegrationsErrors(error, body.username);

			this.logger.error(logger);
			throw new Exception(exceptionMessage, status);
		}
	}

	@Delete('logout/:username')
	@HttpCode(204)
	@ApiParam({
		name: 'username',
		example: 'instagramuser'
	})
	delete(@Param() query: DeleteInstagramAuthDto, @Meta() meta: MetaType) {
		return this.instagramAuthService.delete(query, meta);
	}

	@Get('accounts')
	@HttpCode(200)
	getAccounts(@Meta() meta: MetaType) {
		return this.instagramAuthService.getAccounts(meta);
	}
}
