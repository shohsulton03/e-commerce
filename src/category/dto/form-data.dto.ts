import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class FormDataDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Category',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'description',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Category parent id',
    example: '1',
  })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  parentId?: number;
}
