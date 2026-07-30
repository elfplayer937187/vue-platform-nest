import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@ApiTags('角色管理')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
@Controller('admin/acl/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // 获取分页列表
  @ApiOperation({ summary: '获取角色分页列表' })
  @ApiQuery({
    name: 'roleName',
    required: false,
    description: '角色名称模糊搜索',
    example: 'elf',
  })
  @Get(':page/:limit')
  async GetRolePagination(
    @Param('page') page: number,
    @Param('limit') limit: number,
    @Query('roleName') roleName?: string,
  ) {
    return await this.roleService.GetRolePagination(roleName, page, limit);
  }

  // 新增角色
  @ApiOperation({ summary: '新增角色' })
  @Post('save')
  async CreateRole(@Body() dto: CreateRoleDto) {
    return this.roleService.CreateRole(dto);
  }

  //更新角色
  @ApiOperation({ summary: '更新角色' })
  @Put('update')
  async UpdateRole(@Body() dto: UpdateRoleDto) {
    return await this.roleService.UpdateRole(dto);
  }

  // 删除角色
  @ApiOperation({ summary: '删除角色' })
  @Delete('remove/:id')
  async RemoveRole(@Param('id') roleId: number) {
    return await this.roleService.DeleteRole(roleId);
  }
}
