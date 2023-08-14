import {Controller, Post, UseGuards, Request, Body, UsePipes, ValidationPipe} from "@nestjs/common";
import {AuthGuard} from "../guards/auth.guard";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {StakingService} from "../service/staking.service";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import {AddStakingDto} from "../dto/staking/addStaking.dto";

@Controller({path: "/api/staking"})
@UseGuards(AuthGuard)
@ApiTags("Staking controller")
@ApiBearerAuth()
export class StakingController {
    constructor(private readonly stakingService: StakingService) {}

    @Post("/add")
    @UsePipes(new ValidationPipe())
    async addStaking(
        @Request() req: Request,
        @Body() addStakingDto: AddStakingDto
    ): Promise<ResponseStatusInterface> {
        return this.stakingService.addStaking(req["user"].sub, addStakingDto);
    }
}