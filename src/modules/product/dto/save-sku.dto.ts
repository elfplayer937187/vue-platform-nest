import { IsNotEmpty, IsNumber, IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// SKU 图片
export class SkuImageItemDto {
  @ApiProperty({ description: '图片名称' })
  @IsString()
  imageName: string;

  @ApiProperty({ description: '图片URL' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'SPU 图片ID' })
  @IsNumber()
  spuImageId: number;

  @ApiProperty({ description: '是否默认', default: '0' })
  @IsString()
  isDefault: string;
}

// 平台属性
export class SkuAttrValueItemDto {
  @ApiProperty({ description: '属性ID（attr表）' })
  @IsNumber()
  attrId: number;

  @ApiProperty({ description: '属性值ID（attr_value表）' })
  @IsNumber()
  valueId: number;
}

// 销售属性
export class SkuSaleAttrValueItemDto {
  @ApiProperty({ description: '销售属性ID（spu_sale_attr表）' })
  @IsNumber()
  saleAttrId: number;

  @ApiProperty({ description: '销售属性值ID（sale_attr_value表）' })
  @IsNumber()
  saleAttrValueId: number;
}

// 保存 SKU
export class SaveSkuDto {
  @ApiProperty({ description: '所属 SPU ID' })
  @IsNumber()
  spuId: number;

  @ApiProperty({ description: '三级分类ID' })
  @IsNumber()
  category3Id: number;

  @ApiProperty({ description: '品牌ID' })
  @IsNumber()
  tmId: number;

  @ApiProperty({ description: 'SKU 名称' })
  @IsNotEmpty({ message: 'SKU 名称不能为空' })
  @IsString()
  skuName: string;

  @ApiProperty({ description: '重量（克）' })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: '价格（分）' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '描述' })
  @IsString()
  skuDesc: string;

  @ApiProperty({ description: '默认图片URL' })
  @IsString()
  skuDefaultImg: string;

  @ApiProperty({ description: '图片列表', type: [SkuImageItemDto] })
  @IsArray()
  skuImageList: SkuImageItemDto[];

  @ApiProperty({ description: '平台属性列表', type: [SkuAttrValueItemDto] })
  @IsArray()
  skuAttrValueList: SkuAttrValueItemDto[];

  @ApiProperty({ description: '销售属性列表', type: [SkuSaleAttrValueItemDto] })
  @IsArray()
  skuSaleAttrValueList: SkuSaleAttrValueItemDto[];
}
