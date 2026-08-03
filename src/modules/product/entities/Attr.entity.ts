import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';
import { AttrValue } from './Attr-value.entity';
@Entity('attr')
export class Attr extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'attr_id',
    comment: '属性id',
    transformer: bigintTransformer,
  })
  attrId: number;

  @Column({ name: 'attr_name', length: 50, comment: '属性名称' })
  attrName: string;

  @Column({ type: 'bigint', name: 'category_id', comment: '所属三级分类ID' })
  categoryId: number;

  @Column({ type: 'tinyint', name: 'category_level', comment: '分类级别:3' })
  categoryLevel: number;

  // 一对多：一个 Attr 有多个 AttrValue
  // 注意：仅作运行时数据容器，不启用级联保存以避免复杂性
  @OneToMany(() => AttrValue, (attrValue) => attrValue.attr)
  attrValueList: AttrValue[];
}
