import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Attr } from './Attr.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';

@Entity('attr_value')
export class AttrValue extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'attr_value_id',
    comment: '属性值ID',
    transformer: bigintTransformer,
  })
  attrValueId: number;

  @Column({ name: 'value_name', length: 50, comment: '属性值名称' })
  valueName: string;

  @Column({ type: 'bigint', name: 'attr_id', comment: '所属属性ID' })
  attrId: number;

  @ManyToOne(() => Attr)
  @JoinColumn({
    name: 'attr_id', //数据库外键列名
    referencedColumnName: 'attrId', //entity实例属性
  })
  attr: Attr;
}
