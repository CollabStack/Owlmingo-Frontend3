<template>
    <v-container class="d-flex justify-center align-center w-100% h-50 mt-1">
      <canvas ref="canvas" class="wave-canvas"></canvas>
      <div class="content">
        <h1 class="wl">Wellcome To Owlmingo</h1>
        <h1 class="title">Experience a new way of learning
          with the power of Al</h1>
        <p class="subtitle">
          For student, teacher and professional.
        </p>
        <NuxtLink to="/about"><v-btn variant="outlined" rounded="xl" color="blue-300" class="mt-5 " >AI Flashcard</v-btn></NuxtLink>
       <NuxtLink to="/about"><v-btn rounded="xl" variant="outlined"   color="blue-100" class="mt-5 ml-5 " >AI Quizzes</v-btn></NuxtLink> 
  
      </div>
    </v-container>
  </template>
  
  <script setup>
  import { onMounted, ref, onUnmounted, nextTick } from "vue";
  
  const canvas = ref(null);
  
  onMounted(async () => {
    await nextTick(); // Ensure canvas is available before accessing it
  
    const ctx = canvas.value.getContext("2d");
  
    const resizeCanvas = () => {
      if (!canvas.value) return; // Prevent errors if canvas is not available
      canvas.value.width = window.innerWidth;
      canvas.value.height = window.innerHeight;
    };
  
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  
    let step = 0;
    const speed = 0.01;
    const amplitude = 60;
    const waves = [
      { color: "rgba(0, 255, 255, 0.6)", offset: 0 },
      { color: "rgba(255, 0, 255, 0.6)", offset: Math.PI / 4 },
      { color: "rgba(0, 0, 255, 0.6)", offset: Math.PI / 2 },
      { color: "rgba(128, 0, 128, 0.6)", offset: (3 * Math.PI) / 4 },
    ];
  
    const drawWaves = () => {
      if (!canvas.value) return; // Check again before accessing canvas
  
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
      step += speed;
  
      waves.forEach((wave) => {
        ctx.beginPath();
        ctx.moveTo(0, canvas.value.height / 2);
  
        for (let x = 0; x < canvas.value.width; x++) {
          let y =
            canvas.value.height / 2 +
            Math.sin(x * 0.02 + step + wave.offset) * amplitude;
          ctx.lineTo(x, y);
        }
  
        ctx.strokeStyle = wave.color;
        ctx.lineWidth = 10;
        ctx.stroke();
      });
  
      requestAnimationFrame(drawWaves);
    };
  
    drawWaves();
  
    onUnmounted(() => {
      window.removeEventListener("resize", resizeCanvas);
    });
  });
  
  definePageMeta({ layout: "default" });
  
  
  </script>
  
  <style scoped>
  .v-container {
    background: rgb(9, 9, 9); /* Set full black background */
    width: 100vw;
    height: 100vh;
    position: relative;
  }
  
  .wave-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  
  .content {
    position: relative;
    color: white;
    text-align: center;
    z-index: 1;
  }
  
  h1 {
    font-size: 4vh;
    font-weight: bold;
  }
  
  .subtitle {
    font-size: 1.2rem;
    margin-top: 10px;
  }
  .wl{
    font-weight: bold;
    font-size: 9vh;
  }
  </style>
  