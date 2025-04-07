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
      <v-divider></v-divider>
      <div class="d-flex align-center ma-4">
        <v-avatar class="cursor-pointer" size="40">
          <v-img
            src="/female_profile.jpg"
            alt="Profile"
            contain
            class="rounded-full"
          />
        </v-avatar>
        <p class="pl-2 white--text">
          {{ user?.username || 'Hello Admin'}}
        </p>
      </div>
      <v-divider></v-divider>

      <!-- Navigation Items -->
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
        <div>
          <NuxtPage />
        </div>
      </transition>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { userAuth } from '~/store/userAuth';

// Sidebar State
const drawer = ref(false);

// Navigation Items
const items = ref([
  { title: 'Dashboard', link_nav: '/admin', icon: 'mdi-view-dashboard' },
  { title: 'Plan', link_nav: '/admin/plan', icon: 'mdi-note-text-outline' },
  { title: 'User', link_nav: '/admin/user', icon: 'mdi-account'},
]);

// Reactive user object
const user = ref(null);

// Logout Method
const logout = async () => {
  const authStore = userAuth(); 
  await authStore.logout(); 
  window.location.href = '/'; 
};

onMounted(() => {
  const authStore = userAuth();
  user.value = authStore.getUser(); // Set the user on mount
});
</script>

<style scoped>
/* White Text */
.white--text {
  color: white !important;
}
</style>
