<template>
    <v-col cols="12" class="d-flex flex-row justify-center mt-10">
        <v-card-text class="image-banner d-flex justify-center">
            <v-img 
                width="400px"
                aspect-ratio="16/9"
                src="/images/Image-Banner-Signin.png"
                ></v-img>
        </v-card-text>
        <v-card-text class="sign-in-form d-flex flex-column justify-center align-center">
            <h2 class="headline text-center text-blue-darken-2" style="font-size: xx-large;">
                    Log in to continue your learning journey
            </h2>
            <v-form class="signup d-flex flex-column justify-center align-center">
                <v-text-field 
                    v-model="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    rounded
                    class="custom-text-field"
                ></v-text-field>

                <v-text-field
                    v-model="password"
                    label="Password"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    rounded
                    class="custom-text-field"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    @click:append-inner="showPassword = !showPassword"
                ></v-text-field>

                <div class="d-flex justify-end">
                    <span 
                      @click="gotoForgotPassword"
                      class="text-caption d-flex justify-end text-decoration-none text-blue-darken-1 font-weight-bold cursor-pointer" 
                      style="margin-left: 288px;">
                        Forgot password?
                    </span>
                </div>

                <v-btn 
                  @click="login" 
                  block 
                  color="blue-lighten-2" 
                  class="sign-in-btt mt-4 py-3 text-white"
                  :loading="isLoading"
                >
                    Login
                </v-btn>

                <p class="text-center mt-10 text-grey-darken-1">Other Log in Option</p>

                <div class="icon d-flex flex-row justify-center mt-5">
                    <v-btn icon="" class="icon-button" @click="googleOAuth">
                        <v-img
                            width="50px"
                            height="50px"
                            src="/icons/icons8-google-logo.png"
                        ></v-img>
                    </v-btn>
                    <v-btn icon="" class="icon-button" @click="githubOAuth">
                        <v-img
                            width="50px"
                            height="50px"
                            src="/icons/icons8-github-logo.png"
                        ></v-img>
                    </v-btn>
                    <TelegramLogin/>
                </div>
                <div class="sign-up-option d-flex flex-row justify-center align-center mt-10">
                    <p class="text-center text-grey-darken-1">Don't have an account?</p>
                    <a @click="gotoSignUp" class="text-caption text-decoration-none text-black font-weight-bold ml-2 cursor-pointer">
                        Sign Up
                    </a>
                </div>
            </v-form>
            
            </v-card-text>
            
        </v-col>
    </template>
    
    <script setup>
    import Swal from 'sweetalert2';
    import { ref, onMounted } from 'vue';
    import { userAuth } from '~/store/userAuth';
    import TelegramLogin from './TelegramLogin.vue';
    import { useNuxtApp } from '#app';

    const authStore = userAuth();
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const isLoading = ref(false);
    const runtimeConfig = useRuntimeConfig(); 

    onMounted(() => {
        console.log('Sign In mounted');
    });

    const login = async () => {
        if (!email.value || !password.value) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please enter both email and password.'
            });
            return;
        }

        try {
            isLoading.value = true;
            await authStore.login(email.value, password.value);
            
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back!',
                timer: 2000,
                showConfirmButton: false
            });
            
            navigateTo("/");
        } catch (error) {
            console.error('Login error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: error.response?.data?.message || 'Please check your credentials and try again.'
            });
        } finally {
            isLoading.value = false;
        }
    };

    const googleOAuth = async () => {
        window.location.href = `${runtimeConfig.public.USER_PUBLIC_API}google`;
    };

    const githubOAuth = async () => {
        window.location.href = `${runtimeConfig.public.USER_PUBLIC_API}github`;
    };

    const gotoForgotPassword = () => {
        console.log('Navigate to forgot password');
        navigateTo('/auth/forgot-password');
    };

    const gotoSignUp = () => {
        console.log('Navigate to sign up');
        navigateTo('/auth/sign-up');
    };
    
    </script>
    
    <style scoped>
    .image-banner {
        margin-right: -120px;
        width: 600px;
        height: 600px;
    }
    .sign-in-form {
        margin-left: -120px;
        width: 600px;
        height: 600px; 
    }
    .headline {
        margin-bottom: 18px;
        width: 400px;
    }
    .custom-text-field {
        width: 400px;
        height: 80px;
    }
    .custom-text-field :deep(.v-field) {
        background-color: #EFF2FE !important;
        border-radius: 10px !important;
    }
    .custom-text-field :deep(.v-field__control) {
        background-color: #EFF2FE !important;
        border-radius: 12px !important;
        padding: 14px;
        border: 1px solid #EFF2FE !important;
    }
    .custom-text-field :deep(.v-label) {
        color: #9e9e9e !important;
        font-weight: 500;
    }
    .custom-text-field :deep(.v-field__outline) {
        border-radius: 12px !important;
        border: none !important;
        color: #EFF2FE !important;
    }
    .custom-text-field :deep(.v-field__underline) {
        display: none;
    }
    .custom-text-field :deep(.v-field__input) {
        background-color: #EFF2FE !important;
        border-radius: 12px !important;
        padding: 14px;
    }
    .custom-text-field :deep(.v-text-field__slot) {
        background-color: #EFF2FE !important;
    }
    .sign-in-btt {
        border-radius: 12px !important;
        width: 400px;
        height: 50px;
    }
    .icon {
        gap: 20px;
    }
    .icon-button {
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: background-color 0.3s, transform 0.3s;
    }
    .icon-button::before {
        content: "";
        position: absolute;
        background-color: rgba(255, 255, 255, 0.1);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.6s ease-out;
    }
    .icon-button:hover::before {
        transform: translate(-50%, -50%) scale(3);
    }
    .icon-button:active::before {
        transform: scale(0.9);
    }
    .icon-button:hover {
        animation: bounce 1s infinite;
    }
    @keyframes bounce {
        0%,
        100% {
            transform: translateY(0);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    .sign-up-option {
        background-color: #EBEBEB;
        gap: 10px;
        width: 300px;
        height: 50px;
        border-radius: 15px;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .ml-2 {
        margin-left: 8px;
    }
    </style>