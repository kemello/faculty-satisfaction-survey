<template>
  <!-- Loading State -->
  <QuestionDisplaySkeleton v-if="loading" />

  <!-- Loaded Content -->
  <div v-else class="question-display-container">
    <!-- Survey Title -->
    <div class="survey-title-section">
      <h1 class="survey-title">Оценка преподавателей</h1>
    </div>

    <!-- Question Navigation -->
    <div class="question-navigation-section">
      <div class="question-navigation">
        <Button
          icon="pi pi-arrow-left"
          @click="$emit('previousQuestion')"
          :disabled="isFirstQuestion"
          :class="['nav-button', 'nav-button--prev', { 'nav-button--active': !isFirstQuestion }]"
          :severity="isFirstQuestion ? 'secondary' : 'primary'"
          text
        />
        <div class="question-counter">
          <span class="current-question-number">{{ currentQuestionIndex + 1 }}</span>
          <span class="question-separator">из</span>
          <span class="total-questions">{{ totalQuestions }}</span>
        </div>
        <Button
          icon="pi pi-arrow-right"
          @click="$emit('nextQuestion')"
          :disabled="isLastQuestion || !canProceed"
          :class="['nav-button', 'nav-button--next', { 'nav-button--active': !isLastQuestion && canProceed }]"
          :severity="(isLastQuestion || !canProceed) ? 'secondary' : 'primary'"
          text
        />
      </div>
    </div>

    <!-- Question Content -->
    <div class="question-content-section">
      <div class="question-legend-wrapper">
        <span class="question-legend">{{ legendText }}</span>
      </div>
      <div class="question-content">
        <h3 class="question-text">{{ questionText }}</h3>
        <p v-if="instructionText" class="instruction-text">{{ instructionText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';
import QuestionDisplaySkeleton from './skeletons/QuestionDisplaySkeleton.vue';

// Props
const props = defineProps({
  questionText: {
    type: String,
    required: true
  },
  instructionText: {
    type: String,
    default: ''
  },
  legendText: {
    type: String,
    default: 'Текущий вопрос'
  },
  currentQuestionIndex: {
    type: Number,
    required: true
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  canProceed: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['previousQuestion', 'nextQuestion']);

// Computed
const isFirstQuestion = computed(() => props.currentQuestionIndex === 0);
const isLastQuestion = computed(() => props.currentQuestionIndex === props.totalQuestions - 1);
</script>

<style scoped>
/* Question Display Component Styles */
.question-display-container {
  width: 100%;
  margin-bottom: 1.5rem;
}

/* Survey Title Section */
.survey-title-section {
  margin-bottom: 1.5rem;
}

.survey-title {
  font-weight: 500;
  font-size: 1.875rem;
  margin: 0 0 1rem 0;
  text-align: center;
  color: var(--text-color);
}

/* Question Navigation Section */
.question-navigation-section {
  margin-bottom: 1.5rem;
}

.question-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface-card);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--surface-border);
}

.question-counter {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: var(--text-color);
}

.current-question-number,
.total-questions {
  font-size: 1.125rem;
  font-weight: 700;
}

.question-separator {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.nav-button {
  min-width: 2.5rem;
  height: 2.5rem;
  transition: all 0.2s ease-in-out;
}

.nav-button--active {
  color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Question Content Section */
.question-content-section {
  width: 100%;
}

.question-legend-wrapper {
  margin-bottom: 1rem;
}

.question-legend {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-color);
  padding: 0.5rem 1rem;
  background: var(--surface-100);
  border-radius: 0.375rem;
  border: 1px solid var(--surface-border);
}

.question-content {
  background: var(--surface-ground);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--surface-border);
}

.question-text {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: var(--text-color);
  line-height: 1.4;
  margin-top: 0;
}

.instruction-text {
  font-size: 0.875rem;
  margin-bottom: 0;
  color: var(--text-color-secondary);
  line-height: 1.5;
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .nav-button {
    min-width: 3rem;
    height: 3rem;
  }
}

/* Accessibility */
.nav-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Responsive Typography */
@media (min-width: 768px) {
  .survey-title {
    font-size: 2rem;
  }

  .question-legend {
    font-size: 1.25rem;
  }

  .question-text {
    font-size: 1.375rem;
  }

  .instruction-text {
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .survey-title {
    font-size: 2.25rem;
  }

  .question-content {
    padding: 2rem;
  }

  .question-text {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .instruction-text {
    font-size: 1.125rem;
  }
}

@media (min-width: 1280px) {
  .survey-title {
    font-size: 2.5rem;
  }

  .question-legend {
    font-size: 1.375rem;
  }

  .question-text {
    font-size: 1.625rem;
  }
}
</style>
