<template>
  <v-expand-transition>
    <v-card class="mt-4 pa-4 rounded-xl pdf-selector-card" variant="outlined">
      <!-- Header section with file info -->
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon color="primary" size="24" class="me-2">mdi-file-pdf-box</v-icon>
          <span class="text-subtitle-1 outfit outfit-medium">{{ fileName }}</span>
          <v-chip size="small" color="primary" variant="flat" class="ms-3">
            {{ totalPages }} pages
          </v-chip>
        </div>
        
        <div>
          <v-btn 
            size="small" 
            variant="text" 
            color="primary" 
            @click="selectAllPages" 
            class="me-1"
            :disabled="isAllPagesSelected"
          >
            <v-icon size="small" class="me-1">mdi-select-all</v-icon>
            Select All
          </v-btn>
          <v-btn 
            size="small" 
            variant="text" 
            color="error" 
            @click="clearPageSelection" 
            :disabled="internalState.selectedPages.size === 0"
          >
            <v-icon size="small" class="me-1">mdi-select-remove</v-icon>
            Clear
          </v-btn>
        </div>
      </div>

      <!-- Loading state -->
      <v-progress-linear
        v-if="loadingThumbnails"
        indeterminate
        color="primary"
        class="mt-4 mb-1"
        rounded
      ></v-progress-linear>
      
      <!-- Selection counter -->
      <div class="text-body-2 my-2 d-flex align-center" v-if="!loadingThumbnails">
        <v-icon color="primary" size="small" class="me-2">mdi-check-circle-outline</v-icon>
        <span class="outfit outfit-medium">{{ internalState.selectedPages.size }} of {{ totalPages }} pages selected</span>
      </div>

      <!-- Thumbnails grid -->
      <v-divider class="my-3"></v-divider>
      
      <div class="thumbnails-container">
        <v-row v-if="!loadingThumbnails" dense>
          <v-col v-for="page in totalPages" :key="page" cols="4" sm="3" md="2" lg="2" xl="1">
            <v-card
              :class="[
                'page-thumbnail-card',
                internalState.selectedPages.has(page) ? 'selected' : ''
              ]"
              @click="togglePageSelection(page)"
              elevation="0"
              height="120"
            >
              <div class="d-flex flex-column h-100">
                <div class="page-thumbnail-container">
                  <img 
                    v-if="thumbnailsData[page-1]" 
                    :src="thumbnailsData[page-1]" 
                    class="page-thumbnail" 
                    alt="Page preview"
                  />
                  <div v-else class="page-placeholder">
                    <v-icon color="grey-lighten-1" size="large">mdi-file-pdf-outline</v-icon>
                  </div>
                </div>
                <div class="page-number">{{ page }}</div>
                
                <div v-if="internalState.selectedPages.has(page)" class="selection-overlay">
                  <v-icon color="white" size="large">mdi-check-circle</v-icon>
                </div>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </v-expand-transition>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue';
import * as pdfjs from 'pdfjs-dist';
import { PDFDocument } from 'pdf-lib'; 

// Fix PDF.js worker setup
onMounted(async () => {
  try {
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
      pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;
    }
    // Wait a brief moment to ensure component is fully mounted
    setTimeout(() => {
      generateThumbnails();
    }, 100);
  } catch (error) {
    console.error('Could not set PDF worker:', error);
  }
});

