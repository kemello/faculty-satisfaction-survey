<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="modalTitle"
    :modal="true"
    :closable="true"
    :draggable="false"
    class="token-validation-modal"
    :style="{ width: '90vw', maxWidth: '500px' }"
    @hide="onModalHide"
  >
    <div class="modal-content">
      <!-- Survey Information -->
      <div class="survey-info" v-if="survey">
        <p class="survey-description">{{ survey.description }}</p>
        <div class="survey-dates">
          <small class="date-info">
            {{ formatDateRange(survey.startDate, survey.endDate) }}
          </small>
        </div>
      </div>

      <!-- Token Input Section -->
      <div class="token-input-section">
        <label for="token-input" class="token-label">
          Введите токен доступа:
        </label>
        <div class="token-input-container">
          <InputText
            id="token-input"
            ref="tokenInputRef"
            v-model="tokenValue"
            placeholder="Введите ваш токен"
            class="token-input"
            :class="{ 'p-invalid': hasError }"
            @keyup.enter="submitToken"
            @keyup.escape="closeModal"
            @input="clearError"
            maxlength="20"
            autocomplete="off"
          />
          <Button
            v-if="tokenValue"
            icon="pi pi-times"
            class="clear-button"
            severity="secondary"
            text
            @click="clearToken"
            aria-label="Очистить"
          />
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-section">
        <Message severity="error" :closable="false">
          {{ errorMessage }}
        </Message>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-section">
        <ProgressSpinner size="small" />
        <span class="loading-text">Проверка токена...</span>
      </div>
    </div>

    <!-- Modal Footer -->
    <template #footer>
      <div class="modal-footer">
        <Button
          label="Отмена"
          severity="secondary"
          @click="closeModal"
          :disabled="loading"
        />
        <Button
          label="Войти"
          @click="submitToken"
          :disabled="!tokenValue || loading"
          :loading="loading"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import { SurveyAccessService } from '@/service/SurveyAccessService';

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  survey: {
    type: Object,
    default: null
  }
});

// Emits
const emit = defineEmits(['update:visible', 'token-validated', 'modal-closed']);

// Refs
const tokenInputRef = ref(null);
const tokenValue = ref('');
const loading = ref(false);
const errorMessage = ref('');
const hasError = ref(false);

// Computed
const modalTitle = computed(() => {
  return props.survey ? `Доступ к опросу: ${props.survey.name}` : 'Доступ к опросу';
});

// Watch for modal visibility changes
watch(() => props.visible, (newValue) => {
  if (newValue) {
    // Reset state when modal opens
    resetModalState();
    // Focus on input after modal is rendered
    nextTick(() => {
      if (tokenInputRef.value) {
        tokenInputRef.value.$el.focus();
      }
    });
  }
});

// Methods
const resetModalState = () => {
  tokenValue.value = '';
  errorMessage.value = '';
  hasError.value = false;
  loading.value = false;
};

const clearToken = () => {
  tokenValue.value = '';
  clearError();
};

const clearError = () => {
  errorMessage.value = '';
  hasError.value = false;
};

const closeModal = () => {
  emit('update:visible', false);
  emit('modal-closed');
};

const onModalHide = () => {
  emit('update:visible', false);
  emit('modal-closed');
};

const submitToken = async () => {
  if (!tokenValue.value || loading.value) return;
  
  clearError();
  loading.value = true;

  try {
    const isValid = await SurveyAccessService.validateToken(
      tokenValue.value.trim(),
      props.survey.id
    );

    if (isValid) {
      emit('token-validated', {
        survey: props.survey,
        token: tokenValue.value.trim()
      });
      closeModal();
    }
  } catch (error) {
    hasError.value = true;
    
    // Map specific error messages
    const errorMsg = error.message.toLowerCase();
    if (errorMsg.includes('invalid token')) {
      errorMessage.value = 'Введенный токен недействителен для данного опроса.';
    } else if (errorMsg.includes('already used')) {
      errorMessage.value = 'Данный токен уже был использован.';
    } else if (errorMsg.includes('expired')) {
      errorMessage.value = 'Срок действия токена истек.';
    } else {
      errorMessage.value = 'Ошибка при проверке токена. Попробуйте еще раз.';
    }
  } finally {
    loading.value = false;
  }
};

const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = SurveyAccessService.formatDate(startDate);
  const end = SurveyAccessService.formatDate(endDate);
  
  return `${start} - ${end}`;
};
</script>

<style scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.survey-info {
  text-align: center;
  padding: 1rem;
  background: var(--surface-50);
  border-radius: 0.5rem;
  border: 1px solid var(--surface-200);
}

.survey-description {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 1rem;
  line-height: 1.5;
}

.date-info {
  color: var(--text-color-secondary);
  font-style: italic;
}

.token-input-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.token-label {
  font-weight: 600;
  color: var(--text-color);
  font-size: 1rem;
}

.token-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.token-input {
  width: 100%;
  font-size: 1rem;
  padding: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.clear-button {
  position: absolute;
  right: 0.5rem;
  z-index: 1;
}

.error-section {
  margin: 0;
}

.loading-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
}

.loading-text {
  color: var(--text-color-secondary);
  font-size: 0.875rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .modal-footer {
    flex-direction: column-reverse;
  }
  
  .modal-footer .p-button {
    width: 100%;
  }
}
</style>
