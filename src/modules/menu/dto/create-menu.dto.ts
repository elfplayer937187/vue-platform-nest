import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称' })
  @IsNotEmpty({ message: '菜单名称不能为空' })
  @IsString()
  name: string;

  @ApiProperty({ description: '父菜单ID，0=根节点', example: 0 })
  @IsNotEmpty()
  @IsNumber()
  pid: number;

  @ApiProperty({ description: '路由路径或权限标识码' })
  @IsNotEmpty({ message: '权限标识不能为空' })
  @IsString()
  code: string;

  @ApiProperty({
    description: '类型：1=菜单，2=按钮',
    example: 1,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  type?: number;

  @ApiProperty({ description: '层级：1/2/3=各级菜单，4=按钮权限', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  level: number;
}
