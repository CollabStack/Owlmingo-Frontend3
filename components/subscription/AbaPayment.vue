<template>
  <v-card>
    <v-container class="pa-10">
      <v-radio-group v-model="selectedPayment">
        <v-row v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
          <v-col cols="12">
            <h2 class="text-primary">Pay with:</h2>
          </v-col>

          <v-col cols="12">
            <v-card
              elevation="2"
              class="payment-option d-flex"
              @click="selectPayment('abapay')"
              :class="{ 'selected-card': selectedPayment === 'abapay' }"
            >
              <v-container class="d-flex justify-start pa-4">
                <v-img class="rounded" max-height="70" max-width="100" src="/aba/aba_pay.png"></v-img>
                <div class="ml-4 mt-2">
                  <span class="font-weight-medium"> Pay with ABA </span><br />
                  <span> Scan to pay with ABA Mobile </span>
                </div>
              </v-container>
              <v-radio value="abapay" class="ml-auto" hide-details></v-radio>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              elevation="2"
              class="payment-option d-flex"
              @click="selectPayment('bakong')"
              :class="{ 'selected-card': selectedPayment === 'bakong' }"
            >
              <v-container class="d-flex justify-start pa-4">
                <v-img class="rounded" max-height="40" max-width="100" src="/aba/khqr.png"></v-img>
                <div class="ml-4 mt-2">
                  <span class="font-weight-medium"> Pay with Bakong </span><br />
                  <span> KHQR </span>
                </div>
              </v-container>
              <v-radio value="bakong" class="ml-auto" hide-details></v-radio>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-card
              elevation="2"
              class="payment-option d-flex"
              @click="selectPayment('cards')"
              :class="{ 'selected-card': selectedPayment === 'cards' }"
            >
              <v-container class="d-flex justify-start pa-4">
                <v-img class="rounded" max-height="70" max-width="100" src="/aba/aba_card.png"></v-img>
                <div class="ml-4 mt-2">
                  <span class="font-weight-medium"> Pay with Card </span><br />
                  <span> Visa card, Master card </span>
                </div>
              </v-container>
              <v-radio value="cards" class="ml-auto" hide-details></v-radio>
            </v-card>
          </v-col>
        </v-row>
      </v-radio-group>

      <form
        v-if="scriptLoaded"
        ref="paymentForm"
        method="POST"
        target="aba_webservice"
        action="https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase"
      >
        <input type="hidden" name="req_time" :value="req_time" />
        <input type="hidden" name="merchant_id" :value="merchant_id" />
        <input type="hidden" name="hash" :value="hash" />
        <input type="hidden" name="tran_id" :value="tran_id" />
        <input type="hidden" name="amount" :value="amount" />
        <input type="hidden" name="firstname" :value="firstname" />
        <input type="hidden" name="lastname" :value="lastname" />
        <input type="hidden" name="email" :value="email" />
        <input type="hidden" name="phone" :value="phone" />
        <input type="hidden" name="type" :value="type" />
        <input type="hidden" name="payment_option" :value="payment_option" />
        <input type="hidden" name="currency" :value="currency" />
        <input type="hidden" name="continue_success_url" :value="continue_success_url" />

        <v-btn block color="primary" class="mt-4 rounded-lg animated-btn" @click.prevent="checkout">
          <span class="d-flex align-center">
            Go Premium
            <v-icon class="ms-2 btn-icon">mdi-crown</v-icon>
          </span>
        </v-btn>
      </form>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import CryptoJS from 'crypto-js';

let selectedPayment = ref('abapay');
let req_time = ref('');
let merchant_id = ref('ec449657');
let tran_id = ref('');
let amount = ref(10);
let firstname = ref('Uch');
let lastname = ref('Mengly');
let email = ref('menglyuch168168@gmail.com');
let phone = ref('0969994954');
let type = ref('purchase');
let payment_option = ref('cards');
let currency = ref('USD');
let hash = ref('');
let continue_success_url = ref('https://owlmingo.space/');
let scriptLoaded = ref(false);
let paymentForm = ref(null);

onMounted(() => {
  loadAbaPaywayScript();
});


const selectPayment = (paymentMethod) => {
  selectedPayment.value = paymentMethod;
  payment_option.value = paymentMethod;
};

// ✅ Generate Hash for Secure Payment
const generateHash = () => {
  const secretKey = "1896156ea679212137abafdbf9e0990717d015c5";
  tran_id.value = Math.floor(100000 + Math.random() * 900000).toString();
  req_time.value = new Date().toISOString().replace("T", " ").slice(0, 19);

  const message = `${req_time.value}${merchant_id.value}${tran_id.value}${amount.value}${firstname.value}${lastname.value}${email.value}${phone.value}${type.value}${payment_option.value}${continue_success_url.value}${currency.value}`;
  const genHash = CryptoJS.HmacSHA512(message, secretKey);
  hash.value = CryptoJS.enc.Base64.stringify(genHash);
};

// ✅ Checkout Process
const checkout = async () => {
  await generateHash();

  console.log("✅ Attempting to checkout...");
  console.log("Selected Payment:", selectedPayment.value);
  console.log("Generated Hash:", hash.value);

  if (!scriptLoaded.value) {
    console.error("❌ AbaPayway is not loaded.");
    return;
  }

  if (paymentForm.value) {
    paymentForm.value.submit();
  }
}; 

// ✅ Load AbaPayway Script Before Checkout
const loadAbaPaywayScript = () => {
  if (scriptLoaded.value) return;

  const script = document.createElement("script");
  script.src = "https://checkout.payway.com.kh/plugins/checkout2-0.js";
  script.async = true;
  script.onload = () => {
    scriptLoaded.value = true;
    console.log("✅ AbaPayway script loaded.");
  };
  script.onerror = () => {
    console.error("❌ Failed to load AbaPayway.");
  };
  document.head.appendChild(script);
};


</script>

<style scoped>
.animated-btn {
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
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
.animated-btn:hover .btn-icon {
  transform: translateX(5px);
}
</style>
