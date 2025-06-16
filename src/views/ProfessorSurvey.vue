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
        <!-- Survey Header -->
        <div class="card">
            <div class="survey-title">Оценка преподавателей</div>

            <!-- Question Navigation -->
            <QuestionNavigation
                :current-question-index="currentQuestionIndex"
                :total-questions="questions.length"
                :can-proceed="canProceedToNextQuestion"
                @previous-question="previousQuestion"
                @next-question="nextQuestion"
            />
        </div>

        <!-- Main Survey Layout -->
        <div class="survey-layout-container">
            <!-- Left Sidebar: Professors List -->
            <div class="professors-sidebar">
                <ProfessorsList
                    :available-professors="availableProfessors"
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
                <!-- Question Display -->
                <QuestionDisplay
                    :question-text="currentQuestion.text"
                    :instruction-text="'Перетащите преподавателей в соответствующие категории оценок'"
                    legend-text="Текущий вопрос"
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
                            @drop="onDrop"
                            @dragover="onDragOver"
                            @dragenter="onDragEnter"
                            @dragleave="onDragLeave"
                            @professor-drag-start="onDragStart"
                            @professor-drag-end="onDragEnd"
                        />
                    </div>
                </div>
            </div>
        </div>
    </template>

    <!-- Submit Button -->
    <div class="w-full flex items-center justify-center">
        <Button
            class="w-full h-12 max-w-[12rem] sm:max-w-[17.35rem] mx-auto"
            :disabled="!isFormValid || loading"
            @click="submitSurvey"
            label="Отправить анкету"
        />
    </div>

    <Toast />
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue';
import { useProfessorStore } from '@/stores/professorStore';
import { useStudentStore } from '@/stores/studentStore';
import { getProfessorImage } from '@/utils/professorUtils';
import { SurveyService } from '@/service/SurveyService';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import Fieldset from 'primevue/fieldset';
import { useToast } from 'primevue/usetoast';

// Import custom components
import QuestionNavigation from '@/components/QuestionNavigation.vue';
import ProfessorsList from '@/components/ProfessorsList.vue';
import RatingContainer from '@/components/RatingContainer.vue';
import QuestionDisplay from '@/components/QuestionDisplay.vue';
import axios from 'axios';

const toast = useToast();
const professorStore = useProfessorStore();
const studentStore = useStudentStore();

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
  if (!studentStore.formData) {
    console.warn("No student information available for fetching professors");
    return;
  }

  try {
    const { faculty, academicYear, studyMode } = studentStore.formData;

    if (!academicYear) {
      throw new Error("Academic year is required");
    }

    const response = await axios.get('http://localhost:8080/api/professors/by-assignments', {
      params: { faculty, academicYear, studyMode }
    });

    // Store professors in the professor store
    professorStore.professors = response.data || [];
    console.log('Professors loaded for survey:', professorStore.professors);
  } catch (err) {
    console.error('Failed to fetch professors for survey:', err);
    // Set empty array as fallback
    professorStore.professors = [];
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

    const surveyData = {
      surveyId: 1,
      responses: formattedResponses
    };

    console.log('Submitting survey data:', surveyData);

    const response = await fetch('http://localhost:8080/api/surveys/assign-responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to submit survey: ${response.status} ${errorText}`);
    }

    toast.add({ severity: 'success', summary: 'Success', detail: 'Survey submitted successfully', life: 3000 });
  } catch (err) {
    console.error('Failed to submit survey:', err);
    toast.add({ severity: 'error', summary: 'Error', detail: `Failed to submit survey: ${err.message}`, life: 3000 });
  }
};

// Fetch questions and professors when component is mounted
onMounted(async () => {
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

/* Survey Title - Following StudentInfoSurvey pattern */
.survey-title {
    font-weight: 500;
    font-size: 1.875rem;
    margin-bottom: 1rem;
    justify-content: center;
    display: flex;
}

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
    margin-top: 1.5rem;
}

/* Left Sidebar: Professors List */
.professors-sidebar {
    width: 100%;
    order: 2;
}

/* Main Content Area */
.main-content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    order: 1;
}

/* Rating Containers Section */
.rating-containers-section {
    width: 100%;
}

/* Rating Grid - Responsive Layout */
.rating-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    width: 100%;
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
        align-items: flex-start;
    }

    .professors-sidebar {
        flex: 0 0 350px;
        order: 1;
        height: calc(100vh - 300px);
        min-height: 500px;
        position: sticky;
        top: 1rem;
    }

    .main-content-area {
        flex: 1;
        order: 2;
        min-width: 0;
    }

    .rating-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1rem;
    }
}

/* Desktop Layout (1024px and up) */
@media (min-width: 1024px) {
    .survey-layout-container {
        gap: 3rem;
    }

    .professors-sidebar {
        flex: 0 0 400px;
    }

    .rating-grid {
        grid-template-columns: repeat(5, 1fr);
        gap: 1.25rem;
    }
}

/* Large Desktop Layout (1280px and up) */
@media (min-width: 1280px) {
    .survey-layout-container {
        gap: 4rem;
    }

    .professors-sidebar {
        flex: 0 0 450px;
    }

    .rating-grid {
        gap: 1.5rem;
    }
}
</style>
