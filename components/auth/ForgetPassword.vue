<script setup>
import Socialicon from './SocialIcon.vue';

</script>

<template>
    <v-container class="container fill-height" >
      <v-row class="d-flex flex-row align-center mt-16">
        <v-col class="d-flex flex-column align-center" style="height: 700px;">
          <p  style= "color: var(--v-royal_blue);  width: 301px; align-items: center; font-size: 40px;">Forget Password</p>
  
          <v-form class="d-flex flex-column mt-5 " style="width: 425px; height: 350px; align-items: center; ">

            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              bg-color= var(--v-water)
              v-model="username"
              label="Email" variant="outlined"
              required
            ></v-text-field>
            <v-col class="d-flex justify-end w-100 " style="top: -20px; width: 100%;">
              <a href="./SignIn.vue" style="margin-left: auto; font-size: 16px; text-decoration: none;">Back to Sign In</a>
            </v-col>


              <v-btn class="justify-center align-center " style="width: 504px; height: 73px; background-color: var(--v-maya_blue); border-radius: 10px; color: white; font-size: 24px;">Send</v-btn>

  
              <Socialicon />
  
            
          </v-form>
        </v-col>
        
        <div class="w-50 d-flex justify-center">
          <img 
            src= "/images/3d-business-man-working-at-laptop-with-robot-assistant.png" 
            alt="Business Man" 
            style="width: 525px;  height: 44%; margin: auto;" 
          />
        </div>
      </v-row>
    </v-container>
    <div style="height: 20px;">
    </div>
  </template>
  