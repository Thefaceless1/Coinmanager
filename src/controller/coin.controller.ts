import {Controller, Get, Query, UseGuards} from "@nestjs/common";
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {CoinService} from "../service/coin.service";
import {GetCoinsInterface} from "../types/getCoins.interface";
import {AuthGuard} from "../guards/auth.guard";

@Controller("api/coins")
@ApiTags("Coin controller")
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class CoinController {
    constructor(private readonly coinService: CoinService) {}

    @Get()
    @ApiQuery({
        name: "symbol",
        required: false,
        description: "Filter by symbol column"
    })
    async coins(
        @Query("pageNum") pageNum: number,
        @Query("pageSize") pageSize: number,
        @Query("symbol") symbol?: string
    ): Promise<GetCoinsInterface> {
        return this.coinService.coins(pageNum, pageSize, symbol);
    }
}