import {
  Controller,
  UseGuards,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@ApiTags('菜单管理')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
@Controller('admin/acl/permission')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: '获取所有菜单(树形结构)' })
  async GetAllMenu() {
    return await this.menuService.GetTreeMenuList();
  }

  @Post('save')
  @ApiOperation({ summary: '新增菜单' })
  async CreateMenu(@Body() dto: CreateMenuDto) {
    return await this.menuService.CreateMenu(dto);
  }

  @Put('update')
  @ApiOperation({ summary: '更新菜单' })
  async UpdateMenu(@Body() dto: UpdateMenuDto) {
    return await this.menuService.UpdateMenu(dto);
  }

  @Delete('remove/:id')
  @ApiOperation({ summary: '删除菜单' })
  async DeleteMenu(@Param('id', ParseIntPipe) id: number) {
    return await this.menuService.RemoveMenu(id);
  }
}
