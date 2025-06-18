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
import { ref, watch } from 'vue'
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

// 根据当前路由更新选中的菜单项
watch(
  () => route.path,
  (path) => {
    const findMenuKeys = (items: MenuItem[]): string[] => {
      for (const item of items) {
        if (item.route === path) {
          return [item.key]
        }
        if (item.children) {
          const childKeys = findMenuKeys(item.children)
          if (childKeys.length > 0) {
            return [item.key, ...childKeys]
          }
        }
      }
      return []
    }

    const keys = findMenuKeys(menuItems)
    if (keys.length > 0) {
      selectedKeys.value = [keys[keys.length - 1]]
      openKeys.value = keys.slice(0, -1)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.layout-menu {
  height: calc(100vh - 64px);
  border-right: none;
}
</style>