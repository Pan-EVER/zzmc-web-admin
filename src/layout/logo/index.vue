<template>
  <div class="logo" :class="{ collapsed: collapsed }">
    <img src="@/assets/images/logo1-new.png" alt="logo" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  collapsed: boolean
}>()
</script>

<style scoped>
.logo {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  background: #fff;
  transition: all 0.2s;
}

.logo img {
  width: 80%;
}

.logo h1 {
  margin: 0 0 0 12px;
  color: rgba(0, 0, 0, 0.88);
  font-weight: 600;
  font-size: 18px;
  line-height: 32px;
  overflow: hidden;
}

.logo.collapsed h1 {
  display: none;
}
</style>
