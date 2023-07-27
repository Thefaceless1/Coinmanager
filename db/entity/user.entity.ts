import {BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcrypt'

@Entity({name: "users",orderBy: {id: "ASC"}})
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  login: string

  @Column()
  email: string

  @Column({select: false})
  password: string

  @CreateDateColumn({name: "create_date",type: "timestamptz"})
  createDate: Date

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password,10);
  }
}