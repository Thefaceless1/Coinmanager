import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";
import {CoinController} from "../controller/coin.controller";
import {CoinService} from "../service/coin.service";
import {HttpModule} from "@nestjs/axios";
import {UserEntity} from "../../db/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CoinEntity, UserEntity]),HttpModule],
    controllers: [CoinController],
    providers: [CoinService]
})
export class CoinModule {}