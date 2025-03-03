<template>
    <v-footer class="footer">
      <v-container>
        <v-row>
          <!-- Logo & Social Media -->
          <v-col cols="12" md="3" class="footer-logo">
            <v-img src="/logo.png" alt="Owlmigo" contain height="50" width="50"></v-img>
            <p class="brand-name">Owlmigo</p>
            <div class="social-icons">
              <v-btn v-for="(icon, index) in socialIcons" :key="index" icon variant="text">
                <v-icon size="24">{{ icon }}</v-icon>
              </v-btn>
            </div>
          </v-col>
  
          <!-- Information Links -->
          <v-col cols="12" md="3">
            <h4 class="footer-heading">INFORMATION</h4>
            <ul class="footer-links">
              <li v-for="(link, index) in infoLinks" :key="index">
                <a href="#">{{ link }}</a>
              </li>
            </ul>
          </v-col>
  
          <!-- Legal Links -->
          <v-col cols="12" md="3">
            <h4 class="footer-heading">LEGAL</h4>
            <ul class="footer-links">
              <li v-for="(link, index) in legalLinks" :key="index">
                <a href="#">{{ link }}</a>
              </li>
            </ul>
          </v-col>
  
          <!-- Support Links -->
          <v-col cols="12" md="3">
            <h4 class="footer-heading">SUPPORTS</h4>
            <ul class="footer-links">
              <li v-for="(link, index) in supportLinks" :key="index">
                <a href="#">{{ link }}</a>
              </li>
            </ul>
          </v-col>
        </v-row>
  
        <!-- Copyright -->
        <v-row justify="center">
          <v-col cols="12" class="text-center copyright">
            &copy; 2024 Owlmigo. All Rights Reserved.
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </template>
  
  <script setup>
  const socialIcons = [
    "mdi-facebook",
    "mdi-tiktok",
    "mdi-instagram",
    "mdi-linkedin",
    "mdi-email",
    "mdi-github"
  ];
  
  const infoLinks = ["Pricing", "About us", "API", "Jobs", "Sell content", "Freepik brand guideline"];
  const legalLinks = ["Terms of use", "License agreement", "Privacy policy", "Copyright information"];
  const supportLinks = ["FAQ", "Content"];
  </script>
  
  <style scoped>
  .footer {
    background: #1e1e1e;
    color: white;
    padding: 40px 0;
  }
  
  .footer-logo {
    text-align: center;
  }
  
  .brand-name {
    font-size: 18px;
    font-weight: bold;
    margin-top: 8px;
  }
  
  .social-icons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
  }
  
  .footer-heading {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
  }
  
  .footer-links li {
    margin: 5px 0;
  }
  
  .footer-links a {
    text-decoration: none;
    color: white;
    opacity: 0.8;
    font-size: 14px;
    transition: opacity 0.3s;
  }
  
  .footer-links a:hover {
    opacity: 1;
  }
  
  .copyright {
    font-size: 13px;
    opacity: 0.7;
    margin-top: 20px;
  }
  </style>
  