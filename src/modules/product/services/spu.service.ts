import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { saleAttr } from '../entities/sale-attr.entity';
import { Spu } from '../entities/spu.entity';

@Injectable()
export class SpuService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(saleAttr)
    private saleAttrRepository: Repository<saleAttr>,
    @InjectRepository(Spu) private spuRepository: Repository<Spu>,
  ) {}

  // 获取销售属性列表
  async getBaseSaleAttrList() {
    return this.saleAttrRepository.find({ order: { id: 'ASC' } });
  }

  // 保存spu
  // async SaveSpu(dto: SaveSpuDto) {
  // 插入
}
