import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class AddCoinsDto {
    @ApiProperty()
    @IsNotEmpty()
    coins: number[]
}