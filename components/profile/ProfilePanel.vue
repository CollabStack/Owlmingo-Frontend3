<template>
    <div>
        <h2 class="text-h5 mb-6 text-primary">Your Profile</h2>

        <!-- Profile Image Skeleton or Avatar -->
        <div class="mb-6" style="display: flex; justify-content: center;">
            <div class="position-relative" style="width: 100px; height: 100px;">
                <template v-if="skeletonLoading">
                    <v-skeleton-loader type="avatar" width="100" height="100" />
                </template>
                <template v-else>
                    <v-avatar size="100">
                        <v-img :src="previewUrl || defaultAvatar" alt="Profile Image" />
                    </v-avatar>

                    <!-- Pencil Icon -->
                    <v-btn icon color="primary" size="x-small" class="position-absolute" style="bottom: 0; right: 0;"
                        @click="triggerFileInput">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <!-- Hidden file input -->
                    <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="handleImageUpload" />
                </template>
            </div>
        </div>

        <!-- Username Field Skeleton or Text Field -->
        <v-container class="pa-0">
            <template v-if="skeletonLoading">
                <v-skeleton-loader type="text" class="mb-2" />
                <v-skeleton-loader type="button" width="140px" />
            </template>
            <template v-else>
                <v-text-field label="Username" v-model="fullName" variant="outlined" />
                <v-btn color="primary" class="mt-2" @click="updateProfile" :loading="loading">
                    Update Profile
                </v-btn>
            </template>
        </v-container>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { userAuth } from '~/store/userAuth'
import Swal from 'sweetalert2'

const userStore = userAuth()

// State
const fullName = ref('')
const profile = ref('')
const selectedFile = ref<File | null>(null)
const defaultAvatar = '/female_profile.jpg'
const previewUrl = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const loading = ref(false)
const skeletonLoading = ref(true)

// Load user data
onMounted(async () => {
    try {
        const userData = userStore.getUser() as { username?: string; profile_url?: string } | null
        if (userData) {
            fullName.value = userData.username || ''
            profile.value = userData.profile_url || ''
            previewUrl.value = userData.profile_url || defaultAvatar
        }
    } catch (err) {
        console.error('Error loading profile:', err)
    } finally {
        skeletonLoading.value = false
    }
})

// Trigger file input
function triggerFileInput() {
    fileInput.value?.click()
}

// Preview image + store file
function handleImageUpload(event: Event) {
    const file = (event.target as HTMLInputElement)?.files?.[0]
    if (file) {
        selectedFile.value = file
        previewUrl.value = URL.createObjectURL(file)
    }
}

// Handle update
async function updateProfile() {
    const payload: { username?: string; file?: File } = {}

    const currentUser = userStore.getUser() as { username?: string; profile_url?: string } | null

    if (fullName.value && fullName.value !== currentUser?.username) {
        payload.username = fullName.value
    }

    if (selectedFile.value) {
        payload.file = selectedFile.value
    }

    if (!payload.username && !payload.file) {
        Swal.fire('No changes', 'You haven’t changed anything yet.', 'info')
        return
    }

    loading.value = true
    try {
        await userStore.updateInformation({ username: payload.username ?? currentUser?.username, file: payload.file ?? null })
        Swal.fire('Success', 'Profile updated successfully!', 'success')
    } catch (err) {
        console.error('Update failed:', err)
        Swal.fire('Error', 'Something went wrong while updating.', 'error')
    } finally {
        loading.value = false
    }
}
</script>