import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import { UserEntity } from "../../db/entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {Not, Repository} from "typeorm";
import {LoginUserDto} from "../dto/user/loginUser.dto";
import {CreateUserDto} from "../dto/user/createUser.dto";
import {ChangeUserDto} from "../dto/user/changeUser.dto";
import {ErrorMessage} from "../utils/error-message";
import * as bcrypt from 'bcrypt'
import {LoginUserInterface} from "../types/loginUser.interface";
import {UserInterface} from "../types/user.interface";
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
      private readonly jwtService: JwtService
  ) {}

  public async getOne(userId: number): Promise<UserInterface> {
    const user = await this.userRepository.findOne({where: {id: userId}});
    if(!user) throw new NotFoundException("Not Found", {description: Error().stack});
    return {user: user};
  }

  public async register(createUserDto: CreateUserDto): Promise<LoginUserInterface> {
    const userEntity = new UserEntity();
    Object.assign(userEntity, createUserDto);
    if(await this.userRepository.exist({
      where: [
        {login: userEntity.login},
        {email: userEntity.email}
      ]
    })) throw new HttpException(ErrorMessage.userExists, HttpStatus.UNPROCESSABLE_ENTITY);
    const user = await this.userRepository.save(userEntity);
    const payload = {sub: user.id, username: user.login};
    return {
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        createDate: user.createDate,
        token: await this.jwtService.signAsync(payload)
      }
    }
  }

  public async login(loginUserDto: LoginUserDto): Promise<LoginUserInterface> {
    const user = await this.userRepository.findOne({
      select: ["id","login","email","createDate","password"],
      where: {login: loginUserDto.login}
    });
    if(!user || !await bcrypt.compare(loginUserDto.password,user.password)){
      throw new BadRequestException(ErrorMessage.userNotFound, {description: Error().stack});
    }
    const payload = {sub: user.id, username: user.login};
    return {
      user: {
        id: user.id,
        login: user.login,
        email: user.email,
        createDate: user.createDate,
        token: await this.jwtService.signAsync(payload)
      }
    }
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