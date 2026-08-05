import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('sale_attr_value')
export class saleAttrValue extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'sale_attr_value_id',
    comment: '属性值ID',
  })
  saleAttrValueId: number;

  @Column({ name: 'sale_attr_value_name', length: 50, comment: '属性值名称' })
  saleAttrValueName: string;

  @Column({ type: 'bigint', name: 'sale_attr_id', comment: '所属销售属性ID' })
  saleAttrId: number;

  @Column({ type: 'bigint', name: 'spu_id', comment: '所属SPU ID' })
  spuId: number;
}
