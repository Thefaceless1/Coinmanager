import {IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly login: string

    @IsNotEmpty()
    @ApiProperty()
    readonly password: string
}