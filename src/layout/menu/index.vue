<template>
  <a-menu
    v-model:selectedKeys="selectedKeys"
    v-model:openKeys="openKeys"
    mode="inline"
    :inline-collapsed="collapsed"
    class="layout-menu"
  >
    <template v-for="item in menuItems" :key="item.key">
      <template v-if="item.children">
        <a-sub-menu :key="item.key">
          <template #icon>
            <component :is="item.icon" />
          </template>
          <template #title>{{ item.label }}</template>
          <a-menu-item
            v-for="child in item.children"
            :key="child.key"
            @click="handleMenuClick(child)"
          >
            <template #icon>
              <component :is="child.icon" />
            </template>
            {{ child.label }}
          </a-menu-item>
        </a-sub-menu>
      </template>
      <template v-else>
        <a-menu-item :key="item.key" @click="handleMenuClick(item)">
          <template #icon>
            <component :is="item.icon" />
          </template>
          {{ item.label }}
        </a-menu-item>
      </template>
    </template>
  </a-menu>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { MenuItem } from '../types'
import { routesToMenuItems } from './utils'

const props = defineProps<{
  collapsed: boolean
}>()

const router = useRouter()
const route = useRoute()

const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

// 从路由配置生成菜单项
const menuItems = routesToMenuItems(router.options.routes)

const handleMenuClick = (item: MenuItem) => {
  if (item.route) {
    router.push(item.route)
  }
}

// 查找菜单项的key
const findMenuKeys = (path: string, items: MenuItem[]): string[] => {
  for (const item of items) {
    if (item.route === path) {
      return [item.key]
    }
    if (item.children) {
      const childKeys = findMenuKeys(path, item.children)
      if (childKeys.length > 0) {
        return [item.key, ...childKeys]
      }
    }
  }
  return []
}

// 更新选中的菜单项
const updateSelectedKeys = (path: string) => {
  const keys = findMenuKeys(path, menuItems)
  if (keys.length > 0) {
    selectedKeys.value = [keys[keys.length - 1]]
    openKeys.value = keys.slice(0, -1)
  } else if (path === '/') {
    // 如果是根路径，默认选中home-manage
    const homeKeys = findMenuKeys('/home-manage', menuItems)
    if (homeKeys.length > 0) {
      selectedKeys.value = [homeKeys[homeKeys.length - 1]]
      openKeys.value = homeKeys.slice(0, -1)
    }
  }
}

// 监听路由变化
watch(
  () => route.path,
  (path) => {
    updateSelectedKeys(path)
  },
  { immediate: true }
)

// 组件挂载时设置默认选中项
onMounted(() => {
  updateSelectedKeys(route.path)
})
</script>

<style scoped>
.layout-menu {
  height: calc(100vh - 64px);
  border-right: none;
}
</style>
