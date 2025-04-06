<!-- <template>
    <div>
        <h2 class="text-h5 mb-4 text-primary">Change Password</h2>
        <v-text-field label="Current Password" type="password" variant="outlined" />
        <v-text-field label="New Password" type="password" variant="outlined" />
        <v-text-field label="Confirm New Password" type="password" variant="outlined" />
        <v-btn color="primary" class="mt-2">Change Password</v-btn>
    </div>
</template> -->
<template>
    <div>
      <h2 class="text-h5 mb-4 text-primary">Change Password</h2>
  
      <v-text-field
        v-model="oldPassword"
        label="Current Password"
        :type="showOldPassword ? 'text' : 'password'"
        variant="outlined"
        :append-inner-icon="showOldPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showOldPassword = !showOldPassword"
      />
  
      <v-text-field
        v-model="newPassword"
        label="New Password"
        :type="showNewPassword ? 'text' : 'password'"
        variant="outlined"
        :append-inner-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showNewPassword = !showNewPassword"
      />
  
      <v-text-field
        v-model="confirmNewPassword"
        label="Confirm New Password"
        :type="showConfirmPassword ? 'text' : 'password'"
        variant="outlined"
        :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append-inner="showConfirmPassword = !showConfirmPassword"
      />
  
      <v-btn color="primary" class="mt-2" :loading="loading" @click="handleChangePassword">
        Change Password
      </v-btn>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import Swal from 'sweetalert2';
  import { userAuth } from '~/store/userAuth';
  
  const userStore = userAuth();
  
  // Form state
  const oldPassword = ref('');
  const newPassword = ref('');
  const confirmNewPassword = ref('');
  const loading = ref(false);
  
  // Eye toggle state
  const showOldPassword = ref(false);
  const showNewPassword = ref(false);
  const showConfirmPassword = ref(false);
  
  const handleChangePassword = async () => {
    if (!oldPassword.value || !newPassword.value || !confirmNewPassword.value) {
      Swal.fire('Error', 'All fields are required.', 'error');
      return;
    }
  
    if (newPassword.value !== confirmNewPassword.value) {
      Swal.fire('Error', 'New passwords do not match.', 'error');
      return;
    }
  
    loading.value = true;
  
    try {
      await userStore.changePassword({
        old_password: oldPassword.value,
        new_password: newPassword.value,
      });
  
      Swal.fire('Success', 'Password changed successfully!', 'success');
  
      // Reset fields
      oldPassword.value = '';
      newPassword.value = '';
      confirmNewPassword.value = '';
      showOldPassword.value = false;
      showNewPassword.value = false;
      showConfirmPassword.value = false;
    } catch (error: any) {
      console.error('Password change error:', error);
      Swal.fire(
        'Error',
        error?.response?.data?.message || 'Failed to change password.',
        'error'
      );
    } finally {
      loading.value = false;
    }
  };
  </script>
  