<template>
    <!-- Sidebar -->
    <SideBarQuiz />

    <!-- Main Content -->
    <v-row class="mx-12 mt-4">
        <v-col cols="12" class="mx-auto">
            <!-- Start Quiz Button -->
            <v-btn variant="outlined" class="float-end mt-2 rounded-lg" color="blue" @click="DoQuiz">
                Start Quiz
            </v-btn>

            <!-- Quiz Title -->
            <h2 class="text-h5 mt-2">Edit Quiz</h2>

            <!-- Edit Quiz Card -->
            <EditQuiz />

            <v-row justify="center" class="mt-12 mb-12">
                <v-btn variant="outlined" class="rounded-xl" color="blue" @click="AddQuestion">
                    Add Question
                </v-btn>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup>
    import { ref } from 'vue';
    import EditQuiz from '~/components/quiz/EditQuiz.vue';
    import SideBarQuiz from '~/components/quiz/SideBarQuiz.vue';

</script>

<style scoped>  

</style>
