import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsInt } from 'class-validator';

export class BatchRemoveDto {
  @ApiProperty({
    description: '要删除的用户id列表',
    type: [Number],
  })
  @IsArray()
  @IsNotEmpty({ message: 'idList不能为空' })
  @IsInt({ each: true })
  idList: number[];
}
