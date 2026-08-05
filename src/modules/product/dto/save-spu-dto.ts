import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

// 图片属性
export class SPUImageItemDto {
  @ApiProperty({ description: '图片名称' })
  @IsString()
  @IsNotEmpty({ message: '图片姓名不为空' })
  imageName: string;

  @ApiProperty({ description: '图片地址' })
  @IsString()
  @IsNotEmpty({ message: '图片地址不为空' })
  imageUrl: string;
}
// 销售属性值
export class SpuSaleAttrValueItemDto {
  @ApiProperty({ description: '销售属性字典ID' })
  @IsNumber()
  baseSaleAttrId: number;

  @ApiProperty({ description: '属性值名称' })
  @IsString()
  saleAttrValueName: string;
}
// spu销售属性
export class SpuSaleAttrItemDto {
  @ApiProperty({ description: '销售属性字典ID' })
  @IsNumber()
  BaseSaleAttrId: number;

  @ApiProperty({ description: '销售属性名称' })
  @IsString()
  SaleAttrName: string;

  @ApiProperty({
    description: '销售属性值列表',
    type: [SpuSaleAttrValueItemDto],
  })
  @IsArray({ message: 'spu销售属性值列表收到的参数不是一个列表' })
  spuSaleAttrValueList: SpuSaleAttrValueItemDto[];
}
// 保存spu
export class SaveSpuDto {
  @ApiProperty({ description: 'spu的id', required: false })
  @IsNumber()
  @IsNotEmpty({ message: 'spuid不为空' })
  @IsOptional()
  id?: number; //spu的id

  @ApiProperty({ description: 'SPU 名称' })
  @IsNotEmpty({ message: 'SPU 名称不能为空' })
  @IsString()
  spuName: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  description: string;

  @ApiProperty({ description: '品牌ID' })
  @IsNumber()
  tmId: number;

  @ApiProperty({ description: '三级分类ID' })
  @IsNumber()
  category3Id: number;

  @ApiProperty({ description: '图片列表', type: [SPUImageItemDto] })
  @IsArray()
  spuImageList: SPUImageItemDto[]; //存储图片

  @ApiProperty({ description: '销售属性列表', type: [SpuSaleAttrItemDto] })
  @IsArray()
  spuSaleAttrList: SpuSaleAttrValueItemDto[]; //存储销售属性
}
