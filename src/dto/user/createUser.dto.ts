import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateUserDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly login: string

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty()
    readonly email: string

    @IsNotEmpty()
    @ApiProperty()
    readonly password: string
}