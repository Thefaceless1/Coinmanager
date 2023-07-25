import {Controller, Get} from "@nestjs/common";
import {ApiTags} from "@nestjs/swagger";
import {CoinService} from "../service/coin.service";

@Controller("api/coins")
@ApiTags("Coin controller")
export class CoinController {
    constructor(private readonly coinService: CoinService) {}

    @Get()
    coins() {
        return this.coinService.coins();
    }
}