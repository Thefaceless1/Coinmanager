import {UserEntity} from "../../db/entity/user.entity";

export class UserInterface {
    user: Omit<UserEntity, "password" | "hashPassword">
}