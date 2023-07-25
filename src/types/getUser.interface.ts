import {UserEntity} from "../../db/entity/user.entity";

export interface GetUserInterface {
    readonly user: Omit<UserEntity, "hashPassword" | "password"> & {token: string}
}