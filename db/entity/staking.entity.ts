import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";
import {CoinEntity} from "./coin.entity";
import {StakingStatsInterface} from "../../src/types/stakingStats.interface";

@Entity({name: "staking"})
export class StakingEntity {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        comment: "staking percent",
        type: "float"
    })
    percent: number

    @Column({
        comment: "coins count",
        type: "float"
    })
    count: number

    @ManyToOne(() => UserEntity, user => user.id,{onDelete: "CASCADE"})
    @JoinColumn({name: "user_id"})
    user: UserEntity

    @ManyToOne(() => CoinEntity,coin => coin.id, {onDelete: "CASCADE"})
    @JoinColumn({name: "coin_id"})
    coin: CoinEntity

    stakingStats: StakingStatsInterface
}