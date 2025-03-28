<template>
  <v-col cols="12" class="d-flex flex-row justify-center align-center mt-20">
    <v-card-text class="left-section-otp d-flex flex-column justify-center align-center mx-15 px-25">
      <h2 class="mt-10 text-info">{{ verificationType === 'email' ? 'Email Verification' : 'Password Reset Verification' }}</h2>
      <p class="mt-5 text-info">
        Enter the verification code sent to 
        <span class="font-weight-medium">{{ email }}</span>
      </p>
      
      <!-- Display OTP error if exists -->
      <p v-if="otpError" class="text-error mt-2 text-center">{{ otpError }}</p>
      
      <!-- Display remaining attempts if available -->
      <p v-if="remainingAttempts !== null" class="text-warning mt-2 text-center">
        You have {{ remainingAttempts }} attempts remaining
      </p>
      
      <v-otp-input 
        v-model="otp" 
        class="mb-4 mt-5 max-width" 
        min-width="422px" 
        min-height="62px"
        type="number"
        :length="6"
      ></v-otp-input>
      
      <!-- Updated resend OTP UI -->
      <div class="d-flex align-center">
        <p class="mt-5 mr-2">If you didn't receive a code,</p>
        <v-btn
          variant="text"
          color="blue-darken-1"
          class="resend-btn px-0"
          :disabled="resendTimeLeft > 0 || isResending"
          @click="resendOtp"
        >
          <span v-if="resendTimeLeft > 0">Resend in {{ resendTimeLeft }}s</span>
          <span v-else-if="isResending">Sending...</span>
          <span v-else>Resend</span>
        </v-btn>
      </div>
      
      <v-btn 
        @click="verifyOtp" 
        color="blue-lighten-2" 
        class="send-btt mt-5 py-3 text-white"
        :loading="isVerifying"
        :disabled="isVerifying || !otp || otp.length < 6"
      >
        Verify
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
    <v-card-text class="right-section-img-bg mr-n10">
      <v-img 
          width="400px"
          aspect-ratio="16/9"
          src="/images/Image-Banner-Signin.png"
          ></v-img>
    </v-card-text>
  </v-col>
</template>

<script setup>
import Swal from 'sweetalert2';
import { ref, onMounted, computed } from 'vue';
import { userAuth } from '~/store/userAuth';

const authStore = userAuth();

// Define props but also prepare for retrieving email from localStorage
const props = defineProps({
    email: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'email', // 'email' for signup verification, 'reset-password' for forgotten password
        validator: (value) => ['email', 'reset-password'].includes(value)
    }
});

// Get route for query parameters
const route = useRoute();

// Create email ref that can be populated from multiple sources
const email = ref('');
const otp = ref('');
const isResending = ref(false);
const isVerifying = ref(false);
const resendTimeLeft = ref(0);
const resendTimer = ref(null);
const remainingAttempts = ref(null);
const otpError = ref('');
const verificationType = ref('email');

const gotoSignUp = () => {
    // console.log('Redirecting to signup');
    navigateTo('/auth/sign-up');
}

onMounted(() => {
    console.log('Otp component mounted');
    
    // Determine the verification type from props or query parameter
    if (props.type === 'reset-password' || route.query.type === 'reset-password') {
        verificationType.value = 'reset-password';
    } else {
        verificationType.value = 'email';
    }
    
    console.log('Verification type:', verificationType.value);
    
    // Get email based on verification type
    if (verificationType.value === 'reset-password') {
        if (localStorage.getItem('resetPasswordEmail')) {
            email.value = localStorage.getItem('resetPasswordEmail');
            // console.log('Retrieved reset password email from localStorage:', email.value);
        } else if (props.email) {
            email.value = props.email;
            // console.log('Using reset password email from props:', email.value);
        } else if (route.query.email) {
            email.value = route.query.email;
            // console.log('Using reset password email from query:', email.value);
        }
    } else {
        // For email verification after signup
        if (localStorage.getItem('signupEmail')) {
            email.value = localStorage.getItem('signupEmail');
            // console.log('Retrieved signup email from localStorage:', email.value);
        } else if (props.email) {
            email.value = props.email;
            // console.log('Using signup email from props:', email.value);
        } else if (route.query.email) {
            email.value = route.query.email;
            // console.log('Using signup email from query:', email.value);
        }
    }
    
    if (!email.value) {
        console.warn('No email found for verification');
        // Redirect based on verification type
        if (verificationType.value === 'reset-password') {
            Swal.fire({
                icon: 'error',
                title: 'Email Missing',
                text: 'No email address found for password reset.'
            }).then(() => {
                navigateTo('/auth/forgot-password');
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Email Missing',
                text: 'No email address found for verification.'
            }).then(() => {
                navigateTo('/auth/sign-up');
            });
        }
    }
    
    // Start the resend timer on page load
    startResendTimer();
});

