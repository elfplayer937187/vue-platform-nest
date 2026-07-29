import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessException, ErrorCode } from '../../common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: { message: any }): any {
    if (err || !user) {
      throw new BusinessException(
        info?.message === 'jwt expired'
          ? ErrorCode.INVALID_TOKEN
          : ErrorCode.NEED_LOGIN,
      );
    }
    return user;
  }
}
