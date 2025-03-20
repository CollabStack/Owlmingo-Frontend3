<template>
  <v-container>
    <!-- Header -->
    <h1 class="text-h4 font-weight-bold text-primary mb-3 outfit outfit-bold" v-motion :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      AI Summary Generator
    </h1>
    <p class="text-subtitle-1 text-grey-darken-1 mb-6 outfit outfit-regular" v-motion :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
      Upload a document, paste your notes, or select a video to automatically generate summaries with AI.
    </p>

    <!-- Tabs and Options -->
    <v-row class="align-center" v-motion :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300 } }">
      <v-col cols="9">
        <v-btn-toggle v-model="tab" style="width: 50%; height: 50px;"
          class="px-1 py-2 d-flex align-center justify-center rounded-xl custom-tab-group bg-water"
          color="deep-purple-accent-3" group>
          <v-btn style="width: 25%; height: 45px;" v-for="(option, index) in options" :key="index" :value="option.value"
            class="custom-tab bg-none text-primary" :class="{ 'animated-tab': tab === option.value }" rounded="xl"
            variant="text" color="primary" v-motion :initial="{ opacity: 0, y: 10 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 100 * index, duration: 500 } }">
            {{ option.label }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="3" class="d-flex justify-end">
        <v-btn rounded="xl" color="medium-emphasis" min-width="92" variant="outlined"
          class="custom-btn text-none animated-btn outfit outfit-medium" @click="sheet = true">
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
          <v-select clearable chips label="Multiple Choice" :items="['Multiple Choice', 'True/False', 'Open Ended']"
            class="my-3 animated-input"></v-select>

          <p class="text-primary text-h6 text-left">Max Questions</p>
          <v-select clearable chips label="Auto" :items="['Auto', '5', '10']" class="my-3 animated-input"></v-select>
        </v-container>
      </v-card>
    </v-bottom-sheet>

    <!-- Tab Content -->
    <v-window v-model="tab" class="mt-5">
      <!-- Document Upload -->
      <v-window-item value="document">
        <FileUploader icon="mdi-file-upload" placeholder="Drag a PDF or DOC file here"
          acceptedFileTypes="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          buttonText="Browse Files" buttonIcon="mdi-upload" :maxFileSize="20"
          fileTypeErrorMessage="Invalid file type! Only PDF and DOC files are allowed."
          @file-selected="handleFileSelected('document', $event)" @file-removed="handleFileRemoved('document')"
          @error="showSnackbar" />
        
        <!-- PDF page selector component with ref -->
        <PdfPageSelector
          ref="pdfSelector"
          v-if="documentFile && isPdfFile"
          :file="documentFile"
          :total-pages="totalPages"
          :file-name="documentFile.name"
          v-model:selection-mode="selectionMode"
          v-model:page-selection="pageSelection"
          v-model:selected-pages="selectedPages"
        />
        
        <div class="button-container" style="margin: 12px 0;">
          <v-btn color="royal_blue" min-width="92" variant="outlined"
            class="custom-btn text-none animated-btn outfit outfit-medium" 
            @click="generateSummary"
            :disabled="!documentFile || (isPdfFile && selectedPages.size === 0)" 
            rounded="xl">
            <span class="d-flex align-center">
              Generate
              <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
            </span>
          </v-btn>
        </div>
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/"
            style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>

      <!-- Text Upload -->
      <v-window-item value="text">
        <div class="ma-4 pa-4" outlined v-motion :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
          <v-textarea clearable clear-icon="mdi-close-circle" label="Notes" placeholder="Paste your study notes here..."
            hide-details="auto" class="clean-textarea" v-model="textContent" bg-color="white" rows="8" color="secondary"
            counter="4000" variant="plain">
          </v-textarea>
          <div class="button-container">
            <v-btn color="royal_blue" min-width="92" variant="outlined"
              class="custom-btn text-none animated-btn outfit outfit-medium" @click="generateSummary"
              :disabled="!textContent" rounded="xl">
              <span class="d-flex align-center">
                Generate
                <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
              </span>
            </v-btn>
          </div>
          <p class="animated-link mt-4">Looking for flashcards instead? Try the <nuxt-link to="/"
              style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
        </div>
      </v-window-item>

      <!-- Image Upload -->
      <v-window-item value="image">
        <FileUploader icon="mdi-image" placeholder="Drag an image here to upload" acceptedFileTypes="image/*"
          buttonText="Browse Images" buttonIcon="mdi-image-search" :maxFileSize="10"
          fileTypeErrorMessage="Invalid file type! Only image files are allowed."
          @file-selected="handleFileSelected('image', $event)" @file-removed="handleFileRemoved('image')"
          @error="showSnackbar" />
        <div class="button-container" style="margin: 12px 0;">
          <v-btn color="royal_blue" min-width="92" variant="outlined"
            class="custom-btn text-none animated-btn outfit outfit-medium" 
            @click="generateSummary"
            :disabled="!imageFile" 
            rounded="xl">
            <span class="d-flex align-center">
              Generate
              <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
            </span>
          </v-btn>
        </div>
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/"
            style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>

      <!-- Link Upload -->
      <v-window-item value="link">
        <div class="ma-4 pa-4" outlined v-motion :initial="{ opacity: 0, y: 20 }"
          :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
          <v-textarea clearable clear-icon="mdi-close-circle" label="Notes" placeholder="Paste your link here..."
            hide-details="auto" class="clean-textarea" v-model="textContent" bg-color="white" rows="8" color="secondary"
            counter="4000" variant="plain">
          </v-textarea>
          <div class="button-container">
            <v-btn color="royal_blue" min-width="92" variant="outlined"
              class="custom-btn text-none animated-btn outfit outfit-medium" @click="generateSummary"
              :disabled="!textContent" rounded="xl">
              <span class="d-flex align-center">
                Generate
                <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
              </span>
            </v-btn>
          </div>
          <p class="animated-link mt-4">Looking for flashcards instead? Try the <nuxt-link to="/"
              style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
        </div>
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
        <div class="button-container">
          <v-btn color="royal_blue" min-width="92" variant="outlined"
            class="custom-btn text-none animated-btn outfit outfit-medium" 
            @click="generateSummary"
            :disabled="!videoFile" 
            rounded="xl">
            <span class="d-flex align-center">
              Generate
              <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
            </span>
          </v-btn>
        </div>
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/"
            style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>
    </v-window>

    <!-- Loading Overlay -->
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-card color="white" width="300" class="pa-4 rounded-xl text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        <p class="mt-4">Generating your summary...</p>
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
import { ref, computed, watch, onMounted } from 'vue';
import FileUploader from '../common/FileUploader.vue';
import PdfPageSelector from './PdfPageSelector.vue';
import { useRouter } from 'vue-router';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { processFile } from '~/services/ocrService';
import Swal from 'sweetalert2'; // Add this if not already imported
import { userAuth } from '~/store/userAuth';

// Set PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Initialize auth and router
const router = useRouter();
const authStore = userAuth();

// Initialize auth on mounted with better error handling
onMounted(async () => {
  try {
    // Ensure auth is initialized
    authStore.init();
    
    // Check token validity silently, don't redirect here
    const isValid = await authStore.checkTokenExpired();
    if (!isValid) {
      console.warn('Token validation failed in component');
      // Don't redirect - let middleware handle it
    }
  } catch (error) {
    console.error('Auth initialization error:', error);
  }
});

// Use a more reliable auth check without redirects
const isAuthenticated = computed(() => {
  return authStore.isLoggedIn && !!authStore.getToken();
});

const pdfSelector = ref(null); // Add this line to create the ref
const tab = ref('document');
const sheet = ref(false);
const snackbar = ref(false);
const snackbarMessage = ref('');
const documentFile = ref(null);
const imageFile = ref(null);
const videoFile = ref(null);
const textContent = ref('');
const loading = ref(false);
const totalPages = ref(0);
const pageSelection = ref('');
const selectionMode = ref('text');
const selectedPages = ref(new Set());
const pdfDocRef = ref(null);

const options = ref([
  { label: 'Document', value: 'document' },
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
  { label: 'Link', value: 'link' },
]);

// Check if file is PDF
const isPdfFile = computed(() => {
  return documentFile.value && 
    (documentFile.value.type === 'application/pdf' || 
     documentFile.value.name.toLowerCase().endsWith('.pdf'));
});

// File selection handler
const handleFileSelected = async (type, file) => {
  if (type === 'document') {
    // Clean up any previous file data first
    totalPages.value = 0;
    pageSelection.value = '';
    selectedPages.value = new Set();
    pdfDocRef.value = null;
    
    // Set the new file after a small delay to ensure clean state
    setTimeout(() => {
      documentFile.value = file;
      
      if (isPdfFile.value) {
        processPdfFile(file);
      }
    }, 50);
  } else if (type === 'image') {
    imageFile.value = file;
  } else if (type === 'video') {
    videoFile.value = file;
  }
};

// Extract PDF processing logic to a separate function
const processPdfFile = async (file) => {
  try {
    console.log('Processing PDF file:', file.name);
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    
    const pages = pdfDoc.getPageCount();
    console.log(`PDF has ${pages} pages`);
    totalPages.value = pages;
    
    // Select all pages by default
    selectedPages.value = new Set();
    for (let i = 1; i <= pages; i++) {
      selectedPages.value.add(i);
    }
    pageSelection.value = pages > 1 ? `1-${pages}` : '1';
    
    // Store PDF document for later use
    pdfDocRef.value = pdfDoc;
  } catch (error) {
    console.error('Error loading PDF:', error);
    showSnackbar('Error reading PDF file');
    
    // Reset on error
    documentFile.value = null;
    totalPages.value = 0;
  }
};

// Handle file removal with proper cleanup
const handleFileRemoved = (type) => {
  if (type === 'document') {
    documentFile.value = null;
    totalPages.value = 0;
    pageSelection.value = '';
    selectedPages.value = new Set();
    pdfDocRef.value = null;
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

// Add auth check function
const checkAuth = () => {
  if (!authStore.isLoggedIn) {
    Swal.fire({
      title: 'Authentication Required',
      text: 'You need to login or sign up to generate summaries',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Login',
      cancelButtonText: 'Sign Up'
    }).then((result) => {
      if (result.isConfirmed) {
        // User chose to login
        router.push('/auth');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // User chose to sign up
        router.push('/auth/sign-up');
      }
    });
    return false;
  }
  return true;
};

// Generate Summary with better auth handling
const generateSummary = async () => {
  if (!isAuthenticated.value) {
    Swal.fire({
      title: 'Authentication Required',
      text: 'Please log in to continue',
      icon: 'warning',
      showConfirmButton: true
    }).then(() => {
      router.push('/auth');
    });
    return;
  }

  try {
    loading.value = true;

    // Get fresh token before API request
    const isValid = await authStore.checkTokenExpired();
    if (!isValid) {
      throw new Error('Authentication expired');
    }

    // Proceed with file processing...
    if (isPdfFile.value && pdfSelector.value) {
      const mergedPdfBlob = await pdfSelector.value.getMergedPdf();
      if (mergedPdfBlob) {
        const response = await processFile(mergedPdfBlob);
        if (response.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Summary generated successfully',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(response.message || 'Failed to generate summary');
        }
      }
    } else if (imageFile.value) {
      const response = await processFile(imageFile.value);
      // ...rest of existing image handling...
    } else if (textContent.value) {
      // ...rest of existing text handling...
    }

  } catch (error) {
    console.error('Error generating summary:', error);
    
    if (error.message?.includes('Authentication')) {
      authStore.logout();
      router.push('/auth');
      return;
    }

    Swal.fire({
      icon: 'error', 
      title: 'Error',
      text: error.message || 'Failed to generate summary'
    });
  } finally {
    loading.value = false;
  }
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

.outfit-regular {
  font-weight: 400;
}

.outfit-medium {
  font-weight: 500;
}

.outfit-bold {
  font-weight: 700;
}

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
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
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

/* Button positioning */
.button-container {
  margin-top: 8px;
  display: flex;
  justify-content: flex-start;
}

/* Remove any conflicting textarea styles */
:deep(.v-field--focused),
:deep(.v-field--active) {
  box-shadow: none !important;
  transform: none !important;
}
</style>
