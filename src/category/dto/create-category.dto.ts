import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Category',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

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

  @ApiProperty({
    description: 'Category parent id',
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;
}
