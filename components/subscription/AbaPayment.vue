<template>
    <v-card>
        <v-container class="pa-10">
            <v-radio-group v-model="selectedPayment">
                <v-row  v-motion :initial="{ opacity: 0, y: 30 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }">
                    <v-col cols="12" md="12">
                    <h2 class="text-primary">Pay with:</h2>
                    </v-col>
                    <v-col cols="12" md="12">
                        <v-card
                        elevation="2"
                        class="payment-option d-flex"
                        @click="selectPayment('abapay')"
                        :class="{ 'selected-card': selectedPayment === 'abapay' }"
                        >
                            <v-container style="padding: 20px" class="d-flex justify-start">
                                <v-img
                                style="border-radius: 8px"
                                max-height="70"
                                max-width="100"
                                src="/aba/aba_pay.png"
                                ></v-img>
                                <div style="margin-top: 10px; margin-left: 20px">
                                <span style="font-weight: 500"> Pay with ABA </span>
                                <br />
                                <span> Scan to pay with ABA Mobile </span>
                                </div>
                            </v-container>
                            <v-radio value="abapay" class="ml-auto" hide-details></v-radio>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-card
                        elevation="2"
                        class="payment-option d-flex"
                        @click="selectPayment('bakong')"
                        :class="{ 'selected-card': selectedPayment === 'bakong' }"
                        >
                            <v-container style="padding: 20px" class="d-flex justify-start">
                                <v-img
                                style="border-radius: 8px;"
                                max-height="40"
                                max-width="100"
                                src="/aba/khqr.png"
                                ></v-img>
                                <div style="margin-top: 10px; margin-left: 20px">
                                <span style="font-weight: 500"> Pay with Bakong </span>
                                <br />
                                <span> KHQR </span>
                                </div>
                            </v-container>
                            <v-radio value="bakong" class="ml-auto" hide-details></v-radio>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="12">
                        <v-card
                        elevation="2"
                        class="payment-option d-flex"
                        @click="selectPayment('cards')"
                        :class="{ 'selected-card': selectedPayment === 'cards' }"
                        >
                            <v-container style="padding: 20px" class="d-flex justify-start">
                                <v-img
                                style="border-radius: 8px"
                                max-height="70"
                                max-width="100"
                                src="/aba/aba_card.png"
                                ></v-img>
                                <div style="margin-top: 10px; margin-left: 20px">
                                <span style="font-weight: 500"> Pay with Card </span>
                                <br />
                                <span> Visa card, Master card </span>
                                </div>
                            </v-container>
                            <v-radio value="cards" class="ml-auto" hide-details></v-radio>
                        </v-card>
                    </v-col>
                </v-row>
            </v-radio-group>
            <!-- <TabController
                :accountToolbarVisible="false"
                :payment="this.payment"
                :isLoading="this.isLoading"
                @clear-payment-selection="clearPaymentSelection"
            ></TabController> -->

            <form
                method="POST"
                target="aba_webservice"
                action="https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase"
                id="aba_merchant_request"
            >
                <input type="hidden" name="hash" :value="hash" id="hash" />
                <input type="hidden" name="tran_id" :value="transactionId" id="tran_id" />
                <input type="hidden" name="amount" :value="amount" id="amount" />
                <input type="hidden" name="currency" :value="currency" />
                <input type="hidden" name="payment_option" :value="paymentOption" />
                <input type="hidden" name="merchant_id" :value="merchantId" />
                <input type="hidden" name="req_time" :value="requestTime" />
                <input type="hidden" name="continue_success_url" :value="continueSuccessUrl" />
                <!-- <input type="hidden" name="view_type" value="checkout" /> -->
                <v-btn
                  block 
                  color="primary" 
                  class="mt-4 rounded-lg animated-btn outfit outfit-medium"
                  rounded 
                  @click="checkout(plan)"
                  >
                  <span class="d-flex align-center">
                    Go Premium
                    <v-icon class="ms-2 btn-icon">mdi-crown</v-icon>
                  </span>
                </v-btn>
            </form>
        </v-container>
    </v-card>
