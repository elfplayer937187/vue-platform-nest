import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';

// @ApiTags('App控制器')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  // @ApiOperation({ summary: '健康检查' })
  // @Get('/health')
  // getHello(): string {
  //   return this.configService.get('jwt.expireIn')!;
  // }
}
