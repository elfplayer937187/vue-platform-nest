import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entity/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { BusinessException, ErrorCode } from '../../common';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}
  // 获取分页列表
  async GetRolePagination(
    roleName: string | null = null,
    page: number,
    limit: number,
  ) {
    const query = this.roleRepository.createQueryBuilder('query');
    if (roleName) {
      query.where('query.roleName LIKE :roleName', { roleName });
    }
    const [records, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('query.id', 'ASC')
      .getManyAndCount();

    return {
      records,
      total,
      size: limit,
      current: page,
      pages: Math.ceil(total / limit),
    };
  }

  // 新增角色
  async CreateRole(dto: CreateRoleDto) {
    const role = await this.roleRepository.findOneBy({
      roleName: dto.roleName,
    });
    if (role) {
      throw new BusinessException(ErrorCode.USER_EXIST);
    }
    const newRole = this.roleRepository.create({
      roleId: new Date().getTime(),
      roleName: dto.roleName,
      remark: dto.remark,
    });
    await this.roleRepository.save(newRole);
    return null;
  }

  // 更新角色
  async UpdateRole(dto: UpdateRoleDto) {
    const user = await this.roleRepository.findOneBy({ roleId: dto.roleId });
    console.log(211);

    if (!user) {
      throw new BusinessException(ErrorCode.USER_NOT_EXIST);
    }
    await this.roleRepository.update(
      { roleId: dto.roleId },
      { roleName: dto.roleName, remark: dto.remark },
    );
    return null;
  }
  // 删除角色
  async DeleteRole(roleId: number) {
    const role = await this.roleRepository.findOne({ where: { roleId } });
    if (!role) {
      throw new BusinessException(ErrorCode.INVALID_PARAM);
    }
    await this.roleRepository.remove(role);
    return null;
  }
}
