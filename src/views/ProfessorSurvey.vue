<template>
    <div class="card">
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

        <!-- Drag and Drop Interface -->
        <template v-else>
            <div class="question-navigation flex justify-between mb-4">
                <Button
                    icon="pi pi-arrow-left"
                    @click="previousQuestion"
                    :disabled="currentQuestionIndex === 0"
                    class="p-button-rounded p-button-text"
                />
                <span class="question-counter">{{ currentQuestionIndex + 1 }} / {{ questions.length }}</span>
                <Button
                    icon="pi pi-arrow-right"
                    @click="nextQuestion"
                    :disabled="currentQuestionIndex === questions.length - 1 || !canProceedToNextQuestion"
                    class="p-button-rounded p-button-text"
                />
            </div>

            <!-- Current Question -->
            <div class="current-question card sub-card mb-4">
                <h3 class="text-xl font-bold mb-2">{{ currentQuestion.text }}</h3>
                <p class="text-sm text-gray-500 mb-4">Перетащите преподавателей в соответствующие категории оценок</p>
            </div>

            <!-- Drag and Drop Container -->
            <div class="drag-drop-container">
                <div class="rating-interface flex flex-col md:flex-row gap-4">
                    <!-- Available Professors List -->
                    <div class="professors-source flex-shrink-0" style="min-width: 300px;">
                        <div
                            class="professors-list"
                            @dragover.prevent="onDragOverSource"
                            @dragenter.prevent="onDragEnterSource"
                            @dragleave.prevent="onDragLeaveSource"
                            @drop="onDropToSource"
                        >
                            <h4>Преподаватели для оценки</h4>
                            <div class="overflow-auto" style="min-height: 25rem">
                                <div
                                    v-for="professor in availableProfessors"
                                    :key="professor.id"
                                    class="professor-item flex items-center p-2 mb-2 rounded cursor-move w-full"
                                    draggable="true"
                                    @dragstart="onDragStart($event, professor)"
                                    @dragend="onDragEnd"
                                >
                                    <img
                                        :src="getProfessorImage(professor)"
                                        :alt="professor.name"
                                        class="professor-item__avatar w-8 h-8 rounded-full mr-2"
                                    >
                                    <span class="professor-item__name">{{ professor.name }}</span>
                                </div>
                                <div v-if="availableProfessors.length === 0" class="empty-list-message">
                                    Все преподаватели оценены!<br>
                                    <small>Перетащите преподавателя сюда, чтобы убрать оценку</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Rating Containers -->
                    <div class="rating-containers flex-1 grid grid-cols-1 md:grid-cols-5 gap-2">
                        <div
                            v-for="rating in [1,2,3,4,5]"
                            :key="rating"
                            class="rating-container border-2 border-dashed p-2 rounded-lg shadow-sm transition-all duration-200 w-full"
                            :class="`rating-${rating}`"
                            @dragover.prevent="onDragOver"
                            @dragenter.prevent="onDragEnter"
                            @dragleave.prevent="onDragLeave"
                            @drop="onDrop($event, rating)"
                            style="min-height: 25rem"
                        >
                            <div class="rating-header border-b pb-2 text-center">
                                {{ rating }} {{ getRatingLabel(rating) }}
                            </div>
                            <div class="overflow-auto h-[calc(100%-2rem)]">
                                <div
                                    v-for="professor in getRatedProfessors(rating)"
                                    :key="professor.id"
                                    class="professor-item flex items-center p-2 mb-2 rounded w-full"
                                    draggable="true"
                                    @dragstart="onDragStart($event, professor)"
                                    @dragend="onDragEnd"
                                >
                                    <img
                                        :src="getProfessorImage(professor)"
                                        :alt="professor.name"
                                        class="professor-item__avatar w-8 h-8 rounded-full mr-2"
                                    >
                                    <span class="professor-item__name">{{ professor.name }}</span>
                                </div>
                                <div v-if="getRatedProfessors(rating).length === 0" class="empty-list-message">
                                    Перетащите сюда преподавателя
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
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
import { useStudentStore } from '@/stores/studentStore';
import { getProfessorImage } from '@/utils/professorUtils';
import { SurveyService } from '@/service/SurveyService';
import Toast from 'primevue/toast';
import ProgressSpinner from 'primevue/progressspinner';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
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
.sub-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface-card);
    padding: 1rem;
    border-radius: 0.5rem;
}

