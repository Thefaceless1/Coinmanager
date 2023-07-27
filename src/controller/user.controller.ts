import {Controller, Get, Body, Put, UseGuards, Request} from "@nestjs/common";
import { UserService } from '../service/user.service';
import {ChangeUserDto} from "../dto/user/changeUser.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {UserInterface} from "../types/user.interface";
import {AuthGuard} from "../guards/auth.guard";

@Controller("api/user")
@ApiTags("User controller")
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  getOne(@Request() req: Request): Promise<UserInterface> {
    return this.UserService.getOne(req["user"].sub);
  }

  @Put("/change")
  change(@Body() changeUserDto: ChangeUserDto, @Request() req: Request ): Promise<UserInterface> {
    return this.UserService.change(changeUserDto,req["user"].sub);
  }
}
