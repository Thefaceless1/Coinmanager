import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";

@Injectable()
export class CoinService {
    constructor(@InjectRepository(CoinEntity) private readonly coinRepository: Repository<CoinEntity>) {}

    public async coins() {
    }
}