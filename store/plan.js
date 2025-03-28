import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

export const planStore = defineStore('planStore',{
    state: () => ({
        plans: [],
    }),
    actions: {
        async getPlans(){
            const {$UserPublicAxios} = useNuxtApp();
            try {
                const response = await $UserPublicAxios.$get('/plans');
                console.log("======================= Plans ========================");
                console.log(response);
                this.plans = response.data;
                console.log("======================= Plans ========================");
            } catch (error) {
                console.log(error);
            }
        }, 
        async adminGetPlans(){
            const {$AdminPrivateAxios} = useNuxtApp();
            try {
                const response = await $AdminPrivateAxios.$get('/plans');
                console.log("======================= Plans ========================");
                console.log(response);
                this.plans = response.data;
                console.log("======================= Plans ========================");
            } catch (error) {
                console.log(error);
            }
        },

    },
});