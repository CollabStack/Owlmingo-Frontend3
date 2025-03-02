<template>
  <v-col cols="12">
    <v-card  class="banner-card rounded-lg d-flex align-center px-6 py-6 bg-maya_blue"  v-motion-slide-visible-bottom>
      
      <v-img v-motion-fade-visible
        src="/images/3d-casual-life-chatgpt-robot-in-graduation-cap-1.png"
        height="380" 
        width="380"  
        class="me-6 position-img"
        contain
      ></v-img>

      <div class="text-content text-center">
        <h2 class="text-h4 font-weight-bold mb-4">Three Powerful Tools, Unlimited Possibilities!</h2>
        <p class="text-body-1 mb-6">Discover how our AI tools simplify content creation, making learning more efficient and tailored to your goals</p>
        <div class="d-flex justify-center gap-4">
          <NuxtLink to="/about"><v-btn rounded="xl" variant="outlined" color="white" class="text-white">Get Start for Free</v-btn></NuxtLink> 
          <NuxtLink to="/about"><v-btn rounded="xl" variant="outlined" color="white" class="text-white">explore AI Tool</v-btn></NuxtLink>
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
  font-family: sans-serif;
}
p {
  font-family: sans-serif;
}
v-btn {
  font-family: sans-serif;
}


.position-img {
  position: absolute; 
  left: 20px; 
  top: -30px;   
  z-index: 1; 
}
</style>
