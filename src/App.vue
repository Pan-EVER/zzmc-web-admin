<script setup lang="ts">
import Layout from './layout/index.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
</script>

<template>
  <a-config-provider
    :locale="zhCN"
    :theme="{
      token: {
        colorPrimary: '#efe058',
      },
    }"
  >
    <Layout>
      <RouterView />
    </Layout>
  </a-config-provider>
</template>

<style scoped></style>
