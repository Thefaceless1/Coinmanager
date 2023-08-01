import {BeforeInsert, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import * as bcrypt from 'bcrypt'
import {CoinEntity} from "./coin.entity";

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

  @ManyToMany(() => CoinEntity,{cascade: true})
  @JoinTable({
    name: "users_coins",
    joinColumn: {
      name: "user_id"
    },
    inverseJoinColumn: {
      name: "coin_id"
    }})
  coins: CoinEntity[]

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password,10);
  }
}