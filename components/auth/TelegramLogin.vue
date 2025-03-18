<!-- <template>
    <div class="custom-telegram-button" @click="redirectToTelegramAuth">
        <img src="/icons/icons8-telegram-48.svg" alt="Telegram Login" />
    </div>
</template>

<script setup>
import { useRoute } from "#imports"; // ✅ Correct import for Nuxt
import Swal from "sweetalert2";
import { onMounted } from "vue";
import { userAuth } from "~/store/userAuth";
// Telegram Bot ID
const botId = useRuntimeConfig().public.BOT_ID;
const returnTo = useRuntimeConfig().public.BOT_RETURN_URL;
const userAuthStore = userAuth();
// Redirect to Telegram authentication
const redirectToTelegramAuth = () => {
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(window.location.origin)}&embed=1&request_access=write&return_to=${encodeURIComponent(returnTo)}`;
    window.location.href = authUrl;
};

// Function to decode Base64
const decodeBase64 = (str) => {
    try {
        console.log("Decoding Base64:", str);
        return JSON.parse(atob(str));
    } catch (error) {
        console.error("Failed to decode Telegram Auth Result:", error);
        return null;
    }
};

// Extract Telegram authentication data
onMounted(async () => {
    const route = useRoute();
    const hash = route.hash;
    if (hash.startsWith("#tgAuthResult=")) {
        const encodedData = hash.replace("#tgAuthResult=", "");

        try {
            let userData = decodeBase64(encodedData);
            if (userData) {
                console.log("Telegram Auth Data:", userData);
                const response = await userAuthStore.telegramOAuth(userData);
                console.log("Telegram Auth Response Page:", response);
                if (response.status === 200) {
                    navigateTo("/");
                }
            } 
            
        } catch (error) {
            console.error("Error decoding Telegram Auth Result:", error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Failed to authenticate with Telegram.'
            });
        }
    } else {
        console.warn("No Telegram auth data found.");
    }
});
</script>

<style scoped>
.custom-telegram-button {
    cursor: pointer;
    align-items: center;
    width: 50px;
    height: 50px;
}

.custom-telegram-button img {
    width: 50px;
    height: 50px;
}
</style> -->
<template>
    <v-btn icon="" class="icon-button" @click="redirectToTelegramAuth">
        <v-img
            width="50px"
            height="50px"
            src="/icons/icons8-telegram-48.svg"
        ></v-img>
    </v-btn>
</template>

<script setup>
import { useRoute } from "#imports"; // ✅ Correct import for Nuxt
import { onMounted } from "vue";
import { userAuth } from '~/store/userAuth';

const userAuthStore = userAuth();
// Telegram Bot ID
const botId = "8103176938"; // Replace with your actual bot ID
const returnTo = "https://owlmingo.space/auth"; // Redirect after login

// Redirect to Telegram authentication
const redirectToTelegramAuth = () => {
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(window.location.origin)}&embed=1&request_access=write&return_to=${encodeURIComponent(returnTo)}`;
    window.location.href = authUrl;
};

// Function to decode Base64
const decodeBase64 = (str) => {
    try {
        return JSON.parse(atob(str));
    } catch (error) {
        console.error("Failed to decode Telegram Auth Result:", error);
        return null;
    }
};

// Extract Telegram authentication data
onMounted(async () => {
    const route = useRoute();
    const hash = route.hash;

    if (hash.startsWith("#tgAuthResult=")) {
        const encodedData = hash.replace("#tgAuthResult=", "");

        // try {
        //     const userData = decodeBase64(encodedData);
        //     if (userData) {
        //         console.log("Telegram Auth Data:", userData);
        //     } else {
        //         console.warn("Failed to parse Telegram Auth Data.");
        //     }
        // } catch (error) {
        //     console.error("Error decoding Telegram Auth Result:", error);
        // }
        
        try {
            let userData = decodeBase64(encodedData);
            if (userData) {
                console.log("Telegram Auth Data:", userData);
                const response = await userAuthStore.telegramOAuth(userData);
                console.log("Telegram Auth Response Page:", response);
                if (response.status === 200) {
                    navigateTo("/");
                }
            } 
            
        } catch (error) {
            console.error("Error decoding Telegram Auth Result:", error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Failed to authenticate with Telegram.'
            });
        }
    } else {
        console.warn("No Telegram auth data found.");
    }
});
</script>

<style>
.custom-telegram-button {
    cursor: pointer;
    align-items: center;
    width: 50px;
    height: 50px;
}

.custom-telegram-button img {
    width: 50px;
    height: 50px;
}

.icon-button {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: background-color 0.3s, transform 0.3s;
}
.icon-button::before {
    content: "";
    position: absolute;
    background-color: rgba(255, 255, 255, 0.1);
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.6s ease-out;
}
.icon-button:hover::before {
    transform: translate(-50%, -50%) scale(3);
}
.icon-button:active::before {
    transform: scale(0.9);
}
.icon-button:hover {
    animation: bounce 1s infinite;
}
</style>
