import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { BusinessException, ErrorCode } from '../../common';
import { hashPassword } from '../../utils/password.util';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationResponse } from '../../common/dto/pagination-response.dto';

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
  // 用户分页列表
  async getUserPaginaton(
    username: string | null = null,
    page: number,
    limit: number,
  ): Promise<PaginationResponse<User>> {
    const query = this.userRepository.createQueryBuilder('query');
    if (username) {
      query.where('query.username LIKE :username', { username });
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

  // 更新用户
  async UpdateUser(dto: UpdateUserDto) {
    // const user = await this.userRepository.findOne({
    //   where: { userId: dto.userId },
    // });
    const user = await this.userRepository.findOneBy({ userId: dto.userId });
    if (!user) {
      throw new BusinessException(ErrorCode.USER_NOT_EXIST);
    }
    // 更新用户
    await this.userRepository.update(
      { userId: dto.userId },
      { username: dto.username, name: dto.name },
    );
  }

  // 删除用户
  async DeleteUser(userId: number) {
    const user = await this.userRepository.findOneBy({ userId });
    if (!user) {
      throw new BusinessException(ErrorCode.USER_NOT_EXIST);
    }
    await this.userRepository.remove(user);
  }

  // 批量删除用户
  async BatchDeleteUser(UserIdList: number[]) {
    if (!UserIdList || UserIdList.length === 0) {
      throw new BusinessException(ErrorCode.USER_NOT_EXIST);
    }
    await this.userRepository
      .createQueryBuilder('Builder')
      .delete() //指定操作为删除
      .from(User) //从哪个表删除
      .where('Builder.userId IN (...:UserIdList)', { UserIdList })
      .execute();
  }
}
