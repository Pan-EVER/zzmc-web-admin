import { type IButtonMenu, type IDomEditor } from '@wangeditor/editor'
import { message } from 'ant-design-vue'

/**
 * 图片菜单配置接口
 */
export interface ImageMenuConfig {
  title: string
  iconSvg: string
  key: string
  className: string
  applyStyles: (parentDiv: HTMLElement) => void
}

/**
 * 抽象图片菜单基类（模板方法模式）
 * 封装了图片菜单的通用逻辑，具体的样式设置由子类实现
 */
export abstract class BaseImageMenu implements IButtonMenu {
  abstract title: string
  abstract iconSvg: string
  tag = 'button'

  getValue(editor: IDomEditor): string | boolean {
    return ''
  }

  isActive(editor: IDomEditor): boolean {
    return false
  }

  isDisabled(editor: IDomEditor): boolean {
    return false
  }

  exec(editor: IDomEditor, value: string | boolean): void {
    if (this.isDisabled(editor)) return

    try {
      const targetImage = this.findTargetImage(editor)
      if (!targetImage) {
        message.warning('未找到图片，请确保光标在图片附近')
        return
      }

      const parentElement = this.getImageParentElement(targetImage)
      if (!parentElement) {
        message.warning('未找到图片的父元素')
        return
      }

      this.applyImageStyles(parentElement)
    } catch (error) {
      console.error('设置图片样式时出错:', error)
      message.error('操作失败，请重试')
    }
  }

  /**
   * 查找目标图片元素
   */
  private findTargetImage(editor: IDomEditor): HTMLImageElement | null {
    const editorContainer = editor.getEditableContainer()
    if (!editorContainer) {
      message.warning('无法获取编辑器容器')
      return null
    }

    const selection = editor.selection
    if (!selection) {
      message.warning('请先选中一张图片')
      return null
    }

    const images = editorContainer.querySelectorAll('img')
    let targetImage: HTMLImageElement | null = null

    // 尝试通过选区找到对应的图片
    for (const img of images) {
      const imgElement = img as HTMLImageElement
      if (this.isImageInSelection(imgElement, selection)) {
        targetImage = imgElement
        break
      }
    }

    // 如果没有找到选中的图片，尝试获取最后一个图片
    if (!targetImage && images.length > 0) {
      targetImage = images[images.length - 1] as HTMLImageElement
    }

    return targetImage
  }

  /**
   * 获取图片的第一个父元素p标签（通常是p标签）
   */
  private getImageParentElement(targetImage: HTMLImageElement): HTMLElement | null {
    const parentElement = targetImage.parentElement?.parentElement?.parentElement

    if (parentElement) {
      console.log('找到图片父元素:', {
        element: parentElement,
        tagName: parentElement.tagName,
        nodeType: parentElement.nodeType,
      })
      return parentElement
    }

    console.log('未找到图片的父元素')
    return null
  }

  /**
   * 检查图片是否在当前选区内
   * TODO: 实现过于简单，后续可能需完善
   */
  private isImageInSelection(img: HTMLImageElement, selection: any): boolean {
    try {
      return img && img.offsetParent !== null
    } catch {
      return false
    }
  }

  /**
   * 抽象方法：应用图片样式
   * 由子类实现具体的样式设置逻辑
   */
  protected abstract applyImageStyles(parentElement: HTMLElement): void
}

/**
 * 配置驱动的图片菜单类
 * 通过配置对象来创建不同的图片菜单
 */
export class ConfigurableImageMenu extends BaseImageMenu {
  title: string
  iconSvg: string
  private config: ImageMenuConfig

  constructor(config: ImageMenuConfig) {
    super()
    this.config = config
    this.title = config.title
    this.iconSvg = config.iconSvg
  }

  protected applyImageStyles(parentElement: HTMLElement): void {
    // 清除所有可能存在的浮动样式类
    parentElement.classList.remove('img-float-left', 'img-float-right', 'img-center')

    // 应用配置中定义的样式
    this.config.applyStyles(parentElement)

    // 添加配置中指定的类名
    if (this.config.className) {
      parentElement.classList.add(this.config.className)
    }
  }
}

/**
 * 创建菜单配置的工厂函数（继承模式）
 */
export function createImageMenuConfig<T extends BaseImageMenu>(
  MenuClass: new () => T,
  key: string,
) {
  return {
    key,
    factory() {
      return new MenuClass()
    },
  }
}

/**
 * 创建配置驱动菜单的工厂函数
 */
export function createConfigurableImageMenu(config: ImageMenuConfig) {
  return {
    key: config.key,
    factory() {
      return new ConfigurableImageMenu(config)
    },
  }
}
