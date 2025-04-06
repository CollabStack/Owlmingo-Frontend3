<template>
    <v-app-bar app fixed class="d-flex justify-space-between align-center app-bar">
        <v-container fluid class="mx-2 mx-sm-2 mx-md-12 mx-lg-16" >
            <v-row align="center" justify="space-between" class="d-flex" no-gutters>
                <!-- Left: Navigation Tabs -->
                <v-col class="d-none d-lg-flex align-center">
                    <v-tabs background-color="transparent" class="tab-items">
                        <!-- <v-tab
                            v-for="(item, index) in tabs"
                            :key="index"
                            :to="item.route"
                            class="custom-tab"
                            :class="{ 'active-tab': isActiveRoute(item.route) }"
                            @click="setActive(item.route)"
                        >
                            {{ item.label }}
                        </v-tab> -->
                        <v-tab
                            v-for="(item, index) in filteredTabs"
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
                            <v-btn to="/settings">Settings</v-btn>
                            <v-btn to="/upgrade-plan">Upgrade Plan</v-btn>
                            <v-divider></v-divider>
                            <v-btn color="secondary" @click="logout">Sign Out</v-btn>
                        </div>
                    </v-menu>
                </v-col>
            </v-row>
        </v-container>
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
    { 
        label: 'Library', 
        route: '/library',        
        requiresAuth: true
    },
    { 
        label: 'Flashcard', 
        route: '/flashcard',
        childRoutes: ['/flashcard/'] // All paths starting with /flashcard/ are related
    },
    { 
        label: 'Quiz', 
        route: '/quiz',
        childRoutes: [
            '/quiz/', 
            '/history-quiz', 
            '/review-quiz', 
            '/result-quiz', 
            '/do-quiz'
        ] 
    },
    { 
        label: 'Summary', 
        route: '/summary',
        childRoutes: ['/summary/'] // All paths starting with /summary/ are related
    },
    { label: 'Pricing', route: '/pricing'},
    { label: 'About', route: '/about' },
];
const activeTab = ref(route.path);
const authStore = userAuth();

/* ========== COMPUTED ==========*/
const isLoggedIn = computed(() => {
    return authStore.isLoggedIn;
});

const filteredTabs = computed(() => {
    return tabs.filter(tab => {
        return !tab.requiresAuth || isLoggedIn.value;
    });
});


/* ========== METHODS ==========*/
// Enhanced function to check if a route is active (including nested & related routes)
function isActiveRoute(tabRoute: string): boolean {
    // First check for exact match (home route special case)
    if (tabRoute === '/' && route.path === '/') {
        return true;
    }
    
    // Find the tab that matches the route
    const tab = tabs.find(tab => tab.route === tabRoute);
    
    // If it's a simple route without child routes
    if (!tab || !tab.childRoutes) {
        // For non-home routes, check if current path starts with this route
        return tabRoute !== '/' && route.path.startsWith(tabRoute);
    }
    
    // Check main route or any child routes
    if (route.path === tabRoute) return true;
    
    // Check all defined child routes
    for (const childRoute of tab.childRoutes) {
        if (route.path.startsWith(childRoute)) {
            return true;
        }
    }
    
    // Special case for quiz-related routes
    if (tabRoute === '/quiz') {
        // List of all quiz-related paths that should highlight the Quiz tab
        const quizRelatedPaths = [
            '/quiz', 
            '/history-quiz', 
            '/review-quiz', 
            '/result-quiz',
            '/do-quiz'
        ];
        
        // Check if the current path starts with any quiz-related path
        for (const quizPath of quizRelatedPaths) {
            if (route.path.startsWith(quizPath)) {
                return true;
            }
        }
    }
    
    return false;
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
    letter-spacing: 0.01em;
    min-width: 70px; /* Ensure consistent tab width */
    transition: all 0.3s ease;
    position: relative;
    opacity: 0.8;
}

.custom-tab:hover {
    opacity: 1;
    background: rgba(0, 0, 0, 0.03);
}

/* Active tab styling improved for consistency */
.active-tab {
    color: var(--v-primary);
    font-weight: 600;
    opacity: 1;
    position: relative;
}

/* Improved active indicator with animated bottom border */
.active-tab::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: currentColor;
    transform-origin: center;
    transition: transform 0.3s ease;
}

.app-bar {
    background-color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid #e0e0e0;
    z-index: 100;
}

.logo {
    max-width: 100px;
    transition: transform 0.3s ease;
}

.logo:hover {
    transform: scale(1.1);
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

/* Style improvements for dropdown menu */
.cursor-pointer {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.cursor-pointer:hover {
    transform: scale(1.05);
}
</style>
