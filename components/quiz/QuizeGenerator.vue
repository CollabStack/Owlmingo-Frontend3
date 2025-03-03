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
    <v-btn-toggle 
      v-model="tab" 
      style="width: 50%; height: 50px;"  
      class="px-1 py-2 d-flex align-center justify-center rounded-xl custom-tab-group  bg-water " 
      color="deep-purple-accent-3"
      group
    >
      <v-btn 
        style="width: 25%; height: 45px;"
        v-for="(option, index) in options" 
        :key="index" 
        :value="option.value" 
        class="custom-tab bg-none text-primary" 
        rounded="xl" 
        variant="text" 
        color="primary"
      >
        {{ option.label }}
      </v-btn>
    </v-btn-toggle>
  </v-col>
  <v-col cols="3" class="d-flex justify-end">
    <v-btn rounded="xl" color="medium-emphasis" min-width="92" variant="outlined" class="custom-btn text-none" @click="sheet = true">
      Options
    </v-btn>
  </v-col>
</v-row>



    <!-- Bottom Sheet -->
    <v-bottom-sheet v-model="sheet" inset>
  <v-card class="text-center py-5 px-5" rounded="lg">
    <v-card-text class="d-flex justify-space-between align-center">
      <p class="text-h5 text-primary">Option</p>
      <v-icon color="primary" @click="sheet = false">mdi-close</v-icon>
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
        class="my-3"
      ></v-select>

      <p class="text-primary text-h6 text-left">Max Questions</p>
      <v-select
        clearable
        chips
        label="Auto"
        :items="['Auto', '5', '10']"
        class="my-3"
      ></v-select>
    </v-container>
  </v-card>
</v-bottom-sheet>



    <!-- Tab Content -->
    <v-window v-model="tab">
      <!-- Document Upload -->
      <v-window-item value="document">
        <v-card class="upload-box mt-5 align-center justify-center" outlined
          @dragover.prevent
          @drop="handleDocumentDrop">
          <v-container class="d-flex flex-column align-center justify-center">
            <v-icon size="50" color="black_cow">mdi-file-upload</v-icon>
            <p class="text-grey-darken-1">
              {{ documentFile ? `Uploaded: ${documentFile.name}` : "Drag a PDF or DOC file here" }}
            </p>
          </v-container>
        </v-card>
        <p class="mt-2">Looking for flashcards instead? Try the <nuxt-link to="/" style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>

      </v-window-item>

      <!-- Text Upload -->
      <v-window-item value="text" class="color: black_cow">
  <dev class="ma-4 pa-4 " outlined>
    <v-textarea
   
      clearable
      clear-icon="mdi-close-circle"
      label="Paste in your notes or other content"
      outlined
      dense
      autofocus
      placeholder="Start typing here..."
      hide-details
      class="custom-textarea"
    ></v-textarea>
    <v-btn color="royal_blue" min-width="92" variant="outlined" class="custom-btn text-none my-3" @click="">Generate</v-btn>
    <p>Looking for flashcards instead? Try the <nuxt-link to="/" style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>
  </dev>
</v-window-item>


      <!-- Image Upload (Drag & Drop Only) -->
      <v-window-item value="image">
        <v-card class="upload-box mt-5 align-center justify-center" outlined
          @dragover.prevent
          @drop="dropImg">
          <v-container class="d-flex flex-column align-center justify-center">
            <v-icon size="50" color="black_cow">mdi-image</v-icon>
            <p class="text-grey-darken-1">
              {{ imageFile ? `Uploaded: ${imageFile.name}` : "Drag an image here to upload" }}
            </p>
          </v-container>
        </v-card>
        <p class="mt-2">Looking for flashcards instead? Try the <nuxt-link to="/" style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>

      </v-window-item>

      <!-- Video Upload (Drag & Drop Only) -->
      <v-window-item value="video">
        <v-card class="upload-box mt-5 align-center justify-center" outlined
          @dragover.prevent
          @drop="dropVideo">
          <v-container class="d-flex flex-column align-center justify-center">
            <v-icon size="50" color="black_cow">mdi-video</v-icon>

            <p class="text-grey-darken-1">
              {{ videoFile ? `Uploaded: ${videoFile.name}` : "Drag a video file here to upload" }}
            </p>
          </v-container>
        </v-card>
        <p class="mt-2">Looking for flashcards instead? Try the <nuxt-link to="/" style="text-decoration: none;"> AI Flashcard Generator</nuxt-link></p>

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

const tab = ref('');
const sheet = ref(false);
const snackbar = ref(false);
const documentFile = ref(null);
const imageFile = ref(null);
const videoFile = ref(null);

const options = ref([
  { label: 'Document', value: 'document' },
  { label: 'Text', value: 'text' },
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
]);

// Handle Document Drop
const handleDocumentDrop = (event) => {
  event.preventDefault();
  const droppedFile = event.dataTransfer.files[0];
  if (droppedFile && ['application/pdf', 'application/msword'].includes(droppedFile.type)) {
    documentFile.value = droppedFile;
  } else {
    snackbar.value = true;
  }
};

// Handle Image Drop
const dropImg = (event) => {
  event.preventDefault();
  const droppedImage = event.dataTransfer.files[0];
  if (droppedImage && droppedImage.type.startsWith('image/')) {
    imageFile.value = droppedImage;
  } else {
    snackbar.value = true;
  }
};

// Handle Video Drop
const dropVideo = (event) => {
  event.preventDefault();
  const droppedVideo = event.dataTransfer.files[0];
  if (droppedVideo && droppedVideo.type.startsWith('video/')) {
    videoFile.value = droppedVideo;
  } else {
    snackbar.value = true;
  }
};
</script>

<style scoped>
/* Upload Box */
.upload-box {
  width: 100%;
  height: 300px;
  border: 2px dashed #ccc;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

/* Style for active button */
.v-btn-toggle .v-btn--active {
  background-color: #aeacac !important; 
  color: white !important;
}
</style>
