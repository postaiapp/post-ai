import { RegisterDto } from '@modules/auth/dto/auth.dto';
import { PartialType } from '@nestjs/swagger';
import { TransformCPF, ValidateCPF } from '@utils/validate-cpf';
import { IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
  @Length(11, 11)
  @ValidateCPF()
  @TransformCPF()
  cpf?: string;

  @IsOptional()
  @IsPhoneNumber('BR')
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}
