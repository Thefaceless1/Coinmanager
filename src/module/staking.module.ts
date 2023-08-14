import {Module} from "@nestjs/common";
import {StakingController} from "../controller/staking.controller";
import {StakingService} from "../service/staking.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {StakingEntity} from "../../db/entity/staking.entity";
import {UserEntity} from "../../db/entity/user.entity";
import {CoinEntity} from "../../db/entity/coin.entity";

@Module({
    controllers: [StakingController],
    providers: [StakingService],
    imports: [TypeOrmModule.forFeature([StakingEntity, UserEntity, CoinEntity])],
    exports: []
})
export class StakingModule {}