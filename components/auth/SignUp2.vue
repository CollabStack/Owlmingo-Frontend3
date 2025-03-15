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
                    v-model="username"
                    label="Username"
                    type="text"
                    variant="outlined"
                    rounded
                    class="custom-text-field"
                ></v-text-field>
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
                    type="password"
                    variant="outlined"
                    rounded
                    class="custom-text-field"
                ></v-text-field>

                <div class="d-flex justify-end">
            <a href="#" class="text-caption text-decoration-none text-black font-weight-bold" style="margin-left: 288px;"> 
                        forgot password?
                    </a>
                </div>

                <v-btn @click = "signUp" block color="blue-lighten-2" class="sign-in-btt mt-4 py-3 text-white">
                    Sign Up
                </v-btn>

                <p class="text-center mt-10 text-grey-darken-1">Other Log in Option</p>

                <div class="icon d-flex flex-row justify-center mt-5">
                    <v-btn icon="" class="icon-button">
                        <v-img
                            width="50px"
                            height="50px"
                            src="/icons/icons8-google-logo.png"
                        ></v-img>
                    </v-btn>
                    <v-btn icon="" class="icon-button">
                        <v-img
                            width="50px"
                            height="50px"
                            src="/icons/icons8-github-logo.png"
                        ></v-img>
                    </v-btn>
                    <v-btn icon="" class="icon-button">
                        <v-img
                            width="50px"
                            height="50px"
                            src="/icons/icons8-telegram-app-100.png"
                        ></v-img>
                    </v-btn>
                </div>
            </v-form>
            </v-card-text>
        </v-col>
    </template>
    
    <script setup> 
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';
import { userAuth } from '~/store/userAuth';

const authStore = userAuth();
const username = ref('');
const email = ref('');
const password = ref('');

onMounted(() => {
    console.log('Sign Up mounted');
});

const signUp = async () => {
   try {
       await authStore.signUp(username.value, email.value, password.value);
       
       // Store email in localStorage for OTP verification
       localStorage.setItem('signupEmail', email.value);
       
       Swal.fire({
        title: 'Success',
        text: 'You have been successfully signed up',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
        });
        navigateTo("/auth/otp");
   } catch (error) {
       Swal.fire({
           icon: 'error',
           title: 'Sign Up Failed',
           text: error.response?.data?.message || 'Please check your credentials and try again.'
       });
   }
}
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
        animation:  bounce 1s infinite;
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
    
    </style>