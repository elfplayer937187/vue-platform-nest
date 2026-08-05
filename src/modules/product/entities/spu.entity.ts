import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';

@Entity('spu')
export class Spu extends BaseEntity {
  @Column({
    name: 'spu_id',
    unique: true,
    comment: 'spu的id',
    transformer: bigintTransformer,
    type: 'bigint',
  })
  spuId: number;

  @Column({
    type: 'varchar',
    length: 100,
    comment: 'spu名称',
  })
  spuName: string;

  @Column({
    type: 'text',
    comment: '描述',
  })
  description: string;

  @Column({
    type: 'bigint',
    name: 'tm_id',
    comment: '品牌ID',
    transformer: bigintTransformer,
  })
  tmId: number;

  // 运行时字段（不存数据库）
  spuImageList: any[]; //存储图片
  spuSaleAttrList: any[]; //存储销售属性
}
