<template>
    <v-col cols="12" class="d-flex flex-row justify-center mt-10">
            <v-card-text class="image-banner d-flex justify-center">
                    <v-img 
                    width="400px"
                    aspect-ratio="16/9"
                    src="/images/Image-Banner-Signin.png"
                    ></v-img>
            </v-card-text>
            <v-card-text class="sign-in-form d-flex justify-center align-center">
                
        <v-form class="signup">
                <h2 class="headline text-center text-blue-darken-2">
                    Log in to continue your learning journey
                </h2>
                <v-text-field
                    v-model="email"
                    label="Email"
                    type="password"
                    variant="outlined"
                    rounded
                    class="custom-text-field"
                ></v-text-field>

                <v-text-field
                    v-model="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    rounded
                    class="custom-text-field"
                ></v-text-field>

                <div class="d-flex justify-end">
                    <a href="#" class="text-caption text-decoration-none text-black">
                        forgot password?
                    </a>
                </div>

                <v-btn block color="blue-lighten-2" class="sign-in-btt mt-4 py-3 text-white">
                    Login
                </v-btn>

                <p class="text-center mt-4 text-grey-darken-1">Or continue with</p>

                <div class="icon d-flex justify-center mt-2">
                    <v-img style="margin-right: -50px;"
                    width="50px"
                    height="50px"
                    src="/icons/icons8-google-480.png"
                    ></v-img>
                    <v-img style="margin-left: -50px; margin-right: -50px;"
                    width="50px"
                    height="50px"
                    src="/icons/icons8-github-480.png"
                    ></v-img>
                    <v-img style="margin-left: -50px;"
                    width="50px"
                    height="50px"
                    src="/icons/icons8-telegram-480.png"
                    >
                    </v-img>
                </div>
            </v-form>
            </v-card-text>
        </v-col>
    </template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { userAuth } from '~/store/userAuth';

const authStore = userAuth();
const email = ref('');
const password = ref('');

onMounted(() => {
    console.log('Sign In mounted');
});

const login = async () => {
    try {
        await authStore.login(email.value, password.value);
        navigateTo("/");
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.response?.data?.message || 'Please check your credentials and try again.'
        });
    }
};

</script>
<style scoped>
    .image-banner {
        width: 600px;
        height: 600px;
    }
    .sign-in-form {
        width: 600px;
        height: 600px; 
    }
    .headline {
        margin-bottom: 30px;
    }
    .custom-text-field {
        /* background-color: rgb(231, 204, 239); */
        border-radius: 10px;
    }
    .custom-text-field :deep(.v-field) {
        background-color: #EFF2FE !important;
        border-radius: 10px !important;
    }
    .custom-text-field :deep(.v-field__control) {
        background-color: #EFF2FE !important;
        border-radius: 10px !important;
        padding: 14px;
        border: 1px solid #EFF2FE !important;
    }
    .custom-text-field :deep(.v-label) {
        color: #9e9e9e !important;
        font-weight: 500;
    }
    .custom-text-field :deep(.v-field__outline) {
        border-radius: 10px !important;
        border: none !important;
        color: #EFF2FE !important;
    }
    .custom-text-field :deep(.v-field__underline) {
        display: none;
    }
    .custom-text-field :deep(.v-field__input) {
        background-color: #EFF2FE !important;
        border-radius: 10px !important;
        padding: 14px;
    }
    .custom-text-field :deep(.v-text-field__slot) {
        background-color: #EFF2FE !important;
    }
    .sign-in-btt {
        border-radius: 20px !important;
    }
    .icon {
        gap: 20px;
    }
    
    </style>