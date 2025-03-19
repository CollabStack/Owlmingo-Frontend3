<template>
  <v-expand-transition>
    <v-card class="mt-3 pa-3" variant="outlined">
      <div class="d-flex justify-space-between align-center">
        <p class="text-subtitle-2">
          <v-icon color="info" class="me-1">mdi-file-pdf-box</v-icon>
          Selected PDF: {{ fileName }} ({{ totalPages }} pages)
        </p>
        <v-btn-toggle v-model="internalState.selectionMode" mandatory density="compact" rounded="lg">
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
      <div v-if="internalState.selectionMode === 'text'" class="mt-2">
        <v-text-field
          v-model="internalState.pageSelection"
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
                internalState.selectedPages.has(page) ? 'selected' : ''
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
                    v-if="internalState.selectedPages.has(page)" 
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
            {{ Array.from(internalState.selectedPages).length }} pages selected
          </div>
        </div>
      </div>
    </v-card>
  </v-expand-transition>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import * as pdfjs from 'pdfjs-dist';

// Set PDF.js worker if not already set
try {
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
  }
} catch (error) {
  console.warn('Could not set PDF worker:', error);
}

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
  selectionMode: {
    type: String,
    default: 'text'
  },
  pageSelection: {
    type: String,
    default: ''
  },
  selectedPages: {
    type: Object, // Set
    default: () => new Set()
  }
});

const emit = defineEmits(['update:selectedPages', 'update:pageSelection', 'update:selectionMode']);

// Internal state to prevent direct prop mutation
const internalState = reactive({
  selectionMode: props.selectionMode,
  pageSelection: props.pageSelection,
  selectedPages: new Set(Array.from(props.selectedPages))
});
const thumbnailsData = ref([]);
const thumbnailsLoaded = ref([]);
const loadingThumbnails = ref(false);

// Add flags to prevent circular updates
const updatingFromProps = ref(false);
const updatingFromInternal = ref(false);

// Single watcher for selection mode changes
watch(() => internalState.selectionMode, async (newMode) => {
  if (updatingFromProps.value) return;
  
  updatingFromInternal.value = true;
  emit('update:selectionMode', newMode);
  
  if (newMode === 'visual' && thumbnailsData.value.length === 0) {
    await generateThumbnails();
  }
  
  if (newMode === 'visual') {
    const pages = getSelectedPagesArray();
    internalState.selectedPages = new Set(pages);
    emit('update:selectedPages', internalState.selectedPages);
  } else {
    const text = formatSelectedPagesAsText(Array.from(internalState.selectedPages));
    internalState.pageSelection = text;
    emit('update:pageSelection', text);
  }
  updatingFromInternal.value = false;
}, { deep: true });

// Simplified page selection watcher
watch(() => internalState.pageSelection, (newValue) => {
  if (updatingFromProps.value) return;
  
  updatingFromInternal.value = true;
  emit('update:pageSelection', newValue);
  if (internalState.selectionMode === 'text') {
    const pages = getSelectedPagesArray();
    internalState.selectedPages = new Set(pages);
    emit('update:selectedPages', internalState.selectedPages);
  }
  updatingFromInternal.value = false;
});

// Simplified selected pages watcher 
watch(() => internalState.selectedPages, (newValue) => {
  if (updatingFromProps.value) return;
  
  updatingFromInternal.value = true;
  emit('update:selectedPages', new Set(Array.from(newValue)));
  if (internalState.selectionMode === 'visual') {
    const text = formatSelectedPagesAsText(Array.from(newValue));
    internalState.pageSelection = text;
    emit('update:pageSelection', text);
  }
  updatingFromInternal.value = false;
}, { deep: true });

// Toggle selection of a page
const togglePageSelection = (pageNum) => {
  const newSelectedPages = new Set(internalState.selectedPages);
  
  if (newSelectedPages.has(pageNum)) {
    newSelectedPages.delete(pageNum);
  } else {
    newSelectedPages.add(pageNum);
  }
  
  internalState.selectedPages = newSelectedPages;
};

// Select all pages
const selectAllPages = () => {
  const all = new Set();
  for (let i = 1; i <= props.totalPages; i++) {
    all.add(i);
  }
  internalState.selectedPages = all;
};

// Clear page selection
const clearPageSelection = () => {
  internalState.selectedPages = new Set();
};

// Generate thumbnails with error handling
const generateThumbnails = async () => {
  if (loadingThumbnails.value || thumbnailsData.value.length > 0) return;
  
  loadingThumbnails.value = true;
  thumbnailsData.value = new Array(props.totalPages).fill(null);
  thumbnailsLoaded.value = new Array(props.totalPages).fill(false);
  
  try {
    // Load the PDF using PDF.js
    const arrayBuffer = await props.file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const maxPages = Math.min(props.totalPages, 50); // Limit to 50 pages
    
    for (let i = 0; i < maxPages; i++) {
      try {
        const page = await pdf.getPage(i + 1);
        const viewport = page.getViewport({ scale: 0.5 });
        
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
  } finally {
    loadingThumbnails.value = false;
  }
};

// Parse page selection text and get array of page numbers
const getSelectedPagesArray = () => {
  if (!internalState.pageSelection.trim()) {
    // Return all pages if selection is empty
    return Array.from({ length: props.totalPages }, (_, i) => i + 1);
  }
  
  const pages = new Set();
  const parts = internalState.pageSelection.split(',');
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    if (trimmedPart.includes('-')) {
      // Handle page range (e.g., "1-5")
      const [start, end] = trimmedPart.split('-').map(num => parseInt(num.trim()));
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        for (let i = start; i <= end; i++) {
          if (i > 0 && i <= props.totalPages) {
            pages.add(i);
          }
        }
      }
    } else {
      // Handle single page
      const pageNum = parseInt(trimmedPart);
      if (!isNaN(pageNum) && pageNum > 0 && pageNum <= props.totalPages) {
        pages.add(pageNum);
      }
    }
  }
  
  return Array.from(pages).sort((a, b) => a - b);
};

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

// Initialize thumbnails if in visual mode
onMounted(() => {
  if (internalState.selectionMode === 'visual') {
    setTimeout(() => {
      generateThumbnails();
    }, 100);
  }
});
</script>

<style scoped>
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
