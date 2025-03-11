<script setup>
// import Socialicon from './Social.vue';

</script>

<template>
    <v-container class="container fill-height" >
      <v-row class="d-flex flex-row justify-center align-center">
        <v-col class="d-flex flex-column align-center" style="height: 780px;">
          <p  style= "color: var(--v-royal_blue);  width: 569px; text-align: center; font-size: 40px;">Sign Up to Begin Your Leaning Journey</p>

          <v-form class="d-flex flex-column mt-5 " style="width: 504px; height: 350px; align-items: center; ">
            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              
              v-model="username"
              label="Username" variant="outlined"
              required
            ></v-text-field>
            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              label="Email" variant="outlined"

              v-model="email"
              required
              type="email"
            ></v-text-field>
            <v-text-field
              class="w-100 pb-0"
              style= "height: 65px;"
              label="Password" variant="outlined"

              v-model="password"
              required
              type="password"
            ></v-text-field>
  
            <v-col class="d-flex justify-end w-100 " style="top: -20px; width: 100%;">
              <a href="./SignIn.vue" style="margin-left: auto; font-size: 16px; text-decoration: none;">Back to Sign In</a>
            </v-col>
  
            <v-btn @click="signUp" class="justify-center align-center " style="width: 504px; height: 73px; background-color: var(--v-maya_blue); border-radius: 10px; color: white; font-size: 24px;">Sign Up</v-btn>

            <Socialicon :showSignUp="false" />
  
          </v-form>
        </v-col>
  
        <div class="right-side w-50 mr-n9">
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
  
  