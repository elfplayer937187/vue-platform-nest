import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { saleAttr } from '../entities/sale-attr.entity';
import { SaveSpuDto } from '../dto/save-spu-dto';

@Injectable()
export class SpuService {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    @InjectRepository(saleAttr)
    private saleAttrRepository: Repository<saleAttr>,
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
          category3_id: dto.category3Id,
          spu_id: spuId,
          spu_name: dto.spuName,
          description: dto.description,
          tm_id: dto.tmId,
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
              image_id: Date.now() + Math.floor(Math.random() * 10000),
              image_name: spuImg.imageName,
              image_url: spuImg.imageUrl,
              spu_id: spuId,
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
            spu_sale_attr_id: spuSaleAttrId,
            base_sale_attr_id: spuSaleAttr.BaseSaleAttrId,
            sale_attr_name: spuSaleAttr.SaleAttrName,
            spu_id: spuId,
          });

          for (const spuSaleAttrValue of spuSaleAttr.spuSaleAttrValueList) {
            saleAttrValues.push({
              sale_attr_value_id:
                Date.now() + Math.floor(Math.random() * 10000),
              sale_attr_value_name: spuSaleAttrValue.saleAttrValueName,
              sale_attr_id: spuSaleAttrId,
              spu_id: spuId,
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
}
