import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';

// 其实也可以继承
@Entity('role')
export class Role {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'bigint', unique: true, name: 'role_id', comment: '角色id' })
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
}