const props = defineProps({
  file: {
    type: Object,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  selectedPages: {
    type: Object, // Set
    default: () => new Set()
  }
});

const emit = defineEmits(['update:selectedPages']);

// Internal state to prevent direct prop mutation
const internalState = reactive({
  selectedPages: new Set(Array.from(props.selectedPages))
});

const thumbnailsData = ref([]);
const loadingThumbnails = ref(false);

// Computed property to check if all pages are selected
const isAllPagesSelected = computed(() => {
  return internalState.selectedPages.size === props.totalPages;
});

// Watch for external changes to selectedPages prop
watch(() => props.selectedPages, (newValue) => {
  if (JSON.stringify([...internalState.selectedPages]) !== JSON.stringify([...newValue])) {
    internalState.selectedPages = new Set(Array.from(newValue));
  }
}, { deep: true });

// Watch for changes to the file prop to regenerate thumbnails when a new file is uploaded
watch(() => props.file, (newFile, oldFile) => {
  // Only regenerate if the file has actually changed (compare by name to be safe)
  if (newFile && (!oldFile || newFile.name !== oldFile.name)) {
    console.log('File changed, regenerating thumbnails');
    // Reset thumbnails data
    thumbnailsData.value = [];
    loadingThumbnails.value = false;
    
    // Force Vue to rerender by using nextTick
    nextTick(() => {
      // Call generate thumbnails with a small delay
      setTimeout(() => {
        generateThumbnails();
      }, 200);
    });
  }
}, { immediate: true });

// Toggle selection of a page - optimized for immediate response
const togglePageSelection = (pageNum) => {
  if (internalState.selectedPages.has(pageNum)) {
    internalState.selectedPages.delete(pageNum);
  } else {
    internalState.selectedPages.add(pageNum);
  }
  
  // Immediately emit the update to avoid any perceived delay
  emit('update:selectedPages', new Set(internalState.selectedPages));
};

// Select all pages - fixed to ensure it works correctly
const selectAllPages = () => {
  // Clear and recreate the set to ensure reactivity
  internalState.selectedPages.clear();
  
  for (let i = 1; i <= props.totalPages; i++) {
    internalState.selectedPages.add(i);
  }
  
  // Immediately emit the update
  emit('update:selectedPages', new Set(internalState.selectedPages));
};

// Clear page selection - optimized for immediate response
const clearPageSelection = () => {
  internalState.selectedPages.clear();
  
  // Immediately emit the update
  emit('update:selectedPages', new Set());
};

// Generate thumbnails with improved error handling and retry mechanism
const generateThumbnails = async () => {
  if (loadingThumbnails.value || !props.file) return;
  
  console.log('Starting thumbnail generation for file:', props.fileName);
  loadingThumbnails.value = true;
  thumbnailsData.value = new Array(props.totalPages).fill(null);
  
  try {
    // Load the PDF using PDF.js with explicit type checking
    const arrayBuffer = await props.file.arrayBuffer();
    
    // Verify we have valid data
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('Empty file data');
    }
    
    // Create a Uint8Array from arrayBuffer for PDF.js
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Load the PDF with extra options for robustness
    const loadingTask = pdfjs.getDocument({
      data: uint8Array,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.16.105/cmaps/',
      cMapPacked: true,
      disableFontFace: true, // Prevent font loading issues
    });
    
    const pdf = await loadingTask.promise;
    const maxPages = Math.min(props.totalPages, 50); // Limit to 50 pages
    
    console.log(`PDF loaded successfully. Processing ${maxPages} pages.`);
    
    // Clear any existing thumbnails
    thumbnailsData.value = new Array(props.totalPages).fill(null);
    
    // Process pages in smaller batches for better reliability
    const batchSize = 2; // Reduce batch size for more stability
    for (let i = 0; i < maxPages; i += batchSize) {
      const pagePromises = [];
      
      // Create batch of page render promises
      for (let j = 0; j < batchSize && i + j < maxPages; j++) {
        const pageIndex = i + j;
        pagePromises.push(renderPageWithRetry(pdf, pageIndex + 1, pageIndex));
      }
      
      // Wait for batch to complete before moving to next batch
      await Promise.all(pagePromises);
      
      // Small delay between batches to prevent browser from becoming unresponsive
      if (i + batchSize < maxPages) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Increase delay
      }
    }
    
    console.log('Thumbnail generation completed successfully');
  } catch (error) {
    console.error('Error generating thumbnails:', error);
  } finally {
    loadingThumbnails.value = false;
  }
};

