import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // main.ts不是一个被nestjs管理的类,只能手动赋值
  const configService: ConfigService = app.get(ConfigService);

  // 从配置中读取端口号，如果没找到则使用默认值 10086
  const port: number = configService.get('APP_PORT', 10086);
  await app.listen(port);
}
bootstrap();
