<!-- <template>
  <dev class="wave-section d-flex justify-center align-center">
    <canvas ref="canvas" class="wave-canvas"></canvas>
    <div class="content">
      <h1 class="wl">Welcome To Owlmingo</h1>
      <h2 class="title">Experience a new way of learning with the power of AI</h2>
      <p class="subtitle">For students, teachers, and professionals.</p>
      <div class="button-group d-flex justify-center gap-6 mt-5">
  <NuxtLink to="/about">
    <v-btn
      variant="elevated"
      rounded="xl"
      color="primary"
      class="ai-btn d-flex align-center justify-center "
    >
      🚀 AI Flashcard
    </v-btn>
  </NuxtLink>
  <NuxtLink to="/about">
    <v-btn
      variant="elevated"
      rounded="xl"
      color="secondary"
      class="ai-btn d-flex align-center justify-center"
    >
      🧠 AI Quizzes
    </v-btn>
  </NuxtLink>
</div>



    </div>
  </dev>
</template>

<script setup>
import { onMounted, ref, onUnmounted, nextTick } from "vue";

const canvas = ref(null);

onMounted(async () => {
  await nextTick();
  const ctx = canvas.value.getContext("2d");

  // Resize canvas to fit screen
  const resizeCanvas = () => {
    if (!canvas.value) return;
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
  };

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const lightSize = 400;
  let timeoutId;

  // Mouse move event to draw light
  canvas.value.addEventListener('mousemove', (event) => {
    const x = event.clientX;
    const y = event.clientY;

    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, lightSize);
    gradient.addColorStop(0, 'rgba(144, 238, 144, 0.5)'); // Light green
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    }, 500);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", resizeCanvas);
  });
});
</script>

<style scoped>
.wave-section {
  margin-top: 8px;
  height: 90vh;
  width: 100%;
  position: relative;
  /* background: #3d3b3b; */
  background: linear-gradient(135deg, #1B1B2F, #141414);
}

.wave-canvas {
  position: absolute;
  filter: blur(80px);
  opacity: 0.5  ;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 1;
  color: #E0E0E0;
  text-align: center;
  padding: 2rem;
}

.wl {
 
  font-size: 3rem;
  font-weight: bold;
  color: #0FF0FC;
  text-shadow: 0 0 10px #0FF0FC;
  font-family: sans-serif;
}

.title {
  font-size: 1.5rem;
  margin-top: 1rem;
  font-family: sans-serif;
  color: #6C63FF;
}

.subtitle {
  font-size: 1.2rem;
  margin-top: 0.5rem;
  font-family: sans-serif;
  color: #E0E0E0;
}

.button-group {
  margin-top: 1.5rem;
}
.ai-btn {
  transition: transform 0.3s, box-shadow 0.3s;
  font-weight: 600;
  margin-left: 10px;
  letter-spacing: 0.5px;
  height: 60px;
  width: 200px;
  text-transform: uppercase;
  font-family: sans-serif;
  background: linear-gradient(45deg, #0FF0FC, #6C63FF);
  color: #fff;
  box-shadow: 0 0 20px rgba(111, 60, 220, 0.6);
  
}

.ai-btn:hover {
  /* transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(249, 246, 246, 0.2);
  background-color: #1976D2; */
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(111, 60, 220, 0.9);
}


</style> -->
