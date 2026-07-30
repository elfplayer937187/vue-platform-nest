import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: '用户id' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ description: '用户昵称' })
  @IsString()
  @IsNotEmpty({ message: '用户昵称不为空' })
  name: string;
}
