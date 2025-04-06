import { Meta } from '@decorators/meta.decorator';
import { AuthGuard } from '@guards/auth.guard';
import { Body, Controller, Delete, Get, HttpStatus, Put, Res, UseGuards } from '@nestjs/common';
import { Meta as MetaType } from '@type/meta';
import BaseController from '@utils/base-controller';
import { Response } from 'express';
import { UpdateUserDto } from '../dto/user.dto';
import { UserService } from '../service/user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController extends BaseController{
  constructor(private readonly userService: UserService) {
	super()
  }

	@Get()
	async findOne(
		@Res() res: Response,
		@Meta() meta: MetaType,
	) {
		const options = {
			filter: {
				id: meta.userId
			}
		}

		try {
			const response = await this.userService.findOne(options);

			this.sendSuccess({
				res,
				data: response,
				status: HttpStatus.OK
			})
		} catch (error) {
			this.sendError({
				res,
				error
			})
		}
	}

	@Put()
	async update(
		@Meta() meta: MetaType,
		@Body() data: UpdateUserDto,
		@Res() res: Response,
	) {
		const options = {
			filter: {
				id: meta.userId
			},
			data
		}

		try {
			const response = await this.userService.update(options);

			this.sendSuccess({
				res,
				data: response,
				status: HttpStatus.OK
			})

		} catch (error) {
			this.sendError({
				res,
				error
			})
		}
	}

  @Delete()
  async remove(
	@Res() res: Response,
	@Meta() meta: MetaType,
  ) {
    const options = {
		filter: {
			id: meta.userId
		}
	}

	try {
		const response = await this.userService.remove(options);

		this.sendSuccess({
			res,
			data: response,
			status: HttpStatus.OK
		})
	} catch (error) {
		this.sendError({
			res,
			error
		})
	}
  }
}
