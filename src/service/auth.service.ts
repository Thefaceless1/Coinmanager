import {BadRequestException, HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../db/entity/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {CreateUserDto} from "../dto/user/createUser.dto";
import {LoginUserInterface} from "../types/loginUser.interface";
import {ErrorMessage} from "../constants/error-message";
import {LoginUserDto} from "../dto/user/loginUser.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) {}

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
}