<template>
  <v-app id="admin-layout">
    <!-- Sidebar -->
    <v-navigation-drawer v-model="drawer" color="primary" app>
      <v-container fluid class="d-flex align-center justify-center">
        <div class="d-flex align-center">
          <img src="/logo/icon-no-bg.svg" alt="Logo" width="50px" />
          <span class="ml-2 white--text">Owlmingo</span>
        </div>
      </v-container>

      <v-list>
        <v-list-item 
          v-for="item in items" 
          :key="item.title" 
          :to="item.link_nav" 
          link class="d-flex align-center"
        >
          <v-icon color="white" class="mr-2">{{ item.icon }}</v-icon>
          <span class="white--text">{{ item.title }}</span>
        </v-list-item>
      </v-list>

      <!-- Logout Button -->
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block @click="logout">Logout</v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Top Bar -->
    <v-app-bar class="mx-2 rounded-b-xl" color="#4635B1" elevation="0" app>
      <v-app-bar-nav-icon color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

    <!-- Page Content -->
    <v-main>
      <transition name="fade" mode="out-in">
        <NuxtPage />
      </transition>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
// import { useAuthStore } from '~/store/auth'; // Uncomment if using Pinia

// Sidebar State
const drawer = ref(false);

// Navigation Items
const items = ref([
  { title: 'Dashboard', link_nav: '/admin', icon: 'mdi-view-dashboard' },
  { title: 'Plan', link_nav: '/admin/plan', icon: 'mdi-note-text-outline' }
  // Add more menu items as needed
]);

// Logout Method
const logout = async () => {
  // const authStore = useAuthStore(); // Uncomment if using Pinia
  try {
    // await authStore.logout(); // Uncomment if using Pinia
    console.log('User logged out'); // Replace with actual logout logic
    window.location.href = '/login'; // Redirect after logout
  } catch (e) {
    console.error('Logout Error:', e);
  }
};
</script>

<style scoped>
/* Smooth Fade Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

/* White Text */
.white--text {
  color: white !important;
}
</style>
