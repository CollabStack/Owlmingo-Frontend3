<template >    
    <v-col cols="12">
    <v-card  class="banner-card rounded-lg d-flex mx-15 px-6 py-6 bg-maya_blue "  v-motion-slide-visible-bottom>
      
      

      <div class="text-content text-center align-center">
        <h2 class="text-h3 font-weight-bold mb-4 text-white">What is Owlmigo?</h2>
        <p class="text-h5 text-white mb-6">Owlmigo AI is an intelligent study companion designed to help students learn more effectively.<br>
           By leveraging advanced AI, it transforms study materials—such as PDFs, Word documents,<br> and notes—into interactive learning aids like quizzes, summaries, and flashcards.</p>
        <!-- <div class="d-flex justify-center gap-4">
          <NuxtLink to="/about"><v-btn rounded="xl" variant="outlined" color="white" class="text-white">Get Start for Free</v-btn></NuxtLink> 
          <NuxtLink to="/about"><v-btn rounded="xl" variant="outlined" color="white" class="text-white">explore AI Tool</v-btn></NuxtLink>
        </div> -->
      </div>
      <v-img v-motion-fade-visible
        src="/images/3d-casual-life-chatgpt-robot-in-graduation-cap-1.png"
        height="280" 
        width="280"  
        class=" position-img"
        contain
      ></v-img>
    </v-card>
  </v-col>
    


  
          
      <!-- Mission Section -->
  <v-col cols="12">
  <v-card-text class="mission_section text-center rounded-lg mx-15 px-0 py-1 my-10">
        <h2 class="text-h5 font-weight-bold text-primary">Our Mission</h2>
  <p class="mt-5" width="100%">
          At Owlmigo AI, we believe that every student deserves a study experience that is efficient, engaging,
          and tailored to their needs. Traditional learning methods can be time-consuming and overwhelming, but with the power of AI, we aim to transform the way students absorb knowledge.
        </p>
  </v-card-text>
  </v-col>
    <v-col cols="12">
      <!-- Why Owlmigo is the Best -->
      <v-card-text class="owlmigo-ques text-center rounded-lg mx-15 px-0 py-0 my-10">
        <h2 class="text-h5 font-weight-bold text-primary">Why Owlmigo is the best?</h2>
        <v-row class="mt-5">
          <v-col cols="12" md="4">
            <v-card class="pa-4">
              <v-icon size="50" class="mb-4">mdi-rocket</v-icon>
              <p class="font-weight-bold">Fast Learning</p>
              <p>Our AI-powered study tools help you learn faster and more efficiently.</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-4">
              <v-icon size="50" class="mb-4">mdi-lightbulb-on</v-icon>
              <p class="font-weight-bold">Engaging Experience</p>
              <p>Transform your study materials into interactive learning aids that keep you engaged.</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-4">
              <v-icon size="50" class="mb-4">mdi-account-group</v-icon>
              <p class="font-weight-bold">Tailored to Your Needs</p>
              <p>Personalize your study experience to suit your learning style and preferences.</p>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
      <!-- Feedback Section -->
      <v-col cols="12">
  <v-card-text class="feedback-section text-center rounded-lg mx-15 px-0 py-0 my-10">
    <h2 class="text-h5 font-weight-bold text-left text-primary">Feedback</h2>
    <v-row class="mt-5" justify="center">
      <!-- Feedback Cards -->
      <v-col cols="12" sm="6" md="4" v-for="(feedback, index) in feedbackData" :key="index">
        <v-card class="feedback-card pa-4 d-flex align-start flex-column" rounded="lg" elevation="2" color="blue-lighten-5">
          <!-- Avatar and Name -->
          <div class="d-flex align-center">
            <v-avatar size="50">
              <v-img :src="feedback.avatar" alt="Avatar" cover></v-img>
            </v-avatar>
            <div class="ml-3">
              <span class="text-h6 font-weight-bold">{{ feedback.name }}</span>
            </div>
          </div>
          <!-- Text Content -->
          <div class="feedback-content mt-2 text-left">
            <span class="text-body-1 text-grey-darken-1">
              {{ feedback.text }}
            </span>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-card-text>
