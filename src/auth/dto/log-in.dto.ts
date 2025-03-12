import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LogInDto {
  @ApiProperty({
    description: 'User emai;',
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
