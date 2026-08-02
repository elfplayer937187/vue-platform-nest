import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // ← 新增
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
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
  // Swagger 配置
  const swaggerConfig = new DocumentBuilder()
    .setTitle('硅谷甄选 API')
    .setDescription('硅谷甄选后台管理系统接口文档')
    .setVersion('1.0')
    .addApiKey(
      { type: 'apiKey', name: 'Token', in: 'header' },
      'Token', // 这个名字用于引用
    )
    .build();
  // 静态资源配置
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/api/uploads/',
  });
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();
