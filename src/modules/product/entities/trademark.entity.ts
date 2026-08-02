import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';
@Entity('trademark')
export class Trademark extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'tm_id',
    comment: '品牌类型的id',
    transformer: bigintTransformer,
  })
  tmId: number;

  @Column({
    length: 50,
    comment: '品牌id',
    type: 'varchar',
    name: 'tm_name',
  })
  tmName: string;

  @Column({
    comment: 'logo图片',
    length: 255,
    name: 'logo_url',
    type: 'varchar',
  })
  logoUrl: string;
}
