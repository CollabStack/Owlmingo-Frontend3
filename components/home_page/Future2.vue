<template>
  <v-col cols="12">
    <v-card class="banner-card rounded-lg d-flex align-center px-6 py-6 bg-maya_blue" v-motion-slide-visible-bottom>
      
      <v-img 
        v-motion
        :initial="{ opacity: 0, scale: 0.8, y: 50 }"
        :enter="{ opacity: 1, scale: 1, y: 0, transition: { duration: 800, type: 'spring', stiffness: 50 } }"
        src="/images/3d-casual-life-chatgpt-robot-in-graduation-cap-1.png"
        height="380" 
        width="380"  
        class="me-6 position-img animated-img"
        contain
      ></v-img>

      <div class="text-content text-center">
        <h2 
          class="text-h4 font-weight-bold mb-4 animated-title"
          style="color: #EDE7F6;"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 600 } }"
        >Three Powerful Tools, Unlimited Possibilities!</h2>
        
        <p 
          class="text-body-1 mb-6 animated-text text-white-darken-1"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 400, duration: 600 } }"
        >Discover how our AI tools simplify content creation, making learning more efficient and tailored to your goals</p>
        <div 
          class="d-flex justify-center gap-4"
          v-motion
          :initial="{ opacity: 0, y: 30 }"
          :enter="{ opacity: 1, y: 0, transition: { delay: 600, duration: 600 } }"
        >
          <NuxtLink to="/about" class="text-decoration-none">
            <v-btn rounded="xl" variant="outlined" color="white" class="custom-btn animated-btn" height="48">
              <span class="d-flex align-center">
                Get Started for Free
                <v-icon class="ms-2 btn-icon">mdi-arrow-right</v-icon>
              </span>
            </v-btn>
          </NuxtLink> 
          <NuxtLink to="/about" class="text-decoration-none">
            <v-btn rounded="xl" variant="outlined" color="white" class="custom-btn animated-btn-alt" height="48">
              <span>Explore AI Tools</span>
            </v-btn>
          </NuxtLink>
        </div>
      </div>
    </v-card>
  </v-col>
</template>

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
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 123, 255, 0.2);
  transition: all 0.4s ease;
}

.banner-card:hover {
  box-shadow: 0 15px 40px rgba(0, 123, 255, 0.3);
  transform: translateY(-5px);
}

.text-content {
  max-width: 980px;
  text-align: center; 
  width: 100%;
  margin-top: 20px; 
}

.gap-4 {
  gap: 2rem;
}

h2 {
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.5px;
}

p {
  font-family: 'Outfit', sans-serif;
  line-height: 1.6;
}

.position-img {
  position: absolute; 
  left: 20px; 
  top: -30px;   
  z-index: 1;
  filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.15));
}

.animated-img {
  transition: all 0.6s ease;
}

.banner-card:hover .animated-img {
  transform: translateY(-10px) rotate(5deg);
}

.custom-btn {
  transition: all 0.3s ease;
  padding: 0 24px !important;
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  border-width: 2px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 180px;
  line-height: 1;
}

.animated-btn, .animated-btn-alt {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
  color: #2196F3 !important;
  transform: translateY(-3px);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon {
  transform: translateX(5px);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
}

.position-img {
  animation: float 6s ease-in-out infinite;
}
</style>