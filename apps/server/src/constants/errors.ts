import { BadRequestException, ForbiddenException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import { ExceptionResponse } from '@type/error';

export const mappingIntegrationsErrors = (error: any, username?: string): ExceptionResponse => {
	const errorInstance = error instanceof Error ? error : new Error(error);

	const errors = {
		IgLoginRequiredError: {
			logger: `Login failed for user ${username}: Challenge required. Please verify your Instagram account for any issues.`,
			exceptionMessage: 'SESSION_REQUIRED',
			status: HttpStatus.FORBIDDEN,
			Exception: ForbiddenException,
		},
		IgLoginBadPasswordError: {
			logger: `Login failed for user ${username}: Bad Request.`,
			exceptionMessage: 'INVALID_INSTAGRAM_CREDENTIALS',
			status: HttpStatus.BAD_REQUEST,
			Exception: BadRequestException,
		},
		IgLoginInvalidUserError: {
			logger: `Login not found for ${username} account: Bad Request.`,
			exceptionMessage: 'INVALID_INSTAGRAM_CREDENTIALS',
			status: HttpStatus.BAD_REQUEST,
			Exception: BadRequestException,
		},
	};

	return (
		errors[errorInstance.name] || {
			logger: 'Internal Server error',
			exceptionMessage: 'Internal Server error',
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			Exception: InternalServerErrorException,
		}
	);
};
