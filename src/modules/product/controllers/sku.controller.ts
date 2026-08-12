import {
  Controller,
  Get,
  Param,
  UseGuards,
  Post,
  Body,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkuService } from '../services/sku.service';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { SaveSkuDto } from '../dto/save-sku.dto';

@Controller('admin/product')
@ApiTags('商品SKU')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
export class SkuController {
  constructor(private readonly skuService: SkuService) {}

  @Get('findBySpuId/:id')
  @ApiOperation({ summary: '根据 SPU ID 查询 SKU 列表' })
  async findBySpuId(@Param('id', ParseIntPipe) id: number) {
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

  @Get('list/:page/:limit')
  @ApiOperation({ summary: 'SKU 分页列表' })
  async getList(@Param('page') page: number, @Param('limit') limit: number) {
    return this.skuService.getSkuPagination(+page, +limit);
  }

  @Post('saveSkuInfo')
  @ApiOperation({ summary: '新增 SKU' })
  async saveSkuInfo(@Body() dto: SaveSkuDto) {
    console.log(dto);

    return this.skuService.SaveSku(dto);
  }

  @Get('getSkuInfo/:id')
  @ApiOperation({ summary: '获取 SKU 详情' })
  async getSkuInfo(@Param('id') id: number) {
    return this.skuService.getSkuInfo(id);
  }

  @Delete('deleteSku/:id')
  @ApiOperation({ summary: '删除 SKU' })
  async deleteSku(@Param('id') id: number) {
    return this.skuService.deleteSku(id);
  }
}
