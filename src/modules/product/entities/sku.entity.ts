import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sku')
export class Sku extends BaseEntity {
  @Column({ type: 'bigint', unique: true, name: 'sku_id', comment: 'SKU ID' })
  skuId: number;

  @Column({ type: 'bigint', name: 'spu_id', comment: '所属 SPU ID' })
  spuId: number;

  @Column({ type: 'bigint', name: 'category_3_id', comment: '三级分类ID' })
  category3Id: number;

  @Column({ type: 'bigint', name: 'tm_id', comment: '品牌ID' })
  tmId: number;

  @Column({ name: 'sku_name', length: 200, comment: 'SKU 名称' })
  skuName: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '重量（克）',
    transformer: {
      to: (value: string | number): string => String(value ?? ''),
      from: (value: string): string => value,
    },
  })
  weight: string;

  @Column({ type: 'bigint', comment: '价格（分）' })
  price: number;

  @Column({ name: 'sku_desc', type: 'text', comment: 'SKU 描述' })
  skuDesc: string;

  @Column({ name: 'sku_default_img', length: 255, comment: '默认图片URL' })
  skuDefaultImg: string;

  @Column({
    name: 'is_sale',
    type: 'tinyint',
    default: 0,
    comment: '是否上架:0=下架,1=上架',
  })
  isSale: number;
}
