import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty({ description: '角色id' })
  @IsNumber()
  @IsNotEmpty({ message: 'roleId不为空' })
  @Transform(({ value }) => Number(value))
  roleId: number;

  @ApiProperty({ description: '菜单的id', type: [Number], example: [1, 2, 3] })
  @IsArray({ message: '必须是数组' })
  @Transform(({ value }): unknown => {
    // 如果是string类型
    if (typeof value === 'string') {
      return value.split(',').map((chr) => Number(chr));
    }
    // 如果是数组类型
    if (value instanceof Array) {
      return value.map((chr) => Number(chr));
    }
    return value;
  })
  permissionId: number[];
}
