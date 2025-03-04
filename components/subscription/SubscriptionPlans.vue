<template>
  <v-container class="text-center">
    <div v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
      <h2 class="text-h5 font-weight-bold gradient-text-alt outfit outfit-bold">{{ title }}</h2>
      <p class="text-body-2 text-grey-darken-1 outfit outfit-regular mb-5">
        {{ description }}
      </p>
    </div>

    <!-- School & Work Toggle with animation -->
    <div v-motion :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 200, duration: 500 } }">
      <v-btn-toggle v-model="selectedTab" class="mt-3 bg-grey-lighten-3 rounded-pill pa-1 toggle-container" density="compact" mandatory>
        <v-btn value="school" class="rounded-pill toggle-btn" :class="{
            'bg-secondary text-white toggle-btn-active': selectedTab === 'school',
            'bg-transparent text-black': selectedTab !== 'school'
        }" size="small">
          School
        </v-btn>
        <v-btn value="work" class="rounded-pill toggle-btn" :class="{
            'bg-secondary text-white toggle-btn-active': selectedTab === 'work',
            'bg-transparent text-black': selectedTab !== 'work'
        }" size="small">
          Work
        </v-btn>
      </v-btn-toggle>
    </div>

    <v-row class="mt-6 justify-center">
      <v-col cols="12" md="5" v-for="(plan, index) in activePlans" :key="index">
        <div 
          v-motion 
          :initial="{ opacity: 0, y: 50 }" 
          :enter="{ opacity: 1, y: 0, transition: { delay: 300 + (index * 150), duration: 700 } }"
        >
          <v-card class="pa-6 text-left rounded-lg plan-card" elevation="2">
            <p class="text-h4 font-weight-bold mb-1 outfit outfit-bold" :class="plan.colorClass">
              {{ plan.name }}
            </p>

            <!-- Price & Billing Info with animation -->
            <div class="price-container">
              <p class="text-h4 font-weight-bold mb-1 outfit outfit-bold animated-price">
                <template v-if="selectedTab === 'school'">
                  {{ plan.price }} <span class="text-h6">/ month</span>
                </template>
                <template v-else>
                  {{ selectedTypes[plan.name] === 'month' ? plan.monthlyPrice : plan.annualPrice }}
                  <span class="text-h6">/ month</span>
                </template>
              </p>
              <p class="text-h7 text-grey-darken-1 mb-1 outfit outfit-regular">
                {{ selectedTab === 'school' ? plan.billing : selectedTypes[plan.name] === 'month' ? plan.monthlyBilling : plan.annualBilling }}
              </p>
            </div>

            <!-- v-btn-toggle with smooth animation -->
            <transition name="fade" mode="out-in">
              <v-btn-toggle
                v-if="selectedTab === 'work'"
                v-model="selectedTypes[plan.name]"
                class="mt-2 bg-grey-lighten-3 rounded-pill pa-1 inner-toggle-container"
                density="compact"
                mandatory
              >
                <v-btn class="rounded-pill toggle-btn" size="small" value="annual" :class="{
                  'bg-grey-lighten-2 text-black toggle-btn-active': selectedTypes[plan.name] === 'annual',
                  'bg-transparent text-black': selectedTypes[plan.name] !== 'annual'
                }">
                  Annual
                </v-btn>
                <v-btn class="rounded-pill toggle-btn" size="small" value="month" :class="{
                  'bg-grey-lighten-2 text-black toggle-btn-active': selectedTypes[plan.name] === 'month',
                  'bg-transparent text-black': selectedTypes[plan.name] !== 'month'
                }">
                  Month
                </v-btn>
              </v-btn-toggle>
            </transition>

            <!-- Features List with animation -->
            <v-list class="text-left feature-list">
              <v-list-item 
                v-for="(feature, i) in plan.features" 
                :key="i" 
                class="align-start feature-item"
                v-motion
                :initial="{ opacity: 0, x: -10 }"
                :enter="{ opacity: 1, x: 0, transition: { delay: 400 + (i * 100), duration: 500 } }"
              >
                <template #prepend>
                  <div class="checkmark-container">
                    <v-icon :color="plan.iconColor" class="checkmark-icon">mdi-check-circle</v-icon>
                  </div>
                </template>
                <v-list-item-content>
                  <v-list-item-title class="outfit outfit-regular">{{ feature }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- For School Tab: See Work Plans Link -->
            <p v-if="selectedTab === 'school'" class="text-h7 mb-1 outfit outfit-regular">
              See our
              <a href="#" @click.prevent="selectedTab = 'work'" class="text-decoration-none link-hover" style="color: blue;">
                work plans
              </a>
              for responses and other features for teachers and professionals.
            </p>

            <!-- Subscribe Button with animation like home page -->
            <v-btn 
              block 
              :color="plan.buttonColor" 
              class="mt-4 rounded-lg animated-btn outfit outfit-medium"
              rounded 
              :variant="getButtonVariant(plan.name)"
              @click="$emit('subscribe', { plan, type: selectedTab, billing: selectedTab === 'work' ? selectedTypes[plan.name] : plan.name.toLowerCase() })"
            >
              <span class="d-flex align-center">
                {{ buttonText }}
                <v-icon class="ms-2 btn-icon">mdi-check-circle</v-icon>
              </span>
            </v-btn>
          </v-card>
        </div>
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

// Emit tab changes
watch(selectedTab, (newValue) => {
  emit('tabChange', newValue);
});
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

.outfit-regular { font-weight: 400; }
.outfit-medium { font-weight: 500; }
.outfit-bold { font-weight: 700; }

/* Plan cards with hover effect */
.plan-card {
  border-radius: 20px !important;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 3px solid transparent;
  height: 100%;
  overflow: hidden;
}

.plan-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 3px solid var(--v-primary);
}

/* Toggle button styling */
.toggle-container {
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.toggle-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.toggle-btn-active {
  transform: scale(1.05);
}

.inner-toggle-container {
  transition: all 0.3s ease;
}

/* Price animation */
.price-container {
  position: relative;
  margin-bottom: 1rem;
}

.animated-price {
  transition: all 0.3s ease;
}

.plan-card:hover .animated-price {
  transform: scale(1.05);
  color: var(--v-primary);
}

/* Feature list styling */
.feature-list {
  background: transparent;
  padding: 0;
}

.feature-item {
  padding: 8px 0;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(5px);
}

.checkmark-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
}

.checkmark-icon {
  height: 30px;
  width: 30px;
  transition: transform 0.3s ease;
}

.feature-item:hover .checkmark-icon {
  transform: scale(1.2);
}

/* Button animations like home page */
.animated-btn {
  transition: all 0.3s ease;
  border-width: 2px;
  position: relative;
  overflow: hidden;
  box-shadow: none;
}

.animated-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}

.animated-btn:hover::before {
  left: 100%;
}

.animated-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  transition: transform 0.3s ease;
}

.animated-btn:hover .btn-icon {
  transform: translateX(5px);
}

/* Link hover effect */
.link-hover {
  position: relative;
  transition: all 0.3s ease;
}

.link-hover::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.link-hover:hover::after {
  width: 100%;
}

/* Gradient text effect */
.gradient-text-alt {
  background: linear-gradient(90deg, #7b83e0, #3949AB);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Enhanced transitions */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