.sub-card p {
    font-size: 1rem;
    line-height: 1.5;
}

@media (min-width: 1280px) {
    .sub-card p {
        font-size: 1.25rem;
    }
}

@media (min-width: 1024px) {
    .sub-card p {
        font-size: 1.125rem;
    }
}

@media (min-width: 768px) {
    .sub-card p {
        font-size: 1rem;
    }
}

@media (max-width: 640px) {
    .sub-card p {
        font-size: 0.875rem;
    }
}

/* Center the loading spinner */
.p-progress-spinner {
    margin: 0 auto;
}

/* Drag and drop container */
.drag-drop-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

.rating-interface {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 768px) {
    .rating-interface {
        flex-direction: row;
    }
}

/* Professors source list */
.professors-list {
    background: var(--surface-card);
    border-radius: 0.5rem;
    padding: 1rem;
    border: 1px dashed var(--surface-border);
    min-height: 300px;
}

.professors-list h4 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
    color: var(--text-color);
}

.professors-list.drag-over {
    border-color: var(--primary-color);
    border-style: solid;
    background-color: var(--primary-50);
    transform: scale(1.02);
}

/* Rating containers */
.rating-containers {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
}

@media (min-width: 768px) {
    .rating-containers {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (max-width: 576px) {
    .rating-containers {
        grid-template-columns: repeat(2, 1fr);
    }
}

.rating-container {
    background: var(--surface-card);
    border-radius: 0.5rem;
    padding: 0.5rem;
    border: 2px dashed var(--surface-border);
    transition: all 0.2s ease-in-out;
    min-height: 200px;
}

.rating-container:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.rating-container.drag-over {
    transform: scale(1.05);
    box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.2);
    border-style: solid;
}

/* Rating headers */
.rating-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--surface-border);
    font-weight: 600;
    font-size: 0.875rem;
}

/* Professor items */
.professor-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
    cursor: move;
    background: var(--surface-ground);
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;
}

.professor-item:hover {
    transform: translateX(5px);
    background-color: var(--surface-hover);
}

/* Dragging state */
.professor-item.dragging {
    opacity: 0.5;
    transform: scale(0.95);
}

.professor-item__avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    flex-shrink: 0;
}

.professor-item__name {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--text-color);
}

/* Empty list message */
.empty-list-message {
    color: var(--text-color-secondary);
    font-style: italic;
    text-align: center;
    margin-top: 1rem;
    padding: 1rem;
}

