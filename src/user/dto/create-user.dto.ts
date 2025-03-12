import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description: "User full name",
        example: "John Doe"
    })
    @IsString()
    @IsNotEmpty()
    full_name:string

    @ApiProperty({
        description: "User emai;",
        example: "example@gmail.com"
    })
    @IsEmail()
    email:string

    @ApiProperty({
        description: "User password",
        example: "password"
    })
    @IsString()
    @IsNotEmpty()
    password:string

    @ApiProperty({
        description: "User confirm password",
        example: "password"
    })
    @IsString()
    @IsNotEmpty()
    confirm_password:string

    @IsOptional()
    @IsBoolean()
    is_active?:boolean
}
