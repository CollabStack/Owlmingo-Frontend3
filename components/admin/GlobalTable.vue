<template>
  <v-container fluid class="fill-height d-flex flex-column">
    <v-sheet class="flex-grow-1 d-flex flex-column" style="width: 100%;">
      <v-card elevation="2" class="rounded-xl flex-grow-1 d-flex flex-column" color="primary" variant="outlined" style="width: 100%;">
        <v-card-title class="d-flex justify-space-between align-center">
          <div class="white--text">{{ title }}</div>
          <!--  Add Button -->
          <v-btn v-if="showAdd" @click="onAddClick" icon="mdi-plus" color="primary"></v-btn>

        </v-card-title>

        <v-table class="flex-grow-1" style="overflow: auto; max-height: calc(100vh - 150px); width: 100%;" fixed-header>
          <thead>
            <tr>
              <th v-for="header in computedHeaders" :key="header.value" class="text-left">
                {{ header.text }}
              </th>
              <th class="text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td v-for="header in computedHeaders" :key="header.value">
                {{ item[header.value] }}
              </td>
              <td>
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

const emit = defineEmits(["add-click", "edit-click", "activate-click", "deactivate-click"]);

const computedHeaders = computed(() => {
  return props.headers.map((h) => (typeof h === "string" ? { text: h, value: h } : h));
});

const onAddClick = () => emit("add-click");
const onEditClick = (id) => emit("edit-click", id);
const onActivateClick = (id) => emit("activate-click", id);
const onDeactivateClick = (id) => emit("deactivate-click", id);
</script>