</template>
<script>
  import Cookies from "js-cookie";
  import HmacSHA512 from "crypto-js/hmac-sha512";
  import Base64 from "crypto-js/enc-base64";
  
  export default {
    name: "PaywaySelection",

    data() {
      return {
        selectedPayment: null, // Tracks the selected payment method
        payment: false,
        isLoading: false,
        continueSuccessUrl: "/",
        requestTime: "",
        transactionId: "",
        amount: 0, // Default amount
        merchantId: "ec449657", // Default merchantId
        paymentOption: "cards", // Default payment option
        currency: "USD", // Default currency
        hash: "",
        plan_id: "",
      };
    },
    props: {
      checkSubscription: {
        type: Boolean,
        default: true,
      },
    },
    mounted() {
        this.loadAbaPaywayScript();
      // Initialize transaction ID and request time when component is mounted
      this.generateRequestTime();
      this.generateTransactionId();
    },
    methods: {
      async selectPayment(paymentMethod) {
        this.selectedPayment = paymentMethod; // Update the selected payment
        // const authStore = useAuthStore();
        // const planStore = usePlanStore();
        // const token = Cookies.get("token");
        // this.amount = planStore.selectPlan.price;
        // this.plan_id = planStore.selectPlan.global_id;
        this.paymentOption = paymentMethod;

        // if (token) {
        //   if(this.checkSubscription){
        //     const response = await this.SubscriptionStore.checkUserSubscriptionStatus();
        //     if(response.data.data.subscription === true)
        //     {
        //       this.$swal.fire({
        //         title: "Error!",
        //         text: "You have a subscription already!",
        //         icon: "error",
        //       });
        //       return ;
        //     }            
        //   }
        //   this.user_id = authStore.user.id;
        //   this.isLoading = true;
          this.checkout();
  
        //   this.AbaPaywayStore.payment({
        //     req_time: this.requestTime,
        //     tran_id: this.transactionId,
        //     currency: this.currency,
        //     payment_option: this.paymentOption,
        //     hash: this.hash,
        //     status: "pending",
        //     plan_id: this.plan_id,
        //   }).then((response) => {
        //     this.isLoading = true;
        //     // window.location.href = response.data.data;
        //   })
        //   .catch((error) => {
        //     // Set the error message
        //     if (error.response) {
        //       this.errorMessage =
        //         error.response.data.message ||
        //         "Payment failed. Please try again.";
        //     } else if (error.request) {
        //       this.errorMessage =
        //         "No response from server. Please check your internet connection.";
        //     } else {
        //       this.errorMessage =
        //         "An error occurred while setting up the payment request.";
        //     }
        //   });
        // } else {
        //   // Reset payment to false before triggering the dialog again
        //   this.payment = false;
        //   // Use a small timeout to ensure the state change is picked up before setting it to true again
        //   setTimeout(() => {
        //     this.payment = true; // This will trigger TabController
        //   }, 0);
        // }
      },
      clearPaymentSelection() {
        this.selectedPayment = null;
      },
      generateHash() {
        const secretKey = "1896156ea679212137abafdbf9e0990717d015c5"; // Your secret key
        const message =
          this.requestTime +
          this.merchantId +
          this.transactionId +
          this.amount +
          this.paymentOption + 
          this.continueSuccessUrl +
          this.currency;

        // Use crypto-js to generate HMAC SHA-512 hash and encode it in Base64
        const hash = HmacSHA512(message, secretKey);
        this.hash = Base64.stringify(hash);
      },
      generateTransactionId() {
        // Random 6-digit transaction ID
        this.transactionId = Math.floor(
          100000 + Math.random() * 900000
        ).toString();
      },
      generateRequestTime() {
        // Generate request time in the format 'YYYY-MM-DD HH:mm:ss'
        const now = new Date();
        const year = now.getFullYear();
        const month = ("0" + (now.getMonth() + 1)).slice(-2);
        const day = ("0" + now.getDate()).slice(-2);
        const hours = ("0" + now.getHours()).slice(-2);
        const minutes = ("0" + now.getMinutes()).slice(-2);
        const seconds = ("0" + now.getSeconds()).slice(-2);
        this.requestTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      },
  
      async checkout() {
        // Generate the hash
        await this.generateHash();
  
        // Call the payment checkout (assuming `AbaPayway.checkout()` handles the rest)
        AbaPayway.checkout();
      },

      loadAbaPaywayScript() {
        // if (!this.scriptLoaded) {
            const script = document.createElement("script");
            script.src = "https://checkout.payway.com.kh/plugins/checkout2-0.js";
            script.onload = () => {
            console.log("AbaPayway script loaded");
            };
            document.head.appendChild(script);
        // }
        },
    },
  };
  </script>

<style scoped>
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

.animated-btn:hover .btn-icon {
  transform: translateX(5px);
}

.outfit {
  /* font-family: "Outfit", sans-serif; */
  font-optical-sizing: auto;
  font-style: normal;
}

.outfit-medium { font-weight: 500; }

</style>