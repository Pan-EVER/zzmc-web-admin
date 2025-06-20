import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '../types'
import {
  FileOutlined,
  FileImageOutlined,
  HomeOutlined,
  AppstoreOutlined,
  ReadOutlined,
  SnippetsOutlined,
} from '@ant-design/icons-vue'

// 图标映射配置
const iconMap: Record<string, any> = {
  'home-manage': HomeOutlined,
  product: AppstoreOutlined,
  case: SnippetsOutlined,
  news: ReadOutlined,
  patent: FileImageOutlined,
  file: FileOutlined,
}

// 将路由配置转换为菜单项
export function routesToMenuItems(routes: RouteRecordRaw[]): MenuItem[] {
  return routes
    .filter((route) => {
      // 过滤掉不显示在菜单中的路由
      const { meta } = route
      return meta?.showMenu !== false
    })
    .map((route) => {
      const menuItem: MenuItem = {
        key: route.name as string,
        label: (route.meta?.title as string) || (route.name as string),
        route: route.path,
        icon: iconMap[route.name as string],
      }

      // 处理子路由
      if (route.children && route.children.length > 0) {
        const children = routesToMenuItems(route.children)
        if (children.length > 0) {
          menuItem.children = children
        }
      }

      return menuItem
    })
}
