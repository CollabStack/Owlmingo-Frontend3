<template>
  <v-col cols="12" class="d-flex flex-row justify-center align-center mt-20">
    <v-card-text class="left-section-img-bg d-flex flex-row justify-end align-center mx-0 px-0">
      <v-img 
          width="400px"
          aspect-ratio="16/9"
          src="/images/Image-Banner-Signin.png"
          ></v-img>
    </v-card-text>
    <v-card-text class="right-section-new-pass d-flex flex-column justify-center align-center mx-0 px-25">
      <h2 class="mt-5 text-info">New Password</h2>
      <p class="mt-3 text-center">
        Create a new password for <span class="font-weight-bold">{{ email }}</span>
      </p>
      <v-form class="mt-5 new-pass-form">
        <v-text-field
          v-model="password"
          label="New Password"
          :type="showPassword ? 'text' : 'password'"
          rounded
          variant="outlined"
          class="custom-text-field max-width"
          min-width="422px"
          min-height="62px"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          :rules="[v => !!v || 'Password is required', v => v.length >= 8 || 'Password must be at least 8 characters']"
        ></v-text-field>
        
        <!-- Password strength indicator -->
        <div class="password-strength mb-2" v-if="password">
          <div class="d-flex justify-space-between align-center">
            <span class="text-caption">Password strength:</span>
            <span class="text-caption font-weight-medium" :class="passwordStrengthColor">{{ passwordStrength }}</span>
          </div>
          <v-progress-linear
            :model-value="passwordStrengthScore * 25"
            height="6"
            rounded
            :color="passwordStrengthColor"
            class="mt-1"
          ></v-progress-linear>
          <div class="text-caption mt-1 text-grey" v-if="password.length < 8">
            Use at least 8 characters
          </div>
        </div>
        
        <v-text-field
          v-model="confirmPassword"
          label="Confirm Password"
          :type="showConfirmPassword ? 'text' : 'password'"
          rounded
          variant="outlined"
          class="custom-text-field max-width"
          min-width="422px"
          min-height="62px"
          :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showConfirmPassword = !showConfirmPassword"
          :error="confirmPassword && !passwordsMatch"
          :error-messages="confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''"
          :rules="[v => !!v || 'Confirm password is required', v => v === password || 'Passwords must match']"
        ></v-text-field>
        
      </v-form>
      <v-btn 
        @click="resetPassword" 
        color="blue-lighten-2" 
        class="send-btt mt-5 py-3 text-white"
        :loading="isSubmitting"
        :disabled="isSubmitting || !isValidPassword || !passwordsMatch"
      >
        Reset Password
      </v-btn>

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
            <a @click="gotoSignUp" class="text-caption text-decoration-none text-black font-weight-bold ml-2 cursor-pointer">
              Sign Up
            </a>
        </div>
    </v-card-text>
  </v-col>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { userAuth } from '~/store/userAuth';
import Swal from 'sweetalert2';

const authStore = userAuth();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);

// Add route to access query parameters
const route = useRoute();

// Password strength
const passwordStrengthScore = computed(() => {
  if (!password.value) return 0;
  
  let score = 0;
  
  // Length check
  if (password.value.length >= 8) score += 1;
  if (password.value.length >= 12) score += 1;
  
  // Contains number
  if (/[0-9]/.test(password.value)) score += 1;
  
  // Contains special character
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) score += 1;
  
  // Contains uppercase and lowercase
  if (/[A-Z]/.test(password.value) && /[a-z]/.test(password.value)) score += 1;
  
  return Math.min(4, score);
});

const passwordStrength = computed(() => {
  const score = passwordStrengthScore.value;
  if (score === 0) return 'Very Weak';
  if (score === 1) return 'Weak';
  if (score === 2) return 'Medium';
  if (score === 3) return 'Strong';
  return 'Very Strong';
});

const passwordStrengthColor = computed(() => {
  const score = passwordStrengthScore.value;
  if (score === 0) return 'red';
  if (score === 1) return 'orange';
  if (score === 2) return 'yellow';
  if (score === 3) return 'light-green';
  return 'green';
});

