<template>
  <div class="survey-card" :class="{ 'survey-card--inactive': !isActive }">
    <div class="survey-card-header">
      <h3 class="survey-title">{{ survey.name }}</h3>
      <div class="survey-status">
        <Tag 
          :value="statusText" 
          :severity="statusSeverity"
          class="status-tag"
        />
      </div>
    </div>

    <div class="survey-card-body">
      <p class="survey-description">{{ survey.description }}</p>
      
      <div class="survey-dates">
        <div class="date-item">
          <i class="pi pi-calendar" />
          <span class="date-label">Начало:</span>
          <span class="date-value">{{ formatDate(survey.startDate) }}</span>
        </div>
        <div class="date-item">
          <i class="pi pi-calendar" />
          <span class="date-label">Окончание:</span>
          <span class="date-value">{{ formatDate(survey.endDate) }}</span>
        </div>
      </div>
    </div>

    <div class="survey-card-footer">
      <Button
        :label="buttonText"
        :disabled="!isActive"
        :severity="isActive ? 'primary' : 'secondary'"
        @click="onTakeSurvey"
        class="take-survey-button"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { SurveyAccessService } from '@/service/SurveyAccessService';

// Props
const props = defineProps({
  survey: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['take-survey']);

// Computed
const isActive = computed(() => {
  return SurveyAccessService.isSurveyActive(props.survey);
});

const statusText = computed(() => {
  if (!props.survey.startDate || !props.survey.endDate) {
    return 'Неопределен';
  }

  const now = new Date();
  const startDate = new Date(props.survey.startDate);
  const endDate = new Date(props.survey.endDate);

  if (now < startDate) {
    return 'Скоро начнется';
  } else if (now > endDate) {
    return 'Завершен';
  } else {
    return 'Активен';
  }
});

const statusSeverity = computed(() => {
  switch (statusText.value) {
    case 'Активен':
      return 'success';
    case 'Скоро начнется':
      return 'info';
    case 'Завершен':
      return 'secondary';
    default:
      return 'warning';
  }
});

const buttonText = computed(() => {
  if (!isActive.value) {
    return 'Недоступен';
  }
  return 'Пройти опрос';
});

// Methods
const formatDate = (dateString) => {
  return SurveyAccessService.formatDate(dateString);
};

const onTakeSurvey = () => {
  if (isActive.value && !props.loading) {
    emit('take-survey', props.survey);
  }
};
</script>

<style scoped>
.survey-card {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
}

.survey-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.survey-card--inactive {
  opacity: 0.7;
}

.survey-card--inactive:hover {
  transform: none;
  box-shadow: none;
}

.survey-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.survey-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  flex: 1;
}

.survey-status {
  flex-shrink: 0;
}

.status-tag {
  font-size: 0.75rem;
  font-weight: 500;
}

.survey-card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.survey-description {
  margin: 0;
  color: var(--text-color-secondary);
  line-height: 1.6;
  font-size: 0.95rem;
}

.survey-dates {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.date-item i {
  color: var(--primary-color);
  font-size: 0.75rem;
}

.date-label {
  color: var(--text-color-secondary);
  font-weight: 500;
  min-width: 4rem;
}

.date-value {
  color: var(--text-color);
  font-weight: 600;
}

.survey-card-footer {
  margin-top: auto;
}

.take-survey-button {
  width: 100%;
  padding: 0.75rem;
  font-weight: 600;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .survey-card {
    padding: 1.25rem;
  }
  
  .survey-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .survey-title {
    font-size: 1.125rem;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .survey-card {
    transition: none;
  }
  
  .survey-card:hover {
    transform: none;
  }
}
</style>
