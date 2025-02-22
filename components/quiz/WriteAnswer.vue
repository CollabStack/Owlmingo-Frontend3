<template>
  <v-label class="mt-4 text-black font-weight-bold">Answer</v-label>
  <v-textarea
    v-model="localAnswer"
    class="mt-2 rounded-lg bg-blue-lighten-5"
    variant="flat"
    auto-grow   
    rows="2"
    hide-details
  />
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from "vue";

const props = defineProps({ answer: String });
const emit = defineEmits(["update:answer"]);

const localAnswer = ref(props.answer);

watch(localAnswer, (newValue) => {
  emit("update:answer", newValue);
});
</script>
