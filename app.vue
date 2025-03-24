<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
import { userAuth } from '~/store/userAuth';
const userAuthStore = userAuth();
const config = useRuntimeConfig();
const paypalClientId = config.public.PAYPAL_CLIENT_ID;

useHead({
  script: [
    {
      src: "https://telegram.org/js/telegram-widget.js?22",
      async: true,
    },
    {
      src: `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=USD`,
      async: true,
    },
  ],
});
// Function to decode Base64
const decodeBase64 = (str) => {
    try {
        return JSON.parse(atob(str));
    } catch (error) {
        console.error("Failed to decode Telegram Auth Result:", error);
        return null;
    }
};
onBeforeMount( async () => {
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
        icon: "error",
        title: "Login Failed",
        text: "Failed to authenticate with Telegram.",
      });
    }
  }

  if(hash.startsWith("#token=")){
    const token = hash.replace("#token=", "");
    try {
      userAuthStore.setToken(token);
      navigateTo("/");
    } catch (error) {
      console.error("Error decoding SSO Result:", error);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Failed to authenticate with SSO.",
      });
    }
  }

  console.log("Before Mounted");
});
</script>