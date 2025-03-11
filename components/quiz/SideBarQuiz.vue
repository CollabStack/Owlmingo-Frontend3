<template>
    <!-- Sidebar -->
    <v-navigation-drawer permanent width="300" class="pa-4">
        <h3 class="text-h6">Options</h3>

        <!-- Name Input -->
        <v-label class="mt-5">Name</v-label>
        <v-text-field 
            v-model="name" 
            variant="flat" 
            density="compact" 
            hide-details 
            class="mt-2 rounded-lg bg-blue-lighten-5"
        />

        <!-- Checkbox Options -->
        <v-row class="mt-2">
            <v-col>
                <v-checkbox
                    v-for="(option, index) in options"
                    :key="index"
                    v-model="option.model"
                    hide-details
                    density="compact"
                    color="blue"
                >
                    <template v-slot:label>
                        {{ option.label }}
                        <v-tooltip location="top">
                            <template v-slot:activator="{ props }">
                                <v-icon v-bind="props" size="small" class="ml-1">mdi-information-outline</v-icon>
                            </template>
                            {{ option.tooltip }}
                        </v-tooltip>
                    </template>
                </v-checkbox>
            </v-col>
        </v-row>
         
        <div class="container">
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="blue" class="w-100 mb-3 bottom-button rounded-lg">
                Completions & Responses
            </v-btn>
        </div>
    </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';

// Reactive State
const name = ref('Lesson Name');

// Checkboxes reactive
const options = ref([
    { model: ref(true), label: "Show Answers", tooltip: "Toggle to show correct answers after submission." },
    { model: ref(false), label: "Shuffle Questions", tooltip: "Randomizes the order of questions in the quiz." }
]);
</script>

<style scoped>  
 .container {
    display: flex;
    flex-direction: column;
    height: 57vh; 
    }
</style>
