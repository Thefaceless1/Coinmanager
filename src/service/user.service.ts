import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import { UserEntity } from "../../db/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {Not, Repository} from "typeorm";
import {LoginUserDto} from "../dto/user/loginUser.dto";
import {CreateUserDto} from "../dto/user/createUser.dto";
import {ChangeUserDto} from "../dto/user/changeUser.dto";
import {ErrorMessage} from "../utils/error-message";
import * as bcrypt from 'bcrypt'
import {sign} from "jsonwebtoken";
import {GetUserInterface} from "../types/getUser.interface";
import {privateKey} from "../utils/private.key";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
  }

  public async getAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      select: {
        id: true,
        login: true,
        email: true,
        createDate: true
      },
      order: {id: "ASC"}
    })
  }

  public async getOne(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      select: {
        id: true,
        login: true,
        email: true,
        createDate: true
      }, where: {
        id: userId
      }
    });
    if(!user) throw new NotFoundException("Not Found", {description: Error().stack});
    return user;
  }

  public async register(createUserDto: CreateUserDto): Promise<GetUserInterface> {
    const userEntity = new UserEntity();
    Object.assign(userEntity, createUserDto);
    if (await this.userRepository.exist({
      where: [
        {login: userEntity.login},
        {email: userEntity.email}
      ]
    })) throw new HttpException(ErrorMessage.userExists, HttpStatus.UNPROCESSABLE_ENTITY);
    const user = await this.userRepository.save(userEntity);
    return {
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        createDate: user.createDate,
        token: this.generateJwtToken(user)
      }
    }
  }

  private generateJwtToken(user: UserEntity): string {
    const timeToExpire: string = "1d";
    return sign({
      id: user.id,
      login: user.login,
      email: user.email
    },privateKey,{expiresIn: timeToExpire});
  }

  public async login(loginUserDto: LoginUserDto): Promise<GetUserInterface> {
    const user = await this.userRepository.findOne({
      where: {
        login: loginUserDto.login
      }
    });
    if(!user || !await bcrypt.compare(loginUserDto.password,user.password)){
      throw new BadRequestException(ErrorMessage.userNotFound, {description: Error().stack});
    }
    return {
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        createDate: user.createDate,
        token: this.generateJwtToken(user)
      }
    }
  }

  public async change(changeUserDto: ChangeUserDto, userId: number): Promise<UserEntity> {
    if(!await this.userRepository.exist({
      where: {id: userId}
    })) throw new BadRequestException(ErrorMessage.userNotFound, {description: Error().stack});
    else if(await this.userRepository.exist({
      where: {login: changeUserDto.login, id: Not(userId)}
    })) throw new BadRequestException(ErrorMessage.loginExists,{description: Error().stack});
    (changeUserDto.password) ?
        await this.userRepository.update(userId, {login: changeUserDto.login, password: changeUserDto.password}) :
        await this.userRepository.update(userId, {login: changeUserDto.login});
    return this.userRepository.findOne({
      select: {
        id: true,
        login: true,
        email: true,
        createDate: true
      }, where: {
        id: userId
      }
    });
  }
}