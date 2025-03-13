<template>
  <v-col cols="12">
    <banner />
    <home-page-future1/>
    <home-page-future2/>
    <home-page-future3/>
    <Future3/>
  </v-col>
</template>
<script setup>

  definePageMeta({
    layout: 'default',
  });

  const TestingFunc = () => {
    console.log('Testing');
  }
</script>
