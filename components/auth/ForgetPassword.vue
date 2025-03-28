<script setup>
import { ref } from 'vue';
import { userAuth } from '~/store/userAuth';
import Swal from 'sweetalert2';

const authStore = userAuth();
const email = ref('');

const gotoSignIn = () => {
    // console.log('Back to Sign In');
    navigateTo('/auth/login');
}

const gotoSignUp = () => {
    // console.log('gotoSignUp');
    navigateTo('/auth/sign-up');
}

const forgotPassword = async () => {
    if (!email.value) {
        Swal.fire({
            icon: 'error',
            title: 'Email Required',
            text: 'Please enter your email address'
        });
        return;
    }
    
    try {
        await authStore.ForgotPassword(email.value);
        
        // Swal.fire({
        //     title: 'Email Sent',
        //     text: 'A verification code has been sent to your email',
        //     icon: 'success',
        //     timer: 2000,
        //     showConfirmButton: false
        // });
        
        // Pass the reset-password type to OTP component
        navigateTo({
            path: "/auth/otp",
            query: { type: 'reset-password' }
        });
    } catch (error) {
        // console.error('Forgot password error:', error);
        
        Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: error.response?.data?.message || 'Failed to process your request. Please try again.'
        });
    }
}
</script>

<template>
  <v-col cols="12" class="d-flex flex-row justify-center align-center mt-20">
    <v-card-text class="left-section-forgot-pass d-flex flex-column justify-center align-center mx-15  px-25">
      <h2 class="mt-5 text-info">Forgot Password</h2>
      <v-form class="mt-5 forgot-pass-form ">
        <v-text-field
          v-model="email"
          label="Email"
          rounded
          variant="outlined"
          class="custom-text-field max-width"
          min-width="422px"
          min-height="62px"
        ></v-text-field>
        <span class="d-flex justify-end text-accent" @click="gotoSignIn">
          Back to Sign In
        </span>
      </v-form>
      <v-btn @click="forgotPassword" color="blue-lighten-2" class="send-btt mt-5 py-3 text-white">
          Send
      </v-btn>

      <!-- Rest of the template remains the same -->
      <p class="text-center mt-10 text-grey-darken-1">Other Log in Option</p>

      <div class="icon d-flex flex-row justify-center mt-5">
        <v-btn icon="" class="icon-button-con">
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
        <div class="sign-up-option d-flex flex-row justify-center align-center mt-10">
            <p class="text-center text-grey-darken-1">Don't have an account?</p>
            <a @click="gotoSignUp" class="text-caption text-decoration-none text-black font-weight-bold">
              Sign Up
            </a>
        </div>
    </v-card-text>
    <v-card-text class="right-section-img-bg mr-n10">
      <v-img 
          width="400px"
          aspect-ratio="16/9"
          src="/images/Image-Banner-Signin.png"
          ></v-img>
    </v-card-text>
  </v-col>
</template>
  
<style scoped>
.left-section-forgot-pass {
  width: 45%;
  height: 600px;
}
.right-section-img-bg {
  width: 45%;
  height: 600px;
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
.send-btt {
  border-radius: 12px !important;
  width: 420px;
  height: 50px;
}
.icon {
  gap: 20px;
}
.icon-button-con {
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: background-color 0.3s, transform 0.3s;
 }
  .icon-button-con::before {
  content: "";
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
   transition: transform 0.6s ease-out;
}
.icon-button-con:hover::before {
  transform: translate(-50%, -50%) scale(3);
}
.icon-button-con:active::before {
  transform: scale(0.9);
 }
.con-button-con:hover {
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
.sign-up-option {
  background-color: #EBEBEB;
  gap: 10px;
  width: 300px;
  height: 50px;
  border-radius: 15px;
   }
</style>