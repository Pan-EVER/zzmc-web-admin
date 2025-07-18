import { Boot } from '@wangeditor/editor'
import { createConfigurableImageMenu } from './BaseImageMenu'
import { imageMenuConfigs } from './imageMenuConfigs'

// 使用配置驱动模式创建菜单
const customMenus = imageMenuConfigs.map(config => createConfigurableImageMenu(config))

// 记录已注册的菜单键名，防止重复注册
const registeredMenuKeys = new Set<string>()

// 注册自定义菜单
export const registerCustomMenus = () => {
  customMenus.forEach((item) => {
    // 检查菜单是否已经注册过
    if (!registeredMenuKeys.has(item.key)) {
      try {
        Boot.registerMenu(item)
        registeredMenuKeys.add(item.key)
        // console.log(`成功注册菜单: ${item.key}`)
      } catch (error) {
        console.warn(`菜单 ${item.key} 注册失败，可能已存在:`, error)
      }
    } else {
      // console.log(`菜单 ${item.key} 已存在，跳过注册`)
    }
  })
}
