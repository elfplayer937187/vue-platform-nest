import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';
@Entity('category1')
export class category1 extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'category1_id',
    comment: '一级分类id',
    transformer: bigintTransformer,
  })
  category1Id: number;

  @Column({
    length: 50,
    type: 'varchar',
    comment: '一级分类名称',
  })
  name: string;
}
