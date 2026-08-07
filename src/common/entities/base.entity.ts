import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    type: 'bigint',
  })
  id?: number;

  @CreateDateColumn({ name: 'create_time', type: 'timestamp' })
  createTime?: Date;

  @UpdateDateColumn({ name: 'update_time', type: 'timestamp' })
  updateTime?: Date;
}
