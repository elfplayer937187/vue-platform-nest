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
    //属于404错误
    if (exception instanceof HttpException && exception.getStatus() === 404) {
      response.status(404).json({
        code: 404,
        message: `接口${request.method}-${request.url}不存在`,
        data: null,
        ok: false,
      });
    }
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
