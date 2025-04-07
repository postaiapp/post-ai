import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Meta = createParamDecorator((_: never, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	return request.user;
});
