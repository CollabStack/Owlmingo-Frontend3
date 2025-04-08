<template>
  <v-container fluid class="fill-height d-flex flex-column ma-0 pa-2" style="height: 100vh;">
    <v-sheet class="flex-grow-1 d-flex flex-column" style="width: 100%;">
      <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column" color="primary" variant="outlined" style="width: 100%;">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="white--text">{{ title }}</div>
          <!-- Add Button -->
          <v-btn v-if="showAdd" @click="onAddClick" icon="mdi-plus" color="primary"></v-btn>
        </v-card-title>

        <v-table
          class="flex-grow-1 ma-0 pa-0"
          style="overflow: auto; min-height: calc(100vh - 255px); max-height: calc(100vh - 240px); width: 100%;"
          fixed-header
        >
          <thead>
            <tr>
              <th class="text-left">#</th>
              <th v-for="header in computedHeaders" :key="header.value" class="text-left">
                {{ header.text }} <!-- Display the header text -->
              </th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="item._id">
              <td>{{ index + 1 }}</td>
              <!-- Display item data based on header value -->
              <td v-for="header in computedHeaders" :key="header.value">
                <!-- Check for array or object and display accordingly -->
                <template v-if="Array.isArray(item[header.value])">
                  <ul>
                    <li v-for="(desc, idx) in item[header.value]" :key="idx">{{ desc }}</li>
                  </ul>
                </template>
                <template v-else>
                  {{ item[header.value]  }}
                </template>
              </td>
              <td class="text-right">
                <!-- Activate Button -->
                <v-tooltip bottom v-if="showActivate && item.is_active">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon @click="onDeactivateClick(item._id)" class="mx-1" color="green" v-bind="attrs" v-on="on || {}">
                      mdi-account-check
                    </v-icon>
                  </template>
                  <span>Activate</span>
                </v-tooltip>

                <!-- Deactivate Button -->
                <v-tooltip bottom v-if="showDeactivate && !item.is_active">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon @click="onActivateClick(item._id)" class="mx-1" color="red" v-bind="attrs" v-on="on || {}">
                      mdi-account-off
                    </v-icon>
                  </template>
                  <span>Deactivate</span>
                </v-tooltip>

                <!-- Edit Button -->
                <v-tooltip bottom v-if="showEdit">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon @click="onEditClick(item._id)" class="mx-1" color="primary" v-bind="attrs" v-on="on || {}">
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-table>

      </v-card>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  title: String,
  items: Array,
  headers: Array,
  showAdd: { type: Boolean, default: true },
  showEdit: { type: Boolean, default: false },
  showActivate: { type: Boolean, default: false },
  showDeactivate: { type: Boolean, default: false },
});

// Emits for button actions
const emit = defineEmits(["add-click", "edit-click", "activate-click", "deactivate-click"]);

// Format headers to ensure value matches keys in item
const computedHeaders = computed(() => {
  return props.headers.map((h) => (typeof h === "string" ? { text: h, value: h } : h));
});

// Action handlers
const onAddClick = () => emit("add-click");
const onEditClick = (id) => emit("edit-click", id);
const onActivateClick = (id) => emit("activate-click", id);
const onDeactivateClick = (id) => emit("deactivate-click", id);
</script>
