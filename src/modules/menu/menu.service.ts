import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { DataSource, Repository } from 'typeorm';
import { BusinessException, ErrorCode } from '../../common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { BuildTreeMenu } from '../../utils/tree-menu.util';
import { AssignPermissionDto } from './dto/assign-permission.dto';
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  // 获取所有菜单列表(平铺)
  GetAllMenuList() {
    return this.menuRepository.find({
      order: { id: 'ASC' },
    });
  }

  // 新增menu
  async CreateMenu(dto: CreateMenuDto) {
    const nameMenu = await this.menuRepository.findOne({
      where: { name: dto.name },
    });
    const nodeMenu = await this.menuRepository.findOne({
      where: { code: dto.code },
    });
    if (nameMenu) {
      throw new BusinessException(ErrorCode.USER_EXIST);
    } else if (nodeMenu) {
      throw new BusinessException(ErrorCode.MENU_NODE_EXIST);
    }
    // 两个都没找到
    const newMenu = this.menuRepository.create({
      menuId: new Date().getTime(),
      name: dto.name,
      pid: dto.pid,
      code: dto.code,
      level: dto.level,
    });
    await this.menuRepository.save(newMenu);
    return null;
  }

  // 更新menu
  async UpdateMenu(dto: UpdateMenuDto) {
    // 判断是否存在
    const menu = await this.menuRepository.findOne({
      where: { menuId: dto.menuId },
    });
    if (!menu) {
      throw new BusinessException(ErrorCode.NO_ROUTE);
    }
    // 判断是否已有节点
    const nodeMenu = await this.menuRepository.find({
      where: { code: dto.code },
    });
    if (!nodeMenu) {
      throw new BusinessException(ErrorCode.MENU_NODE_EXIST);
    }
    // 更新
    await this.menuRepository.update(
      { menuId: dto.menuId },
      { name: dto.name, code: dto.code, pid: dto.pid, level: dto.level },
    );
    return null;
  }

  // 删除menu
  async RemoveMenu(menuId: number) {
    // 是否存在子节点
    const totalSon = await this.menuRepository.findOne({
      where: { pid: menuId },
    });
    console.log(totalSon);

    if (totalSon) {
      throw new BusinessException(ErrorCode.MENU_NODE_EXIST);
    }
    // 查看是否有这个menu
    const menu = await this.menuRepository.findOne({ where: { menuId } });
    if (!menu) {
      throw new BusinessException(ErrorCode.INVALID_PARAM);
    }
    await this.menuRepository.delete({ menuId });
    return null;
  }

  // 获取树形菜单列表
  async GetTreeMenuList() {
    // 获取平铺菜单
    const menuList = await this.menuRepository.find({ order: { id: 'ASC' } });
    if (menuList.length === 0) {
      return [];
    }
    return BuildTreeMenu(menuList);
  }

  // 根据角色获取菜单
  async GetMenuFromRole(roleId: number) {
    // 获取menuList
    const menuList = await this.menuRepository.find({ order: { id: 'ASC' } });
    // 没有值返回空
    if (menuList.length === 0) {
      return [];
    }
    // 有值就根据roleId查找menuId
    const roleMenuIdList = await this.dataSource
      .createQueryBuilder()
      .select('rm.menu_id', 'menuId')
      .from('role_menu', 'rm')
      .where('role_id = :roleId', { roleId })
      .getRawMany();

    // 转换为集合
    const roleMenuSet = new Set(
      roleMenuIdList.map((roleMenu: { menuId: string }) =>
        Number(roleMenu.menuId),
      ),
    );
    // 看看平铺的集合里面的menuId在不在集合里
    menuList.forEach((menu: Menu) => {
      menu.select = roleMenuSet.has(menu.menuId);
    });

    // 返回树形结构
    return BuildTreeMenu(menuList);
  }

  // 给角色分配权限
  async GivePermisssionsForRole(dto: AssignPermissionDto) {
    await this.dataSource.transaction(async (manager) => {
      // 如果是空串[0],则删除所有权限并返回
      if (
        dto.permissionId &&
        dto.permissionId.length === 1 &&
        dto.permissionId[0] === 0
      ) {
        await manager
          .createQueryBuilder()
          .delete()
          .from('role_menu')
          .where('role_id=:roleId', { roleId: dto.roleId })
          .execute();
        return null;
      }
      // 给这个角色删除所有权限
      await manager
        .createQueryBuilder()
        .delete()
        .from('role_menu', 'rm')
        .where('role_id = :roleId', { roleId: dto.roleId })
        .execute();
      // 如果permissionId列表存在就格式转换并且插入
      if (dto.permissionId && dto.permissionId.length > 0) {
        // 格式化数据
        const insertData = dto.permissionId.map((id: number) => ({
          role_id: dto.roleId,
          menu_id: id,
        }));
        await manager
          .createQueryBuilder()
          .insert()
          .into('role_menu')
          .values(insertData)
          .execute();
      } else {
        // dto里面是个空值
        // 删掉所有权限,roleId->menuId
        // 检验是否为空串
        throw new BusinessException(ErrorCode.INVALID_PARAM);
      }
    });
    return null;
  }
}
