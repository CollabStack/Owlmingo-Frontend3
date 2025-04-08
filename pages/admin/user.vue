<template>
    <div class="mx-3 mt-3">
      <AdminGlobalTable
        :headers="headers"
        :items="users"
        :showEdit="true"
        :showActivate="true"
        :showDeactivate="true"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
    import { userAdminStore } from '~/store/userAdmin';  
  definePageMeta({
    layout: 'admin',
  });
  
  // Define headers for the table
  const headers = ref([
    { text: "Name", value: "username" },
    { text: "Role", value: "role" },
    { text: "Email", value: "email" },
    { text: "Is Verify", value: "isVerified" },
    { text: "Is Active", value: "isActive" },
    { text: "Telegram", value: "telegram_id" },
    { text: "GitHub", value: "github_id" },
    { text: "Google", value: "google_id" },
    { text: "Created At", value: "createdAt" },
    { text: "Updated At", value: "updatedAt" },
  ]);
  
  // Store state
  const useUserAdminStore = userAdminStore();
  const users = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  
  // Fetch users when the component is mounted
  onMounted(async () => {
    try {
      isLoading.value = true;
      // Fetch users from the store
      users.value = await useUserAdminStore.getAllUsers();
    } catch (err) {
      error.value = "Failed to fetch users.";
      console.error(error.value, err);
    } finally {
      isLoading.value = false;
    }
  });
  </script>
  