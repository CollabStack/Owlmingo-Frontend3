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
        // window.paypal.Buttons({
        // createOrder: async () => {
        //     try {
        //     const res = await $UserPrivateAxios.post('/create-order');
        //     console.log("PayPal Order Created:", res);
        //     return res.data.data.result.id;
        //     } catch (error) {
        //     console.error("Error creating PayPal order:", error);
        //     }
        // },
        // onApprove: async (data) => {
        //     try {
        //     const res = await $UserPrivateAxios.post('/capture-order', {
        //         orderID: data.orderID
        //     });
        //     console.log("Payment Captured:", res.data);
        //     } catch (error) {
        //     console.error("Error capturing PayPal order:", error);
        //     }
        // }
        // }).render('#paypal-button-container');
        window.paypal.Buttons({
        // createOrder: async () => {
        //     try {
        //     // Pass additional parameters as needed
        //     const orderData = {
        //         amount: "20.00",
        //         userId: "123",   // Replace with the actual user id
        //         planId: "premium", // Replace with the actual plan id
        //         price: "20.00"
        //     };
        //     const res = await $UserPrivateAxios.post('/create-order', orderData);
        //     console.log("PayPal Order Created:", res);
        //     return res.data.data.result.id;
        //     } catch (error) {
        //     console.error("Error creating PayPal order:", error);
        //     }
        // },
        createOrder: async () => {
            try {
                const orderData = {
                amount: "20.00",     // Replace with your dynamic values
                userId: "123",
                planId: "premium",
                price: "20.00"
                };
                const res = await $UserPrivateAxios.post('/create-order', orderData);
                console.log("Response from create-order:", res.data);
                // Adjust this path based on your actual response structure:
                const orderId = res.data.data?.result?.id || res.data.result?.id;
                if (!orderId) {
                throw new Error("Order ID not found in response");
                }
                return orderId;
            } catch (error) {
                console.error("Error in createOrder:", error);
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
