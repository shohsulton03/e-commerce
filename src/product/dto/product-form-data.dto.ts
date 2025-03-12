import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class ProductFormDto {
  @ApiProperty({
    description: 'Product name',
    example: 'product',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'description',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: '12.3',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    description: 'Product stock',
    example: '12',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  stock: number;

  @ApiProperty({
    description: 'Product category id',
    example: '1',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  categoryId: number;
}
