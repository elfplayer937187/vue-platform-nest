import { registerAs } from '@nestjs/config';
export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'ElfPlayer937187',
  expireIn: process.env.JWT_EXPIRES_IN || '8760h',
}));
