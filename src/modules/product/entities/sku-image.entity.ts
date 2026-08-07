import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';

@Entity('sku_image')
export class SkuImage extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'image_id',
    comment: '图片ID',
    transformer: bigintTransformer,
  })
  imageId: number;

  @Column({
    type: 'bigint',
    name: 'sku_id',
    comment: '所属SKU ID',
    transformer: bigintTransformer,
  })
  skuId: number;

  @Column({ name: 'image_name', length: 100, comment: '图片名称' })
  imageName: string;

  @Column({ name: 'image_url', length: 255, comment: '图片URL' })
  imageUrl: string;

  @Column({
    type: 'bigint',
    name: 'spu_image_id',
    comment: '对应的SPU图片ID',
    transformer: bigintTransformer,
  })
  spuImageId: number;

  @Column({
    name: 'is_default',
    length: 1,
    default: '0',
    comment: '是否默认图',
  })
  isDefault: string;
}
