import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
  user_id: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      // ⚠️ 重点：从 Token 头读取（不是标准的 Authorization: Bearer）
      jwtFromRequest: ExtractJwt.fromHeader('token'),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.secret'),
    });
  }

  /**
   * Token 解析成功后调用
   * 返回值会自动挂到 req.user
   */
  validate(payload: JwtPayload) {
    return {
      userId: payload.user_id,
      username: payload.username,
    };
  }
}
