<template>
  <div class="flashcard-edit-container">
    <div class="background-pattern"></div>
    <v-container class="py-6" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <div class="d-flex flex-column flex-md-row align-md-center justify-space-between mb-4">
        <h1 class="text-h4 outfit outfit-bold gradient-text mb-4 mb-md-0">Create Flashcard Deck</h1>
        <v-btn 
          color="primary" 
          variant="elevated" 
          class="animated-btn outfit outfit-medium"
          prepend-icon="mdi-check"
          rounded="xl"
          elevation="1"
          @click="saveFlashcard"
        >
          Save Deck
        </v-btn>
      </div>
    </v-container>
    <v-container class="mb-6" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200 } }">
      <v-card class="pa-4 rounded-xl content-card" elevation="2">
        <v-card-title class="text-h5 outfit outfit-semibold mb-2">Deck Name</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="deckName"
            label="Enter a name for your deck"
            variant="outlined"
            placeholder="e.g., Biology Terms, Spanish Vocabulary"
            density="comfortable"
            class="clean-input mb-2"
            bg-color="white"
            hide-details
            clearable
          ></v-text-field>
          <p class="text-caption text-grey-darken-2 outfit outfit-regular mt-2 d-flex align-center">
            <v-icon size="small" color="grey-darken-1" class="me-1">mdi-information-outline</v-icon>
            All changes are automatically saved to your browser.
          </p>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container v-motion-slide-visible-bottom>
      <draggable 
        v-model="flashcards" 
        tag="div" 
        class="flashcard-list"
        :item-key="(card, index) => index" 
        handle=".drag-handle"
        :animation="300"
        @end="handleDragEnd"
        @start="handleDragStart"
        ghost-class="ghost-card"
        chosen-class="chosen-card"
      >
        <template v-slot:item="{element: flashcard, index}">
          <v-card 
            :key="index"
            class="pa-4 mb-5 rounded-xl flashcard-item content-card" 
            :class="{'new-card': flashcard.isNew}"
            elevation="1"
            v-motion
            :initial="{ opacity: 0, y: flashcard.isNew ? 0 : 20 }"
            :enter="{ 
              opacity: 1, 
              y: 0, 
              transition: { 
                duration: flashcard.isNew ? 300 : 500, 
                delay: flashcard.isNew ? 0 : Math.min(index * 50, 300) 
              } 
            }"
          >
            <div class="d-flex justify-space-between align-center mb-2">
              <div class="d-flex align-center">
                <div class="drag-handle me-2">
                  <v-icon size="small" color="grey" class="drag-icon">mdi-drag</v-icon>
                </div>
                <v-avatar size="36" color="primary" class="me-3 card-number">
                  <span class="text-white outfit outfit-medium">{{ index + 1 }}</span>
                </v-avatar>
                <span class="text-subtitle-1 outfit outfit-medium">Card {{ index + 1 }}</span>
              </div>
              <div class="d-flex">
                <v-card class="me-3 editor-toolbar" rounded="lg" elevation="0">
                  <v-btn-toggle class="d-flex align-center flex-wrap" v-model="selectedFormat" density="comfortable">
                    <v-btn icon size="small" @click="undo" variant="text"><v-icon size="small">mdi-undo</v-icon></v-btn>
                    <v-btn icon size="small" @click="redo" variant="text"><v-icon size="small">mdi-redo</v-icon></v-btn>
                    <v-divider vertical class="mx-1"></v-divider>
                    <v-btn icon size="small" @click="applyFormat('bold')" variant="text"><v-icon size="small">mdi-format-bold</v-icon></v-btn>
                    <v-btn icon size="small" @click="applyFormat('italic')" variant="text"><v-icon size="small">mdi-format-italic</v-icon></v-btn>
                    <v-btn icon size="small" @click="applyFormat('underline')" variant="text"><v-icon size="small">mdi-format-underline</v-icon></v-btn>
                    <v-divider vertical class="mx-1"></v-divider>
                    <v-btn icon size="small" @click="applyFormat('insertUnorderedList')" variant="text"><v-icon size="small">mdi-format-list-bulleted</v-icon></v-btn>
                    <v-btn icon size="small" @click="applyFormat('insertOrderedList')" variant="text"><v-icon size="small">mdi-format-list-numbered</v-icon></v-btn>
                  </v-btn-toggle>
                </v-card>
                <v-btn 
                  icon 
                  color="error" 
                  size="small" 
                  @click="confirmDeleteFlashcard(index)"
                  variant="text"
                  class="delete-btn"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
            <v-divider class="mb-4"></v-divider>
            <v-row>
              <v-col cols="12" md="6" class="card-side">
                <div class="side-label d-flex align-center mb-2">
                  <v-icon size="small" color="primary" class="me-2">mdi-card-text-outline</v-icon>
                  <span class="text-subtitle-2 outfit outfit-medium">Front Side</span>
                </div>
                <div class="card-content-wrapper">
                  <div class="image-upload-container">
                    <v-card 
                      class="upload-image-btn" 
                      @click="selectImage(index, 'front')" 
                      elevation="1"
                      :class="{'has-image': flashcard.frontImage}"
                    >
                      <input
                        type="file"
                        :ref="(el) => setFileInputRef(index, 'front', el)"
                        @change="onImageChange($event, index, 'front')"
                        accept="image/*"
                        hidden
                      />
                      <v-img 
                        v-if="flashcard.frontImage" 
                        :src="flashcard.frontImage" 
                        contain 
                        height="120"
                        width="120"
                        class="image-preview"
                        @click.stop="previewImage(flashcard.frontImage)"
                      />
                      <div v-else class="upload-placeholder">
                        <v-icon size="36" color="primary" class="upload-icon">mdi-image-plus</v-icon>
                        <span class="upload-text outfit outfit-medium">Add Image</span>
                      </div>
                    </v-card>
                    <div class="image-actions" v-if="flashcard.frontImage">
                      <v-btn 
                        icon 
                        size="x-small" 
                        color="error" 
                        variant="tonal" 
                        class="remove-image-btn"
                        @click.stop="removeImage(index, 'front')"
                      >
                        <v-icon size="small">mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div
                    contenteditable="true"
                    class="editable-textarea"
                    v-html="flashcard.frontText"
                    @input="updateText($event, index, 'frontText')"
                    placeholder="Enter term or question here"
                  ></div>
                </div>
              </v-col>
              <v-col cols="12" md="6" class="card-side">
                <div class="side-label d-flex align-center mb-2">
                  <v-icon size="small" color="secondary" class="me-2">mdi-card-text</v-icon>
                  <span class="text-subtitle-2 outfit outfit-medium">Back Side</span>
                </div>
                <div class="card-content-wrapper">
                  <div class="image-upload-container">
                    <v-card 
                      class="upload-image-btn" 
                      @click="selectImage(index, 'back')" 
                      elevation="1"
                      :class="{'has-image': flashcard.backImage}"
                    >
                      <input
                        type="file"
                        :ref="(el) => setFileInputRef(index, 'back', el)"
                        @change="onImageChange($event, index, 'back')"
                        accept="image/*"
                        hidden
                      />
                      <v-img 
                        v-if="flashcard.backImage" 
                        :src="flashcard.backImage" 
                        contain 
                        height="120"
                        width="120"
                        class="image-preview"
                        @click.stop="previewImage(flashcard.backImage)"
                      />
                      <div v-else class="upload-placeholder">
                        <v-icon size="36" color="primary" class="upload-icon">mdi-image-plus</v-icon>
                        <span class="upload-text outfit outfit-medium">Add Image</span>
                      </div>
                    </v-card>
                    <div class="image-actions" v-if="flashcard.backImage">
                      <v-btn 
                        icon 
                        size="x-small" 
                        color="error" 
                        variant="tonal" 
                        class="remove-image-btn"
                        @click.stop="removeImage(index, 'back')"
                      >
                        <v-icon size="small">mdi-close</v-icon>
                      </v-btn>
                    </div>
                  </div>
                  <div
                    contenteditable="true"
                    class="editable-textarea"
                    v-html="flashcard.backText"
                    @input="updateText($event, index, 'backText')"
                    placeholder="Enter definition or answer here"
                  ></div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </template>
      </draggable>
    </v-container>
    <v-container v-if="!flashcards.length" class="text-center py-10" v-motion-slide-visible-bottom>
      <v-card class="pa-8 rounded-xl content-card" elevation="1">
        <v-icon size="64" color="primary" class="mb-4">mdi-cards-outline</v-icon>
        <h3 class="text-h5 outfit outfit-semibold mb-3">No flashcards yet</h3>
        <p class="text-body-1 text-medium-emphasis mb-6 outfit outfit-regular">
          Click the button below to create your first flashcard
        </p>
        <v-btn 
          color="primary" 
          class="action-btn outfit"
          variant="elevated"
          prepend-icon="mdi-plus"
          rounded="xl"
          @click="addFlashcard"
        >
          Add Your First Flashcard
        </v-btn>
      </v-card>
    </v-container>
    <v-container class="text-center pb-10" v-if="flashcards.length" v-motion-slide-visible-bottom>
      <v-btn 
        color="primary" 
        class="animated-btn outfit outfit-medium px-6 py-2" 
        prepend-icon="mdi-plus"
        variant="outlined" 
        rounded="xl"
        @click="addFlashcard"
        elevation="1"
      >
        Add Flashcard
      </v-btn>
    </v-container>
  </div>

  <!-- Image Preview Dialog -->
  <v-dialog v-model="imagePreviewDialog" max-width="90vw" class="image-preview-dialog">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center pa-4">
        <span class="text-h6 outfit outfit-medium">Image Preview</span>
        <v-btn icon variant="text" @click="imagePreviewDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="text-center pa-0">
        <v-img
          :src="previewImageSrc"
          max-height="80vh"
          contain
          class="mx-auto"
        ></v-img>
      </v-card-text>
    </v-card>
  </v-dialog>
  
  <!-- Snackbar for Feedback -->
  <v-snackbar v-model="snackbar" :timeout="3000" location="bottom">
    {{ snackbarMessage }}
    <template v-slot:actions>
      <v-btn color="white" text @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { useFlashcardStore } from '~/store/flashcardStore';
