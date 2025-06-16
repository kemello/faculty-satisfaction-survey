<template>
  <div class="professors-section">
    <div
      class="professors-container"
      @dragover.prevent="handleDragOver"
      @dragenter.prevent="handleDragEnter"
      @dragleave.prevent="handleDragLeave"
      @drop="handleDrop"
    >
      <h4 class="section-title">Преподаватели для оценки</h4>
      <div class="professors-list">
        <ProfessorItem
          v-for="professor in availableProfessors"
          :key="professor.id"
          :professor="professor"
          @dragstart="$emit('professorDragStart', $event, professor)"
          @dragend="$emit('professorDragEnd', $event)"
        />
        <div v-if="availableProfessors.length === 0" class="empty-state">
          <p class="empty-state-text">Все преподаватели оценены!</p>
          <small class="empty-state-hint">Перетащите преподавателя сюда, чтобы убрать оценку</small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProfessorItem from './ProfessorItem.vue';

// Props
const props = defineProps({
  availableProfessors: {
    type: Array,
    default: () => []
  }
});

// Emits
const emit = defineEmits([
  'dropToSource',
  'dragOverSource',
  'dragEnterSource',
  'dragLeaveSource',
  'professorDragStart',
  'professorDragEnd'
]);

// Methods
const handleDragOver = (event) => {
  event.target.closest('.professors-container')?.classList.add('drag-over');
  emit('dragOverSource', event);
};

const handleDragEnter = (event) => {
  event.target.closest('.professors-container')?.classList.add('drag-over');
  emit('dragEnterSource', event);
};

const handleDragLeave = (event) => {
  // Only remove if we're actually leaving the container
  if (!event.target.closest('.professors-container')?.contains(event.relatedTarget)) {
    event.target.closest('.professors-container')?.classList.remove('drag-over');
  }
  emit('dragLeaveSource', event);
};

const handleDrop = (event) => {
  event.target.closest('.professors-container')?.classList.remove('drag-over');
  emit('dropToSource', event);
};
</script>

<style scoped>
.professors-section {
  width: 100%;
  height: 100%;
}

.professors-container {
  background: var(--surface-card);
  border: 1px dashed var(--surface-border);
  border-radius: 0.5rem;
  padding: 1rem;
  height: 100%;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.professors-container.drag-over {
  border-color: var(--primary-color);
  border-style: solid;
  background-color: var(--primary-50);
  transform: scale(1.01);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
  color: var(--text-color);
  flex-shrink: 0;
}

.professors-list {
  flex: 1;
  min-height: 200px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

/* Custom scrollbar for better UX */
.professors-list::-webkit-scrollbar {
  width: 6px;
}

.professors-list::-webkit-scrollbar-track {
  background: var(--surface-100);
  border-radius: 3px;
}

.professors-list::-webkit-scrollbar-thumb {
  background: var(--surface-300);
  border-radius: 3px;
}

.professors-list::-webkit-scrollbar-thumb:hover {
  background: var(--surface-400);
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-color-secondary);
}

.empty-state-text {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.empty-state-hint {
  font-size: 0.75rem;
  font-style: italic;
}

/* Tablet and Desktop Styles */
@media (min-width: 768px) {
  .professors-container {
    min-height: 500px;
  }

  .professors-list {
    min-height: 400px;
    max-height: none; /* Allow full height usage */
  }
}

@media (min-width: 1024px) {
  .professors-container {
    min-height: 600px;
  }

  .professors-list {
    min-height: 500px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .professors-container {
    transition: none;
  }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .professors-container {
    border-width: 2px;
  }
}
</style>
