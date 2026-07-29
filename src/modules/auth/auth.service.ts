import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDTO } from '../user/dto/login.dto';
import { BusinessException, ErrorCode } from '../../common';
import { comparePassword } from '../../utils/password.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/Entities/user.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
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
      user_id: user.id,
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

    return {
      avatar: '',
      name: user.username,
      routes: [],
      buttons: [],
      roles: [],
    };
  }
}
