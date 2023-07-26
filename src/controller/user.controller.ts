import {Controller, Get, Param, Post, Body, Put, ValidationPipe, UsePipes, UseGuards, Request} from "@nestjs/common";
import { UserService } from '../service/user.service';
import {LoginUserDto} from "../dto/user/loginUser.dto";
import {CreateUserDto} from "../dto/user/createUser.dto";
import {ChangeUserDto} from "../dto/user/changeUser.dto";
import {LoginUserInterface} from "../types/loginUser.interface";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {UserInterface} from "../types/user.interface";
import {AuthGuard} from "../guards/auth.guard";

@Controller("api/user")
@ApiTags("User controller")
@ApiBearerAuth()
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  getOne(@Request() req: Request): Promise<UserInterface> {
    return this.UserService.getOne(req["user"].sub);
  }

  @Post("/register")
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto): Promise<LoginUserInterface> {
    return this.UserService.register(createUserDto)
  }

  @Post("/login")
  @UsePipes(new ValidationPipe())
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserInterface> {
    return this.UserService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Put(":id/change")
  change(@Body() changeUserDto: ChangeUserDto, @Param("id") id: number): Promise<UserInterface> {
    return this.UserService.change(changeUserDto,id);
  }
}
