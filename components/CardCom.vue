<template>
     <v-container>
       <v-row align="stretch"> 
         <v-col cols="12" md="4" class="text-center">
           <v-card class="d-flex flex-column fill-height" elevation="2">
             <v-card-item>
               <v-btn class="ma-2" color="purple" icon="mdi-lightbulb"></v-btn>
               <v-card-title class="font-weight-black">
                 Transform the Way You Learn with AI-Powered Tools!
               </v-card-title>
               <v-card-text class="text-medium-emphasis">
                 Generate flashcards, quizzes, and summaries instantly. Perfect for students, teachers, and professionals!
               </v-card-text>
             </v-card-item>
             <v-spacer></v-spacer>
             <v-card-actions class="justify-center">
               <NuxtLink to="/about">
                 <v-btn variant="outlined" rounded="xl" color="#3E53A1" class="ma-2">Explore Features</v-btn>
               </NuxtLink>
             </v-card-actions>
           </v-card>
         </v-col>
 
         <v-col cols="12" md="4" class="text-center">
           <v-card class="d-flex flex-column fill-height" elevation="2">
             <v-card-item>
               <v-btn class="ma-2" color="purple" icon="mdi-school"></v-btn>
               <v-card-title class="font-weight-black">Practice & Master</v-card-title>
               <v-card-text class="text-medium-emphasis">
                 Strengthen your understanding with in-depth explanations and tailored content. Whether exploring new concepts or refining your knowledge.
               </v-card-text>
             </v-card-item>
             <v-spacer></v-spacer>
             <v-card-actions class="justify-center">
               <NuxtLink to="/about">
                 <v-btn variant="outlined" rounded="xl" color="#3E53A1" class="ma-2">Explore Features</v-btn>
               </NuxtLink>
             </v-card-actions>
           </v-card>
         </v-col>
 
         <v-col cols="12" md="4" class="text-center">
           <v-card class="d-flex flex-column fill-height" elevation="2">
             <v-card-item>
               <v-btn class="ma-2" color="purple" icon="mdi-account-group"></v-btn>
               <v-card-title class="font-weight-black">Study & Collaborate</v-card-title>
               <v-card-text class="text-medium-emphasis">
                 Easily share your generated content with peers or instructors. Send quizzes, notes, and flashcards to enhance group study.
               </v-card-text>
             </v-card-item>
             <v-spacer></v-spacer>
             <v-card-actions class="justify-center">
               <NuxtLink to="/about">
                 <v-btn variant="outlined" rounded="xl" color="#3E53A1" class="ma-2">Explore Features</v-btn>
               </NuxtLink>
             </v-card-actions>
           </v-card>
         </v-col>
       </v-row>
     </v-container>
</template>