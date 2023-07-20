import { Controller, Get, Param, Post, Body, NotFoundException } from "@nestjs/common";
import { UserService } from '../service/user.service';
import { CreateUserDto } from "../dto/user/create-user.dto";
import { UserEntity } from "../entity/user.entity";

@Controller("api/users")
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Get()
  async getAll(): Promise<UserEntity[]> {
    return this.UserService.getAll();
  }

  @Get(":id")
  async getOne(@Param("id") id: number): Promise<UserEntity> {
    const result = await this.UserService.getOne(id);
    if(!result) throw new NotFoundException("Not Found",{description: Error().stack});
    return result;
  }

  @Post("/create")
  async create(@Body() createUserDto: CreateUserDto) {

  }
}
