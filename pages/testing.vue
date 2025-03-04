<template>
    <Footer />
    <AuthForgetPassword />
    <AuthSignIn />
    <AuthSignUp />
    <AuthOtp />
    <AuthNewPassword />



</template>


<script setup>
// template

import ForgetPassword from '../components/auth/ForgetPassword.vue';
import NewPassword from '../components/auth/NewPassword.vue';
import Footer from '../components/Footer.vue';
import auth from '../middleware/auth';


// script


// data


// methods
  definePageMeta({
    layout: 'default',
  });

  const TestingFunc = () => {
    console.log('Testing');
  }
</script>
