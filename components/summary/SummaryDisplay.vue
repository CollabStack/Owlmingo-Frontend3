<template>
  <v-container>
    <h1 class="text-h4 text-center font-weight-bold text-primary mb-3 mt-4 outfit outfit-bold">
      Summarizer
    </h1>
  
    <p class="text-subtitle-1 text-center text-grey-darken-1 mb-6 outfit outfit-regular">
        <span class="text-h6 outfit animation">Your text has been summarized! 🎉</span> 
        <br>We've captured the key points while keeping the original meaning. Review the summary and refine it as needed, or generate a new one anytime! </p>

    <v-card class="border-radius">
      <v-row>
        <v-col cols="12">
          <v-textarea   
            v-model="displayText"
            hide-details
            bg-color="white" 
            rows="12"
            auto-grow
            color="secondary"
            counter="4000" 
            variant="flat">
          </v-textarea>
        </v-col>
      </v-row>
  
      <v-row class="px-3 pb-3">
        <v-col cols="6">
          <span class="animation">{{ wordCount }} Words</span>
        </v-col>
        <v-col cols="6" class="d-flex justify-end">
          <v-icon class="mx-1 cursor-pointer animation" @click="clearText">mdi-delete</v-icon>
          <v-icon class="mx-1 cursor-pointer animation" @click="copyText">mdi-content-copy</v-icon>
          <v-icon class="mx-1 cursor-pointer animation">mdi-download</v-icon>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
  
<script setup>
  import { ref, computed, onMounted } from 'vue';
  
  const fullText = "Your text has been successfully summarized! 🎉 We've extracted the most important points to provide you with a clear, concise version while maintaining the original meaning. This AI-generated summary is designed to save you time and make your content easier to read and understand. Feel free to review the summary and make any changes as needed. If you want further refinements, you can edit the input or generate a new summary. Let AI help you create well-structured, impactful content effortlessly!";
  
  const displayText = ref("");
  
  const wordCount = computed(() => {
    return displayText.value.trim() ? displayText.value.trim().split(/\s+/).length : 0;
  });
  
  const clearText = () => {
    displayText.value = "";
  };
  
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(displayText.value);
      alert("Text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };
  
  onMounted(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        displayText.value += fullText[index++];
      } else {
        clearInterval(interval);
      }
    }, 50);
  });
</script>
  
<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
  
  .outfit {
    font-family: "Outfit", sans-serif;
    font-optical-sizing: auto;
    font-style: normal;
  }
  
  .outfit-regular {
    font-weight: 400;
  }
  
  .outfit-bold {
    font-weight: 700;
  }
  .border-radius {
    border-radius: 12px;
    border: 2px solid #e5e7eb;
  }
  .border-radius:hover {
    border: 2px solid #6d54f9;
  }
  .animation {
  display: inline-block;
  animation: snakeVerticalMovement 3s linear infinite;
  }

  @keyframes snakeVerticalMovement {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(2px); /* Move down */
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
  