<script setup lang="ts">
import Layout from './layout/index.vue'
</script>

<template>
  <a-config-provider :theme="{
    token: {
      colorPrimary: '#efe058',
    },
  }">
    <Layout>
      <RouterView />
    </Layout>
  </a-config-provider>
</template>

<style scoped></style>
