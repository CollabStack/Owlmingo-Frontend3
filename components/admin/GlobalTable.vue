<template>
  <v-container fluid class="fill-height d-flex flex-column" style="height: 100vh;">
    <v-sheet class="flex-grow-1 d-flex flex-column" style="width: 100%;">
      <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column" color="primary" variant="outlined" style="width: 100%;">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="white--text">{{ title }}</div>
          <!-- Add Button -->
          <v-btn v-if="showAdd" @click="onAddClick" icon="mdi-plus" color="primary"></v-btn>
        </v-card-title>

        <v-table
          class="flex-grow-1 ma-0 pa-0"
          style="overflow: auto; min-height: calc(100vh - 255px); max-height: calc(100vh - 255px); width: 100%;"
          fixed-header
        >
          <thead>
            <tr>
              <th class="text-left">#</th>
              <th v-for="header in computedHeaders" :key="header.value" class="text-left">
                {{ header.text }}
              </th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in paginatedItems" :key="item.id">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td v-for="header in computedHeaders" :key="header.value">
                {{ item[header.value] }}
              </td>
              <td class="text-right">
                <v-tooltip bottom v-if="showActivate && item.active === 1">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon @click="onDeactivateClick(item.global_id)" class="mx-1" color="green" v-bind="attrs" v-on="on">
                      mdi-account-check
                    </v-icon>
                  </template>
                  <span>Activate</span>
                </v-tooltip>

                <v-tooltip bottom v-if="showDeactivate && item.active === 0">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon @click="onActivateClick(item.global_id)" class="mx-1" color="red" v-bind="attrs" v-on="on">
                      mdi-account-off
                    </v-icon>
                  </template>
                  <span>Deactivate</span>
                </v-tooltip>

                <v-tooltip bottom v-if="showEdit">
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon @click="onEditClick(item.global_id)" class="mx-1" color="primary" v-bind="attrs" v-on="on">
                      mdi-pencil
                    </v-icon>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
              </td>
            </tr>
          </tbody>
        </v-table>

        <!-- Pagination Controls -->
        <v-container class="mt-auto">
          <v-row no-gutters>
            <v-col cols="12" sm="4">

            </v-col>

            <v-col cols="12" sm="4" class="d-flex justify-center">
              <v-pagination
                v-if="items.length > 0"
                v-model="currentPage"
                :length="totalPages"
                :total-visible="7"
                color="primary"
                class="mx-auto"
              ></v-pagination>
            </v-col>

            <v-col v-if="currentPage === totalPages" cols="12" sm="4" class="d-flex justify-end align-center">
              <v-btn variant="tonal" @click="onLoadMoreClick" color="primary" class="ml-4">
                Load More
              </v-btn>  
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-sheet>
  </v-container>
</template>

<script setup>
import { computed, defineProps, defineEmits, ref } from "vue";

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

// Pagination states
const itemsPerPage = 25;
const currentPage = ref(1);

// Compute total pages
const totalPages = computed(() => Math.ceil(props.items.length / itemsPerPage));

// Compute paginated items
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return props.items.slice(start, start + itemsPerPage);
});

// Format headers
const computedHeaders = computed(() => {
  return props.headers.map((h) => (typeof h === "string" ? { text: h, value: h } : h));
});

// Action handlers
const onAddClick = () => emit("add-click");
const onEditClick = (id) => emit("edit-click", id);
const onActivateClick = (id) => emit("activate-click", id);
const onDeactivateClick = (id) => emit("deactivate-click", id);
const onLoadMoreClick = () => emit("load-more-click");
</script>
