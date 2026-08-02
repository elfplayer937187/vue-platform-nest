import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';
@Entity('category2')
export class category2 extends BaseEntity {
  @Column({
    type: 'bigint',
    name: 'category1_id',
    comment: '一级分类id',
    transformer: bigintTransformer,
  })
  category1Id: number;

  @Column({
    type: 'bigint',
    unique: true,
    name: 'category2_id',
    comment: '二级分类id',
    transformer: bigintTransformer,
  })
  category2Id: number;

  @Column({
    length: 50,
    type: 'varchar',
    comment: '二级分类名称',
  })
  name: string;
}
