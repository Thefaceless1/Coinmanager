import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {PurchasesEntity} from "./purchases.entity";

@Entity({name: "coins", orderBy: {rank: "ASC"}})
export class CoinEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({comment: "coin rank"})
    rank: number

    @Column({comment: "coin name"})
    name: string

    @Column({comment: "coin name"})
    symbol: string

    @Column({
        type: "float",
        comment: "current coin price"
    })
    price: number

    @Column({
        name: "market_cap",
        type: "int8",
        comment: "market cap volume"
    })
    marketCap: number

    @Column({comment: "coin icon"})
    image: string

    @OneToMany(() => PurchasesEntity, purchase => purchase.id, {cascade: true})
    purchases: PurchasesEntity[]
}