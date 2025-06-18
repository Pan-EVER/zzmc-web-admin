<template>
  <a-layout-header class="layout-header">
    <div class="header-left">
      <MenuUnfoldOutlined
        v-if="collapsed"
        class="trigger"
        @click="() => $emit('update:collapsed', false)"
      />
      <MenuFoldOutlined
        v-else
        class="trigger"
        @click="() => $emit('update:collapsed', true)"
      />
      <a-breadcrumb>
        <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.title }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="header-right">
      <a-dropdown>
        <a class="user-dropdown" @click.prevent>
          <a-avatar>
            <template #icon><UserOutlined /></template>
          </a-avatar>
          <span class="username">管理员</span>
        </a>
        <template #overlay>
          <a-menu>
            <a-menu-item key="profile">
              <UserOutlined />
              <span>个人信息</span>
            </a-menu-item>
            <!-- <a-menu-item key="settings">
              <SettingOutlined />
              <span>系统设置</span>
            </a-menu-item> -->
            <a-menu-divider />
            <a-menu-item key="logout" @click="handleLogout">
              <LogoutOutlined />
              <span>退出登录</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import type { BreadcrumbItem } from '../types'

const props = defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()
const route = useRoute()

// 计算面包屑数据
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = []
  let currentPath = ''

  route.matched.forEach((route) => {
    currentPath += route.path
    if (route.meta?.title) {
      items.push({
        path: currentPath,
        title: route.meta.title as string
      })
    }
  })

  return items
})

const handleLogout = () => {
  // 实现登出逻辑
  router.push('/login')
}
</script>

<style scoped>
.layout-header {
  padding: 0 24px 0 0;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
}

.trigger {
  padding: 0 24px;
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: var(--primary-color);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.user-dropdown:hover {
  background: rgba(0, 0, 0, 0.025);
}

.username {
  margin-left: 8px;
  color: rgba(0, 0, 0, 0.85);
}
</style>
