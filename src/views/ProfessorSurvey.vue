<template>
    <div class="card">
        <Fieldset>
            <template #legend>
                <div class="flex items-center pl-2">
                    <Avatar :image="professorImage" shape="circle"/>
                    <span class="font-bold p-2">{{ professorName }}</span>
                </div>
            </template>

            <!-- Loading state -->
            <div v-if="loading" class="card sub-card">
                <ProgressSpinner />
                <p class="m-0 text-center">Loading survey questions...</p>
            </div>

            <!-- Error state -->
            <div v-else-if="error" class="card sub-card">
                <p class="m-0 text-red-500">{{ error }}</p>
                <Button label="Retry" @click="fetchQuestions" class="mt-2" />
            </div>

            <!-- No questions state -->
            <div v-else-if="questions.length === 0" class="card sub-card">
                <p class="m-0 text-center">No survey questions available.</p>
            </div>

            <!-- Questions -->
            <template v-else>
                <div v-for="question in questions" :key="question.id" class="card sub-card">
                    <p class="m-0">
                        {{ question.text }}
                    </p>

                    <!-- RATING type question -->
                    <Rating v-if="question.questionType === 'RATING'" v-model="responses[question.id]">
                        <template #onicon>
                            <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24"
                                 width="24"/>
                        </template>
                        <template #officon>
                            <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24"
                                 width="24"/>
                        </template>
                    </Rating>

                    <!-- TEXT type question -->
                    <Textarea 
                        v-else-if="question.questionType === 'TEXT'" 
                        v-model="responses[question.id]" 
                        placeholder="Your answer" 
                        :autoResize="true" 
                        class="w-full"
                    />

                    <!-- SINGLE_CHOICE type question -->
                    <div v-else-if="question.questionType === 'SINGLE_CHOICE'" class="w-full">
                        <div v-for="option in question.options" :key="option.id" class="flex items-center gap-2 mt-2">
                            <RadioButton 
                                :inputId="`option-${option.id}`" 
                                :name="`question-${question.id}`"
                                :value="option.value" 
                                v-model="responses[question.id]"
                            />
                            <label :for="`option-${option.id}`">{{ option.text }}</label>
                        </div>
                    </div>

                    <!-- MULTIPLE_CHOICE type question -->
                    <div v-else-if="question.questionType === 'MULTIPLE_CHOICE'" class="w-full">
                        <div v-for="option in question.options" :key="option.id" class="flex items-center gap-2 mt-2">
                            <Checkbox 
                                :inputId="`option-${option.id}`" 
                                :name="`question-${question.id}`"
                                :value="option.value" 
                                v-model="responses[question.id]"
                            />
                            <label :for="`option-${option.id}`">{{ option.text }}</label>
                        </div>
                    </div>
                </div>
            </template>
        </Fieldset>
    </div>

    <div class="w-full flex items-center justify-center">
        <Button 
            class="w-full h-12 max-w-[12rem] sm:max-w-[17.35rem] mx-auto" 
            :disabled="!isFormValid || loading" 
            @click="submitSurvey"
            label="Отправить"
        />
    </div>

    <Toast />
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useProfessorStore } from '@/stores/professorStore';
import { getProfessorImage } from '@/utils/professorUtils';
import { SurveyService } from '@/service/SurveyService';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import RadioButton from 'primevue/radiobutton';
import Checkbox from 'primevue/checkbox';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const professorStore = useProfessorStore();

// Get the selected professor from the store
const selectedProfessor = computed(() => professorStore.selectedProfessor);

// Compute the professor's name, with a fallback
const professorName = computed(() => {
  return selectedProfessor.value?.name || 'No Professor Selected';
});

// Compute the professor's image URL using the utility function
const professorImage = computed(() => {
  return getProfessorImage(selectedProfessor.value);
});

// State for questions and responses
const questions = ref([]);
const loading = ref(false);
const error = ref(null);
const responses = reactive({});

// Fetch questions from the API
const fetchQuestions = async () => {
  if (!selectedProfessor.value) {
    error.value = "No professor selected";
    return;
  }

  if (selectedProfessor.value.id === undefined || selectedProfessor.value.id === null) {
    error.value = "Invalid professor ID";
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    const data = await SurveyService.getProfessorSurveyQuestions(selectedProfessor.value.id);
    questions.value = data || [];

    // Reset responses object
    Object.keys(responses).forEach(key => {
      delete responses[key];
    });

    // Initialize responses object for new questions
    questions.value.forEach(question => {
      if (question.questionType === 'MULTIPLE_CHOICE') {
        responses[question.id] = [];
      } else {
        responses[question.id] = null;
      }
    });
  } catch (err) {
    console.error('Failed to fetch questions:', err);
    error.value = `Error loading questions: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// Check if the form is valid (all required questions are answered)
const isFormValid = computed(() => {
  // If still loading or there's an error, form is not valid
  if (loading.value || error.value) return false;

  // Check if all required questions have responses
  return questions.value.every(question => {
    // TEXT questions are optional
    if (question.questionType === 'TEXT') return true;

    const response = responses[question.id];

    // For MULTIPLE_CHOICE, check if array has at least one item
    if (question.questionType === 'MULTIPLE_CHOICE') {
      return Array.isArray(response) && response.length > 0;
    }

    // For other types, check if response is not null or undefined
    return response !== null && response !== undefined;
  });
});

// Submit the survey
const submitSurvey = async () => {
  if (!isFormValid.value) return;

  try {
    // Prepare the data for submission according to API requirements
    const surveyData = {
      surveyId: 1, // Using a fixed surveyId of 1 as specified in the API example
      responses: Object.entries(responses).map(([questionId, value]) => ({
        questionId: parseInt(questionId),
        content: Array.isArray(value) ? value.join(',') : value?.toString() || ''
      }))
    };

    console.log('Submitting survey data:', surveyData);

    const response = await fetch('http://localhost:8080/api/surveys/assign-responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(surveyData)
    });

    if (!response.ok) {
      throw new Error(`Failed to submit survey: ${response.status} ${response.statusText}`);
    }

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Survey submitted successfully',
      life: 3000
    });
  } catch (err) {
    console.error('Failed to submit survey:', err);

    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to submit survey: ${err.message}`,
      life: 3000
    });
  }
};

// Fetch questions when component is mounted
onMounted(() => {
  fetchQuestions();
});
</script>

<style scoped>
.sub-card {
    @apply flex flex-col justify-center items-center gap-2;
    background: var(--code-background);
    p {
        @apply xl:text-xl lg:text-lg md:text-base sm:text-sm;
    }
}

.p-rating {
    position: unset;
}

/* Additional styles for different question types */
.w-full {
    width: 100%;
}

/* Center the loading spinner */
.p-progress-spinner {
    margin: 0 auto;
}
</style>
