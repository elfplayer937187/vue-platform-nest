import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { CategoryService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { category1 } from './entities/category1.entity';
import { category2 } from './entities/category2.entity';
import { category3 } from './entities/category3.entity';
import { TradeMarkService } from './services/trademark.service';
import { Trademark } from './entities/trademark.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([category1, category2, category3, Trademark]),
  ],
  controllers: [ProductController],
  providers: [CategoryService, TradeMarkService],
})
export class ProductModule {}
