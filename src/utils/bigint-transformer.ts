import { ValueTransformer } from 'typeorm';

/**
 * TypeORM 的 bigint 类型转换器
 * MySQL 驱动返回 bigint 时是 string 类型，使用此转换器转成 number
 */
export const bigintTransformer: ValueTransformer = {
  to: (value: number): string => {
    if (value === null || value === undefined) {
      return value;
    }
    return value.toString();
  },
  from: (value: string): number => {
    if (value === null) {
      return value;
    }
    return Number(value);
  },
};
