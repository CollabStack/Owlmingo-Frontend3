<template>
  <div class="library-container">
    <!-- ===== TAGS SECTION ===== -->
    <section class="mb-8">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-h5 outfit outfit-semibold">My Tags</h2>
        <v-btn 
          color="secondary" 
          class="rounded-lg action-btn outfit outfit-medium"
          prepend-icon="mdi-plus"
          @click="dialog = true"
          size="small"
        >
          Create Tag
        </v-btn>
      </div>

      <!-- Tag List -->
      <div class="tags-container">
        <v-row v-if="tags.length > 0">
          <v-col cols="12" sm="6" md="4" v-for="(tag, index) in tags" :key="index">
            <v-card class="tag-card d-flex align-center px-4 py-3 mx-2 mb-3" elevation="1">
              <!-- Color Indicator -->
              <div 
                :style="{ backgroundColor: tag.color }" 
                class="tag-color"
              ></div>

              <!-- Tag Name -->
              <p class="mx-3 mb-0 outfit text-truncate">{{ tag.name }}</p>

              <!-- Spacer -->
              <v-spacer></v-spacer>

              <!-- Action Buttons -->
              <v-btn icon="mdi-pencil" size="small" variant="text" color="grey-darken-1" @click="editTag(index)" class="mr-1"></v-btn>
              <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="confirmDelete(index)"></v-btn>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State for Tags -->
        <v-card v-else class="pa-8 text-center rounded-lg empty-state">
          <v-icon size="64" color="secondary" class="mb-4">mdi-tag-multiple</v-icon>
          <h3 class="text-h5 outfit outfit-semibold mb-3">No tags yet</h3>
          <p class="text-body-1 text-medium-emphasis mb-6 outfit">Create tags to organize your flashcards and quizzes</p>
          
          <v-btn 
            color="secondary" 
            class="action-btn outfit"
            prepend-icon="mdi-plus"
            @click="dialog = true"
          >
            Create First Tag
          </v-btn>
        </v-card>
      </div>
    </section>

    <v-divider class="mb-8"></v-divider>

    <!-- ===== FLASHCARDS SECTION ===== -->
    <section class="mb-8">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-h5 outfit outfit-semibold">My Flashcards</h2>
        <v-btn 
          color="primary" 
          class="rounded-lg action-btn outfit outfit-medium"
          prepend-icon="mdi-plus"
          @click="flashcardDialog = true"
          size="small"
        >
          Create
        </v-btn>
      </div>

      <!-- Flashcard Content -->
      <div>
        <v-row v-if="flashcards.length > 0">
          <v-col cols="12" sm="6" md="4" v-for="(card, index) in flashcards" :key="index">
            <Card_Display
              type="flashcard"
              :title="card.title"
              :description="card.description"
              :subtitle="card.subtitle"
              :item-count="card.cardCount"
              :last-updated="card.lastUpdated"
              :tags="card.tags"
              :index="index"
              :id="card.id"
              @edit="editFlashcard(card.id)"
              @action="viewFlashcard(card.id)"
              @editTags="openTagsDialog('flashcard', $event)"
              @removeTag="removeTagFromItem($event)"
            />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-card v-else class="pa-8 text-center rounded-lg empty-state">
          <v-icon size="64" color="primary" class="mb-4">mdi-cards-outline</v-icon>
          <h3 class="text-h5 outfit outfit-semibold mb-3">No flashcards yet</h3>
          <p class="text-body-1 text-medium-emphasis mb-6 outfit">Create your first flashcard deck to start studying effectively</p>
          
          <div class="d-flex justify-center" style="gap: 16px;">
            <nuxt-link to="/flashcard" style="text-decoration: none;">
              <v-btn 
                color="primary" 
                class="action-btn outfit"
                variant="flat"
                prepend-icon="mdi-robot"
              >
                Generate with AI
              </v-btn>
            </nuxt-link>
            <nuxt-link to="/flashcard/flashcards" style="text-decoration: none;">
              <v-btn 
                color="grey-darken-1" 
                variant="outlined"
                class="action-btn outfit"
                prepend-icon="mdi-pencil"
              >
                Create Manually
              </v-btn>
            </nuxt-link>
          </div>
        </v-card>
      </div>
    </section>

    <v-divider class="mb-8"></v-divider>

    <!-- ===== QUIZZES SECTION ===== -->
    <section class="mb-8">
      <div class="d-flex align-center justify-space-between mb-4">
        <h2 class="text-h5 outfit outfit-semibold">My Quizzes</h2>
        <v-btn 
          color="purple" 
          class="rounded-lg action-btn outfit outfit-medium"
          prepend-icon="mdi-plus"
          @click="quizDialog = true"
          size="small"
        >
          Create
        </v-btn>
      </div>

      <!-- Quiz Content -->
      <div>
        <v-row v-if="quizzes.length > 0">
          <v-col cols="12" sm="6" md="4" v-for="(quiz, index) in quizzes" :key="index">
            <Card_Display
              type="quiz"
              :title="quiz.title"
              :description="quiz.description"
              :subtitle="quiz.subtitle"
              :item-count="quiz.questionCount"
              :last-updated="quiz.lastUpdated"
              :tags="quiz.tags"
              :index="index"
              :id="quiz.id"
              @edit="editQuiz(quiz.id)"
              @action="startQuiz(quiz.id)"
              @editTags="openTagsDialog('quiz', $event)"
              @removeTag="removeTagFromItem($event)"
            />
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-card v-else class="pa-8 text-center rounded-lg empty-state">
          <v-icon size="64" color="purple" class="mb-4">mdi-help-circle-outline</v-icon>
          <h3 class="text-h5 outfit outfit-semibold mb-3">No quizzes yet</h3>
          <p class="text-body-1 text-medium-emphasis mb-6 outfit">Create your first quiz to test your knowledge</p>
          
          <div class="d-flex justify-center" style="gap: 16px;">
            <nuxt-link to="/quiz" style="text-decoration: none;">
              <v-btn 
                color="purple" 
                class="action-btn outfit"
                variant="flat"
                prepend-icon="mdi-robot"
              >
                Generate with AI
              </v-btn>
            </nuxt-link>
            <nuxt-link to="/quiz/review-quiz" style="text-decoration: none;">
              <v-btn 
                color="grey-darken-1" 
                variant="outlined"
                class="action-btn outfit"
                prepend-icon="mdi-pencil"
              >
                Create Manually
              </v-btn>
            </nuxt-link>
          </div>
        </v-card>
      </div>
    </section>

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
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import Card_Display from './Card_Display.vue';

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

