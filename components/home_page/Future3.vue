<template>
  <div>
    <!-- Feature 1: AI Flashcard Generator -->
    <v-row justify="center" class="mx-15 my-15" v-motion-slide-visible-bottom>
      <!-- Text Column -->
      <v-col cols="12" md="6" class="d-flex justify-start align-center text-left">
        <div 
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, ease: 'easeOut' } }"
          class="feature-content"
        >
          <h3 class="text-h4 font-weight-bold mb-3 animated-title text-primary">AI Flashcard Generator</h3>
          <p class="mb-5 text-body-1 animated-text">
            Save hours by instantly generating flashcards with AI-powered tools that help you efficiently test and strengthen your knowledge.
          </p>
          <NuxtLink to="/about" class="text-decoration-none">
            <v-btn 
              color="secondary" 
              variant="elevated" 
              class="px-6 py-3 animated-btn"
              elevation="2"
            >
              <span class="d-flex align-center">
                Get Started
                <v-icon class="ms-2 btn-icon">mdi-arrow-right</v-icon>
              </span>
            </v-btn>
          </NuxtLink>
        </div>
      </v-col>

      <!-- Image Box -->
      <v-col cols="10" md="6" class="d-flex justify-center">
        <div  
          class="banner-box ml-16 bg-pattens_blue" 
          v-motion
          :initial="{ opacity: 0, scale: 0.9, rotateY: -10 }"
          :enter="{ opacity: 1, scale: 1, rotateY: 0, transition: { duration: 800, type: 'spring', stiffness: 50 } }"
        >
          <img
            src="/images/glow-educational-robot-helping-with-studies.png"
            alt="Educational Robot"
            class="position-img floating-image"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Feature 2: AI Quiz Generator -->
    <v-row justify="center" class="mx-15 my-15" v-motion-slide-visible-bottom>
      <!-- Image Box -->
      <v-col cols="12" md="4" class="d-flex justify-center">
        <div  
          class="banner-box mr-16 bg-aero_blue" 
          v-motion
          :initial="{ opacity: 0, scale: 0.9, rotateY: 10 }"
          :enter="{ opacity: 1, scale: 1, rotateY: 0, transition: { duration: 800, type: 'spring', stiffness: 50 } }"
        >
          <img
            src="/images/glow-young-man-communicating-with-artificial-intelligence-through-a-computer 1.png"
            alt="AI Quiz Interface"
            class="position-img floating-image-alt"
          />
        </div>
      </v-col>
      
      <!-- Text Column -->
      <v-col cols="12" md="6" class="d-flex justify-start align-center text-left">
        <div 
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, ease: 'easeOut' } }"
          class="feature-content"
        >
          <h3 class="text-h4 font-weight-bold mb-3 animated-title text-primary">AI Quiz Generator</h3>
          <p class="mb-5 text-body-1 animated-text">
            Effortlessly create quizzes with AI that understands your material and evaluates answers to enhance both learning and teaching experiences.
          </p>
          <NuxtLink to="/about" class="text-decoration-none">
            <v-btn 
              color="secondary" 
              variant="elevated" 
              class="px-6 py-3 animated-btn"
              elevation="2"
            >
              <span class="d-flex align-center">
                Get Started
                <v-icon class="ms-2 btn-icon">mdi-arrow-right</v-icon>
              </span>
            </v-btn>
          </NuxtLink>
        </div>
      </v-col>
    </v-row>

    <!-- Feature 3: AI Summary Generator -->
    <v-row justify="center" class="mx-15 my-15" v-motion-slide-visible-bottom>
      <!-- Text Column -->
      <v-col cols="12" md="6" class="d-flex justify-start align-center text-left">
        <div 
          v-motion
          :initial="{ opacity: 0, x: -50 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, ease: 'easeOut' } }"
          class="feature-content"
        >
          <h3 class="text-h4 font-weight-bold mb-3 animated-title text-primary">AI Summary Generator</h3>
          <p class="mb-5 text-body-1 animated-text">
            Quickly condense complex materials into clear, concise summaries that capture key concepts and save valuable study time.
          </p>
          <NuxtLink to="/about" class="text-decoration-none">
            <v-btn 
              color="secondary" 
              variant="elevated" 
              class="px-6 py-3 animated-btn"
              elevation="2"
            >
              <span class="d-flex align-center">
                Get Started
                <v-icon class="ms-2 btn-icon">mdi-arrow-right</v-icon>
              </span>
            </v-btn>
          </NuxtLink>
        </div>
      </v-col>

      <!-- Image Box -->
      <v-col cols="10" md="4" class="d-flex justify-center">
        <div  
          class="banner-box ml-16 bg-iceberg" 
          v-motion
          :initial="{ opacity: 0, scale: 0.9, rotateY: -10 }"
          :enter="{ opacity: 1, scale: 1, rotateY: 0, transition: { duration: 800, type: 'spring', stiffness: 50 } }"
        >
          <img
            src="/images/sammy-woman-gives-five-to-a-robot-with-artificial-intelligence 1.png"
            alt="AI Summary Tool"
            class="position-img floating-image"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Feature 4: AI Study Assistant -->
    <v-row justify="center" class="mx-15 my-15" v-motion-slide-visible-bottom>
      <!-- Image Box -->
      <v-col cols="12" md="6" class="d-flex justify-center">
        <div  
          class="banner-box mr-16 bg-lavender_mist" 
          v-motion
          :initial="{ opacity: 0, scale: 0.9, rotateY: 10 }"
          :enter="{ opacity: 1, scale: 1, rotateY: 0, transition: { duration: 800, type: 'spring', stiffness: 50 } }"
        >
          <img
            src="/images/space-delete-confirmation.png"
            alt="AI Study Assistant"
            class="position-img floating-image-alt"
          />
        </div>
      </v-col>
      
      <!-- Text Column -->
      <v-col cols="12" md="6" class="d-flex justify-start align-center text-left">
        <div 
          v-motion
          :initial="{ opacity: 0, x: 50 }"
          :enter="{ opacity: 1, x: 0, transition: { duration: 800, ease: 'easeOut' } }"
          class="feature-content"
        >
          <h3 class="text-h4 font-weight-bold mb-3 animated-title text-primary">AI Study Assistant</h3>
          <p class="mb-5 text-body-1 animated-text">
            Get personalized learning support with an AI assistant that adapts to your learning style and provides targeted help when you need it.
          </p>
          <NuxtLink to="/about" class="text-decoration-none">
            <v-btn 
              color="secondary" 
              variant="elevated" 
              class="px-6 py-3 animated-btn"
              elevation="2"
            >
              <span class="d-flex align-center">
                Get Started
                <v-icon class="ms-2 btn-icon">mdi-arrow-right</v-icon>
              </span>
            </v-btn>
          </NuxtLink>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.banner-box {
  position: relative;
  width: 100%; 
  max-width: 500px; 
  height: 350px; 
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  overflow: visible;
}

.banner-box:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.position-img {
  width: 100%; 
  height: auto; 
  object-position: top; 
  border-radius: 20px; 
  position: absolute; 
  top: -56px; 
  z-index: 2;
  transition: all 0.5s ease;
}

.floating-image {
  animation: float 6s ease-in-out infinite;
}

.floating-image-alt {
  animation: float-alt 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

@keyframes float-alt {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.feature-content {
  max-width: 90%;
}

.animated-title {
  position: relative;
  display: inline-block;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.5px;
}

.animated-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40px;
  height: 3px;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.feature-content:hover .animated-title::after {
  width: 100px;
}

.animated-text {
  font-family: 'Outfit', sans-serif;
  line-height: 1.6;
  opacity: 0.85;
  transition: opacity 0.3s ease;
}

.feature-content:hover .animated-text {
  opacity: 1;
}

.animated-btn {
  transition: all 0.3s ease;
  padding: 0 24px !important;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  border-width: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  line-height: 1;
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
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon {
  transform: translateX(5px);
}
</style>