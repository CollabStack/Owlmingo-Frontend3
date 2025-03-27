<template>
  <v-card 
    class="pa-4 mb-5 rounded-xl flashcard-item content-card" 
    :class="{'new-card': isNew}"
    elevation="1"
    v-motion
    :initial="{ opacity: 0, y: isNew ? 0 : 20 }"
    :enter="{ 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: isNew ? 300 : 500, 
        delay: isNew ? 0 : Math.min(index * 50, 300) 
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
        <flashcard-toolbar 
          class="me-3"
          :editor="activeEditor"
          @format="applyFormat"
        />
        <v-btn 
          icon 
          color="error" 
          size="small" 
          @click="$emit('delete')"
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
          <div class="image-wrapper">
            <flashcard-image-uploader
              v-model="flashcardModel.frontImage" 
              :loading="loadingStates?.front"
              :is-removing="removingStates?.front"
              @file-selected="(file) => $emit('image-upload', 'front', file)" 
              @preview="(image) => $emit('image-preview', image)"
              @remove="$emit('image-remove', 'front')"
              @error="(message) => $emit('show-message', message)"
            />
          </div>
          <div class="editor-container" @click="setActiveEditor('front')">
            <TiptapEditorContent 
              :editor="frontEditor" 
              class="editable-textarea"
              :class="{ 'editor-focused': activeEditorName === 'front' }"
            />
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6" class="card-side">
        <div class="side-label d-flex align-center mb-2">
          <v-icon size="small" color="secondary" class="me-2">mdi-card-text</v-icon>
          <span class="text-subtitle-2 outfit outfit-medium">Back Side</span>
        </div>
        <div class="card-content-wrapper">
          <div class="image-wrapper">
            <flashcard-image-uploader
              v-model="flashcardModel.backImage"
              :loading="loadingStates?.back"
              :is-removing="removingStates?.back"
              @file-selected="(file) => $emit('image-upload', 'back', file)"
              @preview="(image) => $emit('image-preview', image)"
              @remove="$emit('image-remove', 'back')"
              @error="(message) => $emit('show-message', message)"
            />
          </div>
          <div class="editor-container" @click="setActiveEditor('back')">
            <TiptapEditorContent 
              :editor="backEditor" 
              class="editable-textarea"
              :class="{ 'editor-focused': activeEditorName === 'back' }"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, unref } from 'vue';
import FlashcardToolbar from './FlashcardToolbar.vue';
import FlashcardImageUploader from './FlashcardImageUploader.vue';

