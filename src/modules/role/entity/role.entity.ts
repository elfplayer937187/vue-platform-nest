import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { bigintTransformer } from '../../../utils/bigint-transformer';
import { Menu } from '../../menu/entity/menu.entity';

// 其实也可以继承
@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    // transformer: bigintTransformer,
  })
  id: number;

  @Column({
    type: 'bigint',
    unique: true,
    name: 'role_id',
    comment: '角色id',
    transformer: bigintTransformer,
  })
  roleId: number;

  @Column({
    unique: true,
    length: 50,
    name: 'role_name',
    comment: '角色名称',
  })
  roleName: string;

  @Column({ length: 255, comment: '备注', nullable: true })
  remark: string;

  @CreateDateColumn({ type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updateTime: Date;

  @ManyToMany(() => Menu, (menu) => menu.roles)
  @JoinTable({
    name: 'role_menu',
    joinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'menuId' },
  })
  menus: Menu[];
}
