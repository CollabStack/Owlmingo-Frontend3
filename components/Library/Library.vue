<template>
  <div class="library-container">
    <!-- Section Components -->
    <TagsSection 
      :tags="tags"
      @open-tag-dialog="dialog = true"
      @edit-tag="editTag"
      @confirm-delete="confirmDelete"
    />

    <v-divider class="mb-8"></v-divider>

    <FlashcardsSection 
      :flashcards="flashcards"
      @edit-flashcard="editFlashcard"
      @view-flashcard="viewFlashcard"
      @open-flashcard-dialog="flashcardDialog = true"
      @open-tags-dialog="openTagsDialog"
      @remove-tag-from-item="removeTagFromItem"
    />

    <v-divider class="mb-8"></v-divider>

    <QuizzesSection 
      :quizzes="quizzes"
      :loading="isLoadingQuizzes"
      @edit-quiz="editQuiz"
      @start-quiz="startQuiz"
      @open-quiz-dialog="quizDialog = true"
      @open-tags-dialog="openTagsDialog"
      @remove-tag-from-item="removeTagFromItem"
    />

    <v-divider class="mb-8"></v-divider>

    <SummariesSection 
      :summaries="summaries"
      :loading="isLoadingSummaries"
      @edit-summary="editSummary"
      @view-summary="viewSummary"
      @open-summary-dialog="summaryDialog = true"
      @open-tags-dialog="openTagsDialog"
      @remove-tag-from-item="removeTagFromItem"
      @delete-summary="confirmDeleteSummary"
      @refresh-summaries="refreshSummaries"
    />

    <!-- Dialogs -->
    <!-- Add/Edit Tag Dialog -->
    <v-dialog v-model="dialog" max-width="400" class="rounded-lg">
      <v-card>
        <v-card-title class="text-h6 outfit pa-4">{{ editingIndex === null ? "Create New Tag" : "Edit Tag" }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <v-text-field 
            v-model="newTagName" 
            label="Tag Name" 
            variant="outlined" 
            clearable 
            class="mb-4"
            density="comfortable"
            hide-details
            placeholder="Enter tag name"
            autofocus
          ></v-text-field>
          
          <p class="text-caption text-grey mb-2">Select Color</p>
          <v-color-picker 
            v-model="newTagColor" 
            hide-inputs 
            show-swatches
            :swatches="swatchColors"
            swatches-max-height="120px"
          ></v-color-picker>
        </v-card-text>
        <v-card-actions class="pa-4 pt-2">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="resetDialog" class="outfit">Cancel</v-btn>
          <v-btn 
            color="primary" 
            variant="flat"
            class="outfit" 
            @click="saveTag"
            :disabled="!newTagName.trim()"
          >
            {{ editingIndex === null ? "Create" : "Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400" class="rounded-lg">
      <v-card>
        <v-card-title class="text-h6 outfit pa-4">Delete Tag</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="outfit pa-4">
          Are you sure you want to delete this tag? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4 pt-2">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false" class="outfit">Cancel</v-btn>
          <v-btn color="error" variant="flat" class="outfit" @click="removeTag">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Flashcard Dialog -->
    <v-dialog v-model="flashcardDialog" max-width="400" class="rounded-lg">
      <v-card>
        <v-card-title class="text-h6 outfit pa-4">Create Flashcards</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <p class="text-body-2 text-medium-emphasis mb-4">Choose a method to create your flashcards:</p>
          
          <div class="d-flex flex-column" style="gap: 12px;">
            <nuxt-link to="/flashcard" style="text-decoration: none;">
              <v-btn 
                color="primary" 
                class="action-btn outfit" 
                variant="flat"
                block
                height="44"
              >
                <v-icon start>mdi-robot</v-icon>
                Generate with AI
              </v-btn>
            </nuxt-link>
            <nuxt-link to="/flashcard/flashcards" style="text-decoration: none;">
              <v-btn 
                color="grey-darken-1" 
                variant="outlined" 
                class="action-btn outfit" 
                block
                height="44"
              >
                <v-icon start>mdi-pencil</v-icon>
                Create Manually
              </v-btn>
            </nuxt-link>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="flashcardDialog = false" class="outfit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Quiz Dialog -->
    <v-dialog v-model="quizDialog" max-width="400" class="rounded-lg">
      <v-card>
        <v-card-title class="text-h6 outfit pa-4">Create Quiz</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <p class="text-body-2 text-medium-emphasis mb-4">Choose a method to create your quiz:</p>
          
          <div class="d-flex flex-column" style="gap: 12px;">
            <nuxt-link to="/quiz" style="text-decoration: none;">
              <v-btn 
                color="purple" 
                class="action-btn outfit" 
                variant="flat"
                block
                height="44"
              >
                <v-icon start>mdi-robot</v-icon>
                Generate with AI
              </v-btn>
            </nuxt-link>
            <nuxt-link to="/quiz/review-quiz" style="text-decoration: none;">
              <v-btn 
                color="grey-darken-1" 
                variant="outlined" 
                class="action-btn outfit" 
                block
                height="44"
              >
                <v-icon start>mdi-pencil</v-icon>
                Create Manually
              </v-btn>
            </nuxt-link>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="quizDialog = false" class="outfit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Create Summary Dialog -->
    <v-dialog v-model="summaryDialog" max-width="400" class="rounded-lg">
      <v-card>
        <v-card-title class="text-h6 outfit pa-4">Create Summary</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <p class="text-body-2 text-medium-emphasis mb-4">Choose a method to create your summary:</p>
          
          <div class="d-flex flex-column" style="gap: 12px;">
            <nuxt-link to="/summary" style="text-decoration: none;">
              <v-btn 
                color="teal" 
                class="action-btn outfit" 
                variant="flat"
                block
                height="44"
              >
                <v-icon start>mdi-robot</v-icon>
                Generate with AI
              </v-btn>
            </nuxt-link>
            <nuxt-link to="/summary/create" style="text-decoration: none;">
              <v-btn 
                color="grey-darken-1" 
                variant="outlined" 
                class="action-btn outfit" 
                block
                height="44"
              >
                <v-icon start>mdi-pencil</v-icon>
                Create Manually
              </v-btn>
            </nuxt-link>
          </div>
        </v-card-text>
        <v-card-actions class="pa-4 pt-0">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="summaryDialog = false" class="outfit">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Edit Item Tags Dialog -->
    <v-dialog v-model="tagsDialog" max-width="400" class="rounded-lg">
      <v-card>
        <v-card-title class="text-h6 outfit pa-4">Edit Tags</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pt-4">
          <!-- Currently assigned tags -->
          <p class="text-caption mb-2">Current tags:</p>
          <div class="mb-4 d-flex flex-wrap">
            <v-chip
              v-for="(tag, i) in currentItemTags"
              :key="i"
              :color="tag.color"
              size="small"
              class="mr-2 mb-2 text-white outfit outfit-medium"
              variant="flat"
              closable
              @click:close="removeTagFromCurrentItem(i)"
            >
              {{ tag.name }}
            </v-chip>
            <span v-if="currentItemTags.length === 0" class="text-caption text-grey fst-italic">No tags assigned</span>
          </div>

          <!-- Tag selection -->
          <p class="text-caption mb-2">Available tags:</p>
          <div class="mb-2 d-flex flex-wrap">
            <v-chip
              v-for="(tag, i) in availableTags"
              :key="i"
              :color="tag.color"
              size="small"
              class="mr-2 mb-2 text-white outfit outfit-medium"
              variant="flat"
              @click="addTagToCurrentItem(tag)"
            >
              {{ tag.name }}
            </v-chip>
            <span v-if="availableTags.length === 0" class="text-caption text-grey fst-italic">No additional tags available</span>
          </div>
          
          <v-divider class="my-4"></v-divider>
          
          <!-- Create new tag directly from this dialog -->
          <p class="text-caption mb-2">Create new tag:</p>
          <div class="d-flex align-center mb-2">
            <v-text-field
              v-model="itemTagName"
              label="Tag name"
              variant="outlined"
              hide-details
              density="compact"
              class="mr-2"
              placeholder="Enter tag name"
            ></v-text-field>
            <v-color-picker
              v-model="itemTagColor"
              dot-size="25"
              hide-inputs
              hide-canvas
              swatches-max-height="200"
              mode="hexa"
              :swatches="swatchColors.flat()"
            ></v-color-picker>
          </div>
          
          <v-btn
            color="secondary"
            size="small"
            variant="flat"
            class="mt-2"
            @click="createAndAddTag"
            :disabled="!itemTagName.trim()"
          >
            <v-icon left size="small" class="mr-1">mdi-plus</v-icon>
            Add New Tag
          </v-btn>
        </v-card-text>
        <v-card-actions class="pa-4 pt-2">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeTagsDialog" class="outfit">Done</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Summary Confirmation Dialog -->
    <v-dialog v-model="deleteSummaryDialog" max-width="400" class="rounded-lg">
      <v-card>
        <v-card-title class="text-h6 outfit pa-4">Delete Summary</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="outfit pa-4">
          Are you sure you want to delete this summary? This action cannot be undone.
        </v-card-text>
        <v-card-actions class="pa-4 pt-2">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteSummaryDialog = false" class="outfit">Cancel</v-btn>
          <v-btn color="error" variant="flat" class="outfit" @click="deleteSummary" :loading="isDeleteLoading">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import TagsSection from './TagsSection.vue';
import FlashcardsSection from './FlashcardsSection.vue';
import QuizzesSection from './QuizzesSection.vue';
import SummariesSection from './SummariesSection.vue';
import { useSummaryStore } from '~/store/summaryStore';
import { useRouter } from 'vue-router';
import { useQuizStore } from '~/store/quizStore';

// Tags management
const tags = ref([]);
const dialog = ref(false);
const deleteDialog = ref(false);
const newTagName = ref("");
const newTagColor = ref("#4CAF50");
const editingIndex = ref(null);
const deletingIndex = ref(null);

// Predefined swatch colors
const swatchColors = [
  ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'],
  ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3'],
  ['#03A9F4', '#00BCD4', '#009688', '#607D8B', '#795548', '#9E9E9E'],
];

// Dialogs
const flashcardDialog = ref(false);
const quizDialog = ref(false);
const summaryDialog = ref(false);

// Sample data (Replace this with your actual data from API or store)
const flashcards = ref([
  {
    id: 1,
    title: "Biology Terms",
    subtitle: "Science",
    description: "Key biology terms and definitions covering cell biology and genetics",
    cardCount: 15,
    lastUpdated: "2 days ago",
    tags: [{ name: "Biology", color: "#4CAF50" }]
  },
  {
    id: 2,
    title: "Spanish Vocabulary",
    subtitle: "Language",
    description: "Common Spanish words and phrases for beginners",
    cardCount: 30,
    lastUpdated: "5 days ago",
    tags: [{ name: "Spanish", color: "#FFC107" }]
  }
]);

const summaryStore = useSummaryStore();
const router = useRouter();
const isLoadingSummaries = ref(false);
const summaries = ref([]);

const quizStore = useQuizStore();
const isLoadingQuizzes = ref(false);
const quizzes = ref([]);

onMounted(async () => {
  const savedTags = localStorage.getItem('tags');
  if (savedTags) {
    tags.value = JSON.parse(savedTags);
  }
  
  // Load sample data and apply saved tags
  applySavedTags(flashcards.value, 'flashcard_tags');
  
  // Always show loading state initially
  isLoadingSummaries.value = true;
  isLoadingQuizzes.value = true;
  
  try {
    // Fetch quizzes from API
    const quizResult = await quizStore.fetchQuizSessions();
    if (quizResult.success) {
      quizzes.value = quizStore.quizzes;
      
      // Ensure each quiz has an id property for compatibility with existing code
      quizzes.value.forEach(quiz => {
        if (!quiz.id && quiz.quizId) {
          quiz.id = quiz.quizId;
        }
      });
      
      // Apply saved tags to API-fetched quizzes
      applySavedTags(quizzes.value, 'quiz_tags');
    }
  } catch (error) {
    console.error('Error loading quizzes:', error);
  } finally {
    isLoadingQuizzes.value = false;
  }
  
  try {
    const result = await summaryStore.fetchSummaries(false);
    if (result.success) {
      summaries.value = result.data;
      applySavedTags(summaries.value, 'summary_tags');
    }
  } catch (error) {
    console.error('Error loading summaries:', error);
  } finally {
    isLoadingSummaries.value = false;
  }
});

// Tag management functions
const addTag = () => {
  if (newTagName.value.trim() && newTagColor.value) {
    tags.value.push({ name: newTagName.value, color: newTagColor.value });
    saveToLocalStorage();
    resetDialog();
  }
};

const confirmDelete = (index) => {
  deletingIndex.value = index;
  deleteDialog.value = true;
};

const removeTag = () => {
  if (deletingIndex.value !== null) {
    tags.value.splice(deletingIndex.value, 1);
    saveToLocalStorage();
    deleteDialog.value = false;
    deletingIndex.value = null;
  }
};

const editTag = (index) => {
  editingIndex.value = index;
  newTagName.value = tags.value[index].name;
  newTagColor.value = tags.value[index].color;
  dialog.value = true;
};

const saveTag = () => {
  if (editingIndex.value !== null) {
    tags.value[editingIndex.value] = { name: newTagName.value, color: newTagColor.value };
  } else {
    addTag();
  }
  saveToLocalStorage();
  resetDialog();
};

const saveToLocalStorage = () => {
  localStorage.setItem('tags', JSON.stringify(tags.value));
};

const resetDialog = () => {
  dialog.value = false;
  newTagName.value = "";
  newTagColor.value = "#4CAF50";
  editingIndex.value = null;
};

// Flashcard action handlers
const editFlashcard = (id) => {
  console.log(`Editing flashcard with ID: ${id}`);
  // Implement navigation to edit page
};

const viewFlashcard = (id) => {
  console.log(`Viewing flashcard with ID: ${id}`);
  // Implement navigation to view/study page
};

// Quiz action handlers
const editQuiz = (id) => {
  console.log(`Editing quiz with ID: ${id}`);
  // Implement navigation to edit quiz page
};

const startQuiz = (id) => {
  console.log(`Starting quiz with ID: ${id}`);
  router.push(`/quiz/do-quiz?id=${id}`);
};

// Summary action handlers
const editSummary = (id) => {
  console.log(`Editing summary with ID: ${id}`);
  router.push(`/summary/edit/${id}`);
};

const viewSummary = async (id) => {
  console.log(`Viewing summary with ID: ${id}`);
  try {
    const result = await summaryStore.fetchSummaryById(id);
    if (result.success) {
      // Navigate to summary view page
      router.push(`/summary/view/${id}`);
    }
  } catch (error) {
    console.error(`Error loading summary ${id}:`, error);
  }
};

// Tags dialog
const tagsDialog = ref(false);
const currentItemType = ref(null);
const currentItemId = ref(null);
const currentItemTags = ref([]);
const itemTagName = ref('');
const itemTagColor = ref('#4CAF50');

// Computed property to get available tags (tags that aren't already assigned to the current item)
const availableTags = computed(() => {
  const currentTagIds = currentItemTags.value.map(tag => tag.name);
  return tags.value.filter(tag => !currentTagIds.includes(tag.name));
});

// Function to open the tags dialog for a specific item
const openTagsDialog = (type, id) => {
  currentItemType.value = type;
  currentItemId.value = id;
  
  // Find the current item and copy its tags
  let item;
  if (type === 'flashcard') {
    item = flashcards.value.find(card => card.id === id);
  } else if (type === 'quiz') {
    // Check both id and quizId for compatibility
    item = quizzes.value.find(quiz => quiz.id === id || quiz.quizId === id);
  } else if (type === 'summary') {
    item = summaries.value.find(summary => summary.id === id);
  }
  
  if (item) {
    currentItemTags.value = [...(item.tags || [])];
  } else {
    currentItemTags.value = [];
  }
  
  tagsDialog.value = true;
};

// Function to close the tags dialog and save changes
const closeTagsDialog = () => {
  // Update the item's tags
  if (currentItemType.value && currentItemId.value) {
    let items;
    if (currentItemType.value === 'flashcard') {
      items = flashcards.value;
    } else if (currentItemType.value === 'quiz') {
      items = quizzes.value;
    } else if (currentItemType.value === 'summary') {
      items = summaries.value;
    }
    
    const itemIndex = items.findIndex(item => item.id === currentItemId.value);
    
    if (itemIndex !== -1) {
      items[itemIndex].tags = [...currentItemTags.value];
      
      // Save the tag assignments to localStorage based on item type
      if (currentItemType.value === 'flashcard') {
        saveFlashcardTags();
      } else if (currentItemType.value === 'quiz') {
        saveQuizTags();
      } else if (currentItemType.value === 'summary') {
        saveSummaryTags();
      }
    }
  }
  
  // Reset current item and close dialog
  currentItemType.value = null;
  currentItemId.value = null;
  tagsDialog.value = false;
  itemTagName.value = '';
  itemTagColor.value = '#4CAF50';
};

// Function to remove a tag from the current item in the dialog
const removeTagFromCurrentItem = (index) => {
  currentItemTags.value.splice(index, 1);
};

// Function to add a tag to the current item in the dialog
const addTagToCurrentItem = (tag) => {
  currentItemTags.value.push({ ...tag });
};

// Function to create and add a new tag
const createAndAddTag = () => {
  if (!itemTagName.value.trim()) return;
  
  // Create the tag if it doesn't exist
  const tagExists = tags.value.some(tag => tag.name === itemTagName.value);
  
  if (!tagExists) {
    const newTag = { name: itemTagName.value, color: itemTagColor.value };
    tags.value.push(newTag);
    saveToLocalStorage();
  }
  
  // Add the tag to the current item
  const existingTagIndex = currentItemTags.value.findIndex(tag => tag.name === itemTagName.value);
  if (existingTagIndex === -1) {
    currentItemTags.value.push({ name: itemTagName.value, color: itemTagColor.value });
  }
  
  // Reset the new tag inputs
  itemTagName.value = '';
};

// Function to remove a tag from an item directly from the card
const removeTagFromItem = ({ id, tagIndex }) => {
  // Find the item type and remove the tag
  const findAndRemoveTag = (items, type) => {
    // For quizzes, check both id and quizId
    const itemIndex = type === 'quiz' 
      ? items.findIndex(item => item.id === id || item.quizId === id)
      : items.findIndex(item => item.id === id);
      
    if (itemIndex !== -1 && items[itemIndex].tags && items[itemIndex].tags[tagIndex]) {
      items[itemIndex].tags.splice(tagIndex, 1);
      
      // Save changes to localStorage
      if (type === 'flashcard') {
        saveFlashcardTags();
      } else if (type === 'quiz') {
        saveQuizTags();
      } else if (type === 'summary') {
        saveSummaryTags();
      }
      return true;
    }
    return false;
  };
  
  // Try each item type
  if (findAndRemoveTag(flashcards.value, 'flashcard')) return;
  if (findAndRemoveTag(quizzes.value, 'quiz')) return;
  if (findAndRemoveTag(summaries.value, 'summary')) return;
};

const saveFlashcardTags = () => {
  const tagMap = {};
  flashcards.value.forEach(card => {
    if (card.tags && card.tags.length > 0) {
      tagMap[card.id] = card.tags;
    }
  });
  localStorage.setItem('flashcard_tags', JSON.stringify(tagMap));
};

const saveQuizTags = () => {
  const tagMap = {};
  quizzes.value.forEach(quiz => {
    if (quiz.tags && quiz.tags.length > 0) {
      // Use quizId if available, otherwise fall back to id
      const idToUse = quiz.quizId || quiz.id;
      if (idToUse) {
        tagMap[idToUse] = quiz.tags;
      }
    }
  });
  localStorage.setItem('quiz_tags', JSON.stringify(tagMap));
};

const saveSummaryTags = () => {
  const tagMap = {};
  summaries.value.forEach(summary => {
    if (summary.tags && summary.tags.length > 0) {
      tagMap[summary.id] = summary.tags;
    }
  });
  localStorage.setItem('summary_tags', JSON.stringify(tagMap));
};

const applySavedTags = (items, storageKey) => {
  try {
    const savedTags = localStorage.getItem(storageKey);
    if (savedTags) {
      const tagMap = JSON.parse(savedTags);
      items.forEach(item => {
        // For quizzes, check the quizId first, then fallback to id
        const idToCheck = (storageKey === 'quiz_tags' && item.quizId) ? item.quizId : item.id;
        if (tagMap[idToCheck]) {
          item.tags = tagMap[idToCheck];
        }
      });
    }
  } catch (error) {
    console.error(`Error applying saved tags from ${storageKey}:`, error);
  }
};

// Delete Summary functionality
const deleteSummaryDialog = ref(false);
const deletingSummaryId = ref(null);
const isDeleteLoading = ref(false);

// Delete summary handlers
const confirmDeleteSummary = (id) => {
  deletingSummaryId.value = id;
  deleteSummaryDialog.value = true;
};

const deleteSummary = async () => {
  if (!deletingSummaryId.value) return;
  
  isDeleteLoading.value = true;
  try {
    // Make sure summaryStore is defined and has the deleteSummary method
    if (!summaryStore || typeof summaryStore.deleteSummary !== 'function') {
      console.error('summaryStore.deleteSummary is not available', summaryStore);
      throw new Error('Delete functionality is not available');
    }
    
    // Using `id` parameter consistently
    const result = await summaryStore.deleteSummary(deletingSummaryId.value);
    
    if (result.success) {
      // Remove from the local list if not already done by the store
      summaries.value = summaries.value.filter(summary => summary.id !== deletingSummaryId.value);
      deleteSummaryDialog.value = false;
    } else {
      alert(result.error || 'Failed to delete summary');
    }
  } catch (error) {
    console.error('Error deleting summary:', error);
    alert('An error occurred while deleting the summary');
  } finally {
    isDeleteLoading.value = false;
    deletingSummaryId.value = null;
  }
};

const refreshSummaries = async () => {
  isLoadingSummaries.value = true;
  try {
    const result = await summaryStore.fetchSummaries(true);
    if (result.success) {
      summaries.value = result.data;
      applySavedTags(summaries.value, 'summary_tags');
    }
  } catch (error) {
    console.error('Error refreshing summaries:', error);
  } finally {
    isLoadingSummaries.value = false;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

.library-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem;
}

.outfit {
  font-family: 'Outfit', sans-serif;
}

.outfit-medium {
  font-weight: 500;
}

.outfit-semibold {
  font-weight: 600;
}

.outfit-bold {
  font-weight: 700;
}

/* Action button styling */
.action-btn {
  transition: all 0.25s ease;
  border-radius: 6px;
  letter-spacing: 0.015em;
  text-transform: none;
  font-size: 0.875rem;
  font-weight: 500;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}

.action-btn:active {
  transform: translateY(1px);
}

/* Empty state styling */
.empty-state {
  transition: all 0.3s ease;
  background: linear-gradient(145deg, #ffffff, #fafafa);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0,0,0,0.05);
}

.empty-state:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  border-color: rgba(0,0,0,0);
}

/* Dialog styling */
:deep(.v-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.v-card) {
  border-radius: 12px;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .library-container {
    padding: 0.5rem;
  }
  
  .empty-state {
    padding: 1.5rem !important;
  }
}
</style>
