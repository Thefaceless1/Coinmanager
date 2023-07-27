import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import { UserEntity } from "../../db/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {Not, Repository} from "typeorm";
import {ChangeUserDto} from "../dto/user/changeUser.dto";
import {ErrorMessage} from "../constants/error-message";
import {UserInterface} from "../types/user.interface";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,) {}

  public async getOne(userId: number): Promise<UserInterface> {
    const user = await this.userRepository.findOne({where: {id: userId}});
    if(!user) throw new NotFoundException("Not Found", {description: Error().stack});
    return {user: user};
  }

  public async change(changeUserDto: ChangeUserDto, userId: number): Promise<UserInterface> {
    if(!await this.userRepository.exist({
      where: {id: userId}
    })) throw new BadRequestException(ErrorMessage.userNotFound, {description: Error().stack});
    else if(await this.userRepository.exist({
      where: {login: changeUserDto.login, id: Not(userId)}
    })) throw new BadRequestException(ErrorMessage.loginExists,{description: Error().stack});
    (changeUserDto.password) ?
        await this.userRepository.update(userId, {login: changeUserDto.login, password: changeUserDto.password}) :
        await this.userRepository.update(userId, {login: changeUserDto.login});
    const user = await this.userRepository.findOne({where: {id: userId}});
    return {user: user};
  }
}