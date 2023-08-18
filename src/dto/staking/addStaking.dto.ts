import {IsNotEmpty, IsPositive} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AddStakingDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly coinId: number

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    readonly percent: number

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    readonly count: number
}