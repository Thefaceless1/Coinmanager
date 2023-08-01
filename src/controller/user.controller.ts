import {Controller, Get, Body, Put, UseGuards, Request, Delete, UsePipes, ValidationPipe, Post} from "@nestjs/common";
import { UserService } from '../service/user.service';
import {UpdateUserDto} from "../dto/user/updateUser.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {UserInterface} from "../types/user.interface";
import {AuthGuard} from "../guards/auth.guard";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import {AddCoinsDto} from "../dto/user/addCoins.dto";

@Controller("api/user")
@ApiTags("User controller")
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  async getOne(@Request() req: Request): Promise<UserInterface> {
    return this.UserService.getOne(req["user"].sub);
  }

  @Put("/update")
  @UsePipes(new ValidationPipe())
  async change(@Body() updateUserDto: UpdateUserDto, @Request() req: Request ): Promise<UserInterface> {
    return this.UserService.update(updateUserDto,req["user"].sub);
  }

  @Delete("/delete")
  async delete(@Request() req: Request): Promise<ResponseStatusInterface> {
    return this.UserService.delete(req["user"].sub);
  }

  @Post("/addCoins")
  @UsePipes(new ValidationPipe())
  async addCoins(@Body() addCoinsDto: AddCoinsDto,@Request() req: Request) {
    return this.UserService.addCoins(req["user"].sub, addCoinsDto);
  }
}
