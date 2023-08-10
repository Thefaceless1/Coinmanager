import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UserEntity} from "../../db/entity/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Not, Repository} from "typeorm";
import {UpdateUserDto} from "../dto/user/updateUser.dto";
import {ResponseMessage} from "../response.message";
import {UserInterface} from "../types/user.interface";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import * as bcrypt from 'bcrypt'
import {UserCoinsInterface} from "../types/userCoins.interface";
import {PurchasesEntity} from "../../db/entity/purchases.entity";
import {PurchaseStatsInterface} from "../types/purchaseStats.interface";
import {CoinEntity} from "../../db/entity/coin.entity";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
      @InjectRepository(PurchasesEntity) private readonly purchaseRepository: Repository<PurchasesEntity>
  ) {}

  public async getOne(userId: number): Promise<UserInterface> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }});
    if(!user) throw new NotFoundException(ResponseMessage.userNotFound, {description: Error().stack});
    return {user: user};
  }

  public async update(updateUserDto: UpdateUserDto, userId: number): Promise<ResponseStatusInterface> {
    if(!await this.userRepository.exist({
      where: {
        id: userId
      }
    })) throw new BadRequestException(ResponseMessage.userNotFound, {description: Error().stack});
    else if(await this.userRepository.exist({
      where: {
        login: updateUserDto.login,
        id: Not(userId)
      }
    })) throw new BadRequestException(ResponseMessage.loginExists,{description: Error().stack});
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
    })) throw new BadRequestException(ResponseMessage.userNotFound, {description: Error().stack});
    await this.userRepository.delete({id: userId});
    return {status: ResponseMessage.success};
  }

  public async userCoins(userId: number): Promise<UserCoinsInterface> {
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
}