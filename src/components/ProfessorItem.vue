<template>
  <div
    class="professor-item"
    :class="{ 'professor-item--rated': isRated }"
    draggable="true"
    @dragstart="handleDragStart"
    @dragend="handleDragEnd"
  >
    <img
      :src="professorImage"
      :alt="professor.name"
      class="professor-avatar"
    >
    <span class="professor-name">{{ professor.name }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { getProfessorImage } from '@/utils/professorUtils';

// Props
const props = defineProps({
  professor: {
    type: Object,
    required: true
  },
  isRated: {
    type: Boolean,
    default: false
  }
});

// Emits
const emit = defineEmits(['dragstart', 'dragend']);

// Computed
const professorImage = computed(() => getProfessorImage(props.professor));

// Methods
const handleDragStart = (event) => {
  event.target.classList.add('dragging');
  emit('dragstart', event, props.professor);
};

const handleDragEnd = (event) => {
  event.target.classList.remove('dragging');
  emit('dragend', event);
};
</script>

<style scoped>
.professor-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--surface-ground);
  border: 1px solid transparent;
  border-radius: 0.375rem;
  cursor: move;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.professor-item:hover {
  background-color: var(--surface-hover);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.professor-item.dragging {
  opacity: 0.6;
  transform: scale(0.95);
}

.professor-item--rated {
  background: var(--surface-100);
}

.professor-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  flex-shrink: 0;
  object-fit: cover;
}

.professor-name {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-color);
  line-height: 1.3;
}

/* Touch Device Optimizations */
@media (hover: none) and (pointer: coarse) {
  .professor-item {
    padding: 1rem;
    margin-bottom: 0.75rem;
    min-height: 3.5rem;
  }
  
  .professor-avatar {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .professor-name {
    font-size: 1rem;
  }
}

/* Accessibility */
.professor-item:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .professor-item {
    transition: none;
  }
  
  .professor-item:hover {
    transform: none;
  }
}
</style>
