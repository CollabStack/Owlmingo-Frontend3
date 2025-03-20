<template>
  <v-container class="d-flex justify-center">
    <v-card class="pa-5 rounded-lg" style="max-width: 900px; width: 100%;">
      <v-card-title class="text-h6 d-flex justify-space-between align-center w-100 outfit">
        Answers
        <v-btn class="ml-auto text-blue rounded-xl" @click="backQuiz" variant="outlined"
          :class="{'hovered-btn': isHovered}" 
          @mouseenter="isHovered = true" 
          @mouseleave="isHovered = false"
        >
          Close
        </v-btn>
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
                    <!-- Show correct answer if the user's answer is wrong -->
                    <span v-if="isIncorrect(question, qIndex) && option.correct">
                      (Correct Answer)
                    </span>
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
                    <!-- Show correct answer if the user's answer is wrong -->
                    <span v-if="isIncorrect(question, qIndex) && option.correct">
                      (Correct Answer)
                    </span>
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
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const isHovered = ref(false);


// Retrieve quiz data from the query params
const questions = ref([
  {
    id: 1742428461348,
    text: "Which programming language is primarily used for web development?",
    type: false, // Single choice question
    options: [
      { value: "opt1", text: "Python", correct: false },
      { value: "opt2", text: "Java", correct: false },
      { value: "opt3", text: "JavaScript", correct: true },
      { value: "opt4", text: "C++", correct: false }
    ],
    selectedAnswers: ["opt1"], // User selected this option
    correctAnswer: "opt3", // Correct answer
  },
  {
    id: 1742428461349,
    text: "Which of the following are front-end frameworks/libraries?",
    type: true, // Multiple choice question
    options: [
      { value: "opt1", text: "Vue.js", correct: true },
      { value: "opt2", text: "React", correct: true },
      { value: "opt3", text: "Laravel", correct: false },
      { value: "opt4", text: "Angular", correct: true }
    ],
    selectedAnswers: ["opt1", "opt2"], // User selected these options
    correctAnswer: ["opt1", "opt2", "opt4"], // Correct answers
  }
]);

// Calculate the total number of questions
const totalQuestion = computed(() => questions.value.length);

// Dynamically calculate the number of correct answers
const answerTrue = computed(() => {
  let score = 0;

  // Iterate through the questions and check if the answers are correct
  questions.value.forEach((question) => {
    if (!question.type) {
      // Single choice question: check if the selected answer is correct
      if (question.selectedAnswers[0] === question.correctAnswer) {
        score++;
      }
    } else {
      // Multiple choice question: check if the selected answers match the correct answers
      const selectedSorted = question.selectedAnswers.sort().join(",");
      const correctSorted = question.correctAnswer.sort().join(",");
      if (selectedSorted === correctSorted) {
        score++;
      }
    }
  });

  return score; // Return the calculated score
});

// Check if the selected answer is correct
const isIncorrect = (question, qIndex) => {
  const selectedAnswer = question.selectedAnswers;
  const correctAnswer = question.correctAnswer;

  if (!question.type) {
    // For single choice questions
    return selectedAnswer[0] !== correctAnswer;
  } else {
    // For multiple choice questions
    const selectedSorted = selectedAnswer.sort().join(",");
    const correctSorted = correctAnswer.sort().join(",");
    return selectedSorted !== correctSorted;
  }
};

// Get the class for the answer based on correctness
const getCardClass = (question, answerValue, qIndex) => {
  const selectedAnswer = question.selectedAnswers;
  const correctAnswer = question.correctAnswer;

  // For multiple-choice answers
  if (Array.isArray(selectedAnswer)) {
    if (selectedAnswer.includes(answerValue)) {
      return correctAnswer.includes(answerValue) ? 'correct-answer' : 'wrong-answer';
    }

    if (isIncorrect(question, qIndex) && correctAnswer.includes(answerValue)) {
      return 'correct-answer';
    }
  } else {
    // For single-choice questions
    if (answerValue === selectedAnswer[0]) {
      return answerValue === correctAnswer ? 'correct-answer' : 'wrong-answer';
    }
    if (isIncorrect(question, qIndex) && answerValue === correctAnswer) {
      return 'correct-answer';
    }
  }

  return 'neutral-answer';
};

// Go to History Page of Quiz
const backQuiz = () => {
  router.push('/quiz/history-quiz');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

.outfit {
  font-family: "Outfit", sans-serif;
}

.hovered-btn {
  background-color: #1976d2 !important; /* Change to the desired background color */
  color: white !important;
}

.v-btn {
  transition: background-color 0.3s ease; /* Smooth transition */
}

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
  border-radius: 5px !important; /* Add !important to ensure border-radius is applied */
  padding: 8px;
}

.wrong-answer {
  border: 2px solid red;
  background-color: #ffebee;
  border-radius: 5px !important; /* Add !important */
}

.correct-answer {
  border: 2px solid green;
  background-color: #e8f5e9;
  border-radius: 5px !important; /* Add !important */
}

.neutral-answer {
  border: 2px solid gray;
  background-color: #f5f5f5;
  border-radius: 5px !important; /* Add !important */
}
</style>
