import {Module} from "@nestjs/common";
import {PurchaseService} from "../service/purchase.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PurchasesEntity} from "../../db/entity/purchases.entity";
import {PurchaseController} from "../controller/purchase.controller";
import {CoinEntity} from "../../db/entity/coin.entity";
import {UserEntity} from "../../db/entity/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PurchasesEntity, CoinEntity, UserEntity])],
    providers: [PurchaseService],
    controllers: [PurchaseController]
})
export class PurchaseModule {}