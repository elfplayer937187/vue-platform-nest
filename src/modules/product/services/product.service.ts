import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { category1 } from '../entities/category1.entity';
import { Repository } from 'typeorm';
import { category3 } from '../entities/category3.entity';
import { category2 } from '../entities/category2.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(category1)
    private category1Repository: Repository<category1>,
    @InjectRepository(category2)
    private category2Repository: Repository<category2>,
    @InjectRepository(category3)
    private category3Repository: Repository<category3>,
  ) {}

  // 查询category1的全部种类
  async GetCategory1() {
    return await this.category1Repository.find();
  }
  // 查询category2的全部种类
  async GetCategory2(category1Id: number) {
    return await this.category2Repository.find({
      where: { category1Id },
      order: { id: 'ASC' },
    });
  }
  // 查询category3的全部种类
  async GetCategory3(category2Id: number) {
    return await this.category3Repository.find({
      where: { category2Id },
      order: { id: 'ASC' },
    });
  }
}
