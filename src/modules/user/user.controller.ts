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

  // 获取用户分页列表
  @Get(':page/:limit')
  @ApiOperation({ summary: '用户分页列表' })
  @ApiQuery({
    name: 'username',
    required: false,
    description: '用户名模糊搜索',
  })
  async GetUserPagination(
    @Param('page') page: number,
    @Param('limit') limit: number,
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
  async BatchRemoveUser(@Body() deleteIdList: number[]) {
    await this.userService.BatchDeleteUser(deleteIdList);
    return null;
  }
}
