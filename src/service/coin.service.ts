import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";
import {GetCoinsInterface} from "../types/getCoins.interface";

@Injectable()
export class CoinService {
    constructor(@InjectRepository(CoinEntity) private readonly coinRepository: Repository<CoinEntity>) {}

    public async coins(pageNum: number, pageSize: number): Promise<GetCoinsInterface> {
        const totalCount = await this.coinRepository.count();
        const totalPages = Math.floor(totalCount/pageSize);
        const from: number = pageNum * pageSize + 1;
        const to: number = from + pageSize - 1;
        const coins = await this.coinRepository
            .createQueryBuilder()
            .where(`rank BETWEEN ${from} and ${to}`)
            .execute();
        return {
            coins: coins,
            pageData: {
                pageNum: pageNum,
                pageSize: pageSize,
                totalCount: totalCount,
                totalPages: totalPages
            }
        }
    }
}