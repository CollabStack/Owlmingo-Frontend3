<!-- <template>
    <v-app class="animated-gradient">
      <v-main>
        <slot />
      </v-main>
    </v-app>
  </template>
  
  <style scoped>
  .animated-gradient {
    min-height: 100vh;
    background: linear-gradient(-45deg,
      var(--v-primary),
      var(--v-secondary),
      var(--v-maya_blue),
      var(--v-accent),
      var(--v-white)
    );
    background-size: 400% 400%;
    animation: gradientFlow 15s ease infinite;
  }
  
  @keyframes gradientFlow {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  </style>
   -->
   <template>
    <v-app class="star-layout">
      <!-- Sky Background with Twinkling Stars -->
      <div class="sky">
        <div v-for="n in 80" :key="n" class="star" :style="getStarStyle()" />
        
        <!-- Barnard's Star -->
        <div class="barnard-star" />
  
        <!-- Shooting Stars -->
        <div
          v-for="n in 6"
          :key="'shooting-' + n"
          class="shooting-star"
          :style="getShootingStyle(n)"
        />
      </div>
  
      <v-main class="main-content">
        <slot />
      </v-main>
    </v-app>
  </template>
  
  <script setup>
  function getStarStyle() {
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const size = Math.random() * 1.5 + 0.5;
    const duration = Math.random() * 2 + 1;
    const delay = Math.random() * 5;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      width: `${size}px`,
      height: `${size}px`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
    };
  }
  
  function getShootingStyle(index) {
    const top = Math.random() * 60 + 10; // Between 10% and 70%
    const left = Math.random() * 60 + 20; // Between 20% and 80%
    const delay = index * 7 + Math.random() * 5; // staggered delays
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      animationDelay: `${delay}s`,
    };
  }
  </script>
  
  <style>
  .star-layout {
    position: relative;
    overflow: hidden;
    min-height: 100vh;
    background: radial-gradient(ellipse at bottom, #0b0d2b 0%, #090e30 100%);
  }
  
  /* === SKY & STARS === */
  .sky {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  
  .star {
    position: absolute;
    background: white;
    border-radius: 50%;
    opacity: 0.8;
    animation: flicker ease-in-out infinite;
  }
  
  @keyframes flicker {
    0%, 100% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.5); }
  }
  
  /* === Barnard's Star === */
  .barnard-star {
    position: absolute;
    top: 60%;
    left: 0%;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #ff4f4f;
    box-shadow: 0 0 12px 4px rgba(255, 79, 79, 0.5);
    animation: barnardMove 40s linear infinite;
    z-index: 1;
  }
  
  @keyframes barnardMove {
    0%   { left: 0%; top: 60%; }
    50%  { left: 50%; top: 58%; }
    100% { left: 100%; top: 55%; }
  }
  
  /* === Shooting Stars === */
  .shooting-star {
    position: absolute;
    width: 2px;
    height: 80px;
    background: linear-gradient(to bottom, white, transparent);
    transform: rotate(45deg);
    opacity: 0;
    animation: shoot 2s ease-in-out infinite;
    z-index: 2;
  }
  
  @keyframes shoot {
    0% {
      opacity: 0;
      transform: translate(0, 0) rotate(45deg);
    }
    10% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translate(-300px, 300px) rotate(45deg);
    }
  }
  
  /* === Content === */
  .main-content {
    position: relative;
    z-index: 3;
    min-height: 100vh;
  }
  </style>
  