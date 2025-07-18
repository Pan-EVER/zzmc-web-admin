import type { ImageMenuConfig } from './BaseImageMenu'

/* 配置驱动模式 */

/**
 * 图片左浮动菜单配置
 */
export const floatLeftImageConfig: ImageMenuConfig = {
  title: '图片左浮动',
  iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 3H11V11H3V3ZM13 5H21V7H13V5ZM13 9H21V11H13V9ZM3 13H21V15H3V13ZM3 17H21V19H3V17Z"/>
  </svg>`,
  key: 'customFloatLeftImage',
  className: 'img-float-left',
  applyStyles: (parentElement: HTMLElement) => {
    parentElement.style.float = 'left'
    parentElement.style.marginRight = '10px'
    parentElement.style.marginBottom = '10px'
    parentElement.style.marginLeft = '' // 清除可能存在的其他margin设置
  }
}

/**
 * 图片右浮动菜单配置
 */
export const floatRightImageConfig: ImageMenuConfig = {
  title: '图片右浮动',
  iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 3H21V11H13V3ZM3 5H11V7H3V5ZM3 9H11V11H3V9ZM3 13H21V15H3V13ZM3 17H21V19H3V17Z"/>
  </svg>`,
  key: 'customFloatRightImage',
  className: 'img-float-right',
  applyStyles: (parentElement: HTMLElement) => {
    parentElement.style.float = 'right'
    parentElement.style.marginLeft = '10px'
    parentElement.style.marginBottom = '10px'
    parentElement.style.marginRight = '' // 清除可能存在的其他margin设置
  }
}

/**
 * 图片居中菜单配置
 */
export const centerImageConfig: ImageMenuConfig = {
  title: '图片居中',
  iconSvg: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"/>
  </svg>`,
  key: 'customCenterImage',
  className: 'img-center',
  applyStyles: (parentElement: HTMLElement) => {
    parentElement.style.float = 'none'
    parentElement.style.margin = '0 auto'
    parentElement.style.marginRight = '' // 清除右浮动的margin设置
    parentElement.style.marginLeft = '' // 清除左浮动的margin设置
    parentElement.style.marginBottom = '10px'
  }
}

/**
 * 所有图片菜单配置的集合
 */
export const imageMenuConfigs = [
  floatLeftImageConfig,
  floatRightImageConfig,
  centerImageConfig
]
