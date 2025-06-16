<template>
  <Fieldset class="question-display-fieldset">
    <template #legend>
      <span class="question-legend">{{ legendText }}</span>
    </template>
    <div class="card sub-card">
      <h3 class="question-text">{{ questionText }}</h3>
      <p v-if="instructionText" class="instruction-text">{{ instructionText }}</p>
    </div>
  </Fieldset>
</template>

<script setup>
import Fieldset from 'primevue/fieldset';

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
  }
});
</script>

<style scoped>
/* Question Display Component Styles */
.question-display-fieldset {
  margin-bottom: 0;
  width: 100%;
}

.question-legend {
  font-size: large;
  font-weight: normal !important;
}

.card.sub-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  background: var(--code-background);
  padding: 1.5rem;
  border-radius: 0.5rem;
}

.question-text {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-color);
  line-height: 1.4;
}

.instruction-text {
  font-size: 0.875rem;
  margin-bottom: 0;
  color: var(--text-color-secondary);
  line-height: 1.5;
}

/* Responsive Typography */
@media (min-width: 768px) {
  .question-text {
    font-size: 1.375rem;
  }

  .instruction-text {
    font-size: 1rem;
  }
}

@media (min-width: 1024px) {
  .card.sub-card {
    padding: 2rem;
  }

  .question-text {
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .instruction-text {
    font-size: 1.125rem;
  }
}

@media (min-width: 1280px) {
  .question-text {
    font-size: 1.625rem;
  }
}
</style>
