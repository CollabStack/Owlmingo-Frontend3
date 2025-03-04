<script setup>
import Socialicon from './SocialIcon.vue';

</script>

<template>
    <v-container class="container fill-height mt-6" >
      <v-row class="d-flex flex-row justify-center align-center">
        <div class="w-50 d-flex justify-center">
          <img 
            src= "/images/3d-business-man-working-at-laptop-with-robot-assistant.png" 
            alt="Business Man" 
            class="image" 
            style="width: 525px; height: 44%;" 
          />
        </div>
        <v-col class="d-flex flex-column align-center" style="height: 780px;">
          <p  style= "color: var(--v-royal_blue);  width: 301px; align-items: center; font-size: 40px;">New Password</p>

          <v-form class="d-flex flex-column mt-5 " style="width: 425px; height: 350px; align-items: center; ">
            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              label="New Password" variant="outlined"
            ></v-text-field>
            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              label="Confirm Password" variant="outlined"
            ></v-text-field>
            
            
            <v-row class="d-flex justify-space-between align-center w-100 mt-4 mb-4">
              <div class="remember-me d-flex flex-row justify-center" >
                <input type="checkbox" id="remember-me"/>
                <label for="remember-me"  style="font-size: 16px; padding-left: 5px;">Remember me</label>
              </div>
              <a href="./ForgetPassword.vue" style="font-size: 16px; text-decoration: none;">Forget Password?</a>
            </v-row>

            <v-btn class="justify-center align-center " style="width: 504px; height: 73px; background-color: var(--v-maya_blue); border-radius: 10px; color: white;  font-size: 24px;">Send</v-btn>
  
            <Socialicon />
  
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </template>
  


  
  
  
