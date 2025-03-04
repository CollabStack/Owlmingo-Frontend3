<template>
  <!-- Hero Banner Section -->
  <v-col cols="12">
    <v-card 
      class="banner-card rounded-lg bg-maya_blue mx-auto py-6"
      :style="{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)' }"
    >
      <div class="d-flex align-center justify-space-between flex-wrap px-3">
        <div class="text-content" :class="{ 'fade-in': isVisible }">
          <h2 class="text-h3 font-weight-bold mb-4 gradient-text outfit outfit-bold">What is Owlmigo?</h2>
          <p class="text-body-1 mb-6 text-grey-lighten-4 outfit outfit-regular">
            Owlmigo AI is an intelligent study companion designed to help students learn more effectively.
            By leveraging advanced AI, it transforms study materials—such as PDFs, Word documents,
            and notes—into interactive learning aids like quizzes, summaries, and flashcards.
          </p>
          <div class="d-flex gap-4">
            <NuxtLink to="/library">
              <v-btn 
                rounded="xl" 
                variant="outlined" 
                color="white" 
                class="text-white animated-btn outfit outfit-medium"
                height="48"
              >
                <span class="d-flex align-center">
                  Get Started for Free
                  <v-icon class="ms-2 btn-icon">mdi-arrow-right</v-icon>
                </span>
              </v-btn>
            </NuxtLink> 
            <NuxtLink to="/library">
              <v-btn 
                rounded="xl" 
                variant="outlined" 
                color="white" 
                class="text-white animated-btn-alt outfit outfit-medium"
                height="48"
              >
                <span class="d-flex align-center">
                  Explore AI Tools
                  <v-icon class="ms-2 btn-icon">mdi-robot</v-icon>
                </span>
              </v-btn>
            </NuxtLink>
          </div>
        </div>
        
        <v-img
          src="/images/3d-casual-life-chatgpt-robot-in-graduation-cap-1.png"
          height="280"
          width="280"
          class="banner-image"
          contain
          :class="{ 'animate-bounce': isHovered }"
        ></v-img>
      </div>
    </v-card>
  </v-col>

  <!-- Section Divider -->
  <div class="section-divider">
    <div class="divider-line"></div>
    <v-icon icon="mdi-owl" color="secondary" size="small"></v-icon>
    <div class="divider-line"></div>
  </div>

  <!-- Mission Section -->
  <v-col cols="12" class="section-container" ref="missionSection">
    <v-card 
      class="section-card rounded-lg mx-auto py-8"
      :style="{ opacity: isMissionVisible ? 1 : 0, transform: isMissionVisible ? 'translateY(0)' : 'translateY(20px)' }"
    >
      <v-card-text class="text-center px-6">
        <h2 class="text-h4 text-royal_blue font-weight-bold mb-6 gradient-text-alt outfit outfit-bold section-header">Our Mission</h2>
        <p class="text-body-1  outfit outfit-regular section-text">
          At Owlmigo AI, we believe that every student deserves a study experience that is efficient, engaging,
          and tailored to their needs. Traditional learning methods can be time-consuming and overwhelming, 
          but with the power of AI, we aim to transform the way students absorb knowledge.
        </p>
      </v-card-text>
    </v-card>
  </v-col>

  <!-- Section Divider -->
  <div class="section-divider">
    <div class="divider-line"></div>
    <v-icon icon="mdi-owl" color="secondary" size="small"></v-icon>
    <div class="divider-line"></div>
  </div>

  <!-- Why Owlmingo is the Best -->
  <v-col cols="12" class="section-container" ref="whySection">
    <v-card 
      class="section-card rounded-lg mx-auto py-8"
      :style="{ opacity: isWhyVisible ? 1 : 0, transform: isWhyVisible ? 'translateY(0)' : 'translateY(20px)' }"
    >
      <v-card-text class="text-center px-6">
        <h2 class="text-royal_blue text-h4 font-weight-bold mb-6 gradient-text-alt outfit outfit-bold section-header">Why Owlmingo is the Best?</h2>
        
        <v-row class="mt-8">
          <v-col cols="12" md="4" v-for="(feature, index) in features" :key="index">
            <v-card 
              class="feature-card pa-6 h-100"
              :style="{ 
                transitionDelay: `${index * 150}ms`,
                opacity: isWhyVisible ? 1 : 0,
                transform: isWhyVisible ? 'translateY(0)' : 'translateY(20px)',
                borderBottomColor: feature.color
              }"
            >
              <v-icon :icon="feature.icon" size="x-large" color="secondary" class="feature-icon mb-4"></v-icon>
              <h3 class="text-h6 font-weight-bold mb-2 outfit outfit-medium">{{ feature.title }}</h3>
              <p class="outfit outfit-regular">{{ feature.description }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>

  <!-- Section Divider -->
  <div class="section-divider">
    <div class="divider-line"></div>
    <v-icon icon="mdi-owl" color="secondary" size="small"></v-icon>
    <div class="divider-line"></div>
  </div>

  <!-- Feedback Section -->
  <v-col cols="12" class="section-container" ref="feedbackSection">
    <v-card 
      class="section-card rounded-lg mx-auto py-8"
      :style="{ opacity: isFeedbackVisible ? 1 : 0, transform: isFeedbackVisible ? 'translateY(0)' : 'translateY(20px)' }"
    >
      <v-card-text class="px-6">
        <h2 class="text-royal_blue text-h4 font-weight-bold mb-6 gradient-text-alt outfit outfit-bold text-center section-header">What Our Users Say</h2>
        
        <v-row class="mt-8">
          <v-col cols="12" sm="6" md="4" v-for="(feedback, index) in feedbackData" :key="index">
            <v-card 
              class="feedback-card pa-6 h-100"
              :style="{ 
                transitionDelay: `${index * 100}ms`,
                opacity: isFeedbackVisible ? 1 : 0,
                transform: isFeedbackVisible ? 'translateY(0)' : 'translateY(20px)'
              }"
            >
              <div class="d-flex align-center mb-4">
                <v-avatar size="48" class="mr-3">
                  <v-img :src="feedback.avatar" :alt="feedback.name"></v-img>
                </v-avatar>
                <h3 class="text-subtitle-1 font-weight-bold outfit outfit-medium">{{ feedback.name }}</h3>
              </div>
              <v-divider class="mb-4"></v-divider>
              <p class="outfit outfit-regular feedback-text">{{ feedback.text }}</p>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-col>

  <!-- Section Divider -->
  <div class="section-divider">
    <div class="divider-line"></div>
    <v-icon icon="mdi-owl" color="secondary" size="small"></v-icon>
    <div class="divider-line"></div>
  </div>

  <!-- Our Team Section -->
  <v-col cols="12" class="section-container" ref="teamSection">
    <v-card 
      class="section-card rounded-lg mx-auto py-8"
      :style="{ opacity: isTeamVisible ? 1 : 0, transform: isTeamVisible ? 'translateY(0)' : 'translateY(20px)' }"
    >
      <v-card-text class="text-center px-6">
        <h2 class="text-royal_blue text-h4 font-weight-bold mb-6 gradient-text-alt outfit outfit-bold section-header">Meet Our Team</h2>
        
        <v-row class="mt-8">
          <v-col cols="12" sm="6" md="4" v-for="(member, index) in teamMembers" :key="index">
            <v-hover v-slot="{ isHovering, props }">
              <v-card 
                class="team-member-card h-100" 
                v-bind="props"
                :style="{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: isTeamVisible ? 1 : 0,
                  transform: isTeamVisible ? 'translateY(0)' : 'translateY(20px)'
                }"
              >
                <div class="team-image-container">
                  <v-img 
                    :src="member.image" 
                    :alt="member.name" 
                    height="320"  
                    class="team-image"
                    cover
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey-lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                  <div 
                    class="team-overlay" 
                    :class="{ 'show-overlay': isHovering }"
                  >
                    <div class="team-info">
                      <h3 class="text-h6 font-weight-bold outfit outfit-medium mb-2 team-name">{{ member.name }}</h3>
                      <p class="text-subtitle-1 outfit outfit-regular mb-4 team-role">{{ member.role }}</p>
                      <div class="mt-4 d-flex justify-center">
                        <v-btn icon="mdi-linkedin" variant="text" color="white" size="small" class="mx-1 social-btn"></v-btn>
                        <v-btn icon="mdi-twitter" variant="text" color="white" size="small" class="mx-1 social-btn"></v-btn>
                        <v-btn icon="mdi-github" variant="text" color="white" size="small" class="mx-1 social-btn"></v-btn>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="team-member-info pa-4" :class="{ 'info-hidden': isHovering }">
                  <h3 class="text-subtitle-1 font-weight-bold outfit outfit-medium">{{ member.name }}</h3>
                  <p class="text-caption outfit outfit-regular text-grey">{{ member.role }}</p>
                </div>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card> 
  </v-col>
  

  <!-- Scroll to top button -->
  <v-btn
    v-show="showScrollTop"
    icon="mdi-arrow-up"
    color="secondary"
    size="large"
    class="scroll-top-btn"
    @click="scrollToTop"
  ></v-btn>
  <Footer />
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import Footer from '~/components/Footer.vue';

