<template>
    <div class="ml-15">
      <!-- Tag Section with Add Button -->
      <v-row class="my-10" align="center">
        <span class="text-h5">Tag</span>
        <v-img 
          src="/icons/icons8-add-100.png" 
          max-width="30" 
          class="ml-3" 
          @click="showColorPicker = true"
          style="cursor: pointer;"
        ></v-img>
      </v-row>
  
      <!-- Display Added Colors -->
      <v-row class="mx-15">
        <v-col v-for="(name, hex) in colorNames" :key="hex" cols="3" class="d-flex pa-2">
          
          <div class="box d-flex align-center justify-space-between rounded-lg px-3 bg-white">
  <div class="d-flex">
    <div class="box1 rounded-lg fixed" :style="{ backgroundColor: hex, color: getTextColor(hex) }" @click="renameColor(hex)"></div>
    <span class="ml-2">{{ name || hex }}</span>
  </div>
  
  <v-icon   color="red" icon="mdi-delete" @click="deleteColor(hex)" variant="text"></v-icon>

</div>
        </v-col>
      </v-row>
  
      <!-- Color Picker Dialog -->
      <v-dialog v-model="showColorPicker" max-width="350">
        <v-card>
          <v-card-title>Select a Color</v-card-title>
          <v-card-text>
            <v-color-picker v-model="selectedColor" hide-inputs @change="updateColorName"></v-color-picker>
            <v-text-field v-model="newColorName" label="Enter Color Name"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="red" @click="showColorPicker = false">Cancel</v-btn>
            <v-btn color="green" @click="addColor">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- Flashcard -->
       <dev>
        <v-row class="my-10" align="center">
        <span class="text-h5">Flashcard</span>
        <v-img 
          src="/icons/icons8-add-100.png" 
          max-width="30" 
          class="ml-3" 
          @click="showColorPicker = true"
          style="cursor: pointer;"
        ></v-img>
      </v-row>
       </dev>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  // State variables
  const showColorPicker = ref(false);
  const selectedColor = ref("");
  const newColorName = ref("");
  
  // Color dictionary, with fallback to localStorage
  const colorNames = ref({});
  
  // Load colors from localStorage if available
  onMounted(() => {
    const savedColors = localStorage.getItem("colors");
    if (savedColors) {
      colorNames.value = JSON.parse(savedColors);
    } else {
      // Default colors
      colorNames.value = {
       
      };
    }
  });
  
  // Function to add a color
  const addColor = () => {
    if (selectedColor.value) {
      colorNames.value[selectedColor.value] = newColorName.value || selectedColor.value;
      newColorName.value = "";
      showColorPicker.value = false;
  
      // Save colors to localStorage
      localStorage.setItem("colors", JSON.stringify(colorNames.value));
    }
  };
  
  // Function to rename a color
  const renameColor = (hex) => {
    const newName = prompt("Enter a new name for this color:", colorNames.value[hex]);
    if (newName !== null) {
      colorNames.value[hex] = newName;
  
      // Save updated colors to localStorage
      localStorage.setItem("colors", JSON.stringify(colorNames.value));
    }
  };

  // Function to delete color
  const deleteColor = (hex) => {
    delete colorNames.value[hex];
    localStorage.setItem("colors", JSON.stringify(colorNames.value));  }
  
  // Function to update the color name based on selection
  const updateColorName = () => {
    if (selectedColor.value) {
      // Use a simple color name based on the hex value, or use a library to get a more meaningful name
      newColorName.value = getColorName(selectedColor.value);
    }
  };
  
  // Function to get a color name based on hex value (simple mapping)
  const getColorName = (hex) => {
    const colorNamesMap = {
     
      // Add more colors as needed
    };
  
    return colorNamesMap[hex] || `Color-${hex.slice(1)}`; // Default to a generic name based on the hex
  };
  
  // Function to determine text color for readability
  const getTextColor = (hex) => {
    return parseInt(hex.replace("#", ""), 16) > 0xffffff / 2 ? "black" : "white";
  };
  </script>
  
  <style scoped>
  
  
  .box1 {
    width: 30px; 
    height: 30px; 
    margin-right: 15px;
  }
  
  .box {
    width: 100%; 
    height: 50px; 
    align-items: center;
  }
  
  .ml-2 {
    margin-left: 10px;
  }
  
  .ml-15 {
    margin-left: 15px; 
  }
  </style>
  