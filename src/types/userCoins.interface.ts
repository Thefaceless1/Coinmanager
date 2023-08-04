import {UserEntity} from "../../db/entity/user.entity";

export class UserCoinsInterface {
    user: Omit<UserEntity, "password" | "hashPassword" | "purchases">
}