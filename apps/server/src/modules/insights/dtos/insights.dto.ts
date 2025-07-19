import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetDashboardDto {
	@IsNumber()
	@IsNotEmpty()
	platformId: number;
}
