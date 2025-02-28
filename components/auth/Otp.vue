<script setup lang="ts">
import Socialicon from './Socialicon.vue';

</script>




<template>
    <v-container class="container h-100" >
      <v-row class="d-flex flex-row justify-center align-center">
        <v-col class="d-flex flex-column align-center" style="height: 780px;">
          <p  style= "color: var(--v-royal_blue);  width: 350px; align-items: center; font-size: 40px;">Welcome to Study</p>

  
          <v-form class="d-flex flex-column mt-5 " style="width: 504px; height: 500px; align-items: center;">
            <h5 class=" align-left justify-start w-100" style="color: var(--v-royal_blue); font-size: 20px;">Enter the Verification Code</h5>

            <v-otp-input class="mb-4 mt-4 max-width" min-width="422px" min-height="62px"></v-otp-input>
            
            <v-row class="justify-center w-100 ">
            <p style="font-size: 16px;">if you didn't Recieve the code, <a href="#" style="text-decoration: none; color: red;"> Resend</a></p>
          </v-row>
            
              <v-btn class="justify-center align-center mb-4" style="width: 504px; height: 73px; background-color: var(--v-maya_blue); border-radius: 10px; color: white; font-size: 24px;">Send</v-btn>
  
          <Socialicon />
  
          </v-form>
        </v-col>
  
        <div class="w-50 d-flex justify-center">
          <img 
            src= "/images/3d-business-man-working-at-laptop-with-robot-assistant.png" 
            alt="Business Man" 
            class="image" 
            style="width: 602px; height: 828px;" 
          />
        </div>
      </v-row>
    </v-container>
  </template>
  
<style>
v-otp-input:nth-child(n){
  width: 42px;
  height: 62px;
}
</style>