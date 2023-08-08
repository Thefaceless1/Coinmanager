import {IsNotEmpty, IsPositive} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class AddPurchaseDto {
    @IsNotEmpty()
    @ApiProperty()
    readonly coinId: number

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    readonly price: number

    @IsNotEmpty()
    @IsPositive()
    @ApiProperty()
    readonly count: number

    @IsNotEmpty()
    @ApiProperty()
    readonly purchaseDate: string
}