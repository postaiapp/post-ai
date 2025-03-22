import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
	@IsOptional()
	@IsNumber()
	page: number;

	@IsOptional()
	@IsNumber()
	limit: number;
}

export type Pagination = {
	page: number;
	perPage: number;
	offset: number;
};
