<template>
    <div class="container" style="margin-top: 75px; margin: auto">
      <div style="width: 200px; margin: 0 auto">
        <form
          method="POST"
          target="aba_webservice"
          action="https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase"
          id="aba_merchant_request"
        >
          <input type="hidden" name="hash" :value="hash" id="hash" />
          <input
            type="hidden"
            name="tran_id"
            :value="transactionId"
            id="tran_id"
          />
          <input type="hidden" name="amount" :value="amount" id="amount" />
          <input type="hidden" name="currency" :value="currency" />
          <input type="hidden" name="payment_option" :value="paymentOption" />
          <input type="hidden" name="merchant_id" :value="merchantId" />
          <input type="hidden" name="req_time" :value="requestTime" />
          <input type="hidden" name="view_type" value="checkout" />
        </form>
        <input type="button" @click="checkout" value="Checkout Now" />
      </div>
    </div>
  </template>
  
  <script>
  import HmacSHA512 from 'crypto-js/hmac-sha512';
  import Base64 from 'crypto-js/enc-base64';
  
  export default {
    data() {
      return {
        requestTime: "",
        transactionId: "",
        amount: 10, // Default amount
        merchantId: "ec43417360", // Default merchantId
        paymentOption: "cards", // Default payment option
        currency: "USD", // Default currency
        hash: "",
      };
    },
    methods: {
      generateHash() {
      const secretKey = '2acffe8a5c696d38a4d1230d18c5d8'; // Your secret key
      const message = this.requestTime + this.merchantId + this.transactionId + this.amount + this.paymentOption + this.currency;
  
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
      loadAbaPaywayScript() {
        if (!this.scriptLoaded) {
          const script = document.createElement("script");
          script.src = "https://checkout.payway.com.kh/plugins/checkout2-0.js";
          script.onload = () => {
            this.scriptLoaded = true;
            console.log("AbaPayway script loaded");
          };
          document.head.appendChild(script);
        }
      },
      async checkout() {
        // Generate requestTime and transactionId
        this.generateRequestTime();
        this.generateTransactionId();
  
        // Generate the hash
        await this.generateHash();
  
        // Call the payment checkout (assuming `AbaPayway.checkout()` handles the rest)
        AbaPayway.checkout();
      },
    },
    async mounted() {
      await this.loadAbaPaywayScript();
      // Initialize transaction ID and request time when component is mounted
      await this.generateRequestTime();
      await this.generateTransactionId();
    },
  };
  </script>