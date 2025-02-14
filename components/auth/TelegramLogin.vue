<!-- <template>
    <div>
        <div id="telegram-login" style="display: none;"></div>
    </div>
    <button class="custom-telegram-button" @click="openTelegramAuth">
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

window.onTelegramAuth = (user) => {
    console.log("User authenticated:", user);
    alert(`Hello ${user.first_name}, you are logged in!`);
};
</script> -->
<template>
    <div>
      <!-- Hidden Telegram Widget -->
      <div id="telegram-login" style="display: none;"></div>
  
      <!-- Custom Telegram Button -->
      <button class="custom-telegram-button" @click="triggerTelegramAuth">
        <img src="/icons/icons8-telegram-48.svg" alt="Telegram Login" />
      </button>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from "vue";
  
  const botUsername = "owlmingo_bot"; // Replace with your bot username
  
  onMounted(() => {
    // Load Telegram widget script
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", botUsername);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "20");
    script.setAttribute("data-onauth", "onTelegramAuth");
    script.setAttribute("data-request-access", "write");
    script.id = "telegram-login-widget";
    
    document.getElementById("telegram-login").appendChild(script);
  });
  
  // Function to simulate a click on the hidden Telegram login button
  const triggerTelegramAuth = () => {
    console.log("Triggering Telegram authentication...");
    const telegramButton = document.querySelector("#telegram-login iframe");
    if (telegramButton) {
        console.log("Telegram login widget loaded.");
      telegramButton.contentWindow.postMessage("login", "*");
    } else {
      console.error("Telegram login widget not loaded.");
    }
  };
  
  // Handle authentication
  window.onTelegramAuth = (user) => {
    console.log("User authenticated:", user);
    alert(`Hello ${user.first_name}, you are logged in!`);
  };
  </script>
  
  <style scoped>
  .custom-telegram-button {
    border: none;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #0088cc;
    padding: 10px;
  }
  
  .custom-telegram-button img {
    width: 50px;
    height: 50px;
  }
  </style>
  
  

<!-- <template>
        <div>
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
      
 -->

<!-- <template>
    <div>
        <button class="custom-telegram-button" @click="openTelegramAuth">
            <img src="/icons/icons8-telegram-48.svg" alt="Telegram Login" />
        </button>
    </div>
</template>

<script setup>
import { useRuntimeConfig } from "nuxt/app";

const botId = useRuntimeConfig().public.BOT_ID; // Load bot ID from env
const botUsername = useRuntimeConfig().public.BOT_USERNAME; // Use bot username instead
console.log("Bot Username:", botUsername);
console.log("Bot ID:", botId);
// Function to open Telegram authentication
const openTelegramAuth = () => {
    if (!botId) {
        console.error("Bot ID is missing! Check your environment variables.");
        return;
    }
    // const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${window.location.origin}&embed=1`;
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
</style> -->
<!-- const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${window.location.origin}&embed=1`;
      const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${window.location.origin}&embed=1`;
      const authUrl = `https://oauth.telegram.org/auth?bot=${botUsername}&origin=${window.location.origin}&embed=1`; -->
