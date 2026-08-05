import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';
@Entity('spu_image_list')
export class spuImageList extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'image_id',
    comment: '图片ID',
    transformer: bigintTransformer,
  })
  imageId: number;

  @Column({ name: 'image_name', length: 100, comment: '图片名称' })
  imageName: string;

  @Column({ name: 'image_url', length: 255, comment: '图片URL' })
  imageUrl: string;

  @Column({
    type: 'bigint',
    name: 'spu_id',
    comment: '所属SPU ID',
    transformer: bigintTransformer,
  })
  spuId: number;
}
