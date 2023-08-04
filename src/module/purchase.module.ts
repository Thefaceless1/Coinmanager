import {Module} from "@nestjs/common";
import {PurchaseService} from "../service/purchase.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PurchasesEntity} from "../../db/entity/purchases.entity";

@Module({
    imports: [TypeOrmModule.forFeature([PurchasesEntity])],
    providers: [PurchaseService],
    controllers: []
})
export class PurchaseModule {}