import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({ message: 'username不能为空' })
  @ApiProperty({ description: '用户名称' })
  @IsString()
  username: string;

  @MinLength(6, { message: '密码不小于6位数' })
  @ApiProperty({ description: '用户名称' })
  @IsString()
  password: string;
}
