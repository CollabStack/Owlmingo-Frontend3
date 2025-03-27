<template>
  <div class="d-flex flex-column flex-md-row align-md-center justify-space-between pa-6">
    <h1 class="text-h4 font-weight-bold outfit outfit-bold gradient-text mb-4 mb-md-0">{{ deckTitle }}</h1>
    <v-btn 
      class="back-btn animated-btn outfit outfit-medium d-flex align-center" 
      color="primary" 
      variant="outlined" 
      elevation="0"
      rounded="xl"
      prepend-icon="mdi-arrow-left"
      @click="$emit('back')"
    >
      Back to library
    </v-btn>
  </div>
</template>

<script setup>
defineProps({
  deckTitle: {
    type: String,
    default: 'Flashcards'
  }
});

defineEmits(['back']);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Outfit font classes */
.outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-bold {
  font-weight: 700;
}

.outfit-medium {
  font-weight: 500;
}

/* Gradient text styling for headers */
.gradient-text {
  background: linear-gradient(135deg, #7b83e0, #9D7BFC);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientShift 3s infinite alternate;
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

/* Animated button */
.animated-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border-color: rgba(123, 131, 224, 0.4);
}

.animated-btn::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(157, 123, 252, 0.2), transparent);
  transition: left 0.5s ease;
}

.animated-btn:hover::after {
  left: 100%;
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(123, 131, 224, 0.15);
  border-color: rgba(123, 131, 224, 0.8);
}
</style>
