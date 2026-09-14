export enum ErrorCode {
  SUCCESS = 200,
  INVALID_PARAM = 201,
  USER_EXIST = 202,
  USER_NOT_EXIST = 203,
  INVALID_PASSWORD = 204,
  SERVER_BUSY = 205,
  INVALID_TOKEN = 206,
  NEED_LOGIN = 207,
  MENU_NODE_EXIST = 208,
  NO_ROUTE = 209,
  NO_SKU = 210,
  PASSWORD_NOT_MATCH = 211,
  DEFAULT_ROLE_NOT_EXIST = 212,
}
// 错误信息
export const ErrorMessages: Record<number, string> = {
  [ErrorCode.SUCCESS]: 'success',
  [ErrorCode.INVALID_PARAM]: '请求参数错误',
  [ErrorCode.USER_EXIST]: '用户名已存在',
  [ErrorCode.USER_NOT_EXIST]: '用户名不存在',
  [ErrorCode.INVALID_PASSWORD]: '用户名或密码错误',
  [ErrorCode.SERVER_BUSY]: '服务繁忙',
  [ErrorCode.INVALID_TOKEN]: '无效的Token',
  [ErrorCode.NEED_LOGIN]: '需要登录',
  [ErrorCode.MENU_NODE_EXIST]: '该节点下有子节点，不可以删除',
  [ErrorCode.NO_ROUTE]: '请求路径不存在',
  [ErrorCode.NO_SKU]: '该sku不存在',
  [ErrorCode.PASSWORD_NOT_MATCH]: '两次输入的密码不一致',
  [ErrorCode.DEFAULT_ROLE_NOT_EXIST]:
    '默认角色不存在,请检查DEFAULT_ROLE_NAME配置',
};
