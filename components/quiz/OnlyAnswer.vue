<template>
  <v-label class="mt-4 text-black font-weight-bold">Correct Answer</v-label>

  <v-radio-group v-model="question.selectedAnswer" class="mt-2">
    <v-radio
      v-for="(option, index) in question.options"
      :key="index"
      :value="option.value"
      class="mb-2"
      color="blue"
    >
      <template v-slot:label>
        <span class="text-body-1 font-weight-medium">{{ option.text }}</span>
      </template>
    </v-radio>
  </v-radio-group>
</template>

<script setup>
defineProps({ question: Object });
</script>
