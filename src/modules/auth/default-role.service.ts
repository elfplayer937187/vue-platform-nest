import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../role/entity/role.entity';

// 应用启动时确保注册用户默认挂的角色存在
// 只做一次,幂等,失败不阻断启动(注册接口仍会返回DEFAULT_ROLE_NOT_EXIST)
@Injectable()
export class DefaultRoleService implements OnModuleInit {
  private readonly logger = new Logger(DefaultRoleService.name);

  constructor(
    private configService: ConfigService,
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    const roleName = this.configService.get<string>('register.defaultRoleName');
    if (!roleName) {
      this.logger.warn('未配置register.defaultRoleName,注册接口将不可用');
      return;
    }

    try {
      const exist = await this.roleRepository.findOneBy({ roleName });
      if (exist) {
        return;
      }
      // roleId与RoleService.CreateRole保持一致,用毫秒时间戳
      await this.roleRepository.save(
        this.roleRepository.create({
          roleId: Date.now(),
          roleName,
          remark: '注册用户默认角色',
        }),
      );
      this.logger.log(`已创建注册默认角色: ${roleName}`);
    } catch (error) {
      // 多实例同时启动可能撞role_name唯一索引,此时角色已由别的实例建好
      this.logger.error(
        `确保默认角色[${roleName}]存在失败: ${error instanceof Error ? error.message : error}`,
      );
    }
  }
}
