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

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
      @InjectRepository(PurchasesEntity) private readonly purchaseRepository: Repository<PurchasesEntity>) {}

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
    const userPurchasesIds: number[] = (await this.purchaseRepository.
    find({
      relations: {
        user: true
      }})).
    filter(purchase => purchase.user.id == userId).
    map(purchase => purchase.id);
    if(userPurchasesIds.length > 0) await this.purchaseRepository.delete(userPurchasesIds);
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
      const purchasesIds: number[] = userPurchases.
      filter(purchase => purchase.coin.id == coin.id).
      map(purchase => purchase.id);
      coin.purchases = await this.purchaseRepository.find({
        where:
            {
              id: In(purchasesIds)
            }
      });
    }
    return {user: user}
  }
}