<template>
  <div class="survey-card-skeleton">
    <div class="survey-card-header-skeleton">
      <Skeleton width="70%" height="1.5rem" class="title-skeleton" />
      <Skeleton width="4rem" height="1.25rem" class="status-skeleton" />
    </div>

    <div class="survey-card-body-skeleton">
      <div class="description-skeleton">
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="80%" height="1rem" />
        <Skeleton width="60%" height="1rem" />
      </div>
      
      <div class="dates-skeleton">
        <div class="date-item-skeleton">
          <Skeleton shape="circle" size="0.75rem" />
          <Skeleton width="3rem" height="0.875rem" />
          <Skeleton width="6rem" height="0.875rem" />
        </div>
        <div class="date-item-skeleton">
          <Skeleton shape="circle" size="0.75rem" />
          <Skeleton width="3rem" height="0.875rem" />
          <Skeleton width="6rem" height="0.875rem" />
        </div>
      </div>
    </div>

    <div class="survey-card-footer-skeleton">
      <Skeleton width="100%" height="2.5rem" class="button-skeleton" />
    </div>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>

<style scoped>
.survey-card-skeleton {
  background: var(--surface-card);
  border: 1px solid var(--surface-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  height: 100%;
  min-height: 280px;
}

.survey-card-header-skeleton {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.title-skeleton {
  flex: 1;
}

.status-skeleton {
  flex-shrink: 0;
  border-radius: 1rem;
}

.survey-card-body-skeleton {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.description-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dates-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-item-skeleton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.survey-card-footer-skeleton {
  margin-top: auto;
}

.button-skeleton {
  border-radius: 0.375rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .survey-card-skeleton {
    padding: 1.25rem;
  }
  
  .survey-card-header-skeleton {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .title-skeleton {
    width: 80%;
  }
  
  .status-skeleton {
    width: 3rem;
  }
}
</style>
