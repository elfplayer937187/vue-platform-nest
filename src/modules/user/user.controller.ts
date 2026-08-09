import {
  Controller,
  UseGuards,
  Post,
  Body,
  Get,
  Param,
  Query,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-user.dto';
import { BatchRemoveDto } from './dto/batch-remove.dto';

@ApiTags('用户管理')
@Controller('admin/acl/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Token')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('save')
  @ApiOperation({ summary: '用户新增接口' })
  async AddUser(@Body() dto: CreateUserDTO) {
    await this.userService.createUser(dto);
  }

  // 查看用户分配 - 放到通用路由前面，避免被 :page/:limit 截胡
  @ApiOperation({ summary: '查看用户分配的角色id' })
  @Get('toAssign/:id')
  async CheckUserRoles(@Param('id', ParseIntPipe) id: number) {
    console.log(111);

    return await this.userService.CheckUserRoles(id);
  }

  // 获取用户分页列表
  @Get(':page/:limit')
  @ApiOperation({ summary: '用户分页列表' })
  @ApiQuery({
    name: 'username',
    required: false,
    description: '用户名模糊搜索',
  })
  async GetUserPagination(
    @Param('page', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
    // 不一定要username
    @Query('username') username?: string,
  ) {
    return await this.userService.getUserPaginaton(username, page, limit);
  }

  // 更新用户
  @Put('update')
  @ApiOperation({ summary: '更新用户' })
  async UpdateUser(@Body() dto: UpdateUserDto) {
    await this.userService.UpdateUser(dto);
  }

  // 删除单个用户
  @Delete('remove/:id')
  @ApiOperation({ summary: '删除单个用户' })
  async DeleteUser(@Param('id') id: number) {
    await this.userService.DeleteUser(id);
    return null;
  }

  // 批量删除用户
  @Delete('batchRemove')
  @ApiOperation({ summary: '批量删除用户' })
  async BatchRemoveUser(@Body() dto: BatchRemoveDto) {
    await this.userService.BatchDeleteUser(dto.idList);
    return null;
  }

  // 为用户分配角色
  @Post('doAssignRole')
  @ApiOperation({ summary: '为用户分配角色' })
  async AssignRolesForUser(@Body() dto: AssignRoleDto) {
    return await this.userService.AssignRolesForUser(dto);
  }
}
