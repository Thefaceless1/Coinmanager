import {BeforeInsert, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcrypt'

@Entity({name: "users"})
export class UserEntity {
  @PrimaryGeneratedColumn({comment: "User id"})
  id: number

  @Column({comment: "User login"})
  login: string

  @Column({comment: "User email"})
  email: string

  @Column({ comment: "User password"})
  password: string

  @Column("timestamptz",{name: "create_date",default: new Date(),comment: "User creation date"})
  createDate: Date

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password,10);
  }
}