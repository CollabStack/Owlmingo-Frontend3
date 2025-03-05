<template>
    <!-- Question Card -->
    <v-card class="pa-4 mt-6 rounded-lg elevation-2">
        <v-row align="center" justify="space-between">
            <v-col cols="auto">
            <h3 class="text-h6">Question</h3>
            </v-col>
            <v-col cols="auto">
            <img src="/icons/icons8-delete-button.svg" alt="Icon" class="icon-size mt-2" @click="deleteQuestion" />
            </v-col>
        </v-row>

        <!-- Question Type Selection -->
        <v-label class="mt-4">Question Type</v-label>
        <v-select
            v-model="selectedType"
            :items="questionTypes"
            variant="flat"
            class="mt-2 rounded bg-blue-lighten-5 w-25"
            density="compact"
            hide-details
            @update:modelValue="handleTypeChange"
        />

        <!-- Question Input -->
        <v-label class="mt-4">Question</v-label>
        <v-textarea
            v-model="questionText"
            class="mt-2 rounded-lg bg-blue-lighten-5"
            max-width="90%"
            variant="flat"
            auto-grow
            rows="2"
            hide-details
        />

        <!-- Answer Options -->
        <v-label class="mt-4">Choose Answer</v-label>

        <!-- Only Choice (Single Answer) -->
        <v-radio-group v-if="selectedType === 'Only Choice'" v-model="question.selectedAnswer" class="mt-4">
            <v-row dense>
                <v-col v-for="(option, index) in question.options" :key="index" cols="12">
                    <v-row align="center" no-gutters class="mb-5">
                    <v-col cols="auto">
                        <v-radio :value="option.value" color="blue" />
                    </v-col>
                    <v-col>
                        <v-text-field v-model="option.text" variant="flat" hide-details class="rounded-lg bg-blue-lighten-5" />
                    </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-radio-group>

        <!-- Multiple Choice (Allow One or More Answers) -->
        <div v-else class="mt-4">
            <v-row dense>
                <v-col v-for="(option, index) in question.options" :key="index" cols="12">
                    <v-row no-gutters>
                    <v-col cols="auto">
                        <v-checkbox
                        v-model="question.selectedAnswers" :value="option.value" color="blue" />
                    </v-col>
                    <v-col>
                        <v-text-field v-model="option.text" variant="flat" hide-details class="rounded-lg bg-blue-lighten-5" />
                    </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
    </v-card>
</template>
  
<script setup>
  import { ref, computed } from "vue";
import SideBarQuiz from "./SideBarQuiz.vue";
  
  const questionTypes = ["Only Choice", "Multiple Choice"];
  const selectedType = ref("Only Choice");
  const questionText = ref("What is the primary focus of the session objectives?");
  
  const questionData = ref({
    "Only Choice": {
      options: [
        { text: "Lifecycle function", value: "a" },
        { text: "Event function", value: "b" },
        { text: "Attributes & Inspector", value: "c" },
        { text: "All of the above", value: "d" }
      ],
      selectedAnswer: ""
    },
    "Multiple Choice": {
      options: [
        { text: "Lifecycle function", value: "a" },
        { text: "Event function", value: "b" },
        { text: "Attributes & Inspector", value: "c" },
        { text: "All of the above", value: "d" }
      ],
      selectedAnswers: []
    }
  });
  
  const question = computed(() => questionData.value[selectedType.value]);
  
  const handleTypeChange = (newType) => {
    selectedType.value = newType;
    if (newType === "Multiple Choice") {
      question.value.selectedAnswers = [];
    } else {
      question.value.selectedAnswer = "";
    }
  };
  
  const startQuiz = () => {
    console.log("Starting quiz...");
    console.log("Selected Answer(s):", question.value.selectedType === "Only Choice" ? question.value.selectedAnswer : question.value.selectedAnswers);
  };
  
  const deleteQuestion = () => {
    question.value.options = [];
    question.value.selectedAnswer = "";
    question.value.selectedAnswers = [];
    console.log("Question deleted:", question.value);
  };
  </script>
  
  <style scoped>
  .icon-size {
    width: 30px;
    height: 30px;
  }
  </style>
  