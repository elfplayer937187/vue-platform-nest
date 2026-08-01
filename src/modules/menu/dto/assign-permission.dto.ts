import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AssignPermissionDto {
  @ApiProperty({ description: '角色id' })
  @IsNumber()
  @IsNotEmpty({ message: 'roleId不为空' })
  roleId: number;

  @ApiProperty({ description: '菜单的id', type: [Number], example: [1, 2, 3] })
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty({ message: '数组不能为空' })
  permissionId: number[];
}
