import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';
@Entity('category3')
export class category3 extends BaseEntity {
  @Column({
    type: 'bigint',
    name: 'category2_id',
    comment: '二级分类id',
    transformer: bigintTransformer,
  })
  category2Id: number;

  @Column({
    type: 'bigint',
    unique: true,
    name: 'category3_id',
    comment: '三级分类id',
    transformer: bigintTransformer,
  })
  category3Id: number;

  @Column({
    length: 50,
    type: 'varchar',
    comment: '三级分类名称',
  })
  name: string;
}
