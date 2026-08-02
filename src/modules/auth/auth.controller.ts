import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from '../user/dto/login.dto';
import { JwtAuthGuard } from './auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('后台登录和菜单管理')
@Controller('admin/acl/index')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: '用户登录接口' })
  async login(@Body() userDto: LoginDTO) {
    return await this.authService.login(userDto);
  }

  @Get('info')
  @ApiOperation({ summary: '获取用户登录信息' })
  @ApiBearerAuth('Token')
  @UseGuards(JwtAuthGuard)
  async GetUserInfo(@CurrentUser('userId') userId: number) {
    console.log(userId);

    return await this.authService.getUserInfo(userId);
  }

  // 用户登出接口
  @Post('logout')
  @ApiOperation({ summary: '用户登出接口' })
  // 只需要前端清除token就行
  logout() {
    return null;
  }
}
