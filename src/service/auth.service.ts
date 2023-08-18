import {BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../db/entity/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import {CreateUserDto} from "../dto/user/createUser.dto";
import {LoginUserInterface} from "../types/loginUser.interface";
import {ResponseMessage} from "../response.message";
import {LoginUserDto} from "../dto/user/loginUser.dto";
import * as bcrypt from "bcrypt";
import {MailService} from "./mail.service";
import {RestorePasswordDto} from "../dto/auth/restorePassword.dto";
import {ResponseStatusInterface} from "../types/responseStatus.interface";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ) {}

    public async register(createUserDto: CreateUserDto): Promise<LoginUserInterface> {
        const userEntity = new UserEntity();
        Object.assign(userEntity, createUserDto);
        if(await this.userRepository.exist({
            where: [
                {login: userEntity.login},
                {email: userEntity.email}
            ]
        })) throw new HttpException(ResponseMessage.userExists, HttpStatus.UNPROCESSABLE_ENTITY);
        const user = await this.userRepository.save(userEntity);
        const payload = {
            sub: user.id,
            username: user.login
        };
        delete user.password;//@ts-ignore
        return {
            user: {
                ...user,
                token: await this.jwtService.signAsync(payload)
            }
        }
    }

    public async login(loginUserDto: LoginUserDto): Promise<LoginUserInterface> {
        const user: UserEntity = await this.userRepository.findOne({
            where: {
                login: loginUserDto.login
            }
        });
        if(!user) throw new NotFoundException(ResponseMessage.userNotFound);
        const userPassword: string = (await this.userRepository.findOne({
            select: ['password'],
            where: {
                login: loginUserDto.login
            }
        })).password;
        if(!await bcrypt.compare(loginUserDto.password,userPassword)) {
            throw new BadRequestException(ResponseMessage.invalidPassword);
        }
        const payload = {
            sub: user.id,
            username: user.login
        };//@ts-ignore
        return {
            user: {
                ...user,
                token: await this.jwtService.signAsync(payload)
            }
        }
    }

    public async restorePassword(restorePasswordDto: RestorePasswordDto): Promise<ResponseStatusInterface> {
        if(!await this.userRepository.exist({
            where: {
                email: restorePasswordDto.email
            }
        })) throw new NotFoundException(ResponseMessage.userNotFound);
        await this.mailService.sendMail(restorePasswordDto.email);
        return {status: "SUCCESS"};
    }
}