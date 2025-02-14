<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6" offset-md="3">
                <v-card>
                    <v-card-title>
                        <span class="headline">Login</span>
                    </v-card-title>

                    <v-card-text>
                        <v-form>
                            <v-text-field
                                v-model="email"
                                label="Email"
                                prepend-icon="mdi-email"
                                type="email"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                label="Password"
                                prepend-icon="mdi-lock"
                                type="password"
                                required
                            ></v-text-field>
                        </v-form>
                        
                        <!-- Telegram Custom Login Button -->
                        <!-- <v-btn color="primary" block @click="initiateTelegramLogin">
                            <v-icon left>mdi-telegram</v-icon>
                            Login with Telegram
                        </v-btn> -->
                        <!-- <client-only> -->
                            <!-- <vueTelegramLogin
                                class="pa-2"
                                mode="callback"
                                size="large"
                                radius="10px"
                                userpic="false"
                                :telegram-login="telegram_bot_name"
                                @callback="telegramCallback"
                            /> -->
                        <!-- </client-only> -->
                        <Auth-TelegramLogin />
                        
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="login">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';
import { userAuth } from '~/store/userAuth';
import { vueTelegramLogin } from 'vue-telegram-login';

const authStore = userAuth();
const email = ref('');
const password = ref('');
const telegram_bot_name = useRuntimeConfig().public.botUsername;

onMounted(() => {
    console.log('Sign In mounted');

    // window.onTelegramAuth = (user) => {
    //     console.log('Telegram user data:', user);
    //     Swal.fire({
    //         icon: 'success',
    //         title: 'Logged in with Telegram',
    //         text: `Welcome, ${user.first_name}!`,
    //     });
    //     // Handle authentication logic here
    // };
});

const login = async () => {
    try {
        await authStore.login(email.value, password.value);
        navigateTo("/");
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: error.response?.data?.message || 'Please check your credentials and try again.'
        });
    }
};

const telegramCallback = async (user) => {
    // const authStore = useAuthStore();
    // await authStore.telegramCallback(user);
    console.log('Telegram user data:', user);

};

// const initiateTelegramLogin = () => {
//     const script = document.createElement('script');
//     script.async = true;
//     script.src = "https://telegram.org/js/telegram-widget.js?22";
//     script.setAttribute("data-telegram-login", "owlmingo_bot");
//     script.setAttribute("data-size", "large");
//     script.setAttribute("data-radius", "20");
//     script.setAttribute("data-onauth", "onTelegramAuth(user)");
//     script.setAttribute("data-request-access", "write");
//     document.body.appendChild(script);
// };
</script>
