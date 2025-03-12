import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ClearBasketDto {
  @ApiProperty({
    description: 'user id',
    example: '1',
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}
