<template>
  <v-footer class="footer-container px-0" elevation="4">
    <v-container fluid class="py-8">
      <!-- Main Footer Content -->
      <v-container>
        <v-row class="justify-space-between">
          <!-- Brand Section -->
          <v-col cols="12" md="4" lg="3" class="brand-section pe-md-6">
            <v-row class="align-center mb-4">
                  <v-icon 
                  icon="mdi-owl" 
                  size="40" 
                  class="gradient-text me-3"
                  color="white" 
                  ></v-icon>
              <h3 class="text-h5 font-weight-bold gradient-text outfit outfit-bold">Owlmingo</h3>
            </v-row>
            
            <p class="text-body-2 mb-5 text-white outfit outfit-regular">
              Transforming education with AI-powered learning tools for students, teachers, and professionals.
            </p>
            
            <div class="mt-4">
              <h4 class="text-subtitle-1 mb-3 outfit outfit-medium">Connect With Us</h4>
              <div class="social-icons-container">
                <a
                  v-for="(icon, index) in icons"
                  :key="index"
                  :href="icon.link"
                  class="social-icon-link"
                  :aria-label="`Connect with us on ${icon.name}`"
                >
                  <v-hover v-slot="{ isHovering, props }">
                    <div 
                      v-bind="props"
                      class="social-icon" 
                      :class="{ 'social-icon-hover': isHovering }"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        v-html="getSvg(icon.name)"
                      ></svg>
                    </div>
                  </v-hover>
                </a>
              </div>
            </div>
          </v-col>

          <!-- Links Sections -->
          <v-col 
            v-for="(section, index) in sections" 
            :key="index" 
            cols="6" 
            sm="4" 
            md="2" 
            lg="2"
            class="links-section"
          >
            <h3 class="text-subtitle-1 mb-3 font-weight-medium outfit outfit-medium">{{ section.title }}</h3>
            <v-list class="footer-links pa-0" bg-color="transparent">
              <v-list-item 
                v-for="(link, linkIndex) in section.links" 
                :key="linkIndex"
                class="px-0 py-1 py-dense"
                :ripple="false"
                density="compact"
              >
                <v-hover v-slot="{ isHovering, props }">
                  <a 
                    v-bind="props"
                    href="#" 
                    class="footer-link outfit outfit-regular text-caption"
                    :class="{ 'footer-link-hover': isHovering }"
                  >
                    {{ link }}
                    <v-icon 
                      class="footer-link-icon" 
                      :class="{ 'footer-link-icon-visible': isHovering }"
                      size="x-small"
                    >
                      mdi-arrow-right
                    </v-icon>
                  </a>
                </v-hover>
              </v-list-item>
            </v-list>
          </v-col>

          <!-- Newsletter Section -->
          <v-col cols="12" md="4" lg="3" class="newsletter-section mt-4 mt-md-0">
            <h3 class="text-subtitle-1 mb-3 font-weight-medium outfit outfit-medium">Subscribe to Newsletter</h3>
            <p class="text-caption mb-3 text-white outfit outfit-regular">
              Stay updated with our latest features and learning tools
            </p>
            <v-form @submit.prevent="subscribeNewsletter" class="mb-3">
              <v-text-field
                v-model="email"
                label="Your Email"
                variant="outlined"
                density="compact"
                color="primary"
                bg-color="rgba(255, 255, 255, 0.05)"
                hide-details
                class="mb-2 rounded-xl newsletter-input"
                prepend-inner-icon="mdi-email-outline"
              ></v-text-field>
              <v-btn 
                type="submit" 
                block 
                color="primary" 
                class="mt-2 subscribe-btn outfit outfit-medium" 
                rounded="xl"
                height="40"
                density="comfortable"
              >
                Subscribe
                <v-icon class="ms-2" size="small">mdi-send</v-icon>
              </v-btn>
            </v-form>
          </v-col>
        </v-row>
      </v-container>

      <v-divider class="my-4 divider"></v-divider>
      
      <!-- Footer Bottom -->
      <v-container>
        <v-row class="align-center justify-space-between">
          <v-col cols="12" md="6" class="text-center text-md-left">
            <p class="text-caption outfit outfit-regular copyright-text mb-0">
              © {{ new Date().getFullYear() }} Owlmingo. All Rights Reserved.
            </p>
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <div class="d-flex flex-wrap justify-center justify-md-end">
              <a href="#" class="text-caption mx-2 policy-link outfit outfit-regular">Privacy Policy</a>
              <span class="mx-2 text-medium-emphasis">|</span>
              <a href="#" class="text-caption mx-2 policy-link outfit outfit-regular">Terms of Service</a>
              <span class="mx-2 text-medium-emphasis">|</span>
              <a href="#" class="text-caption mx-2 policy-link outfit outfit-regular">Cookie Policy</a>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Email input for newsletter
