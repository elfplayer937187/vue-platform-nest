import { IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty({ description: '页码' })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  page: number;

  @ApiProperty({ description: '单页限制' })
  @Min(1)
  @IsInt()
  @Type(() => Number) //Url里的字符串转成number类型f
  limit: number;
}
