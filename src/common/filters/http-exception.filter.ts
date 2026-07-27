import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // 属于业务型错误
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const ExceptionResponse = exception.getResponse();

      if (typeof ExceptionResponse === 'object') {
        response.status(status).json(ExceptionResponse);
        return;
      }
    }
    // 未知错误 → 服务繁忙
    console.error('Unhandled error:', exception);
    response.status(200).json({
      code: 205, // CodeServerBusy
      message: '服务繁忙',
      data: null,
      ok: false,
    });
  }
}
