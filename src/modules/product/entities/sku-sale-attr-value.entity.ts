import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';

@Entity('sku_sale_attr_value')
export class SkuSaleAttrValue extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'sku_sale_attr_value_id',
    comment: 'ID',
    transformer: bigintTransformer,
  })
  skuSaleAttrValueId: number;

  @Column({
    type: 'bigint',
    name: 'sale_attr_id',
    comment: '销售属性ID(spu_sale_attr表)',
    transformer: bigintTransformer,
  })
  saleAttrId: number;

  @Column({
    type: 'bigint',
    name: 'sale_attr_value_id',
    comment: '销售属性值ID(sale_attr_value表)',
    transformer: bigintTransformer,
  })
  saleAttrValueId: number;

  @Column({ name: 'sale_attr_name', length: 50, comment: '销售属性名称' })
  saleAttrName: string;

  @Column({
    name: 'sale_attr_value_name',
    length: 50,
    comment: '销售属性值名称',
  })
  saleAttrValueName: string;

  @Column({
    type: 'bigint',
    name: 'sku_id',
    comment: '所属SKU ID',
    transformer: bigintTransformer,
  })
  skuId: number;
}
