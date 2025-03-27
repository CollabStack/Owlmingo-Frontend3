<template>
    <!-- <v-container app fixed class="d-flex justify-space-between align-center app-bar"> -->
        <v-app-bar app fixed class="d-flex justify-space-between align-center app-bar">
        <v-container fluid class="mx-2 mx-sm-2 mx-md-12 mx-lg-16" >
            <v-row align="center" justify="space-between" class="d-flex" no-gutters>
                <!-- Left: Navigation Tabs -->
                <v-col class="d-none d-lg-flex align-center">
                    <v-tabs background-color="transparent" class="tab-items">
                        <v-tab
                            v-for="(item, index) in tabs"
                            :key="index"
                            :to="item.route"
                            class="custom-tab"
                            :class="{ 'active-tab': isActiveRoute(item.route) }"
                            @click="setActive(item.route)"
                        >
                            {{ item.label }}
                        </v-tab>
                    </v-tabs>
                </v-col>

                <!-- Center: Logo -->
                <v-col cols="4" md="3" class="text-center p-0 m-0">
                    <nuxt-link to="/">
                        <v-img
                            width="40"
                            height="40"
                            src="/logo/icon-no-bg.svg"
                            alt="Owlmingo Logo"
                            contain
                            class="logo"
                        />
                    </nuxt-link>
                </v-col>

                <!-- Right: Buttons -->
                <v-col v-if="!isLoggedIn" cols="8" md="3" class="d-none d-md-flex text-right d-flex align-center justify-end gap-x-20">
                    <div>
                        <v-btn to="/auth">sign in</v-btn>
                        <v-btn to="/auth/sign-up">Sign Up</v-btn>
                    </div>
                </v-col>
                <v-col v-else cols="8" md="3" class="d-none d-md-flex text-right d-flex align-center justify-end gap-x-20">
                    <v-menu transition="scale-transition" offset-y>
                        <template #activator="{ props }" >
                            <v-avatar v-bind="props" class="cursor-pointer" size="40">
                                <v-img
                                    src="/female_profile.jpg"
                                    alt="Profile"
                                    contain
                                    class="rounded-full"
                                />
                            </v-avatar>
                        </template>
                        <!-- Updated dropdown: vertical layout, floating -->
                        <div style="display: flex; flex-direction: column; gap: 10px; background: white; position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 1000; margin-top: 20px; margin-right: 200px; padding: 10px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <v-btn to="/auth">Explore</v-btn>
                            <v-btn to="/auth/sign-up">Upgrade Plan</v-btn>
                            <v-divider></v-divider>
                            <v-btn color="secondary" @click="logout">Sign Out</v-btn>
                        </div>
                    </v-menu>

                </v-col>
            </v-row>
        </v-container>
    <!-- </v-container> -->
</v-app-bar>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';


/* ========== DATA ==========*/
const route = useRoute();
const router = useRouter();
const tabs = [
    { label: 'Home', route: '/' },
    { label: 'Library', route: '/library' },
    { label: 'Flashcard', route: '/flashcard' },
    { label: 'Quiz', route: '/quiz' },
    { label: 'Summary', route: '/summary' },
    { label: 'About', route: '/about' },
    { label: 'ColorView', route: '/color'},
];
const activeTab = ref(route.path);
const authStore = userAuth();

/* ========== COMPUTED ==========*/
const isLoggedIn = computed(() => {
    return authStore.isLoggedIn;
});

/* ========== WATCH ==========*/
watch(() => route.path, (newPath) => {
    activeTab.value = newPath;
    // Force component update in case route has changed without tab interaction
    nextTick();
});

/* ========== MOUNTED ==========*/
onMounted(() => {
    authStore.initializeSession();
    // Set active tab based on current route
    activeTab.value = route.path;
});
/* ========== METHODS ==========*/
function setActive(tab: string) {
  if (activeTab.value === tab) return; // Prevent redundant navigation
  activeTab.value = tab;
  router.push(tab);
}

// Enhanced route matching function with cleaner organization
function isActiveRoute(routePath: string) {
  // 1. Special case for home route
  if (routePath === '/' && (route.path === '/' || route.path === '')) {
    return true;
  }
  
  // 2. Check for exact match
  if (route.path === routePath) {
    return true;
  }
  
  // 3. Specific parent/child route matching with optimized checks
  if (routePath === '/quiz' && route.path.startsWith('/quiz/')) {
    // Show Quiz tab as active when on any quiz subpage
    return true;
  }
  
  if (routePath === '/library' && route.path.startsWith('/library/')) {
    // Show Library tab as active when on any library subpage
    return true;
  }
  
  // 4. Generic child path matching for any other sections
  // (Only applies to routes not covered by cases above)
  if (routePath !== '/' && 
      route.path.startsWith(routePath + '/')) {
    return true;
  }
  
  return false;
}

function logout() {
  authStore.logout();
  // redirect and reload 
    router.push('/').then(() => {
        window.location.reload();
    });
}

</script>

<style scoped>
.custom-tab {
    text-transform: none;
    font-size: 15px;
    font-weight: 400;
    transition: all 0.3s ease;
    position: relative;
    opacity: 0.85;
    height: 64px;
    padding: 0 16px;
}

.custom-tab:hover {
    opacity: 1;
}

/* Simplified active tab styling to reduce conflicts with Vuetify */
.active-tab {
    color: #9D7BFC !important; /* Primary purple color */
    font-weight: 600;
    opacity: 1;
}

/* Fix underline position for better alignment */
.active-tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #9D7BFC;
    transition: transform 0.3s ease;
}

/* Avoid using ::after for non-active tabs to prevent style conflicts */
.tab-items {
    padding: 0;
    height: 64px;
}

/* Glassmorphism effect for navbar */
.app-bar {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
    border-bottom: 1px solid rgba(157, 123, 252, 0.1);
    background-color: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}

.logo {
    max-width: 100px;
    transition: transform 0.3s ease;
}

.logo:hover {
    transform: scale(1.05);
}

.gap-x-20 {
    gap: 15px;
}

/* Hide tabs on smaller screens */
@media (max-width: 960px) {
    .tab-items {
        display: none;
    }
}

/* Adjust button spacing for smaller screens */
@media screen and (max-width: 600px) {
    .gap-x-20 {
        gap: 5px;
    }
}
</style>
