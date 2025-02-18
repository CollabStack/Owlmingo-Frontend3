<template>
  <v-footer color="--v-primary" class="white--text">
    <v-container style="margin-left: 200px;">
      <v-row class="d-flex justify-space-between">
        <!-- First Container -->
        <v-col>
          <v-row class="align-center">
            <v-avatar size="100" class="mr-2 ml-2">
              <img src="/logo/icon-no-bg.svg" alt="Owlmingo Logo" />
            </v-avatar>
            <h3 class="ml-4">Owlmingo</h3>
          </v-row>
          <div class="mt-13">
            <v-col>
              <h3 class="ml-n2">Social Media</h3>
              <v-row class=" justify-start mt-1">
                <div class="flex space-x-4">
                  <a href="#" class="text-gray-400 hover:text-white" style="color: white; text-decoration: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95" />
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-white" style="color: white; text-decoration: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                      <g fill="none">
                        <path fill="currentColor" d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm-4 5a4 4 0 1 0 0 8a4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4m4.5-3.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
                      </g>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-white" style="color: white; text-decoration: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                      <g fill="currentColor">
                        <path d="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z">
                          <animate fill="freeze" attributeName="d" dur="0.4s" values="M1 2h2.5L3.5 2h-2.5zM5.5 2h2.5L7.2 2h-2.5z;M1 2h2.5L18.5 22h-2.5zM5.5 2h2.5L23 22h-2.5z" />
                        </path>
                        <path d="M3 2h5v0h-5zM16 22h5v0h-5z">
                          <animate fill="freeze" attributeName="d" begin="0.4s" dur="0.4s" values="M3 2h5v0h-5zM16 22h5v0h-5z;M3 2h5v2h-5zM16 22h5v-2h-5z" />
                        </path>
                        <path d="M18.5 2h3.5L22 2h-3.5z">
                          <animate fill="freeze" attributeName="d" begin="0.5s" dur="0.4s" values="M18.5 2h3.5L22 2h-3.5z;M18.5 2h3.5L5 22h-3.5z" />
                        </path>
                      </g>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-white" style="color: white; text-decoration: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2" />
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-white" style="color: white; text-decoration: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                      <g fill="none" fill-rule="evenodd">
                        <path fill="currentColor" d="M18 3a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zM8 10a1 1 0 0 0-1 1v5a1 1 0 1 0 2 0v-5a1 1 0 0 0-1-1m3-1a1 1 0 0 0-1 1v6a1 1 0 1 0 2 0v-3.66c.305-.344.82-.748 1.393-.993c.333-.142.834-.2 1.182-.09a.55.55 0 0 1 .293.188c.052.07.132.226.132.555v4a1 1 0 0 0 2 0v-4c0-.67-.17-1.266-.524-1.744a2.54 2.54 0 0 0-1.301-.907c-.902-.283-1.901-.126-2.568.16a6 6 0 0 0-.623.312A1 1 0 0 0 11 9M8 7a1 1 0 1 0 0 2a1 1 0 0 0 0-2" />
                      </g>
                    </svg>
                  </a>
                  <a href="#" class="text-gray-400 hover:text-white" style="color: white; text-decoration: none;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
                      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
                        <path d="M21 8v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5" />
                        <path d="M10 12a3 3 0 1 0 3 3V6c.333 1 1.6 3 4 3" />
                      </g>
                    </svg>
                  </a>
                </div>
              </v-row>
            </v-col>
          </div>
        </v-col>

        <!-- Second Container -->
        <v-col class="mb-4 flex-grow-2" style="margin-left: 100px;">
          <h3 class=" mb-3">Information</h3>
          <div class="text-gray-400 space-y-2">
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Pricing</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">About us</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">API</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Jobs</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Sell content</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Freepik brand guideline</a></p>
          </div>
        </v-col>

        <!-- Third Container -->
        <v-col class="ml-16 mb-4 flex-grow-2">
          <h3 class=" mb-3">Legal</h3>
          <div class="text-gray-400 space-y-2">
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Terms of use</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">License agreement</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Privacy policy</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Copyright information</a></p>
          </div>
        </v-col>

        <!-- Fourth Container -->
        <v-col class="ml-16 mb-4 flex-grow-2">
          <h3 class=" mb-3">Contact Us</h3>
          <div class="text-gray-400 space-y-2">
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">FAQ</a></p>
            <p class="mb-1"><a href="#" class="hover:text-white" style="color: white; text-decoration: none;">Content</a></p>
          </div>
        </v-col>
      </v-row>

      <v-divider></v-divider>
      <p class="text-center mt-5">© 2024 Owlmingo. All Rights Reserved.</p>
    </v-container>
  </v-footer>
</template>

<style scoped>
.v-footer {
background-color: #212121; /* Dark background */
}
.white--text {
color: var(--v-white) !important; /* Ensure text is white */
}
</style>