import { useRoute, useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';
import draggable from 'vuedraggable';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const flashcardStore = useFlashcardStore();
const authStore = userAuth();

const deckName = ref('');
const flashcards = ref([]);
const fileInputRefs = ref({});
const selectedFormat = ref(null);
const snackbar = ref(false);
const snackbarMessage = ref('');
const imagePreviewDialog = ref(false);
const previewImageSrc = ref('');
const draggedCardIndex = ref(null);
const loading = ref(false);
const saving = ref(false);
const editMode = ref(false);
const globalId = ref(null);

// Check if we're editing an existing deck or creating a new one
onMounted(async () => {
  // Check if we have a deck ID in the query parameters
  const id = route.query.id;
  if (id) {
    globalId.value = id;
    editMode.value = true;
    await loadFlashcardDeck(id);
  } else {
    // Load from localStorage for new deck
    loadFlashcards();
  }
});

// Load flashcard deck from API
const loadFlashcardDeck = async (id) => {
  try {
    loading.value = true;
    
    if (!authStore.isLoggedIn) {
      router.push('/auth');
      return;
    }
    
    const result = await flashcardStore.getDeck(id);
    
    if (!result.authenticated) {
      router.push('/auth');
      return;
    }
    
    if (result.success) {
      const deck = result.data;
      deckName.value = deck.flash_card_title || 'Untitled Deck';
      
      // Format the cards for the editor
      if (deck.cards && deck.cards.length > 0) {
        flashcards.value = deck.cards.map(card => ({
          _id: card._id,
          frontText: card.front,
          backText: card.back,
          frontImage: card.frontImage || null,
          backImage: card.backImage || null,
          category: card.category,
          difficulty: card.difficulty,
          status: card.status,
          nextReviewDate: card.nextReviewDate
        }));
      } else {
        // Start with an empty card if the deck exists but has no cards
        addFlashcard();
      }
    } else {
      showMessage(`Failed to load flashcard deck: ${result.error}`);
      // Start with an empty card
      addFlashcard();
    }
  } catch (err) {
    console.error('Error loading flashcard deck:', err);
    showMessage(`Error: ${err.message || 'Unknown error'}`);
    // Start with an empty card
    addFlashcard();
  } finally {
    loading.value = false;
  }
};

// Undo and Redo (requires contentEditable element)
const undo = () => document.execCommand('undo');
const redo = () => document.execCommand('redo');

// Apply Formatting
const applyFormat = (command) => {
  document.execCommand(command, false, null);
};

// Set file input reference dynamically
const setFileInputRef = (index, side, el) => {
  if (!fileInputRefs.value[index]) {
    fileInputRefs.value[index] = {};
  }
  fileInputRefs.value[index][side] = el;
};

// Load flashcards from localStorage (for new decks only)
const loadFlashcards = () => {
  if (editMode.value) return;
  
  const savedDeckName = localStorage.getItem('flashcardDeckName');
  if (savedDeckName) {
    deckName.value = savedDeckName;
  }
  
  const savedFlashcards = localStorage.getItem('flashcards');
  if (savedFlashcards) {
    flashcards.value = JSON.parse(savedFlashcards);
  }
  
  // Always ensure at least one empty card
  if (!flashcards.value.length) {
    addFlashcard();
  }
};

// Save flashcards to localStorage (only for new decks)
const saveFlashcards = () => {
  if (editMode.value) return;
  
  localStorage.setItem('flashcards', JSON.stringify(flashcards.value));
};

// Add new flashcard with improved performance
const addFlashcard = () => {
  // Create new flashcard
  const newIndex = flashcards.value.length;
  flashcards.value.push({
    frontText: '',
    backText: '',
    frontImage: null,
    backImage: null,
    category: 'General',
    difficulty: 'Medium',
    isNew: true  // Flag for new cards to handle animations differently
  });
  
  if (!editMode.value) {
    saveFlashcards();
  }
  
  // Immediately scroll to the new card without delay
  nextTick(() => {
    const elements = document.querySelectorAll('.flashcard-item');
    const newElement = elements[elements.length - 1];
    if (newElement) {
      newElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    // Remove the "new" flag after animations complete
    setTimeout(() => {
      if (flashcards.value[newIndex]) {
        flashcards.value[newIndex].isNew = false;
      }
    }, 1000);
  });
};

// Select image input
const selectImage = (index, side) => {
  if (fileInputRefs.value[index] && fileInputRefs.value[index][side]) {
    fileInputRefs.value[index][side].click();
  }
};

// Handle image upload
const onImageChange = async (event, index, side) => {
  const file = event.target.files[0];
  if (!file) return;
  
  // File size validation (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showMessage('Image is too large. Please upload an image smaller than 5MB.');
    return;
  }
  
  try {
    if (editMode.value && flashcards.value[index]._id) {
      // If we're editing an existing card, upload the image directly to the API
      loading.value = true;
      const result = await flashcardStore.uploadCardImage(
        globalId.value,
        flashcards.value[index]._id,
        file,
        side === 'frontImage' ? 'front' : 'back'
      );
      
      if (result.success) {
        // Update the card image with the URL from the API
        if (result.data && result.data.cards) {
          const updatedCard = result.data.cards.find(c => c._id === flashcards.value[index]._id);
          if (updatedCard) {
            flashcards.value[index][side] = side === 'frontImage' 
              ? updatedCard.frontImage 
              : updatedCard.backImage;
          }
        }
        
        showMessage('Image uploaded successfully');
      } else {
        throw new Error(result.error || 'Failed to upload image');
      }
    } else {
      // For new cards or offline mode, use local storage
      const reader = new FileReader();
      reader.onload = (e) => {
        flashcards.value[index][side] = e.target.result;
        if (!editMode.value) {
          saveFlashcards();
        }
        showMessage('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  } catch (err) {
    console.error('Error uploading image:', err);
    showMessage(`Error uploading image: ${err.message || 'Unknown error'}`);
  } finally {
    loading.value = false;
  }
};

// Remove uploaded image
const removeImage = async (index, side) => {
  try {
    if (editMode.value && flashcards.value[index]._id) {
      // For existing cards, need to update via API
      loading.value = true;
      
      // Prepare update data
      const updateData = {
        _id: flashcards.value[index]._id,
      };
      
      // Set the appropriate field to null
      if (side === 'front') {
        updateData.frontImage = null;
      } else if (side === 'back') {
        updateData.backImage = null;
      }
      
      const result = await flashcardStore.updateDeck(globalId.value, updateData);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to remove image');
      }
    }
    
    // Update local state
    flashcards.value[index][`${side}Image`] = null;
    
    if (!editMode.value) {
      saveFlashcards();
    }
    
    showMessage('Image removed');
  } catch (err) {
    console.error('Error removing image:', err);
    showMessage(`Error removing image: ${err.message || 'Unknown error'}`);
  } finally {
    loading.value = false;
  }
};

// Preview image in dialog
const previewImage = (imageSrc) => {
  previewImageSrc.value = imageSrc;
  imagePreviewDialog.value = true;
};

// Update text content
const updateText = (event, index, field) => {
  flashcards.value[index][field] = event.target.innerHTML;
  
  if (!editMode.value) {
    saveFlashcards();
  }
};

// Delete flashcard
const confirmDeleteFlashcard = (index) => {
  Swal.fire({
    title: 'Delete Card',
    text: 'Are you sure you want to delete this card?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteFlashcard(index);
    }
  });
};

const deleteFlashcard = async (index) => {
  try {
    if (editMode.value && globalId.value && flashcards.value[index]._id) {
      // Delete the card via API
      loading.value = true;
      const result = await flashcardStore.deleteCard(globalId.value, flashcards.value[index]._id);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to delete card');
      }
    }
    
    // Update local state
    flashcards.value.splice(index, 1);
    
    if (!editMode.value) {
      saveFlashcards();
    }
    
    showMessage('Card deleted successfully');
  } catch (err) {
    console.error('Error deleting card:', err);
    showMessage(`Error deleting card: ${err.message || 'Unknown error'}`);
  } finally {
    loading.value = false;
  }
};

// Update indices after drag and drop
const handleDragEnd = () => {
  if (!editMode.value) {
    saveFlashcards();
  }
  showMessage('Card order updated');
};

// Drag start handler
const handleDragStart = (index) => {
  draggedCardIndex.value = index;
};

// Save flashcard deck to API or localStorage
const saveFlashcard = async () => {
  if (!deckName.value) {
    showMessage('Please enter a deck name');
    return;
  }
  
  try {
    saving.value = true;
    
    if (editMode.value && globalId.value) {
      // Save to API
      if (!authStore.isLoggedIn) {
        router.push('/auth');
        return;
      }
      
      // First update the deck title
      let result = await flashcardStore.updateDeck(globalId.value, {
        flash_card_title: deckName.value
      });
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update deck title');
      }
      
      // Then save any new/modified cards
      for (const card of flashcards.value) {
        // Skip cards that already have an _id (they should be updated separately when modified)
        if (card._id) continue;
        
        // Add new card to the deck
        result = await flashcardStore.addCard(globalId.value, {
          front: card.frontText,
          back: card.backText,
          category: card.category || 'General',
          difficulty: card.difficulty || 'Medium'
        });
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to add card to deck');
        }
      }
      
      showMessage('Flashcard deck saved successfully!');
    } else {
      // Save to localStorage
      localStorage.setItem('flashcardDeckName', deckName.value);
      saveFlashcards();
      showMessage('Flashcard deck saved to browser storage');
      
      // Ask if user wants to save to their account
      if (authStore.isLoggedIn) {
        const confirmResult = await Swal.fire({
          title: 'Save to Account?',
          text: 'Would you like to save this flashcard deck to your account?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Yes, save it',
          cancelButtonText: 'No, just keep locally'
        });
        
        if (confirmResult.isConfirmed) {
          // Create a new deck on the server
          const apiResult = await flashcardStore.generateFlashcards(
            flashcards.value.map(card => ({
              front: card.frontText,
              back: card.backText,
              category: card.category || 'General',
              difficulty: card.difficulty || 'Medium'
            })),
            'custom'
          );
          
          if (apiResult.success) {
            // Clear local storage now that it's saved to the account
            localStorage.removeItem('flashcardDeckName');
            localStorage.removeItem('flashcards');
            
            // Navigate to the new deck
            router.push(`/flashcard/flashcardView?id=${apiResult.data.globalId}`);
          } else {
            throw new Error(apiResult.error || 'Failed to save deck to account');
          }
        }
      }
    }
  } catch (err) {
    console.error('Error saving flashcard deck:', err);
    showMessage(`Error saving deck: ${err.message || 'Unknown error'}`);
  } finally {
    saving.value = false;
  }
};

