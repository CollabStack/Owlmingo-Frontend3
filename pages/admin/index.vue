<template>
  <AdminDashbord />
</template>

<script>

definePageMeta({
  layout: 'admin',
  middleware: 'admin-auth',
  meta: {
    requiresAuth: true,
  },
});
</script>