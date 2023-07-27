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
        const coins: CoinEntity[] = (symbol) ?
            (await this.coinRepository.find()).filter(coin => coin.symbol.toLowerCase().includes(symbol.toLowerCase())) :
            await this.coinRepository.find();
        const foundedCoins: CoinEntity[] = coins.filter((coin,index) => {
            return index >= from && index < to
        });
        const totalCount: number = coins.length;
        const totalPages: number = Math.floor(totalCount/pageSize) + 1;
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