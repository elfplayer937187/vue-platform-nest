import { HttpStatus, HttpException } from '@nestjs/common';
import { ErrorCode, ErrorMessages } from '../enums/error-code.enum';
// 业务错误
export class BusinessException extends HttpException {
  constructor(code: ErrorCode) {
    // 第一个参数是响应体结构,第二个是设置的状态码
    super(
      {
        ok: false,
        data: null,
        message: ErrorMessages[code],
        code,
      },
      HttpStatus.OK,
    );
  }
}
