import { registerAs } from '@nestjs/config';
export default registerAs('register', () => ({
  // 注册用户默认挂的角色名,角色不存在时注册接口会直接报错
  defaultRoleName: process.env.DEFAULT_ROLE_NAME || '普通用户',
}));