const email = ref('');

// Social media icons
const icons = [
  { name: 'twitter', link: 'https://twitter.com' },
  { name: 'facebook', link: 'https://facebook.com' },
  { name: 'instagram', link: 'https://instagram.com' },
  { name: 'linkedin', link: 'https://linkedin.com' },
];

// Footer sections with links
const sections = [
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Blog', 'Press']
  },
  {
    title: 'Products',
    links: ['Features', 'Pricing', 'Integration', 'FAQ']
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Tutorials', 'Support', 'API']
  },
];

// Method to get SVG markup for icons
const getSvg = (iconName: string): string => {
  switch (iconName.toLowerCase()) {
    case 'twitter':
      return '<path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z" />';
    case 'facebook':
      return '<path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />';
    case 'instagram':
      return '<path fill="currentColor" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z" />';
    case 'linkedin':
      return '<path fill="currentColor" d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z" />';
    default:
      return ''; // Default empty SVG
  }
};

// Newsletter subscription method
const subscribeNewsletter = () => {
  if (!email.value) return;
  
  // Here you would implement the actual subscription logic
  console.log('Subscribing email:', email.value);
  
  // Reset the form
  email.value = '';
  
  // Show success message (you could use a notification system here)
  alert('Thank you for subscribing to our newsletter!');
};
</script>

<style scoped>
/* Import Outfit font */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Outfit font classes */
.outfit {
  font-family: "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-regular { font-weight: 400; }
.outfit-medium { font-weight: 500; }
.outfit-bold { font-weight: 700; }

.footer-container {
  background: linear-gradient(to bottom, var(--v-onyx) 0%, #232830 100%);
  color: var(--v-white);
  min-height: 500px;
  height: auto !important;
  width: 100%;
  margin: 0;
  padding: 0;
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.brand-section {
  position: relative;
}

.logo-image {
  width: 100%;
  height: 100%;
  background-color: var(--v-white);
  transition: transform 0.3s ease;
}

.gradient-border {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

.gradient-border::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  background: linear-gradient(45deg, #ff9a9e, #fad0c4, #fad0c4, #a1c4fd);
  z-index: -1;
  animation: rotate 4s linear infinite;
  border-radius: 50%;
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.gradient-text {
  background: linear-gradient(90deg, #ffffff, #e0f7fa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.social-icons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--v-white);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.social-icon-hover {
  transform: translateY(-5px);
  background-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  color: var(--v-white);
}

.footer-links {
  background-color: transparent !important;
}

.footer-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  padding: 6px 0;
}

.footer-link-hover {
  color: var(--v-white);
  transform: translateX(5px);
}

.footer-link-icon {
  opacity: 0;
  margin-left: 6px;
  transform: translateX(-5px);
  transition: all 0.3s ease;
}

.footer-link-icon-visible {
  opacity: 1;
  transform: translateX(0);
}

.newsletter-input {
  border-radius: 12px;
}

.divider {
  opacity: 0.1;
  width: 100%;
}

.copyright-text {
  color: rgba(255, 255, 255, 0.7);
}

.policy-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
}

.policy-link:hover {
  color: var(--v-white);
}

.subscribe-btn {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.subscribe-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}

.subscribe-btn:hover::before {
  left: 100%;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .links-section {
    margin-top: 24px;
  }
}

@media (max-width: 600px) {
  .footer-container {
    padding-top: 40px;
    padding-bottom: 40px;
  }
  
  .social-icons-container {
    justify-content: center;
  }
}
</style>