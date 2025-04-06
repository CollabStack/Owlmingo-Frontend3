<template>
    <v-container class="d-flex justify-center align-center" style="min-height: 100vh;">
        <v-card width="400" elevation="2" class="pa-6 rounded-lg">
            <div class="text-center ma-8">
                <img src="/logo/icon-no-bg.svg" alt="Logo" width="75px" class="mb-4" />
                <h1 class="text-h4 text-primary">Owlmingo</h1>
            </div>
            <!-- <v-card-title class="text-h5 text-center mb-4">Admin Login</v-card-title> -->
            <v-form @submit.prevent="handleAdminLogin" ref="formRef" v-model="formValid">
                <v-text-field label="Email" v-model="email" type="email" :rules="[rules.required, rules.email]"
                    prepend-inner-icon="mdi-email" />
                <v-text-field label="Password" v-model="password" type="password" :rules="[rules.required]"
                    prepend-inner-icon="mdi-lock" />
                <v-btn class="mt-4" color="primary" block type="submit" :loading="loading">
                    Login as Admin
                </v-btn>
            </v-form>
        </v-card>
    </v-container>
</template>

<script setup>
definePageMeta({
    layout: 'blank',
});
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { adminAuth } from '~/store/adminAuth';
const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const formValid = ref(false);
const formRef = ref(null);
const useAdminAuth = adminAuth();


const rules = {
    required: v => !!v || 'This field is required',
    email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
};

const handleAdminLogin = async () => {
    loading.value = true;

    const isValid = await formRef.value.validate(); // ✅ Wait for Vuetify validation

    if (!isValid) {
        loading.value = false;
        return;
    }

    try {
        const response = await useAdminAuth.login(email.value, password.value);
        console.log('Login response:', response);
        Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome back!',
            showConfirmButton: false,
            timer: 1500,
        });
        router.push('/admin');
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error?.response?.data?.message || error.message,
        });
    } finally {
        loading.value = false;
    }
};

</script>