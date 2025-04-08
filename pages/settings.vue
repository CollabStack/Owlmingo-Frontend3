<template>
    <v-container fluid>
      <v-row class="d-flex justify-center align-center">
        <v-col cols="12" md="8" class="text-center">
          <h1 class="text-h4 font-weight-bold text-primary">Settings</h1>
          <p class="text-subtitle-1">Manage your account settings and preferences.</p>
        </v-col>
      </v-row>
  
      <div class="mt-8 mx-10">
        <SectionDivider />
      </div>
  
      <v-card class="mx-auto my-5" max-width="1200" outlined>
        <v-row>
          <!-- Left Sidebar Menu -->
          <v-col cols="12" md="3" class="pa-8" style="border-right: 1px solid #eee;">
            <v-list nav dense>
              <v-list-item
                v-for="(item, index) in menuItems"
                :key="index"
                :value="item.value"
                :class="[{ 'bg-grey-lighten-4': activePanel === item.value }, 'text-body-1']"
                @click="activePanel = item.value"
                class="rounded-lg mb-2"
              >
                <v-list-item-title class="text-body-1">{{ item.label }}</v-list-item-title>
              </v-list-item>
  
              <!-- Logout Button -->
              <v-list-item @click="logout" class="rounded-lg mb-2">
                <v-list-item-title class="text-body-1" >Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
  
          <!-- Right Panel Content -->
          <v-col cols="12" md="9" class="pa-8">
            <component :is="currentComponent" />
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { userAuth } from '~/store/userAuth'
  import Swal from "sweetalert2";

  
  // Import subcomponents
  import ProfilePanel from '../components/profile/ProfilePanel.vue'
  import ChangePasswordPanel from '../components/profile/ChangePasswordPanel.vue'
  import SubscriptionPanel from '../components/profile/SubscriptionPanel.vue'
  
  // Menu Items (exclude logout)
  const menuItems = [
    { label: 'Profile', value: 'profile' },
    { label: 'Change Password', value: 'change-password' },
    { label: 'Subscription', value: 'subscription' },
  ]
  
  const activePanel = ref('profile')
  const router = useRouter()
  const authStore = userAuth()

  const user = authStore.getUser()
  const newUser = ref(user)



  // Mounted 
  onMounted(() => {
    // Check if user is logged in
    const user = authStore.getUser()
    console.log("===================== user =====================");
    console.log(user);
    console.log("=================================================");
  })

  
  // Switch dynamic content based on selection
  const currentComponent = computed(() => {
    switch (activePanel.value) {
      case 'profile':
        return ProfilePanel
      case 'change-password':
        return ChangePasswordPanel
      case 'subscription':
        return SubscriptionPanel
      default:
        return ProfilePanel
    }
  })
  
  // Logout function
  function logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!'
    }).then((result) => {
      if (result.isConfirmed) {
        authStore.logout()
        router.push('/').then(() => {
          window.location.reload()
        })
      }
    })
  }
  </script>
  