import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sku } from '../entities/sku.entity';
import { Repository } from 'typeorm';
import { paginationReturn } from '../../../common/types/paginaton.return';
import { BusinessException, ErrorCode } from '../../../common';

@Injectable()
export class SkuService {
  constructor(@InjectRepository(Sku) private skuRepository: Repository<Sku>) {}
  // 获取sku分页列表
  async getSkuPagination(page: number, limit: number) {
    const [records, total] = await this.skuRepository
      .createQueryBuilder()
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy({ id: 'ASC' })
      .getManyAndCount();
    const skuInfo: paginationReturn<Sku> = {
      records,
      total,
      size: limit,
      current: page,
      searchCount: true,
      pages: Math.ceil(total / limit),
    };
    return skuInfo;
  }
  // 根据spuId查询sku列表
  async findSkuBySpuId(spuId: number): Promise<Sku[]> {
    return this.skuRepository.find({ where: { spuId }, order: { id: 'ASC' } });
  }

  // 上架Sku
  async OnSaleSku(skuId: number) {
    const sku = await this.skuRepository.findOne({ where: { skuId } });
    if (!sku) {
      throw new BusinessException(ErrorCode.INVALID_PARAM);
    }
    await this.skuRepository.update({ skuId }, { isSale: 1 });
    return null;
  }
  // 下架Sku
  async CancelSaleSku(skuId: number) {
    const sku = await this.skuRepository.findOne({ where: { skuId } });
    if (!sku) {
      throw new BusinessException(ErrorCode.INVALID_PARAM);
    }
    await this.skuRepository.update({ skuId }, { isSale: 0 });
    return null;
  }
}
