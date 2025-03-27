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
import { ref, watch, computed } from 'vue';
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
    { label: 'Summary', route: '/summary' }, // Add this line
    { label: 'About', route: '/about' },
    { label: 'ColorView', route: '/color'},
];
const activeTab = ref(route.path);
const authStore = userAuth();

/* ========== COMPUTED ==========*/
const isLoggedIn = computed(() => {
    return authStore.isLoggedIn;
});

/* ========== METHODS ==========*/
// Function to check if a route is active (including nested routes)
function isActiveRoute(tabRoute: string): boolean {
    if (tabRoute === '/') {
        // For home route, only match exact path
        return route.path === '/';
    }
    // For other routes, check if the current path starts with this route
    return route.path.startsWith(tabRoute);
}

function setActive(tab: string) {
    activeTab.value = tab;
    router.push(tab);
}

/* ========== WATCH ==========*/
watch(() => route.path, (newPath) => {
    // Update activeTab based on the route path
    for (const tab of tabs) {
        if (isActiveRoute(tab.route)) {
            activeTab.value = tab.route;
            break;
        }
    }
});

/* ========== MOUNTED ==========*/
onMounted(() => {
    authStore.initializeSession();
    
    // Set the initial active tab based on the current route
    for (const tab of tabs) {
        if (isActiveRoute(tab.route)) {
            activeTab.value = tab.route;
            break;
        }
    }
});

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
}

/* Active tab styling updated for consistency */
.active-tab {
    color: var(--v-primary);
    font-weight: bold;
    border-bottom: 2px solid;
}

.app-bar {
    /* background-color: var(--v-theme-primary); */
    box-shadow: none;
    border-bottom: 1px solid #e0e0e0;
}

.logo {
    max-width: 100px;
}

.tab-items {
    padding: 0;
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
