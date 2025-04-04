<template>
  <div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }

});

onMounted(() => {
  console.log("===== PayPal Button Mounted =====");
  console.log('PayPal Button Mounted');
  console.log('plan:', props.plan);
  console.log("===== PayPal Button Mounted =====");

  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch('https://owlmingo-16f448c07f1f.herokuapp.com/api/v1/user/auth/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ planId: props.plan._id, amount: props.plan.total_price })
        });
        const order = await res.json();
        return order.id;
      },
      onApprove: async (data) => {
        const res = await fetch('/api/paypal/capture-order', {
          method: 'POST',
          body: JSON.stringify({ orderID: data.orderID }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const order = await res.json();
        console.log('Order Captured:', order);
      }
    }).render('#paypal-button-container');
  }
});
</script>
