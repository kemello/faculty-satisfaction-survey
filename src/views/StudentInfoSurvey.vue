<template>
    <!-- Loading State -->
    <StudentFormSkeleton v-if="loading" />

    <!-- Loaded Content -->
    <template v-else>
        <div class="card">
            <h1></h1>
            <div class="font-medium text-3xl mb-4 justify-center flex">Преподаватель глазами студента 2024-2025</div>

            <Fieldset legend="Ваш пол">
                <div class="card sub-card flex items-center justify-center">
                    <SelectButton v-model="gender" :options="genderOptions" optionLabel="name" optionValue="value"/>
                </div>
            </Fieldset>

            <Fieldset legend="Курс">
                <div class="card sub-card">
                    <div class="flex flex-col gap-4">
                        <div v-for="year in academicYears" :key="year.value" class="flex items-center gap-2">
                            <RadioButton :inputId="year.value" name="academicYear"
                                         :value="year.value" v-model="selectedAcademicYear"/>
                            <label :for="year.value">{{ year.name }}</label>
                        </div>
                    </div>
                </div>
            </Fieldset>

            <Fieldset legend="Направление на котором Вы обучаетесь">
                <div class="card sub-card">
                    <div class="flex flex-col gap-4">
                        <div v-for="faculty in faculties" :key="faculty.value" class="flex items-center gap-2">
                            <RadioButton :inputId="faculty.value" name="faculty"
                                         :value="faculty.value" v-model="selectedFaculty"/>
                            <label :for="faculty.value">{{ faculty.name }}</label>
                        </div>
                    </div>
                </div>
            </Fieldset>

            <Fieldset legend="Форма обучения">
                <div class="card sub-card">
                    <div class="flex flex-col gap-4">
                        <div v-for="mode in studyModes" :key="mode.value" class="flex items-center gap-2">
                            <RadioButton :inputId="mode.value" name="studyMode"
                                         :value="mode.value" v-model="selectedStudyMode"/>
                            <label :for="mode.value">{{ mode.name }}</label>
                        </div>
                    </div>
                </div>
            </Fieldset>

        </div>

        <div class="w-full flex items-center justify-center">
            <Button
                class="w-full h-12 max-w-[12rem] sm:max-w-[17.35rem] mx-auto"
                @click="submitForm"
                label="Отправить"
                :loading="submitting"
                :disabled="submitting"
            />
        </div>
    </template>

    <!-- Toast for notifications -->
    <Toast />
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {useRouter} from 'vue-router'; // Import useRouter
import {useStudentStore} from "@/stores/studentStore.js";
import {useSurveyTokenStore} from "@/stores/surveyTokenStore.js";
import StudentFormSkeleton from '@/components/skeletons/StudentFormSkeleton.vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const studentStore = useStudentStore();
const surveyTokenStore = useSurveyTokenStore();
const router = useRouter(); // Initialize router
const toast = useToast();

// Loading states
const loading = ref(true);
const submitting = ref(false);

const gender = ref("");
const genderOptions = ref([
    {name: "Мужской", value: "MALE"},
    {name: "Женский", value: "FEMALE"}
]);

const academicYears = ref([
    {name: "1 курс", value: "FIRST_YEAR"},
    {name: "2 курс", value: "SECOND_YEAR"},
    {name: "3 курс", value: "THIRD_YEAR"},
    {name: "4 курс", value: "FOURTH_YEAR"},
    {name: "5 курс", value: "FIFTH_YEAR"}
]);
const selectedAcademicYear = ref("");

const faculties = ref([
    {name: "Экономика", value: "ECONOMICS"},
    {name: "Менеджмент", value: "MANAGEMENT"},
    {name: "Туризм", value: "TOURISM"},
    {name: "Информационные системы и технологии", value: "IST"},
    {name: "Управление бизнесом", value: "BUSINESS_ADMINISTRATION"},
    {name: "Лечебное дело", value: "GENERAL_MEDICINE"}
]);
const selectedFaculty = ref("");

const studyModes = ref([
    {name: "Очное", value: "FULL_TIME"},
    {name: "Заочное", value: "PART_TIME"},
    {name: "Магистратура", value: "MASTERS"}
]);
const selectedStudyMode = ref("");

// Check if user has valid token and redirect if not
onMounted(() => {
    // Check if user came from token validation
    if (!surveyTokenStore.isTokenValidated) {
        console.warn('No validated token found. Redirecting to homepage.');
        router.push({ name: 'homepage' });
        return;
    }

    // Simulate initial loading
    setTimeout(() => {
        loading.value = false;
    }, 1000);
});

const submitForm = async () => {
    submitting.value = true;

    const formData = {
        gender: gender.value,
        academicYear: selectedAcademicYear.value,
        faculty: selectedFaculty.value,
        studyMode: selectedStudyMode.value
    };

    console.log('Form Data:', formData);

    try {
        // Store student information in the survey token store
        surveyTokenStore.setStudentInfo(formData);

        // Also store in legacy student store for backward compatibility
        studentStore.setStudentData(formData);

        // Navigate to professor survey with token-based flow
        await router.push({ name: 'professor-survey' });

        toast.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Информация сохранена. Переходим к оценке преподавателей.',
            life: 3000
        });

    } catch (error) {
        console.error('Error:', error);
        toast.add({
            severity: 'error',
            summary: 'Ошибка',
            detail: 'Не удалось сохранить информацию. Попробуйте еще раз.',
            life: 3000
        });
    } finally {
        submitting.value = false;
    }
};

</script>

<style>

.card.sub-card {
    @apply flex flex-col justify-center gap-2;
    background: var(--code-background);
}

.p-rating {
    position: unset;
}

.p-fieldset-legend-label {
    font-size: large;
    font-weight: normal !important;
}

</style>
