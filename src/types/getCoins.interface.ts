import {CoinEntity} from "../../db/entity/coin.entity";

export class GetCoinsInterface {
    coins: CoinEntity[]
    pageData: {
        pageNum: number,
        pageSize: number,
        totalCount: number,
        totalPages: number
    }
}