<template>
  <div class="summary-container">
    <v-container>
      <v-row>
        <v-col cols="12">
          <SummaryUpload />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">

import SummaryUpload from '~/components/summary/SmmaryUpload.vue';

</script>

<style scoped>
.summary-container {
  padding: 24px;
}
</style>
