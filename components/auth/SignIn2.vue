<template>
    <v-container class="auth-container">
      <v-row class="d-flex align-center">
        <!-- Left side - Image with enhanced animations -->
        <v-col cols="12" md="6" class="d-none d-md-flex justify-center">
          <div class="image-container"
            v-motion
            :initial="{ opacity: 0, x: -50, scale: 0.95 }"
            :enter="{ opacity: 1, x: 0, scale: 1, transition: { duration: 800, ease: 'easeOut' } }">
            <v-img 
              width="500"
              src="/images/Image-Banner-Signin.png"
              alt="Login Banner"
              class="auth-image"
              :class="{ 'pulse-animation': isImageAnimated }"
              @mouseover="isImageAnimated = true"
              @mouseleave="isImageAnimated = false"
            ></v-img>
          </div>
        </v-col>
  
        <!-- Right side - Form with enhanced styling and functionality -->
        <v-col cols="12" md="6" class="d-flex flex-column justify-center">
          <div class="auth-form-container"
            v-motion
            :initial="{ opacity: 0, y: 20, scale: 0.98 }"
            :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 700, ease: 'easeOut' } }">
            
            <div class="text-center mb-6">
              <h2 class="text-h4 font-weight-bold gradient-text-alt outfit outfit-bold mb-2">
                Welcome Back
              </h2>
              <p class="text-subtitle-1 text-grey-darken-1 outfit outfit-regular">
                Log in to continue your learning journey
              </p>
            </div>
            
            <v-form class="auth-form" ref="form" v-model="isFormValid" @submit.prevent="login">
              <!-- Error alert -->
              <v-alert
                v-if="errorMessage"
                type="error"
                variant="tonal"
                closable
                class="mb-4"
                @click:close="errorMessage = ''"
                icon="mdi-alert-circle"
              >
                {{ errorMessage }}
              </v-alert>
              
              <!-- Email field with validation -->
              <v-text-field 
                v-model="email"
                label="Email"
                type="email"
                variant="outlined"
                rounded="lg"
                class="custom-text-field outfit outfit-regular mb-4"
                prepend-inner-icon="mdi-email-outline"
                :rules="[
                  v => !!v || 'Email is required',
                  v => /.+@.+\..+/.test(v) || 'Please enter a valid email'
                ]"
                autocomplete="username"
                required
              ></v-text-field>
  
              <!-- Password field with visibility toggle -->
              <v-text-field
                v-model="password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                rounded="lg"
                class="custom-text-field outfit outfit-regular"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                :rules="[v => !!v || 'Password is required']"
                autocomplete="current-password"
                required
              ></v-text-field>
  
              <div class="d-flex justify-space-between align-center mb-3">
                <!-- Remember me checkbox -->
                <v-checkbox
                  v-model="rememberMe"
                  label="Remember me"
                  class="outfit outfit-regular"
                  color="secondary"
                  density="compact"
                  hide-details
                ></v-checkbox>
                
                <!-- Forgot password link -->
                <NuxtLink to="/auth/forgot-password" class="text-caption text-decoration-none outfit outfit-medium text-secondary forgot-password-link hover-underline">
                    Forgot password?
                </NuxtLink>
              </div>
  
              <!-- Login button with loading state -->
              <v-btn 
                block 
                color="secondary" 
                class="animated-btn outfit outfit-medium mt-4 py-3"
                height="50"
                rounded="lg"
                elevation="1"
                type="submit"
                :loading="isLoading"
                :disabled="!isFormValid || isLoading"
              >
                <span class="d-flex justify-center align-center w-100">
                  {{ isLoading ? 'Logging in...' : 'Login' }}
                  <v-icon class="ms-2 btn-icon">login</v-icon>
                </span>
              </v-btn>
  
                          <!-- Divider -->
            <div class="divider-container my-6">
              <v-divider class="divider-line"></v-divider>
              <span class="divider-text text-grey-darken-1 outfit outfit-regular px-3">or continue with</span>
              <v-divider class="divider-line"></v-divider>
            </div>
  
              <!-- Social login buttons with hover effects -->
              <div class="social-login-container d-flex justify-center mb-6">
                <v-tooltip text="Sign in with Google" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn variant="outlined" color="grey-lighten-3" class="social-btn mx-2" rounded="lg" v-bind="props" @click="socialLogin('google')">
                      <v-img width="24" height="24" src="/icons/icons8-google-logo.png" alt="Google"></v-img>
                    </v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="Sign in with GitHub" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn variant="outlined" color="grey-lighten-3" class="social-btn mx-2" rounded="lg" v-bind="props" @click="socialLogin('github')">
                      <v-img width="24" height="24" src="/icons/icons8-github-logo.png" alt="GitHub"></v-img>
                    </v-btn>
                  </template>
                </v-tooltip>
                
                <v-tooltip text="Sign in with Telegram" location="top">
                  <template v-slot:activator="{ props }">
                    <v-btn variant="outlined" color="grey-lighten-3" class="social-btn mx-2" rounded="lg" v-bind="props" @click="socialLogin('telegram')">
                      <v-img width="24" height="24" src="/icons/icons8-telegram-app-100.png" alt="Telegram"></v-img>
                    </v-btn>
                  </template>
                </v-tooltip>
              </div>
  
              <!-- Sign up prompt -->
              <div class="sign-up-container d-flex justify-center align-center outfit outfit-regular">
                <span class="text-grey-darken-1 mr-2">Don't have an account?</span>
                <NuxtLink to="/auth/sign-up" class="text-decoration-none text-secondary font-weight-bold outfit outfit-medium">
                  Sign Up
                </NuxtLink>
              </div>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { userAuth } from '~/store/userAuth';
  
  const email = ref('');
  const password = ref('');
  const showPassword = ref(false);
  const rememberMe = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref('');
  const isFormValid = ref(false);
  const form = ref(null);
  const authStore = userAuth();
  const isImageAnimated = ref(false);
  
  // Function to handle regular login
  const login = async () => {
    if (!form.value.validate()) return;
    
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      await authStore.login(email.value, password.value, rememberMe.value);
      navigateTo("/");
    } catch (error) {
      errorMessage.value = error?.message || 'Login failed. Please check your credentials and try again.';
    } finally {
      isLoading.value = false;
    }
  };
  
  // Function to handle social login
  const socialLogin = async (provider) => {
    isLoading.value = true;
    errorMessage.value = '';
    
    try {
      await authStore.socialLogin(provider);
      navigateTo("/");
    } catch (error) {
      errorMessage.value = `${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please try again later.`;
    } finally {
      isLoading.value = false;
    }
  };
  </script>
  
  <style scoped>
  /* Import Outfit font */
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
  
  /* Outfit font classes */
  .outfit {
    font-family: "Outfit", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
  }
  
  .outfit-regular { font-weight: 400; }
  .outfit-medium { font-weight: 500; }
  .outfit-bold { font-weight: 700; }
  
  .auth-container {
    min-height: 85vh;
    padding: 2.5rem;
    background: linear-gradient(to bottom right, rgba(249, 250, 255, 0.8), rgba(246, 243, 255, 0.8));
    border-radius: 24px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);
  }
  
  .image-container {
    max-width: 1500px;
    padding: 2rem;
    position: relative;
  }
  
  .auth-image {
    transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    filter: drop-shadow(0 10px 15px rgba(157, 123, 252, 0.2));
    border-radius: 20px;
  }
  
  .auth-image:hover {
    transform: translateY(-8px) scale(1.02);
  }
  
  .pulse-animation {
    animation: subtle-pulse 4s infinite alternate ease-in-out;
  }
  
  @keyframes subtle-pulse {
    0% { transform: translateY(0) scale(1); }
    100% { transform: translateY(-8px) scale(1.02); }
  }
  
  .auth-form-container {
    max-width: 650px;
    width: 100%;
    margin: 0 auto;
    padding: 2.5rem 3rem;
    background-color: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  }
  
  .auth-form {
    width: 100%;
  }
  
  .custom-text-field :deep(.v-field) {
    background-color: rgba(248, 249, 253, 0.7) !important;
    border-radius: 12px !important;
    border: 1px solid rgba(157, 123, 252, 0.15) !important;
    transition: all 0.3s ease;
  }
  
  .custom-text-field :deep(.v-field:hover) {
    border-color: rgba(157, 123, 252, 0.4) !important;
    background-color: rgba(248, 249, 253, 0.9) !important;
  }
  
  .custom-text-field :deep(.v-field--focused) {
    border-color: var(--v-secondary-base, #9D7BFC) !important;
    border-width: 2px !important;
    box-shadow: 0 0 0 3px rgba(157, 123, 252, 0.15);
  }
  
  .custom-text-field :deep(.v-field__outline) {
    opacity: 0 !important;
  }
  
  .custom-text-field :deep(.v-field__input) {
    padding: 16px 12px !important;
    color: #333 !important;
    font-size: 1rem !important;
  }
  
  .custom-text-field :deep(.v-label) {
    font-family: 'Outfit', sans-serif !important;
    color: #666 !important;
    font-size: 0.95rem !important;
  }
  
  .custom-text-field :deep(.v-icon) {
    color: rgba(157, 123, 252, 0.7) !important;
  }
  
  /* Animated button */
  .animated-btn {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    position: relative;
    overflow: hidden;
    font-size: 1.1rem;
    letter-spacing: 0.5px;
  }
  
  .animated-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: all 0.6s ease;
  }
  
  .animated-btn:hover::before {
    left: 100%;
  }
  
  .animated-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(157, 123, 252, 0.3);
  }
  