// Password validation
const passwordsMatch = computed(() => {
  return !confirmPassword.value || password.value === confirmPassword.value;
});

const isValidPassword = computed(() => {
  return password.value.length >= 8;
});

onMounted(() => {
    console.log('NewPassword component mounted');
    
    // Get email from query parameter or localStorage
    if (route.query.email) {
        email.value = route.query.email;
        console.log('Retrieved email from query parameter:', email.value);
    } else if (localStorage.getItem('resetPasswordEmail')) {
        email.value = localStorage.getItem('resetPasswordEmail');
        console.log('Retrieved email from localStorage:', email.value);
    } else {
        // If no email is found, redirect back to forgot password
        Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Your password reset session has expired. Please try again.'
        }).then(() => {
            navigateTo('/auth/forgot-password');
        });
    }
    
    // Check if OTP exists
    const otp = localStorage.getItem('resetOTP');
    if (!otp) {
        console.warn('No OTP found for password reset');
        Swal.fire({
            icon: 'warning',
            title: 'Verification Required',
            text: 'Please verify your email with the OTP code first.'
        }).then(() => {
            // Redirect to OTP page with email and type parameters
            navigateTo({
                path: '/auth/otp',
                query: { 
                    type: 'reset-password',
                    email: email.value 
                }
            });
        });
    }
});

const gotoSignUp = () => {
    console.log('Redirecting to signup');
    navigateTo('/auth/sign-up');  
};

const resetPassword = async () => {
    if (!email.value) {
        Swal.fire({
            icon: 'error',
            title: 'Email Required',
            text: 'Email address is missing. Please return to the forgot password page.'
        });
        return;
    }
    
    if (!isValidPassword.value) {
        Swal.fire({
            icon: 'error',
            title: 'Invalid Password',
            text: 'Please enter a password with at least 8 characters.'
        });
        return;
    }
    
    if (!passwordsMatch.value) {
        Swal.fire({
            icon: 'error',
            title: 'Passwords Don\'t Match',
            text: 'Please make sure both passwords match.'
        });
        return;
    }
    
    // Check if OTP exists
    const resetOTP = localStorage.getItem('resetOTP');
    if (!resetOTP) {
        Swal.fire({
            icon: 'error',
            title: 'OTP Missing',
            text: 'Verification code is missing. Please verify your email first.'
        }).then(() => {
            navigateTo({
                path: "/auth/otp", 
                query: { 
                    type: 'reset-password',
                    email: email.value
                }
            });
        });
        return;
    }
    
    try {
        isSubmitting.value = true;
        
        // Call the resetPassword method with email and new password
        // The method will get the OTP from localStorage
        await authStore.resetPassword(email.value, password.value);
        
        // Show success message
        Swal.fire({
            title: 'Success',
            text: 'Your password has been successfully reset. Please log in with your new password.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
        // Navigate to login page after password reset
        setTimeout(() => {
            navigateTo("/");
        }, 2000);
    } catch (error) {
        console.error('Password reset failed:', error);
        
        // Show error message
        Swal.fire({
            icon: 'error',
            title: 'Password Reset Failed',
            text: error.message || 'An error occurred while resetting your password. Please try again.'
        });
        
        // If it's an OTP validation error, redirect back to OTP page
        if (error.message && (error.message.includes('Invalid OTP') || error.message.includes('expired'))) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Verification Code',
                text: 'Your verification code is invalid or has expired. Please request a new one.'
            }).then(() => {
                navigateTo({
                    path: "/auth/forgot-password"
                });
            });
        }
    } finally {
        isSubmitting.value = false;
    }
};
</script>
  
<style scoped>
.right-section-new-pass {
  width: 45%;
  height: 600px;
}
.left-section-img-bg {
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
  width: 400px;
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
.password-strength {
  width: 400px;
}
.ml-2 {
  margin-left: 8px;
}
.cursor-pointer {
  cursor: pointer;
}
.max-width {
  max-width: 422px;
}
</style>