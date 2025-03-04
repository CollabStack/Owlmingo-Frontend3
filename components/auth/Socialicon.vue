<template>
        <v-container class="d-flex flex-column justify-center align-center">
              <v-row class="d-flex flex-row w-100 align-center pt-3 mt-3">
                  <v-divider class="border-opacity-100" style="flex: 2; color: var(--v-sonic_silver);"></v-divider>
                  <span class=" pl-1 pr-1" style="font-size: 16px; color: var(--v-sonic_silver);">Or continue with</span>
                  <v-divider class="border-opacity-100" style="flex: 2; color: var(--v-sonic_silver);"></v-divider>
                </v-row>
              
              <v-row class="mt-6 justify-center justify-space-between" style = "width: 160px; height: 92px;">
              <a
                v-for="(icon, index) in socialIcons"
                :key="index"
                :href="icon.link"
              >
                <img :src="`/icons/${icon.src}`" :alt="icon.alt" style="width: 40px; padding: auto;"/>
              </a>
            </v-row>
  
            <div v-if="showSignUp" class="sign-up">
              <span style="color: var(--v-sonic_silver); font-size: 20px;">
                    Don't have an account ? 
                <a href="#" class="sign-up-link">Sign Up</a>
              </span>
            </div>
            </v-container>

</template>

<style>
    

    .sign-up {
      align-content: center;
      text-align: center;
      background-color: var(--v-hex);
      border-radius: 10px;
      cursor: pointer;
      background-color: var(--v-mercury);
      width: 411px; 
      height: 67px;
    }
    
    .sign-up-link {
      color: var(--v-maya_blue);
      text-decoration: none;
    }
    
    
  </style>
  
  
  <script>
export default {
  props: {
  showSignUp: {
      type: Boolean,
      default: true // Change this to false in the file you don't want to display it
    }
  },
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
  
