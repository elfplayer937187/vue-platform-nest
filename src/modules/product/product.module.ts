import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { CategoryService } from './services/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { category1 } from './entities/category1.entity';
import { category2 } from './entities/category2.entity';
import { category3 } from './entities/category3.entity';
import { TradeMarkService } from './services/trademark.service';
import { Trademark } from './entities/trademark.entity';
import { TrademarkController } from './controllers/trademark.controller';
import { Attr } from './entities/Attr.entity';
import { AttrValue } from './entities/Attr-value.entity';
import { AttrController } from './controllers/attr.controller';
import { AttrService } from './services/attr.service';
import { Spu } from './entities/spu.entity';
import { SpuSaleAttr } from './entities/spu-sale-attr.entity';
import { saleAttr } from './entities/sale-attr.entity';
import { saleAttrValue } from './entities/sale-attr-value.entity';
import { spuImageList } from './entities/spu-image-list.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      category1,
      category2,
      category3,
      Trademark,
      Attr,
      AttrValue,
      Spu,
      SpuSaleAttr,
      saleAttr,
      saleAttrValue,
      spuImageList,
    ]),
  ],
  controllers: [ProductController, TrademarkController, AttrController],
  providers: [CategoryService, TradeMarkService, AttrService],
  exports: [TypeOrmModule],
})
export class ProductModule {}
