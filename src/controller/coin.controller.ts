import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {CoinService} from "../service/coin.service";
import {GetCoinsInterface} from "../types/getCoins.interface";
import {AuthGuard} from "../guards/auth.guard";

@Controller("api/coins")
@ApiTags("Coin controller")
@ApiBearerAuth()
export class CoinController {
    constructor(private readonly coinService: CoinService) {}

    @UseGuards(AuthGuard)
    @Get()
    coins(@Query("pageNum") pageNum: number, @Query("pageSize") pageSize: number): Promise<GetCoinsInterface> {
        return this.coinService.coins(pageNum, pageSize);
    }
}