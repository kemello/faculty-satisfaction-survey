<template>
<!--    <div class="rounded border border-surface-200 dark:border-surface-700 p-6 bg-surface-0 dark:bg-surface-900">-->
<!--        <ul class="m-0 p-0 list-none">-->
<!--            <li class="mb-4">-->
<!--                <div class="flex">-->
<!--                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>-->
<!--                    <div class="self-center" style="flex: 1">-->
<!--                        <Skeleton width="100%" class="mb-2"></Skeleton>-->
<!--                        <Skeleton width="75%"></Skeleton>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </li>-->
<!--            <li class="mb-4">-->
<!--                <div class="flex">-->
<!--                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>-->
<!--                    <div class="self-center" style="flex: 1">-->
<!--                        <Skeleton width="100%" class="mb-2"></Skeleton>-->
<!--                        <Skeleton width="75%"></Skeleton>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </li>-->
<!--            <li class="mb-4">-->
<!--                <div class="flex">-->
<!--                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>-->
<!--                    <div class="self-center" style="flex: 1">-->
<!--                        <Skeleton width="100%" class="mb-2"></Skeleton>-->
<!--                        <Skeleton width="75%"></Skeleton>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </li>-->
<!--            <li>-->
<!--                <div class="flex">-->
<!--                    <Skeleton shape="circle" size="4rem" class="mr-2"></Skeleton>-->
<!--                    <div class="self-center" style="flex: 1">-->
<!--                        <Skeleton width="100%" class="mb-2"></Skeleton>-->
<!--                        <Skeleton width="75%"></Skeleton>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </li>-->
<!--        </ul>-->
<!--    </div>-->
    <div class="flex">
        <div v-if="error" class="p-4 text-red-500">
            Error loading professors: {{ error }}
        </div>
        <ul class="flex flex-col gap-0 sm:gap-4 w-full">
            <li
                v-for="user in users"
                :key="user.id"
                :class="['p-2 hover:bg-emphasis rounded border border-transparent transition-all duration-200 flex items-center justify-content-between', { 'border-primary': selectedUser?.id === user.id }]"
            >
                <div class="flex flex-2 items-center gap-3">
                    <img :alt="user.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${user.image}`"
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
import {ProfessorService} from '@/service/ProfessorService.js';

const selectedUser = ref();
const users = ref([]);

const avatar = computed(() => 'w-16 h-16');
const username = computed(() => 'font-bold text-md hidden sm:flex');
import { useStudentStore } from '@/stores/studentStore.js'; // 新增

const studentStore = useStudentStore(); // 使用学生数据存储
onMounted(async () => {
    try {
        const { faculty, academicYear, studyMode } = studentStore.formData;

        const professors = await ProfessorService.getProfessors(
            faculty,
            academicYear,
            studyMode
        );
        users.value = professors[0]?.professors || []; // Add null safety
    } catch (error) {
        console.error('Failed to fetch professors:', error);
        // Update store/state to show error message
    }
});
</script>

<style scoped>
.flex {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
}
</style>

