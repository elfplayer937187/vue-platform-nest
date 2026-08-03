import {
  Controller,
  Param,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { TradeMarkService } from '../services/trademark.service';
import { CreateTrademarkDto } from '../dto/create-trademark.dto';
import { UpdateTrademarkDto } from '../dto/update-trademark.dto';

@Controller('admin/product/baseTrademark')
@ApiTags('品牌管理')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
export class TrademarkController {
  constructor(private readonly trademarkService: TradeMarkService) {}
  // 获取品牌分页列表
  @Get(':page/:limit')
  @ApiOperation({ summary: '获取品牌分页列表' })
  async getTrademarkPagination(
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    return this.trademarkService.getTrademarkPaginationList(page, limit);
  }

  @Get('getTrademarkList')
  @ApiOperation({ summary: '获取全部品牌列表' })
  async getAllList() {
    return this.trademarkService.getAllTradeMarkList();
  }

  @Post('save')
  @ApiOperation({ summary: '新增品牌' })
  async create(@Body() dto: CreateTrademarkDto) {
    return this.trademarkService.CreateTradeMark(dto);
  }

  @Put('update')
  @ApiOperation({ summary: '更新品牌' })
  async update(@Body() dto: UpdateTrademarkDto) {
    return this.trademarkService.UpdateTradeMark(dto);
  }

  @Delete('remove/:id')
  @ApiOperation({ summary: '删除品牌' })
  async remove(@Param('id') id: number) {
    return this.trademarkService.delete(id);
  }
}
