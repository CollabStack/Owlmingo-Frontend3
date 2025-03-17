<template>
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" color="primary" app>
        <v-container fluid class="d-flex align-items-center justify-start">
          <img src="/logo/icon-no-bg.svg" alt="Logo" width="200px" />
        </v-container>
        <v-list>
          <v-list-item v-for="item in items" :key="item.title" :to="item.link_nav" link>
            <v-list-item-icon>
              <v-icon color="white">{{ item.icon }}</v-icon>
            </v-list-item-icon>
  
            <v-list-item-content>
              <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <!-- <v-list-item v-for="item in items" :key="item.title">
            <nuxt-link :to="item.link_nav">
              <v-list-item-icon>
                <v-icon color="white">{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="white--text">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </nuxt-link>
          </v-list-item> -->
        </v-list>
  
        <template v-slot:append>
          <div class="pa-2">
            <v-btn block @click="logout">
              Logout
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>
  
      <v-app-bar class="mx-2 rounded-b-xl " color="#4635B1" evalation-0 app>
        <v-app-bar-nav-icon color="white" @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-app-bar>
  
      <v-main>
        <transition name="fade" mode="out-in">
          <div :key="$route.fullPath">
            <slot />
          </div>
        </transition>
      </v-main>
    </v-app>
  </template>
  
  <script>
//   import { useAuthStore } from '~/store/auth';
  
  export default {
    name: 'DefaultLayout',
    data() {
      return {
        clipped: false,
        drawer: null,
        items: [
          { title: 'Dashboard',    link_nav: '/', icon: 'mdi-view-dashboard' },
          { title: 'Role',         link_nav: '/role', icon: 'mdi-account-child' },
          { title: 'Admin',        link_nav: '/admin', icon: 'mdi-account-alert' },
          { title: 'User',         link_nav: '/user', icon: 'mdi-account-card' },
          { title: 'Instructor',   link_nav: '/instructor', icon: 'mdi-human-male-board' },
          { title: 'Course',       link_nav: '/course', icon: 'mdi-book-open-page-variant-outline' },
          { title: 'Category',     link_nav: '/category', icon: 'mdi-shape' },
          { title: 'Course Level', link_nav: '/course-level', icon: 'mdi-stairs-up' },
          { title: 'Plan',         link_nav: '/plan', icon: 'mdi-book-open-variant' },
          { title: 'Subscription', link_nav: '/user_subscription', icon: 'mdi-playlist-check' },
          { title: 'Payment',      link_nav: '/aba-payment', icon: 'mdi-account-credit-card' },
          { title: 'About',        link_nav: '/about', icon: 'mdi-account-file' },
          { title: 'Send Message', link_nav: '/send-message', icon: 'mdi-message-bulleted' },
        ],
      }
    },
  
    methods: {
      async logout() {
        const authStore = useAuthStore(this.$pinia)
        try {
          await authStore.logout();
          this.$router.push('/login');
        } catch (e) {
          this.error = e.response.data.error;
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .white--text {
    color: white !important;
  }
  </style>
  