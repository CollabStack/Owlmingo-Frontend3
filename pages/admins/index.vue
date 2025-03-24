<template>
    <v-container>
      <SidebarDashboard />
    </v-container>
  </template>
  
  <script setup>
  import SidebarDashboard from '~/components/admin/SidebarDashboard.vue';
  
  definePageMeta({
    layout: 'admin',
  });
  
  </script>
  