import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({ description: '角色id' })
  @IsNumber()
  @IsEmpty({ message: '角色id不为空' })
  roleId: number;

  @ApiProperty({ description: '角色名称' })
  @IsString()
  @IsEmpty({ message: '角色名称不为空' })
  roleName: string;

  @ApiProperty({ description: '备注', required: false })
  @IsString()
  @IsOptional()
  remark?: string;
}
