<template>
  <v-col cols="12">
    <v-card 
      color="text-primary" 
      max-width="95%" 
      class="banner-card rounded-lg bg-maya_blue mx-auto py-6"
      :style="{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }"
    >
      <div class="d-flex align-center justify-space-between flex-wrap px-3">
        <v-img
          src="/images/3d-business-children-at-a-laptop-with-a-robot-assistant.png"
          height="220"
          width="220"
          class="mb-4 mb-md-0 mr-md-6 banner-image"
          contain
          :class="{ 'animate-bounce': isHovered }"
        ></v-img>
        
        <div class="text-content" :class="{ 'fade-in': isVisible }">
          <h2 class="text-h4 font-weight-bold mb-4 gradient-text">Experience a new way of learning with the power of AI</h2>
            <p class="text-body-1 mb-6 text-grey-lighten-4">For students, teachers, and professionals</p>
          <div class="d-flex gap-4">
            <NuxtLink to="/library">
              <v-btn 
                rounded="xl" 
                variant="outlined" 
                color="white" 
                class="text-white btn-hover-effect"
                elevation="2"
                prepend-icon="mdi-book-open-page-variant"
              >
                AI Flashcard
              </v-btn>
            </NuxtLink> 
            <NuxtLink to="/about">
                <v-btn 
                rounded="xl" 
                variant="outlined" 
                color="white" 
                class="text-white btn-hover-effect"
                elevation="2"
                prepend-icon="mdi-robot"
              >
                AI Quizzes
              </v-btn>
            </NuxtLink>
          </div>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isVisible = ref(false);
const isHovered = ref(false);

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true;
  }, 300);
  
  // Animated bounce effect every 5 seconds
  setInterval(() => {
    isHovered.value = true;
    setTimeout(() => {
      isHovered.value = false;
    }, 1000);
  }, 5000);
});
</script>

<style scoped>
.text-content {
  max-width: 650px;
  text-align: left;
  transition: all 0.6s ease;
}

.gap-4 {
  gap: 1.5rem;
}

.banner-card {
  margin: 0 auto;
  padding: 2rem;
  margin-right: 14rem;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
}

.banner-image {
  transition: transform 0.5s ease;
}

.banner-card:hover {
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
}

.btn-hover-effect {
  transition: all 0.3s ease;
  border-width: 2px;
  position: relative;
  overflow: hidden;
}

.btn-hover-effect:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 14px rgba(0, 0, 0, 0.12);
}

.btn-hover-effect::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: 0.5s;
  pointer-events: none;
}

.btn-hover-effect:hover::before {
  left: 100%;
}

.gradient-text {
  background: linear-gradient(90deg, #ffffff, #e0f7fa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.fade-in {
  animation: fadeIn 0.8s ease-in;
}

.animate-bounce {
  animation: bounce 1s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@media (max-width: 960px) {
  .banner-card {
    padding: 1.5rem;
    margin-right: auto;
  }
}

@media (max-width: 600px) {
  .gradient-text {
    font-size: 1.75rem;
  }
}
</style>
