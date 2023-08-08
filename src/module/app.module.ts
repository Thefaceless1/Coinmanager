import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { UserModule } from "./user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "../../db/ormconfig";
import {CoinModule} from "./coin.module";
import {ScheduleModule} from "@nestjs/schedule";
import {TasksModule} from "./tasks.module";
import {AuthModule} from "./auth.module";
import {MailerModule} from "@nestjs-modules/mailer";
import {mailerConfig} from "../configs/mailer.config";
import {PurchaseModule} from "./purchase.module";

@Module({
  imports: [
      TypeOrmModule.forRoot(config),
      ScheduleModule.forRoot(),
      MailerModule.forRoot(mailerConfig),
      TasksModule,
      UserModule,
      CoinModule,
      AuthModule,
      PurchaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
