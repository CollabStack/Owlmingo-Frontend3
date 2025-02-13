<template>
    <v-container app class="d-flex justify-space-between align-center app-bar">
        <v-container fluid class="mx-2 mx-sm-2 mx-md-12 mx-lg-16">
            <v-row align="center" justify="space-between" class="d-flex" no-gutters>
                <!-- Left: Navigation Tabs -->
                <v-col class="d-none d-lg-flex align-center">
                    <v-tabs background-color="transparent" class="tab-items">
                        <v-tab
                            v-for="(item, index) in tabs"
                            :key="index"
                            :to="item.route"
                            class="custom-tab"
                            :class="{ 'active-tab': isActive(item.route) }"
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
                <v-col cols="8" md="3" class="d-none d-md-flex text-right d-flex align-center justify-end gap-x-20">
                    <div>
                        <v-btn to="/login">Login</v-btn>
                        <v-btn to="/register">Sign Up</v-btn>
                    </div>
                </v-col>
            </v-row>
        </v-container>
    </v-container>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute(); // Reactive route object

const tabs = [
    { label: 'Home', route: '/' },
    { label: 'Flashcard', route: '/flashcard' },
    { label: 'Quiz', route: '/quiz' },
    { label: 'About Us', route: '/about' },
];

// Compute the active tab based on route path
const isActive = (tabRoute: string) => computed(() => route.path === tabRoute).value;
</script>

<style scoped>
.custom-tab {
    text-transform: none;
    font-size: 15px;
    font-weight: 600;
    color: black !important;
    transition: color 0.3s ease-in-out, border-bottom 0.3s ease-in-out;
}

/* Active tab styling */
.active-tab {
    color: #1976D2 !important; /* Vuetify primary color */
    font-weight: bold;
    border-bottom: 2px solid #1976D2;
}

.app-bar {
    background-color: white;
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
