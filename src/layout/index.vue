<template>
  <a-layout class="layout-container">
    <a-layout-sider v-model:collapsed="layoutState.collapsed" :trigger="null">
      <Logo :collapsed="layoutState.collapsed" />
      <Menu :collapsed="layoutState.collapsed" />
    </a-layout-sider>
    <a-layout>
      <Header v-model:collapsed="layoutState.collapsed" />
      <a-layout-content class="layout-content">
        <slot></slot>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
import Header from './header/index.vue'
import type { LayoutState } from './types'

// 布局状态
const layoutState = reactive<LayoutState>({
  collapsed: false,
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-content {
  margin: 16px;
  padding: 16px;
  background: #fff;
  height: calc(100vh - 64px - 32px); /* 减去头部高度(64px)和上下边距(32px) */
  overflow-y: auto;
}
</style>
