<template>
  <div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNuxtApp } from '#app';
import Swal from 'sweetalert2';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }

});

const emit = defineEmits(['paymentResponse']);

onMounted(() => {
  console.log("===== PayPal Button Mounted =====");
  console.log('PayPal Button Mounted');
  console.log('plan:', props.plan);
  console.log("===== PayPal Button Mounted =====");
  const {$UserPrivateAxios} = useNuxtApp();
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: async () => {
        // const res = await fetch('https://owlmingo-16f448c07f1f.herokuapp.com/api/v1/user/auth/create-order', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify({ planId: props.plan._id, amount: props.plan.total_price })
        // });
        const res = await $UserPrivateAxios.post('/create-order', { planId: props.plan._id, amount: props.plan.total_price });
        console.log("============ Order Created ============");
        console.log('Order Created:', res);
        console.log('Order Created:', res.data.id);
        console.log("============ Order Created ============");
        return res.data.id;
        // const order = await res.json();
        // console.log("============ Order Created ============");
        // console.log('Order Created:', order);
        // console.log("============ Order Created ============");
        // return order.id;
      },
      onApprove: async (data) => {
        console.log("============ Order Approved ============");
        console.log('Order Approved:', data);
        console.log("============ Order Approved ============");
        const res = await $UserPrivateAxios.post('/capture-order', { orderID: data.orderID });
        console.log("============ Order Captured ============");
        console.log('Order Captured:', res);
        console.log("============ Order Captured ============");
        emit('paymentResponse', res.status);
      }
    }).render('#paypal-button-container');
  }
});
</script>
