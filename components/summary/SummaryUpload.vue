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
        
        <!-- PDF page selector -->
        <v-expand-transition>
          <v-card v-if="documentFile && isPdfFile" class="mt-3 pa-3" variant="outlined">
            <div class="d-flex justify-space-between align-center">
              <p class="text-subtitle-2">
                <v-icon color="info" class="me-1">mdi-file-pdf-box</v-icon>
                Selected PDF: {{ documentFile.name }} ({{ totalPages }} pages)
              </p>
              <v-btn-toggle v-model="selectionMode" mandatory density="compact" rounded="lg">
                <v-btn value="text" size="small">
                  <v-icon>mdi-format-list-text</v-icon>
                  <span class="ms-1 d-none d-sm-inline">Text</span>
                </v-btn>
                <v-btn value="visual" size="small">
                  <v-icon>mdi-view-grid</v-icon>
                  <span class="ms-1 d-none d-sm-inline">Visual</span>
                </v-btn>
              </v-btn-toggle>
            </div>

            <!-- Text-based page selection -->
            <div v-if="selectionMode === 'text'" class="mt-2">
              <v-text-field
                v-model="pageSelection"
                label="Select Pages"
                placeholder="e.g., 1-5, 8, 10-12" 
                hint="Enter page numbers or ranges separated by commas"
                persistent-hint
                variant="outlined"
                density="compact"
                class="mt-2"
              ></v-text-field>
              <p class="text-caption text-grey mt-1">Leave blank to process all pages</p>
            </div>

            <!-- Visual page selection -->
            <div v-else class="mt-3">
              <p class="text-caption mb-2">Click on page thumbnails to select or deselect</p>
              
              <v-progress-linear
                v-if="loadingThumbnails"
                indeterminate
                color="primary"
                class="mb-3"
              ></v-progress-linear>
              
              <v-row v-else dense>
                <v-col v-for="page in totalPages" :key="page" cols="4" sm="3" md="2" lg="2" xl="1">
                  <v-card
                    :class="[
                      'page-thumbnail-card',
                      selectedPages.has(page) ? 'selected' : ''
                    ]"
                    @click="togglePageSelection(page)"
                    elevation="2"
                    height="120"
                  >
                    <div class="d-flex flex-column h-100">
                      <div class="page-thumbnail-container">
                        <img 
                          v-if="thumbnailsData[page-1]" 
                          :src="thumbnailsData[page-1]" 
                          class="page-thumbnail" 
                          @load="thumbnailsLoaded[page-1] = true"
                          alt="Page preview"
                        />
                        <div v-else class="page-placeholder">
                          <v-icon color="grey-lighten-1" size="large">mdi-file-pdf-outline</v-icon>
                          <div class="text-caption text-grey">Page {{ page }}</div>
                        </div>
                      </div>
                      <v-card-text class="pa-1 text-center">
                        <div class="text-caption">Page {{ page }}</div>
                        <v-icon 
                          v-if="selectedPages.has(page)" 
                          color="success" 
                          size="small"
                          class="check-icon"
                        >
                          mdi-check-circle
                        </v-icon>
                      </v-card-text>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <div class="d-flex justify-space-between align-center mt-3">
                <v-btn 
                  size="small" 
                  variant="text" 
                  @click="selectAllPages" 
                  prepend-icon="mdi-select-all"
                >
                  Select All
                </v-btn>
                <v-btn 
                  size="small" 
                  variant="text" 
                  color="error" 
                  @click="clearPageSelection" 
                  prepend-icon="mdi-select-remove"
                >
                  Clear Selection
                </v-btn>
                <div class="text-body-2">
                  {{ Array.from(selectedPages).length }} pages selected
                </div>
              </div>
            </div>
          </v-card>
        </v-expand-transition>
        
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

      <!-- Video Upload -->
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
import { useRouter } from 'vue-router';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';

// Set PDF.js worker
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const router = useRouter(); // Initialize router

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
  { label: 'Link', value: 'link' },
]);

// Add these new refs
const pageSelection = ref('');
const totalPages = ref(0);

