<template>
  <v-card class="editor-toolbar" rounded="lg" elevation="0">
    <v-btn-toggle class="d-flex align-center flex-wrap" v-model="selectedFormat" density="comfortable">
      <v-btn 
        icon 
        size="small" 
        @click="applyFormat('undo')" 
        variant="text"
        :disabled="!editor || !editor.can().chain().focus().undo().run()"
      >
        <v-icon size="small">mdi-undo</v-icon>
      </v-btn>
      
      <v-btn 
        icon 
        size="small" 
        @click="applyFormat('redo')" 
        variant="text"
        :disabled="!editor || !editor.can().chain().focus().redo().run()"
      >
        <v-icon size="small">mdi-redo</v-icon>
      </v-btn>
      
      <v-divider vertical class="mx-1"></v-divider>
      
      <v-btn 
        icon 
        size="small" 
        @click="applyFormat('bold')" 
        variant="text"
        :class="{ 'is-active': editor?.isActive('bold') }"
      >
        <v-icon size="small">mdi-format-bold</v-icon>
      </v-btn>
      
      <v-btn 
        icon 
        size="small" 
        @click="applyFormat('italic')" 
        variant="text"
        :class="{ 'is-active': editor?.isActive('italic') }"
      >
        <v-icon size="small">mdi-format-italic</v-icon>
      </v-btn>
      
      <v-btn 
        icon 
        size="small" 
        @click="applyFormat('underline')" 
        variant="text"
        :class="{ 'is-active': editor?.isActive('underline') }"
      >
        <v-icon size="small">mdi-format-underline</v-icon>
      </v-btn>
      
      <v-divider vertical class="mx-1"></v-divider>
      
      <v-btn 
        icon 
        size="small" 
        @click="applyFormat('insertUnorderedList')" 
        variant="text"
        :class="{ 'is-active': editor?.isActive('bulletList') }"
      >
        <v-icon size="small">mdi-format-list-bulleted</v-icon>
      </v-btn>
      
      <v-btn 
        icon 
        size="small" 
        @click="applyFormat('insertOrderedList')" 
        variant="text"
        :class="{ 'is-active': editor?.isActive('orderedList') }"
      >
        <v-icon size="small">mdi-format-list-numbered</v-icon>
      </v-btn>
    </v-btn-toggle>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  editor: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['format']);

const selectedFormat = ref(null);

const applyFormat = (command) => {
  emit('format', command);
};
</script>

<style scoped>
.editor-toolbar {
  background-color: rgba(245, 246, 255, 0.8);
  border: 1px solid rgba(123, 131, 224, 0.15);
}

.is-active {
  color: #7b83e0;
  background-color: rgba(123, 131, 224, 0.1);
}
</style>
