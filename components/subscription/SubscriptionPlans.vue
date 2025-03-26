<template>
  <v-container class="text-center">
    <div v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }" class="mb-10">
      <h2 class="text-h5 font-weight-bold gradient-text-alt outfit outfit-bold">{{ title }}</h2>
      <p class="text-body-2 text-grey-darken-1 outfit outfit-regular mb-5">
        {{ description }}
      </p>
    </div>

    <v-row class="mt-6 justify-center">
      <v-col cols="12" md="5" v-for="(plan, index) in activePlans" :key="index">
        <subscription-card
          :plan="plan"
          :selectedTab="selectedTab"
          :buttonText="buttonText"
          :getButtonVariant="getButtonVariant"
          @subscribe="$emit('subscribe', $event)"
        />
      </v-col>
    </v-row>

    <p v-if="showFooterLink" class="mt-6 text-caption outfit outfit-regular" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 800, duration: 500 } }">
      Visit our <a href="#" class="text-decoration-none link-hover" style="color: blue;" @click="$emit('linkClick')">plans page</a> to compare all features.
    </p>
  </v-container>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  title: {
    type: String,
    default: "Subscribe to Generate Unlimited Quizzes"
  },
  description: {
    type: String,
    default: "Unlock the full potential of the question generator with our subscription plans. From training materials to academic notes, our AI intelligently creates quizzes to reinforce learning or assess knowledge for students and professionals alike."
  },
  buttonText: {
    type: String,
    default: "Subscribe"
  },
  showFooterLink: {
    type: Boolean,
    default: true
  },
  initialTab: {
    type: String,
    default: "school"
  }
});

const emit = defineEmits(['subscribe', 'tabChange', 'linkClick']);

const selectedTab = ref(props.initialTab);

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
      colorClass: "secondary",
      iconColor: "secondary",
      buttonColor: "secondary",
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
      colorClass: "gold",
      iconColor: "gold",
      buttonColor: "gold",
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
      colorClass: "secondary",
      iconColor: "secondary",
      buttonColor: "secondary",
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
      colorClass: "gold",
      iconColor: "gold",
      buttonColor: "gold",
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

// Emit tab changes
watch(selectedTab, (newValue) => {
  emit('tabChange', newValue);
});
</script>