const props = defineProps({
  flashcard: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  isNew: {
    type: Boolean,
    default: false
  },
  loadingStates: {
    type: Object,
    default: () => ({})
  },
  removingStates: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits([
  'update:flashcard', 
  'delete', 
  'text-update', 
  'image-upload',
  'image-remove',
  'image-preview',
  'show-message'
]);

// Track which editor is active
const activeEditorName = ref(null);
const activeEditor = computed(() => {
  if (activeEditorName.value === 'front') return frontEditor.value;
  if (activeEditorName.value === 'back') return backEditor.value;
  return null;
});

// Use computed property for two-way binding without modifying the original props
const flashcardModel = computed({
  get: () => props.flashcard,
  set: (value) => emit('update:flashcard', value)
});

// Debounce text updates
const textUpdateTimers = ref({});
const debounceTextUpdate = (field, content) => {
  if (textUpdateTimers.value[field]) {
    clearTimeout(textUpdateTimers.value[field]);
  }
  
  textUpdateTimers.value[field] = setTimeout(() => {
    emit('text-update', { 
      index: props.index,
      field, 
      value: content
    });
  }, 1000);
};

// Helper function to ensure content is wrapped in paragraph tags
const ensureHtmlWrapping = (content) => {
  if (!content) return '<p></p>';
  
  // Check if content already has HTML formatting (paragraphs, etc.)
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(content);
  
  if (!hasHtmlTags) {
    // If plain text, wrap in paragraph tags
    return `<p>${content}</p>`;
  }
  
  return content;
};

// Initialize TipTap editors
const frontEditor = useEditor({
  content: props.flashcard.frontText ? ensureHtmlWrapping(props.flashcard.frontText) : '<p></p>',
  autofocus: props.isNew,
  extensions: [
    TiptapStarterKit,
  ],
  editorProps: {
    attributes: {
      placeholder: 'Enter term or question here',
    },
  },
  onUpdate: ({ editor }) => {
    const content = editor.getHTML();
    flashcardModel.value.frontText = content;
    debounceTextUpdate('frontText', content);
  },
  onFocus: () => {
    activeEditorName.value = 'front';
  },
});

const backEditor = useEditor({
  content: props.flashcard.backText ? ensureHtmlWrapping(props.flashcard.backText) : '<p></p>',
  extensions: [
    TiptapStarterKit,
  ],
  editorProps: {
    attributes: {
      placeholder: 'Enter definition or answer here',
    },
  },
  onUpdate: ({ editor }) => {
    const content = editor.getHTML();
    flashcardModel.value.backText = content;
    debounceTextUpdate('backText', content);
  },
  onFocus: () => {
    activeEditorName.value = 'back';
  },
});

// Set active editor
const setActiveEditor = (editor) => {
  activeEditorName.value = editor;
  if (editor === 'front' && frontEditor.value) {
    frontEditor.value.commands.focus();
  } else if (editor === 'back' && backEditor.value) {
    backEditor.value.commands.focus();
  }
};

// Apply formatting to active editor
const applyFormat = (command) => {
  if (!activeEditor.value) return;

  // Handle standard formatting commands
  switch (command) {
    case 'bold':
      activeEditor.value.chain().focus().toggleBold().run();
      break;
    case 'italic':
      activeEditor.value.chain().focus().toggleItalic().run();
      break;
    case 'underline':
      activeEditor.value.chain().focus().toggleUnderline().run();
      break;
    case 'insertUnorderedList':
      activeEditor.value.chain().focus().toggleBulletList().run();
      break;
    case 'insertOrderedList':
      activeEditor.value.chain().focus().toggleOrderedList().run();
      break;
    case 'undo':
      activeEditor.value.chain().focus().undo().run();
      break;
    case 'redo':
      activeEditor.value.chain().focus().redo().run();
      break;
    default:
      console.warn(`Unknown command: ${command}`);
  }
};

// Update editors when props change
watch(() => props.flashcard.frontText, (newText) => {
  if (frontEditor.value && newText !== frontEditor.value.getHTML()) {
    frontEditor.value.commands.setContent(ensureHtmlWrapping(newText || ''));
  }
});

watch(() => props.flashcard.backText, (newText) => {
  if (backEditor.value && newText !== backEditor.value.getHTML()) {
    backEditor.value.commands.setContent(ensureHtmlWrapping(newText || ''));
  }
});

// Clean up editors on component unmount
onBeforeUnmount(() => {
  if (frontEditor.value) {
    unref(frontEditor).destroy();
  }
  if (backEditor.value) {
    unref(backEditor).destroy();
  }
});

// Focus front editor on new cards
onMounted(() => {
  if (props.isNew && frontEditor.value) {
    setTimeout(() => {
      frontEditor.value.commands.focus();
      activeEditorName.value = 'front';
    }, 300);
  }
});
</script>

<style scoped>
/* Outfit font classes */
.outfit { font-family: "Outfit", sans-serif; }

/* Card styling */
.card-content-wrapper {
  display: flex;
  align-items: stretch; /* Changed from flex-start to stretch to match heights */
  gap: 16px;
}

.image-wrapper {
  flex-shrink: 0;
  display: flex;
  min-width: 120px;
  width: 120px;
  height: auto;
}

.editor-container {
  flex-grow: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editable-textarea {
  min-height: 120px;
  height: 100%; /* Make it fill the container height */
  padding: 12px;
  border: 1px solid rgba(123, 131, 224, 0.2);
  border-radius: 12px;
  font-size: 16px;
  line-height: 1.5;
  background-color: white;
  overflow: auto;
  transition: all 0.3s ease;
  margin-top: 0;
  outline: none; /* Remove default outline */
  cursor: text; /* Ensure cursor appears as text cursor */
  flex-grow: 1; /* Fill available space */
  display: flex;
  flex-direction: column;
}

.editable-textarea :deep(.ProseMirror) {
  min-height: 120px;
  flex-grow: 1; /* Fill available space */
  outline: none;
  caret-color: #7b83e0;
}

/* Add placeholder text */
.editable-textarea :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  color: #aaa;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
  font-style: italic;
}

.editor-focused {
  border-color: rgba(123, 131, 224, 0.8);
  box-shadow: 0 0 0 2px rgba(123, 131, 224, 0.1);
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

/* Delete button styles */
.delete-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.delete-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* Improve layout on mobile */
@media (max-width: 600px) {
  .card-content-wrapper {
    flex-direction: column;
    align-items: center;
  }
  
  .image-wrapper {
    width: 100%;
    max-width: 200px;
    height: 120px;
    margin-bottom: 16px;
  }
  
  .editor-container {
    width: 100%;
  }
}
</style>
