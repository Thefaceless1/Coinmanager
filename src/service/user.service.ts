import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UserEntity} from "../../db/entity/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Not, Repository} from "typeorm";
import {UpdateUserDto} from "../dto/user/updateUser.dto";
import {ResponseMessage} from "../response.message";
import {UserInterface} from "../types/user.interface";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import * as bcrypt from 'bcrypt'
import {PurchasesEntity} from "../../db/entity/purchases.entity";
import {PurchaseStatsInterface} from "../types/purchaseStats.interface";
import {CoinEntity} from "../../db/entity/coin.entity";
import {StakingEntity} from "../../db/entity/staking.entity";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
      @InjectRepository(PurchasesEntity) private readonly purchaseRepository: Repository<PurchasesEntity>,
      @InjectRepository(StakingEntity) private readonly stakingRepository: Repository<StakingEntity>
  ) {}

  public async getOne(userId: number): Promise<UserInterface> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }});
    if(!user) throw new NotFoundException(ResponseMessage.userNotFound);
    return {user: user};
  }

  public async update(updateUserDto: UpdateUserDto, userId: number): Promise<ResponseStatusInterface> {
    if(!await this.userRepository.exist({
      where: {
        id: userId
      }
    })) throw new NotFoundException(ResponseMessage.userNotFound);
    else if(await this.userRepository.exist({
      where: {
        login: updateUserDto.login,
        id: Not(userId)
      }
    })) throw new BadRequestException(ResponseMessage.loginExists);
    (updateUserDto.password) ?
        await this.userRepository.update(userId, {
          login: updateUserDto.login,
          password: await bcrypt.hash(updateUserDto.password,10)
        }) :
        await this.userRepository.update(userId, {
          login: updateUserDto.login
        });
    return {status: ResponseMessage.success};
  }

  public async delete(userId: number): Promise<ResponseStatusInterface> {
    if(!await this.userRepository.exist({
      where: {
        id: userId
      }
    })) throw new NotFoundException(ResponseMessage.userNotFound);
    await this.userRepository.delete({id: userId});
    return {status: ResponseMessage.success};
  }

  public async userCoins(userId: number): Promise<UserInterface> {
    const userPurchases = (await this.purchaseRepository.find({
      relations: {
        user: true,
        coin: true
      }
    })).filter(purchase => purchase.user.id == userId);
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        coins: true
      }});
    for(const coin of user.coins) {
      const coinPurchases: PurchasesEntity[] = userPurchases.
      filter(purchase => purchase.coin.id == coin.id);
      coin.purchasesStats = (coinPurchases.length > 0) ? await this.calculatePurchaseStats(coinPurchases,coin) : null;
      coin.purchases = await this.purchaseRepository.find({
        where:
            {
              id: In(coinPurchases.map(purchase => purchase.id))
            }
      });
    }
    return {user: user}
  }

  private async calculatePurchaseStats(coinPurchases: PurchasesEntity[],coin: CoinEntity): Promise<PurchaseStatsInterface> {
    const totalCoinCount: number = coinPurchases.reduce((accum,purchase) =>accum+purchase.count,0);
    const totalPriceCount: number = coinPurchases.reduce((accum,purchase) =>accum+purchase.totalPrice,0);
    const averagePrice: number = totalPriceCount/totalCoinCount;
    const profit: number = ((coin.price - averagePrice)/averagePrice)*100;
    return {
      averagePrice: averagePrice,
      totalCoinCount: totalCoinCount,
      profit: profit
    }
  }

  public async userStaking(userId: number): Promise<UserInterface> {
    const user: UserEntity = await this.userRepository.findOne({where: {id: userId}});
    const staking: StakingEntity[] = (await this.stakingRepository.find({
      relations:
          {
            coin: true,
            user: true
          }
    })).filter(staking => staking.user.id == userId);
    if(staking.length == 0) {
      user.staking = staking
      return {user: user};
    }
    staking.forEach(staking => {
      staking.user = undefined;
      const dayCoinProfit: number = (staking.count * staking.percent / 100) / 365;
      const dayUsdProfit: number = dayCoinProfit * staking.coin.price;
      const monthCoinProfit: number = (staking.count * staking.percent / 100) / 12;
      const monthUsdProfit: number = monthCoinProfit * staking.coin.price;
      staking.stakingStats = {
        dayCoinProfit: dayCoinProfit,
        dayUsdProfit: dayUsdProfit,
        monthCoinProfit: monthCoinProfit,
        monthUsdProfit: monthUsdProfit
      }
    })
    user.staking = staking;
    return {user: user};
  }
}