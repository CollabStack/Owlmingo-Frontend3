<template>
  <v-container>
    <!-- Header -->
    <h1 class="text-h4 font-weight-bold text-primary mb-3 outfit outfit-bold"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      AI Quiz Generator
    </h1>
    <p class="text-subtitle-1 text-grey-darken-1 mb-6 outfit outfit-regular"
       v-motion
       :initial="{ opacity: 0, y: 20 }"
       :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
      Upload a document, paste your notes, or select a video to automatically generate quizzes with AI.
    </p>

    <!-- Tabs and Options -->
    <v-row class="align-center"
           v-motion
           :initial="{ opacity: 0, y: 20 }"
           :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300 } }">
      <v-col cols="9">
        <v-btn-toggle 
          v-model="tab" 
          style="width: 50%; height: 50px;"  
          class="px-1 py-2 d-flex align-center justify-center rounded-xl custom-tab-group bg-water" 
          color="deep-purple-accent-3"
          group
        >
          <v-btn 
            style="width: 25%; height: 45px;"
            v-for="(option, index) in options" 
            :key="index" 
            :value="option.value" 
            class="custom-tab bg-none text-primary"
            :class="{ 'animated-tab': tab === option.value }"
            rounded="xl" 
            variant="text" 
            color="primary"
            v-motion
            :initial="{ opacity: 0, y: 10 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 100 * index, duration: 500 } }"
          >
            {{ option.label }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="3" class="d-flex justify-end">
        <v-btn 
          rounded="xl" 
          color="medium-emphasis" 
          min-width="92" 
          variant="outlined" 
          class="custom-btn text-none animated-btn outfit outfit-medium" 
          @click="sheet = true"
        >
          <span class="d-flex align-center">
            Options
            <v-icon class="ms-2 btn-icon">mdi-cog</v-icon>
          </span>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Bottom Sheet -->
    <v-bottom-sheet v-model="sheet" inset>
      <v-card class="text-center py-5 px-5" rounded="lg">
        <v-card-text class="d-flex justify-space-between align-center">
          <p class="text-h5 text-primary">Option</p>
          <v-icon color="primary" @click="sheet = false" class="clickable-icon">mdi-close</v-icon>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Select Option -->
        <v-container>
          <p class="text-primary text-h6 text-left">Question Type</p>
          <v-select
            clearable
            chips
            label="Multiple Choice"
            :items="['Multiple Choice', 'True/False', 'Open Ended']"
            class="my-3 animated-input"
          ></v-select>

          <p class="text-primary text-h6 text-left">Max Questions</p>
          <v-select
            clearable
            chips
            label="Auto"
            :items="['Auto', '5', '10']"
            class="my-3 animated-input"
          ></v-select>
        </v-container>
      </v-card>
    </v-bottom-sheet>

    <!-- Tab Content -->
    <v-window v-model="tab" class="mt-5">
      <!-- Document Upload -->
      <v-window-item value="document">
        <FileUploader
          icon="mdi-file-upload"
          placeholder="Drag a PDF or DOC file here"
          acceptedFileTypes="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          buttonText="Browse Files"
          buttonIcon="mdi-upload"
          :maxFileSize="20"
          fileTypeErrorMessage="Invalid file type! Only PDF and DOC files are allowed."
          @file-selected="handleFileSelected('document', $event)"
          @file-removed="handleFileRemoved('document')"
          @error="showSnackbar"
        />
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/" style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>

      <!-- Text Upload -->
      <v-window-item value="text">
        <div class="ma-4 pa-4" outlined
             v-motion
             :initial="{ opacity: 0, y: 20 }"
             :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
            <v-textarea
            clearable
            clear-icon="mdi-close-circle"
            label="Notes"
            placeholder="Start typing here..."
            hide-details="auto"
            class="clean-textarea"
            v-model="textContent"
            bg-color="white"
            rows="8"
            color="secondary"
            counter="4000"
            variant="outlined"
            >
            </v-textarea>
          <div class="button-container">
            <v-btn 
              color="royal_blue" 
              min-width="92" 
              variant="outlined" 
              class="custom-btn text-none animated-btn outfit outfit-medium" 
              @click="generateQuiz"
              :disabled="!textContent"
              rounded="xl"
            >
              <span class="d-flex align-center">
                Generate
                <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
              </span>
            </v-btn>
          </div>
          <p class="animated-link mt-4">Looking for flashcards instead? Try the <nuxt-link to="/" style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
        </div>
      </v-window-item>

      <!-- Image Upload -->
      <v-window-item value="image">
        <FileUploader
          icon="mdi-image"
          placeholder="Drag an image here to upload"
          acceptedFileTypes="image/*"
          buttonText="Browse Images"
          buttonIcon="mdi-image-search"
          :maxFileSize="10"
          fileTypeErrorMessage="Invalid file type! Only image files are allowed."
          @file-selected="handleFileSelected('image', $event)"
          @file-removed="handleFileRemoved('image')"
          @error="showSnackbar"
        />
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/" style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>

      <!-- Video Upload -->
      <v-window-item value="video">
        <FileUploader
          icon="mdi-video"
          placeholder="Drag a video file here to upload"
          acceptedFileTypes="video/*"
          buttonText="Browse Videos"
          buttonIcon="mdi-video-plus"
          :maxFileSize="100"
          fileTypeErrorMessage="Invalid file type! Only video files are allowed."
          @file-selected="handleFileSelected('video', $event)"
          @file-removed="handleFileRemoved('video')"
          @error="showSnackbar"
        />
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/" style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>
    </v-window>

    <!-- Loading Overlay -->
    <v-overlay
      :model-value="loading"
      class="align-center justify-center"
    >
      <v-card
        color="white"
        width="300"
        class="pa-4 rounded-xl text-center"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
        <p class="mt-4">Generating your quiz...</p>
      </v-card>
    </v-overlay>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" top>
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import FileUploader from '../common/FileUploader.vue';

const tab = ref('document'); // Default tab
const sheet = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref('');
const documentFile = ref(null);
const imageFile = ref(null);
const videoFile = ref(null);
const textContent = ref('');
const loading = ref(false);

const options = ref([
  { label: 'Document', value: 'document' },
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
]);

// Handle file selection from FileUploader component
const handleFileSelected = (type, file) => {
  if (type === 'document') {
    documentFile.value = file;
  } else if (type === 'image') {
    imageFile.value = file;
  } else if (type === 'video') {
    videoFile.value = file;
  }
};

// Handle file removal from FileUploader component
const handleFileRemoved = (type) => {
  if (type === 'document') {
    documentFile.value = null;
  } else if (type === 'image') {
    imageFile.value = null;
  } else if (type === 'video') {
    videoFile.value = null;
  }
};

// Show snackbar with custom message
const showSnackbar = (message) => {
  snackbarMessage.value = message;
  snackbar.value = true;
};

// Generate Quiz
const generateQuiz = () => {
  loading.value = true;
  
  // Simulate API call with timeout
  setTimeout(() => {
    loading.value = false;
    showSnackbar('Quiz generated successfully!');
  }, 2000);
};
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

/* Style for active button */
.v-btn-toggle .v-btn--active {
  background-color: #9D7BFC !important; 
  color: white !important;
  transform: scale(1.05);
  transition: all 0.3s ease;
}

/* Animated button */
.animated-btn {
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
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon {
  transform: translateX(5px);
}

/* Tab animation */
.animated-tab {
  position: relative;
}

.animated-tab::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background-color: var(--v-primary-base);
  transition: width 0.3s ease;
}

.animated-tab:hover::after {
  width: 80%;
}

/* Link animation */
.animated-link {
  transition: all 0.3s ease;
}

.animated-link:hover {
  color: var(--v-primary-base);
}

/* Clickable icon animation */
.clickable-icon {
  transition: all 0.3s ease;
}

.clickable-icon:hover {
  transform: rotate(90deg);
  cursor: pointer;
}

/* Custom textarea styling */
.custom-textarea {
  transition: all 0.3s ease;
  background-color: white !important;
}

.custom-textarea:focus-within {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  background-color: white !important;
}

/* Deep selector to target the internal vuetify textarea elements */
:deep(.v-field__input) {
  background-color: white !important;
}

:deep(.v-field) {
  background-color: white !important;
}

/* Improved textarea styling */
.custom-textarea {
  transition: all 0.3s ease;
  background-color: white !important;
  border-radius: 12px !important;
  overflow: hidden;
}

.custom-textarea:focus-within {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  background-color: white !important;
  border-color: var(--v-secondary-base) !important;
}

/* Clean textarea specific styles */
.clean-textarea {
  font-family: 'Outfit', sans-serif !important;
}

/* Deep selector to target the internal vuetify textarea elements */
:deep(.v-field__input) {
  background-color: white !important;
  font-family: 'Outfit', sans-serif !important;
  padding: 12px !important;
}

:deep(.v-field) {
  background-color: white !important;
  border-radius: 12px !important;
  box-shadow: none !important;
  border: 1px solid #e0e0e0 !important;
}

:deep(.v-field:hover) {
  border-color: #9D7BFC !important;
}

:deep(.v-field__outline) {
  opacity: 0 !important;
}

:deep(.v-field--focused) {
  border-color: #9D7BFC !important;
}

:deep(.v-label) {
  font-family: 'Outfit', sans-serif !important;
  font-size: 1rem !important;
  opacity: 0.8;
}

/* Override line height for better text stacking */
:deep(.v-field__input textarea) {
  line-height: 1.6 !important;
  white-space: pre-wrap !important;
  padding: 0 !important;
}

/* Fix textarea scrolling */
:deep(.v-textarea .v-field__input) {
  overflow-y: auto;
  scrollbar-width: thin;
}

/* Enhance scrollbar appearance */
:deep(.v-textarea .v-field__input::-webkit-scrollbar) {
  width: 6px;
}

:deep(.v-textarea .v-field__input::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 10px;
}

:deep(.v-textarea .v-field__input::-webkit-scrollbar-thumb) {
  background: #9D7BFC;
  border-radius: 10px;
}

/* Custom textarea styling - specific to this component */
.custom-textarea {
  margin-bottom: 12px;
}

.custom-textarea:focus-within {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(157, 123, 252, 0.15);
}

/* Textarea icon animation */
.textarea-icon {
  transition: all 0.3s ease;
}

:deep(.v-field--focused) .textarea-icon {
  transform: scale(1.1);
  color: var(--v-secondary-base) !important;
}

/* Clear icon styling */
:deep(.v-field__clearable) {
  padding-top: 8px;
}

:deep(.v-field__clearable .v-icon) {
  color: #aaa;
  transition: all 0.2s ease;
}

:deep(.v-field__clearable .v-icon:hover) {
  color: var(--v-error-base, #DF3131);
  transform: scale(1.2);
}

/* Remove duplicate styles and keep only component-specific overrides */
:deep(.v-field--focused) {
  border-color: var(--v-secondary-base, #9D7BFC) !important;
  border-width: 2px !important;
}

/* Additional styles for better text readability */
:deep(.v-field__input textarea) {
  color: #333 !important;
  font-size: 1.05rem !important;
  letter-spacing: 0.3px !important;
  line-height: 1.8 !important;
}

/* Custom textarea styling for this component */
.custom-textarea {
  transition: all 0.3s ease;
  background-color: white !important;
  border-radius: 12px !important;
  margin-bottom: 12px;
}

/* Remove shadow effects */
.custom-textarea:focus-within {
  transform: none;
  box-shadow: none;
}

/* Icon position fix */
.textarea-icon {
  transition: all 0.3s ease;
}

:deep(.v-field--focused) .textarea-icon {
  color: var(--v-secondary-base) !important;
}

/* Clear icon fix */
:deep(.v-field__clearable) {
  padding-top: 22px;
}

/* Fix spacing for the content itself */
:deep(.v-field__input) {
  padding-top: 22px !important;
}

/* Override focused effect */
:deep(.v-field--focused) {
  border-color: var(--v-secondary-base, #9D7BFC) !important;
  border-width: 2px !important;
  box-shadow: none !important;
}

/* Add padding for clear text icon */
:deep(.v-field__append-inner) {
  padding-top: 22px !important;
}

/* Button positioning */
.button-container {
  margin-top: 8px;
  display: flex;
  justify-content: flex-start;
}

/* Update the clean-textarea margin */
:deep(.clean-textarea) {
  margin-bottom: 0 !important;
}
</style>
