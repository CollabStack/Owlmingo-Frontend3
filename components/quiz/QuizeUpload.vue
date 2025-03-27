<template>
  <v-container>
    <!-- Header -->
    <h1 class="text-h4 font-weight-bold text-primary mb-3 outfit outfit-bold" v-motion :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      AI Quiz Generator
    </h1>
    <p class="text-subtitle-1 text-grey-darken-1 mb-6 outfit outfit-regular" v-motion :initial="{ opacity: 0, y: 20 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
      Upload a document, paste your notes, or provide a link to automatically generate quizzes with AI.
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
          <p class="text-h5 text-primary">Quiz Options</p>
          <v-icon color="primary" @click="sheet = false" class="clickable-icon">mdi-close</v-icon>
        </v-card-text>

        <v-divider></v-divider>

        <!-- Select Option -->
        <v-container>
          <p class="text-primary text-h6 text-left">Quiz Type</p>
          <v-select clearable chips label="Multiple Choice" 
            :items="['Multiple Choice', 'True/False', 'Fill in the Blank', 'Mixed']"
            class="my-3 animated-input"></v-select>

          <p class="text-primary text-h6 text-left">Number of Questions</p>
          <v-select clearable chips label="Auto" :items="['Auto', '5', '10', '15', '20']" class="my-3 animated-input"></v-select>
          
          <p class="text-primary text-h6 text-left">Difficulty Level</p>
          <v-select clearable chips label="Medium" :items="['Easy', 'Medium', 'Hard', 'Mixed']" class="my-3 animated-input"></v-select>
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
          
        <!-- PDF Page Selector (Only show if PDF file is selected) -->
        <PdfPageSelector
          ref="pdfSelector"
          v-if="documentFile && isPdfFile"
          :file="documentFile"
          :total-pages="totalPages"
          :file-name="documentFile?.name"
          v-model:selection-mode="selectionMode"
          v-model:page-selection="pageSelection"
          v-model:selected-pages="selectedPages"
        />
        
        <div class="button-container" style="margin: 12px 0;">
          <v-btn color="royal_blue" min-width="92" variant="outlined"
            class="custom-btn text-none animated-btn outfit outfit-medium" 
            @click="handleGenerateQuiz"
            :disabled="!documentFile || (isPdfFile && selectedPages.size === 0)" 
            rounded="xl">
            <span class="d-flex align-center">
              Generate Quiz
              <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
            </span>
          </v-btn>
        </div>
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/flashcard"
            style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>

      <!-- Text Input -->
      <v-window-item value="text">
        <v-textarea v-model="textContent" placeholder="Paste or type your text here..." rows="10" 
          class="custom-textarea clean-textarea rounded-xl" variant="outlined" color="primary">
          <template v-slot:prepend-inner>
            <v-icon class="textarea-icon ms-1 mt-1">mdi-text</v-icon>
          </template>
        </v-textarea>
        
        <div class="button-container">
          <v-btn color="royal_blue" min-width="92" variant="outlined"
            class="custom-btn text-none animated-btn outfit outfit-medium" 
            @click="handleGenerateQuiz"
            :disabled="!textContent" 
            rounded="xl">
            <span class="d-flex align-center">
              Generate Quiz
              <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
            </span>
          </v-btn>
        </div>
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/flashcard"
            style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>

      <!-- Image Upload -->
      <v-window-item value="image">
        <FileUploader icon="mdi-image" placeholder="Drag an image here"
          acceptedFileTypes="image/jpeg,image/png,image/jpg,image/webp"
          buttonText="Browse Images" buttonIcon="mdi-upload" :maxFileSize="10"
          fileTypeErrorMessage="Invalid file type! Only JPG, PNG and WEBP images are allowed."
          @file-selected="handleFileSelected('image', $event)" @file-removed="handleFileRemoved('image')"
          @error="showSnackbar" />
          
        <div class="button-container" style="margin: 12px 0;">
          <v-btn color="royal_blue" min-width="92" variant="outlined"
            class="custom-btn text-none animated-btn outfit outfit-medium" 
            @click="handleGenerateQuiz"
            :disabled="!imageFile" 
            rounded="xl">
            <span class="d-flex align-center">
              Generate Quiz
              <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
            </span>
          </v-btn>
        </div>
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/flashcard"
            style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>

      <!-- Link Input -->
      <v-window-item value="link">
        <v-textarea v-model="textContent" placeholder="Enter a URL here..." rows="1" 
          class="custom-textarea clean-textarea rounded-xl" variant="outlined" color="primary">
          <template v-slot:prepend-inner>
            <v-icon class="textarea-icon ms-1 mt-1">mdi-link</v-icon>
          </template>
        </v-textarea>
        
        <div class="button-container">
          <v-btn color="royal_blue" min-width="92" variant="outlined"
            class="custom-btn text-none animated-btn outfit outfit-medium" 
            @click="handleGenerateQuiz"
            :disabled="!textContent" 
            rounded="xl">
            <span class="d-flex align-center">
              Generate Quiz
              <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
            </span>
          </v-btn>
        </div>
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/flashcard"
            style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item>

      <!-- Video Upload -->
      <!-- <v-window-item value="video">
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
        <div class="button-container" style="margin: 12px 0;">
          <v-btn color="royal_blue" min-width="92" variant="outlined"
            class="custom-btn text-none animated-btn outfit outfit-medium" 
            @click="generateSumary"
            :disabled="!videoFile" 
            rounded="xl">
            <span class="d-flex align-center">
              Generate Quiz
              <v-icon class="ms-2 btn-icon">mdi-lightning-bolt</v-icon>
            </span>
          </v-btn>
        </div>
        <p class="mt-2 animated-link">Looking for flashcards instead? Try the <nuxt-link to="/flashcard"
            style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
      </v-window-item> -->
    </v-window>

    <!-- Loading Overlay -->
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-card color="white" width="300" class="pa-4 rounded-xl text-center">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
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
import { ref, computed, watch, onMounted } from 'vue';
import FileUploader from '../common/FileUploader.vue';
import PdfPageSelector from '../summary/PdfPageSelector.vue';
import { useRouter } from 'vue-router';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { userAuth } from '~/store/userAuth';
import { generateQuiz, useQuizState } from '~/services/quizService';

