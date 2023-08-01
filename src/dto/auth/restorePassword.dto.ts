import {IsEmail, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class RestorePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    readonly email: string
}