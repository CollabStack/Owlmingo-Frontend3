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
<template>
    <div>
      <h1>Welcome to My Website</h1>
      <div
        id="telegram-login"
        ref="telegramLogin"
        :data-telegram-login="botUsername"
        data-size="large"
        data-radius="20"
        data-request-access="write"
        @click="handleTelegramLogin"
      ></div>
    </div>
  </template>
  
  <script setup>
  // Replace with your bot username
  const botUsername = 'your_bot_username';
  
  // Handle Telegram Login
  const handleTelegramLogin = () => {
    window.TelegramLoginWidget = {
      onAuth: (user) => {
        console.log('Telegram User:', user);
        // Handle user data (e.g., send to your backend)
      },
    };
  };
  
  // Add Telegram Widget Script dynamically
  useHead({
    script: [
      {
        src: 'https://telegram.org/js/telegram-widget.js?7',
        async: true,
      },
    ],
  });
  </script>
  
  <style scoped>
  #telegram-login {
    display: inline-block;
    width: 50px; /* Adjust size as needed */
    height: 50px; /* Adjust size as needed */
    border-radius: 50%; /* Make it circular */
    background-image: url('https://telegram.org/img/t_logo.svg'); /* Telegram logo */
    background-size: cover;
    cursor: pointer;
  }
  </style>