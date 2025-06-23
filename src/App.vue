<script setup lang="ts">
import { useRoute } from 'vue-router'
import Layout from './layout/index.vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { computed } from 'vue'

const route = useRoute()
const isLoginPage = computed(() => {
  return route.name === 'login'
})
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
    <RouterView v-if="isLoginPage" />
    <Layout v-else>
      <RouterView />
    </Layout>
  </a-config-provider>
</template>

<style scoped></style>
