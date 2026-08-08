import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    // 判断是否需要校验:不是构造函数，或者构造函数是基本类型
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }
    // 需要校验
    const valueClass = plainToInstance(metadata.metatype, value) as object;
    const errors: ValidationError[] = await validate(valueClass);

    // 有错误
    if (errors.length > 0) {
      throw new BadRequestException({
        code: 400,
        message: this.formatErrors(errors),
        data: null,
        ok: false,
      });
    }

    // 返回转换后的实例，确保控制器接收到正确的 DTO 对象
    return valueClass;
  }

  //判断是否为基础类型，是就返回false，不做基础校验
  private toValidate(metaType: Type<any>): boolean {
    const baseTypeList: Type<any>[] = [Boolean, String, Number, Object, Array];
    return !baseTypeList.includes(metaType);
  }
  // 将校验出来的结果平铺
  private formatErrors(errors: ValidationError[]): string {
    const failedMessages: string[] = [];
    for (const error of errors) {
      if (error.constraints) {
        failedMessages.push(...Object.values(error.constraints));
      }
      if (error.children && error.children.length > 0) {
        failedMessages.push(this.formatErrors(error.children));
      }
    }
    return failedMessages.join(';');
  }
}
