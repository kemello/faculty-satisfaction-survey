<template>
    <!-- Loading state -->
    <div v-if="loading" class="card sub-card">
        <ProgressSpinner />
        <p class="loading-text">Загрузка вопросов анкеты...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="card sub-card">
        <p class="error-text">{{ error }}</p>
        <Button label="Повторить" @click="fetchQuestions" class="retry-button" />
    </div>

    <!-- No questions state -->
    <div v-else-if="questions.length === 0" class="card sub-card">
        <p class="no-data-text">Вопросы анкеты недоступны.</p>
    </div>

    <!-- Survey Interface -->
    <template v-else>
        <!-- Main Survey Layout -->
        <div class="survey-layout-container">
            <!-- Left Sidebar: Professors List -->
            <div class="professors-sidebar">
                <ProfessorsList
                    :available-professors="availableProfessors"
                    :loading="loading"
                    :skeleton-count="6"
                    @drop-to-source="onDropToSource"
                    @drag-over-source="onDragOverSource"
                    @drag-enter-source="onDragEnterSource"
                    @drag-leave-source="onDragLeaveSource"
                    @professor-drag-start="onDragStart"
                    @professor-drag-end="onDragEnd"
                />
            </div>

            <!-- Main Content Area -->
            <div class="main-content-area">
                <!-- Question Display with Integrated Header -->
                <QuestionDisplay
                    :question-text="currentQuestion.text || ''"
                    :instruction-text="'Перетащите преподавателей в соответствующие категории оценок'"
                    legend-text="Текущий вопрос"
                    :current-question-index="currentQuestionIndex"
                    :total-questions="questions.length"
                    :can-proceed="canProceedToNextQuestion"
                    :loading="loading"
                    @previous-question="previousQuestion"
                    @next-question="nextQuestion"
                />

                <!-- Rating Containers -->
                <div class="rating-containers-section">
                    <div class="rating-grid">
                        <RatingContainer
                            v-for="rating in [1,2,3,4,5]"
                            :key="rating"
                            :rating="rating"
                            :rating-label="getRatingLabel(rating)"
                            :rated-professors="getRatedProfessors(rating)"
                            :loading="loading"
                            @drop="onDrop"
                            @dragover="onDragOver"
                            @dragenter="onDragEnter"
                            @dragleave="onDragLeave"
                            @professor-drag-start="onDragStart"
                            @professor-drag-end="onDragEnd"
                        />
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="submit-button-container">
                    <Button
                        class="submit-button"
                        :disabled="!isFormValid || loading"
                        @click="submitSurvey"
                        label="Отправить анкету"
                    />
                </div>
            </div>
        </div>
    </template>

    <Toast />
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useProfessorStore } from '@/stores/professorStore';
import { useStudentStore } from '@/stores/studentStore';
import { useSurveyTokenStore } from '@/stores/surveyTokenStore';
import { getProfessorImage } from '@/utils/professorUtils';
import { SurveyService } from '@/service/SurveyService';
import { SurveyAccessService } from '@/service/SurveyAccessService';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';

// Import custom components
import ProfessorsList from '@/components/ProfessorsList.vue';
import RatingContainer from '@/components/RatingContainer.vue';
import QuestionDisplay from '@/components/QuestionDisplay.vue';
import axios from 'axios';

const router = useRouter();
const toast = useToast();
const professorStore = useProfessorStore();
const studentStore = useStudentStore();
const surveyTokenStore = useSurveyTokenStore();

// Get the selected professor from the store
const selectedProfessor = computed(() => professorStore.selectedProfessor);

// State for questions and responses
const questions = ref([]);
const loading = ref(false);
const error = ref(null);
const responses = reactive({});

// Drag and drop functionality
const currentQuestionIndex = ref(0);
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value] || {});
const professorRatings = reactive({});
const draggedProfessor = ref(null);

// Fetch professors from the store
const professors = computed(() => professorStore.professors || []);

