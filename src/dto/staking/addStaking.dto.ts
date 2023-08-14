import {IsNotEmpty, IsPositive} from "class-validator";

export class AddStakingDto {
    @IsNotEmpty()
    readonly coinId: number

    @IsNotEmpty()
    @IsPositive()
    readonly percent: number

    @IsNotEmpty()
    @IsPositive()
    readonly count: number
}