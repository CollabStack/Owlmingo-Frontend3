<template>
    <div class="mt-5">
      <home-page-banner />
      <home-page-future1 />
      <!-- <home-page-aicard /> -->
      <home-page-future2 />
      <home-page-future3 />
    </div>
</template>


<script setup>
import Footer from '../components/Footer.vue';

  definePageMeta({
    layout: 'default',
  });

  const TestingFunc = () => {
    console.log('Testing');
  }
</script>