const showMessage = (message) => {
  snackbarMessage.value = message;
  snackbar.value = true;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Outfit font classes */
.outfit { font-family: "Outfit", sans-serif; }

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

/* Image Upload Styling */
.image-upload-container {
  position: relative;
  margin-bottom: 10px;
  display: inline-block;
}

.upload-image-btn {
  cursor: pointer;
  border-radius: 12px;
  min-width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(245, 246, 255, 0.9);
  border: 2px dashed rgba(123, 131, 224, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  margin: 4px;
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

/* Improve layout on mobile */
@media (max-width: 600px) {
  .card-content-wrapper {
    flex-direction: column;
    align-items: center;
  }
  
  .upload-image-btn {
    width: 100%;
    margin-bottom: 12px;
  }
  
  .editable-textarea {
    width: 100%;
  }
}

/* Updated layout styling */
.card-content-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.image-upload-container {
  position: relative;
  margin-right: 12px;
  flex-shrink: 0;
}

.upload-image-btn {
  cursor: pointer;
  border-radius: 12px;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(245, 246, 255, 0.9);
  border: 2px dashed rgba(123, 131, 224, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
}

.editable-textarea {
  flex-grow: 1;
  min-height: 120px;
  padding: 12px;
  border: 1px solid rgba(123, 131, 224, 0.2);
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.5;
  background-color: white;
  overflow: auto;
  transition: all 0.3s ease;
  margin-top: 0;
}

/* Improve layout on mobile */
@media (max-width: 600px) {
  .card-content-wrapper {
    flex-direction: column;
    align-items: center;
  }
  
  .image-upload-container {
    margin-right: 0;
    margin-bottom: 12px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .upload-image-btn {
    width: 100%;
    max-width: 200px;
  }
  
  .editable-textarea {
    width: 100%;
  }
}

/* Fast appearing animation for new cards */
.new-card {
  animation: highlight-new 0.6s ease-out;
}

@keyframes highlight-new {
  0% {
    box-shadow: 0 0 0 2px rgba(123, 131, 224, 0.5);
    transform: translateY(10px);
  }
  100% {
    box-shadow: 0 8px 20px rgba(123, 131, 224, 0.08);
    transform: translateY(0);
  }
}

/* Fix animation timing */
.card-list-enter-active {
  transition: all 0.3s ease-out;
}

.card-list-move {
  transition: transform 0.3s ease;
}

/* Drag and drop styling */
.drag-handle {
  cursor: grab;
  padding: 4px;
  display: flex;
  align-items: center;
  opacity: 0.5;
  transition: all 0.2s ease;
  border-radius: 4px;
}

.drag-handle:hover {
  opacity: 1;
  background-color: rgba(123, 131, 224, 0.1);
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-icon {
  transition: transform 0.2s ease;
}

.drag-handle:hover .drag-icon {
  transform: scale(1.2);
}

.ghost-card {
  opacity: 0.5;
  background: #f7f7ff !important;
  border: 2px dashed rgba(123, 131, 224, 0.4) !important;
  transform: rotate(1deg);
}

.chosen-card {
  box-shadow: 0 10px 20px rgba(123, 131, 224, 0.2) !important;
}

/* Updated card list transitions for smoother reordering */
.flashcard-list {
  position: relative;
}

.card-list-move {
  transition: transform 0.5s ease;
}

.card-list-enter-active {
  transition: all 0.3s ease-in;
}

.card-list-leave-active {
  transition: all 0.3s ease-out;
  position: absolute;
  width: 100%;
}

.card-list-enter-from,
.card-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>



