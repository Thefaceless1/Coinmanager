import {IsNotEmpty, IsPositive} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdatePurchaseDto {
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    readonly price: number

    @IsPositive()
    @IsNotEmpty()
    @ApiProperty()
    readonly count: number

    @IsNotEmpty()
    @ApiProperty()
    readonly purchaseDate: string
}