import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Sku } from '../entities/sku.entity';
import { DataSource, Repository } from 'typeorm';
import { paginationReturn } from '../../../common/types/paginaton.return';
import { BusinessException, ErrorCode } from '../../../common';
import { SaveSkuDto } from '../dto/save-sku.dto';
import { SkuImage } from '../entities/sku-image.entity';
import { SkuAttrValue } from '../entities/sku-attr-value.entity';
import { SkuSaleAttrValue } from '../entities/sku-sale-attr-value.entity';

@Injectable()
export class SkuService {
  constructor(
    @InjectRepository(Sku) private skuRepository: Repository<Sku>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}
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

  // 保存sku
  async SaveSku(dto: SaveSkuDto) {
    const skuId = Date.now() + Math.floor(Math.random() * 10000);
    await this.dataSource.transaction(async (manager) => {
      // 插入基础sku
      await manager
        .createQueryBuilder()
        .insert()
        .into(Sku)
        .values({
          skuId,
          spuId: dto.spuId,
          category3Id: dto.category3Id,
          tmId: dto.tmId,
          skuName: dto.skuName,
          weight: dto.weight,
          price: dto.price,
          skuDesc: dto.skuDesc,
          skuDefaultImg: dto.skuDefaultImg,
          isSale: 0,
        })
        .execute();

      //插入skuImage
      if (dto.skuImageList && dto.skuImageList.length > 0) {
        const Images: SkuImage[] = dto.skuImageList.map((skuImage) => ({
          imageId: Date.now() + Math.floor(Math.random() * 10000),
          skuId,
          imageName: skuImage.imageName,
          imageUrl: skuImage.imageUrl,
          spuImageId: skuImage.spuImageId,
          isDefault: skuImage.isDefault,
        }));
        await manager
          .createQueryBuilder()
          .insert()
          .into(SkuImage)
          .values(Images)
          .execute();
      }

      // 插入skuAttrValue
      if (dto.skuAttrValueList && dto.skuAttrValueList.length > 0) {
        // 根据提供的id查询名称
        for (const skuAttrValue of dto.skuAttrValueList) {
          const attrName: { name: string } | undefined = await manager
            .createQueryBuilder()
            .select('attr_name', 'name')
            .from('attr', 'attr')
            .where('attr_id=:attrId', { attrId: skuAttrValue.attrId })
            .getRawOne();
          const valueName: { name: string } | undefined = await manager
            .createQueryBuilder()
            .select('value_name', 'name')
            .from('attr_value', 'av')
            .where('av.attr_value_id=:valueId', {
              valueId: skuAttrValue.valueId,
            })
            .getRawOne();

          await manager
            .createQueryBuilder()
            .insert()
            .into(SkuAttrValue)
            .values({
              skuId,
              skuAttrValueId: Date.now() + Math.floor(Math.random() * 10000),
              attrId: skuAttrValue.attrId,
              attrName: attrName?.name,
              valueId: skuAttrValue.valueId,
              valueName: valueName?.name,
            })
            .execute();
        }
      }

      // 插入销售属性
      if (dto.skuSaleAttrValueList && dto.skuSaleAttrValueList.length > 0) {
        for (const skuSaleAttrValue of dto.skuSaleAttrValueList) {
          // 反查sale_attr_name<-销售属性ID（spu_sale_attr表）
          const saleAttrName: { name: string } | undefined = await manager
            .createQueryBuilder()
            .select('sale_attr_name', 'name')
            .from('spu_sale_attr', 'ssa')
            .where('ssa.spu_sale_attr_id=:id', {
              id: skuSaleAttrValue.saleAttrId,
            })
            .getRawOne();

          const saleAttrValueName: { name: string } | undefined = await manager
            .createQueryBuilder()
            .select('sale_attr_value_name', 'name')
            .from('sale_attr_value', 'sav')
            .where('sav.sale_attr_value_id=:id', {
              id: skuSaleAttrValue.saleAttrValueId,
            })
            .getRawOne();

          await manager
            .createQueryBuilder()
            .insert()
            .into(SkuSaleAttrValue)
            .values({
              skuSaleAttrValueId:
                Date.now() + Math.floor(Math.random() * 10000),
              saleAttrId: skuSaleAttrValue.saleAttrId,
              saleAttrName: saleAttrName?.name,
              saleAttrValueId: skuSaleAttrValue.saleAttrValueId,
              saleAttrValueName: saleAttrValueName?.name,
              skuId,
            })
            .execute();
        }
      }
    });
    return null;
  }

  // 获取sku详情信息
  async getSkuInfo(skuId: number) {
    // 查看sku是否存在
    const sku = await this.skuRepository.findOne({ where: { skuId } });
    if (!sku) {
      throw new BusinessException(ErrorCode.NO_SKU);
    }
    // 如果存在,查询sku对应的image,attrvalue,saleattrvalue
    const skuImageList = await this.dataSource
      .createQueryBuilder()
      .select([
        'image_id as imageId',
        'sku_id as skuId',
        'image_name as imageName',
        'image_url as imageUrl',
        'spu_image_id as spuImageId',
        'is_default as isDefault',
      ])
      .from('sku_image', 'si')
      .where('si.sku_id = :skuId', { skuId })
      .getRawMany();

    const skuAttrValueList = await this.dataSource
      .createQueryBuilder()
      .select([
        'sku_attr_value_id as skuAttrValueId',
        'attr_id as attrId',
        'attr_name as attrName',
        'value_id as valueId',
        'value_name as valueName',
        'sku_id as skuId',
      ])
      .from('sku_attr_value', 'sav')
      .where('sav.sku_id = :skuId', { skuId })
      .getRawMany();

    const skuSaleAttrValueList = await this.dataSource
      .createQueryBuilder()
      .select([
        'sku_sale_attr_value_id as skuSaleAttrValueId',
        'sale_attr_id as saleAttrId',
        'sale_attr_name as saleAttrName',
        'sale_attr_value_id as saleAttrValueId',
        'sale_attr_value_name as saleAttrValueName',
        'sku_id as skuId',
      ])
      .from('sku_sale_attr_value', 'ssav')
      .where('ssav.sku_id = :skuId', { skuId })
      .getRawMany();

    return { ...sku, skuImageList, skuAttrValueList, skuSaleAttrValueList };
  }

  // 删除sku
  async deleteSku(skuId: number) {
    // 使用事务级联删除
    await this.dataSource.transaction(async (manager) => {
      // 删除sku_sale_attr_value表
      await manager
        .createQueryBuilder()
        .delete()
        .from('sku_sale_attr_value', 'ssav')
        .where('ssav.sku_id=:skuId', { skuId })
        .execute();

      await manager
        .createQueryBuilder()
        .delete()
        .from('sku_attr_value')
        .where('sku_id = :skuId', { skuId })
        .execute();

      await manager
        .createQueryBuilder()
        .delete()
        .from('sku_image')
        .where('sku_id = :skuId', { skuId })
        .execute();

      await manager
        .createQueryBuilder()
        .delete()
        .from('sku')
        .where('sku_id = :skuId', { skuId })
        .execute();
    });
  }
}
