<template>
    <v-container class="mb-12 justify-center">
      <!-- Tags Section -->
        <v-row align="center" class="mb-1 mt-2">
            <v-col cols="auto">
                <h2 class="text-h5 font-weight-bold outfit">Tags</h2>
            </v-col>
            <v-col cols="auto" class = "ml-n3">
                <v-btn icon color="red" size="33">
                    <v-icon size="22">mdi-plus</v-icon>
                </v-btn>
            </v-col>
        </v-row>
  
        <v-row>
            <v-col v-for="tag in tags" :key="tag.name">
            <v-card class="pa-2 d-flex align-center tags-color">
                <v-avatar size="16" :color="tag.color" class="ml-2 mr-2"></v-avatar>
                <span class="ml-2 flex-grow-1">{{ tag.name }}</span>
                <v-menu location="left" open-on-hover>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon size="small" variant="flat">
                        <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </template>

                    <v-list dense class="rounded-lg shadow-md bg-gray-100 py-2 px-2">
                        <v-list-item
                        @click="renameItem"
                        class="rounded-lg px-3 py-2 d-flex align-center"
                        :style="{ cursor: 'pointer' }"
                        @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                        @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                        >
                        <v-icon size="18">mdi-pencil</v-icon>
                        <span> Edit</span>
                        </v-list-item>

                        <v-list-item
                        @click="deleteItem"
                        class="rounded-lg px-3 py-2 d-flex align-center"
                        :style="{ cursor: 'pointer', color: 'red' }"
                        @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                        @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                        >
                        <v-icon color="red" size="18">mdi-trash-can</v-icon>
                        <span class="text-red"> Delete</span>
                        </v-list-item>
                    </v-list>
                </v-menu>
                </v-card>
            </v-col>
        </v-row>
  
        <!-- Flashcards Section -->
        <v-row align="center" class="mt-9 mb-3">
            <v-col cols="auto">
                <h2 class="text-h5 font-weight-bold outfit">Flashcards</h2>
            </v-col>
            
            <v-col cols="auto" class="ml-n3">
                <!-- Menu to show options -->
                <v-menu location="bottom" offset-y>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon color="red" size="33">
                        <v-icon size="22">mdi-plus</v-icon>
                        </v-btn>
                    </template>

                    <v-list class="rounded-lg shadow-md bg-gray-100 py-0 px-2">
                        <v-list dense>
                        <v-list-item
                            @click="createWithAI"
                            class="rounded-lg px-3 py-2 d-flex align-center"
                            :style="{ cursor: 'pointer' }"
                            @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                            @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                        >
                            <v-icon size="18" color="primary">mdi-robot</v-icon>
                            <span> Create with AI</span>
                        </v-list-item>

                        <v-list-item
                            @click="createFromScratch"
                            class="rounded-lg px-3 py-2 d-flex align-center"
                            :style="{ cursor: 'pointer' }"
                            @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                            @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                        >
                            <v-icon size="18" color="primary">mdi-pencil</v-icon>
                            <span> Create from scratch</span>
                        </v-list-item>
                        </v-list>
                    </v-list>
                </v-menu>
            </v-col>
        </v-row>

        <v-row>
            <v-col v-for="card in flashcards" :key="card.title" cols="12" md="4">
                <v-card class="pa-4 rounded-lg elevation-1">
                    <div class="d-flex justify-space-between align-center mt-n2 ml-n2 mr-n2">
                        <v-card-title class="text-h6 font-weight-bold outfit">
                        {{ card.title }}
                        </v-card-title>
                        <v-menu location="left" open-on-hover>
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" icon size="small" variant="flat">
                                <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>

                            <v-list dense class="rounded-lg shadow-md bg-gray-100 py-2 px-2">
                                <v-list-item
                                @click="renameItem"
                                class="rounded-lg px-3 py-2 d-flex align-center"
                                :style="{ cursor: 'pointer' }"
                                @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                                @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                                >
                                <v-icon size="18">mdi-pencil</v-icon>
                                <span> Edit</span>
                                </v-list-item>

                                <v-list-item
                                @click="deleteItem"
                                class="rounded-lg px-3 py-2 d-flex align-center"
                                :style="{ cursor: 'pointer', color: 'red' }"
                                @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                                @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                                >
                                <v-icon color="red" size="18">mdi-trash-can</v-icon>
                                <span class="text-red"> Delete</span>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>

                    <v-card-subtitle class="text-grey-darken-1 ml-n2 mt-n2 mb-3">
                        {{ card.count }} cards • {{ card.time }}
                    </v-card-subtitle>
                    
                    <v-card-actions class="d-flex justify-end mb-n2">
                        <div>
                        <v-btn variant="outlined" color="blue" size="small" class="rounded-lg">Edit</v-btn>
                        <v-btn variant="flat" color="blue" size="small" class="ml-2 rounded-lg">View</v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>

        <!-- Quizzes Section -->
        <v-row align="center" class="mt-9 mb-3">
            <v-col cols="auto">
                <h2 class="text-h5 font-weight-bold outfit">Quizzes</h2>
            </v-col>
            <v-col cols="auto" class="ml-n3">
                <!-- Menu to show options -->
                <v-menu location="bottom" offset-y>
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" icon color="red" size="33">
                        <v-icon size="22">mdi-plus</v-icon>
                        </v-btn>
                    </template>

                    <v-list class="rounded-lg shadow-md bg-gray-100 py-0 px-2">
                        <v-list dense>
                        <v-list-item
                            @click="createWithAI"
                            class="rounded-lg px-3 py-2 d-flex align-center"
                            :style="{ cursor: 'pointer' }"
                            @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                            @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                        >
                            <v-icon size="18" color="primary">mdi-robot</v-icon>
                            <span> Create with AI</span>
                        </v-list-item>

                        <v-list-item
                            @click="createFromScratch"
                            class="rounded-lg px-3 py-2 d-flex align-center"
                            :style="{ cursor: 'pointer' }"
                            @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                            @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                        >
                            <v-icon size="18" color="primary">mdi-pencil</v-icon>
                            <span> Create from scratch</span>
                        </v-list-item>
                        </v-list>
                    </v-list>
                </v-menu>
            </v-col>
        </v-row>
    
        <v-row>
            <v-col v-for="quiz in quizzes" :key="quiz.title" cols="12" md="4">
                <v-card class="pa-4 rounded-lg elevation-1">
                    <div class="d-flex justify-space-between align-center mt-n2 ml-n2 mr-n2">
                        <v-card-title class="text-h6 font-weight-bold outfit">
                        {{ quiz.title }}
                        </v-card-title>
                        <v-menu location="left" open-on-hover>
                            <template v-slot:activator="{ props }">
                                <v-btn v-bind="props" icon size="small" variant="flat">
                                <v-icon>mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>

                            <v-list dense class="rounded-lg shadow-md bg-gray-100 py-2 px-2">
                                <v-list-item
                                @click="renameItem"
                                class="rounded-lg px-3 py-2 d-flex align-center"
                                :style="{ cursor: 'pointer' }"
                                @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                                @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                                >
                                <v-icon size="18">mdi-pencil</v-icon>
                                <span> Edit</span>
                                </v-list-item>

                                <v-list-item
                                @click="deleteItem"
                                class="rounded-lg px-3 py-2 d-flex align-center"
                                :style="{ cursor: 'pointer', color: 'red' }"
                                @mouseenter="(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'"
                                @mouseleave="(e) => e.currentTarget.style.backgroundColor = ''"
                                >
                                <v-icon color="red" size="18">mdi-trash-can</v-icon>
                                <span class="text-red"> Delete</span>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>

                    <v-card-subtitle class="text-grey-darken-1 ml-n2 mt-n2 mb-3">
                        {{ quiz.questions }} Question • {{ quiz.time }}
                    </v-card-subtitle>
                    
                    <v-card-actions class="d-flex justify-end mb-n2">
                        <div>
                        <v-btn variant="outlined" color="blue" size="small" class="rounded-lg">Edit</v-btn>
                        <v-btn variant="flat" color="blue" size="small" class="ml-2 rounded-lg">View</v-btn>
                        </div>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>
  
  <script setup>
  const tags = [
    { name: "Red", color: "red" },
    { name: "Blue", color: "blue" },
    { name: "Yellow", color: "yellow" },
    { name: "Green", color: "green" },
  ];
  
  const flashcards = [
    { title: "Lesson 2", count: 2, time: "just now" },
    { title: "Mobile UI Components", count: 34, time: "24 days ago" },
  ];
  
  const quizzes = [
    { title: "Quiz 1", questions: 1, time: "just now" },
    { title: "Game Programming", questions: 1, time: "5 days ago" },
  ];
</script>
  
<style scoped>
    /* Import Outfit font */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

    /* Outfit font classes */
    .outfit {
        font-family: "Outfit", sans-serif;
        font-optical-sizing: auto;
        font-style: normal;
    }

    .outfit-regular {
        font-weight: 400;
    }

    .outfit-medium {
        font-weight: 500;
    }

    .outfit-bold {
        font-weight: 700;
    }
    .tags-color {
        margin-top: -12px;
        min-width: 150px; 
        max-width: 900px;
        border-radius: 12px;
    }
    .v-card {
        min-width: 100px;
    }
</style>
  