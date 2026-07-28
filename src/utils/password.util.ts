import * as bcrypt from 'bcrypt';
const SALT_ROUND = 10;

// 加密密码
export function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUND);
}

// 验证密码
export function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
