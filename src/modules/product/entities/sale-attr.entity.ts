import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';

@Entity('sale_attr')
export class saleAttr extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'sale_attr_id',
    comment: '销售属性Id',
    transformer: bigintTransformer,
  })
  saleAttrId: number;

  @Column({ name: 'sale_attr_name', length: 50, comment: '销售属性名称' })
  saleAttrName: string;
}