// Animation states
const isVisible = ref(false);
const isHovered = ref(false);
const isMissionVisible = ref(false);
const isWhyVisible = ref(false);
const isFeedbackVisible = ref(false);
const isTeamVisible = ref(false);
const showScrollTop = ref(false);

// Add new refs for feedback animation
const feedbackAnimationActive = ref(true);

// Section refs
const missionSection = ref(null);
const whySection = ref(null);
const feedbackSection = ref(null);
const teamSection = ref(null);

// Features data
const features = [
  { 
    icon: 'mdi-rocket-launch', 
    title: 'Fast Learning', 
    description: 'Our AI-powered study tools help you learn faster and more efficiently by focusing on what matters most.',
    color: '#4CAF50'  // Changed from #b6b2b2 to green
  },
  { 
    icon: 'mdi-lightbulb-on', 
    title: 'Engaging Experience', 
    description: 'Transform your study materials into interactive learning aids that keep you engaged and motivated.',
    color: '#2196F3'  // Changed from #b6b2b2 to blue
  },
  { 
    icon: 'mdi-account-group', 
    title: 'Tailored to Your Needs', 
    description: 'Personalize your study experience to suit your learning style, pace, and specific educational goals.',
    color: '#FF9800'  // Changed from #b6b2b2 to orange
  }
];

