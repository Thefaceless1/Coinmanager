import {ApiProperty} from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty()
    readonly login: string

    @ApiProperty({required: false})
    readonly password?: string
}