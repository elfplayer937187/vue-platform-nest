import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

// 单个属性值
export class AttrValueItemDto {
  @ApiProperty({ description: '属性值ID(更新时必传)', required: false })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  attrValueId?: number;

  @ApiProperty({ description: '属性值名称' })
  @IsNotEmpty({ message: '属性值名称不能为空' })
  @IsString()
  valueName: string;
}

// 保存属性（新增/更新共用）
export class SaveAttrDto {
  @ApiProperty({
    description: '属性ID(更新时传，新增时不传)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number(value))
  attrId?: number;

  @ApiProperty({ description: '属性名称' })
  @IsNotEmpty({ message: '属性名称不能为空' })
  @IsString()
  attrName: string;

  @ApiProperty({ description: '所属三级分类ID' })
  @IsNotEmpty({ message: '分类ID不能为空' })
  @IsNumber()
  @Transform(({ value }) => Number(value))
  categoryId: number;

  @ApiProperty({ description: '分类级别', example: 3 })
  @IsNotEmpty({ message: '分类级别不能为空' })
  @IsNumber()
  categoryLevel: number;

  @ApiProperty({ description: '属性值列表', type: [AttrValueItemDto] })
  @IsArray()
  attrValueList: AttrValueItemDto[];
}
