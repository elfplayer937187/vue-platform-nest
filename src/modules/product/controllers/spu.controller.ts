import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Param,
  Query,
  ParseIntPipe,
  Put,
  Delete,
} from '@nestjs/common';
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
    return this.spuService.SaveSpu(dto);
  }
  @Get('spuImageList/:id')
  @ApiOperation({ summary: '获取 SPU 图片列表' })
  async getSpuImageList(@Param('id') id: number) {
    return this.spuService.GetImages(id);
  }

  @Get('spuSaleAttrList/:id')
  @ApiOperation({ summary: '获取 SPU 销售属性列表' })
  async getSpuSaleAttrList(@Param('id') id: number) {
    return this.spuService.getSpuAttrList(id);
  }

  @Put('updateSpuInfo')
  @ApiOperation({ summary: '更新 SPU' })
  async updateSpuInfo(@Body() dto: SaveSpuDto) {
    return this.spuService.updateSpu(dto);
  }

  @Delete('deleteSpu/:id')
  @ApiOperation({ summary: '删除 SPU' })
  async deleteSpu(@Param('id') id: number) {
    return this.spuService.removeSpu(id);
  }
  @Get(':page/:limit')
  @ApiOperation({ summary: '获取spu分页列表' })
  async getSpuPagination(
    @Param('page', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
    @Query('category3Id') category3Id: number,
  ) {
    return this.spuService.GetSpuPagination(category3Id, page, limit);
  }
}
