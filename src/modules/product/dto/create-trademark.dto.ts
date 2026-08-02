import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTrademarkDto {
  @ApiProperty({ description: '品牌名称', example: '华为' })
  @IsString()
  @IsNotEmpty({ message: '品牌名称不为空' })
  tmName: string;

  @ApiProperty({
    description: '品牌logo',
    example: '/api/uploads/img/sph/20260701/xxx.png',
  })
  @IsString()
  @IsNotEmpty({ message: '品牌logo不为空' })
  logoUrl: string;
}
