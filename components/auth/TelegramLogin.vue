<!-- <template>
    <div>
        <div id="telegram-login"></div>
    </div>
</template>

<script setup>
import { onMounted } from "vue";

const botUsername = "owlmingo_bot"; // Replace with your bot's username

onMounted(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "20");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    document.getElementById("telegram-login").appendChild(script);
});

window.onTelegramAuth = (user) => {
    console.log("User authenticated:", user);
    alert(`Hello ${user.first_name}, you are logged in!`);
};
</script> -->
<!-- <template>
    <div>
        <button class="custom-telegram-button" @click="redirectToTelegramAuth">
            <img src="/icons/icons8-telegram-48.svg" alt="Telegram Login" />
            Login
        </button>
    </div>
</template>

<script setup>
const botId = "8103176938"; // Replace with your actual bot ID
const returnTo = "https://owlmingo.space/auth"; // Your return URL

const redirectToTelegramAuth = () => {
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(window.location.origin)}&embed=1&request_access=write&return_to=${encodeURIComponent(returnTo)}`;
    window.location.href = authUrl; // Redirect user to Telegram OAuth
};


onMounted(() => {
    const route = useRoute();
    const hash = route.hash;

    if (hash.startsWith("#tgAuthResult=")) {
        const encodedData = hash.replace("#tgAuthResult=", "");
        const jsonData = decodeURIComponent(encodedData);
        const userData = JSON.parse(jsonData);

        console.log("Telegram Auth Data:", userData);

        // Send userData to the backend for verification
        // verifyTelegramLogin(userData);
    } else {
        console.warn("No Telegram auth data found.");
    }
});
</script>

<style>
.custom-telegram-button {
    background-color: #0088cc;
    border: none;
    padding: 10px 15px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-size: 16px;
    font-weight: bold;
}
.custom-telegram-button img {
    width: 24px;
    height: 24px;
}
</style> -->

<template>
    <div>
        <button class="custom-telegram-button" @click="redirectToTelegramAuth">
            <img src="/icons/icons8-telegram-48.svg" alt="Telegram Login" />
            Login
        </button>
    </div>
</template>

<script setup>
import { useRoute } from "#imports"; // ✅ Correct import for Nuxt
import { onMounted } from "vue";

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
onMounted(() => {
    const route = useRoute();
    const hash = route.hash;

    if (hash.startsWith("#tgAuthResult=")) {
        const encodedData = hash.replace("#tgAuthResult=", "");

        try {
            const userData = decodeBase64(encodedData);
            if (userData) {
                console.log("Telegram Auth Data:", userData);
            } else {
                console.warn("Failed to parse Telegram Auth Data.");
            }
        } catch (error) {
            console.error("Error decoding Telegram Auth Result:", error);
        }
    } else {
        console.warn("No Telegram auth data found.");
    }
});
</script>

<style>
.custom-telegram-button {
    background-color: #0088cc;
    border: none;
    padding: 10px 15px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    color: white;
    font-size: 16px;
    font-weight: bold;
}

.custom-telegram-button img {
    width: 24px;
    height: 24px;
}
</style>
