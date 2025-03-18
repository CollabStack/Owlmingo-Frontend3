<template>
    <div>
      <Otp :type="$route.query.type || 'email'" />
    </div>
  </template>
  
  <script setup>
  import Otp from '~/components/auth/Otp.vue';
  </script>