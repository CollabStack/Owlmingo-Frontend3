<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup>
useHead({
  script: [
    {
      src: "https://telegram.org/js/telegram-widget.js?22",
      async: true,
    },
  ],
});
</script>