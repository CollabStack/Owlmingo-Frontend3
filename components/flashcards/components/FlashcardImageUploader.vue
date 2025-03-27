<template>
  <div class="image-upload-container">
    <v-card 
      class="upload-image-btn" 
      @click="triggerFileInput" 
      elevation="1"
      :class="{'has-image': modelValue}"
    >
      <input
        ref="fileInput"
        type="file"
        @change="onFileSelected"
        accept="image/*"
        hidden
      />
      <!-- Show loading indicator when uploading or removing -->
      <div v-if="loading" class="upload-loading-container">
        <v-progress-circular indeterminate color="primary" size="30"></v-progress-circular>
        <span class="upload-loading-text outfit outfit-medium mt-2">
          {{ isRemoving ? 'Removing...' : 'Uploading...' }}
        </span>
      </div>
      <!-- Show image if available -->
      <v-img 
        v-else-if="modelValue" 
        :src="modelValue" 
        contain 
        height="100%"
        width="100%"
        class="image-preview"
        @click.stop="$emit('preview', modelValue)"
      />
      <!-- Default upload placeholder -->
      <div v-else class="upload-placeholder">
        <v-icon size="36" color="primary" class="upload-icon">mdi-image-plus</v-icon>
        <span class="upload-text outfit outfit-medium">Add Image</span>
      </div>
    </v-card>
    <div class="image-actions" v-if="modelValue">
      <v-btn 
        icon 
        size="x-small" 
        color="error" 
        variant="tonal" 
        class="remove-image-btn"
        @click.stop="$emit('remove')"
      >
        <v-icon size="small">mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  isRemoving: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'file-selected', 'preview', 'remove']);

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const onFileSelected = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // File size validation (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    emit('error', 'Image is too large. Please upload an image smaller than 5MB.');
    return;
  }
  
  emit('file-selected', file);
  
  // Reset the file input so the same file can be selected again if needed
  event.target.value = null;
};
</script>

<style scoped>
.image-upload-container {
  position: relative;
  display: flex;
  align-self: stretch;
  align-items: stretch;
  min-width: 120px;
  flex-basis: 120px;
  margin: 0; /* Remove margin to match height precisely */
  height: 100%; /* Match parent height exactly */
}

.upload-image-btn {
  cursor: pointer;
  border-radius: 12px;
  width: 100%;
  min-height: 120px;
  height: 100%; /* Fill container height */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(245, 246, 255, 0.9);
  border: 2px dashed rgba(123, 131, 224, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  margin: 0;
  flex-grow: 1;
}

/* Mobile responsiveness */
@media (max-width: 600px) {
  .image-upload-container {
    width: 100%;
    max-width: 100%;
    height: 120px;
  }
  
  .upload-image-btn {
    width: 100%;
    height: 100%;
  }
}

.upload-image-btn:hover {
  border-color: var(--v-primary-base);
  background-color: rgba(123, 131, 224, 0.05);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.upload-image-btn.has-image {
  border-style: solid;
  border-color: rgba(123, 131, 224, 0.6);
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  transition: all 0.3s ease;
}

.upload-text {
  font-size: 0.9rem;
  margin-top: 8px;
  color: rgba(123, 131, 224, 0.8);
}

.upload-icon {
  transition: transform 0.3s ease;
}

.upload-image-btn:hover .upload-icon {
  transform: scale(1.1);
}

.image-preview {
  transition: transform 0.3s ease;
}

.upload-image-btn:hover .image-preview {
  transform: scale(1.05);
}

.image-actions {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 1;
}

.remove-image-btn {
  opacity: 0.8;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
}

.remove-image-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.upload-loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 120px;
}

.upload-loading-text {
  font-size: 0.9rem;
  color: rgba(123, 131, 224, 0.8);
  margin-top: 8px;
}

.outfit { 
  font-family: "Outfit", sans-serif; 
}
</style>
