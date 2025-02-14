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
  </script>
   -->
<!-- 
<template>
      <div id="telegram-login" style="display: none;"></div>
  
      <button class="custom-telegram-button" @click="triggerTelegramLogin">
        <img src="/icons/icons8-telegram-48.svg" alt="Telegram Login" />
      </button>
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
  
  // Function to trigger the hidden Telegram login
  const triggerTelegramLogin = () => {
    console.log("Triggering Telegram login...");
    document.querySelector("#telegram-login iframe")?.contentWindow?.postMessage("login", "*");
  };
  
  // Handle Telegram login response
  window.onTelegramAuth = (user) => {
    console.log("User authenticated:", user);
    alert(`Hello ${user.first_name}, you are logged in!`);
  };
  </script>
  
  <style scoped>
  .custom-telegram-button {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  
  .custom-telegram-button img {
    width: 50px;
    height: 50px;
  }
  </style>
   -->
   <template>
    <div>
      <!-- Custom Telegram Login Button -->
      <button class="custom-telegram-button" @click="openTelegramAuth">
        <img src="/icons/icons8-telegram-48.svg" alt="Telegram Login" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { useRuntimeConfig } from "nuxt/app";
  
  const botUsername = useRuntimeConfig().public.BOT_USERNAME; // Load bot username from env
  
  console.log("Bot Username:", botUsername);
  
  // Function to open Telegram authentication
  const openTelegramAuth = () => {
    const authUrl = `https://oauth.telegram.org/auth?bot=${botUsername}&origin=${window.location.origin}&embed=1`;
    window.open(authUrl, "_blank", "width=600,height=600");
  };
  
  // Listen for authentication messages from Telegram
  window.addEventListener("message", (event) => {
    if (event.origin !== "https://oauth.telegram.org") return;
    console.log("Authenticated User:", event.data);
    alert(`Welcome, ${event.data.first_name}!`);
  });
  </script>
  
  <style scoped>
  .custom-telegram-button {
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  
  .custom-telegram-button img {
    width: 50px;
    height: 50px;
  }
  </style>
  
  