import { userAuth } from '~/store/userAuth';

export default defineNuxtPlugin((nuxtApp) => {
    console.log('Initializing userAuth store');
    const authStore = userAuth();
    authStore.initialize();
});