/* Rating container colors */
.rating-1 { border-color: #ef4444 !important; }
.rating-2 { border-color: #f97316 !important; }
.rating-3 { border-color: #f59e0b !important; }
.rating-4 { border-color: #84cc16 !important; }
.rating-5 { border-color: #10b981 !important; }

/* Responsive adjustments */
@media (max-width: 768px) {
    .professor-item {
        font-size: 0.8rem;
    }

    .professor-item__avatar {
        width: 1.5rem;
        height: 1.5rem;
    }

    .rating-header {
        font-size: 0.75rem;
    }
}

/* Question navigation */
.question-navigation {
    background: var(--surface-card);
    padding: 1rem;
    border-radius: 0.5rem;
}

.question-counter {
    font-weight: bold;
    min-width: 80px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Current question styling */
.current-question h3 {
    color: var(--text-color);
    margin-bottom: 0.5rem;
}

.current-question p {
    color: var(--text-color-secondary);
    margin-bottom: 0;
}

/* Mobile-specific improvements */
@media (max-width: 768px) {
    .drag-drop-container {
        padding: 0.5rem;
    }

    .rating-interface {
        gap: 0.75rem;
    }

    .professors-source {
        min-width: unset !important;
        width: 100%;
    }

    .professors-list {
        min-height: 200px;
    }

    .rating-container {
        min-height: 150px;
    }

    .question-navigation {
        padding: 0.75rem;
    }

    .current-question {
        padding: 0.75rem;
    }

    .current-question h3 {
        font-size: 1.125rem;
    }
}

/* Touch device improvements */
@media (hover: none) and (pointer: coarse) {
    .professor-item {
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        min-height: 3rem;
    }

    .professor-item__avatar {
        width: 2.5rem;
        height: 2.5rem;
    }

    .professor-item__name {
        font-size: 1rem;
    }

    .rating-container {
        min-height: 180px;
        padding: 0.75rem;
    }

    .rating-header {
        font-size: 1rem;
        padding-bottom: 0.75rem;
        margin-bottom: 0.75rem;
    }
}

/* Accessibility improvements */
.professor-item:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

.rating-container:focus-within {
    border-color: var(--primary-color);
    border-style: solid;
}

/* Animation improvements */
.professor-item {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.rating-container {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.professors-list {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

<style scoped>
.professor-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

/* Instructions card */
.sub-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface-card);
    padding: 1rem;
    border-radius: 0.5rem;
}

/* Drag and drop container */
.drag-drop-container {
    width: 100%;
    max-width: 1200px;
}

.rating-interface {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

@media (min-width: 768px) {
    .rating-interface {
        flex-direction: row;
    }
}

/* Professors source list */
.professors-list {
    background: var(--surface-card);
    border-radius: 0.5rem;
    padding: 1rem;
    border: 1px dashed var(--surface-border);
    min-height: 300px;
}

.professors-list h4 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-align: center;
    color: var(--text-color);
}

/* Rating containers */
.rating-containers {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
}

@media (min-width: 768px) {
    .rating-containers {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (max-width: 576px) {
    .rating-containers {
        grid-template-columns: repeat(2, 1fr);
    }
}

.rating-container {
    background: var(--surface-card);
    border-radius: 0.5rem;
    padding: 0.5rem;
    border: 2px dashed var(--surface-border);
    transition: all 0.2s ease-in-out;
    min-height: 200px;
}

.rating-container:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.rating-container.drag-over {
    transform: scale(1.05);
    box-shadow: 0 15px 25px -5px rgba(0, 0, 0, 0.2);
    border-style: solid;
}

/* Rating headers */
.rating-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 0.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid var(--surface-border);
    font-weight: 600;
    font-size: 0.875rem;
}

/* Professor items */
.professor-item {
    display: flex;
    align-items: center;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
    cursor: move;
    background: var(--surface-ground);
    transition: all 0.2s ease-in-out;
    border: 1px solid transparent;
}

.professor-item:hover {
    transform: translateX(5px);
    background-color: var(--surface-hover);
}

/* Dragging state */
.professor-item.dragging {
    opacity: 0.5;
    transform: scale(0.95);
}

.professor-item__content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.professor-item__avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    flex-shrink: 0;
}

.professor-item__name {
    font-weight: 500;
    font-size: 0.875rem;
    color: var(--text-color);
}

/* Empty list message */
.empty-list-message {
    color: var(--text-color-secondary);
    font-style: italic;
    text-align: center;
    margin-top: 1rem;
    padding: 1rem;
}

/* Rating container colors */
.rating-1 { border-color: #ef4444 !important; }
.rating-2 { border-color: #f97316 !important; }
.rating-3 { border-color: #f59e0b !important; }
.rating-4 { border-color: #84cc16 !important; }
.rating-5 { border-color: #10b981 !important; }

/* Responsive adjustments */
@media (max-width: 768px) {
    .professor-item {
        font-size: 0.8rem;
    }

    .professor-item__avatar {
        width: 1.5rem;
        height: 1.5rem;
    }

    .rating-header {
        font-size: 0.75rem;
    }
}
</style>
