import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";
import {GetCoinsInterface} from "../types/getCoins.interface";
import {UpdateCoinsDto} from "../dto/user/updateCoins.dto";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import {UserEntity} from "../../db/entity/user.entity";
import {ResponseMessage} from "../response.message";
import {PurchasesEntity} from "../../db/entity/purchases.entity";

@Injectable()
export class CoinService {
    constructor(
        @InjectRepository(CoinEntity) private readonly coinRepository: Repository<CoinEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(PurchasesEntity) private readonly purchaseRepository: Repository<PurchasesEntity>
    ) {}

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

    public async updateCoins(userId: number, updateCoinsDto: UpdateCoinsDto): Promise<ResponseStatusInterface> {
        const user = new UserEntity();
        const coinArray: CoinEntity[] = [];
        for(const coinId of updateCoinsDto.coins) {
            const coin = new CoinEntity()
            coin.id = coinId;
            coinArray.push(coin);
        }
        user.id = userId
        user.coins = coinArray
        await this.userRepository.save(user);
        await this.deleteRelatedPurchase(userId,updateCoinsDto.coins);
        return {status: ResponseMessage.success};
    }

    private async deleteRelatedPurchase(userId: number, coinIds: number[] | number): Promise<void> {
        const purchasesIdsToDelete = (await this.purchaseRepository.
        find({
            relations: {
                user: true,
                coin: true
            }
        })).
        filter(purchase => {
            if(typeof coinIds != "number") return purchase.user.id == userId && !coinIds.includes(purchase.coin.id);
            else return purchase.user.id == userId && coinIds == purchase.coin.id;
        }).
        map(purchase => purchase.id);
        if(purchasesIdsToDelete.length > 0) await this.purchaseRepository.delete(purchasesIdsToDelete);
    }

    public async deleteCoins(coinId: number, userId: number): Promise<ResponseStatusInterface> {
        const user = await this.userRepository.findOne({
            relations: {
                coins: true
            },
            where: {
                id: userId
            }
        })
        user.coins = user.coins.filter(coin => coin.id != coinId)
        await this.userRepository.save(user);
        await this.deleteRelatedPurchase(userId,coinId);
        return {status: ResponseMessage.success};
    }
}