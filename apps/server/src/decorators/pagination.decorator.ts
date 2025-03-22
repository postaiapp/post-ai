import { createParamDecorator, ExecutionContext } from '@nestjs/common';

interface PaginationOptions {
	perPage?: number;
}

export const Paginate = createParamDecorator((options: PaginationOptions = {}, ctx: ExecutionContext) => {
	const { perPage = 15 } = options;
	const req = ctx.switchToHttp().getRequest();

	const page = Number(req.query.limit) || 1;

	return {
		offset: (page - 1) * perPage,
		page,
		perPage,
	};
});
