import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('menu')
export class Menu extends BaseEntity {
  @Column({ type: 'bigint', unique: true, name: 'menu_id', comment: '菜单id' })
  menuId: number;

  @Column({ length: '30', comment: '菜单名称' })
  name: string;

  @Column({ type: 'bigint', default: 0, comment: '父菜单id,0是根节点' })
  pid: number;

  @Column({ length: 50, comment: '路由路径权限标识码' })
  code: string;

  @Column({
    length: 100,
    nullable: true,
    name: 'to_code',
    comment: '重定向路径',
  })
  toCode: string;
  @Column({ type: 'tinyint', comment: '1是菜单,2是按钮', nullable: true })
  type: number;

  @Column({ length: 20, nullable: true, comment: '状态' })
  status: string;

  @Column({ type: 'tinyint', comment: '层级:1/2/3=菜单,4=按钮权限' })
  level: number;

  // 以下字段存数据库，仅运行时使用
  children: Menu[];
  select: boolean;
}
