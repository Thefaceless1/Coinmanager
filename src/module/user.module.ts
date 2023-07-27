import { Module } from "@nestjs/common";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { UserEntity } from "../../db/entity/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import {AuthGuard} from "../guards/auth.guard";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [UserService, AuthGuard]
})
export class UserModule {}