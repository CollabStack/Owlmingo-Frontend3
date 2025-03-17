<template>
  <div class="container" style="margin-top: 75px; margin: auto">
    <div style="width: 200px; margin: 0 auto">
      <form
        ref="paymentForm"
        method="POST"
        target="_self"
        action="https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase"
        id="aba_merchant_request"
      >
        <input type="hidden" name="req_time" :value="requestTime" />
        <input type="hidden" name="merchant_id" :value="merchantId" />
        <input type="hidden" name="tran_id" :value="transactionId" />
        <input type="hidden" name="amount" :value="amount" id="amount" />
        <input type="hidden" name="payment_option" :value="paymentOption" />
        <input type="hidden" name="currency" :value="currency" />
        <input type="hidden" name="hash" :value="hash" />
        <input type="hidden" name="view_type" value="checkout" />
      </form>
      <button class="bg-primary" @click="checkout">Checkout Now</button>
    </div>
  </div>
</template>

<script>
import HmacSHA512 from "crypto-js/hmac-sha512";
import Base64 from "crypto-js/enc-base64";

export default {
  data() {
    return {
      requestTime: "",
      transactionId: "",
      amount: 10,
      merchantId: "ec449657", // Sandbox Merchant ID
      paymentOption: "cards", // Payment option
      currency: "USD", // Currency
      hash: "",
      secretKey: "1896156ea679212137abafdbf9e0990717d015c5", // Sandbox Secret Key
      scriptLoaded: false,
    };
  },
  methods: {
    generateTransactionId() {
      this.transactionId = Math.floor(Date.now() / 1000).toString();
    },
    generateRequestTime() {
      // this.requestTime = Math.floor(Date.now() / 1000).toString();
      // Generate request time in the format 'YYYY-MM-DD HH:mm:ss'
      const now = new Date();
      const year = now.getFullYear();
      const month = ("0" + (now.getMonth() + 1)).slice(-2);
      const day = ("0" + now.getDate()).slice(-2);
      const hours = ("0" + now.getHours()).slice(-2);
      const minutes = ("0" + now.getMinutes()).slice(-2);
      const seconds = ("0" + now.getSeconds()).slice(-2);
      this.requestTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      // this.requestTime = Math.floor(Date.now() / 1000).toString();
    },
    generateHash() {
      const message =
        this.requestTime +
        this.merchantId +
        this.transactionId +
        this.amount +
        this.paymentOption +
        this.currency;

      const hash = HmacSHA512(message, this.secretKey);
      this.hash = Base64.stringify(hash);
    },
    loadAbaPaywayScript() {
      if (this.scriptLoaded) return;

      const script = document.createElement("script");
      script.src = "https://checkout.payway.com.kh/plugins/checkout2-0.js";
      script.onload = () => {
        this.scriptLoaded = true;
        console.log("✅ ABA Payway script loaded");
      };
      document.head.appendChild(script);
    },
    async checkout() {
      this.generateRequestTime();
      this.generateTransactionId();
      this.generateHash();

      // Ensure ABA script is loaded before calling checkout
      if (typeof AbaPayway !== "undefined") {
        AbaPayway.checkout();
        console.log("🚀 Checkout initiated...");
      } else {
        console.error("❌ AbaPayway script not loaded. Retrying...");
        this.loadAbaPaywayScript();
        setTimeout(() => {
          if (typeof AbaPayway !== "undefined") {
            AbaPayway.checkout();
          } else {
            console.error("❌ Failed to load ABA Payway script.");
          }
        }, 2000);
      }
    },
  },
  mounted() {
    this.loadAbaPaywayScript();
  },
};
</script>
