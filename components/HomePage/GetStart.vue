<template>
  <dev>
    <!-- img 1 -->
    <v-row justify="center" class="mx-15 my-15">
      <!-- Text Column -->
      <v-col cols="12" md="6" class="d-flex justify-start align-center text-left">
        <div>
          <h3 class="text-h4 font-weight-bold mb-3">AI Flashcard Generator</h3>
          <p class="mb-5 text-body-1">
            Save hours by instantly generating flashcards with AI-powered tools that help you efficiently test and strengthen your knowledge.
          </p>
          <NuxtLink to="/about">
            <v-btn color="secondary" variant="elevated" class="px-6 py-3">Get Started</v-btn>
          </NuxtLink>
        </div>
      </v-col>

      <!-- Image Box -->
      <v-col cols="10" md="6" class="d-flex justify-center">
        <div style="background-color:#e3f2fd;;" class="banner-box ml-16">
          <img
            src="/images/glow-educational-robot-helping-with-studies.png"
            alt="Educational Robot"
            class="position-img"
          />
        </div>
      </v-col>
    </v-row>
    <!-- img 2 -->
    <v-row justify="center" class="mx-15 my-15">
       <!-- Image Box -->
       <v-col cols="12" md="4" class="d-flex justify-center">
        <div style="background-color:#CAFFD6;" class="banner-box mr-16">
          <img
            src="/images/glow-young-man-communicating-with-artificial-intelligence-through-a-computer 1.png"
            alt="Educational Robot"
            class="position-img"
          />
        </div>
      </v-col>
      <!-- Text Column -->
      <v-col cols="12" md="6" class="d-flex justify-start align-center text-left">
        <div>
          <h3 class="text-h4 font-weight-bold mb-3">AI Quiz Generator</h3>
          <p class="mb-5 text-body-1">
            Effortlessly create quizzes with AI that understands your material and evaluates answers to enhance both learning and teaching experiences.          </p>
          <NuxtLink to="/about">
            <v-btn color="secondary" variant="elevated" class="px-6 py-3">Get Started</v-btn>
          </NuxtLink>
        </div>
      </v-col>

     
    </v-row>
    <!-- img 3 -->
    <v-row justify="center" class="mx-15 my-15">
      <!-- Text Column -->
      <v-col cols="12" md="6" class="d-flex justify-start align-center text-left">
        <div>
          <h3 class="text-h4 font-weight-bold mb-3">AI Flashcard Generator</h3>
          <p class="mb-5 text-body-1">
            Save hours by instantly generating flashcards with AI-powered tools that help you efficiently test and strengthen your knowledge.          </p>
          <NuxtLink to="/about">
            <v-btn color="secondary" variant="elevated" class="px-6 py-3">Get Started</v-btn>
          </NuxtLink>
        </div>
      </v-col>

      <!-- Image Box -->
      <v-col cols="10" md="4" class="d-flex justify-center">
        <div style="background-color:#D7F0FF;" class="banner-box ml-16">
          <img
            src="/images/sammy-woman-gives-five-to-a-robot-with-artificial-intelligence 1.png"
            alt="Educational Robot"
            class="position-img"
          />
        </div>
      </v-col>
    </v-row>
    <!-- img 4 -->
    <v-row justify="center" class="mx-15 my-15">
       <!-- Image Box -->
       <v-col cols="12" md="6" class="d-flex justify-center">
        <div style="background-color:#EAE4FF;" class="banner-box mr-16">
          <img
            src="/images/space-delete-confirmation.png"
            alt="Educational Robot"
            class="position-img"
          />
        </div>
      </v-col>
      <!-- Text Column -->
      <v-col cols="12" md="6" class="d-flex justify-start align-center text-left">
        <div>
          <h3 class="text-h4 font-weight-bold mb-3">AI Flashcard Generator</h3>
          <p class="mb-5 text-body-1">
            Save hours by instantly generating flashcards with AI-powered tools that help you efficiently test and strengthen your knowledge.
          </p>
          <NuxtLink to="/about">
            <v-btn color="secondary" variant="elevated" class="px-6 py-3">Get Started</v-btn>
          </NuxtLink>
        </div>
      </v-col>

     
    </v-row>
  </dev>
</template>

<style scoped>
.banner-box {
  position: relative;
  width: 100%; 
  max-width: 500px; 
  height: 350px; 
  /* background-color: #e3f2fd;  */
  border-radius: 20px; 
}

.position-img {
  width: 100%; 
  height: auto; 
  object-position: top; 
  border-radius: 20px; 
  position: absolute; 
  top: -56px; 
  z-index: 2;
}
</style>
