import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class UpdateCoinsDto {
    @ApiProperty({type: [Number]})
    @IsNotEmpty()
    readonly coins: number[]
}