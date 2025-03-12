<template>
  <div class="mx-12 mt-10">
    <v-row align="stretch" justify="space-between">
      <v-col 
        v-for="(card, index) in cards" 
        :key="index" 
        cols="12" 
        md="4" 
        class="text-center"
        v-motion
        :initial="{ opacity: 0, y: 100 }"
        :enter="{ opacity: 1, y: 0, transition: { delay: 100 * index, duration: 700 } }"
      >
        <v-card class="d-flex flex-column fill-height text-center feature-card" elevation="2">
          <v-card-item>
            <div :style="{ backgroundColor: card.color }" class="icon-circle mb-3 animate-pulse">
              <img :src="card.icon" alt="icon" class="icon-img" />
            </div>
            <v-card-title class="font-weight-bold text-primary">{{ card.title }}</v-card-title>
            <v-card-text class="text-medium-emphasis">{{ card.subtitle }}</v-card-text>
          </v-card-item>
          <v-card-actions class="justify-center">
            <NuxtLink to="/about" class="text-decoration-none">
              <v-btn 
                variant="outlined" 
                rounded="xl" 
                color="black" 
                class="ma-2 pa-5 align-center d-flex justify-center button-hover"
              >
                Explore Features
                <v-icon class="ml-2 button-icon">mdi-arrow-right</v-icon>
              </v-btn>
            </NuxtLink>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
const cards = [
  {
    icon: "/icons/11.png",  
    color: "#FFEBCF",  
    title: "Transform the Way You Learn with AI-Powered Tools!",
    subtitle: "Generate flashcards, quizzes, and summaries instantly. Perfect for students, teachers, and professionals!",
  },
  {
    icon: "/icons/22.png",
    color: "#FFCFD9",  
    title: "Practice & Master",
    subtitle: "Strengthen your understanding with in-depth explanations and tailored content.",
  },
  {
    icon: "/icons/33.png",
    color: "#CAFAFF",  
    title: "Study & Collaborate",
    subtitle: "Easily share your generated content with peers or instructors for better group study.",
  },
];
</script>

<style scoped>
.feature-card {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 16px;
  height: 100%;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.icon-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px; 
  margin: 0 auto;
  border-radius: 10%;
  position: relative;
  overflow: hidden;
  will-change: transform;
}

.animate-pulse {
  position: relative;
  overflow: hidden;
}

.animate-pulse::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(255,255,255,0) 0%, 
    rgba(255,255,255,0.2) 50%, 
    rgba(255,255,255,0) 100%
  );
  transform: translateX(-100%) translateY(100%);
  animation: shine 6s infinite cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform;
}

@keyframes shine {
  0% { 
    transform: translateX(-150%) translateY(150%); 
    opacity: 0;
  }
  15% { 
    opacity: 0.4;
  }
  25% { 
    transform: translateX(100%) translateY(-100%); 
    opacity: 0;
  }
  100% { 
    transform: translateX(100%) translateY(-100%); 
    opacity: 0;
  }
}

.icon-img {
  width: 60%;  
  height: 60%; 
  object-fit: contain;
  transition: transform 0.3s ease;
}

.feature-card:hover .icon-img {
  transform: scale(1.1);
}

.button-hover {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.button-hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 70%;
  height: 100%;
  background: linear-gradient(
    90deg, 
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.15) 50%,
    rgba(255,255,255,0) 100%
  );
  transition: all 0.6s cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform;
}

.button-hover:hover::before {
  left: 130%;
}

.button-hover:hover .button-icon {
  transform: translateX(5px);
}

.button-icon {
  transition: transform 0.3s ease;
}
</style>