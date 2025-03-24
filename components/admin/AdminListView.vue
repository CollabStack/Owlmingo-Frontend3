<template>
    <v-container>
      <!-- Table Header -->
      <v-card class="rounded-lg pa-4" elevation="0" color="grey-lighten-2">
        <v-row no-gutters class="px-1">
          <v-col cols="2">
            <h2 class="text-body-1 font-weight-medium text-grey-darken-2 ml-2">Name</h2>
          </v-col>
          <v-col cols="3">
            <h2 class="text-body-1 font-weight-medium text-grey-darken-2 ml-9">Email</h2>
          </v-col>
          <v-col cols="2">
            <h2 class="text-body-1 font-weight-medium text-grey-darken-2 ml-4">Date</h2>
          </v-col>
          <v-col cols="1">
            <h2 class="text-body-1 font-weight-medium text-grey-darken-2 ml-4">Role</h2>
          </v-col>
          <v-col cols="2" class="text-right">
            <h2 class="text-body-1 font-weight-medium text-grey-darken-2 mr-2">Activity</h2>
          </v-col>
          <v-col cols="2" class="text-right">
            <h2 class="text-body-1 font-weight-medium text-grey-darken-2 mr-4">Actions</h2>
          </v-col>
        </v-row>
      </v-card>
  
      <!-- Table Content -->
      <v-card v-for="(admin, index) in filteradmins" :key="index" class="mt-2 pa-1" elevation="1">
        <v-row no-gutters align="center" class="px-1">
          <v-col cols="2">
            <span class="text-body-2 ml-4">{{ admin.name }}</span>
          </v-col>
          <v-col cols="3">
            <span class="text-body-2">{{ admin.email }}</span>
          </v-col>
          <v-col cols="2">
            <span class="text-body-2">{{ admin.date }}</span>
          </v-col>
          <v-col cols="1">
            <v-chip :color="roleColors[admin.role]" small>{{ admin.role }}</v-chip>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-chip :color="ActivityColors[admin.active]" small>{{ admin.active }}</v-chip>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn icon color="blue" variant="text" @click="viewDetails(admin)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" variant="text" @click="removeadmin(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  
  const admins = ref([
    { name: 'John Doe', email: 'john@example.com', date: '2024-03-15', role: 'Admin', active: "Activity" },
    { name: 'Jane Smith', email: 'jane@example.com', date: '2024-02-10', role: 'Admin', active: "Inactive" },
    { name: 'Alice Brown', email: 'alice@example.com', date: '2024-01-20', role: 'Admin', active: "Activity" },
    { name: 'Bob Green', email: 'bob@example.com', date: '2024-03-05', role: 'Admin', active: "Activity" },
  ]);
  
  // Role colors
  const roleColors = {
    Admin: 'green',
    Moderator: 'red',
  }
  
  // Activity colors
  const ActivityColors = {
    Activity: 'green',
    Inactive: 'red',
  }
  
  // Role filtering
  const selectedType = ref('All');
  
  const filteradmins = computed(() => {
    if (selectedType.value === 'All') return admins.value;
    return admins.value.filter(f => f.role === selectedType.value);
  });
  
  // Actions
  const viewDetails = (admin) => {
    alert(`Viewing details for ${admin.name}`);
  }
  
  const removeadmin = (index) => {
    admins.value.splice(index, 1);
  }
  
  </script>
  