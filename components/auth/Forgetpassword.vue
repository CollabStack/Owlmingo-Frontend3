<template>
    <v-container class="container fill-height mt-6" >
      <v-row class="d-flex flex-row justify-center align-center">
        <v-col class="d-flex flex-column justify-center align-center ml-16" style="align-items: center; margin-left: -20px;">
          <h2 class="align-center" style="color: var(--v-maya_blue);">Forget Password</h2>
  
          <v-form class="d-flex flex-column mt-5 " style="width: 350px; align-items: center; margin-left: -20px;">
            <v-text-field class="w-100 mb-1 " label="Email"></v-text-field>

            <v-col class="d-flex justify-end w-100" style="width: 100%;">
              <a href="#" style="margin-left: auto; font-size: 12px;">Back to Sign</a>
            </v-col>


              <v-btn class=" w-100 justify-center align-center" style="background-color: blue; color: white;">Send</v-btn>

  
              <v-container class="d-flex flex-column justify-center align-center" >
            <div class="rectangle w-100">
              <div class="line w-50"  style="color: green;">
                <span class="or-continue" style="color: green;">or continue with</span>
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

            <div class="sign-up w-100" >
              <span>Don't have an account?</span>
              <a href="#" class="sign-up-link" style="color: blue;">Sign Up</a>
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
      left: +80px;  
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