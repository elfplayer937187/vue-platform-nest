import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trademark } from '../entities/trademark.entity';
import { ObjectLiteral, Repository } from 'typeorm';
import { paginationReturn } from '../../../common/types/paginaton.return';
import { CreateTrademarkDto } from '../dto/create-trademark.dto';
import { BusinessException, ErrorCode } from '../../../common';
import { UpdateTrademarkDto } from '../dto/update-trademark.dto';

@Injectable()
export class TradeMarkService {
  constructor(
    @InjectRepository(Trademark)
    private tradeMarkRepository: Repository<Trademark>,
  ) {}
  // 获取品牌分页列表
  async getTrademarkPaginationList(page: number, limit: number) {
    const [records, total] = await this.tradeMarkRepository
      .createQueryBuilder()
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('id', 'ASC')
      .getManyAndCount();

    const paginationReturns: paginationReturn<ObjectLiteral> = {
      records,
      total,
      size: limit,
      current: page,
      pages: Math.ceil(total / limit),
      searchCount: true,
    };
    return paginationReturns;
  }

  // 获取品牌全部列表
  async getAllTradeMarkList() {
    return await this.tradeMarkRepository.find({ order: { id: 'ASC' } });
  }

  //添加品牌
  async CreateTradeMark(dto: CreateTrademarkDto) {
    const exist = await this.tradeMarkRepository.findOne({
      where: { tmName: dto.tmName },
    });
    if (exist) {
      throw new BusinessException(ErrorCode.USER_EXIST);
    }
    // 新增
    const newTradeMark = this.tradeMarkRepository.create({
      tmId: new Date().getTime(),
      tmName: dto.tmName,
      logoUrl: dto.logoUrl,
    });
    await this.tradeMarkRepository.save(newTradeMark);
    return null;
  }

  // 更新品牌
  async UpdateTradeMark(dto: UpdateTrademarkDto) {
    const trademark = await this.tradeMarkRepository.findOne({
      where: { tmId: dto.tmId },
    });
    if (!trademark) {
      throw new BusinessException(ErrorCode.USER_NOT_EXIST);
    }
    await this.tradeMarkRepository.update(
      { tmId: dto.tmId },
      {
        tmName: dto.tmName,
        logoUrl: dto.logoUrl,
      },
    );
    return null;
  }
  // 删除品牌
  async delete(tmId: number) {
    const trademark = await this.tradeMarkRepository.findOne({
      where: { tmId },
    });
    if (!trademark) {
      throw new BusinessException(ErrorCode.INVALID_PARAM);
    }

    await this.tradeMarkRepository.remove(trademark);
    return null;
  }
}
