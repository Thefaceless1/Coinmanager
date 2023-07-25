import { Controller, Get } from '@nestjs/common';
import { AppService } from '../service/app.service';
import {ApiExcludeController} from "@nestjs/swagger";

@Controller()
@ApiExcludeController()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return new Date().toUTCString();
  }
}
