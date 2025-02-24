<template>
  <div class="mx-12 mt-10">
    <v-row align="stretch" justify="space-between">
      <v-col v-for="(card, index) in cards" :key="index" cols="12" md="4" class="text-center">
        <v-card class="d-flex flex-column fill-height text-center" elevation="2">
          <v-card-item>
            <div :style="{ backgroundColor: card.color }" class="icon-circle mb-3">
              <img :src="card.icon" alt="icon" class="icon-img" />
            </div>
            <v-card-title class="font-weight-bold text-primary">{{ card.title }}</v-card-title>
            <v-card-text class="text-medium-emphasis">{{ card.subtitle }}</v-card-text>
          </v-card-item>
          <v-card-actions class="justify-center">
            <NuxtLink to="/about" class="text-decoration-none">
              <v-btn variant="outlined" rounded="xl" color="black" class="ma-2 pa-5 align-center  d-flex justify-center">Explore Features</v-btn>
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
    icon: "/icons/icons8-ai-480 1.png",  
    color: "#FFEBCF",  
    title: "Transform the Way You Learn with AI-Powered Tools!",
    subtitle: "Generate flashcards, quizzes, and summaries instantly. Perfect for students, teachers, and professionals!",
  },
  {
    icon: "/icons/icons8-practice-264 1.png",
    color: "#FFCFD9",  
    title: "Practice & Master",
    subtitle: "Strengthen your understanding with in-depth explanations and tailored content.",
  },
  {
    icon: "/icons/icons8-study-240 1.png",
    color: "#CAFAFF",  
    title: "Study & Collaborate",
    subtitle: "Easily share your generated content with peers or instructors for better group study.",
  },
];
</script>

<style scoped>
.v-card {
  transition: transform 0.3s ease;
  border-radius: 16px;
  height: 100%;
}
.v-card:hover {
  transform: translateY(-10px);
}

.icon-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px; 
  margin: 0 auto;
  border-radius: 10%; 
}

.icon-img {
  width: 60%;  
  height: 60%; 
  object-fit: contain; 
}


</style>
