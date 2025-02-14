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
      <!-- Hidden Telegram Login Button -->
      <div id="telegram-login" class="hidden-telegram-button"></div>
  
      <!-- Custom Telegram Login Button -->
      <button class="custom-telegram-button" @click="triggerTelegramLogin">
        <img src="/icons/icons8-telegram-48.svg" alt="Telegram Login" />
      </button>
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
  
  // Function to trigger the hidden Telegram login
  const triggerTelegramLogin = () => {
    console.log("Triggering Telegram login...");
    const telegramFrame = document.querySelector("#telegram-login iframe");
    if (telegramFrame) {
      telegramFrame.style.display = "block"; // Show the hidden iframe
      telegramFrame.click(); // Try to trigger click on it
    } else {
      console.error("Telegram iframe not found!");
    }
  };
  
  // Handle Telegram login response
  window.onTelegramAuth = (user) => {
    console.log("User authenticated:", user);
    alert(`Hello ${user.first_name}, you are logged in!`);
  };
  </script>
  
  <style scoped>
  /* Hide the default Telegram button (but keep it in the DOM) */
  .hidden-telegram-button {
    position: absolute;
    top: -100px; /* Moves it off-screen */
    left: -100px;
    opacity: 0;
    pointer-events: none;
  }
  
  /* Custom Telegram Button */
  .custom-telegram-button {
    /* background-color: #29a9eb; */
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
  }
  
  .custom-telegram-button img {
    width: 50px;
    height: 50px;
  }
  </style>
  