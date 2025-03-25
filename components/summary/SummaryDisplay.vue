<template>
  <v-container class="summary-container">
    <div class="header-section" 
      v-motion
      :initial="{ opacity: 0, y: -15 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }">
      <div class="d-flex align-center mb-5">
        <v-btn 
          icon 
          variant="outlined"
          color="primary"
          @click="$emit('back')" 
          class="mr-3 back-btn elevation-1"
          size="small"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h1 class="text-h4 font-weight-bold mb-0 outfit outfit-bold gradient-text">
          {{ formattedTitle }}
        </h1>
      </div>
  
      <div class="text-section mb-8">
        <span class="summary-chip">
          <v-icon size="small" class="mr-1">mdi-check-circle</v-icon>
          Summary Complete
        </span>
        <p class="text-body-1 text-center text-grey-darken-1 mt-3 outfit outfit-regular">
          Here's your summarized content. You can edit, copy, or download it using the tools below.
        </p>
      </div>
    </div>

    <v-card 
      class="summary-card mb-6"
      elevation="3"
      v-motion
      :initial="{ opacity: 0, y: 40 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 400 } }">
      <v-card-item class="summary-header pa-4">
        <div class="d-flex align-center justify-space-between">
          <span class="text-subtitle-1 outfit outfit-medium">Summarized Content</span>
          <div class="d-flex align-center">
            <div v-if="isTyping" class="typing-indicator me-3">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div class="word-count">
              <v-icon size="small" color="primary" class="mr-1">mdi-text-box-outline</v-icon>
              <span class="text-body-2 outfit outfit-medium">{{ wordCount }} Words</span>
            </div>
          </div>
        </div>
      </v-card-item>
      
      <v-divider></v-divider>
      
      <v-row class="pa-0 ma-0">
        <v-col cols="12" class="pa-0">
          <div class="textarea-container">
            <v-textarea   
              v-model="displayText"
              hide-details
              bg-color="white" 
              rows="12"
              auto-grow
              color="secondary"
              counter="4000" 
              variant="plain"
              class="summary-textarea px-6"
              :class="{ 'content-loaded': displayText }">
            </v-textarea>
            <!-- Removing the cursor element -->
          </div>
        </v-col>
      </v-row>
  
      <v-divider></v-divider>
      
      <v-card-actions class="pa-4">
        <v-row class="ma-0 pa-0">
          <v-col cols="12" class="d-flex justify-end pa-0">
            <v-btn 
              prepend-icon="mdi-delete" 
              variant="text" 
              class="action-btn mr-2 animated-btn" 
              color="error" 
              @click="clearText"
              size="small"
              rounded
            >
              Clear
            </v-btn>
            
            <v-btn 
              prepend-icon="mdi-content-copy" 
              variant="text" 
              class="action-btn mr-2 animated-btn" 
              color="info" 
              @click="copyText"
              size="small"
              rounded
            >
              Copy
            </v-btn>
            
            <v-btn 
              prepend-icon="mdi-download" 
              variant="tonal" 
              class="action-btn animated-btn" 
              color="primary" 
              @click="downloadText"
              size="small"
              rounded
            >
              Download
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>

    <v-snackbar
      v-model="showCopyToast"
      timeout="2000"
      color="success"
      location="top"
      rounded="pill"
      class="copy-toast"
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2">mdi-check-circle</v-icon>
        Copied to clipboard!
      </div>
    </v-snackbar>
  </v-container>
</template>
  
<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';

// Create a global object to track animated summaries (persists between component remounts)
if (!window._animatedSummaries) {
  window._animatedSummaries = new Set();
}

