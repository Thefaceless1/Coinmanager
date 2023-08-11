import {Body, Controller, Post, UseGuards, UsePipes, Request, ValidationPipe, Put, Param} from "@nestjs/common";
import {AddPurchaseDto} from "../dto/purchase/addPurchase.dto";
import {AuthGuard} from "../guards/auth.guard";
import {PurchaseService} from "../service/purchase.service";
import {ResponseStatusInterface} from "../types/responseStatus.interface";
import {ApiBearerAuth, ApiOperation, ApiTags} from "@nestjs/swagger";
import {UpdatePurchaseDto} from "../dto/purchase/updatePurchase.dto";

@Controller("api/purchase")
@UseGuards(AuthGuard)
@ApiBearerAuth()
@ApiTags("Purchase controller")
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post("/add")
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: "Add a new purchase"})
    async addPurchase(
        @Body() addPurchaseDto: AddPurchaseDto,
        @Request() req: Request
    ): Promise<ResponseStatusInterface> {
        return this.purchaseService.addPurchase(addPurchaseDto, req["user"].sub);
    }

    @Put("/:purchaseId/update")
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: "Update a purchase data"})
    async updatePurchase(
        @Body() updatePurchaseDto: UpdatePurchaseDto,
        @Param("purchaseId") purchaseId: number,
        @Request() req: Request
    ): Promise<ResponseStatusInterface> {
        return this.purchaseService.updatePurchase(updatePurchaseDto, purchaseId, req["user"].sub);
    }
}