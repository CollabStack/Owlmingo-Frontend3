<template>
  <v-card class="pa-4 mt-6 rounded-lg elevation-2">
    <v-row align="center" justify="space-between">
      <v-col cols="auto">
        <h3 class="text-h6">Question</h3>
      </v-col>
      <v-col cols="auto">
        <img
          src="/icons/icons8-delete-button.svg"
          alt="Delete"
          class="icon-size mt-2"
          @click="$emit('delete')"
        />
      </v-col>
    </v-row>

    <v-label class="mt-4">Question Type</v-label>
    <v-select
      v-model="localQuestion.type"
      :items="questionTypes"
      item-title="text"
      item-value="value"
      variant="flat"
      class="mt-2 rounded bg-blue-lighten-5 w-25"
      density="compact"
      hide-details
      @update:modelValue="resetAnswers"
    />

    <v-label class="mt-4">Question</v-label>
    <v-textarea
      v-model="localQuestion.text"
      class="mt-2 rounded-lg bg-blue-lighten-5 w-75"
      variant="flat"
      auto-grow
      rows="2"
      hide-details
      placeholder="Enter your question"
      @update:modelValue="emitUpdatedQuestion"
    />

    <v-label class="mt-4">Options</v-label>

    <v-radio-group v-if="!localQuestion.type" v-model="localQuestion.selectedOption" class="mt-2">
      <v-row dense>
        <v-col v-for="(option, index) in localQuestion.options" :key="index" cols="12" class="mt-4">
          <v-row align="center" no-gutters>
            <v-col cols="auto">
              <v-radio :value="option.value" color="blue" />
            </v-col>
            <v-col>
              <v-text-field v-model="option.text" variant="flat" hide-details class="rounded-lg bg-blue-lighten-5" placeholder="Enter answer" @update:modelValue="emitUpdatedQuestion" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-radio-group>

    <div v-else class="mt-6">
      <v-row dense>
        <v-col v-for="(option, index) in localQuestion.options" :key="index" cols="12">
          <v-row no-gutters>
            <v-col cols="auto">
              <v-checkbox v-model="localQuestion.selectedAnswers" :value="option.value" color="blue" />
            </v-col>
            <v-col>
              <v-text-field v-model="option.text" variant="flat" hide-details class="rounded-lg bg-blue-lighten-5" placeholder="Enter answer" @update:modelValue="emitUpdatedQuestion" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';

const emit = defineEmits(['delete', 'update-question']);

const props = defineProps({
  question: Object
});

const localQuestion = ref({ ...props.question });

const questionTypes = [
  { text: 'Single Choice', value: false },
  { text: 'Multiple Choice', value: true }
];

watch(
  () => props.question,
  (newQuestion) => {
    localQuestion.value = { ...newQuestion };
  },
  { deep: true, immediate: true }
);

const resetAnswers = () => {
  localQuestion.value.selectedOption = null;
  localQuestion.value.selectedAnswers = [];
  localQuestion.value.options = generateDefaultOptions();
  emitUpdatedQuestion();
};

const generateDefaultOptions = () => {
  return Array.from({ length: 4 }, (_, index) => ({
    value: `${index + 1}`,
    text: ''
  }));
};

const emitUpdatedQuestion = () => {
  emit('update-question', localQuestion.value);
};
</script>



<style scoped>
.icon-size {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
</style>
