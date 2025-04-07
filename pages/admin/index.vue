<script setup>
import { ref } from 'vue';
definePageMeta({
  layout: 'admin',
});
</script>

<template>
  <div class="admin-page">
    <Admin-Dashbord />
  </div>
</template>

<style scoped>
.admin-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>