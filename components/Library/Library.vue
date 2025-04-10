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
      :loading="isLoadingFlashcards"
      @edit-flashcard="editFlashcard"
      @view-flashcard="viewFlashcard"
      @open-flashcard-dialog="flashcardDialog = true"
      @open-tags-dialog="openTagsDialog"
      @remove-tag-from-item="removeTagFromItem"
      @refresh-flashcards="refreshFlashcards"
      @delete-flashcard="confirmDeleteFlashcard"
    />

    <v-divider class="mb-8"></v-divider>

    <QuizzesSection 
      :quizzes="mappedQuizzes"
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
import { useFlashcardStore } from '~/store/flashcardStore';
import { useQuizStore } from '~/store/quizStore'; // Import quiz store
import { useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';
import Swal from 'sweetalert2';

// Router and stores
const router = useRouter();
const summaryStore = useSummaryStore();
const flashcardStore = useFlashcardStore();
const quizStore = useQuizStore(); // Initialize quiz store
const authStore = userAuth();

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
  ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3'],
  ['#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800'],
  ['#03A9F4', '#00BCD4', '#009688', '#607D8B', '#795548', '#9E9E9E'],
];

// Dialogs
const flashcardDialog = ref(false);
const quizDialog = ref(false);
const summaryDialog = ref(false);
const tagsDialog = ref(false);
const deleteSummaryDialog = ref(false);
const deleteFlashcardDialog = ref(false);

// Content data
const flashcards = ref([]);
const summaries = ref([]);

// Loading states
const isLoadingFlashcards = ref(false);
const isLoadingQuizzes = ref(false);
const isLoadingSummaries = ref(false);
const isDeleteLoading = ref(false);

// Tag dialog state
const currentItemType = ref(null);
const currentItemId = ref(null);
const currentItemTags = ref([]);
const itemTagName = ref('');
const itemTagColor = ref('#4CAF50');
const deletingSummaryId = ref(null);
const deletingFlashcardId = ref(null);

// Map quiz sessions to the format expected by QuizzesSection
const mappedQuizzes = computed(() => {
  return quizStore.quizzes.map(quiz => ({
    id: quiz.quizId || quiz._id,
    quizId: quiz.quizId || quiz._id,
    title: quiz.title || quiz.source?.fileName || 'Untitled Quiz',
    subtitle: quiz.status === 'completed' ? 'Completed' : 
              quiz.status === 'in_progress' ? 'In Progress' : 'Not Started',
    description: `Quiz with ${quiz.totalQuestions || quiz.quiz?.totalQuestions || 0} questions`,
    totalQuestions: quiz.totalQuestions || quiz.quiz?.totalQuestions || 0,
    correctAnswers: quiz.correctAnswers || quiz.quiz?.correctCount || 0,
    score: quiz.score || quiz.quiz?.score || 0,
    status: quiz.status,
    createdAt: quiz.createdAt || quiz.startedAt,
    lastUpdated: formatDate(quiz.createdAt || quiz.startedAt),
    tags: quiz.tags || []
  }));
});

// Update the onMounted hook to use caching
onMounted(async () => {
  const savedTags = localStorage.getItem('tags');
  if (savedTags) {
    tags.value = JSON.parse(savedTags);
  }
  
  // Always show loading state initially for flashcards
  isLoadingFlashcards.value = true;
  
  try {
    // Use the cached data if available (forceRefresh=false)
    const flashcardResult = await flashcardStore.getDecks(false);
    if (flashcardResult.success) {
      // Map the API response to match the format expected by FlashcardsSection
      flashcards.value = flashcardResult.data.map(deck => ({
        id: deck.globalId || deck._id,
        title: deck.flash_card_title || 'Untitled Deck',
        subtitle: deck.category || 'General',
        description: `Deck created on ${new Date(deck.createdAt).toLocaleDateString()}`,
        cardCount: deck.cards?.length || 0,
        lastUpdated: formatDate(deck.updatedAt || deck.createdAt),
        tags: []
      }));
      
      // Apply saved tags to API-fetched flashcards
      applySavedTags(flashcards.value, 'flashcard_tags');
    } else if (!flashcardResult.authenticated) {
      console.log('Authentication required to fetch flashcards');
    }
  } catch (error) {
    console.error('Error loading flashcards:', error);
  } finally {
    isLoadingFlashcards.value = false;
  }

  // Fetch quiz sessions using the quizStore
  isLoadingQuizzes.value = true;
  try {
    await quizStore.loadHistory(); // This fetches both from localStorage and API
    
    // Apply saved tags to quiz sessions
    applySavedTags(mappedQuizzes.value, 'quiz_tags');
  } catch (error) {
    console.error('Error loading quizzes:', error);
  } finally {
    isLoadingQuizzes.value = false;
  }
  
  // Always show loading state initially for summaries
  isLoadingSummaries.value = true;
  
  try {
    // Pass false to use cache if available
    const result = await summaryStore.fetchSummaries(false);
    if (result.success) {
      summaries.value = result.data;
      
      // Apply saved tags to API-fetched summaries
      applySavedTags(summaries.value, 'summary_tags');
    } else if (!result.authenticated) {
      console.log('Authentication required to fetch summaries');
    }
  } catch (error) {
    console.error('Error loading summaries:', error);
  } finally {
    isLoadingSummaries.value = false;
  }
});

