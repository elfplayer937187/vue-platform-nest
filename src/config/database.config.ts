import { registerAs } from '@nestjs/config';

// 创建命名空间
export default registerAs('database', () => ({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root123456',
  database: process.env.DB_DATABASE || 'vue3_admin',
}));
