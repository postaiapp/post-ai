import { RegisterDto } from '@modules/auth/dto/auth.dto';
import { PartialType } from '@nestjs/swagger';
import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDto extends PartialType(RegisterDto) {
  @IsOptional()
//   @Length(11, 13)
//   @ValidateCPF()
//   @TransformCPF()
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
