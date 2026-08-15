import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class UserAvatarDto {
  @ApiProperty({ description: '用户id', example: 1786186140539 })
  @IsNumber()
  @IsNotEmpty({ message: '用户ID不为空' })
  userId: number;

  @ApiProperty({
    description: '用户头像',
    example: '/api/uploads/img/sph/20260802/1785674965333-1870.png',
  })
  @MaxLength(255)
  @IsString({ message: '不是字符串类型' })
  avatar: string;
}
