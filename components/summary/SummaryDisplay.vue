<template>
  <v-container>
    <div class="d-flex align-center mb-4">
      <v-btn 
        icon 
        variant="text" 
        @click="$emit('back')" 
        class="mr-2"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <h1 class="text-h4 font-weight-bold text-primary mb-0 outfit outfit-bold">
        {{ formattedTitle }}
      </h1>
    </div>
  
    <p class="text-subtitle-1 text-center text-grey-darken-1 mb-6 outfit outfit-regular">
      <span class="text-h6 outfit animation">Your text has been summarized! 🎉</span> 
      <br>We've captured the key points while keeping the original meaning. Review the summary and refine it as needed, or generate a new one anytime!
    </p>

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
          <v-icon class="mx-1 cursor-pointer animation" @click="downloadText">mdi-download</v-icon>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
  
<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';

const props = defineProps({
  summaryData: {
    type: Object,
    required: true
  }
});

// Log summary data when component receives it
watch(() => props.summaryData, (newData) => {
  console.log('SummaryDisplay received data:', JSON.stringify(newData, null, 2));
}, { immediate: true, deep: true });

defineEmits(['back']);

// Format the title from the summary data
const formattedTitle = computed(() => {
  if (!props.summaryData) return 'Summary';
  
  if (props.summaryData.title) {
    return props.summaryData.title;
  }
  
  // Try to extract a title from content if available
  try {
    if (typeof props.summaryData.content === 'string' && props.summaryData.content.includes('"title"')) {
      const match = props.summaryData.content.match(/"title":\s*"([^"]+)"/);
      if (match && match[1]) {
        console.log('Extracted title from content:', match[1]);
        return match[1];
      }
    }
  } catch (e) {
    console.error('Error extracting title:', e);
  }
  
  return 'Generated Summary';
});

// Format the content from the summary data
const formattedContent = computed(() => {
  if (!props.summaryData) return '';
  
  console.log('Formatting content from:', props.summaryData);
  
  let content = props.summaryData.content || '';
  console.log('Raw content:', content);
  
  // Handle potential JSON string content
  if (typeof content === 'string') {
    try {
      // Check if it contains JSON objects with title and content
      if (content.includes('"title"') && content.includes('"content"')) {
        console.log('Content appears to contain JSON objects');
        const sections = [];
        // Try to extract and parse JSON objects
        const regex = /\{[^{]*"title"[^}]*"content"[^}]*\}/g;
        const matches = content.match(regex);
        
        if (matches) {
          console.log('Found JSON matches:', matches.length);
          matches.forEach((match, index) => {
            try {
              const parsed = JSON.parse(match);
              console.log(`Parsed section ${index + 1}:`, parsed);
              if (parsed.title && parsed.content) {
                sections.push(`## ${parsed.title}\n\n${parsed.content}`);
              }
            } catch (err) {
              console.warn('Failed to parse JSON section:', err);
            }
          });
          
          if (sections.length > 0) {
            const formatted = sections.join('\n\n');
            console.log('Formatted sections:', formatted);
            return formatted;
          }
        }
      }
    } catch (e) {
      console.warn('Error processing content as JSON:', e);
    }
  }
  
  // Return content as is if no special formatting needed
  console.log('Returning original content');
  return content;
});

const displayText = ref('');
  
const wordCount = computed(() => {
  return displayText.value.trim() ? displayText.value.trim().split(/\s+/).length : 0;
});

const clearText = () => {
  displayText.value = '';
};

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(displayText.value);
    alert('Text copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy text:', err);
  }
};

const downloadText = () => {
  const element = document.createElement('a');
  const file = new Blob([displayText.value], {type: 'text/plain'});
  element.href = URL.createObjectURL(file);
  element.download = `${formattedTitle.value.replace(/\s+/g, '_')}_summary.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

// Animate the text display character by character
const animateText = () => {
  if (!formattedContent.value) {
    console.log('No content to animate');
    return;
  }
  
  console.log('Starting text animation for content length:', formattedContent.value.length);
  
  // Clear any previous animation to avoid doubling
  displayText.value = '';
  clearTimeout(window._textAnimationTimer);
  
  // Use direct assignment instead of character-by-character animation
  // This avoids the doubling issue while still showing the content
  displayText.value = formattedContent.value;
  
  /* 
  // Removed problematic character-by-character animation
  let index = 0;
  const text = formattedContent.value;
  
  const interval = setInterval(() => {
    if (index < text.length) {
      displayText.value += text[index++];
      // Avoid excessive logging by only logging at intervals
      if (index % 500 === 0) {
        console.log(`Animation progress: ${index}/${text.length} characters`);
      }
    } else {
      clearInterval(interval);
      console.log('Text animation completed');
    }
  }, 10); // Fast animation
  */
};

// Remove immediate:true from the watch to prevent double animation
watch(() => props.summaryData, () => {
  if (props.summaryData) {
    // Delay slightly to ensure we don't double-animate
    window._textAnimationTimer = setTimeout(() => {
      animateText();
    }, 100);
  }
}, { deep: true });

// Also ensure we only animate once on mount
onMounted(() => {
  // Only animate if not already done by watch
  if (props.summaryData && !displayText.value) {
    animateText();
  }
});

// Clean up any pending animations when component is unmounted
onUnmounted(() => {
  clearTimeout(window._textAnimationTimer);
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

.cursor-pointer {
  cursor: pointer;
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
