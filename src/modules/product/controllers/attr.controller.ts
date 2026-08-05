import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { AttrService } from '../services/attr.service';
import { SaveAttrDto } from '../dto/save-attr.dto';

@Controller('admin/pruduct')
@ApiTags('商品属性')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
export class AttrController {
  constructor(private readonly attrService: AttrService) {}

  @Post('saveAttrInfo')
  @ApiOperation({ summary: '新增/更新属性（有id→更新，无id→新增）' })
  async SaveAttrInfo(@Body() dto: SaveAttrDto) {
    if (dto.id) {
      return this.attrService.updateAttr(dto);
    } else {
      return this.attrService.createAttr(dto);
    }
  }

  @Get('attrInfoList/:c1Id/:c2Id/:c3Id')
  @ApiOperation({ summary: '获取指定分类下的属性列表（含属性值）' })
  async getAttrList(
    @Param('c1Id') c1Id: number,
    @Param('c2Id') c2Id: number,
    @Param('c3Id') c3Id: number,
  ) {
    return this.attrService.GetAttrList(c1Id, c2Id, c3Id);
  }

  @Delete('deleteAttr/:attrId')
  @ApiOperation({ summary: '删除属性（级联删除属性值）' })
  async deleteAttr(@Param('attrId') attrId: number) {
    return this.attrService.deleteAttr(attrId);
  }
}
