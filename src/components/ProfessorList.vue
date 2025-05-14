<template>

    <div class="flex">
        <div v-if="loading" class="p-4 text-blue-500">
            Loading professors...
        </div>
        <div v-else-if="error" class="p-4 text-red-500">
            {{ error }}
        </div>
        <div v-else-if="users.length === 0" class="p-4 text-gray-500">
            No professors found for your selection.
        </div>
        <ul v-else class="flex flex-col gap-0 sm:gap-4 w-full">
            <li
                v-for="user in users"
                :key="user.id"
                :class="['p-2 hover:bg-emphasis rounded border border-transparent transition-all duration-200 flex items-center justify-content-between', { 'border-primary': selectedUser?.id === user.id }]"
                @click="selectedUser = user"
            >
                <div class="flex flex-2 items-center gap-3">
                    <img v-if="user.image" :alt="user.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${user.image}`"
                         :class="avatar"/>
                    <img v-else :alt="user.name" src="https://docs.gravatar.com/wp-content/uploads/2025/02/avatar-mysteryperson-20250210-256.png"
                         :class="avatar"/>
                    <span :class="username">{{ user.name }}</span>
                </div>
            </li>
        </ul>
        <Toast/>
    </div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import axios from 'axios';
import { useStudentStore } from '@/stores/studentStore.js';
import Toast from 'primevue/toast';

const selectedUser = ref();
const users = ref([]);
const loading = ref(false);
const error = ref(null);

const avatar = computed(() => 'w-16 h-16');
const username = computed(() => 'font-bold text-md hidden sm:flex');

const studentStore = useStudentStore();

onMounted(async () => {
    if (!studentStore.formData) {
        error.value = "No student information available";
        return;
    }

    loading.value = true;
    try {
        const { faculty, academicYear, studyMode } = studentStore.formData;

        console.log('Form data:', { faculty, academicYear, studyMode });

        // Check if academicYear is valid
        if (!academicYear) {
            throw new Error("Academic year is required");
        }

        const response = await axios.get('http://localhost:8080/api/professors/by-assignments', {
            params: {
                faculty,
                academicYear,
                studyMode
            }
        });

        users.value = response.data || [];
    } catch (err) {
        console.error('Failed to fetch professors:', err);
        error.value = `Error loading professors: ${err.message}`;
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.flex {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

ul.flex {
    width: 100%;
    max-width: 600px;
}

li:hover {
    cursor: pointer;
}
</style>
