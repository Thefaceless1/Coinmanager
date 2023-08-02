import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "coins", orderBy: {rank: "ASC"}})
export class CoinEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    rank: number

    @Column()
    name: string

    @Column()
    symbol: string

    @Column({type: "float"})
    price: number

    @Column({name: "market_cap",type: "int8"})
    marketCap: number

    @Column()
    image: string
}