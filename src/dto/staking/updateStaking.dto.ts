import {IsNotEmpty, IsPositive} from "class-validator";

export class UpdateStakingDto {
    @IsNotEmpty()
    @IsPositive()
    readonly percent: number

    @IsNotEmpty()
    @IsPositive()
    readonly count: number
}