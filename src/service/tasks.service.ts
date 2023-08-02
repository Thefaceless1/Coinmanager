import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";
import {Cron, CronExpression} from "@nestjs/schedule";
import axios, {AxiosResponse} from "axios";
import {CoinGeckoCoinsInterface} from "../types/coinGeckoCoins.interface";

@Injectable()
export class TasksService {
    constructor(@InjectRepository(CoinEntity) private readonly coinRepository: Repository<CoinEntity>) {}

    @Cron(CronExpression.EVERY_10_MINUTES)
    async updateCoins(): Promise<void> {
        const coins: CoinGeckoCoinsInterface[] = await this.coinGeckoCoinsData().then(result => result.data);
        for(const coin of coins) {
            if(await this.coinRepository.exist({where:{name: coin.name}})) {
                await this.coinRepository.update(
                    {name: coin.name},
                    {
                        price: coin.current_price,
                        rank: coin.market_cap_rank,
                        marketCap: coin.market_cap
                    });
            }
            else await this.coinRepository.insert({
                name: coin.name,
                rank: coin.market_cap_rank,
                symbol: coin.symbol,
                price: coin.current_price,
                marketCap: coin.market_cap,
                image: coin.image
            })
        }
    }

    private async coinGeckoCoinsData(): Promise<AxiosResponse<any>> {
        const url = "https://api.coingecko.com/api/v3/coins/markets";
        const config = {
            params: {
                vs_currency: "usd",
                order: "market_cap_desc",
                per_page: 200,
                page: 1,
                sparkline: false,
                locale: "en"
            }
        };
        return axios.get(url,config as any).then(res => res,err => err);
    }
}