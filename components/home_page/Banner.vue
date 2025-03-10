<template>
  <div>
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
            <h2 class="text-h4 font-weight-bold mb-4 gradient-text outfit outfit-bold">Experience a new way of learning with the power of AI</h2>
            <p class="text-body-1 mb-6 text-grey-lighten-4 outfit outfit-regular">For students, teachers, and professionals</p>
            <div class="d-flex gap-4">
              <NuxtLink to="/library">
                <v-btn 
                  rounded="xl" 
                  variant="outlined" 
                  color="white" 
                  class="text-white animated-btn outfit outfit-medium"
                  height="48"
                >
                  <span class="d-flex align-center">
                    AI Flashcard
                    <v-icon class="ms-2 btn-icon">mdi-book-open-page-variant</v-icon>
                  </span>
                </v-btn>
              </NuxtLink> 
              <NuxtLink to="/about">
                <v-btn 
                  rounded="xl" 
                  variant="outlined" 
                  color="white" 
                  class="text-white animated-btn-alt outfit outfit-medium"
                  height="48"
                >
                  <span class="d-flex align-center">
                    AI Quizzes
                    <v-icon class="ms-2 btn-icon">mdi-robot</v-icon>
                  </span>
                </v-btn>
              </NuxtLink>
            </div>
          </div>
        </div>
      </v-card>
    </v-col>

    <!-- Add section divider below the banner -->
     <div class="mt-8 mx-10">
      <SectionDivider />
     </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import SectionDivider from '../SectionDivider.vue';

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
/* Import Outfit font */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Outfit font classes */
.outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-regular { font-weight: 400; }
.outfit-medium { font-weight: 500; }
.outfit-bold { font-weight: 700; }

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

/* Updated button hover styles to match Future2.vue */
.animated-btn, .animated-btn-alt {
  transition: all 0.3s ease;
  border-width: 2px;
  position: relative;
  overflow: hidden;
  min-width: 160px;
  padding: 0 20px !important;
  box-shadow: none;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}

.animated-btn:hover::before {
  left: 100%;
}

.animated-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

.animated-btn-alt:hover {
  background-color: white;
  color: #69247C !important;
  transform: translateY(-3px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon, .animated-btn-alt:hover .btn-icon {
  transform: translateX(5px);
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