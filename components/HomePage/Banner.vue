<template>
    <v-col cols="12">
      <v-card color="text-primary" max-width="95%" max-height="70%" class="banner-card rounded-lg d-flex align-center px-6 py-6">
        
        <v-img
          src="/images/3d-business-children-at-a-laptop-with-a-robot-assistant.png"
          height="220"
          width="220"
          class="me-6"
          contain
        ></v-img>

       
        <div class="text-content text-center">
          <h2 class="text-h4 font-weight-bold mb-4">Experience a new way of learning with the power of AI</h2>
          <p class="text-body-1 mb-6">For students, teachers, and professionals</p>
          <div class="d-flex justify-center gap-4">
           <NuxtLink to="/library"><v-btn rounded="xl" variant="outlined" color="white" class="text-white">AI Flashcard</v-btn></NuxtLink> 
            <NuxtLink to="/about"><v-btn rounded="xl" variant="outlined" color="white" class="text-white">AI Quizzes</v-btn></NuxtLink>
          </div>
        </div>
      </v-card>
    </v-col>
</template>

<style scoped>
.banner-card {
  background-color: #5bc0f3;
  /* border-radius: 20px; */
  color: white;
  /* width: 95%;
  height: 70%; */
  margin-left: 40px;
}
.text-content {
  max-width: 980px;
  text-align: center;
}
.gap-4 {
  gap: 2rem;
}
h2{
    font-family: sans-serif;
}
p{
    font-family: sans-serif;
}
v-btn{
    font-family: sans-serif;
}
</style>