.btn-icon {
    transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: flex;
    align-items: center;
    justify-content: center;
}
  
  .animated-btn:hover .btn-icon {
    transform: translateX(6px);
  }
  
  /* Divider styling */
 .divider-container {
  display: flex;
  align-items: center;
  width: 100%;
  text-align: center;
}

.divider-line {
  flex-grow: 1;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.12);
}

.divider-text {
  font-size: 0.875rem;
  color: #6c757d !important;
  margin: 0 1rem;
  white-space: nowrap;
}
  
  /* Social buttons */
  .social-btn {
    width: 54px;
    height: 54px;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    background-color: rgba(255, 255, 255, 0.8) !important;
    border: 1px solid rgba(157, 123, 252, 0.2) !important;
  }
  
  .social-btn:hover {
    transform: translateY(-5px) scale(1.05);
    background-color: white !important;
    box-shadow: 0 8px 15px rgba(157, 123, 252, 0.2);
    border-color: rgba(157, 123, 252, 0.5) !important;
  }
  
  .social-btn:active {
    transform: translateY(-2px);
  }
  
  /* Gradient text effects - enhanced with animation */
  .gradient-text-alt {
    background: linear-gradient(90deg, #1A237E, #3949AB, #7986CB);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: gradient-shift 8s infinite alternate ease-in-out;
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
  
  /* Responsive adjustments */
  @media (max-width: 960px) {
    .auth-form-container {
      padding: 2rem;
      margin-top: 1rem;
      max-width: 600px;
    }
    
    .auth-container {
      padding: 1.5rem;
    }
  }
  
  @media (max-width: 600px) {
    .gradient-text-alt {
      font-size: 1.75rem;
    }
    
    .auth-container {
      padding: 1rem;
      background: none;
      box-shadow: none;
    }
    
    .auth-form-container {
      padding: 1.5rem;
      max-width: 100%;
    }
    
    .custom-text-field :deep(.v-field__input) {
      padding: 12px !important;
    }
    
    .social-btn {
      width: 48px;
      height: 48px;
    }
  }
  </style>