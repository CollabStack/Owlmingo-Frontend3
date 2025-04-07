<!-- <template>
    <div >
      <AdminGlobalTable
        :title="'Desserts'"
        :items="dessertsData"
        :headers="headers"
        :isLoading="false"
        :showEdit="true"
        :showActivate="true"
        :showDeactivate="true"
      >
      </AdminGlobalTable>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  definePageMeta({
    layout: 'admin',
  });
  
  const headers = ref([
    { text: "Name", value: "name" },
    { text: "Calories", value: "calories" },
    { text: "Fat (g)", value: "fat" },
    { text: "Carbs (g)", value: "carbs" },
    { text: "Protein (g)", value: "protein" },
    { text: "Iron (%)", value: "iron" },
    { text: "Metal", value: "metal" },
  ]);
  
  const dessertsData = ref([
    { name: "Frozen Yogurt", calories: 159, fat: 6, carbs: 24, protein: 4, iron: "1", metal: "2", active: 1 },
    { name: "Jelly Bean", calories: 375, fat: 0, carbs: 94, protein: 0, iron: "0", metal: "3", active: 0 },
    { name: "KitKat", calories: 518, fat: 26, carbs: 65, protein: 7, iron: "6", metal: "4", active: 1 },
    { name: "Eclair", calories: 262, fat: 16, carbs: 23, protein: 6, iron: "7", metal: "5", active: 0 },
    { name: "Gingerbread", calories: 356, fat: 16, carbs: 49, protein: 3.9, iron: "16", metal: "6", active: 1 },
    { name: "Ice Cream Sandwich", calories: 237, fat: 9, carbs: 37, protein: 4.3, iron: "1", metal: "7", active: 0 },
    { name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0, iron: "2", metal: "8", active: 1 },
    { name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3, iron: "8", metal: "9", active: 0 },
    { name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5, iron: "45", metal: "10", active: 1 },
    { name: "Donut", calories: 452, fat: 25, carbs: 51, protein: 4.9, iron: "22", metal: "11", active: 0 },
  
    { name: "Gingerbread", calories: 356, fat: 16, carbs: 49, protein: 3.9, iron: "16", metal: "6", active: 1 },
    { name: "Ice Cream Sandwich", calories: 237, fat: 9, carbs: 37, protein: 4.3, iron: "1", metal: "7", active: 0 },
    { name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0, iron: "2", metal: "8", active: 1 },
    { name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3, iron: "8", metal: "9", active: 0 },
    { name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5, iron: "45", metal: "10", active: 1 },
    { name: "Donut", calories: 452, fat: 25, carbs: 51, protein: 4.9, iron: "22", metal: "11", active: 0 },
  
    { name: "Gingerbread", calories: 356, fat: 16, carbs: 49, protein: 3.9, iron: "16", metal: "6", active: 1 },
    { name: "Ice Cream Sandwich", calories: 237, fat: 9, carbs: 37, protein: 4.3, iron: "1", metal: "7", active: 0 },
    { name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0, iron: "2", metal: "8", active: 1 },
    { name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3, iron: "8", metal: "9", active: 0 },
    { name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5, iron: "45", metal: "10", active: 1 },
    { name: "Donut", calories: 452, fat: 25, carbs: 51, protein: 4.9, iron: "22", metal: "11", active: 0 },
    { name: "Gingerbread", calories: 356, fat: 16, carbs: 49, protein: 3.9, iron: "16", metal: "6", active: 1 },
    { name: "Ice Cream Sandwich", calories: 237, fat: 9, carbs: 37, protein: 4.3, iron: "1", metal: "7", active: 0 },
    { name: "Lollipop", calories: 392, fat: 0.2, carbs: 98, protein: 0, iron: "2", metal: "8", active: 1 },
    { name: "Cupcake", calories: 305, fat: 3.7, carbs: 67, protein: 4.3, iron: "8", metal: "9", active: 0 },
    { name: "Honeycomb", calories: 408, fat: 3.2, carbs: 87, protein: 6.5, iron: "45", metal: "10", active: 1 },
    { name: "Donut", calories: 452, fat: 25, carbs: 51, protein: 4.9, iron: "22", metal: "11", active: 0 },
  ]);
  
  </script>
   -->