// Team members data
const teamMembers = [
  { name: 'Soksan Phork', role: 'Frontend Developer', image: '/images/Soksan-Phork.jpg' },
  { name: 'Team Member 2', role: 'Backend Developer', image: '/images/Soksan-Phork.jpg' },
  { name: 'Team Member 3', role: 'UX Designer', image: '/images/Soksan-Phork.jpg' },
  { name: 'Team Member 4', role: 'Project Manager', image: '/images/Soksan-Phork.jpg' },
  { name: 'Team Member 5', role: 'AI Engineer', image: '/images/Soksan-Phork.jpg' },
  { name: 'Team Member 6', role: 'QA Engineer', image: '/images/Soksan-Phork.jpg' },
];

// Sample feedback data
const feedbackData = [
  { name: 'Mickey', avatar: '/images/Mickey.jpg', text: 'Owlmingo has transformed my study habits completely. The AI-generated quizzes are spot-on and help identify knowledge gaps I didn\'t know existed.' },
  { name: 'Draken', avatar: '/images/Draken.jpg', text: 'I\'ve tried many study tools, but Owlmingo stands out. The flashcards are incredibly effective and the interface is intuitive. Highly recommended!' },
  { name: 'Sakuna', avatar: '/images/Sakuna.jpg', text: 'As a medical student with mountains of content to memorize, Owlmingo has been a lifesaver. The AI understands complex topics and creates perfect study materials.' },
  { name: 'Lushi', avatar: '/images/Lushi.jpg', text: 'The personalized approach to learning is what makes Owlmingo special. It adapts to my style and helps me retain information much longer than traditional methods.' },
  { name: 'Draken', avatar: '/images/Draken.jpg', text: 'I was skeptical about AI study tools, but Owlmingo exceeded my expectations. It\'s like having a tutor available 24/7 who knows exactly what I need.' },
  { name: 'Xiao Eii', avatar: '/images/XiaoEii.jpg', text: 'Preparing for my finals was so much easier with Owlmingo. I uploaded my lecture notes and instantly got comprehensive study materials that helped me ace my exams.' }
];

