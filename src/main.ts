import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  // main.ts不是一个被nestjs管理的类,只能手动赋值
  const configService: ConfigService = app.get(ConfigService);
  // 从配置中读取端口号，如果没找到则使用默认值 10086
  const port: number = configService.get('APP_PORT', 10086);
  // 使用业务异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());
  // 使用全局拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // ④ CORS 跨域
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Token,Content-Type,Authorization',
    maxAge: 86400,
  });
  await app.listen(port);
}
bootstrap();
