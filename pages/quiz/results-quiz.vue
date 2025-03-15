<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-5 rounded-lg" style="max-width: 900px; width: 100%;">
      <v-card-title class="text-h6 d-flex justify-space-between align-center w-100">
        Answers
        <v-btn @click="backQuiz" class="ml-auto text-blue" variant="flat">Close</v-btn>
      </v-card-title>

      <!-- Score -->
      <v-card-subtitle class="text-body-1">
        Score: {{ answerTrue }} / {{ totalQuestion }}
      </v-card-subtitle>

      <v-divider class="mb-4 mt-4"></v-divider>

      <!-- Display Questions and Answers -->
      <v-row>
        <v-col cols="12">
          <v-card outlined v-for="(question, qIndex) in questions" :key="qIndex">
            <!-- Question Title -->
            <v-card-title
              :class="{ 'incorrect-title': isIncorrect(question, qIndex), 'correct-title': !isIncorrect(question, qIndex) }"
            >
              <v-icon v-if="isIncorrect(question, qIndex)" color="red" class="mr-2">
                mdi-alert-circle
              </v-icon>
              <v-icon v-else color="green">mdi-check-circle</v-icon>
              <span class="ml-2">Question {{ qIndex + 1 }}: {{ question.text }} ({{ isIncorrect(question, qIndex) ? 'Incorrect' : 'Correct' }})</span>
            </v-card-title>
            <v-divider></v-divider>

            <!-- Single Choice Answers -->
            <v-list v-if="!question.type">
              <v-list-item
                v-for="(option, index) in question.options"
                :key="index"
                class="answer-option"
                :class="getCardClass(question, option.value, qIndex)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ index + 1 }}. {{ option.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- Multiple Choice Answers -->
            <v-list v-else>
              <v-list-item
                v-for="(option, index) in question.options"
                :key="index"
                class="answer-option"
                :class="getCardClass(question, option.value, qIndex)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ index + 1 }}. {{ option.text }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Retrieve quiz data from the query params
const questions = ref(JSON.parse(decodeURIComponent(route.query.questions || '[]')));
const selectedAnswers = JSON.parse(decodeURIComponent(route.query.selectedAnswers || '[]')); // Get selected answers
const answerTrue = route.query.answerTrue || 0;
const totalQuestion = route.query.totalQuestion || 0;

// Check if the selected answer is correct
const isIncorrect = (question, qIndex) => {
  const selectedAnswer = selectedAnswers[qIndex].selectedAnswer;
  const correctAnswer = selectedAnswers[qIndex].correctAnswer;

  if (!question.type) {
    // For single choice questions
    return selectedAnswer !== correctAnswer;
  } else {
    // For multiple choice questions, compare the answers (both sorted to handle any order)
    const selectedSorted = selectedAnswer.sort().join(",");
    const correctSorted = correctAnswer.sort().join(",");
    return selectedSorted !== correctSorted;
  }
};

// Get the class for the answer based on correctness
const getCardClass = (question, answerValue, qIndex) => {
  const selectedAnswer = selectedAnswers[qIndex].selectedAnswer;
  const correctAnswer = selectedAnswers[qIndex].correctAnswer;

  // If the answer is selected
  if (Array.isArray(selectedAnswer)) {
    // For multiple-choice answers
    if (selectedAnswer.includes(answerValue)) {
      return correctAnswer.includes(answerValue) ? 'correct-answer' : 'wrong-answer';
    }

    // If the answer is not selected, highlight the correct answer if the wrong answer is selected
    if (isIncorrect(question, qIndex) && correctAnswer.includes(answerValue)) {
      return 'correct-answer';
    }
  } else {
    // For single-choice questions
    if (answerValue === selectedAnswer) {
      return answerValue === correctAnswer ? 'correct-answer' : 'wrong-answer';
    }
    // If the answer is not selected, highlight the correct answer if the wrong answer is selected
    if (isIncorrect(question, qIndex) && answerValue === correctAnswer) {
      return 'correct-answer';
    }
  }

  // If the answer is not selected and it's neither correct nor incorrect
  return 'neutral-answer';
};

// Go back to the quiz or previous page
const backQuiz = () => {
  router.push('/quiz');
};
</script>

<style scoped>
.v-card {
  border-radius: 12px;
  margin-bottom: 20px;
}

.v-card-title {
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.incorrect-title {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 12px;
}

.correct-title {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 12px;
}

.answer-option {
  border: 2px solid transparent;
  margin: 4px 0;
  border-radius: 8px;
  padding: 8px;
}

.wrong-answer {
  border: 2px solid red;
  background-color: #ffebee;
}

.correct-answer {
  border: 2px solid green;
  background-color: #e8f5e9;
}

.neutral-answer {
  border: 2px solid gray;
  background-color: #f5f5f5;
}
</style>