const props = defineProps({
  summaryData: {
    type: Object,
    required: true
  },
  disableAnimation: {
    type: Boolean,
    default: false
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

// Create a unique identifier for this summary
const summaryId = computed(() => {
  if (!props.summaryData) return '';
  // Create a hash from the content or title to uniquely identify this summary
  const content = props.summaryData.content || '';
  const title = props.summaryData.title || '';
  return `summary_${content.length}_${title.length}_${content.substring(0, 50)}`;
});

// Check if this summary has already been animated
const hasBeenAnimated = computed(() => {
  return window._animatedSummaries.has(summaryId.value);
});

const displayText = ref('');
const isTyping = ref(false);
const isMobile = ref(false);
const showCopyToast = ref(false); // Add ref for copy toast

// Computed property to count words in the text
const wordCount = computed(() => {
  if (!displayText.value) return 0;
  return displayText.value.trim().split(/\s+/).filter(Boolean).length;
});

// Function to clear the text
const clearText = () => {
  displayText.value = '';
};

// Function to copy text to clipboard
const copyText = async () => {
  if (!displayText.value) return;
  
  try {
    await navigator.clipboard.writeText(displayText.value);
    showCopyToast.value = true;
  } catch (error) {
    console.error('Failed to copy text:', error);
  }
};

// Function to download text as a file
const downloadText = () => {
  if (!displayText.value) return;
  
  const filename = `${formattedTitle.value.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_summary.txt`;
  const blob = new Blob([displayText.value], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

// Enhanced character-by-character typing animation with adaptive speed
const animateText = () => {
  if (!formattedContent.value) {
    console.log('No content to animate');
    return;
  }
  
  // Skip animation if this summary has already been animated OR if animation is disabled
  if (hasBeenAnimated.value || props.disableAnimation) {
    console.log('Skipping animation - already animated or animation disabled');
    displayText.value = formattedContent.value;
    isTyping.value = false;
    return;
  }
  
  console.log('Starting text animation for content length:', formattedContent.value.length);
  
  // Clear any previous animation to avoid doubling
  displayText.value = '';
  clearTimeout(window._textAnimationTimer);
  isTyping.value = true;
  
  const text = formattedContent.value;
  let currentIndex = 0;
  
  // Determine if text is "long" or "short"
  const textLength = text.length;
  const isLongText = textLength > 1000; // Threshold for "long" text
  
  console.log(`Text length: ${textLength}, treating as: ${isLongText ? 'long' : 'short'} text`);
  
  // For very long texts, show content in batch mode instead of character by character
  if (textLength > 5000) {
    // Quick batch animation for extremely long content
    const batchSize = Math.floor(textLength / 20); // Show in ~20 steps
    let position = 0;
    
    const animateBatch = () => {
      if (position < textLength) {
        const nextBatch = Math.min(position + batchSize, textLength);
        displayText.value = text.substring(0, nextBatch);
        position = nextBatch;
        
        const delay = 50; // Fast but visible steps
        window._textAnimationTimer = setTimeout(animateBatch, delay);
      } else {
        isTyping.value = false;
        // Mark as animated once complete
        window._animatedSummaries.add(summaryId.value);
      }
    };
    
    animateBatch();
    return;
  }
  
  const animateNextChar = () => {
    if (currentIndex < text.length) {
      const char = text[currentIndex];
      displayText.value += char;
      currentIndex++;
      
      // Calculate delay based on character context and text length
      const delay = calculateCharDelay(text, currentIndex, isLongText);
      
      window._textAnimationTimer = setTimeout(animateNextChar, delay);
    } else {
      isTyping.value = false;
      // Mark as animated once complete
      window._animatedSummaries.add(summaryId.value);
    }
  };
  
  // Start the animation
  animateNextChar();
};

// Calculate delay based on character context and text length
const calculateCharDelay = (text, position, isLongText) => {
  const currentChar = text[position - 1];
  const nextChar = text[position];
  
  // Speed multiplier based on text length
  const speedFactor = isLongText ? 0.3 : 1.0; // Long text is 3-4x faster
  
  // Long pause after sentence endings
  if (/[.!?]/.test(currentChar) && (!nextChar || /\s/.test(nextChar))) {
    return (Math.random() * 300 + 400) * speedFactor; // 400-700ms for normal, ~120-210ms for long
  } 
  // Medium pause after commas and semicolons
  else if (/[,;:]/.test(currentChar)) {
    return (Math.random() * 100 + 200) * speedFactor; // 200-300ms for normal, ~60-90ms for long
  }
  // Pause at line breaks
  else if (currentChar === '\n') {
    return (Math.random() * 100 + 150) * speedFactor; // 150-250ms for normal, ~45-75ms for long
  }
  // Brief pause after spaces (end of words)
  else if (currentChar === ' ') {
    return (Math.random() * 40 + 60) * speedFactor; // 60-100ms for normal, ~18-30ms for long
  }
  // Very short delay for normal characters
  else {
    return (Math.random() * 15 + 20) * speedFactor; // 20-35ms for normal, ~6-10ms for long
  }
};

// Check if device is mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
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
  // Check mobile state
  checkMobile();
  window.addEventListener('resize', checkMobile);
  
  // Only animate if not already done by watch
  if (props.summaryData && !displayText.value) {
    // Set the text immediately if already animated or animation is disabled
    if (hasBeenAnimated.value || props.disableAnimation) {
      displayText.value = formattedContent.value;
    } else {
      animateText();
    }
  }
});

// Clean up any pending animations when component is unmounted
onUnmounted(() => {
  clearTimeout(window._textAnimationTimer);
  window.removeEventListener('resize', checkMobile);
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

.outfit-medium {
  font-weight: 500;
}

.outfit-bold {
  font-weight: 700;
}

/* Container styling */
.summary-container {
  max-width: 1500px; /* Increased from 900px */
  margin: 0 auto;
  padding-top: 20px;
  width: 100%;
}

/* Header section */
.header-section {
  text-align: center;
  margin-bottom: 2rem;
}

/* Gradient text for title - aligned with other components */
.gradient-text {
  background: linear-gradient(90deg, #7b83e0, #9D7BFC);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.05);
}

/* Summary chip */
.summary-chip {
  display: inline-flex;
  align-items: center;
  background: linear-gradient(90deg, #7b83e0 0%, #9D7BFC 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 12px rgba(157, 123, 252, 0.3);
}

/* Text section */
.text-section {
  max-width: 700px;
  margin: 0 auto;
}

/* Summary card styling */
.summary-card {
  border-radius: 16px;
  overflow: hidden;
  border: none;
  background-color: white;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.summary-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-3px);
}

.summary-header {
  background-color: #f8f9ff;
}

/* Back button animation */
.back-btn {
  transition: transform 0.3s ease;
}

.back-btn:hover {
  transform: translateX(-3px);
}

/* Textarea container for cursor effect */
.textarea-container {
  position: relative;
}

/* Textarea styling */
.summary-textarea {
  font-family: 'Outfit', sans-serif !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
  transition: all 0.3s ease;
  border: none !important;
}

.summary-textarea >>> textarea {
  padding: 24px !important; /* Increased padding */
  letter-spacing: 0.2px;
}

.content-loaded {
  background-color: white;
}

/* Removing cursor blink effect styles */

/* Typing indicator */
.typing-indicator {
  display: inline-flex;
  align-items: center;
}

.typing-indicator span {
  height: 6px;
  width: 6px;
  margin: 0 1px;
  background-color: #9D7BFC;
  display: block;
  border-radius: 50%;
  opacity: 0.4;
}

.typing-indicator span:nth-of-type(1) {
  animation: bounce 1s infinite 0.1s;
}
.typing-indicator span:nth-of-type(2) {
  animation: bounce 1s infinite 0.2s;
}
.typing-indicator span:nth-of-type(3) {
  animation: bounce 1s infinite 0.3s;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

/* Word count styling */
.word-count {
  display: flex;
  align-items: center;
  padding: 5px 12px;
  background-color: rgba(123, 131, 224, 0.1);
  border-radius: 20px;
  display: inline-flex;
}

/* Action buttons - made consistent with other components */
.action-btn {
  font-weight: 500;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}

.action-btn:hover::before {
  left: 100%;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Copy toast */
.copy-toast {
  font-family: 'Outfit', sans-serif !important;
}

/* Animation for pulse */
.pulse-animation {
  display: inline-block;
  animation: pulse 2s infinite;
  color: #9D7BFC;
  font-weight: 600;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Add responsive styling for smaller screens */
@media (max-width: 960px) {
  .summary-container {
    max-width: 95%;
  }
}
</style>
