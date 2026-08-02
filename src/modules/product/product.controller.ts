import {
  Controller,
  UploadedFile,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import dayjs from 'dayjs';
import { JwtAuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import * as fs from 'fs';
@ApiTags('商品管理')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
@Controller('admin/product')
export class ProductController {
  @Post('fileUpload')
  @ApiOperation({ summary: '文件上传' })
  @ApiConsumes('multipart/form-data') //告诉swagger显示文件选择器
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary', // 关键！告诉 Swagger 这是文件
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      // diskStorage — 自定义保存位置和文件名:磁盘存贮引擎
      storage: diskStorage({
        /**
         *
         * @param re
         * @param file
         * @param callback  第一个参数传错误，没有就null 第二个传目标文件夹
         */
        destination: (req, file: Express.Multer.File, callback) => {
          const dayString = dayjs().format('YYYYMMDD');
          // 定义了file.path
          const destinationFilePath = join('uploads', 'img', 'sph', dayString);
          // 确保文件夹存在
          if (!fs.existsSync(destinationFilePath)) {
            fs.mkdirSync(destinationFilePath, { recursive: true });
          }
          callback(null, destinationFilePath);
        },
        filename: (req, file: Express.Multer.File, callback) => {
          // 使用时间戳避免命名冲突
          const filename =
            new Date().getTime() +
            '-' +
            Math.floor(Math.random() * 10000).toString();
          callback(null, filename + extname(file.originalname));
        },
      }),
      // 最大文件容量4MB
      limits: { fileSize: 1024 * 1024 * 4 },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    const url = '/api/' + file.path.replace('/\\/g', '/');
    return url;
  }
}