</v-col>

      <!-- Our Team Section -->
    <v-col cols="12">
      <v-card-text class="team-section text-center rounded-lg mx-15 px-0 py-0 my-10">
        <h2 class="text-h5 font-weight-bold text-primary">Our Team</h2>
        <v-row class="mt-5">
          <v-col cols="12" sm="6" md="4" v-for="(member, index) in teamMembers" :key="index">
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                class="mx-auto"
                color="grey-lighten-4"
                max-width="260"
                height="350"
                v-bind="props"
              >
                <v-img
                  :aspect-ratio="16/9"
                  :src="member.image"
                  :alt="member.name"
                  class="team-member-image"
                >
                  <v-expand-transition>
                    <div
                      v-if="isHovering"
                      class="d-flex bg-grey v-card--reveal text-h2"
                      style="height: 100%;"
                    >
                      <div class="text-center mx-auto">
                        <h2 class="text-h5 font-weight-bold">{{ member.name }}</h2>
                        <p class="text-h6">{{ member.role }}</p>
                      </div>
                    </div>
                  </v-expand-transition>
                </v-img>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-col>
      
  </template>
  
  <script setup>
  // Team members data
  const teamMembers = [
    { name: 'Soksan Phork', role: 'Frontend Developer', image: '/images/Soksan-Phork.jpg' },
    { name: 'Team Member 2', role: 'Backend Developer', image: '/images/Soksan-Phork.jpg' },
    { name: 'Team Member 3', role: 'UX Designer', image: '/images/Soksan-Phork.jpg' },
    { name: 'Team Member 4', role: 'Project Manager', image: '/images/Soksan-Phork.jpg' },
    { name: 'Team Member 5', role: 'AI Engineer', image: '/images/Soksan-Phork.jpg' },
    { name: 'Team Member 6', role: 'QA Engineer', image: '/images/Soksan-Phork.jpg' },
  ]
   // Sample feedback data
   const feedbackData = [
  { name: 'Mickey', avatar: '/images/Mickey.jpg', text: 'So here is the best AI-generated quiz in these years.' },
  { name: 'Draken', avatar: '/images/Draken.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { name: 'Sakuna', avatar: '/images/Sakuna.jpg', text: 'So here is the best AI generate Quiz in this years.' },
  { name: 'Lushi', avatar: '/images/Lushi.jpg', text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' },
  { name: 'Draken', avatar: '/images/Draken.jpg', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { name: 'Xiao Eii', avatar: '/images/XiaoEii.jpg', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.' }
];
  </script>
  
  <style scoped>
  .banner-card {
  border-radius: 20px;
  color: white;
  width: 95%;
  height: 70%;
  margin-left: 40px;
  margin-top: 5vh;
  position: relative; 
  overflow: visible; 
  display: flex;
  align-items: center;
  justify-content: space-between;
  }
  .position-img {
  position: absolute; 
  /* left: 20px;  */
  right: 100px;
  top: -30px;   
  z-index: 1; 

  }
  .mission_section {
    width: 95%;
    height: 70%;
    margin-left: 40px;
    margin-top: 5vh;
    align-items: center;
  }
  .owlmigo-ques {
    width: 95%;
    height: 70%;
    margin-left: 40px;
    align-items: center;
  }
  .feedback-section {
  width: 95%;
  height: auto;
  margin-left: 40px;
  align-items: center;
  }
  .feedback-card {
    width: 100%;
    height: auto;
    border-radius: 12px;
    background-color: #e3f2fd;
  }
  .feedback-content {
    width: 100%;
    overflow-x: hidden;
    text-align: left;
  }
  .team-section {
    width: 95%;
    height: 70%;
    margin-left: 40px;
    align-items: center;

  }
  .team-member-image {
    width: 100%;
    height: 100%;
  }
  
  </style>
  