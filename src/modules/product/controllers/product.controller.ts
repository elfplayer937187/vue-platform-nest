import {
  Controller,
  UploadedFile,
  Post,
  UseGuards,
  UseInterceptors,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import dayjs from 'dayjs';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import * as fs from 'fs';
import { CategoryService } from '../services/product.service';
@ApiTags('商品管理')
@ApiBearerAuth('Token')
@UseGuards(JwtAuthGuard)
@Controller('admin/product')
export class ProductController {
  constructor(private readonly categoryService: CategoryService) {}
  // 处理文件上传接口
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

    const url = '/api/' + file.path.replace(/\\/g, '/');
    return url;
  }

  // 获取category1接口
  @Get('category1')
  @ApiOperation({ summary: '获取一级分类接口' })
  async getCategory1() {
    return await this.categoryService.GetCategory1();
  }

  @Get('category2/:id')
  @ApiOperation({ summary: '获取二级分类接口' })
  async getCategory2(@Param('id') category1Id: number) {
    return await this.categoryService.GetCategory2(category1Id);
  }

  @Get('category3/:id')
  @ApiOperation({ summary: '获取三级分类接口' })
  async getCategory3(@Param('id') category2Id: number) {
    return await this.categoryService.GetCategory3(category2Id);
  }
}
