<template>
  <v-app>
    <v-app-bar>
      <UserNavbar />
    </v-app-bar>
    <v-main>
      <slot />
    </v-main>
    <!-- <v-footer app>
      <v-col class="text-center">© 2025 - User Portal</v-col>
    </v-footer> -->
  </v-app>
</template>
<script setup lang="ts">

</script>

<style>
  body{
    background-color: #F3F3F3;
  }
</style>