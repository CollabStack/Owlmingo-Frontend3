<template>
  <div>
    <div id="paypal-button-container"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useNuxtApp } from '#app';

const props = defineProps({
  plan: {
    type: Object,
    required: true
  }

});

const emit = defineEmits(['paymentResponse']);

onMounted(() => {
  const {$UserPrivateAxios} = useNuxtApp();
  if (window.paypal) {
    window.paypal.Buttons({
      createOrder: async () => {
        // const res = await $UserPrivateAxios.post('/create-order', { planId: props.plan._id, amount: props.plan.total_price });

        const res = await $UserPrivateAxios.post('/create-order', { planId: props.plan._id, amount: props.plan.total_price , duration: props.plan.duration });
        return res.data.id;
      },
      onApprove: async (data) => {
        const res = await $UserPrivateAxios.post('/capture-order', { orderID: data.orderID });
        emit('paymentResponse', res.status);
      }
    }).render('#paypal-button-container');
  }
});
</script>
