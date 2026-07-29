import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @IsString()
  @ApiProperty({ description: '用户名', example: 'elf12' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '昵称' })
  @IsString()
  @IsNotEmpty({ message: '姓名不为空' })
  name: string;

  @IsNotEmpty({ message: '密码不为空' })
  @ApiProperty({ description: '密码' })
  @MinLength(6, { message: '密码不能少于5位数' })
  password: string;
}
