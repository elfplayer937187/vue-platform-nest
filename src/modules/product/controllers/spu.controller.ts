import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SpuService } from '../services/spu.service';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { SaveSpuDto } from '../dto/save-spu-dto';

@ApiTags('商品SPU')
@ApiBearerAuth('Token')
@Controller('admin/product')
@UseGuards(JwtAuthGuard)
export class SpuController {
  constructor(private readonly spuService: SpuService) {}

  @Get('baseSaleAttrList')
  @ApiOperation({ summary: '获取销售属性字典列表' })
  async getBaseSaleAttrList() {
    return this.spuService.getBaseSaleAttrList();
  }

  @Post('saveSpuInfo')
  @ApiOperation({ summary: '新增SPU' })
  async saveSpuInfo(@Body() dto: SaveSpuDto) {
    console.log(dto);

    return this.spuService.SaveSpu(dto);
  }
}