// Available professors (not yet rated for current question)
const availableProfessors = computed(() => {
  const questionId = currentQuestion.value.id;
  if (!questionId) return [];

  // Filter out professors that have already been rated for this question
  return professors.value.filter(professor => {
    return !professorRatings[questionId] ||
           !professorRatings[questionId][professor.id];
  });
});

// Check if we can proceed to the next question
const canProceedToNextQuestion = computed(() => {
  const questionId = currentQuestion.value.id;
  if (!questionId) return false;

  // We can proceed if all professors have been rated for this question
  return availableProfessors.value.length === 0;
});

// Fetch professors and store them in the professor store
const fetchProfessorsForSurvey = async () => {
  // Check if we have student info from the survey token store
  const studentInfo = surveyTokenStore.studentInfo || studentStore.formData;

  console.log('=== DEBUGGING PROFESSOR FETCH ===');
  console.log('Survey token store student info:', surveyTokenStore.studentInfo);
  console.log('Student store form data:', studentStore.formData);
  console.log('Final student info used:', studentInfo);

  if (!studentInfo) {
    console.warn("No student information available for fetching professors");
    error.value = "No student information available for fetching professors";
    return;
  }

  try {
    const { faculty, academicYear, studyMode } = studentInfo;

    console.log('Student info parameters:', { faculty, academicYear, studyMode });

    if (!academicYear) {
      throw new Error("Academic year is required");
    }

    console.log('Calling SurveyAccessService.getProfessorsByAssignment...');

    // Set loading state
    loading.value = true;
    error.value = null;

    // Use the new SurveyAccessService method
    const professors = await SurveyAccessService.getProfessorsByAssignment(studentInfo);

    console.log('API response - professors:', professors);

    // Store professors in the professor store
    professorStore.professors = professors;
    console.log('Professors stored in store:', professorStore.professors);
    console.log('Computed professors value:', professors.value);

  } catch (err) {
    console.error('Failed to fetch professors for survey:', err);
    error.value = `Failed to fetch professors: ${err.message}`;
    // Set empty array as fallback
    professorStore.professors = [];
  } finally {
    loading.value = false;
  }
};

// Fetch questions from the API
const fetchQuestions = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await SurveyService.getProfessorSurveyQuestions(1);
    // Sort questions by their order property
    questions.value = (data || []).sort((a, b) => a.order - b.order);

    console.log('Fetched questions:', questions.value);

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

// Check if the form is valid (all professors have been rated for all questions)
const isFormValid = computed(() => {
  // If still loading or there's an error, form is not valid
  if (loading.value || error.value) return false;

  // Check if all professors have been rated for all questions
  return questions.value.every(question => {
    const questionRatings = professorRatings[question.id] || {};
    return professors.value.every(professor =>
      questionRatings[professor.id] !== undefined
    );
  });
});

// Submit the survey
const submitSurvey = async () => {
  if (!isFormValid.value) return;

  try {
    console.log('=== SURVEY SUBMISSION START ===');

    // Validate required data using store validation method
    const validation = surveyTokenStore.validateSubmissionData();
    console.log('Validation result:', validation);

    if (!validation.isValid) {
      throw new Error(`Отсутствуют обязательные данные: ${validation.missingFields.join(', ')}`);
    }

    console.log('Survey context:', surveyTokenStore.getSurveyContext());

    // Format the responses for submission
    const formattedResponses = [];

    // For each question
    Object.entries(professorRatings).forEach(([questionId, ratings]) => {
      // For each professor rating
      Object.entries(ratings).forEach(([professorId, rating]) => {
        formattedResponses.push({
          questionId: parseInt(questionId),
          professorId: parseInt(professorId),
          content: rating.toString()
        });
      });
    });

    console.log('Formatted responses:', formattedResponses);
    console.log('Student info for submission:', surveyTokenStore.studentInfo);
    console.log('Survey ID for submission:', surveyTokenStore.surveyData.id);

    // Use the new token-based submission with surveyId
    const result = await SurveyAccessService.submitSurveyWithToken(
      surveyTokenStore.validatedToken,
      surveyTokenStore.surveyData.id,
      surveyTokenStore.studentInfo,
      formattedResponses
    );

    console.log('Submission result:', result);

    // Mark survey as submitted in the store
    surveyTokenStore.setSubmitted(result.hash || 'submitted');

    toast.add({
      severity: 'success',
      summary: 'Успешно',
      detail: 'Опрос успешно отправлен!',
      life: 5000
    });

    // Redirect to homepage after successful submission
    setTimeout(() => {
      router.push({ name: 'homepage' });
    }, 2000);

  } catch (err) {
    console.error('=== SURVEY SUBMISSION FAILED ===');
    console.error('Error details:', err);

    toast.add({
      severity: 'error',
      summary: 'Ошибка отправки',
      detail: err.message || 'Не удалось отправить опрос',
      life: 7000
    });
  }
};

