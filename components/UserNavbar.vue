<template>
    <v-app-bar app fixed class="d-flex justify-space-between align-center app-bar">
        <v-container fluid class="mx-2 mx-sm-2 mx-md-12 mx-lg-16">
            <v-row align="center" justify="space-between" class="d-flex" no-gutters>

                <!-- Left: Navigation Tabs -->
                <v-col class="d-none d-lg-flex align-center">
                    <template v-if="skeletonLoading">
                        <v-skeleton-loader type="text" class="mr-4" width="80px" v-for="n in 4" :key="n" />
                    </template>
                    <template v-else>
                        <v-tabs background-color="transparent" class="tab-items">
                            <v-tab
                                v-for="(item, index) in filteredTabs"
                                :key="index"
                                :to="item.route"
                                class="custom-tab"
                                :class="{ 'active-tab': isActiveRoute(item.route), 'inactive-tab': !isActiveRoute(item.route) }"
                                @click="setActive(item.route)"
                                :ripple="false"
                            >
                                {{ item.label }}
                            </v-tab>
                        </v-tabs>
                    </template>
                </v-col>

                <!-- Center: Logo -->
                <v-col cols="4" md="3" class="text-center p-0 m-0">
                    <nuxt-link to="/">
                        <v-img width="40" height="40" src="/logo/icon-no-bg.svg" alt="Owlmingo Logo" contain
                            class="logo" />
                    </nuxt-link>
                </v-col>

                <!-- Right: Auth Buttons or Avatar -->
                <v-col cols="8" md="3" class="d-none d-md-flex text-right d-flex align-center justify-end gap-x-20">
                    <template v-if="skeletonLoading">
                        <v-skeleton-loader type="avatar" width="40" height="40" />
                    </template>

                    <template v-else-if="!isLoggedIn">
                        <div>
                            <v-btn to="/auth">Sign In</v-btn>
                            <v-btn to="/auth/sign-up">Sign Up</v-btn>
                        </div>
                    </template>

                    <template v-else>
                        <v-menu transition="scale-transition" offset-y>
                            <template #activator="{ props }">
                                <v-avatar v-bind="props" class="cursor-pointer" size="40">
                                    <v-img :src="profile_url" alt="Profile" contain class="rounded-full" />
                                </v-avatar>
                            </template>
                            <div
                                style="display: flex; flex-direction: column; gap: 10px; background: white; position: fixed; top: 0; left: 50%; transform: translateX(-50%); z-index: 1000; margin-top: 20px; margin-right: 200px; padding: 10px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                                <v-btn to="/settings">Settings</v-btn>
                                <v-btn to="/upgrade-plan">Upgrade Plan</v-btn>
                                <v-divider></v-divider>
                                <v-btn color="secondary" @click="logout">Sign Out</v-btn>
                            </div>
                        </v-menu>
                    </template>
                </v-col>

            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';

const route = useRoute();
const router = useRouter();
const authStore = userAuth();
const skeletonLoading = ref(true);

const tabs = [
    { label: 'Home', route: '/' },
    { label: 'Library', route: '/library', requiresAuth: true },
    { label: 'Flashcard', route: '/flashcard', childRoutes: ['/flashcard/'] },
    { label: 'Quiz', route: '/quiz', childRoutes: ['/quiz/', '/history-quiz', '/review-quiz', '/result-quiz', '/do-quiz'] },
    { label: 'Summary', route: '/summary', childRoutes: ['/summary/'] },
    { label: 'Pricing', route: '/pricing' },
    { label: 'About', route: '/about' },
];

const activeTab = ref(route.path);

const isLoggedIn = computed(() => authStore.isLoggedIn);

const profile_url = computed(() => {
    const user = authStore.getUser() as { profile_url?: string } | null;
    return user?.profile_url || '/female_profile.jpg';
});

const filteredTabs = computed(() => {
    return tabs.filter(tab => !tab.requiresAuth || isLoggedIn.value);
});

function isActiveRoute(tabRoute: string): boolean {
    const tab = tabs.find(tab => tab.route === tabRoute);
    if (!tab) return false;
    if (route.path === tabRoute) return true;
    if (tab.childRoutes?.length) {
        return tab.childRoutes.some(child => route.path.startsWith(child));
    }
    return false;
}

function setActive(tab: string) {
    activeTab.value = tab;
    router.push(tab);
}

watch(() => route.path, () => {
    for (const tab of tabs) {
        if (isActiveRoute(tab.route)) {
            activeTab.value = tab.route;
            break;
        }
    }
});

onMounted(async () => {
    await authStore.initializeSession();
    skeletonLoading.value = false;
    for (const tab of tabs) {
        if (isActiveRoute(tab.route)) {
            activeTab.value = tab.route;
            break;
        }
    }
});

function logout() {
    authStore.logout();
    router.push('/').then(() => window.location.reload());
}
</script>

<style scoped>
.custom-tab {
    text-transform: none;
    font-size: 15px;
    font-weight: 400;
    letter-spacing: 0.01em;
    min-width: 70px;
    transition: all 0.3s ease;
    position: relative;
    opacity: 0.8;
}

.custom-tab:hover:not(.active-tab) {
    opacity: 0.8;
    background: none;
}

.inactive-tab {
    color: inherit;
    background: transparent !important;
    box-shadow: none !important;
}

.active-tab {
    color: var(--v-primary);
    font-weight: 600;
    opacity: 1;
    position: relative;
}

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

@media (max-width: 960px) {
    .tab-items {
        display: none;
    }
}

@media screen and (max-width: 600px) {
    .gap-x-20 {
        gap: 5px;
    }
}

.cursor-pointer {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.cursor-pointer:hover {
    transform: scale(1.05);
}
</style>