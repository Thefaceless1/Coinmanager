import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity({name: "coins"})
export class CoinEntity {

    @PrimaryColumn()
    id: number

    @Column()
    rank: number

    @Column()
    name: string

    @Column()
    symbol: string

    @Column({type: "float"})
    price: number
}