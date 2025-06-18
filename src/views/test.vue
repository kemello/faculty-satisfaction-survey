<template>
  <div>
    <div v-if="loading">Loading professors...</div>
    <div v-if="error" class="error">{{ error }}</div>
    
    <div v-if="professors">
      <h2>Professors:</h2>
      <div v-for="prof in professors" :key="prof.id" class="professor">
        <img :src="prof.avatarUrl" alt="Avatar" width="50" height="50" />
        <h3>{{ prof.name }}</h3>
        <p>ID: {{ prof.id }}</p>
        <p>Created: {{ new Date(prof.createdAt).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const professors = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  console.log('=== TESTING BACKEND CONNECTIVITY ===');

  // Test both endpoints
  const endpoints = [
    'http://localhost:8080/api/professors/by-assignment',
    'http://localhost:8080/api/professors/by-assignments'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing endpoint: ${endpoint}`);
      const response = await axios.get(endpoint, {
        params: {
          faculty: 'IST',
          academicYear: 'FIRST_YEAR',
          studyMode: 'FULL_TIME'
        }
      });

      console.log(`✅ ${endpoint} - Status:`, response.status);
      console.log(`✅ ${endpoint} - Data:`, response.data);
      professors.value = response.data;
      break; // Use the first successful endpoint
    } catch (err) {
      console.error(`❌ ${endpoint} - Error:`, err.message);
      console.error(`❌ ${endpoint} - Response:`, err.response?.data);
      error.value = `Error fetching data: ${err.message}`;
    }
  }

  loading.value = false;
});
</script>

<style scoped>
.professor {
  margin: 20px;
  padding: 10px;
  border: 1px solid #ccc;
}
.error {
  color: red;
}
</style>
