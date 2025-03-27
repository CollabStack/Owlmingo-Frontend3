<template>
  <div class="progress-container mx-6 mb-6">
    <div class="d-flex align-center justify-space-between mb-2">
      <span class="text-body-2 outfit outfit-medium text-grey-darken-1">{{ selectedIndex === 0 ? 'Card' : 'Question' }} {{ currentIndex + 1 }} of {{ totalCards }}</span>
      <span class="text-body-2 outfit outfit-medium text-grey-darken-1">{{ Math.round((currentIndex / (totalCards - 1)) * 100) }}% complete</span>
    </div>
    <v-progress-linear
      :model-value="(currentIndex / (totalCards - 1)) * 100"
      color="primary"
      height="8"
      rounded
      bg-color="grey-lighten-4"
      class="progress-bar"
    ></v-progress-linear>
  </div>
</template>

<script setup>
defineProps({
  currentIndex: {
    type: Number,
    required: true
  },
  totalCards: {
    type: Number,
    required: true
  },
  selectedIndex: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-medium {
  font-weight: 500;
}

.progress-container {
  transition: all 0.3s ease;
  animation: fadeSlideDown 0.8s ease;
}

@keyframes fadeSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-bar {
  box-shadow: 0 2px 5px rgba(137, 158, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  height: 8px !important;
}

:deep(.v-progress-linear__determinate) {
  background: linear-gradient(to right, #9D7BFC, #7b83e0) !important;
  transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 1px 3px rgba(137, 158, 255, 0.2);
}
</style>
