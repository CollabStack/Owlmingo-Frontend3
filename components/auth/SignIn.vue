<script setup>
import Socialicon from './SocialIcon.vue';
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

<template>
    <v-container class="container fill-height mt-6" >
      <v-row class="d-flex flex-row justify-center align-center">
        <div class= "w-50 d-flex justify-center">
          <img 
            src= "/images/3d-business-man-working-at-laptop-with-robot-assistant.png" 
            alt="Business Man" 
            style="width: 525px; height: 44%;"  
          />
        </div>
        <v-col class="d-flex flex-column align-center w-50" style="height: 780px;">
          <p style= "color: var(--v-royal_blue);  width: 569px; text-align: center; font-size: 40px;">Login to Continue Your Learning Journey</p>
  
          <v-form class="d-flex flex-column align-center mt-5 " style="width: 425px; height: 350px; align-items: center;">
            <v-text-field
              class="w-100 pb-0"
              v-model="email"
              label="Email" variant="outlined"
              type="email"
              required    

            ></v-text-field>
            <v-text-field
              class="w-100 pb-0"
              v-model="password"
              label="Password" variant="outlined"
              type="password"
              required

            ></v-text-field>
  
            <v-row class="d-flex justify-space-between align-center w-100 mt-4 mb-4">
              <div class="remember-me d-flex flex-row justify-center" >
                <input type="checkbox" id="remember-me"/>
                <label for="remember-me"  style="font-size: 16px; padding-left: 5px;">Remember me</label>
              </div>
              <a href="./ForgetPassword" style="font-size: 16px; text-decoration: none;">Forget Password?</a>
            </v-row>

            <v-btn @click="login" class="justify-center align-center " style="width: 504px; height: 73px; background-color: var(--v-maya_blue); border-radius: 10px; color: white;  font-size: 24px;">Login</v-btn>

 
            <Socialicon />
  
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
 