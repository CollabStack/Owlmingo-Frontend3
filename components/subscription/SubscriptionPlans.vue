<template>
  <v-container class="text-center">
    <!-- Header: Title and Description -->
    <div
      v-motion
      :initial="{ opacity: 0, y: 30 }"
      :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
      class="mb-10"
    >
      <template v-if="loading">
        <!-- Skeleton for title -->
        <v-skeleton-loader type="heading" class="mx-auto" width="50%" />
        <!-- Skeleton for description -->
        <v-skeleton-loader type="text" class="mx-auto" width="70%" />
      </template>
      <template v-else>
        <h2 class="text-h5 font-weight-bold gradient-text-alt outfit outfit-bold">
          {{ title }}
        </h2>
        <p class="text-body-2 text-grey-darken-1 outfit outfit-regular mb-5">
          {{ description }}
        </p>
      </template>
    </div>

    <v-row class="mt-6 justify-center">
      <!-- Plan Cards -->
      <template v-if="loading">
        <!-- Render skeleton cards while loading -->
        <v-col cols="12" md="5" v-for="n in 2" :key="n">
          <v-card class="pa-6 text-left rounded-lg plan-card" elevation="2">
            <v-skeleton-loader type="card" />
          </v-card>
        </v-col>
      </template>
      <template v-else>
        <v-col cols="12" md="5" v-for="(plan, index) in plans" :key="index">
          <div
            v-motion
            :initial="{ opacity: 0, y: 50 }"
            :enter="{
              opacity: 1,
              y: 0,
              transition: { delay: 300 + (index * 150), duration: 700 }
            }"
          >
            <v-card class="pa-6 text-left rounded-lg plan-card" elevation="2">
              <p
                class="text-h4 font-weight-bold mb-1 outfit outfit-bold"
                :class="plan.colorClass"
              >
                {{ plan.plan }}
              </p>

              <!-- Price & Billing Info with animation -->
              <div class="price-container">
                <p class="text-h4 font-weight-bold mb-1 outfit outfit-bold animated-price">
                  ${{ plan.price }}<span class="text-h6">/ month</span>
                </p>
                <p class="text-h7 text-grey-darken-1 mb-1 outfit outfit-regular">
                  {{ plan.is_annual === true ? 'Billed annually ($' + plan.total_price + ' total)' : 'Billed monthly' }}
                </p>
              </div>

              <!-- Features List with animation -->
              <v-list class="text-left feature-list">
                <v-list-item
                  v-for="(feature, i) in plan.description"
                  :key="i"
                  class="align-start feature-item"
                  v-motion
                  :initial="{ opacity: 0, x: -10 }"
                  :enter="{
                    opacity: 1,
                    x: 0,
                    transition: { delay: 400 + (i * 100), duration: 500 }
                  }"
                >
                  <template #prepend>
                    <div class="checkmark-container">
                      <v-icon :color="plan.plan === 'Annually' ? 'secondary' : 'gold'" class="checkmark-icon">
                        mdi-check-circle
                      </v-icon>
                    </div>
                  </template>
                  <v-list-item-content>
                    <v-list-item-title class="outfit outfit-regular">
                      {{ feature }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>

              <!-- Subscribe Button with animation -->
              <v-dialog
                transition="dialog-bottom-transition"
                width="auto"
              >
                <template v-slot:activator="{ props: activatorProps }">
                  <v-btn
                    v-bind="activatorProps"
                    block
                    :color="plan.plan === 'Annually' ? 'secondary' : 'gold'"
                    class="mt-4 rounded-lg animated-btn outfit outfit-medium"
                    rounded
                    :variant="getButtonVariant(plan.plan)"
                    @click="subscribe(plan)"
                  >
                    <span class="d-flex align-center">
                      {{ buttonText }}
                      <v-icon class="ms-2 btn-icon">mdi-check-circle</v-icon>
                    </span>
                  </v-btn>
                </template>

                <template v-slot:default="{ isActive }">
                  <v-card class="pt-5 px-5" min-width="500px">
                    <PaypalButton :plan="selectedPlan" />
                    <v-card-actions>
                      <v-btn
                        block 
                        class="mt-4 mb-4 rounded-lg animated-btn outfit outfit-medium"
                        variant="outlined"
                        @click="isActive.value = false"
                      >
                        Close
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </template>
              </v-dialog>
            </v-card>
          </div>
        </v-col>
      </template>
    </v-row>

    <!-- Footer Link: Only show after loading -->
    <template v-if="!loading && showFooterLink">
      <p
        class="mt-6 text-caption outfit outfit-regular"
        v-motion
        :initial="{ opacity: 0 }"
        :enter="{ opacity: 1, transition: { delay: 800, duration: 500 } }"
      >
        Visit our <router-link to="/pricing" class="text-decoration-none link-hover" style="color: blue;">pricing page</router-link> to compare all features.
      </p>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { planStore } from "~/store/plan"; // Assuming you have a plan store to fetch plans

const usePlanStore = planStore();

const props = defineProps({
  title: {
    type: String,
    default: "Subscribe to Generate Unlimited Quizzes"
  },
  description: {
    type: String,
    default:
      "Unlock the full potential of the question generator with our subscription plans. From training materials to academic notes, our AI intelligently creates quizzes to reinforce learning or assess knowledge for students and professionals alike."
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


const plans = ref([]);
const loading = ref(true);

onMounted(async () => {
  // Initialize plans based on the initial tab
  const response = await usePlanStore.getPlans();
  console.info("Plans Response:", response);
  plans.value = response;
  loading.value = false;
});

const getButtonVariant = (planName) => {
  return planName === "Annually" ? "flat" : "outlined";
};

const subscribe = (plan) => {
  // Handle subscription logic here
  console.log("Subscribing to plan:", plan);
  // You can redirect to a payment page or show a modal here
};
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
