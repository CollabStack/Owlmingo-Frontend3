<template>
    <v-navigation-drawer permanent width="300" class="pa-4">
        <h3 class="text-h6 font-weight-bold">Options</h3>

        <v-label class="mt-4">Name</v-label>
        <v-text-field variant="outlined" density="compact" v-model="name" />

        <v-label class="mt-4">Visibility</v-label>
        <v-select
            variant="outlined"
            density="compact"
            v-model="visibility"
            :items="['Public', 'Private', 'Restricted']"
        />

        <v-checkbox v-model="showAnswers" label="Show Answers" />
        <v-checkbox v-model="shuffleQuestions" label="Shuffle Questions" />
        <v-checkbox v-model="timeLimit" label="Time Limit" />

        <v-btn variant="outlined" class="mt-6 w-100" color="primary">
            Completions & Responses
        </v-btn>
    </v-navigation-drawer>

    <v-row align="center">
        <h2 class="text-h5 font-weight-bold">Edit Quiz</h2>
        <v-spacer></v-spacer> 
        <v-btn variant="outlined" color="primary">Start Quiz</v-btn>
    </v-row>

    <v-row justify="center">
    <v-col cols="9" class="d-flex flex-column align-center">


    <v-card v-for="(question, index) in questions" :key="index" class="pa-4 my-4 w-100">
      <h3 class="text-h6 font-weight-bold text-center">Question {{ index + 1 }}</h3>

      <!-- Question Type -->
      <v-label>Question Type</v-label>
      <v-select
        v-model="question.type"
        :items="['Multiple Choice', 'True/False', 'Short Answer']"
        variant="outlined"
        density="compact"
      />

      <!-- Question Text -->
      <v-label>Question</v-label>
      <v-textarea v-model="question.text" variant="outlined" density="compact" />

      <!-- Image Upload -->
      <v-btn variant="outlined" color="grey" class="mt-2">
        <v-icon>mdi-image</v-icon> Image
      </v-btn>

      <!-- Options -->
      <v-label class="mt-4">Options</v-label>
      <v-radio-group v-model="question.answer">
        <v-radio
          v-for="(option, i) in question.options"
          :key="i"
          :label="option"
          :value="option"
          class="custom-radio"
        />
      </v-radio-group>

      <!-- AI & Delete Buttons -->
      <v-row>
        <v-col>
          <v-btn color="pink-lighten-2" variant="outlined">AI</v-btn>
        </v-col>
        <v-col class="text-end">
          <v-btn color="red-lighten-2" variant="outlined">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</v-row>

    
</template>

<script lang="ts" setup>
    import { ref } from "vue";
    const name = ref("Game Programming");
    const visibility = ref("Public");
    const showAnswers = ref(true);
    const shuffleQuestions = ref(false);
    const timeLimit = ref(false);

    const questions = ref([
    {
        type: "Multiple Choice",
        text: "What is the primary focus of the session objectives listed?",
        options: ["Lifecycle function", "Event function", "Attributes & Inspector", "All of the above"],
        answer: "All of the above",
    },
    {
        type: "Multiple Choice",
        text: "Another question?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        answer: "Option 1",
    },
    ]);

</script>

<style lang="css" scoped>
    .custom-radio {
  background: #f5f7ff;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 8px;
}
</style>
