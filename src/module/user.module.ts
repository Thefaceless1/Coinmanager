import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { UserEntity } from "../../db/entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import {JwtModule} from "@nestjs/jwt";
import {privateKey} from "../utils/private.key";
import {AuthGuard} from "../guards/auth.guard";

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity]),
      JwtModule.register({
        global: true,
        secret: privateKey,
        signOptions: {expiresIn: "1d"
        }})
  ],
  controllers: [UserController],
  providers: [UserService, AuthGuard]
})
export class UserModule {}