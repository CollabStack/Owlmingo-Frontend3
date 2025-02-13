<template>
  <v-container class="d-flex justify-center align-center" style="height: 100vh; background-color: #eaeaea">
    <v-card class="pa-4 rounded-lg" style="background-color: #87CEFA; width: 800px; border-radius: 20px;">
      <v-row>
        <!-- Robot Image -->
        <v-col cols="4" class="d-flex justify-center align-center">
          <v-img src="/images/3d-casual-life-chatgpt-robot-in-graduation-cap-1.png" alt="AI Bot"  max-height="200" max-width="200" contain></v-img>
        </v-col>

        <!-- Text Content -->
        <v-col cols="8" class="d-flex flex-column justify-center">
          <h2 class="text-white text-h5 font-weight-bold mb-4">
            Three Powerful Tools, Unlimited Possibilities!
          </h2>
          <p class="text-white mb-6">
            Discover how our AI tools simplify content creation, making learning more efficient and tailored to your goals.
          </p>
          
          <!-- Buttons -->
          <div class="d-flex">
            <v-btn outlined color="white" class="mr-4">Get Started for Free</v-btn>
            <v-btn outlined color="white">Explore AI Tools</v-btn>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
// Nuxt 3 uses auto-imported components with Vuetify
</script>

<style scoped>
.v-btn {
  border: 2px solid white;
}
</style>
