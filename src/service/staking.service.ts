import {BadRequestException, Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {StakingEntity} from "../../db/entity/staking.entity";
import {Repository} from "typeorm";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import {ResponseMessage} from "../response.message";
import {AddStakingDto} from "../dto/staking/addStaking.dto";
import {UserEntity} from "../../db/entity/user.entity";
import {CoinEntity} from "../../db/entity/coin.entity";

@Injectable()
export class StakingService {
    constructor(
        @InjectRepository(StakingEntity) private readonly stakingRepository: Repository<StakingEntity>,
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(CoinEntity) private readonly coinRepository: Repository<CoinEntity>
    ) {}

    public async addStaking(userId: number, addStakingDto: AddStakingDto): Promise<ResponseStatusInterface> {
        const coin: CoinEntity = await this.coinRepository.findOne({where: {id: addStakingDto.coinId}});
        const checkExistingStaking: boolean = await this.stakingRepository.
        createQueryBuilder("staking").
        where("user_id = :userId", {userId: userId}).
        andWhere("coin_id = :coinId",{coinId: addStakingDto.coinId}).
        getExists()
        if(checkExistingStaking) throw new BadRequestException(ResponseMessage.stakingExists);
        if(!coin) throw new NotFoundException(ResponseMessage.coinDoesNotExists);
        const staking: StakingEntity = new StakingEntity();
        const user: UserEntity = await this.userRepository.findOne({where: {id: userId}});
        Object.assign(staking,addStakingDto);
        staking.user = user;
        staking.coin = coin;
        await this.stakingRepository.save(staking);
        return {status: ResponseMessage.success}
    }
}