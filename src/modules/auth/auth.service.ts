import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDTO } from '../user/dto/login.dto';
import { BusinessException, ErrorCode } from '../../common';
import { comparePassword } from '../../utils/password.util';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/Entities/user.entity';
import { DataSource, Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
  // 登录逻辑
  async login(dto: LoginDTO) {
    const user = await this.userService.findUser(dto.username);
    if (!user) {
      throw new BusinessException(ErrorCode.USER_NOT_EXIST);
    }
    // 验证密码

    const IsSamePassword = await comparePassword(dto.password, user.password);
    if (!IsSamePassword) {
      throw new BusinessException(ErrorCode.INVALID_PASSWORD);
    }
    // 生成jwt token
    const token = this.jwtService.sign({
      user_id: user.userId,
      username: user.username,
    });
    return token;
  }

  // 获取用户信息逻辑
  async getUserInfo(userId: number) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new BusinessException(ErrorCode.USER_NOT_EXIST);
    }
    // userId->获取所有roleId->roleName
    let roles = await this.dataSource
      .createQueryBuilder()
      .select('r.role_name', 'roleName')
      .from('role', 'r')
      .innerJoin('user_role', 'ur', 'ur.role_id=r.role_id')
      .where('ur.user_id=:userId', { userId })
      .getRawMany();

    // role数据转换
    roles = roles.map((role: { roleName: string }): string => role.roleName);

    // user_role->role_menu->menu->buttons,routes
    const ButtonsAndRoutes = await this.dataSource
      .createQueryBuilder()
      .select('m.code', 'code')
      .addSelect('m.level', 'level')
      .from('menu', 'm')
      .innerJoin('role_menu', 'rm', 'rm.menu_id=m.menu_id')
      .innerJoin('user_role', 'ur', 'ur.role_id=rm.role_id')
      .where('ur.user_id=:userId', { userId })
      .distinct(true) //防止一个用户通过不同角色查到相同的(code,level)
      .getRawMany();
    // 使用过滤式写法
    const buttons = ButtonsAndRoutes.filter(
      (item: { code: string; level: number }) => item.level === 4,
    ).map((item: { code: string; level: number }) => item.code);
    const routes = ButtonsAndRoutes.filter(
      (item: { code: string; level: number }) => item.level !== 4,
    ).map((item: { code: string; level: number }) => item.code);

    return {
      avatar: user.avatar || '',
      name: user.username || '',
      routes: routes || [],
      buttons: buttons || [],
      roles: roles || [],
    };
  }
}
