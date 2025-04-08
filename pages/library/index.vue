<template>
  <div>
    <Library />
  </div>
</template>

<script setup>
import Library from '~/components/Library/Library.vue';

definePageMeta({
  layout: 'default',
  middleware: 'auth', // ✅ This protects the page
});

</script>