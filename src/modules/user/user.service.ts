import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { BusinessException, ErrorCode } from '../../common';
import { hashPassword } from '../../utils/password.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  // 注册用户
  async createUser(dto: CreateUserDTO) {
    const ExistUser = await this.userRepository.findOne({
      where: { username: dto.username },
    });
    if (ExistUser) {
      throw new BusinessException(ErrorCode.USER_EXIST);
    }
    // 如果不存在则新增
    const newUser = this.userRepository.create({
      userId: Date.now(), //先用时间戳
      username: dto.username,
      name: dto.name,
      password: await hashPassword(dto.password),
    });

    await this.userRepository.save(newUser);
    return true;
  }

  // 查询用户(包含密码)
  async findUser(username: string): Promise<User | null> {
    return (
      this.userRepository
        .createQueryBuilder('user')
        .where('user.username=:username', { username })
        //必须加入addSelect显式查询才能找到
        .addSelect('user.password')
        .getOne()
    );
  }
}