// Get quiz state from the service
const { isLoading, quizData, showQuizDisplay } = useQuizState();

// Set PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Initialize auth and router
const router = useRouter();
const authStore = userAuth();
const loading = isLoading; // Use the shared loading state

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

// Generate Quiz function using the quizService
const handleGenerateQuiz = async () => {
  try {
    if (!isAuthenticated.value) {
      console.log("User not authenticated, authentication will be handled by the service");
    }
    
    if (documentFile.value) {
      console.log(`Processing document file: ${documentFile.value.name}, type: ${documentFile.value.type}`);
      
      if (isPdfFile.value && pdfSelector.value) {
        console.log("Processing as PDF with page selection");
        const mergedPdfBlob = await pdfSelector.value.getMergedPdf();
        if (mergedPdfBlob) {
          console.log(`Got merged PDF blob, size: ${mergedPdfBlob.size} bytes`);
          await generateQuiz({ documentBlob: mergedPdfBlob });
        } else {
          showSnackbar('Failed to prepare PDF for processing');
        }
      } else {
        console.log("Processing as non-PDF document");
        await generateQuiz({ documentBlob: documentFile.value });
      }
    } else if (imageFile.value) {
      console.log(`Processing image file: ${imageFile.value.name}, type: ${imageFile.value.type}`);
      await generateQuiz({ imageFile: imageFile.value });
    } else if (textContent.value.trim()) {
      // Process text content directly
      console.log("Processing text content, length:", textContent.value.length);
      await processTextAndGenerateQuiz(textContent.value);
    } else {
      showSnackbar('Please provide content to generate a quiz');
    }
  } catch (error) {
    console.error('Error in handleGenerateQuiz:', error);
    showSnackbar(error.message || 'Failed to process your request');
  }
};

// New function to process text and generate quiz
const processTextAndGenerateQuiz = async (text) => {
  const authStore = userAuth();
  
  // Get fresh token before API request
  const isValid = await authStore.checkTokenExpired();
  if (!isValid) {
    throw new Error('Authentication expired');
  }
  
  let token = authStore.getToken();
  if (!token) {
    throw new Error('Authentication required');
  }
  
  // Process text directly using the text processing endpoint
  // Fixed URL path to include 'user' in the path structure
  const processTextUrl = 'http://api.owlmingo.space/api/v1/user/auth/process-text';
  console.log(`Processing text with endpoint: ${processTextUrl}`);
  
  const processResponse = await fetch(processTextUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text }),
    credentials: 'include'
  });
  
  if (!processResponse.ok) {
    if (processResponse.status === 401) {
      authStore.logout();
      throw new Error('Authentication expired');
    }
    
    const contentType = processResponse.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await processResponse.json();
      throw new Error(errorData.message || 'Failed to process text');
    } else {
      throw new Error(`Server returned error (${processResponse.status})`);
    }
  }
  
  const textProcessResult = await processResponse.json();
  console.log('Text processing result:', textProcessResult);
  
  if (textProcessResult.status === 'success' && textProcessResult.data && textProcessResult.data.id) {
    const fileId = textProcessResult.data.id;
    console.log('Text processed successfully, file ID:', fileId);
    
    // Now generate quiz with the processed text file ID
    await generateQuiz({ textFileId: fileId });
  } else {
    throw new Error('Text processing did not return a valid file ID');
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