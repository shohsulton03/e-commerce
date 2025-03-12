import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsPositive } from 'class-validator';

export class CreateBasketDto {
  @ApiProperty({
    description: 'user id',
    example: '1',
  })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({
    description: 'product id',
    example: '1',
  })
  @IsNumber()
  @IsPositive()
  productId: number;

  @ApiProperty({
    description: 'quantity',
    example: '1',
  })
  @IsNumber()
  @IsPositive()
  quantity: number;
}
