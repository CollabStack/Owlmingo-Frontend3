<script setup>
import Socialicon from './SocialIcon.vue';

</script>

<template>
    <v-container class="container fill-height" >
      <v-row class="d-flex flex-row align-center mt-16">
        <v-container class="w-50">
          <v-col class="d-flex flex-column align-center" style="height: 700px;">
          <p  style= "color: var(--v-royal_blue);  width: 535px; text-align: center; font-size: 40px;">Sign Up to Begin Your Leaning Journey</p>

          <v-form class="d-flex flex-column mt-5 " style="width: 425px; height: 350px; align-items: center; ">
            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              bg-color= var(--v-water)
              v-model="username"
              label="Username" variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              label="Email" variant="outlined"
              bg-color= var(--v-water)
              v-model="email"
              required
              type="email"
            ></v-text-field>
            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              label="Password" variant="outlined"
              bg-color= var(--v-water)
              v-model="password"
              required
              type="password"
            ></v-text-field>
  
            <v-col class="d-flex justify-end w-100 " style="top: -20px; width: 100%;">
              <nuxt-link to="/auth/" style="margin-left: auto; font-size: 16px; text-decoration: none;">Back to Sign In</nuxt-link>            
            </v-col>
  
            <v-btn @click="signUp" class="justify-center align-center mt-4" style="width: 504px; height: 65px; background-color: var(--v-maya_blue); border-radius: 10px; color: white; font-size: 20px;">Sign Up</v-btn>

            <Socialicon :showSignUp="false" />
  
          </v-form>
        </v-col>

        </v-container>
        
  
        <div class="right-side w-50 mr-n9">
          <img 
            src= "/images/3d-business-man-working-at-laptop-with-robot-assistant.png" 
            alt="Business Man" 
            class="image" 
            style="width: 525px; height: 44%;" 
          />
        </div>
      </v-row>
    </v-container>
  </template>
  
  