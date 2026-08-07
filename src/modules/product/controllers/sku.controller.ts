import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkuService } from '../services/sku.service';
import { JwtAuthGuard } from '../../auth/auth.guard';

@ApiTags('商品SKU')
@ApiBearerAuth('Token')
@Controller('admin/product')
@UseGuards(JwtAuthGuard)
export class SkuController {
  constructor(private readonly skuService: SkuService) {}

  @Get('list/:page/:limit')
  @ApiOperation({ summary: 'SKU 分页列表' })
  async getList(@Param('page') page: number, @Param('limit') limit: number) {
    return this.skuService.getSkuPagination(+page, +limit);
  }

  @Get('findBySpuId/:id')
  @ApiOperation({ summary: '根据 SPU ID 查询 SKU 列表' })
  async findBySpuId(@Param('id') id: number) {
    return this.skuService.findSkuBySpuId(id);
  }

  @Get('onSale/:id')
  @ApiOperation({ summary: '上架 SKU' })
  async onSale(@Param('id') id: number) {
    return this.skuService.OnSaleSku(id);
  }

  @Get('cancelSale/:id')
  @ApiOperation({ summary: '下架 SKU' })
  async cancelSale(@Param('id') id: number) {
    return this.skuService.CancelSaleSku(id);
  }
}
