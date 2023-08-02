import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {UserEntity} from "../../db/entity/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Not, Repository} from "typeorm";
import {UpdateUserDto} from "../dto/user/updateUser.dto";
import {ErrorMessage} from "../configs/error-message";
import {UserInterface} from "../types/user.interface";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import * as bcrypt from 'bcrypt'
import {UpdateCoinsDto} from "../dto/user/updateCoins.dto";
import {CoinEntity} from "../../db/entity/coin.entity";
import {UserCoinsInterface} from "../types/userCoins.interface";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {}

  public async getOne(userId: number): Promise<UserInterface> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      }});
    if(!user) throw new NotFoundException("Not Found", {description: Error().stack});
    return {user: user};
  }

  public async update(updateUserDto: UpdateUserDto, userId: number): Promise<ResponseStatusInterface> {
    if(!await this.userRepository.exist({
      where: {
        id: userId
      }
    })) throw new BadRequestException(ErrorMessage.userNotFound, {description: Error().stack});
    else if(await this.userRepository.exist({
      where: {
        login: updateUserDto.login,
        id: Not(userId)
      }
    })) throw new BadRequestException(ErrorMessage.loginExists,{description: Error().stack});
    (updateUserDto.password) ?
        await this.userRepository.update(userId, {
          login: updateUserDto.login,
          password: await bcrypt.hash(updateUserDto.password,10)
        }) :
        await this.userRepository.update(userId, {
          login: updateUserDto.login
        });
    return {status: "SUCCESS"};
  }

  public async delete(userId: number): Promise<ResponseStatusInterface> {
    const deleteResult = await this.userRepository.delete({
      id: userId
    });
    if(deleteResult.affected == 0) throw new BadRequestException(ErrorMessage.userNotFound,{description: Error().stack});
    return {status: "SUCCESS"};
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
    return {status: "SUCCESS"};
  }

  public async userCoins(userId: number): Promise<UserCoinsInterface> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId
      },
      relations: {
        coins: true
      }});
    return {
      user: user
    }
  }

  public async deleteUserCoins(coinId: number, userId: number): Promise<ResponseStatusInterface> {
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
    return {status: "SUCCESS"};
  }
}