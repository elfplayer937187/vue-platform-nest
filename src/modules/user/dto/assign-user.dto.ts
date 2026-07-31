import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsInt } from 'class-validator';

export class AssignRoleDto {
  @ApiProperty({ description: '用户id' })
  @IsInt()
  @IsNotEmpty({ message: 'userId不能为空' })
  userId: number;

  @ApiProperty({ description: '用户承担的角色id' })
  @IsArray()
  @IsNotEmpty({ message: '角色数组不为空' })
  roleIdList: number[];
}
