import {Module} from "@nestjs/common";
import {TasksService} from "../service/tasks.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CoinEntity} from "../../db/entity/coin.entity";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [TypeOrmModule.forFeature([CoinEntity]),HttpModule],
    providers: [TasksService]
})
export class TasksModule {}
