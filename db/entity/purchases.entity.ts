import {Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {CoinEntity} from "./coin.entity";
import {UserEntity} from "./user.entity";

@Entity({name: "purchases"})
export class PurchasesEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        comment: "price per one coin",
        type: "float"
    })
    price: number

    @Column({
        name: "purchase_date",
        comment: "date of purchase",
        type: "date"
    })
    purchaseDate: Date

    @Column({
        comment: "number of coins",
        type: "float"
    })
    count: number

    @Column({
        comment: "total price of purchased coins",
        name: "total_price",
        type: "float"
    })
    totalPrice: number

    @ManyToOne(() => CoinEntity, coin => coin.id,{onDelete: "CASCADE"})
    @JoinColumn({name: "coin_id"})
    coin: CoinEntity

    @ManyToOne(() => UserEntity, user => user.id,{onDelete: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: UserEntity
}