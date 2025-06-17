<template>
  <div class="question-display-skeleton">
    <!-- Survey Title Skeleton -->
    <div class="survey-title-skeleton">
      <Skeleton width="20rem" height="2.5rem" class="title-skeleton" />
    </div>

    <!-- Question Navigation Skeleton -->
    <div class="question-navigation-skeleton">
      <div class="navigation-container-skeleton">
        <Skeleton shape="circle" size="2.5rem" class="nav-button-skeleton" />
        <div class="question-counter-skeleton">
          <Skeleton width="3rem" height="1.125rem" />
        </div>
        <Skeleton shape="circle" size="2.5rem" class="nav-button-skeleton" />
      </div>
    </div>

    <!-- Question Content Skeleton -->
    <div class="question-content-skeleton">
      <div class="question-legend-skeleton">
        <Skeleton width="8rem" height="1.125rem" />
      </div>
      <div class="question-text-skeleton">
        <Skeleton width="100%" height="1.5rem" class="question-title-skeleton" />
        <Skeleton width="80%" height="1rem" class="instruction-skeleton" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>

<style scoped>
.question-display-skeleton {
  width: 100%;
  margin-bottom: 1.5rem;
}

/* Survey Title Skeleton */
.survey-title-skeleton {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

/* Question Navigation Skeleton */
.question-navigation-skeleton {
  margin-bottom: 1.5rem;
}

.navigation-container-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--surface-card);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--surface-border);
}

.question-counter-skeleton {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Question Content Skeleton */
.question-content-skeleton {
  width: 100%;
}

.question-legend-skeleton {
  margin-bottom: 1rem;
  display: flex;
  justify-content: flex-start;
}

.question-text-skeleton {
  background: var(--surface-ground);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid var(--surface-border);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Responsive */
@media (min-width: 768px) {
  .title-skeleton {
    width: 24rem !important;
    height: 2rem !important;
  }
}

@media (min-width: 1024px) {
  .title-skeleton {
    width: 28rem !important;
    height: 2.25rem !important;
  }
  
  .question-text-skeleton {
    padding: 2rem;
  }
}

@media (min-width: 1280px) {
  .title-skeleton {
    width: 32rem !important;
    height: 2.5rem !important;
  }
}
</style>
