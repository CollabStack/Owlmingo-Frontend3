<template>
  <v-app>
    <!-- <v-app-bar> -->
      <UserNavbar/>
    <!-- </v-app-bar> -->
    <v-main>
      <transition name="fade" mode="out-in">
        <div :key="$route.fullPath">
          <slot />
        </div>
      </transition>
    </v-main>
    <!-- Footer -->
    <Footer v-if="!hideFooter" />
  </v-app>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onBeforeMount } from 'vue';
const route = useRoute();
const hideFooter = computed(() => route.path === '/auth' || route.path === '/auth/sign-up' || route.path === '/quiz/do-quiz');

</script>