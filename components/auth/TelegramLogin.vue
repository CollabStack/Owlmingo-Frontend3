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

// components/auth/TelegramLogin.vue
<template>
  <div class="relative">
    <!-- Custom Button -->
    <button 
      @click="triggerTelegramLogin"
      class="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
    >
      <!-- Telegram Icon -->
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M21.2 7.6L3.4 16.5c-1.2.6-1.2 2.3 0 2.9l4.8 2.4c.4.2.9.1 1.2-.2l8.3-8.3" />
        <path d="m7.4 21.8 1.5-5.8 12.3-12.3c.3-.3.8-.3 1.1 0l2.8 2.8c.3.3.3.8 0 1.1L12.8 19.9l-5.4 1.9z" />
      </svg>
      Login 
    </button>

    <!-- Hidden Original Telegram Login Button -->
    <div id="telegram-login" class="opacity-0 h-0 overflow-hidden"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const botUsername = "owlmingo_bot"
const telegramLoginButton = ref(null)

onMounted(() => {
  // Create and append the Telegram script
  const script = document.createElement("script")
  script.src = "https://telegram.org/js/telegram-widget.js?22"
  script.setAttribute("data-telegram-login", botUsername)
  script.setAttribute("data-size", "large")
  script.setAttribute("data-radius", "20")
  script.setAttribute("data-onauth", "onTelegramAuth(user)")
  script.setAttribute("data-request-access", "write")
  document.getElementById("telegram-login").appendChild(script)

  // Set up a mutation observer to watch for the iframe
  const observer = new MutationObserver((mutations, obs) => {
    const iframe = document.querySelector(`iframe[name="telegram-login-${botUsername}"]`)
    if (iframe) {
      telegramLoginButton.value = iframe
      obs.disconnect()
    }
  })

  observer.observe(document.getElementById("telegram-login"), {
    childList: true,
    subtree: true
  })
})

// Function to trigger click on hidden Telegram button
const triggerTelegramLogin = () => {
  if (telegramLoginButton.value) {
    const clickEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true
    })
    telegramLoginButton.value.dispatchEvent(clickEvent)
  } else {
    console.warn('Telegram login button not found')
  }
}

// Global callback function
window.onTelegramAuth = (user) => {
  console.log("User authenticated:", user)
  alert(`Hello ${user.first_name}, you are logged in!`)
  // Handle the authenticated user data here
}
</script>