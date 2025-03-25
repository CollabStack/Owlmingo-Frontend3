<template>
    <div>
        <div id="paypal-button-container"></div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import { useNuxtApp } from '#app';

    onMounted(() => {
    const {$UserPrivateAxios} = useNuxtApp();
    console.log("PayPal Button Mounted");
    console.log("PayPal Button Axios:", $UserPrivateAxios);

    if (window.paypal) {
        window.paypal.Buttons({
        createOrder: async () => {
            try {
            const res = await $UserPrivateAxios.post('/create-order');
            console.log("PayPal Order Created:", res);
            return res.data.data.result.id;
            } catch (error) {
            console.error("Error creating PayPal order:", error);
            }
        },
        onApprove: async (data) => {
            try {
            const res = await $UserPrivateAxios.post('/capture-order', {
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
