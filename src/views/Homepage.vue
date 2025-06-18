<template>
  <div class="homepage">
    <!-- Page Header -->
    <div class="page-header">
      <h1 class="page-title">Система опросов</h1>
      <p class="page-subtitle">Выберите доступный опрос для участия</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-section">
      <div class="surveys-grid">
        <SurveyCardSkeleton v-for="n in 3" :key="n" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-section">
      <Message severity="error" class="error-message">
        <div class="error-content">
          <h3>Ошибка загрузки</h3>
          <p>{{ error }}</p>
          <Button 
            label="Попробовать снова" 
            @click="fetchSurveys"
            class="retry-button"
          />
        </div>
      </Message>
    </div>

    <!-- No Surveys State -->
    <div v-else-if="surveys.length === 0" class="empty-state">
      <div class="empty-content">
        <i class="pi pi-inbox empty-icon" />
        <h3>Нет доступных опросов</h3>
        <p>В настоящее время нет активных опросов для участия.</p>
        <Button 
          label="Обновить" 
          @click="fetchSurveys"
          severity="secondary"
        />
      </div>
    </div>

    <!-- Surveys Grid -->
    <div v-else class="surveys-section">
      <div class="surveys-grid">
        <SurveyCard
          v-for="survey in surveys"
          :key="survey.id"
          :survey="survey"
          :loading="selectedSurveyId === survey.id && tokenValidating"
          @take-survey="onTakeSurvey"
        />
      </div>
    </div>

    <!-- Token Validation Modal -->
    <TokenValidationModal
      v-model:visible="showTokenModal"
      :survey="selectedSurvey"
      @token-validated="onTokenValidated"
      @modal-closed="onModalClosed"
    />

    <!-- Toast for notifications -->
    <Toast />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Message from 'primevue/message';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import SurveyCard from '@/components/SurveyCard.vue';
import TokenValidationModal from '@/components/TokenValidationModal.vue';
import SurveyCardSkeleton from '@/components/skeletons/SurveyCardSkeleton.vue';
import { SurveyAccessService } from '@/service/SurveyAccessService';
import { useSurveyTokenStore } from '@/stores/surveyTokenStore';

const router = useRouter();
const toast = useToast();
const surveyTokenStore = useSurveyTokenStore();

// State
const surveys = ref([]);
const loading = ref(true);
const error = ref(null);
const showTokenModal = ref(false);
const selectedSurvey = ref(null);
const selectedSurveyId = ref(null);
const tokenValidating = ref(false);

// Methods
const fetchSurveys = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await SurveyAccessService.getActiveSurveys();
    surveys.value = data;
  } catch (err) {
    console.error('Failed to fetch surveys:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const onTakeSurvey = (survey) => {
  selectedSurvey.value = survey;
  selectedSurveyId.value = survey.id;
  showTokenModal.value = true;
};

const onTokenValidated = async (data) => {
  tokenValidating.value = true;

  try {
    // Store validated token and survey data in the store
    surveyTokenStore.setValidatedToken(data.token, data.survey);

    // Navigate to StudentInfoSurvey to collect student information
    await router.push({
      name: 'student-info-survey'
    });

    toast.add({
      severity: 'success',
      summary: 'Доступ разрешен',
      detail: `Добро пожаловать в опрос "${data.survey.name}"`,
      life: 3000
    });

  } catch (err) {
    console.error('Navigation error:', err);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: 'Не удалось перейти к опросу',
      life: 3000
    });
  } finally {
    tokenValidating.value = false;
    selectedSurveyId.value = null;
  }
};

const onModalClosed = () => {
  selectedSurvey.value = null;
  selectedSurveyId.value = null;
  tokenValidating.value = false;
};

// Lifecycle
onMounted(() => {
  fetchSurveys();
});
</script>

<style scoped>
.homepage {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--text-color-secondary);
  margin: 0;
}

.loading-section,
.surveys-section {
  width: 100%;
}

.surveys-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.error-section {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.error-message {
  max-width: 500px;
  width: 100%;
}

.error-content {
  text-align: center;
}

.error-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.error-content p {
  margin: 0 0 1rem 0;
  color: var(--text-color-secondary);
}

.retry-button {
  margin-top: 1rem;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  margin: 2rem 0;
}

.empty-content {
  text-align: center;
  max-width: 400px;
}

.empty-icon {
  font-size: 3rem;
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
}

.empty-content h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 1.5rem;
}

.empty-content p {
  margin: 0 0 1.5rem 0;
  color: var(--text-color-secondary);
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .homepage {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .page-subtitle {
    font-size: 1rem;
  }
  
  .surveys-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .page-header {
    margin-bottom: 2rem;
  }
}

@media (max-width: 480px) {
  .homepage {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
}
</style>
