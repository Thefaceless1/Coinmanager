import {Module} from "@nestjs/common";
import {AuthController} from "../controller/auth.controller";
import {AuthService} from "../service/auth.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../db/entity/user.entity";
import {JwtModule} from "@nestjs/jwt";
import {jwtToken} from "../constants/jwtToken";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            global: true,
            secret: jwtToken.privateKey,
            signOptions: {
                expiresIn: jwtToken.expireTime
            }})
    ],
    providers: [AuthService],
    controllers: [AuthController]
})
export class AuthModule {}