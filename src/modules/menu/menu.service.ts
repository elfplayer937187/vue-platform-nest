import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { Repository } from 'typeorm';
import { BusinessException, ErrorCode } from '../../common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { BuildTreeMenu } from '../../utils/tree-menu.util';
@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu) private menuRepository: Repository<Menu>,
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
}
