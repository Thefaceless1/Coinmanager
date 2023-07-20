import { Injectable } from "@nestjs/common";
import { UserEntity } from "../entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GetUserDto } from "../dto/user/get-user.dto";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
  }
  public async getAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      select: {
        id: true,
        login: true,
        email: true,
        createDate: true
      }})
  }

  public async getOne(userId: number): Promise<UserEntity> {
    return this.userRepository.findOneBy({id: userId});
  }
}