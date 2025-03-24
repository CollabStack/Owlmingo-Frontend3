<template>
  <v-app>
    <!-- Sidebar Navigation -->
    <v-navigation-drawer v-model="drawer" app width="260" color="primary">
      <v-container fluid class="d-flex align-center justify-start py-4 px-3">
        <img src="/logo/icon-no-bg.svg" alt="Logo" style="width: 40px; height: 40px;" />
        <span class="ml-3 text-white text-h6 font-weight-bold">Owlmingo</span>
      </v-container>

      <v-divider class="mx-4 mb-4"></v-divider>

      <v-list nav dense>
        <v-list-item 
          v-for="item in items" 
          :key="item.title" 
          :to="item.link_nav" 
          link 
          class="white--text"
        >
          <template v-slot:prepend>
            <v-icon>{{ item.icon }}</v-icon>
          </template>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <!-- Logout Button at the Bottom -->
      <template v-slot:append>
        <div class="pa-4">
          <v-btn block color="red-darken-2" dark @click="logout">
            <v-icon left>mdi-logout</v-icon> Logout
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar app elevation="0" color="white">
      <v-app-bar-nav-icon color="black" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon color="black">mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon color="black">mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <transition name="fade" mode="out-in">
          <div :key="$route.fullPath">
            <slot />
          </div>
        </transition>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "DefaultLayout",
  data() {
    return {
      drawer: true,
      items: [
        { title: "Dashboard", link_nav: "/admins", icon: "mdi-view-dashboard" },
        { title: "Admin", link_nav: "/admins/admin-list", icon: "mdi-account-alert" },
        { title: "User", link_nav: "/admins/user-list", icon: "mdi-account-card" },
      ],
    };
  },
  methods: {
    async logout() {
      // Implement logout logic here
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
.white--text {
  color: white !important;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
