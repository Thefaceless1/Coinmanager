import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";
import {CoinController} from "../controller/coin.controller";
import {CoinService} from "../service/coin.service";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [TypeOrmModule.forFeature([CoinEntity]),HttpModule],
    controllers: [CoinController],
    providers: [CoinService]
})
export class CoinModule {}