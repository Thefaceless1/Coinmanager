import {UserEntity} from "../../db/entity/user.entity";

export interface LoginUserInterface {
    user: Omit<UserEntity, "hashPassword" | "password" | "coins" | "staking" | "purchases"> & {token: string};
}