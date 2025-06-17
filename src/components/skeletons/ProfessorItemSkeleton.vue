<template>
  <div class="professor-item-skeleton">
    <Skeleton shape="circle" size="2rem" class="professor-avatar-skeleton" />
    <Skeleton width="8rem" height="1rem" class="professor-name-skeleton" />
  </div>
</template>

<script setup>
import Skeleton from 'primevue/skeleton';
</script>

<style scoped>
.professor-item-skeleton {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--surface-ground);
  border: 1px solid transparent;
  border-radius: 0.375rem;
}

.professor-avatar-skeleton {
  flex-shrink: 0;
}

.professor-name-skeleton {
  flex: 1;
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .professor-item-skeleton {
    padding: 1rem;
    margin-bottom: 0.75rem;
    min-height: 3.5rem;
  }
  
  .professor-avatar-skeleton {
    width: 2.5rem !important;
    height: 2.5rem !important;
  }
}
</style>
