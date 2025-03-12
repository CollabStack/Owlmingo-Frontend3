<template>
  <div class="section-divider">
    <div class="divider-line"></div>
    <v-icon :icon="icon" :color="iconColor" :size="iconSize"></v-icon>
    <div class="divider-line"></div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-owl'
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  iconSize: {
    type: String,
    default: '28px'
  }
});
</script>

<style scoped>
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  /* margin: 3rem auto; */
  /* width: 80%; */
}

.divider-line {
  flex-grow: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(26, 35, 126, 0.5), transparent);
}

.v-icon {
  margin: 0 15px;
}
</style>