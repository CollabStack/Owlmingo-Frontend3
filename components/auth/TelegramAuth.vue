<template>
  <div>
    <button v-if="!user" @click="handleLogin">Login with Telegram</button>
    <div v-else>
      <p>Welcome, {{ user.first_name }}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useTelegramAuth } from '~/composables/useTelegramAuth';

const { user, login, logout } = useTelegramAuth();

function handleLogin() {
  login();
}
</script>

<script async src="https://telegram.org/js/telegram-widget.js?22" data-telegram-login="owlmingo_bot" data-size="large" data-radius="20" data-onauth="onTelegramAuth(user)" data-request-access="write"></script>
<script type="text/javascript">
  function onTelegramAuth(user) {
    alert('Logged in as ' + user.first_name + ' ' + user.last_name + ' (' + user.id + (user.username ? ', @' + user.username : '') + ')');
  }
</script>