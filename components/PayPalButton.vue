<template>
    <div>
        <div id="paypal-button-container"></div>
    </div>

</template>

<script>
    import { onMounted } from 'vue';
    import { useNuxtApp } from '#app';

    const {$userPrivateAxios} = useNuxtApp();

    onMounted(() => {
        if (window.paypal){
            window.paypal.Buttons({
                createOrder: async () => {
                    const res = await $userPrivateAxios.post('/create-order');
                    const order = await res.data;
                    return order.id;
                },

                onApprove: async (data, actions) => {
                    const res = await $userPrivateAxios.post('/capture-order', {
                        orderID: data.orderID
                    });
                    const capture = await res.data;
                    console.log(capture);
                }
            }).render('#paypal-button-container');
        }
    })



</script>