// Fetch questions and professors when component is mounted
onMounted(async () => {
  // Check if user has completed the token validation and student info steps
  if (!surveyTokenStore.canProceedToProfessorSurvey()) {
    console.warn('Cannot proceed to professor survey. Redirecting to homepage.');
    router.push({ name: 'homepage' });
    return;
  }

  // First, ensure we have professors loaded
  await fetchProfessorsForSurvey();
  // Then fetch questions
  fetchQuestions();
});

// Drag-and-drop event handlers
const onDragStart = (event, professor) => {
  draggedProfessor.value = professor;
  event.dataTransfer.effectAllowed = 'move';
  // Add some styling to the dragged element
  event.target.classList.add('dragging');
};

const onDragEnd = (event) => {
  // Remove styling
  event.target.classList.remove('dragging');
  draggedProfessor.value = null;
};

const onDrop = (event, rating) => {
  event.preventDefault();

  if (!draggedProfessor.value) return;

  // Remove drag-over styling
  event.target.closest('.rating-container')?.classList.remove('drag-over');

  const questionId = currentQuestion.value.id;

  // Initialize the ratings object for this question if it doesn't exist
  if (!professorRatings[questionId]) {
    professorRatings[questionId] = {};
  }

  // Set the rating for this professor
  professorRatings[questionId][draggedProfessor.value.id] = rating;

  // Also update the responses object for submission
  responses[questionId] = { ...professorRatings[questionId] };

  // Reset the dragged professor
  draggedProfessor.value = null;
};

const onDropToSource = (event) => {
  event.preventDefault();

  if (!draggedProfessor.value) return;

  // Remove drag-over styling
  event.target.closest('.professors-list')?.classList.remove('drag-over');

  const questionId = currentQuestion.value.id;

  // Remove the rating for this professor
  if (professorRatings[questionId]) {
    delete professorRatings[questionId][draggedProfessor.value.id];
  }

  // Also update the responses object for submission
  responses[questionId] = { ...professorRatings[questionId] };

  // Reset the dragged professor
  draggedProfessor.value = null;
};

// Visual feedback for drag operations
const onDragOver = (event) => {
  event.preventDefault();
  event.target.closest('.rating-container')?.classList.add('drag-over');
};

const onDragEnter = (event) => {
  event.preventDefault();
  event.target.closest('.rating-container')?.classList.add('drag-over');
};

const onDragLeave = (event) => {
  event.preventDefault();
  // Only remove if we're actually leaving the container
  if (!event.target.closest('.rating-container')?.contains(event.relatedTarget)) {
    event.target.closest('.rating-container')?.classList.remove('drag-over');
  }
};

// Source list drag event handlers
const onDragOverSource = (event) => {
  event.preventDefault();
  event.target.closest('.professors-list')?.classList.add('drag-over');
};

const onDragEnterSource = (event) => {
  event.preventDefault();
  event.target.closest('.professors-list')?.classList.add('drag-over');
};

const onDragLeaveSource = (event) => {
  event.preventDefault();
  // Only remove if we're actually leaving the container
  if (!event.target.closest('.professors-list')?.contains(event.relatedTarget)) {
    event.target.closest('.professors-list')?.classList.remove('drag-over');
  }
};

const nextQuestion = () => {
    if (currentQuestionIndex.value < questions.value.length - 1) {
        currentQuestionIndex.value++;
    }
};

