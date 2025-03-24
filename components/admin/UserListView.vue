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
      <v-card v-for="(user, index) in filterusers" :key="index" class="mt-2 pa-1" elevation="1">
        <v-row no-gutters align="center" class="px-1">
          <v-col cols="2">
            <span class="text-body-2 ml-4">{{ user.name }}</span>
          </v-col>
          <v-col cols="3">
            <span class="text-body-2">{{ user.email }}</span>
          </v-col>
          <v-col cols="2">
            <span class="text-body-2">{{ user.date }}</span>
          </v-col>
          <v-col cols="1">
            <v-chip :color="roleColors[user.role]" small class="ml-2">{{ user.role }}</v-chip>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-chip :color="ActivityColors[user.active]" small>{{ user.active }}</v-chip>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-btn icon color="blue" variant="text" @click="viewDetails(user)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon color="red" variant="text" @click="removeuser(index)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  
  const users = ref([
    { name: 'John Doe', email: 'john@example.com', date: '2024-03-15', role: 'User', active: "Activity" },
    { name: 'Jane Smith', email: 'jane@example.com', date: '2024-02-10', role: 'User', active: "Inactive" },
    { name: 'Alice Brown', email: 'alice@example.com', date: '2024-01-20', role: 'User', active: "Activity" },
    { name: 'Bob Green', email: 'bob@example.com', date: '2024-03-05', role: 'User', active: "Activity" },
  ]);
  
  // Role colors
  const roleColors = {
    User: 'blue',
    Admin: 'green',
  }
  
  // Activity colors
  const ActivityColors = {
    Activity: 'green',
    Inactive: 'red',
  }
  
  // Role filtering
  const selectedType = ref('All');
  
  const filterusers = computed(() => {
    if (selectedType.value === 'All') return users.value;
    return users.value.filter(f => f.role === selectedType.value);
  });
  
  // Actions
  const viewDetails = (user) => {
    alert(`Viewing details for ${user.name}`);
  }
  
  const removeuser = (index) => {
    users.value.splice(index, 1);
  }
  
  </script>
  