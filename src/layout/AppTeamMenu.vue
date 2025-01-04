<template>
  <div class="flex">
    <ul class="flex flex-col gap-0 sm:gap-4 w-full">
      <li
          v-for="user in users"
          :key="user.id"
          :class="['p-2 hover:bg-emphasis rounded border border-transparent transition-all duration-200 flex items-center justify-content-between', { 'border-primary': selectedUser?.id === user.id }]"
      >
        <div class="flex flex-2 items-center gap-3">
          <img :alt="user.name" :src="`https://primefaces.org/cdn/primevue/images/avatar/${user.image}`" :class="avatar" />
          <span :class="username">{{ user.name }}</span>
        </div>

      </li>
    </ul>
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { ProfessorService } from '@/service/ProfessorService.js';

const selectedUser = ref();
const users = ref([]);

const avatar = computed(() => 'w-8 h-8 xl:w-24 xl:h-24 lg:w-20 lg:h-20 md:w-16 md:h-16');
const username = computed(() => 'font-bold xl:text-xl lg:text-lg md:text-md hidden sm:flex');

onMounted(() => {
    const professors = ProfessorService.getProfessors();
    users.value = professors[0].users;
});
</script>

<style scoped>
</style>

