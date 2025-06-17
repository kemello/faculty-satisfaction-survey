<template>
  <div class="rating-container-skeleton">
    <div class="rating-header-skeleton">
      <Skeleton shape="circle" size="1.5rem" class="rating-number-skeleton" />
      <Skeleton width="4rem" height="0.75rem" class="rating-label-skeleton" />
    </div>
    <div class="rating-content-skeleton">
      <div class="drop-zone-skeleton">
        <Skeleton width="6rem" height="0.75rem" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>

<style scoped>
.rating-container-skeleton {
  background: var(--surface-card);
  border: 2px dashed var(--surface-border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-height: 180px;
  height: auto;
  min-width: 200px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.rating-header-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border);
}

.rating-content-skeleton {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.drop-zone-skeleton {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  border: 1px dashed var(--surface-300);
  border-radius: 0.25rem;
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .rating-container-skeleton {
    min-height: 200px;
    padding: 1rem;
  }
  
  .rating-header-skeleton {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
}
</style>
