<template>
  <v-label class="mt-4 text-black font-weight-bold">Options</v-label>
  
  <v-radio-group v-model="question.selectedAnswer" class="mt-4">
    <v-row dense>
      <v-col cols="12" v-for="(option, index) in question.options" :key="index">
        <v-row align="center" no-gutters class="mb-4">
          <v-col cols="auto">
            <v-radio :value="option.value" color="blue" />
          </v-col>
          <v-col>
            <v-text-field
              v-model="option.text"
              variant="flat"
              hide-details
              class="rounded-lg bg-blue-lighten-5"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-radio-group>
</template>

<script setup>
defineProps({ question: Object });
</script>