// Fetch quiz sessions from the API
const fetchQuizSessions = async () => {
  try {
    isLoadingQuizzes.value = true;
    const result = await quizStore.fetchQuizSessions();
    if (!result.success) {
      console.error('Failed to fetch quiz sessions:', result.error);
    }
  } catch (error) {
    console.error('Error fetching quiz sessions:', error);
  } finally {
    isLoadingQuizzes.value = false;
  }
};

// Helper function to format dates nicely
const formatDate = (dateString) => {
  if (!dateString) return 'Just now';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};

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
  // Navigate to edit page with the flashcard ID
  router.push(`/flashcard/flashcards?id=${id}`);
};

const viewFlashcard = (id) => {
  console.log(`Viewing flashcard with ID: ${id}`);
  // Navigate to view/study page with the flashcard ID
  router.push(`/flashcard/flashcardView?id=${id}`);
};

// Quiz action handlers
const editQuiz = (id) => {
  console.log(`Editing quiz with ID: ${id}`);
  router.push(`/quiz/review-quiz?id=${id}`);
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
    item = quizSessions.value.find(quiz => quiz.id === id);
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
      items = quizSessions.value;
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
    const itemIndex = items.findIndex(item => item.id === id);
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
  if (findAndRemoveTag(quizSessions.value, 'quiz')) return;
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
  quizStore.quizzes.forEach(quiz => {
    if (quiz.tags && quiz.tags.length > 0) {
      tagMap[quiz.id] = quiz.tags;
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
        if (tagMap[item.id]) {
          item.tags = tagMap[item.id];
        }
      });
    }
  } catch (error) {
    console.error(`Error applying saved tags from ${storageKey}:`, error);
  }
};

// Delete Summary functionality
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
      Swal.fire({
        title: 'Deleted!',
        text: 'Your summary has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      throw new Error(result.error || 'Failed to delete summary');
    }
  } catch (error) {
    console.error('Error deleting summary:', error);
    Swal.fire({
      title: 'Error!',
      text: error.message || 'An error occurred while deleting the summary.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  } finally {
    isDeleteLoading.value = false;
    deletingSummaryId.value = null;
  }
};

// Delete Flashcard functionality
const confirmDeleteFlashcard = (id) => {
  Swal.fire({
    title: 'Delete Flashcard Deck',
    text: 'Are you sure you want to delete this flashcard deck? This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteFlashcard(id);
    }
  });
};

const deleteFlashcard = async (id) => {
  try {
    const result = await flashcardStore.deleteDeck(id);
    
    if (result.success) {
      flashcards.value = flashcards.value.filter(flashcard => flashcard.id !== id);
      Swal.fire({
        title: 'Deleted!',
        text: 'Your flashcard deck has been deleted.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      throw new Error(result.error || 'Failed to delete flashcard deck');
    }
  } catch (error) {
    console.error('Error deleting flashcard deck:', error);
    Swal.fire({
      title: 'Error!',
      text: error.message || 'An error occurred while deleting the flashcard deck.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
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

// Function to refresh flashcards
const refreshFlashcards = async () => {
  isLoadingFlashcards.value = true;
  try {
    // Force a refresh from the API by passing true
    const flashcardResult = await flashcardStore.getDecks(true);
    if (flashcardResult.success) {
      flashcards.value = flashcardResult.data.map(deck => ({
        id: deck.globalId || deck._id,
        title: deck.flash_card_title || 'Untitled Deck',
        subtitle: deck.category || 'General',
        description: `Deck created on ${new Date(deck.createdAt).toLocaleDateString()}`,
        cardCount: deck.cards?.length || 0,
        lastUpdated: formatDate(deck.updatedAt || deck.createdAt),
        tags: []
      }));
      applySavedTags(flashcards.value, 'flashcard_tags');
    }
  } catch (error) {
    console.error('Error refreshing flashcards:', error);
  } finally {
    isLoadingFlashcards.value = false;
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

/* Action button styling */
.outfit-medium {
  font-weight: 500;
}

.outfit-semibold {
  font-weight: 600;
}

.outfit-bold {
  font-weight: 700;
}

.action-btn {
  border-radius: 6px;
  transition: all 0.25s ease;
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
  overflow: hidden;
  border-radius: 12px;
}

.empty-state:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.06);
  border-color: rgba(0,0,0,0);
}

/* Dialog styling */
:deep(.v-dialog) {
  border-radius: 12px;
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