const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
    }
};

// Rating labels
const ratingLabels = {
  1: 'Очень плохо',
  2: 'Плохо',
  3: 'Нормально',
  4: 'Хорошо',
  5: 'Отлично'
};

const getRatingLabel = (rating) => {
  return ratingLabels[rating] || '';
};

// Get professors with a specific rating for the current question
const getRatedProfessors = (rating) => {
  const questionId = currentQuestion.value.id;
  if (!questionId || !professorRatings[questionId]) return [];

  return professors.value.filter(professor => {
    return professorRatings[questionId][professor.id] === rating;
  });
};
</script>

<style scoped>
/* ==========================================================================
   PROFESSOR SURVEY VIEW STYLES
   Following StudentInfoSurvey.vue structure and styling approach
   ========================================================================== */



/* State Components - Following StudentInfoSurvey card pattern */
.card.sub-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.5rem;
    background: var(--code-background);
}

.loading-text,
.error-text,
.no-data-text {
    margin: 0;
    text-align: center;
}

.error-text {
    color: #ef4444;
}

.retry-button {
    margin-top: 0.5rem;
}

/* Main Survey Layout Container */
.survey-layout-container {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-top: 0;
    min-height: calc(100vh - 100px);
}

/* Left Sidebar: Professors List */
.professors-sidebar {
    width: 100%;
    order: 1; /* Show at top on mobile */
    flex-shrink: 0;
}

/* Main Content Area */
.main-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    order: 2; /* Show below professors on mobile */
    background: var(--surface-card);
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid var(--surface-border);
}

/* Rating Containers Section */
.rating-containers-section {
    width: 100%;
    flex: 1;
}

/* Rating Grid - Responsive Layout */
.rating-grid {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    overflow-x: auto;
    overflow-y: visible;
    padding-bottom: 0.5rem;
    scroll-snap-type: x mandatory;
}

.rating-grid > * {
    scroll-snap-align: start;
    flex: 0 0 auto;
    min-width: 200px;
}

/* Submit Button Container */
.submit-button-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid var(--surface-border);
}

.submit-button {
    width: 100%;
    height: 3rem;
    max-width: 17.35rem;
    font-weight: 600;
    font-size: 1rem;
}

/* Loading Spinner */
.p-progress-spinner {
    margin: 0 auto;
}

/* Tablet and Desktop Layout (768px and up) */
@media (min-width: 768px) {
    .survey-layout-container {
        flex-direction: row;
        gap: 2rem;
        align-items: stretch;
        min-height: calc(100vh - 150px);
    }

    .professors-sidebar {
        flex: 0 0 150px;
        order: 1;
        height: auto;
        min-height: 600px;
        position: sticky;
        top: 1rem;
        align-self: flex-start;
    }

    .main-content-area {
        flex: 1;
        order: 2;
        min-width: 0;
        padding: 2rem;
    }

    .rating-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
        overflow: visible;
    }

    .rating-grid > * {
        min-width: auto;
        scroll-snap-align: none;
    }

    .submit-button {
        max-width: 20rem;
    }
}

/* Desktop Layout (1024px and up) */
@media (min-width: 1024px) {
    .survey-layout-container {
        gap: 3rem;
        min-height: calc(100vh - 120px);
    }

    .professors-sidebar {
        flex: 0 0 200px;
        min-height: 650px;
    }

    .main-content-area {
        padding: 2.5rem;
    }

    .rating-grid {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 1.25rem;
        overflow: visible;
    }

    .submit-button {
        max-width: 22rem;
        height: 3.5rem;
        font-size: 1.125rem;
    }
}

/* Large Desktop Layout (1280px and up) */
@media (min-width: 1280px) {
    .survey-layout-container {
        gap: 4rem;
        min-height: calc(100vh - 100px);
    }

    .professors-sidebar {
        flex: 0 0 250px;
        min-height: 700px;
    }

    .main-content-area {
        padding: 3rem;
    }

    .rating-grid {
        gap: 1.5rem;
    }

    .submit-button {
        max-width: 24rem;
    }
}
</style>
