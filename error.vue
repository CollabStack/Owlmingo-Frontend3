<template>
  <!-- <UserNavbar /> -->
  <v-container class="fill-height d-flex align-center justify-center">
    <v-row class="d-flex align-center justify-space-between">
      <!-- Image -->
      <v-col cols="12" md="6" class="d-flex justify-center mt-15">
        <v-img src="/images/3d-casual-life-chatgpt-robot-holding-loupe.png" max-width="400" contain></v-img>
      </v-col>

      <!-- Error Message -->
      <v-col cols="12" md="6" class="text-left pr-10 mt-15">
        <v-chip color="blue lighten-4" class="text-caption font-weight-bold mb-3">
          Page Not Found
        </v-chip>
        <h1 class="text-h4 font-weight-bold text-primary">OhNo!Error404</h1>
        <p class="text-body-1">
          Oops! The page you're looking for doesn't exist.
        </p>
        <p class="text-body-2">
          It might have been moved, deleted, or the URL could be incorrect.
        </p>
        <v-btn color="#4667E5" to="/" class="mt-3">Home Page <NuxtPage /></v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import UserNavbar from '../components/UserNavbar.vue';

  export default {
    components: {
      UserNavbar,
    },
    props: ['error'],
  }
</script>