import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";
import {Cron, CronExpression} from "@nestjs/schedule";
import axios, {AxiosResponse} from "axios";
import {ApiKeys} from "../utils/api.keys";
import {CmpCoinsInterface} from "../types/cmpCoins.interface";

@Injectable()
export class TasksService {
    constructor(@InjectRepository(CoinEntity) private readonly coinRepository: Repository<CoinEntity>) {}

    @Cron(CronExpression.EVERY_HOUR)
    async updateCoins(): Promise<void> {
        const coins: CmpCoinsInterface[] = await this.coinmarketcapCoinsData().then(result => result.data.data);
        for(const coin of coins) {
            if(await this.coinRepository.exist({where:{id: coin.id}})) {
                await this.coinRepository.update(
                    {id: coin.id},
                    {price: coin.quote.USD.price});
            }
            else await this.coinRepository.insert({
                id: coin.id,
                name: coin.name,
                rank: coin.cmc_rank,
                symbol: coin.symbol,
                price: coin.quote.USD.price
            })
        }
    }

    private async coinmarketcapCoinsData(): Promise<AxiosResponse<any>> {
        const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest";
        const config = {
            headers: {
                "X-CMC_PRO_API_KEY": ApiKeys.coinMarketCapApiKey
            },
            params: {
                limit: 200
            }
        };
        return axios.get(url,config as any).then(res => res,err => err);
    }
}