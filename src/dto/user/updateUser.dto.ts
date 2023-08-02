import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UpdateUserDto {

    @IsNotEmpty()
    @ApiProperty()
    readonly login: string

    @ApiProperty({required: false})
    readonly password?: string
}