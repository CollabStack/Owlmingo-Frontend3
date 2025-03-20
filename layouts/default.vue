<template>
  <v-app>
    <!-- User Navbar -->
    <UserNavbar v-if="!hideLayout" />

    <v-main>
      <transition name="fade" mode="out-in">
        <div :key="$route.fullPath">
          <slot />
        </div>
      </transition>
    </v-main>

    <!-- Footer -->
    <Footer v-if="!hideLayout" />
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const hideLayout = computed(() => {
  console.log("Current Route:", route.path);
  return route.path === '/auth' || route.path === '/auth/sign-up' || route.path === '/quiz/test' || route.path === '/quiz/do-quiz';
});
</script>
