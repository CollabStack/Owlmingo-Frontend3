<template>
    <!-- Sidebar (Fixed Left) -->
    <v-col cols="12" md="3" class="pa-4 sidebar">
        <h3 class="text-h6 outfit">Options</h3>

        <!-- Name Input -->
        <v-label class="mt-5">Lesson Name</v-label>
        <v-text-field 
            v-model="name" 
            variant="flat" 
            density="compact" 
            hide-details 
            class="mt-2 bg-blue-lighten-5 border-radius"
            placeholder="Enter name"
        />

        <!-- Checkbox Options -->
        <v-row class="mt-2">
            <v-col>
                <v-checkbox
                    v-for="(option, index) in options"
                    :key="index"
                    v-model="option.model"
                    hide-details
                    density="compact"
                    color="blue"
                >
                    <template v-slot:label>
                    {{ option.label }}
                    <v-tooltip location="top">
                        <template v-slot:activator="{ props }">
                        <v-icon v-bind="props" size="small" class="ml-1">mdi-information-outline</v-icon>
                        </template>
                        {{ option.tooltip }}
                    </v-tooltip>
                    </template>
                </v-checkbox>
            </v-col>
        </v-row>

        <v-spacer></v-spacer>

        <div class="container">
        <v-spacer></v-spacer>
            <v-btn variant="outlined" color="blue" class="rounded-xl" @click="CompletionsPage">
            Completions & Responses
            </v-btn>
        </div>
    </v-col>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    // Reactive State
    const name = ref('');
    const router = useRouter();

    // Checkboxes reactive
    const options = ref([
        { model: ref(true), label: "Show Answers", tooltip: "Toggle to show correct answers after submission." },
        { model: ref(false), label: "Shuffle Questions", tooltip: "Randomizes the order of questions in the quiz." }
    ]);

    const CompletionsPage = () => {
        router.push('/quiz/history-quiz');
    };
    
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

    .outfit {
    font-family: "Outfit", sans-serif;
    }
    .border-radius{
        border-radius: 12px;
    }
    .sidebar {
        background-color: transparent;
        border-right: 1px solid #ccc;
        height: 100vh;
        position: sticky;
        top: 0px;
        margin-left: -170px;
    }
    .container {
        display: flex;
        flex-direction: column;
        height: 55vh; /* Set the height as needed */
    }
</style>
