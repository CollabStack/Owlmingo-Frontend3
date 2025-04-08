<template>
    <div class="mx-3 mt-3" >
        <AdminGlobalTable
        :headers="headers"
        :items="dessertsData"
        :showEdit="true"
        :showActivate="true"
        :showDeactivate="true"
        >
        </AdminGlobalTable>
    </div>
</template>
<script setup >
import { ref, onMounted } from 'vue';

definePageMeta({
    layout: 'admin',
});

const headers = ref([
    { text: "Name", value: "name" },
    { text: "Role", value: "role" },
    { text: "Email", value: "email"},
    { text: "Subscribed", value: "subscribed",},
    { text: "Created At", value: "created_at" },
    { text: "Updated At", value: "updated_at" },
    { text: "Last Login", value: "last_login" },
    { text: "Last Activity", value: "last_activity" },
]);

const dessertsData = ref([
    {
        name: "Frozen Yogurt",
        role: "Admin",
        email: "yogurt@gmail.com",
        subscribed: "Yes",
        created_at: "2023-10-01",
        updated_at: "2023-10-02",
        last_login: "2023-10-03",
        last_activity: "2023-10-04",
    },
    
]);
</script>