const quizzes = ref([
  {
    id: 1,
    title: "History Final Exam",
    subtitle: "History",
    description: "Comprehensive quiz covering World War II topics",
    questionCount: 25,
    lastUpdated: "Yesterday",
    tags: [{ name: "History", color: "#9C27B0" }]
  },
  {
    id: 2,
    title: "Math Practice",
    subtitle: "Mathematics",
    description: "Algebra and calculus practice problems",
    questionCount: 15,
    lastUpdated: "3 days ago",
    tags: [{ name: "Math", color: "#2196F3" }]
  }
]);

// For demo purposes, you can set these to empty arrays to test the empty state
// flashcards.value = [];
// quizzes.value = [];
// tags.value = [];

onMounted(() => {
  const savedTags = localStorage.getItem('tags');
  if (savedTags) {
    tags.value = JSON.parse(savedTags);
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
  // Implement navigation to quiz start page
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
  } else {
    item = quizzes.value.find(quiz => quiz.id === id);
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
    const items = currentItemType.value === 'flashcard' ? flashcards.value : quizzes.value;
    const itemIndex = items.findIndex(item => item.id === currentItemId.value);
    
    if (itemIndex !== -1) {
      items[itemIndex].tags = [...currentItemTags.value];
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
  const findAndRemoveTag = (items) => {
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex !== -1 && items[itemIndex].tags && items[itemIndex].tags[tagIndex]) {
      items[itemIndex].tags.splice(tagIndex, 1);
    }
  };
  
  findAndRemoveTag(flashcards.value);
  findAndRemoveTag(quizzes.value);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

.library-container {
  max-width: 1200px;
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

/* Tag styling */
.tag-color {
  min-width: 24px; 
  width: 24px;
  height: 24px; 
  border-radius: 4px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.tag-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.05);
  overflow: hidden;
}

.tag-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06) !important;
  border-color: rgba(0,0,0,0);
}

.tag-card:hover .tag-color {
  transform: scale(1.1);
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

/* Badge styling */
.v-badge__badge {
  font-family: 'Outfit', sans-serif !important;
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
