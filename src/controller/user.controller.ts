import {
  Controller,
  Get,
  Body,
  Put,
  UseGuards,
  Request,
  Delete,
  UsePipes,
  ValidationPipe,
  Post,
  Param
} from "@nestjs/common";
import { UserService } from '../service/user.service';
import {UpdateUserDto} from "../dto/user/updateUser.dto";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {UserInterface} from "../types/user.interface";
import {AuthGuard} from "../guards/auth.guard";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import {UpdateCoinsDto} from "../dto/user/updateCoins.dto";
import {UserCoinsInterface} from "../types/userCoins.interface";

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
  async change(@Body() updateUserDto: UpdateUserDto, @Request() req: Request ): Promise<ResponseStatusInterface> {
    return this.UserService.update(updateUserDto,req["user"].sub);
  }

  @Delete("/delete")
  async delete(@Request() req: Request): Promise<ResponseStatusInterface> {
    return this.UserService.delete(req["user"].sub);
  }

  @Post("/coins/update")
  @UsePipes(new ValidationPipe())
  async addCoins(@Body() updateCoinsDto: UpdateCoinsDto, @Request() req: Request): Promise<ResponseStatusInterface> {
    return this.UserService.updateCoins(req["user"].sub, updateCoinsDto);
  }

  @Get("/coins")
  async userCoins(@Request() req: Request): Promise<UserCoinsInterface> {
    return this.UserService.userCoins(req["user"].sub);
  }

  @Delete("/coins/delete/:coinId")
  async deleteUserCoins(@Request() req: Request, @Param("coinId") coinId: number): Promise<ResponseStatusInterface> {
    return this.UserService.deleteUserCoins(coinId,req["user"].sub)
  }
}
