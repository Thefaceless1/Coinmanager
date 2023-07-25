import {ApiProperty} from "@nestjs/swagger";

export class ChangeUserDto {
    @ApiProperty()
    readonly login: string

    @ApiProperty()
    readonly password: string
}