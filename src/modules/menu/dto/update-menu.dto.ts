import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateMenuDto {
  @ApiProperty({ description: '菜单的id' })
  @IsNumber()
  @IsNotEmpty({ message: 'menuId不能为空' })
  menuId: number;

  @ApiProperty({ description: '父级id' })
  @IsNumber()
  @IsNotEmpty({ message: '父级id不能为空' })
  pid: number;

  @ApiProperty({ description: '菜单名称' })
  @IsString()
  @IsNotEmpty({ message: '菜单名称不为空' })
  name: string;

  @ApiProperty({ description: '权限标识码' })
  @IsString()
  @IsNotEmpty({ message: '权限标识码不为空' })
  code: string;

  @ApiProperty({ description: '层级' })
  @IsNumber()
  @IsNotEmpty({ message: '层级level不能为空' })
  level: number;
}
