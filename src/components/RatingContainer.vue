<template>
  <div
    class="rating-container"
    :class="`rating-container--${rating}`"
    @dragover.prevent="handleDragOver"
    @dragenter.prevent="handleDragEnter"
    @dragleave.prevent="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="rating-header">
      <span class="rating-number">{{ rating }}</span>
      <span class="rating-label">{{ ratingLabel }}</span>
    </div>
    <div class="rating-content">
      <ProfessorItem
        v-for="professor in ratedProfessors"
        :key="professor.id"
        :professor="professor"
        :is-rated="true"
        @dragstart="$emit('professorDragStart', $event, professor)"
        @dragend="$emit('professorDragEnd', $event)"
      />
      <div v-if="ratedProfessors.length === 0" class="drop-zone">
        <span class="drop-zone-text">Перетащите сюда</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfessorItem from './ProfessorItem.vue';

// Props
const props = defineProps({
  rating: {
    type: Number,
    required: true
  },
  ratingLabel: {
    type: String,
    required: true
  },
  ratedProfessors: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits([
  'drop',
  'dragover',
  'dragenter',
  'dragleave',
  'professorDragStart',
  'professorDragEnd'
]);

// Methods
const handleDragOver = (event) => {
  event.target.closest('.rating-container')?.classList.add('drag-over');
  emit('dragover', event);
};

const handleDragEnter = (event) => {
  event.target.closest('.rating-container')?.classList.add('drag-over');
  emit('dragenter', event);
};

const handleDragLeave = (event) => {
  // Only remove if we're actually leaving the container
  if (!event.target.closest('.rating-container')?.contains(event.relatedTarget)) {
    event.target.closest('.rating-container')?.classList.remove('drag-over');
  }
  emit('dragleave', event);
};

const handleDrop = (event) => {
  event.target.closest('.rating-container')?.classList.remove('drag-over');
  emit('drop', event, props.rating);
};
</script>

<style scoped>
.rating-container {
  background: var(--surface-card);
  border: 2px dashed var(--surface-border);
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-height: 180px;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.rating-container:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.rating-container.drag-over {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-style: solid;
}

/* Rating Container Colors */
.rating-container--1 { 
  border-color: #ef4444 !important; 
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.02) 100%);
}
.rating-container--2 { 
  border-color: #f97316 !important; 
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.05) 0%, rgba(249, 115, 22, 0.02) 100%);
}
.rating-container--3 { 
  border-color: #f59e0b !important; 
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.02) 100%);
}
.rating-container--4 { 
  border-color: #84cc16 !important; 
  background: linear-gradient(135deg, rgba(132, 204, 22, 0.05) 0%, rgba(132, 204, 22, 0.02) 100%);
}
.rating-container--5 { 
  border-color: #10b981 !important; 
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%);
}

.rating-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--surface-border);
}

.rating-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.rating-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-color-secondary);
  text-align: center;
}

.rating-content {
  min-height: 100px;
  max-height: 200px;
  overflow-y: auto;
}

.drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  border: 1px dashed var(--surface-300);
  border-radius: 0.25rem;
  color: var(--text-color-secondary);
}

.drop-zone-text {
  font-size: 0.75rem;
  font-style: italic;
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .rating-container {
    min-height: 200px;
    padding: 1rem;
  }
  
  .rating-header {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
  
  .rating-number {
    font-size: 1.5rem;
  }
  
  .rating-label {
    font-size: 0.875rem;
  }
}

/* Accessibility */
.rating-container:focus-within {
  border-color: var(--primary-color);
  border-style: solid;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .rating-container {
    transition: none;
  }
  
  .rating-container:hover,
  .rating-container.drag-over {
    transform: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .rating-container {
    border-width: 3px;
  }
}
</style>
