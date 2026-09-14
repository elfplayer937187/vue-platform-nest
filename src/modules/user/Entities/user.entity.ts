import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Role } from '../../role/entity/role.entity';
import { bigintTransformer } from '../../../utils/bigint-transformer';

// 新用户默认头像,创建用户时未指定avatar则用这个
export const DEFAULT_AVATAR =
  'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
    // transformer: bigintTransformer,
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'user_id',
    unique: true,
    comment: '用户id',
    transformer: bigintTransformer,
  })
  userId: number;
  // 账号
  @Column({ unique: true, length: 50, comment: '用户名' })
  username: string;

  @Column({ length: 100, select: false, comment: '密码(bcrypt加密)' })
  password: string;
  // 昵称
  @Column({ length: 50, default: '', comment: '昵称' })
  name: string;

  @Column({
    length: 255,
    default: DEFAULT_AVATAR,
    comment: '用户头像地址',
  })
  avatar: string;

  @Column({ length: 20, default: '', comment: '手机号' })
  phone: string;

  @CreateDateColumn({ name: 'create_time', type: 'timestamp' })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', type: 'timestamp' })
  updateTime: Date;

  // 添加role表连接
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_role',
    joinColumn: { name: 'user_id', referencedColumnName: 'userId' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'roleId' },
  })
  roles: Role[];

  // 前端需要的roleName
  roleName?: string;
}
