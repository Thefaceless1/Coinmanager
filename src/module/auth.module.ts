import {Module} from "@nestjs/common";
import {AuthController} from "../controller/auth.controller";
import {AuthService} from "../service/auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../db/entity/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {jwtTokenConfig} from "../configs/jwtToken.config";
import {MailService} from "../service/mail.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            global: true,
            secret: jwtTokenConfig.privateKey,
            signOptions: {
                expiresIn: jwtTokenConfig.expireTime
            }})
    ],
    providers: [AuthService, MailService],
    controllers: [AuthController]
})
export class AuthModule {}