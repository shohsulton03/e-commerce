import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class GiveRoleDto{
    @ApiProperty({
        description: "User email",
        example: "example@gmail.com"
    })
    @IsEmail()
    email:string
}