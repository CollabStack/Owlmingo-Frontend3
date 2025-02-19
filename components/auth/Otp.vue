


<template>
    <v-container class="container fill-height mt-6" >
      <v-row class="d-flex flex-row justify-center align-center">
        <v-col class="d-flex flex-column justify-center align-center ml-16" style="align-items: center; margin-left: -20px;">
          <h2  style="color: var(--v-welcome_title);">Welcome to Study</h2>
  
          <v-form class="d-flex flex-column mt-5 " style="width: 350px;">
            <h5 class=" align-left justify-start w-100" style="color: var(--v-welcome_title);">Enter the Verification Code</h5>

            <v-otp-input class="mb-2"></v-otp-input>
            
            <v-row class="justify-center w-100 mb-1">
            <p style="font-size: 10px;">if you didn't Recieve the code, <a href="#" style="text-decoration: none; color: red;"> Resend</a></p>
          </v-row>
            
          <v-btn class= "w-100 justify-center align-center mt-3" style="background-color: var(--v-maya_blue); border-radius: 10px; color: white;">Send</v-btn>            
  
          <v-container class="d-flex flex-column justify-center align-center" >
            <div class="rectangle w-100">
              <div class="line w-50">
                <span class="or-continue w-50" style="color:var(--v-continue_text);">or continue with</span>
              </div> 
            </div>
            <div class="social-icons">
              <a
                v-for="(icon, index) in socialIcons"
                :key="index"
                :href="icon.link"
                class="icon-link"
              >
                <img :src="`/icons/${icon.src}`" :alt="icon.alt" class="icons" />
              </a>
            </div>

            <div class="sign-up w-100" style="background-color: var(--v-white_gray);">
              <span style="color: var(--v-continue_text);">Don't have an account?<a href="#" class="sign-up-link">Sign Up</a></span>
            </div>
          </v-container>
  
          </v-form>
        </v-col>
  
        <div class="right-side w-50 mr-n9">
          <img 
            src= "/images/3d-business-man-working-at-laptop-with-robot-assistant.png" 
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
      position: relative;
      margin-bottom: 20px;
      box-sizing: border-box;
  }
  
    .line {
    position: absolute;
    top: 50%;  /* Center the line vertically */
    left: 40px;
    border: 1px solid var(--v-continue_text);

  }
  
  .or-continue {
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
  
  
  <script>
  export default {
    data() {
      return {
        socialIcons: [
          {
            src: 'icons8-google-480.png', // Just the filename
            alt: 'Google',
            link: '#',
          },
          {
            src: 'icons8-github-480.png', // Just the filename
            alt: 'GitHub',
            link: '#',
          },
          {
            src: 'icons8-telegram-144.svg', // Just the filename
            alt: 'Telegram',
            link: '#',
          },
        ],
      };
    },
  };
</script>