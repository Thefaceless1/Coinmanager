import { Module } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { AppService } from '../service/app.service';
import { UserModule } from "./user.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import config from "../../ormconfig";

@Module({
  imports: [TypeOrmModule.forRoot(config),UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
