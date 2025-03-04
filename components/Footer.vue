<template>
  <v-footer class="white--text" style = "height: 529px;">
    <v-container class="d-flex flex-column align-center">
      <v-row style="width: 85%; padding-bottom: 25px;">
        <!-- First Container -->
        <v-col style="flex: 1.5; ">
          <v-row class="align-center">
            
              <img src="public/logo/icon-no-bg.svg" alt="Owlmingo Logo" style="width: 116px; background-color: var(--v-white); border-radius: 60px;"/>

            <h3 class="ml-4" style="font-size: 24px;">Owlmingo</h3>
          </v-row>
          <div class="mt-13">
            <v-col>
              <h4 class="ml-n2" style="font-size: 24px;">Social Media</h4>
               <v-row class="justify-start mt-1">
                  <div class="flex"> 
                    <a href=""><img src="public/icons/icons8-facebook-100.png" style="width: 55px;" alt=""></a>
                    <a href=""><img src="public/icons/icons8-github-100.png" style="width: 55px;" alt=""></a>
                    <a href=""><img src="public/icons/icons8-linkedin-100.png" style="width: 55px;" alt=""></a>
                    <a href=""><img src="public/icons/icons8-tiktok-100.png" style="width: 55px;" alt=""></a>
                    <a href=""><img src="public/icons/icons8-instagram-100.png" style="width: 55px;" alt=""></a>
                    <a href=""><img src="public/icons/icons8-x-100.png" style="width: 55px;" alt=""></a>
                  </div>
                </v-row>
              </v-col>
          </div>
        </v-col>

        <v-col style="flex: 1;">
          <h3 class="mb-3" style="font-size: 20px;">Information</h3>
          <div class="text-gray-400">
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Pricing</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">About Us</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">API</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Jobs</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Sell Content</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Freepik brand guideline</a></p>
            </div>
        </v-col>

        <v-col style="flex: 1;">
          <h3 class="mb-3" style="font-size: 20px;">Legal</h3>
          <div class="text-gray-400">
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Term of Use</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">License Agreement</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Privacy Policy</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Copyright Information</a></p>
            </div>
        </v-col>

        <v-col style="flex: 0.5;">
          <h3 class="mb-3" style="font-size: 20px;">SUPPORTS</h3>
          <div class="text-gray-400">
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">FAQ</a></p>
              <p class="mb-1" style="font-size: 20px;">
                <a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Contact</a></p>
              
            </div>
        </v-col>
      </v-row>
      
      <v-divider class="border-opacity-100" :thickness="1" color="white" style="width: 90%;"></v-divider>
      <p class="text-center mt-5">© 2024 Owlmingo. All Rights Reserved.</p>
    </v-container>
  </v-footer>
</template>

    
    <style scoped>
    .v-footer {
    background-color: var(--v-onyx); /* Dark background */
    }
    .white--text {
    color: var(--v-white)
    }
    </style>

