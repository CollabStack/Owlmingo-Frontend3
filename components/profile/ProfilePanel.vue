<template>
    <div>
        <h2 class="text-h5 mb-6 text-primary">Your Profile</h2>

        <!-- Centered Profile Image Only -->
        <div class="mb-6" style="display: flex; justify-content: center;">
            <div class="position-relative" style="width: 100px; height: 100px;">
                <v-avatar size="100">
                    <v-img :src="previewUrl || defaultAvatar" alt="Profile Image" />
                </v-avatar>

                <!-- Pencil Icon Button -->
                <v-btn icon color="primary" size="x-small" class="position-absolute" style="bottom: 0; right: 0;"
                    @click="triggerFileInput">
                    <v-icon>mdi-pencil</v-icon>
                </v-btn>

                <!-- Hidden file input -->
                <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleImageUpload" />
            </div>
        </div>

        <!-- Form (left-aligned like Change Password) -->
        <v-container class="pa-0">
            <v-text-field label="Username" v-model="fullName" variant="outlined"/>
            <!-- <v-text-field label="Email" v-model="email" /> -->
            <v-btn color="primary" class="mt-2" @click="updateProfile">Update Profile</v-btn>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Form state
const fullName = ref('John Doe')
const email = ref('john@example.com')

// Image state
const defaultAvatar = '/female_profile.jpg'
const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
    if (fileInput.value) {
        fileInput.value.click()
    }
}

function handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0]
    if (file) {
        previewUrl.value = URL.createObjectURL(file)
    }
}

function updateProfile() {
    console.log('Updated:', {
        fullName: fullName.value,
        email: email.value,
        avatar: previewUrl.value || defaultAvatar
    })
}
</script>