// Scroll to top functionality
const checkScroll = () => {
  showScrollTop.value = window.scrollY > 300;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// Function to animate feedback cards with alternating motion
const animateFeedbackCards = () => {
  // Only animate if the feedback section is visible
  if (!isFeedbackVisible.value) return;
  
  // Get all feedback cards and animate them with delays
  const cards = document.querySelectorAll('.feedback-card');
  cards.forEach((card, index) => {
    // Skip animation if card is not visible
    if (!card.offsetParent) return;
    
    // Apply animation class based on odd/even index
    setTimeout(() => {
      card.classList.add(index % 2 === 0 ? 'animate-slide-right' : 'animate-slide-left');
      
      // Remove animation class after animation completes
      setTimeout(() => {
        card.classList.remove('animate-slide-right', 'animate-slide-left');
      }, 1500); // Animation duration plus a little buffer
    }, index * 150); // Stagger start times
  });
};

// Intersection observer setup
const setupIntersectionObservers = () => {
  // Make all sections visible immediately to fix display issues
  isMissionVisible.value = true;
  isWhyVisible.value = true;
  isFeedbackVisible.value = true;
  isTeamVisible.value = true;
  
  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  // Add proper intersection observer with fallback
  if ('IntersectionObserver' in window) {
    const observers = [
      { ref: missionSection, state: isMissionVisible },
      { ref: whySection, state: isWhyVisible },
      { ref: feedbackSection, state: isFeedbackVisible },
      { ref: teamSection, state: isTeamVisible }
    ];

    observers.forEach(({ ref, state }) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Add slight delay before triggering animation
            setTimeout(() => {
              state.value = true;
            }, 100);
            observer.unobserve(entry.target);
          }
        });
      }, options);

      if (ref.value) observer.observe(ref.value);
    });
  }
};

onMounted(() => {
  // Initial animation
  setTimeout(() => {
    isVisible.value = true;
  }, 300);
  
  // Animated bounce effect every 5 seconds
  const bounceInterval = setInterval(() => {
    isHovered.value = true;
    setTimeout(() => {
      isHovered.value = false;
    }, 1000);
  }, 5000);

  // Add feedback animation interval
  const feedbackAnimationInterval = setInterval(() => {
    if (feedbackAnimationActive.value) {
      animateFeedbackCards();
    }
  }, 5000); // Run animation every 5 seconds

  // Setup observers after a slight delay to ensure DOM is ready
  setTimeout(() => {
    setupIntersectionObservers();
  }, 500);

  // Add scroll event listener
  window.addEventListener('scroll', checkScroll);
  
  // Stop animations when user leaves the tab/window
  document.addEventListener('visibilitychange', () => {
    feedbackAnimationActive.value = !document.hidden;
  });
  
  // Clean up on unmount
  onUnmounted(() => {
    clearInterval(bounceInterval);
    clearInterval(feedbackAnimationInterval);
    window.removeEventListener('scroll', checkScroll);
    document.removeEventListener('visibilitychange', () => {});
  });
});
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

/* Banner section */
.banner-card {
  width: 95%;
  margin: 2rem auto;
  padding: 2rem;
  position: relative;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.5s ease;
  overflow: hidden;
}

.text-content {
  max-width: 650px;
  text-align: left;
  transition: all 0.6s ease;
}

.banner-image {
  transition: transform 0.5s ease;
}

.gap-4 {
  gap: 1.5rem;
}

/* Section containers */
.section-container {
  margin: 4rem auto;
}

.section-card {
  width: 95%;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
}

.section-text {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Improved section headers for better hierarchy */
.section-header {
  margin-bottom: 2rem;
  position: relative;
  display: inline-block;
}

.section-header:after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #737ef8, #3949AB);
  border-radius: 3px;
}

/* Feature cards */
.feature-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background: linear-gradient(145deg, #ffffff, #f5f5f5);
  border-bottom: 3px solid transparent;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-bottom: 3px solid #69247C;
}

.feature-icon {
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

/* Feedback cards */
.feedback-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: #FBFBFB;
  border-left: 3px solid transparent;
  position: relative;
}

.feedback-card:hover {
  transform: translateY(-5px) translateX(3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-left: 3px solid purple;
}

/* New feedback card animations */
@keyframes slideRight {
  0% { transform: translateX(0); }
  15% { transform: translateX(10px); }
  30% { transform: translateX(0); }
  45% { transform: translateX(10px); }
  60% { transform: translateX(0); }
}

@keyframes slideLeft {
  0% { transform: translateX(0); }
  15% { transform: translateX(-10px); }
  30% { transform: translateX(0); }
  45% { transform: translateX(-10px); }
  60% { transform: translateX(0); }
}

.animate-slide-right {
  animation: slideRight 2s ease-in-out;
}

.animate-slide-left {
  animation: slideLeft 2s ease-in-out;
}

/* Improve feedback card visuals */
.feedback-text {
  line-height: 1.7;
  font-style: italic;
  position: relative;
  transition: all 0.3s ease;
}

.feedback-text::before {
  content: '"';
  font-size: 3rem;
  color: rgba(0, 0, 0, 0.1);
  position: absolute;
  top: -1.5rem;
  left: -0.5rem;
  transition: all 0.3s ease;
}

/* Add subtle hover effect to quote mark */
.feedback-card:hover .feedback-text::before {
  color: rgba(26, 35, 126, 0.15);
  transform: scale(1.1);
}

/* Optional: Add a subtle shadow highlight when card animates */
.animate-slide-right, .animate-slide-left {
  box-shadow: 0 8px 20px rgba(26, 35, 126, 0.15);
}

/* Team member cards */
.team-member-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  height: 400px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.team-member-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(26, 35, 126, 0.15);
}

