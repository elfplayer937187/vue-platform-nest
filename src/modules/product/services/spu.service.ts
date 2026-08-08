import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { saleAttr } from '../entities/sale-attr.entity';
import { SaveSpuDto } from '../dto/save-spu-dto';
import { spuImageList } from '../entities/spu-image-list.entity';
import { SpuSaleAttr } from '../entities/spu-sale-attr.entity';
import { saleAttrValue } from '../entities/sale-attr-value.entity';
import { paginationReturn } from '../../../common/types/paginaton.return';
import { Spu } from '../entities/spu.entity';
@Injectable()
export class SpuService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(saleAttr)
    private saleAttrRepository: Repository<saleAttr>,
    @InjectRepository(spuImageList)
    private spuImageRepository: Repository<spuImageList>,
  ) {}

  // 获取销售属性列表
  async getBaseSaleAttrList() {
    return this.saleAttrRepository.find({ order: { id: 'ASC' } });
  }

  // 新增spu
  // 插入spu主表,插入spuImage,插入spuattrValue+属性值
  async SaveSpu(dto: SaveSpuDto) {
    //创建spuId
    const spuId = Date.now();
    await this.dataSource.transaction(async (manager) => {
      // spu主表
      await manager
        .createQueryBuilder()
        .insert()
        .into('spu')
        .values({
          category3Id: dto.category3Id,
          spuId: spuId,
          spuName: dto.spuName,
          description: dto.description,
          tmId: dto.tmId,
        })
        .execute();

      //插入spuImage
      if (dto.spuImageList && dto.spuImageList.length > 0) {
        for (const spuImg of dto.spuImageList) {
          await manager
            .createQueryBuilder()
            .insert()
            .into('spu_image_list')
            .values({
              imageId: Date.now() + Math.floor(Math.random() * 10000),
              imageName: spuImg.imageName,
              imageUrl: spuImg.imageUrl,
              spuId: spuId,
            })
            .execute();
        }
      }

      //插入销售属性和属性值
      if (dto.spuSaleAttrList && dto.spuSaleAttrList.length > 0) {
        const saleAttrs: any[] = [];
        const saleAttrValues: any[] = [];
        for (const spuSaleAttr of dto.spuSaleAttrList) {
          const spuSaleAttrId = Date.now() + Math.floor(Math.random() * 10000);
          saleAttrs.push({
            spuSaleAttrId: spuSaleAttrId,
            baseSaleAttrId: spuSaleAttr.BaseSaleAttrId,
            saleAttrName: spuSaleAttr.SaleAttrName,
            spuId: spuId,
          });

          for (const spuSaleAttrValue of spuSaleAttr.spuSaleAttrValueList) {
            saleAttrValues.push({
              saleAttrValueId: Date.now() + Math.floor(Math.random() * 10000),
              saleAttrValueName: spuSaleAttrValue.saleAttrValueName,
              saleAttrId: spuSaleAttrId,
              spuId: spuId,
            });
          }
        }
        // 插入

        if (saleAttrs.length > 0) {
          await manager
            .createQueryBuilder()
            .insert()
            .into('spu_sale_attr')
            .values(saleAttrs)
            .execute();
        }

        if (saleAttrValues.length > 0) {
          await manager
            .createQueryBuilder()
            .insert()
            .into('sale_attr_value')
            .values(saleAttrValues)
            .execute();
        }
      }
    });
    return null;
  }

  // 获取spu分页列表
  async GetSpuPagination(category3Id: number, page: number, limit: number) {
    const [records, total] = await this.dataSource
      .createQueryBuilder()
      .select('spu.spu_id', 'spuId')
      .addSelect('spu.spu_name', 'spuName')
      .addSelect('spu.description', 'description')
      .addSelect('spu.category3_id', 'category3Id')
      .addSelect('spu.tm_id', 'tmId')
      .from('spu', 'spu')
      .where('category3_id = :category3Id', { category3Id })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('id', 'ASC')
      .getRawMany()
      .then((data) => {
        return this.dataSource
          .createQueryBuilder()
          .select('COUNT(spu.spu_id)', 'spuCount')
          .from('spu', 'spu')
          .where('spu.category3_id= :category3Id', { category3Id })
          .getRawOne()
          .then((countResult: { spuCount: number }) => [
            data,
            countResult.spuCount,
          ]);
      });
    const spuInfo: paginationReturn<Spu> = {
      records: records as Spu[],
      total: total as number,
      size: limit,
      current: page,
      searchCount: true,
      pages: Math.ceil((total as number) / limit),
    };
    return spuInfo;
  }

  // 获取图片列表
  async GetImages(spuId: number) {
    return this.spuImageRepository
      .createQueryBuilder('spu')
      .where('spu.spu_id = :spuId', { spuId })
      .orderBy('id', 'ASC')
      .getRawMany();
  }

  //获取Spu销售属性列表
  async getSpuAttrList(spuId: number) {
    const spuAttrList: SpuSaleAttr[] = await this.dataSource
      .createQueryBuilder()
      .select('spu_sale_attr_id', 'spuSaleAttrId')
      .addSelect('base_sale_attr_id', 'baseSaleAttrId')
      .addSelect('sale_attr_name', 'saleAttrName')
      .addSelect('spu_id', 'spuId')
      .from('spu_sale_attr', 'spuSaleAttr')
      .where('spuSaleAttr.spu_id = :spuId', { spuId })
      .orderBy({ id: 'ASC' })
      .getRawMany();
    // 获取每一个spu
    for (const spuAttr of spuAttrList) {
      // 加载这个属性对应的属性值
      const spuAttrValueList = await this.dataSource
        .createQueryBuilder()
        .select('sale_attr_value_id', 'saleAttrValueId')
        .addSelect('sale_attr_value_name', 'saleAttrValueName')
        .addSelect('sale_attr_id', 'saleAttrId')
        .addSelect('spu_id', 'spuId')
        .from('sale_attr_value', 'saleAttrValue')
        .where('saleAttrValue.sale_attr_id = :saleAttrId', {
          saleAttrId: spuAttr.baseSaleAttrId,
        })
        .andWhere('saleAttrValue.spu_id = :spuId', { spuId })
        .getRawMany();
      spuAttr.spuSaleAttrList = spuAttrValueList;
    }
    return spuAttrList;
  }

  // 更新Spu
  async updateSpu(dto: SaveSpuDto) {
    await this.dataSource.transaction(async (manager) => {
      // 更新spu主表元素
      await manager
        .createQueryBuilder()
        .update('spu')
        .set({
          spu_name: dto.spuName,
          category3_id: dto.category3Id,
          description: dto.description,
          tm_id: dto.tmId,
        })
        .where('spu_id= :spuId', { spuId: dto.id })
        .execute();

      // 更新spuImageList
      // 先删再增,删除和spu有关联的图片列表
      await manager
        .createQueryBuilder()
        .delete()
        .from('spu_image_list')
        .where('spu_id=:spuId', { spuId: dto.id })
        .execute();

      // 新增spuimage
      if (dto.spuImageList && dto.spuImageList.length > 0) {
        for (const spuImage of dto.spuImageList) {
          await manager
            .createQueryBuilder()
            .insert()
            .into('spu_image_list')
            .values({
              image_id: Date.now() + Math.floor(Math.random() * 10000),
              image_name: spuImage.imageName,
              image_url: spuImage.imageUrl,
              spu_id: dto.id,
            })
            .execute();
        }
      }

      // 销售属性
      // 先删除再增加
      //由于是平铺数据库表所以直接根据spuId删
      await manager
        .createQueryBuilder()
        .delete()
        .from('spu_sale_attr')
        .where('spu_id=:spuId', { spuId: dto.id })
        .execute();

      await manager
        .createQueryBuilder()
        .delete()
        .from('sale_attr_value')
        .where('spu_id=:spuId', { spuId: dto.id })
        .execute();

      // 插入新的属性
      if (dto.spuSaleAttrList && dto.spuSaleAttrList.length > 0) {
        const newSpuSaleAttrList: SpuSaleAttr[] = [];
        const newSaleAttrValueList: saleAttrValue[] = [];
        for (const spuSaleAttr of dto.spuSaleAttrList) {
          newSpuSaleAttrList.push({
            spuId: dto.id!,
            saleAttrName: spuSaleAttr.SaleAttrName,
            baseSaleAttrId: spuSaleAttr.BaseSaleAttrId,
            spuSaleAttrId: Date.now() + Math.floor(Math.random() * 10000),
          });
          for (const saleAttrValue of spuSaleAttr.spuSaleAttrValueList) {
            newSaleAttrValueList.push({
              spuId: dto.id!,
              saleAttrValueId: Date.now() + Math.floor(Math.random() * 10000),
              saleAttrValueName: saleAttrValue.saleAttrValueName,
              saleAttrId: saleAttrValue.baseSaleAttrId,
            });
          }
        }
        if (newSpuSaleAttrList.length > 0) {
          await manager
            .createQueryBuilder()
            .insert()
            .into(SpuSaleAttr)
            .values(newSpuSaleAttrList)
            .execute();
        }
        if (newSaleAttrValueList.length > 0) {
          await manager
            .createQueryBuilder()
            .insert()
            .into(saleAttrValue)
            .values(newSaleAttrValueList)
            .execute();
        }
      }
    });
    return null;
  }

  // 删除spu
  async removeSpu(spuId: number) {
    // 删除4个表,spu,saleAttrValue,spuSaleAttr,spuimagelist
    // 先删除子表后删除父表
    await this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .delete()
        .from('sale_attr_value')
        .where('spu_id=:spuId', { spuId })
        .execute();
      await manager
        .createQueryBuilder()
        .delete()
        .from('spu_sale_attr')
        .where('spu_id=:spuId', { spuId })
        .execute();
      await manager
        .createQueryBuilder()
        .delete()
        .from('spu_image_list')
        .where('spu_id=:spuId', { spuId })
        .execute();
      await manager
        .createQueryBuilder()
        .delete()
        .from('spu')
        .where('spu_id=:spuId', { spuId })
        .execute();
    });
    return null;
  }
}
