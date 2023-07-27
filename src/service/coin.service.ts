import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";
import {GetCoinsInterface} from "../types/getCoins.interface";

@Injectable()
export class CoinService {
    constructor(@InjectRepository(CoinEntity) private readonly coinRepository: Repository<CoinEntity>) {}

    public async coins(pageNum: number, pageSize: number, symbol?: string): Promise<GetCoinsInterface> {
        const from: number = pageNum * pageSize;
        const to: number = from + pageSize;
        const coinsWithFilter = (await this.coinRepository.find()).filter(coin => coin.symbol.toLowerCase().includes(symbol.toLowerCase()));
        const foundedCoins = (symbol) ?
            coinsWithFilter.filter((coin,index) => {
                return index >= from && index < to
            }) :
            (await this.coinRepository.find()).filter((coin,index) => {
                return index >= from && index < to
            });
        const totalCount = (symbol) ? coinsWithFilter.length : await this.coinRepository.count();
        const totalPages = Math.floor(totalCount/pageSize) + 1;
        return {
            coins: foundedCoins,
            pageData: {
                pageNum: pageNum,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPages: totalPages
            }
        }
    }
}