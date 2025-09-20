import { RegisterDto } from '@modules/auth/dto/auth.dto';
import { OmitType, PartialType } from '@nestjs/swagger';
import { TransformCPF, ValidateCPF } from '@/utils/validate-cpf';
import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString, Length, IsNumber } from 'class-validator';

export class UpdateUserDto extends PartialType(OmitType(RegisterDto, ['password'])) {
	@IsOptional()
	@Transform(({ value }) => (value === '' ? null : value))
	@IsPhoneNumber('BR')
	phone_number?: string;

	@IsOptional()
	@IsString()
	city?: string;

	@IsOptional()
	@IsString()
	country?: string;

	@IsOptional()
	@Transform(({ value }) => (value === '' ? null : value))
	@Length(11, 14)
	@ValidateCPF()
	@TransformCPF()
	cpf?: string;

	@IsOptional()
	@IsString()
	company_description?: string;

	@IsOptional()
	@IsNumber()
	company_file_id?: number;

	@IsOptional()
	@IsString()
	brand_color?: string;
}
