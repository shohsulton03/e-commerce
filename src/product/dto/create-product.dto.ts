import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Product description',
    example: 'description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Product price',
    example: '12.3',
  })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Product stock',
    example: '12',
  })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({
    description: 'Product category id',
    example: '1',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  categoryId: number;

  @ApiProperty({
    example: [
      'https://www.example.com/image1.png',
      'https://www.example.com/image2.png',
    ],
    description: 'Array of product images',
  })
  @IsArray()
  @IsOptional()
  images?: string[];
}
