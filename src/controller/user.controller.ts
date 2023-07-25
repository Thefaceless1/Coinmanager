import {Controller, Get, Param, Post, Body, Put, ValidationPipe, UsePipes} from "@nestjs/common";
import { UserService } from '../service/user.service';
import { UserEntity } from "../../db/entity/user.entity";
import {LoginUserDto} from "../dto/user/loginUser.dto";
import {CreateUserDto} from "../dto/user/createUser.dto";
import {ChangeUserDto} from "../dto/user/changeUser.dto";
import {GetUserInterface} from "../types/getUser.interface";
import {ApiTags} from "@nestjs/swagger";

@Controller("api/users")
@ApiTags("User controller")
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  getAll(): Promise<UserEntity[]> {
    return this.UserService.getAll();
  }

  @Get(":id")
  getOne(@Param("id") id: number): Promise<UserEntity> {
    return this.UserService.getOne(id);
  }

  @Post("/register")
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto): Promise<GetUserInterface> {
    return this.UserService.register(createUserDto)
  }

  @Post("/login")
  @UsePipes(new ValidationPipe())
  login(@Body() loginUserDto: LoginUserDto): Promise<GetUserInterface> {
    return this.UserService.login(loginUserDto);
  }

  @Put(":id/change")
  change(@Body() changeUserDto: ChangeUserDto, @Param("id") id: number): Promise<UserEntity> {
    return this.UserService.change(changeUserDto,id);
  }
}
