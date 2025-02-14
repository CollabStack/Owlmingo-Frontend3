<template>
  <v-container class="text-center">
    <h2 class="text-h5 font-weight-bold">Subscribe to Generate Unlimited Quizzes</h2>
    <p class="text-body-2 text-grey-darken-1" style="max-width: 1000px; margin: 0 auto;">
      Unlock the full potential of the question generator with our subscription plans.
      From training materials to academic notes, our AI intelligently creates quizzes
      to reinforce learning or assess knowledge for students and professionals alike.
    </p>

    <v-btn-toggle v-model="selectedTab" class="mt-3" rounded mandatory>
      <v-btn value="school" class="toggle-button" :class="{ active: selectedTab === 'school' }">
        School
      </v-btn>
      <v-btn value="work" class="toggle-button" :class="{ active: selectedTab === 'work' }">
        Work
      </v-btn>
    </v-btn-toggle>

    <v-row class="mt-6 justify-center">
      <v-col cols="12" md="5" v-for="(plan, index) in activePlans" :key="index">
        <v-card class="pa-6" elevation="2" style="border-radius: 20px">
          <p class="text-h6 font-weight-bold" :class="plan.colorClass">{{ plan.name }}</p>
          <p class="text-h4 font-weight-bold">
            {{ plan.price }} <span class="text-h6">/ month</span>
          </p>
          <p class="text-caption text-grey-darken-1">{{ plan.billing }}</p>

          <v-list density="compact">
            <v-list-item v-for="(feature, i) in plan.features" :key="i" class="align-start">
              <template #prepend>
                <v-icon :color="plan.iconColor">mdi-check-circle</v-icon>
              </template>
              <v-list-item-content>
                <v-list-item-title class="text-left">{{ feature }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-btn
            block
            :color="plan.buttonColor"
            class="mt-4"
            rounded
            :variant="getButtonVariant(plan.name)"
          >
            Subscribe
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <p class="mt-6 text-caption">
      Visit our <a href="#" class="text-decoration-none" style="color: blue;">plans page</a> to compare all features.
    </p>
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";

const selectedTab = ref("school");

const plans = {
  school: [
    {
      name: "Annual",
      price: "$5",
      billing: "Billed annually ($60 total)",
      features: [
        "Unlimited quizzes and questions",
        "Unlimited AI-assessed answers",
        "200 pages per document",
        "150,000 characters per text upload",
      ],
      colorClass: "text-primary",
      iconColor: "primary",
      buttonColor: "primary",
    },
    {
      name: "Monthly",
      price: "$12",
      billing: "Billed monthly",
      features: [
        "Unlimited quizzes and questions",
        "Unlimited AI-assessed answers",
        "200 pages per document",
        "150,000 characters per text upload",
      ],
      colorClass: "text-error",
      iconColor: "error",
      buttonColor: "error",
    },
  ],
  work: [
    {
      name: "Professional",
      price: "$19",
      billing: "Billed annually ($228 total)",
      features: [
        "Unlimited quizzes and questions",
        "Unlimited AI-assessed answers",
        "200 pages per document",
        "150,000 characters per text upload",
        "500 responses per month",
        "Revisely Branding on Quizzes",
      ],
      colorClass: "text-primary",
      iconColor: "primary",
      buttonColor: "primary",
    },
    {
      name: "Business",
      price: "$49",
      billing: "Billed annually ($588 total)",
      features: [
        "Unlimited quizzes and questions",
        "Unlimited AI-assessed answers",
        "200 pages per document",
        "150,000 characters per text upload",
        "Unlimited responses",
        "No Revisely branding",
      ],
      colorClass: "text-error",
      iconColor: "error",
      buttonColor: "error",
    },
  ],
};

// Dynamically determine which plans to show
const activePlans = computed(() => plans[selectedTab.value]);

// Determines the button variant based on selection and plan type
const getButtonVariant = (planName) => {
  if (selectedTab.value === "school") {
    return planName === "Annual" ? "flat" : "outlined";
  } else {
    return planName === "Professional" ? "outlined" : "flat";
  }
};
</script>

<style scoped>

.toggle-container {
  display: flex;
  justify-content: center;
}

.toggle-button {
  border-radius: 24px;
  min-width: 100px;
  background-color: transparent;
  color: #4a4a4a;
  transition: background-color 0.3s ease;
  padding: 8px 16px;
}

.toggle-button.active {
  background-color: #d1c4e9;
  color: #3e1f6d;
  margin: 2px;
}

.v-btn-toggle {
  background-color: #f5f5f5;
  border-radius: 24px;
  padding: 4px;
}
</style>
