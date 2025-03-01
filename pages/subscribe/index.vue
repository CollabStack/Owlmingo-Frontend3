<template>
  <v-container class="text-center">
    <h2 class="text-h5 font-weight-bold">Subscribe to Generate Unlimited Quizzes</h2>
    <p class="text-body-2 text-grey-darken-1">
      Unlock the full potential of the question generator with our subscription plans.
      From training materials to academic notes, our AI intelligently creates quizzes
      to reinforce learning or assess knowledge for students and professionals alike.
    </p>

    <!-- School & Work Toggle -->
    <v-btn-toggle v-model="selectedTab" class="mt-3 bg-grey-lighten-3 rounded-pill pa-1" density="compact" mandatory>
      <v-btn value="school" class="rounded-pill" :class="{
          'bg-deep-purple-lighten-3 text-black': selectedTab === 'school',
          'bg-transparent text-black': selectedTab !== 'school'
      }" size="small">
        School
      </v-btn>
      <v-btn value="work" class="rounded-pill" :class="{
          'bg-deep-purple-lighten-3 text-black': selectedTab === 'work',
          'bg-transparent text-black': selectedTab !== 'work'
      }" size="small">
        Work
      </v-btn>
    </v-btn-toggle>

    <v-row class="mt-6 justify-center">
      <v-col cols="12" md="5" v-for="(plan, index) in activePlans" :key="index">
        <v-card class="pa-6 text-left rounded-lg" elevation="2" style="border-radius: 20px">
          <p class="text-h4 font-weight-bold mb-1" :class="plan.colorClass">
            {{ plan.name }}
          </p>

          <!-- Price & Billing Info -->
          <p class="text-h4 font-weight-bold mb-1">
            <template v-if="selectedTab === 'school'">
              {{ plan.price }} <span class="text-h6">/ month</span>
            </template>
            <template v-else>
              {{ selectedTypes[plan.name] === 'month' ? plan.monthlyPrice : plan.annualPrice }}
              <span class="text-h6">/ month</span>
            </template>
          </p>
          <p class="text-h7 text-grey-darken-1 mb-1">
            {{ selectedTab === 'school' ? plan.billing : selectedTypes[plan.name] === 'month' ? plan.monthlyBilling : plan.annualBilling }}
          </p>

          <!-- v-btn-toggle (Only for Work Plans) -->
          <transition name="fade">
            <v-btn-toggle
              v-if="selectedTab === 'work'"
              v-model="selectedTypes[plan.name]"
              class="mt-2 bg-grey-lighten-3 rounded-pill pa-1"
              density="compact"
              mandatory
            >
              <v-btn class="rounded-pill" size="small" value="annual" :class="{
                'bg-grey-lighten-2 text-black': selectedTypes[plan.name] === 'annual',
                'bg-transparent text-black': selectedTypes[plan.name] !== 'annual'
              }">
                Annual
              </v-btn>
              <v-btn class="rounded-pill" size="small" value="month" :class="{
                'bg-grey-lighten-2 text-black': selectedTypes[plan.name] === 'month',
                'bg-transparent text-black': selectedTypes[plan.name] !== 'month'
              }">
                Month
              </v-btn>
            </v-btn-toggle>
          </transition>

          <!-- Features List -->
          <v-list class="text-left">
            <v-list-item v-for="(feature, i) in plan.features" :key="i" class="align-start">
              <template #prepend>
                <img src="/public/icons/icons8-checkmark.svg" alt="" style="height: 30px; width: 30px; margin-right: 5px;">
              </template>
              <v-list-item-content>
                <v-list-item-title>{{ feature }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <!-- For School Tab: See Work Plans Link -->
          <p v-if="selectedTab === 'school'" class="text-h7 mb-1">
            See our
            <a href="#" @click="selectedTab = 'work'" class="text-decoration-none" style="color: blue;">
              work plans
            </a>
            for responses and other features for teachers and professionals.
          </p>

          <!-- Subscribe Button -->
          <v-btn block :color="plan.buttonColor" class="mt-4 rounded-lg" rounded :variant="getButtonVariant(plan.name)">
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

// Stores selection state for Professional & Business plans separately
const selectedTypes = ref({
  Professional: "annual",
  Business: "annual",
});

const plans = {
  school: [
    {
      name: "Annual",
      price: "$5",
      billing: "Billed annually ($60 total)",
      features: [
        "Unlimited quizzes and questions",
        "Unlimited AI-assessed answers",
        "200 pages per document upload",
        "150,000 characters per text upload"
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
        "200 pages per document upload",
        "150,000 characters per text upload"
      ],
      colorClass: "text-error",
      iconColor: "error",
      buttonColor: "error",
    },
  ],
  work: [
    {
      name: "Professional",
      annualPrice: "$19",
      monthlyPrice: "$29",
      annualBilling: "Billed annually ($228 total)",
      monthlyBilling: "Billed monthly",
      features: [
        "Unlimited quizzes and questions",
        "Unlimited AI-assessed answers",
        "200 pages per document upload",
        "150,000 characters per text upload",
        "500 responses per month",
        "Revisely Branding on Quizzes"
      ],
      colorClass: "text-primary",
      iconColor: "primary",
      buttonColor: "primary",
    },
    {
      name: "Business",
      annualPrice: "$49",
      monthlyPrice: "$69",
      annualBilling: "Billed annually ($588 total)",
      monthlyBilling: "Billed monthly",
      features: [
        "Unlimited quizzes and questions",
        "Unlimited AI-assessed answers",
        "200 pages per document upload",
        "150,000 characters per text upload",
        "Unlimited responses",
        "No Revisely branding"
      ],
      colorClass: "text-error",
      iconColor: "error",
      buttonColor: "error",
    },
  ],
};

// Reactive plans based on selected tab
const activePlans = computed(() => plans[selectedTab.value]);

// Determine button variant
const getButtonVariant = (planName) => {
  if (selectedTab.value === "school") {
    return planName === "Annual" ? "flat" : "outlined";
  } else {
    return planName === "Professional" ? "outlined" : "flat";
  }
};
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>