// Check if file is PDF
const isPdfFile = computed(() => {
  return documentFile.value && 
    (documentFile.value.type === 'application/pdf' || 
     documentFile.value.name.toLowerCase().endsWith('.pdf'));
});

// Enhanced file selection handler with better error handling
const handleFileSelected = async (type, file) => {
  if (type === 'document') {
    documentFile.value = file;
    
    // Reset page selection
    pageSelection.value = '';
    selectedPages.value = new Set();
    thumbnailsData.value = [];
    thumbnailsLoaded.value = [];
    
    if (isPdfFile.value) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        
        const pages = pdfDoc.getPageCount();
        totalPages.value = pages;
        
        // Select all pages by default
        for (let i = 1; i <= pages; i++) {
          selectedPages.value.add(i);
        }
        pageSelection.value = pages > 1 ? `1-${pages}` : '1';
        
        // Store PDF document for later use
        pdfDocRef.value = pdfDoc;
        
        if (selectionMode.value === 'visual') {
          await generateThumbnails();
        }
      } catch (error) {
        console.error('Error loading PDF:', error);
        showSnackbar('Error reading PDF file');
      }
    }
  } else if (type === 'image') {
    imageFile.value = file;
  } else if (type === 'video') {
    videoFile.value = file;
  }
};

// Add reference to store PDF document
const pdfDocRef = ref(null);

// Parse page selection and get array of page numbers
const getSelectedPages = () => {
  if (!pageSelection.value.trim()) {
    // Return all pages if selection is empty
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  const pages = new Set();
  const parts = pageSelection.value.split(',');
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    if (trimmedPart.includes('-')) {
      // Handle page range (e.g., "1-5")
      const [start, end] = trimmedPart.split('-').map(num => parseInt(num.trim()));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= totalPages.value) {
            pages.add(i);
          }
        }
      }
    } else {
      // Handle single page
      const pageNum = parseInt(trimmedPart);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages.value) {
        pages.add(pageNum);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
};

// Show snackbar with custom message
const showSnackbar = (message) => {
  snackbarMessage.value = message;
  snackbar.value = true;
};

// Generate Summary
const generateSummary = async () => {
  loading.value = true;
  
  try {
    // For PDF files with page selection
    if (isPdfFile.value) {
      const pagesToProcess = Array.from(selectedPages.value).sort((a, b) => a - b);
      console.log('Processing PDF pages:', pagesToProcess);
      
      // Here you would extract the selected pages and process them
      // This is where you'd integrate with your backend API
    }
    
    // Simulate API call with timeout (replace with actual API call)
    setTimeout(() => {
      loading.value = false;
      showSnackbar('Summary generated successfully!');
    }, 2000);
  } catch (error) {
    console.error('Error generating summary:', error);
    loading.value = false;
    showSnackbar('Error generating summary');
  }
};

// Add these new refs for visual page selection
const selectionMode = ref('text');
const selectedPages = ref(new Set());
const thumbnailsData = ref([]);
const thumbnailsLoaded = ref([]);
const loadingThumbnails = ref(false);

// Watch for changes in pageSelection and update selectedPages
watch(pageSelection, (newValue) => {
  if (selectionMode.value === 'text') {
    selectedPages.value = new Set(getSelectedPagesArray());
  }
});

// Watch for changes in selectedPages and update pageSelection
watch(selectedPages, (newValue) => {
  if (selectionMode.value === 'visual') {
    pageSelection.value = formatSelectedPagesAsText(Array.from(newValue));
  }
});

// Toggle page selection mode
watch(selectionMode, async (newMode) => {
  if (newMode === 'visual' && thumbnailsData.value.length === 0 && isPdfFile.value) {
    await generateThumbnails();
  }
  
  if (newMode === 'visual') {
    // Convert text selection to visual selection
    selectedPages.value = new Set(getSelectedPagesArray());
  } else {
    // Keep the selection state synchronized
    pageSelection.value = formatSelectedPagesAsText(Array.from(selectedPages.value));
  }
});

