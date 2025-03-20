<template>
  <v-app>
    <!-- <v-app-bar> -->
      <UserNavbar v-if="!hideFooter" />
    <!-- </v-app-bar> -->
    <v-main>
      <transition name="fade" mode="out-in">
        <div :key="$route.fullPath">
          <slot />
        </div>
      </transition>
    </v-main>
    <!-- Footer -->
    <Footer v-if="!hideFooter" />
  </v-app>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { onBeforeMount } from 'vue';
const route = useRoute();
const hideFooter = computed(() => route.path === '/auth' || route.path === '/auth/sign-up' || route.path === '/quiz/do-quiz');

// onBeforeMount(() => {
//   const route = useRoute();
//     const hash = route.hash;

//     if (hash.startsWith("#tgAuthResult=")) {
//         const encodedData = hash.replace("#tgAuthResult=", "");
        
//         try {
//             let userData = decodeBase64(encodedData);
//             if (userData) {
//                 console.log("Telegram Auth Data:", userData);
//                 const response = await userAuthStore.telegramOAuth(userData);
//                 console.log("Telegram Auth Response Page:", response);
//                 if (response.status === 200) {
//                     navigateTo("/");
//                 }
//             } 
            
//         } catch (error) {
//             console.error("Error decoding Telegram Auth Result:", error);
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Login Failed',
//                 text: 'Failed to authenticate with Telegram.'
//             });
//         }
//     }
// });

</script>