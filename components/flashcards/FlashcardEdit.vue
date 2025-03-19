<template>
  <div>
    <!-- Header Section -->
    <v-container class="text-center py-6 d-flex align-center justify-space-between">
      <p class="text-h4 font-weight-bold text-onyx">New Flashcard Deck</p>
      <v-btn color="info" variant="outlined" rounded="xl" @click="saveFlashcard">
        Create
      </v-btn>
    </v-container>

    <!-- Deck Name Input -->
    <v-container>
      <v-card class="pa-4">
        <v-card-title class="text-h5 font-weight-bold text-onyx">Deck Name</v-card-title>
        <v-card-text>
          <v-textarea
            label="Flashcard Deck Name"
            placeholder="Enter the name of the flashcard deck"
            variant="outlined"
            v-model="deckName"
            auto-grow
            rows="2"
            hide-details
            clearable
          ></v-textarea>
          <p class="text-grey-darken-1 text-body-2">
            All changes are saved automatically. Click and drag to rearrange flashcards.
          </p>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Flashcard List -->
    <v-container v-if="flashcards.length > 0">
      <v-container v-for="(flashcard, index) in flashcards" :key="index" class="mb-4">
        <v-card class="pa-4">
          <div class="d-flex justify-space-between align-center">
            <p class="text-h6 font-weight-medium">{{ index + 1 }}</p>
            <div>
              <v-card>
                <v-btn-toggle class="d-flex align-center" v-model="selectedFormat">
                  <v-btn icon @click="undo">
                    <v-icon>mdi-undo</v-icon>
                  </v-btn>
                  <v-btn icon @click="redo">
                    <v-icon>mdi-redo</v-icon>
                  </v-btn>
                  <p class="mr-2">|</p>
                  <v-btn icon @click="applyFormat('bold')">
                    <v-icon>mdi-format-bold</v-icon>
                  </v-btn>
                  <v-btn icon @click="applyFormat('italic')">
                    <v-icon>mdi-format-italic</v-icon>
                  </v-btn>
                  <v-btn icon @click="applyFormat('underline')">
                    <v-icon>mdi-format-underline</v-icon>
                  </v-btn>
                  <v-btn icon @click="applyFormat('strikethrough')">
                    <v-icon>mdi-format-strikethrough</v-icon>
                  </v-btn>
                  <v-btn icon @click="applyColor">
                    <v-icon>mdi-format-color-text</v-icon>
                  </v-btn>
                  <p class="mr-2">|</p>
                  <v-btn icon @click="applyFormat('insertUnorderedList')">
                    <v-icon>mdi-format-list-bulleted</v-icon>
                  </v-btn>
                  <v-btn icon @click="applyFormat('insertOrderedList')">
                    <v-icon>mdi-format-list-numbered</v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-card>
            </div>
            <v-btn icon color="error" @click="deleteFlashcard(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
          <div>
            <v-divider class="my-4" />
            <div class="d-flex align-center mt-3 justify-space-between">
              <p class="ml-16 mb-0 font-weight-bold">Front</p>
              <p class="mr-16 mb-0 font-weight-bold">Back</p>
            </div>
          </div>

          <v-row class="align-center mt-3">
            <!-- Front Side -->
            <v-col cols="12" sm="6" class="d-flex align-center">
              <v-card class="image-placeholder mr-2" @click="selectImage(index, 'front')">
                <input
                  type="file"
                  :ref="(el) => setFileInputRef(index, 'front', el)"
                  @change="onImageChange($event, index, 'front')"
                  accept="image/*"
                  hidden
                />
                <v-img v-if="flashcard.frontImage" :src="flashcard.frontImage" contain width="80" height="80" />
                <div v-else class="upload-placeholder">
                  <v-icon size="50">mdi-image-outline</v-icon>
                  <p>Image</p>
                </div>
              </v-card>
              <!-- Editable div for front text -->
              <div
                contenteditable="true"
                class="editable-textarea"
                v-html="flashcard.frontText"
                @input="updateText($event, index, 'frontText')"
                placeholder="Enter front text"
              ></div>
            </v-col>

            <!-- Back Side -->
            <v-col cols="12" sm="6" class="d-flex align-center">
              <!-- Editable div for back text -->
              <div
                contenteditable="true"
                class="editable-textarea"
                v-html="flashcard.backText"
                @input="updateText($event, index, 'backText')"
                placeholder="Enter back text"
              ></div>
              <v-card class="image-placeholder ml-2" @click="selectImage(index, 'back')">
                <input
                  type="file"
                  :ref="(el) => setFileInputRef(index, 'back', el)"
                  @change="onImageChange($event, index, 'back')"
                  accept="image/*"
                  hidden
                />
                <v-img v-if="flashcard.backImage" :src="flashcard.backImage" contain width="80" height="80" />
                <div v-else class="upload-placeholder">
                  <v-icon size="50">mdi-image-outline</v-icon>
                  <p>Image</p>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-container>
    </v-container>
    <v-container v-else class="text-center">
      <v-card class="pa-4">
        <v-card-text class="text-grey-darken-1">
          No flashcards yet. Click "Add Flashcard" to start creating your deck.
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Add Flashcard Button -->
    <v-container class="text-center">
      <v-btn color="primary" @click="addFlashcard" class="mt-4" rounded variant="outlined">
        Add Flashcard
      </v-btn>
    </v-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const deckName = ref('');
