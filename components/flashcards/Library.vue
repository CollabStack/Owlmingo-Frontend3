<template>
    <div>
      <!-- Header Section Tags -->
      <v-container class="d-flex align-center justify-start">
        <h1 class="text-h5">Tags</h1>
        <v-btn icon class="rounded-xl bg-secondary text-white mx-3 justify-center align-center d-flex" max-height="30" max-width="30" @click="dialog = true">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-container>
  
      <!-- Tag List -->
      <v-container>
        <v-row>
          <v-col cols="12" md="6" lg="4" v-for="(tag, index) in tags" :key="index">
            <v-card class="d-flex align-center px-4 mx-2" elevation="2">
              <!-- Color Indicator -->
              <div :style="{ backgroundColor: tag.color }" style="width: 30px; height:30px; border-radius: 5px;"></div>
  
              <!-- Tag Name -->
              <p class="mx-3 mb-0">{{ tag.name }}</p>
  
              <!-- Spacer -->
              <v-spacer></v-spacer>
  
              <!-- Updated Menu Icon -->
              <v-menu offset-y>
                <template v-slot:activator="{ props }">
                  <v-btn icon variant="text" v-bind="props">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                    <v-list-item @click="editTag(index)">
                    <v-row align="center" no-gutters>
                      <v-col cols="2" class="d-flex justify-center">
                        <v-icon class="text-secondary">mdi-pencil</v-icon>
                      </v-col>
                      <v-col cols="10">
                        <v-list-item-title class="text-secondary mx-2">Edit</v-list-item-title>
                      </v-col>
                    </v-row>
                  </v-list-item>
  
                  <v-list-item @click="confirmDelete(index)">
                    <v-row align="center" no-gutters>
                      <v-col cols="2" class="d-flex justify-center">
                        <v-icon class="text-error">mdi-delete</v-icon>
                      </v-col>
                      <v-col cols="10">
                        <v-list-item-title class="text-error mx-2">Delete</v-list-item-title>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- Add/Edit Tag Dialog -->
      <v-dialog v-model="dialog" width="400">
        <v-card>
          <v-card-title class="text-h6">{{ editingIndex === null ? "Add Tag" : "Edit Tag" }}</v-card-title>
          <v-card-text>
            <v-text-field v-model="newTagName" label="Tag Name" variant="outlined" clearable class="mb-3"></v-text-field>
            <v-color-picker v-model="newTagColor" hide-inputs></v-color-picker>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="dialog = false" variant="outlined">Cancel</v-btn>
            <v-btn class="bg-primary text-white" @click="saveTag">{{ editingIndex === null ? "Add" : "Save" }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" width="400">
        <v-card>
          <v-card-title class="text-h6">Delete this tag</v-card-title>
          <v-card-text>Are you sure you want to delete this tag? This cannot be undone.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="deleteDialog = false" variant="outlined">Cancel</v-btn>
            <v-btn class="bg-error text-white" @click="removeTag">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>


    <dev>
         <!-- Header Section Tags -->
      <v-container class="d-flex align-center justify-start">
        <h1 class="text-h5">Flashcards</h1>
        <nuxt-link to="/flashcard/flashcards" style="text-decoration: none;">
        <v-btn icon class="rounded-xl bg-secondary text-white mx-3 justify-center align-center d-flex" max-height="30" max-width="30">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        </nuxt-link>
      </v-container>
    </dev>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';

const tags = ref([]);
const dialog = ref(false);
const deleteDialog = ref(false);
const newTagName = ref("");
const newTagColor = ref("#FF5733");
const editingIndex = ref(null);
const deletingIndex = ref(null);

onMounted(() => {
  const savedTags = JSON.parse(localStorage.getItem('tags'));
  if (savedTags) {
    tags.value = savedTags;
  }
});

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
  newTagColor.value = "#FF5733";
  editingIndex.value = null;
};
</script>

<style scoped>

</style>
