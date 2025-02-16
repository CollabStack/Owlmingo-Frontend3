import { userAuth } from '~/store/userAuth';

export default defineNuxtPlugin(() => {
    const authStore = userAuth();
    authStore.initialize();
});
