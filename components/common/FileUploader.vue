<template>
  <v-card 
    class="upload-box align-center justify-center" 
    outlined
    @dragover.prevent
    @drop="handleFileDrop"
    :class="{ 'upload-box-hover': isDragging }"
    v-motion
    :initial="{ opacity: 0, scale: 0.95 }"
    :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
    @dragenter="isDragging = true"
    @dragleave="isDragging = false"
  >
    <v-container class="d-flex flex-column align-center justify-center">
      <v-icon 
        :size="iconSize" 
        :color="iconColor"
        class="floating-icon"
      >{{ icon }}</v-icon>
      <p class="text-grey-darken-1 animated-text mt-3 outfit outfit-medium">
        {{ selectedFile ? `Uploaded: ${selectedFile.name}` : placeholder }}
      </p>
      <v-btn
        v-if="!selectedFile"
        :color="buttonColor"
        class="mt-4 animated-btn outfit outfit-medium"
        @click="triggerFileInput"
        rounded="xl"
      >
        <span class="d-flex align-center">
          {{ buttonText }}
          <v-icon class="ms-2 btn-icon">{{ buttonIcon }}</v-icon>
        </span>
      </v-btn>
      <v-btn
        v-else
        color="error"
        variant="text"
        class="mt-2 outfit outfit-medium"
        @click="clearSelectedFile"
        rounded="xl"
      >
        <span class="d-flex align-center">
          Clear File
          <v-icon class="ms-2">mdi-close</v-icon>
        </span>
      </v-btn>
      <input 
        type="file" 
        ref="fileInput" 
        style="display: none"
        :accept="acceptedFileTypes"
        @change="handleFileChange"
      >
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-file-upload'
  },
  iconColor: {
    type: String,
    default: 'secondary'
  },
  iconSize: {
    type: Number,
    default: 50
  },
  placeholder: {
    type: String,
    default: 'Drag a file here to upload'
  },
  acceptedFileTypes: {
    type: String,
    default: '*/*' // Accept all file types by default
  },
  buttonText: {
    type: String,
    default: 'Browse Files'
  },
  buttonIcon: {
    type: String,
    default: 'mdi-upload'
  },
  buttonColor: {
    type: String,
    default: 'secondary'
  },
  maxFileSize: {
    type: Number,
    default: 10 // 10MB
  },
  fileTypeErrorMessage: {
    type: String,
    default: 'Invalid file type!'
  },
  fileSizeErrorMessage: {
    type: String, 
    default: 'File is too large! Maximum size is'
  }
});

const emit = defineEmits(['file-selected', 'file-removed', 'error']);

const fileInput = ref(null);
const selectedFile = ref(null);
const isDragging = ref(false);

// Trigger file input dialog
const triggerFileInput = () => {
  fileInput.value.click();
};

// Handle file drop
const handleFileDrop = (event) => {
  event.preventDefault();
  isDragging.value = false;
  const droppedFile = event.dataTransfer.files[0];
  
  if (!droppedFile) return;
  
  validateAndProcessFile(droppedFile);
};

// Handle file selection from input
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  validateAndProcessFile(file);
};

// Clear selected file
const clearSelectedFile = () => {
  selectedFile.value = null;
  emit('file-removed');
  // Clear the file input value to allow selecting the same file again
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Validate file type and size
const validateAndProcessFile = (file) => {
  // Check file type if specific types are provided
  if (props.acceptedFileTypes !== '*/*') {
    const fileTypeValid = validateFileType(file);
    if (!fileTypeValid) {
      emit('error', props.fileTypeErrorMessage);
      return;
    }
  }
  
  // Check file size
  const fileSizeInMB = file.size / (1024 * 1024);
  if (fileSizeInMB > props.maxFileSize) {
    emit('error', `${props.fileSizeErrorMessage} ${props.maxFileSize}MB.`);
    return;
  }
  
  // All validation passed
  selectedFile.value = file;
  emit('file-selected', file);
};

// Validate file type based on accept attribute
const validateFileType = (file) => {
  const acceptedTypes = props.acceptedFileTypes.split(',');
  
  // Handle mime types or extensions
  for (const type of acceptedTypes) {
    const trimmedType = type.trim();
    
    // Handle file extensions (e.g., .pdf, .jpg)
    if (trimmedType.startsWith('.')) {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (extension === trimmedType.toLowerCase()) {
        return true;
      }
    } 
    // Handle mime type patterns (e.g., image/*, application/pdf)
    else {
      if (trimmedType.includes('*')) {
        const mimePattern = trimmedType.replace('*', '');
        if (file.type.startsWith(mimePattern)) {
          return true;
        }
      } else if (file.type === trimmedType) {
        return true;
      }
    }
  }
  
  return false;
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

/* Upload Box */
.upload-box {
  width: 100%;
  height: 300px;
  border: 2px dashed #ffffff;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.upload-box:hover, .upload-box-hover {
  transform: translateY(-5px);
  border-color: var(--v-primary-base);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

/* Animated button */
.animated-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  border-width: 2px;
  padding: 0 20px !important;
  height: 48px;
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

/* Floating icon animation */
.floating-icon {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

/* Text animation */
.animated-text {
  transition: all 0.3s ease;
  font-size: 1.1rem;
  letter-spacing: 0.3px;
}

.upload-box:hover .animated-text {
  transform: scale(1.05);
  color: var(--v-primary-base);
}
</style>
