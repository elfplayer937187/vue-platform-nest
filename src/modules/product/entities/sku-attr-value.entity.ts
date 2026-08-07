import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';

@Entity('sku_attr_value')
export class SkuAttrValue extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'sku_attr_value_id',
    comment: 'ID',
    transformer: bigintTransformer,
  })
  skuAttrValueId: number;

  @Column({
    type: 'bigint',
    name: 'attr_id',
    comment: '平台属性ID（attr表）',
    transformer: bigintTransformer,
  })
  attrId: number;

  @Column({
    type: 'bigint',
    name: 'value_id',
    comment: '平台属性值ID（attr_value表）',
    transformer: bigintTransformer,
  })
  valueId: number;

  @Column({ name: 'value_name', length: 50, comment: '属性值名称' })
  valueName: string;

  @Column({ name: 'attr_name', length: 50, comment: '属性名称' })
  attrName: string;

  @Column({
    type: 'bigint',
    name: 'sku_id',
    comment: '所属SKU ID',
    transformer: bigintTransformer,
  })
  skuId: number;
}
