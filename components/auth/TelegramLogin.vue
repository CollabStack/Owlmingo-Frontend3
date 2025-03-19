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
import { userAuth } from '~/store/userAuth';

const userAuthStore = userAuth();
// Telegram Bot ID
const botId = useRuntimeConfig().TELEGRAM_BOT_ID; // Replace with your actual bot ID
const returnTo = useRuntimeConfig().TELEGRAM_BOT_RETURN_URL; // Replace with your actual return URL

// Redirect to Telegram authentication
const redirectToTelegramAuth = () => {
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(window.location.origin)}&embed=1&request_access=write&return_to=${encodeURIComponent(returnTo)}`;
    window.location.href = authUrl;
};



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
