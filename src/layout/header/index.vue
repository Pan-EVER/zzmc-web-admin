<template>
  <a-layout-header class="layout-header">
    <div class="header-left">
      <MenuUnfoldOutlined
        v-if="collapsed"
        class="trigger"
        @click="() => $emit('update:collapsed', false)"
      />
      <MenuFoldOutlined v-else class="trigger" @click="() => $emit('update:collapsed', true)" />
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
          <span class="username">{{ username || '--' }}</span>
        </a>
        <template #overlay>
          <a-menu>
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
  LogoutOutlined,
} from '@ant-design/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import { computed, onMounted, ref } from 'vue'
import type { BreadcrumbItem } from '../types'

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  'update:collapsed': [value: boolean]
}>()

const router = useRouter()
const route = useRoute()

const username = ref<string | null>(null)

onMounted(() => {
  username.value = JSON.parse(localStorage.getItem('username') || 'null')
})

// 计算面包屑数据
const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const items: BreadcrumbItem[] = []
  let currentPath = ''

  route.matched.forEach((route) => {
    currentPath += route.path
    if (route.meta?.title) {
      items.push({
        path: currentPath,
        title: route.meta.title as string,
      })
    }
  })

  return items
})

const handleLogout = () => {
  // 实现登出逻辑
  localStorage.setItem('loginTime', JSON.stringify(null))
  localStorage.setItem('username', JSON.stringify(null))
  router.push('/login')
}
</script>

<style scoped>
.layout-header {
  z-index: 1;
  display: flex;
  padding: 0 24px 0 0;
  background: #fff;
  box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  align-items: center;
  justify-content: space-between;
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
  background: rgb(0 0 0 / 2.5%);
}

.username {
  margin-left: 8px;
  color: rgb(0 0 0 / 85%);
}
</style>