const startResendTimer = () => {
    // Set a 3-minute countdown for resend
    resendTimeLeft.value = 180;
    clearInterval(resendTimer.value);
    
    resendTimer.value = setInterval(() => {
        resendTimeLeft.value -= 1;
        if (resendTimeLeft.value <= 0) {
            clearInterval(resendTimer.value);
        }
    }, 1000);
};

const resendOtp = async () => {
    if (!email.value) {
        Swal.fire({
            icon: 'error',
            title: 'Email Missing',
            text: 'Please go back and try again.'
        });
        return;
    }
    
    if (resendTimeLeft.value > 0) {
        return; // Don't allow resend while countdown is active
    }
    
    try {
        isResending.value = true;
        
        // Use the appropriate resend method based on verification type
        if (verificationType.value === 'reset-password') {
            // For password reset, resend OTP using the forget-password endpoint
            await authStore.resendPasswordResetOTP(email.value);
        } else {
            // For email verification
            await authStore.resendOtp(email.value);
        }
        
        // Start the countdown timer
        startResendTimer();
        
        // Reset OTP input field and error messages since user will receive a new OTP
        otp.value = '';
        otpError.value = '';
        remainingAttempts.value = null;
        
        // Swal.fire({
        //     icon: 'success',
        //     title: 'OTP Resent',
        //     text: 'A new verification code has been sent to your email.',
        //     timer: 2000,
        //     showConfirmButton: false
        // });
    } catch (error) {
        // console.error('Failed to resend OTP:', error);
        
        // Handle specific error scenarios
        let errorMessage = error.message || 'An error occurred while resending the verification code.';
        
        // Check if it's a network error
        if (error.message && error.message.includes('Network Error')) {
            errorMessage = 'Network error. Please check your internet connection and try again.';
        }
        
        Swal.fire({
            icon: 'error',
            title: 'Failed to Resend OTP',
            text: errorMessage
        });
    } finally {
        isResending.value = false;
    }
};

const verifyOtp = async () => {
    try {
        if (!email.value) {
            throw new Error('Email is missing. Please go back and try again.');
        }
        
        if (!otp.value || otp.value.length < 6) {
            throw new Error('Please enter a valid 6-digit OTP code.');
        }
        
        isVerifying.value = true;
        console.log(`Verifying OTP for ${verificationType.value}:`, { email: email.value, otp: otp.value });
        otpError.value = ''; // Clear any previous errors
        
        if (verificationType.value === 'reset-password') {
            // For password reset, we don't need to verify the OTP separately
            // Just store the OTP and proceed to reset password page
            authStore.storePasswordResetOTP(otp.value);
            
            // Swal.fire({
            //     title: 'Success',
            //     text: 'Proceed to set your new password.',
            //     icon: 'success',
            //     timer: 2000,
            //     showConfirmButton: false
            // });
            
            // Navigate to the NewPassword page after storing OTP
            setTimeout(() => {
                navigateTo({
                    path: "/auth/new-password",
                    query: { email: email.value }
                });
            }, 2000);
        } else {
            // For email verification after signup, use the verifyOtp method
            await authStore.verifyOtp(email.value, otp.value);
            
            // If successful, clear stored email
            localStorage.removeItem('signupEmail');
            
            // Swal.fire({
            //     title: 'Success',
            //     text: 'Your account has been successfully verified',
            //     icon: 'success',
            //     timer: 2000,
            //     showConfirmButton: false
            // });
            
            // Navigate after the alert for email verification
            setTimeout(() => {
                navigateTo("/");
            }, 2000);
        }
    } catch (error) {
        // console.error('OTP verification failed:', error);
        
        // Extract remaining attempts from error message if available
        if (error.message && error.message.includes('attempts remaining')) {
            const match = error.message.match(/(\d+) attempts remaining/);
            if (match && match[1]) {
                remainingAttempts.value = parseInt(match[1]);
            }
        }
        
        // Set error message
        otpError.value = error.message || 'Please check your OTP code and try again.';
        
        // Show meaningful error message to the user
        Swal.fire({
            icon: 'error',
            title: 'Verification Failed',
            text: error.message || 'Please check your OTP code and try again.'
        });
        
        // If it's an invalid OTP error, clear the input so they can try again
        if (error.message && (error.message.includes('Invalid OTP') || error.message.includes('expired'))) {
            otp.value = '';
        }
    } finally {
        isVerifying.value = false;
    }
};
</script>
  
<style scoped>
.left-section-otp {
  width: 45%;
  height: 600px;
}
.right-section-img-bg {
  width: 45%;
  height: 600px;
}
.send-btt {
  border-radius: 12px !important;
  width: 400px;
  height: 40px;
}
.resend-btn {
  min-height: 24px !important;
  font-weight: bold;
  text-transform: none;
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
.text-error {
  color: #FF5252;
  font-weight: 500;
}
.text-warning {
  color: #FB8C00;
  font-weight: 500;
}
.width-100 {
  width: 100%;
}
.max-width {
  max-width: 422px;
}
.cursor-pointer {
  cursor: pointer;
}
.ml-2 {
  margin-left: 8px;
}
</style>