<template>
    <v-container class="container fill-height mt-6" >
      <v-row class="d-flex flex-row justify-center align-center">
        <div class="right-side w-50 ml-16">
          <img 
            src="C:\Owlmingo-Frontend3\public\images\3d-business-man-working-at-laptop-with-robot-assistant.png" 
            alt="Business Man" 
            class="image" 
            style="width: 400px;" 
          />
        </div>
        <v-col class="d-flex flex-column justify-center align-center w-50" style="align-items: center; margin-left: -20px;">
          <h2 class="align-center text-center" style="color: skyblue;">Login to Continue Your Learning <br>Journey</h2>
  
          <v-form class="d-flex flex-column mt-5 " style="width: 350px; align-items: center; margin-left: -20px;">
            <v-text-field class="w-100 rounded-xl " label="Email"></v-text-field>
            <v-text-field class="w-100 mb-2" label="Password" style="border-radius: 24px;"></v-text-field>
  
            <v-row class="d-flex justify-space-between align-center w-100 mb-3">
              <div class="remember-me">
                <input type="checkbox" id="remember-me" />
                <label for="remember-me">Remember me</label>
              </div>
              <a href="#">Forget Password?</a>
            </v-row>

  
            <v-container class="d-flex flex-column justify-center align-center" >
            <div class="rectangle w-100">
              <div class="line w-50">
                <span class="or-continue">or continue with</span>
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
      </v-row>
    </v-container>
  </template>
  
  <style>
    .container {
      height: 100vh; /* Full viewport height */
    }
    
    .image {
      max-width: 100%; /* Responsive image */
    
    }
  .rectangle {
      width: 50%;
      height: 2px;
      position: relative;
      margin-bottom: 20px;
      box-sizing: border-box;
      left: +25px;
  }
  
    .line {
    width: 100%;  /* Full width of the rectangle */
    height: 30px;
    height: 1px;
    background-color: black;
    position: absolute;
    top: 50%;  /* Center the line vertically */
    left: 40px;
   
  }
  
  .or-continue {
      width: 47%;
      background-color: white;
      position: absolute;
      top: -7px; 
      transform: translateX(-50%); 
      font-size: 9px;
      color: black;
      font-weight: bold;
      left: +80px;
      padding-left: 5px;
      padding-right: 1px;
  
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
  
  
  