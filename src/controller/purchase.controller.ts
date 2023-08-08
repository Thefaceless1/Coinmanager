import {Body, Controller, Post, UseGuards, UsePipes, Request, ValidationPipe} from "@nestjs/common";
import {AddPurchaseDto} from "../dto/purchase/addPurchase.dto";
import {AuthGuard} from "../guards/auth.guard";
import {PurchaseService} from "../service/purchase.service";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import {ApiTags} from "@nestjs/swagger";

@Controller("api/purchase")
@UseGuards(AuthGuard)
@ApiTags("Purchase controller")
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post("/add")
    @UsePipes(new ValidationPipe())
    async addPurchase(
        @Body() addPurchaseDto: AddPurchaseDto,
        @Request() req: Request): Promise<ResponseStatusInterface> {
        return this.purchaseService.addPurchase(addPurchaseDto, req["user"].sub);
    }
}