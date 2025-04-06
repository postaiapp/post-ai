import { RegisterDto } from '@modules/auth/dto/auth.dto';
import { OmitType } from '@nestjs/swagger';
import { TransformCPF, ValidateCPF } from '@utils/validate-cpf';
import { Transform } from 'class-transformer';
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateUserDto extends OmitType(RegisterDto, ['password']) {
	@IsOptional()
	@Transform(({ value }) => (value === '' ? null : value))
	@IsPhoneNumber('BR')
	phone?: string;

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
}
