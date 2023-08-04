import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
     Put,
    Query,
    Request,
    UseGuards,
    UsePipes,
    ValidationPipe
} from "@nestjs/common";
import {ApiBearerAuth, ApiQuery, ApiTags} from "@nestjs/swagger";
import {CoinService} from "../service/coin.service";
import {GetCoinsInterface} from "../types/getCoins.interface";
import {AuthGuard} from "../guards/auth.guard";
import {UpdateCoinsDto} from "../dto/user/updateCoins.dto";
import {ResponseStatusInterface} from "../types/responseStatus.interface";

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
    @ApiQuery({
        name: "pageSize",
        example: 20,
    })
    @ApiQuery({
        name: "pageNum",
        example: 0,
    })
    async coins(
        @Query("pageNum") pageNum: number,
        @Query("pageSize") pageSize: number,
        @Query("symbol") symbol?: string
    ): Promise<GetCoinsInterface> {
        return this.coinService.coins(pageNum, pageSize, symbol);
    }

    @Put("/update")
    @UsePipes(new ValidationPipe())
    async addCoins(@Body() updateCoinsDto: UpdateCoinsDto, @Request() req: Request): Promise<ResponseStatusInterface> {
        return this.coinService.updateCoins(req["user"].sub, updateCoinsDto);
    }

    @Delete("/delete/:coinId")
    async deleteCoins(@Request() req: Request, @Param("coinId") coinId: number): Promise<ResponseStatusInterface> {
        return this.coinService.deleteCoins(coinId,req["user"].sub)
    }
}