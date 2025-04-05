<template>
  <v-container class = "text-center">
    <!-- Header -->
    <div
      v-motion
      :initial = "{ opacity: 0, y: 30 }"
      :enter   = "{ opacity: 1, y: 0, transition: { duration: 600 } }"
        class  = "mb-10"
    >
      <template          v-if = "loading">
      <v-skeleton-loader type = "heading" class = "mx-auto" width = "50%" />
      <v-skeleton-loader type = "text" class    = "mx-auto" width = "70%" />
      </template>
      <template v-else>
        <h2 class = "text-h5 font-weight-bold gradient-text-alt outfit outfit-bold">
          {{ title || "Subscribe to Generate Unlimited Quizzes"}}
        </h2>
        <p class = "text-body-2 text-grey-darken-1 outfit outfit-regular mb-5">
          {{ description || "Unlock the full potential of the question generator with our subscription plans. From training materials to academic notes, our AI intelligently creates quizzes to reinforce learning or assess knowledge for students and professionals alike." }}
        </p>
      </template>
    </div>

    <!-- Plans -->
    <v-row             class = "mt-6 justify-center">
    <template          v-if  = "loading">
    <v-col             cols  = "12" md                                         = "5" v-for = "n in 2" :key = "n">
    <v-card            class = "pa-6 text-left rounded-lg plan-card" elevation = "2">
    <v-skeleton-loader type  = "card" />
          </v-card>
        </v-col>
      </template>

      <template v-else>
        <v-col cols = "12" md = "5" v-for = "(plan, index) in plans" :key = "index">
          <div
            v-motion
            :initial = "{ opacity: 0, y: 50 }"
            :enter   = "{ opacity: 1, y: 0, transition: { delay: 300 + (index * 150), duration: 700 } }"
          >
            <v-card class = "pa-6 text-left rounded-lg plan-card" elevation           = "2">
            <p      class = "text-h4 font-weight-bold mb-1 outfit outfit-bold" :class = "plan.colorClass">
                {{ plan.plan }}
              </p>

              <div class                      = "price-container">
              <p   class                      = "text-h4 font-weight-bold mb-1 outfit outfit-bold animated-price">
              $   {{ plan.price }}<span class = "text-h6">/ month</span>
                </p>
                <p class = "text-h7 text-grey-darken-1 mb-1 outfit outfit-regular">
                  {{ plan.is_annual ? 'Billed annually ($' + plan.total_price + ' total)' : 'Billed monthly' }}
                </p>
              </div>

              <!-- Feature List -->
              <v-list class = "text-left feature-list">
                <v-list-item
                    v-for = "(feature, i) in plan.description"
                  :key    = "i"
                    class = "align-start feature-item"
                  v-motion
                  :initial = "{ opacity: 0, x: -10 }"
                  :enter   = "{ opacity: 1, x: 0, transition: { delay: 400 + (i * 100), duration: 500 } }"
                >
                  <template #prepend>
                    <div    class  = "checkmark-container">
                    <v-icon :color = "plan.plan === 'Annually' ? 'secondary' : 'gold'" class = "checkmark-icon">
                        mdi-check-circle
                      </v-icon>
                    </div>
                  </template>
                  <span class = "outfit outfit-regular">{{ feature }}</span>
                </v-list-item>
              </v-list>

              <!-- Manual Dialog Trigger Button -->
              <v-btn
                block
                :color  = "plan.plan === 'Annually' ? 'secondary' : 'gold'"
                  class = "mt-4 rounded-lg animated-btn outfit outfit-medium"
                rounded
                :variant = "getButtonVariant(plan.plan)"
                  @click = "subscribe(plan)"
              >
                <span class = "d-flex align-center">
                  Unlock smarter studying 
                  <v-icon class = "ms-2 btn-icon">mdi-check-circle</v-icon>
                </span>
              </v-btn>

              <!-- Dialog -->
              <v-dialog
                v-model    = "dialogs[plan._id]"
                transition = "dialog-bottom-transition"
                width      = "auto"
                persistent
              >
                <v-card       class = "pt-5 px-5" min-width   = "500px">
                <PayPalButton :plan = "plan" @paymentResponse = "handlePaymentResponse" />
                  <v-card-actions>
                    <v-btn
                      block
                      class   = "mt-4 mb-4 rounded-lg animated-btn outfit outfit-medium"
                      variant = "outlined"
                      @click  = "dialogs[plan._id] = false"
                    >
                      Close
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-card>
          </div>
        </v-col>
      </template>
    </v-row>

    <!-- Footer -->
    <template v-if = "!loading && showFooterLink">
      <p
        class = "mt-6 text-caption outfit outfit-regular"
        v-motion
        :initial = "{ opacity: 0 }"
        :enter   = "{ opacity: 1, transition: { delay: 800, duration: 500 } }"
      >
        Visit our <router-link to = "/pricing" class = "text-decoration-none link-hover" style = "color: blue;">pricing page</router-link> to compare all features.
      </p>
    </template>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { planStore } from "~/store/plan";
import { userAuth } from "~/store/userAuth";
import { subscriptionStore } from "~/store/subscriptionStore";
import Swal from "sweetalert2";