.team-image-container {
  position: relative;
  overflow: hidden;
}

.team-image {
  transition: all 0.6s ease;
}

.team-member-card:hover .team-image {
  transform: scale(1.05);
}

/* Make sure portrait focus is strong by using deep selectors */
.team-image :deep(.v-img__img) {
  object-position: top center !important;
  object-fit: cover !important;
}

.team-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, 
    rgba(105, 36, 124, 0.75), 
    rgba(26, 35, 126, 0.55)
  );
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.show-overlay {
  opacity: 1;
  transform: translateY(0);
}

.team-info {
  color: white;
  text-align: center;
  padding: 1rem;
  transform: translateY(15px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}

.show-overlay .team-info {
  transform: translateY(0);
  opacity: 1;
}

.team-name {
  transform: translateY(5px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.1s;
}

.team-role {
  transform: translateY(5px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: 0.2s;
}

.social-btn {
  transition: all 0.3s ease;
  transform: scale(0);
  transition-delay: 0.3s;
}

.show-overlay .social-btn {
  transform: scale(1);
}

.social-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: scale(1.2);
}

.team-member-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  transition: all 0.3s ease;
  border-top: 3px solid transparent;
}

.team-member-card:hover .team-member-info:not(.info-hidden) {
  border-top: 3px solid rgba(105, 36, 124, 0.6);
  background-color: #fbfbfb;
}

.info-hidden {
  opacity: 0;
}

/* Responsive adaptations for team cards */
@media (max-width: 960px) {
  .team-member-card {
    height: 350px;
  }
}

@media (max-width: 600px) {
  .team-member-card {
    height: 320px;
  }
  
  .team-image {
    height: 250px !important;
  }
}

/* Button styling */
.animated-btn, .animated-btn-alt {
  transition: all 0.3s ease;
  border-width: 2px;
  position: relative;
  overflow: hidden;
  min-width: 160px;
  padding: 0 20px !important;
  box-shadow: none;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}

.animated-btn:hover::before {
  left: 100%;
}

.animated-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

.animated-btn-alt:hover {
  background-color: white;
  color: #1A237E !important;
  transform: translateY(-3px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon, .animated-btn-alt:hover .btn-icon {
  transform: translateX(5px);
}

/* Gradient text effects */
.gradient-text {
  background: linear-gradient(90deg, #ffffff, #e0f7fa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.gradient-text-alt {
  background: linear-gradient(90deg, #1A237E, #3949AB);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Animations */
.fade-in {
  animation: fadeIn 0.8s ease-in;
}

.animate-bounce {
  animation: bounce 1s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

/* Added smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Section dividers */
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3rem auto;
  width: 80%;
}

.divider-line {
  flex-grow: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(26, 35, 126, 0.5), transparent);
}

.section-divider .v-icon {
  margin: 0 15px;
}

/* Scroll to top button */
.scroll-top-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 99;
  opacity: 0.8;
  transition: all 0.3s ease;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.scroll-top-btn:hover {
  transform: translateY(-3px);
  opacity: 1;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
}

/* Improved section transitions */
.section-card[style*="opacity: 1"] {
  transform: translateY(0);
}

.feature-card[style*="opacity: 1"],
.team-member-card[style*="opacity: 1"],
.feedback-card[style*="opacity: 1"] {
  transform: translateY(0);
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .banner-card {
    padding: 1.5rem;
  }
  
  .text-content {
    margin-bottom: 2rem;
    text-align: center;
    margin-right: 0;
    max-width: 100%;
  }
  
  .banner-image {
    position: relative;
    right: auto;
    top: auto;
    margin: 0 auto;
    height: 220px !important;
    width: 220px !important;
  }
  
  .section-card {
    padding: 1.5rem;
  }
  
  .feature-card, .feedback-card, .team-member-card {
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 600px) {
  .gradient-text, .gradient-text-alt {
    font-size: 1.75rem;
  }
  
  .section-container {
    margin: 2rem auto;
  }
  
  .banner-card, .section-card {
    width: 95%;
  }
}
</style>