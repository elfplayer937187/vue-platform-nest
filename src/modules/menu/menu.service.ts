import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entity/menu.entity';
import { Repository } from 'typeorm';
import { BusinessException, ErrorCode } from '../../common';
import { CreateMenuDto } from './dto/create-menu.dto';
// import { UpdateMenuDto } from './dto/update-menu.dto';

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
  // async UpdateMenu(dto: UpdateMenuDto) {
  // }
}
