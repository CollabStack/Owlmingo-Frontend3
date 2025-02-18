<template>
    <v-container class="container fill-height mt-6" >
      <v-row class="d-flex flex-row justify-center align-center">
        <v-col class="d-flex flex-column justify-center align-center ml-16" style="align-items: center; margin-left: -20px;">
          <h2 class="text-center" style="color: skyblue;">Sign Up to Begin Your Leaning <br> Journey</h2>
  
          <v-form class="d-flex flex-column mt-5 w-35" style="width: 350px; align-items: center;">
            <v-text-field class="w-100" label="Username"></v-text-field>
            <v-text-field class="w-100" label="Email"></v-text-field>
            <v-text-field class="w-100" label="Password"></v-text-field>
  
            <v-col class="d-flex justify-end w-100">
              <a href="#" style="margin-left: auto;">back to sign up</a>
            </v-col>
  
            <v-container class="d-flex flex-column justify-center align-center" >
              <div class="rectangle w-100">
                <div class="line w-50">
                  <span class="or-continue w-50">or continue with</span>
                </div>
              </div>
              <div class="social-icons">
                <a href="#" class="icon-link">
                  <img src="C:\Owlmingo-Frontend3\public\icons\icons8-google-480.png" alt="Google" class="icons" />
                </a>
                <a href="#" class="icon-link">
                  <img src="C:\Owlmingo-Frontend3\public\icons\icons8-github-480.png" alt="GitHub" class="icons" />
                </a>
                <a href="#" class="icon-link">
                  <img src="C:\Owlmingo-Frontend3\public\icons\icons8-telegram-144.svg" alt="Telegram" class="icons" />
                </a>
              </div>
  
              <div class="sign-up" style="border: 1px solid black; width: 100%;">
                <span>Don't have an account?</span>
                <a href="#" class="sign-up-link">Sign Up</a>
              </div>
            </v-container>
  
          </v-form>
        </v-col>
  
        <div class="right-side w-50 mr-n9">
          <img 
            src="C:\Owlmingo-Frontend3\public\images\3d-business-man-working-at-laptop-with-robot-assistant.png" 
            alt="Business Man" 
            class="image" 
            style="width: 400px;" 
          />
        </div>
      </v-row>
    </v-container>
  </template>
  
  <style>
  .rectangle {
    position: relative;
    margin-bottom: 20px;
    box-sizing: border-box;
    display: flex;
    justify-content: center; /* Center the rectangle horizontally */
  }
  
  .line { /* Full width of the rectangle */
    background-color: black;
    position: absolute;
    top: 50%;  /* Center the line vertically */
    display: flex;
    justify-content: center; /* Center the text inside the line */
  }
  
  .or-continue {
    background-color: white;
    position: absolute;
    top: -7px; 
    transform: translateX(-50%); 
    font-size: 9px;
    color: black;
    font-weight: bold;
    padding-left: 5px;
    padding-right: 5px;
  }
    
    .social-icons {
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
      margin-left: -35px;
  
    }
    
    .icon-link {
      margin: 0 10px;
    }
    .icons{
      width: 30px;
      height: 30px;
    }
    .sign-up {
      text-align: center;
      background-color: #b6b2b2;
      width: 75%;
      color: #fff;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      margin-bottom: 20px;
    }
    
    .sign-up-link {
      color: #00B0FF;
      text-decoration: none;
    }
    
    
  </style>
  
  
  