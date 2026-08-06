import { BaseEntity } from '../../../common/entities/base.entity';
import { Entity, Column } from 'typeorm';
@Entity('spu_sale_attr')
export class SpuSaleAttr extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'spu_sale_attr_id',
    comment: 'ID',
  })
  spuSaleAttrId: number;

  @Column({
    type: 'bigint',
    name: 'base_sale_attr_id',
    comment: '销售属性字典ID',
  })
  baseSaleAttrId: number;

  @Column({ name: 'sale_attr_name', length: 50, comment: '销售属性名称' })
  saleAttrName: string;

  @Column({ type: 'bigint', name: 'spu_id', comment: '所属SPU ID' })
  spuId: number;

  spuSaleAttrList?: any[];
}
