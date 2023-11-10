import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly lastName?: string;
}