// Convert selected pages array to formatted text (e.g. "1-3, 5, 7-9")
const formatSelectedPagesAsText = (pagesArray) => {
  if (!pagesArray.length) return '';
  
  pagesArray.sort((a, b) => a - b);
  
  const ranges = [];
  let rangeStart = pagesArray[0];
  let rangeEnd = pagesArray[0];
  
  for (let i = 1; i < pagesArray.length; i++) {
    if (pagesArray[i] === rangeEnd + 1) {
      rangeEnd = pagesArray[i];
    } else {
      ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`);
      rangeStart = rangeEnd = pagesArray[i];
    }
  }
  
  ranges.push(rangeStart === rangeEnd ? `${rangeStart}` : `${rangeStart}-${rangeEnd}`);
  return ranges.join(', ');
};

// Toggle selection of a page
const togglePageSelection = (pageNum) => {
  const newSelectedPages = new Set(selectedPages.value);
  
  if (newSelectedPages.has(pageNum)) {
    newSelectedPages.delete(pageNum);
  } else {
    newSelectedPages.add(pageNum);
  }
  
  selectedPages.value = newSelectedPages;
  pageSelection.value = formatSelectedPagesAsText(Array.from(newSelectedPages));
};

// Select all pages
const selectAllPages = () => {
  const all = new Set();
  for (let i = 1; i <= totalPages.value; i++) {
    all.add(i);
  }
  selectedPages.value = all;
};

// Clear page selection
const clearPageSelection = () => {
  selectedPages.value = new Set();
};

// Generate thumbnails with better error handling
const generateThumbnails = async () => {
  if (!isPdfFile.value || !documentFile.value) return;
  
  loadingThumbnails.value = true;
  thumbnailsData.value = new Array(totalPages.value).fill(null);
  thumbnailsLoaded.value = new Array(totalPages.value).fill(false);
  
  try {
    // Load the PDF using PDF.js
    const arrayBuffer = await documentFile.value.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    const maxPages = Math.min(totalPages.value, 50); // Limit to 50 pages
    
    for (let i = 0; i < maxPages; i++) {
      try {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.5 }); // Adjust scale as needed
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        // Render page to canvas
        await page.render({
          canvasContext: context,
          viewport: viewport
        }).promise;
        
        // Convert canvas to base64 image
        thumbnailsData.value[i] = canvas.toDataURL('image/jpeg', 0.5);
        thumbnailsLoaded.value[i] = true;
      } catch (err) {
        console.warn(`Error generating thumbnail for page ${i + 1}:`, err);
        thumbnailsData.value[i] = null;
      }
    }
  } catch (error) {
    console.error('Error generating thumbnails:', error);
    showSnackbar('Error generating page previews');
  } finally {
    loadingThumbnails.value = false;
  }
};

// Parse page selection text and get array of page numbers
const getSelectedPagesArray = () => {
  if (!pageSelection.value.trim()) {
    // Return all pages if selection is empty
    return Array.from({ length: totalPages.value }, (_, i) => i + 1);
  }
  
  const pages = new Set();
  const parts = pageSelection.value.split(',');
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    if (trimmedPart.includes('-')) {
      // Handle page range (e.g., "1-5")
      const [start, end] = trimmedPart.split('-').map(num => parseInt(num.trim()));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= totalPages.value) {
            pages.add(i);
          }
        }
      }
    } else {
      // Handle single page
      const pageNum = parseInt(trimmedPart);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages.value) {
        pages.add(pageNum);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
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

/* Remove any conflicting textarea styles */
:deep(.v-field--focused),
:deep(.v-field--active) {
  box-shadow: none !important;
  transform: none !important;
}

/* Page thumbnail styling */
.page-thumbnail-card {
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  overflow: hidden;
  position: relative;
}

.page-thumbnail-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.page-thumbnail-card.selected {
  border-color: var(--v-primary-base, #9D7BFC);
  background-color: rgba(157, 123, 252, 0.05);
}

.page-thumbnail-container {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  transition: opacity 0.3s ease;
}

.page-thumbnail {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.2s ease;
}

.page-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: #f8f8f8;
}

.check-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: white;
  border-radius: 50%;
}

/* Improve the selection toggle button group */
.v-btn-toggle {
  background-color: #f5f5f5;
}

</style>
