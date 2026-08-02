import { ApiProperty } from '@nestjs/swagger';
// import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateTrademarkDto {
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

  @ApiProperty({ description: '品牌id' })
  @IsNumber()
  @IsNotEmpty({ message: '品牌id不为空' })
  // @Transform(({ value }): number => {
  //   if (typeof value === 'string') {
  //     return Number(value);
  //   }
  //   return value;
  // })
  tmId: number;
}
