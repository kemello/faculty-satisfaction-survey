<template>
  <div class="student-form-skeleton">
    <!-- Title Skeleton -->
    <div class="form-title-skeleton">
      <Skeleton width="24rem" height="2rem" />
    </div>

    <!-- Form Fields Skeleton -->
    <div class="form-fields-skeleton">
      <!-- Gender Field -->
      <div class="field-skeleton">
        <Skeleton width="6rem" height="1.125rem" class="field-legend-skeleton" />
        <div class="field-content-skeleton">
          <div class="select-buttons-skeleton">
            <Skeleton width="5rem" height="2.5rem" />
            <Skeleton width="5rem" height="2.5rem" />
          </div>
        </div>
      </div>

      <!-- Academic Year Field -->
      <div class="field-skeleton">
        <Skeleton width="4rem" height="1.125rem" class="field-legend-skeleton" />
        <div class="field-content-skeleton">
          <div class="radio-options-skeleton">
            <div v-for="i in 5" :key="i" class="radio-option-skeleton">
              <Skeleton shape="circle" size="1rem" />
              <Skeleton width="4rem" height="1rem" />
            </div>
          </div>
        </div>
      </div>

      <!-- Faculty Field -->
      <div class="field-skeleton">
        <Skeleton width="12rem" height="1.125rem" class="field-legend-skeleton" />
        <div class="field-content-skeleton">
          <div class="radio-options-skeleton">
            <div v-for="i in 6" :key="i" class="radio-option-skeleton">
              <Skeleton shape="circle" size="1rem" />
              <Skeleton width="8rem" height="1rem" />
            </div>
          </div>
        </div>
      </div>

      <!-- Study Mode Field -->
      <div class="field-skeleton">
        <Skeleton width="8rem" height="1.125rem" class="field-legend-skeleton" />
        <div class="field-content-skeleton">
          <div class="radio-options-skeleton">
            <div v-for="i in 3" :key="i" class="radio-option-skeleton">
              <Skeleton shape="circle" size="1rem" />
              <Skeleton width="6rem" height="1rem" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button Skeleton -->
    <div class="submit-button-skeleton">
      <Skeleton width="12rem" height="3rem" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>

<style scoped>
.student-form-skeleton {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.form-title-skeleton {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.form-fields-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.field-skeleton {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 0.5rem;
  padding: 1rem;
}

.field-legend-skeleton {
  margin-bottom: 1rem;
}

.field-content-skeleton {
  background: var(--code-background);
  padding: 1rem;
  border-radius: 0.375rem;
}

.select-buttons-skeleton {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.radio-options-skeleton {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radio-option-skeleton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.submit-button-skeleton {
  display: flex;
  justify-content: center;
}

/* Responsive */
@media (min-width: 576px) {
  .submit-button-skeleton {
    width: 17.35rem;
    margin: 0 auto;
  }
}
</style>
