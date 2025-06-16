<template>
  <div class="question-navigation-container">
    <div class="question-navigation">
      <Button 
        icon="pi pi-arrow-left" 
        @click="$emit('previousQuestion')" 
        :disabled="isFirstQuestion"
        class="nav-button nav-button--prev"
        severity="secondary"
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
        class="nav-button nav-button--next"
        severity="secondary"
        text
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import Button from 'primevue/button';

// Props
const props = defineProps({
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
  }
});

// Emits
const emit = defineEmits(['previousQuestion', 'nextQuestion']);

// Computed
const isFirstQuestion = computed(() => props.currentQuestionIndex === 0);
const isLastQuestion = computed(() => props.currentQuestionIndex === props.totalQuestions - 1);
</script>

<style scoped>
.question-navigation-container {
  margin-bottom: 1rem;
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
</style>
