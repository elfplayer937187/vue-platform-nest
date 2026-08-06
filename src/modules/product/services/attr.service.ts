import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Attr } from '../entities/Attr.entity';
import { DataSource, Repository } from 'typeorm';
import { AttrValue } from '../entities/Attr-value.entity';
import { SaveAttrDto } from '../dto/save-attr.dto';

@Injectable()
export class AttrService {
  constructor(
    @InjectRepository(Attr) private attrRepository: Repository<Attr>,
    @InjectRepository(AttrValue)
    private attrValueRepository: Repository<AttrValue>,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  // 根据三级分类查询属性列表
  async GetAttrList(
    category1Id: number,
    category2Id: number,
    category3Id: number,
  ) {
    // 直接找三级分类的
    const AttrList = await this.attrRepository.find({
      where: { categoryId: category3Id, categoryLevel: 3 },
      order: { id: 'ASC' },
    });
    // 根据Attr找出Attr对应的Values
    for (const attr of AttrList) {
      attr.attrValueList = await this.attrValueRepository.find({
        where: { attrId: attr.attrId },
        order: { id: 'ASC' },
      });
    }
    return AttrList;
  }

  // 新增属性
  async createAttr(dto: SaveAttrDto) {
    const attrId = new Date().getTime();
    // 进行多表新增,要么全部成功要么全部失败
    await this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .insert()
        .into('attr')
        .values({
          attrId: attrId,
          attrName: dto.attrName,
          categoryId: dto.categoryId,
          categoryLevel: dto.categoryLevel,
        })
        .execute();

      if (dto.attrValueList && dto.attrValueList.length > 0) {
        const values = dto.attrValueList.map((attrValue) => ({
          attrValueId: new Date().getTime() + Math.floor(Math.random() * 1000),
          valueName: attrValue.valueName || '未知姓名',
          attrId: attrValue.attrValueId,
        }));
        await manager
          .createQueryBuilder()
          .insert()
          .into('attr_value')
          .values(values)
          .execute();
      }
    });
    return null;
  }

  // 更新属性
  async updateAttr(dto: SaveAttrDto) {
    await this.dataSource.transaction(async (manager) => {
      // 更新Attr
      await manager
        .createQueryBuilder()
        .update('attr')
        .set({
          attrName: dto.attrName,
          categoryId: dto.categoryId,
          categoryLevel: dto.categoryLevel,
        })
        .where('attr.attr_id=:id', { id: dto.id })
        .execute();

      const existId: number[] = [];
      for (const attrValue of dto.attrValueList) {
        if (attrValue.attrValueId) {
          // 更新
          existId.push(attrValue.attrValueId);
          await manager
            .createQueryBuilder()
            .update('attr_value')
            .set({ valueName: attrValue.valueName })
            .where('attr_id=:id', { id: attrValue.attrValueId })
            .execute();
        } else {
          const newId = new Date().getTime() + Math.floor(Math.random() * 1000);
          existId.push(newId);
          await manager
            .createQueryBuilder()
            .insert()
            .into('attr_value')
            .values({
              attrValueId: newId,
              valueName: attrValue.valueName,
              attrId: dto.id,
            })
            .execute();
        }
      }
      // 删除属性

      // 删除不在本次传入列表中的旧属性值
      if (existId.length > 0) {
        await manager
          .createQueryBuilder()
          .delete()
          .from('attr_value')
          .where('attr_value_id NOT IN ...(:existId)', { existId })
          .execute();
      } else {
        await manager
          .createQueryBuilder()
          .delete()
          .from('attr_value')
          .where('attr_id=:id', { id: dto.id })
          .execute();
      }
    });
    return null;
  }

  // 删除属性
  async deleteAttr(AttrId: number) {
    // 先删除属性值，再删除属性
    await this.dataSource.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .delete()
        .from('attr_value')
        .where('attr_id=:AttrId', { AttrId })
        .execute();

      await manager
        .createQueryBuilder()
        .delete()
        .from('attr')
        .where('attr_id=:Attr', { Attr })
        .execute();
    });
    return null;
  }
}
