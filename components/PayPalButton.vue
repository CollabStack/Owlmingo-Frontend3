<template>
    <div>
        <div id="paypal-button-container"></div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useNuxtApp } from '#app';

    const { $userPrivateAxios } = useNuxtApp();

    onMounted(() => {
    if (window.paypal) {
        window.paypal.Buttons({
        createOrder: async () => {
            try {
            const res = await $userPrivateAxios.post('/create-order');
            return res.data.id;
            } catch (error) {
            console.error("Error creating PayPal order:", error);
            }
        },
        onApprove: async (data) => {
            try {
            const res = await $userPrivateAxios.post('/capture-order', {
                orderID: data.orderID
            });
            console.log("Payment Captured:", res.data);
            } catch (error) {
            console.error("Error capturing PayPal order:", error);
            }
        }
        }).render('#paypal-button-container');
    } else {
        console.error("PayPal SDK not loaded.");
    }
    });
</script>
