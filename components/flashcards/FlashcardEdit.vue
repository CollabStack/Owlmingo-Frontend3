<template>
  <div class="flashcard-edit-container">
    <div class="background-pattern"></div>
    
    <!-- Header with deck name - pass isEditing prop -->
    <flashcard-header
      v-model:deck-name="deckName"
      :disabled="loading"
      :saving="saving"
      :is-editing="editMode"
      @save="saveFlashcard"
    />
    
    <!-- Loading state -->
    <v-container v-if="loading" v-motion-slide-visible-bottom>
      <v-skeleton-loader
        v-if="loading"
        type="card, card, card"
        class="mb-4"
      ></v-skeleton-loader>
    </v-container>
    
    <!-- Flashcard list -->
    <v-container v-else-if="flashcards.length" v-motion-slide-visible-bottom>
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
          <flashcard-card
            :flashcard="flashcard"
            :index="index"
            :is-new="flashcard.isNew"
            :loading-states="imageLoadingStates[index]"
            :removing-states="imageRemovingStates[index]"
            @text-update="handleTextUpdate"
            @delete="confirmDeleteFlashcard(index)"
            @image-upload="(side, file) => onImageChange(file, index, side)"
            @image-remove="(side) => removeImage(index, side)"
            @image-preview="previewImage"
            @show-message="showMessage"
          />
        </template>
      </draggable>
    </v-container>
    
    <!-- Empty state -->
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
    
    <!-- Add card button -->
    <v-container class="text-center pb-10" v-if="flashcards.length && !loading" v-motion-slide-visible-bottom>
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
import { ref, onMounted, nextTick } from 'vue';
import { useFlashcardStore } from '~/store/flashcardStore';
import { useRoute, useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';
import draggable from 'vuedraggable';
import Swal from 'sweetalert2';

// Import our new components
import FlashcardHeader from './components/FlashcardHeader.vue';
import FlashcardCard from './components/FlashcardCard.vue';

const route = useRoute();
const router = useRouter();
const flashcardStore = useFlashcardStore();
const authStore = userAuth();

// Core state
const deckName = ref('');
const flashcards = ref([]);
const loading = ref(false);
const saving = ref(false);
const editMode = ref(false);
const globalId = ref(null);
const mongoId = ref(null); // Add this line to store MongoDB ObjectId

// UI state
const snackbar = ref(false);
const snackbarMessage = ref('');
const imagePreviewDialog = ref(false);
const previewImageSrc = ref('');
const draggedCardIndex = ref(null);

// Tracking states for images
const imageLoadingStates = ref({});
const imageRemovingStates = ref({});

// Debounce timers for text updates
const textUpdateTimers = ref({});

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
      
      // Store both the globalId and _id
      globalId.value = deck.globalId || id;
      mongoId.value = deck._id || null;
      
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
    // Add a small delay to make the transition smoother
    setTimeout(() => {
      loading.value = false;
    }, 300);
  }
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

// Handle text update from child component
const handleTextUpdate = ({ index, field, value }) => {
  flashcards.value[index][field] = value;
  
  if (!editMode.value) {
    // For local storage mode, just save to localStorage
    saveFlashcards();
    return;
  }
  
  // For API mode, use debouncing to avoid excessive API calls
  const cardId = flashcards.value[index]._id;
  if (!cardId) return; // Skip if card doesn't have an ID yet
  
  // Clear previous timer if it exists
  if (textUpdateTimers.value[`${cardId}-${field}`]) {
    clearTimeout(textUpdateTimers.value[`${cardId}-${field}`]);
  }
  
  // Set a new timer
  textUpdateTimers.value[`${cardId}-${field}`] = setTimeout(async () => {
    try {
      const updateData = {};
      
      // Map local field names to API field names
      if (field === 'frontText') {
        updateData.front = value;
      } else if (field === 'backText') {
        updateData.back = value;
      }
      
      // Make sure the store and method exist before calling
      if (!flashcardStore || typeof flashcardStore.updateCard !== 'function') {
        console.error('flashcardStore.updateCard is not available:', flashcardStore);
        throw new Error('Update card functionality is not available');
      }
      
      const result = await flashcardStore.updateCard(
        globalId.value, 
        cardId, 
        updateData
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update card');
      }
      
      console.log(`Card ${cardId} ${field} updated successfully`);
    } catch (err) {
      console.error('Error updating card text:', err);
      showMessage(`Error updating card: ${err.message || 'Unknown error'}`);
    }
  }, 1000); // Wait 1 second after typing stops before sending update
};

