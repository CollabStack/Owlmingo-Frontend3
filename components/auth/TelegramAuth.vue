<template>
  <div>
    <button v-if="!user" @click="handleLogin">Login with Telegram</button>
    <div v-if="user">
      <p>Welcome, {{ user.first_name }}</p>
      <button @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { useTelegramAuth } from '#imports'

const { user, login, logout } = useTelegramAuth()

const handleLogin = () => {
  login()
}
</script>