const usePlanStore = planStore();
const useUserAuth  = userAuth();
const useSubscriptionStore = subscriptionStore();

const props = defineProps({
  title         : String,
  description   : String,
  buttonText    : String,
  showFooterLink: Boolean,
  initialTab    : String
});

const plans   = ref([]);
const loading = ref(true);
const dialogs = ref({});

onMounted(async () => {
  const response      = await usePlanStore.getPlans();
        plans.value   = response;
        loading.value = false;
});

  // Open dialog only after login check
const subscribe = async (plan) => {
  if (useUserAuth.checkTokenExpired()) {
    console.log("===========================================");
    console.log("Plan ID: ", plan._id);
    const subscription = await useSubscriptionStore.checkSubscription(plan._id);
    console.log("===================== Subscription ======================");
    console.log(subscription);
    console.log("===========================================================");
    if (subscription.status === 201){
      Swal.fire({
        icon             : "info",
        title            : "Already Subscribed",
        text             : "You are already subscribed to this plan.",
        confirmButtonText: "OK"
      });
      return;
    }
    dialogs.value[plan._id] = true;
  } else {
    Swal.fire({
      icon             : "error",
      title            : "Login Required",
      text             : "Please log in to subscribe to a plan.",
      confirmButtonText: "Log In"
    }).then((result) => {
      if (result.isConfirmed) {
        const router = useRouter();
        router.push('/auth');
      }
    });
  }
};

const getButtonVariant = (planName) => {
  return planName === "Annually" ? "flat" : "outlined";
};

const handlePaymentResponse = (status) => {
  const openDialogPlan = Object.keys(dialogs.value).find(key => dialogs.value[key]);
  if (openDialogPlan) {
    dialogs.value[openDialogPlan] = false;
  }

  setTimeout(() => {
    if (status === 200) {
      Swal.fire({
        icon             : "success",
        title            : "Payment Successful!",
        text             : "Thank you for your subscription!",
        showConfirmButton: false,
        timer            : 2000
      });
    } else {
      Swal.fire({
        icon             : "error",
        title            : "Payment Failed",
        text             : "Something went wrong. Please try again.",
        showConfirmButton: true
      });
    }
  }, 350);
};
</script>


<style scoped>
  /* Import Outfit font */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');

  /* Outfit font classes */
.outfit {
  font-family        : "Outfit", sans-serif;
  font-optical-sizing: auto;
  font-style         : normal;
}

.outfit-regular { font-weight: 400; }
.outfit-medium { font-weight: 500; }
.outfit-bold { font-weight: 700; }

  /* Plan cards with hover effect */
.plan-card {
  border-radius: 20px !important;
  transition   : all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 3px solid transparent;
  height       : 100%;
  overflow     : hidden;
}

.plan-card:hover {
  transform    : translateY(-8px);
  box-shadow   : 0 15px 30px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 3px solid var(--v-primary);
}

  /* Toggle button styling */
.toggle-container {
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.toggle-btn {
  transition: all 0.3s ease;
  position  : relative;
  overflow  : hidden;
}

.toggle-btn-active {
  transform: scale(1.05);
}

.inner-toggle-container {
  transition: all 0.3s ease;
}

  /* Price animation */
.price-container {
  position     : relative;
  margin-bottom: 1rem;
}

.animated-price {
  transition: all 0.3s ease;
}

.plan-card:hover .animated-price {
  transform: scale(1.05);
  color    : var(--v-primary);
}

  /* Feature list styling */
.feature-list {
  background: transparent;
  padding   : 0;
}

.feature-item {
  padding   : 8px 0;
  transition: all 0.3s ease;
}

.feature-item:hover {
  transform: translateX(5px);
}

.checkmark-container {
  display        : flex;
  align-items    : center;
  justify-content: center;
  margin-right   : 5px;
}

.checkmark-icon {
  height    : 30px;
  width     : 30px;
  transition: transform 0.3s ease;
}

.feature-item:hover .checkmark-icon {
  transform: scale(1.2);
}

  /* Button animations like home page */
.animated-btn {
  transition  : all 0.3s ease;
  border-width: 2px;
  position    : relative;
  overflow    : hidden;
  box-shadow  : none;
}

.animated-btn::before {
  content   : '';
  position  : absolute;
  top       : 0;
  left      : -100%;
  width     : 100%;
  height    : 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: all 0.6s ease;
}

.animated-btn:hover::before {
  left: 100%;
}

.animated-btn:hover {
  transform : translateY(-3px);
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
  position  : relative;
  transition: all 0.3s ease;
}

.link-hover::after {
  content         : '';
  position        : absolute;
  width           : 0;
  height          : 2px;
  bottom          : -2px;
  left            : 0;
  background-color: currentColor;
  transition      : width 0.3s ease;
}

.link-hover:hover::after {
  width: 100%;
}

  /* Gradient text effect */
.gradient-text-alt {
  background             : linear-gradient(90deg, #7b83e0, #3949AB);
  -webkit-background-clip: text;
  background-clip        : text;
  color                  : transparent;
}

  /* Enhanced transitions */
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from, .fade-leave-to {
  opacity  : 0;
  transform: translateY(10px);
}
</style>