// Handle image upload
const onImageChange = async (file, index, side) => {
  if (!file) return;
  
  // Set loading state for specific image
  if (!imageLoadingStates.value[index]) {
    imageLoadingStates.value[index] = {};
  }
  imageLoadingStates.value[index][side] = true;
  
  try {
    if (editMode.value && flashcards.value[index]._id) {
      // If we're editing an existing card, upload the image directly to the API
      const result = await flashcardStore.uploadCardImage(
        globalId.value,
        flashcards.value[index]._id,
        file,
        side // Use 'front' or 'back' directly as passed from the template
      );
      
      if (result.success) {
        // Update the card image with the URL from the API
        if (result.data && result.data.cards) {
          const updatedCard = result.data.cards.find(c => c._id === flashcards.value[index]._id);
          
          if (updatedCard) {
            // In our local state, we use sideImage (frontImage or backImage)
            const imageField = `${side}Image`;
            
            // Make sure we're getting the correct property from the API response
            let imageUrl = null;
            if (updatedCard[imageField]) {
              imageUrl = updatedCard[imageField];
            } else if (updatedCard[`${side}_image`]) {
              imageUrl = updatedCard[`${side}_image`];
            } else if (updatedCard[side]) {
              imageUrl = updatedCard[side];
            }
            
            if (imageUrl) {
              flashcards.value[index][imageField] = imageUrl;
            } else {
              console.warn(`Could not find image URL for ${side} in the response:`, updatedCard);
            }
          } else {
            console.error("Could not find card with ID", flashcards.value[index]._id, "in response");
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
        // Set the correct image property based on side
        const imageField = `${side}Image`;
        flashcards.value[index][imageField] = e.target.result;
        
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
    // Clear loading state for specific image
    if (imageLoadingStates.value[index]) {
      imageLoadingStates.value[index][side] = false;
    }
  }
};

// Remove uploaded image
const removeImage = async (index, side) => {
  try {
    // Set loading state for specific image
    if (!imageLoadingStates.value[index]) {
      imageLoadingStates.value[index] = {};
    }
    imageLoadingStates.value[index][side] = true;
    
    // Set removing state to true
    if (!imageRemovingStates.value[index]) {
      imageRemovingStates.value[index] = {};
    }
    imageRemovingStates.value[index][side] = true;
    
    if (editMode.value && flashcards.value[index]._id) {
      // For existing cards, use the dedicated DELETE endpoint
      const result = await flashcardStore.removeCardImage(
        globalId.value,
        flashcards.value[index]._id,
        side
      );
      
      if (!result.success) {
        throw new Error(result.error || `Failed to remove ${side} image`);
      }
      
      // The card should be updated in the response, but let's ensure the local state is updated
      const imageField = `${side}Image`;
      flashcards.value[index][imageField] = null;
      
      // Force reactivity update by creating a new reference
      flashcards.value = [...flashcards.value];
    } else {
      // For new cards or offline mode, just update local state
      flashcards.value[index][`${side}Image`] = null;
      
      if (!editMode.value) {
        saveFlashcards();
      }
    }
    
    showMessage('Image removed');
  } catch (err) {
    console.error('Error removing image:', err);
    showMessage(`Error removing image: ${err.message || 'Unknown error'}`);
  } finally {
    // Clear loading and removing states
    if (imageLoadingStates.value[index]) {
      imageLoadingStates.value[index][side] = false;
    }
    
    if (imageRemovingStates.value[index]) {
      imageRemovingStates.value[index][side] = false;
    }
  }
};

// Preview image in dialog
const previewImage = (imageSrc) => {
  previewImageSrc.value = imageSrc;
  imagePreviewDialog.value = true;
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
        
        // Use the mongoId for adding cards, as that's what the API expects
        const deckIdForApi = mongoId.value || globalId.value;
        
        // Add new card to the deck
        result = await flashcardStore.addCard(deckIdForApi, {
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
      
      // Reload the deck data to get the latest changes
      await loadFlashcardDeck(globalId.value);
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
            
            // CHANGED: Stay in edit mode by updating the URL without navigating away
            globalId.value = apiResult.data.globalId;
            mongoId.value = apiResult.data._id;
            editMode.value = true;
            
            // Update the URL without full navigation
            const newUrl = `/flashcard/flashcardEdit?id=${apiResult.data.globalId}`;
            window.history.pushState({}, '', newUrl);
            
            // Reload the deck to ensure everything is properly synchronized
            await loadFlashcardDeck(apiResult.data.globalId);
            
            showMessage('Deck saved to your account successfully!');
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

// Display feedback message
const showMessage = (message) => {
  snackbarMessage.value = message;
  snackbar.value = true;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

/* Outfit font classes */
.outfit { font-family: "Outfit", sans-serif; }

.background-pattern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(#7b83e015 1px, rgba(245, 245, 255, 0.8) 1px);
  background-size: 20px 20px;
  z-index: -1;
  pointer-events: none;
}

/* Animation for the add button */
.animated-btn {
  transition: all 0.3s ease;
}

.animated-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Card list transitions for smoother reordering */
.flashcard-list {
  position: relative;
}

.card-list-move {
  transition: transform 0.5s ease;
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
</style>