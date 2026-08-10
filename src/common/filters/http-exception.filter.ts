import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request: Request = ctx.getRequest<Request>();
    const response: Response = ctx.getResponse<Response>();
    // 属于业务型错误
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const ExceptionResponse = exception.getResponse();

      // 404 特殊处理
      if (status === 404) {
        response.status(404).json({
          code: 404,
          message: `接口${request.method}-${request.url}不存在`,
          data: null,
          ok: false,
        });
        return;
      }

      if (typeof ExceptionResponse === 'object') {
        response.status(status).json(ExceptionResponse);
        return;
      }

      // ExceptionResponse 是字符串的情况
      response.status(status).json({
        code: status,
        message: ExceptionResponse,
        data: null,
        ok: false,
      });
      return;
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
