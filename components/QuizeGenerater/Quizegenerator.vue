<template>
  <v-container>
    <!-- Header -->
    <h1 class="text-h4 font-weight-bold text-primary mb-3">AI Quiz Generator</h1>
    <p class="text-subtitle-1 text-grey-darken-1 mb-6">
      Upload a document, paste your notes, or select a video to automatically generate quizzes with AI.
    </p>

    <!-- Tabs and Options -->
    <v-row class="align-center">
      <v-col cols="9">
        <v-tabs v-model="tab" max-width="600vh" bg-color="white" class="px-1 py-2 custom-tabs d-flix align-center justyfy-center h-40 rounded-xl w-50" color="primary">
          <v-tab rounded="xl" color="primary" v-for="(option, index) in options" :key="index" :value="option.value" class="custom-tab">
            {{ option.label }}
          </v-tab>
        </v-tabs>
      </v-col>
      <v-col cols="3" class="d-flex justify-end">
        <v-btn rounded="xl" color="medium-emphasis" min-width="92"  variant="outlined"  class="custom-btn text-none" @click="sheet = true" >Options</v-btn>
      </v-col>
    </v-row>

    <!-- Bottom Sheet -->
    <v-bottom-sheet v-model="sheet" inset>
      <v-card class="text-center py-5">
        <v-card-text>
          <v-btn variant="text" color="primary" @click="sheet = false">Close</v-btn>
          <p class="mt-4">Customize your quiz settings here.</p>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <!-- Tab Content -->
    <v-window v-model="tab">
      <!-- Document Upload -->
      <v-window-item value="document">
        <v-card  class="upload-box mt-5 align-center justify-center item-center" outlined>
          <v-container class="d-flex flex-column align-center justify-center">
            <v-icon size="50">mdi-file-upload</v-icon>
            <p class="text-grey-darken-1">Drag a PDF or DOC file here or click to browse</p>
            <v-file-input v-model="file" label="Upload Document" variant="outlined" class="mt-2" :accept="'application/pdf,application/msword'" @change="validateFile('document')"></v-file-input>
          </v-container>
        </v-card>
      </v-window-item>

      <!-- Text Upload -->
      <v-window-item value="text">
        <v-card class="ma-4 pa-4">
          <v-textarea clear-icon="mdi-close-circle" label="Paste your text" clearable></v-textarea>
        </v-card>
      </v-window-item>

      <!-- Image Upload -->
      <v-window-item value="image">
        <v-card class="upload-box mt-5 align-center justify-center item-center" outlined>
          <v-container class="d-flex flex-column align-center justify-center">
            <v-icon size="50">mdi-file-upload</v-icon>
            <p class="text-grey-darken-1">Drag an image here or click to browse</p>
            <v-file-input v-model="file" label="Upload Image" variant="outlined" class="mt-2" :accept="'image/*'" @change="validateFile('image')"></v-file-input>
          </v-container>
        </v-card>
      </v-window-item>

      <!-- Video Upload -->
      <v-window-item value="video">
        <v-card class="upload-box mt-5 align-center justify-center item-center" outlined>
          <v-container class="d-flex flex-column align-center justify-center">
            <v-icon size="50">mdi-file-upload</v-icon>
            <p class="text-grey-darken-1">Drag a video here or click to browse</p>
            <v-file-input v-model="file" label="Upload Video" variant="outlined" class="mt-2" :accept="'video/*'" @change="validateFile('video')"></v-file-input>
          </v-container>
        </v-card>
      </v-window-item>
    </v-window>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :timeout="3000" top>
      Invalid file type! Only the specified file types are allowed.
      <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const tab = ref(' ');
const sheet = ref(false);
const file = ref(null);
const snackbar = ref(false);
// const imageSrc = '/upload-icon.png';

const options = ref([
  { label: 'Document', value: 'document' },
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
]);

const validateFile = (type) => {
  if (type === 'document' && (file.value?.type !== 'application/pdf' && file.value?.type !== 'application/msword')) {
    snackbar.value = true;
    file.value = null;
  }
  if (type === 'image' && !file.value?.type.startsWith('image/')) {
    snackbar.value = true;
    file.value = null;
  }
  if (type === 'video' && !file.value?.type.startsWith('video/')) {
    snackbar.value = true;
    file.value = null;
  }
};
</script>

<style scoped>
/* Tabs */
.custom-tabs {
  text-transform: capitalize;
  font-weight: 100px;
  transition: all 0.2s ease-in-out;
}

.v-tab {
  text-transform: capitalize;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.v-tab--selected {
  background-color: rgb(209, 209, 209) !important;
  font-weight: bold;
}

/* Upload Box */
.upload-box {

  height: 300px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
 
}

</style>
