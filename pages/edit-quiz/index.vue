<template>
  <SidebarQuiz />
  <v-container>
    <v-row class="mx-2">
      <v-col cols="12" class="mx-auto">
        <!-- Start Quiz Button -->
        <v-btn variant="outlined" class="float-end text-primary mt-2 rounded-lg" @click="startQuiz">
          Start Quiz
        </v-btn>

        <!-- Quiz Title -->
        <h2 class="text-h5 font-weight-bold mt-2">Edit Quiz</h2>

        <!-- Question Card -->
        <v-card class="pa-4 mt-6 rounded-lg elevation-2">
          <v-row align="center" justify="space-between">
            <v-col cols="auto">
              <h3 class="text-h6 font-weight-bold">Question</h3>
            </v-col>
            <v-col cols="auto">
              <img
                src="/icons/icons8-delete-button.svg"
                alt="Delete Icon"
                class="icon-size mt-2"
                @click="deleteQuestion"
              />
            </v-col>
          </v-row>

          <!-- Question Type Selection -->
          <v-label class="mt-4 text-black">Question Type</v-label>
          <v-select 
            v-model="selectedType" 
            :items="questionTypes" 
            variant="flat"
            class="mt-2 rounded bg-blue-lighten-5 w-25" 
            density="compact" 
            hide-details 
            @update:modelValue="handleTypeChange"
          />

          <!-- Question Input (Shared Across All Types) -->
          <v-label class="mt-9 text-black">Question</v-label>
          <v-textarea
            v-model="questionText"
            class="mt-2 rounded-lg bg-blue-lighten-5"
            variant="flat"
            auto-grow   
            rows="2"
            hide-details
            style="width: 90%;"
          />

          <!-- Render Question Component Based on Type -->
          <WriteAnswer v-if="selectedType === 'Open-Ended'" v-model:answer="questionData['Open-Ended'].answer" />
          <MultipleAnswer v-if="selectedType === 'Multiple Choice'" v-model:question="questionData['Multiple Choice']" />
          <OnlyAnswer v-if="selectedType === 'True/False'" v-model:question="questionData['True/False']" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import MultipleAnswer from "~/components/quiz/MultipleAnswer.vue";
import OnlyAnswer from "~/components/quiz/OnlyAnswer.vue";
import SidebarQuiz from "~/components/quiz/SidebarQuiz.vue";
import WriteAnswer from "~/components/quiz/WriteAnswer.vue";

// Question types
const questionTypes = ["Multiple Choice", "True/False", "Open-Ended"];
const selectedType = ref("Multiple Choice");

// Shared question text (same for all types)
const questionText = ref("What is the primary focus of the session objectives?");

// Store question data separately for each type
const questionData = ref({
  "Multiple Choice": {
    answer: "",
    options: [
      { text: "Lifecycle function", value: "a" },
      { text: "Event function", value: "b" },
      { text: "Attributes & Inspector", value: "c" },
      { text: "All of the above", value: "d" }
    ],
    selectedAnswer: "d"
  },
  "True/False": {
    answer: "",
    options: [
      { text: "True", value: true },
      { text: "False", value: false }
    ],
    selectedAnswer: null
  },
  "Open-Ended": {
    answer: ""
  }
});

// Handle type change while preserving answers
const handleTypeChange = (newType) => {
  selectedType.value = newType;
};

const startQuiz = () => {
  console.log("Starting quiz...");
};

const deleteQuestion = () => {
  console.log("Question deleted:", questionData.value[selectedType.value]);
};
</script>

<style scoped>
.icon-size {
  width: 30px;
  height: 30px;
}
</style>
