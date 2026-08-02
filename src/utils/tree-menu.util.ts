import { Menu } from '../modules/menu/entity/menu.entity';

/**
 *@param menuList - 平铺的menu表
 *@returns tree - 组装好的树形menu
 */
export function BuildTreeMenu(menuList: Menu[]) {
  const tree: Menu[] = [];
  menuList.forEach((menu: Menu) => {
    // 找到根节点
    if (menu.pid === 0) {
      // 返回子节点拼装好的根节点
      tree.push(BuildTreeNodeChain(menu, menuList));
    }
  });
  return tree;
}

/**
 *
 * @param root -根节点
 * @param menuList -平铺的menu表
 *
 * @returns - 返回组装好的root
 */
function BuildTreeNodeChain(root: Menu, menuList: Menu[]) {
  // 根节点没有children就分配数组
  if (!root.children) {
    root.children = [];
  }
  // 组装root的下一代
  menuList.forEach((menu: Menu) => {
    if (menu.pid === root.menuId) {
      root.children.push(BuildTreeNodeChain(menu, menuList));
    }
  });
  return root;
}
