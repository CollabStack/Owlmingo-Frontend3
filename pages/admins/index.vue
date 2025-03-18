<template>
    <v-container>
      <v-card>
        <v-card-title>Dynamic Data Table</v-card-title>
        <v-data-table-server
          v-model:items-per-page="itemsPerPage"
          :headers="headers"
          :items="serverItems"
          :items-length="totalItems"
          :loading="loading"
          :search="search"
          item-value="name"
          @update:options="loadItems"
        ></v-data-table-server>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  definePageMeta({
    layout: 'admin',
  });
  
  // Sample Data (Previously in data.js)
  const desserts = [
    { name: 'Frozen Yogurt', calories: 159, fat: 6, carbs: 24, protein: 4, iron: '1' },
    { name: 'Jelly bean', calories: 375, fat: 0, carbs: 94, protein: 0, iron: '0' },
    { name: 'KitKat', calories: 518, fat: 26, carbs: 65, protein: 7, iron: '6' },
    { name: 'Eclair', calories: 262, fat: 16, carbs: 23, protein: 6, iron: '7' },
    { name: 'Gingerbread', calories: 356, fat: 16, carbs: 49, protein: 3.9, iron: '16' },
    { name: 'Ice cream sandwich', calories: 237, fat: 9, carbs: 37, protein: 4.3, iron: '1' },
    { name: 'Lollipop', calories: 392, fat: 0.2, carbs: 98, protein: 0, iron: '2' },
    { name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, protein: 4.3, iron: '8' },
    { name: 'Honeycomb', calories: 408, fat: 3.2, carbs: 87, protein: 6.5, iron: '45' },
    { name: 'Donut', calories: 452, fat: 25, carbs: 51, protein: 4.9, iron: '22' },
    { name: 'Banana', calories: 452, fat: 25, carbs: 51, protein: 4.9, iron: '12412', metal: '212' },
    { name: 'Banana', calories: 452, fat: 25, carbs: 51, protein: 4.9, iron: '22', metal: '21' },
    { name: 'Banana', calories: 452, fat: 25, carbs: 51, protein: 4.9, iron: '22', metal: '21' }
  ];
  
  // Define the columns to be displayed
  const columns = [
    { title: 'Name', key: 'name', align: 'start', sortable: true },
    { title: 'Calories', key: 'calories', align: 'end', sortable: true },
    { title: 'Fat', key: 'fat', align: 'end', sortable: true },
    { title: 'Carbs', key: 'carbs', align: 'end', sortable: true },
    { title: 'Protein', key: 'protein', align: 'end', sortable: true },
    { title: 'Iron', key: 'iron', align: 'end', sortable: true }
  ];
  
  // Reactive Variables
  const itemsPerPage = ref(5);
  const headers = ref(columns); // Use predefined columns
  const search = ref('');
  const serverItems = ref([]);
  const loading = ref(true);
  const totalItems = ref(0);
  
  // Fake API Simulation
  const FakeAPI = {
    async fetch({ page, itemsPerPage, sortBy }) {
      return new Promise(resolve => {
        setTimeout(() => {
          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          let items = desserts.slice();
  
          if (sortBy.length) {
            const { key, order } = sortBy[0];
            items.sort((a, b) => (order === 'desc' ? b[key] - a[key] : a[key] - b[key]));
          }
  
          // Filter items to only include the fields in columns
          items = items.map(item =>
            Object.fromEntries(Object.entries(item).filter(([key]) => columns.some(col => col.key === key)))
          );
  
          resolve({ items: items.slice(start, end), total: items.length });
        }, 500);
      });
    }
  };
  
  // Load Data from API
  function loadItems({ page, itemsPerPage, sortBy }) {
    loading.value = true;
    FakeAPI.fetch({ page, itemsPerPage, sortBy }).then(({ items, total }) => {
      serverItems.value = items;
      totalItems.value = total;
      loading.value = false;
    });
  }
  
  // Initialize Headers & Load Data
  onMounted(() => {
    loadItems({ page: 1, itemsPerPage: itemsPerPage.value, sortBy: [] });
  });
  </script>
  