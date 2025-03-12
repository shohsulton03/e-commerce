import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";

export class CreateOrderDto {
    @ApiProperty({
        description:'user id',
        example: 1
    })
    @IsNumber()
    @IsPositive()
    userId:number
}
