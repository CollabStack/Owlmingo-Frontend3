<template>
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
  