// Helper function to render a page with retry mechanism
const renderPageWithRetry = async (pdf, pageNum, index, retryCount = 0) => {
  try {
    // Get the page - this can sometimes fail
    console.log(`Rendering page ${pageNum}...`);
    const page = await pdf.getPage(pageNum);
    
    // Create a properly sized viewport with lower scale for thumbnails
    const originalViewport = page.getViewport({ scale: 1.0 });
    // Use a fixed scale for consistency
    const scale = 0.3;
    const viewport = page.getViewport({ scale });
    
    // Create canvas with proper dimensions
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d', { 
      alpha: false,
      willReadFrequently: true // Optimize for image data reading
    });
    
    // Clear the canvas with white background
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Render page to canvas with specific settings
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      enableWebGL: false,
      renderInteractiveForms: false
    };
    
    const renderTask = page.render(renderContext);
    await renderTask.promise;
    
    // Convert canvas to base64 image - use JPG for better performance
    try {
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      if (dataUrl && dataUrl !== 'data:,') {
        thumbnailsData.value[index] = dataUrl;
        console.log(`Successfully generated thumbnail for page ${pageNum}`);
      } else {
        throw new Error('Generated empty data URL');
      }
    } catch (canvasError) {
      console.error(`Canvas conversion error for page ${pageNum}:`, canvasError);
      thumbnailsData.value[index] = null;
    }
    
    // Clean up to prevent memory leaks
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
  } catch (err) {
    console.warn(`Error generating thumbnail for page ${pageNum}:`, err);
    
    // Implement retry logic (up to 2 times)
    if (retryCount < 2) {
      console.log(`Retrying thumbnail for page ${pageNum} (attempt ${retryCount + 1})...`);
      await new Promise(resolve => setTimeout(resolve, 200)); // Longer wait before retrying
      return renderPageWithRetry(pdf, pageNum, index, retryCount + 1);
    } else {
      console.error(`Failed to generate thumbnail for page ${pageNum} after retries`);
      // If all retries fail, ensure the placeholder is properly set
      thumbnailsData.value[index] = null;
    }
  }
};

// Merge selected pages into a single PDF document and return it as a Blob
const getMergedPdf = async () => {
  if (internalState.selectedPages.size === 0) return null;
  
  try {
    // Get the source PDF document
    const arrayBuffer = await props.file.arrayBuffer();
    const sourcePdfDoc = await PDFDocument.load(arrayBuffer);
    
    // Create a new document to hold selected pages
    const mergedPdf = await PDFDocument.create();
    
    // Get selected pages in order
    const selectedPageNumbers = Array.from(internalState.selectedPages).sort((a, b) => a - b);
    
    // Copy each selected page to the new document
    for (const pageNum of selectedPageNumbers) {
      // PDFDocument uses 0-based page indexing, our UI uses 1-based
      const [copiedPage] = await mergedPdf.copyPages(sourcePdfDoc, [pageNum - 1]);
      mergedPdf.addPage(copiedPage);
    }
    
    // Generate the merged PDF as a binary array
    const mergedPdfBytes = await mergedPdf.save();
    
    // Return the PDF as a blob that can be used for upload or download
    return new Blob([mergedPdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('Error merging PDF pages:', error);
    return null;
  }
};

// Emit the merged PDF to parent component
defineExpose({
  getMergedPdf
});
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

.pdf-selector-card {
  background-color: #fafafa;
  border: 1px solid rgba(157, 123, 252, 0.2);
}

.thumbnails-container {
  max-height: 390px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #9D7BFC #f0f0f0;
  padding-right: 4px;
}

/* Scrollbar styles */
.thumbnails-container::-webkit-scrollbar {
  width: 6px;
}

.thumbnails-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
}

.thumbnails-container::-webkit-scrollbar-thumb {
  background-color: #9D7BFC;
  border-radius: 10px;
}

.page-thumbnail-card {
  cursor: pointer;
  transition: all 0.15s ease; /* Faster transition for better responsiveness */
  border-radius: 8px;
  border: 2px solid transparent;
  overflow: hidden;
  position: relative;
  background-color: white;
}

.page-thumbnail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 3px 6px rgba(0,0,0,0.08) !important;
}

.page-thumbnail-card.selected {
  border-color: #9D7BFC;
  box-shadow: 0 0 0 1px rgba(157, 123, 252, 0.5) !important;
}

.page-thumbnail-container {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  overflow: hidden;
}

.page-thumbnail {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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

.page-number {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 12px;
  color: #555;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 2px 0;
}

.selection-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(157, 123, 252, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  /* Remove transition to make it immediate */
}
</style>
