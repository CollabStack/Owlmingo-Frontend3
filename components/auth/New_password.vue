<template>
    <v-container class="container fill-height mt-6" >
      <v-row class="d-flex flex-row justify-center align-center">
        <div class="right-side w-50 ml-16">
          <img 
            src= "/images/3d-business-man-working-at-laptop-with-robot-assistant.png" 
            alt="Business Man" 
            class="image" 
            style="width: 400px;" 
          />
        </div>
        <v-col class="d-flex flex-column justify-center align-center w-50" style="align-items: center; margin-left: -20px;">
          <h2 class="align-center text-center" style="color: var(--v-welcome_title);">New Password</h2>
  
          <v-form class="d-flex flex-column mt-5 " style="width: 350px; align-items: center; margin-left: -20px;">
            <v-text-field class="w-100 rounded-xl " label="New Password"></v-text-field>
            <v-text-field class="w-100 mb-2" label="Confirm Password" style="border-radius: 24px; height: 70px;"></v-text-field>
  
            <v-row class="d-flex justify-space-between align-center w-100 mb-3">
              <div class="remember-me">
                <input type="checkbox" id="remember-me" />
                <label for="remember-me" style="font-size: 12px;">Remember me</label>
              </div>
              <a href="#" style="font-size: 12px; text-decoration: none;" >Forget Password?</a>
            </v-row>

            <v-btn class=" w-100 justify-center align-center" style="background-color: var(--v-maya_blue); border-radius: 10px; color: white;">Send</v-btn>
  
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
      left: +25px;
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
      padding-left: 7px;
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
  
  
  