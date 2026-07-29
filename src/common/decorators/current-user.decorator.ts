import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
export const CurrentUser = createParamDecorator(
  (data: string, context: ExecutionContext): any => {
    // 自动获取request.user,被strategy的validate函数自动注入
    // data为获取user里面的某一项值
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
