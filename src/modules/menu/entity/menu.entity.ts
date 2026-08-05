import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';
import type { Role } from '../../role/entity/role.entity';

@Entity('menu')
export class Menu extends BaseEntity {
  @Column({
    type: 'bigint',
    unique: true,
    name: 'menu_id',
    comment: '菜单id',
    transformer: bigintTransformer,
  })
  menuId: number;

  @Column({ length: '100', comment: '菜单名称', charset: 'utf8mb4' })
  name: string;

  @Column({
    type: 'bigint',
    default: 0,
    comment: '父菜单id,0是根节点',
    transformer: bigintTransformer,
  })
  pid: number;

  @Column({ length: 100, comment: '路由路径权限标识码', charset: 'utf8mb4' })
  code: string;

  @Column({
    length: 100,
    charset: 'utf8mb4',
    collation: 'utf8mb4_0900_ai_ci',
    name: 'to_code',
    comment: '重定向路径',
  })
  toCode: string;

  @Column({
    type: 'int',
    default: 1,
    comment: '1是菜单,2是按钮',
  })
  type: number;

  @Column({ length: 100, comment: '状态' })
  status: string;

  @Column({ type: 'int', comment: '层级:1/2/3=菜单,4=按钮权限' })
  level: number;

  @Column({
    type: 'tinyint',
    default: 0,
    comment: '是否选中',
  })
  select: boolean;

  @ManyToMany('role', 'menus')
  roles: Role[];

  // 以下字段不存数据库，仅运行时使用
  children: Menu[];
}