const flashcards = ref([]);
const fileInputRefs = ref({});
const selectedFormat = ref(null);

// Undo and Redo (requires contentEditable element)
const undo = () => document.execCommand('undo');
const redo = () => document.execCommand('redo');

// Apply Formatting
const applyFormat = (command) => {
  document.execCommand(command, false, null);
};

// Apply Text Color (Example: Blue)
const applyColor = () => document.execCommand('foreColor', false, '#1976D2');

// Set file input reference dynamically
const setFileInputRef = (index, side, el) => {
  if (!fileInputRefs.value[index]) {
    fileInputRefs.value[index] = {};
  }
  fileInputRefs.value[index][side] = el;
};

// Load flashcards from localStorage
const loadFlashcards = () => {
  const savedFlashcards = localStorage.getItem('flashcards');
  if (savedFlashcards) {
    flashcards.value = JSON.parse(savedFlashcards);
  }
};

// Save flashcards to localStorage
const saveFlashcards = () => {
  localStorage.setItem('flashcards', JSON.stringify(flashcards.value));
};

// Add new flashcard
const addFlashcard = () => {
  flashcards.value.push({
    frontText: '',
    backText: '',
    frontImage: null,
    backImage: null,
  });
  saveFlashcards();
};

// Select image input
const selectImage = (index, side) => {
  if (fileInputRefs.value[index] && fileInputRefs.value[index][side]) {
    fileInputRefs.value[index][side].click();
  }
};

// Handle image upload
const onImageChange = (event, index, side) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      flashcards.value[index][`${side}Image`] = e.target.result;
      saveFlashcards();
    };
    reader.readAsDataURL(file);
  }
};

// Update text content
const updateText = (event, index, field) => {
  flashcards.value[index][field] = event.target.innerHTML;
  saveFlashcards();
};

// Delete flashcard
const deleteFlashcard = (index) => {
  flashcards.value.splice(index, 1);
  saveFlashcards();
};

// Load flashcards on mount
onMounted(loadFlashcards);
</script>

<style scoped>
.editable-textarea {
  width: 100%;
  min-height: 50px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  line-height: 1.5;
  background-color: #fff;
  overflow: auto;
  margin-top: 8px;
}

.editable-textarea:empty:before {
  content: attr(placeholder);
  color: #ccc;
}

.editable-textarea:focus {
  border-color: #1976D2;
  outline: none;
}

.image-placeholder {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #ccc;
  border-radius: 4px;
  width: 80px;
  height: 80px;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #ccc;
}
</style>