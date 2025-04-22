<template>
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
        <Button class="w-full h-12 max-w-[12rem] sm:max-w-[17.35rem] mx-auto" @click="submitForm" label="Отправить"/>
    </div>


</template>

<script setup>
import {ref} from 'vue';
import {useRouter} from 'vue-router'; // Import useRouter
import {useStudentStore} from "@/stores/studentStore.js";

const studentStore = useStudentStore();

const router = useRouter(); // Initialize router

const gender = ref("");
const genderOptions = ref([
    {name: "Мужской", value: "MALE"},
    {name: "Женский", value: "FEMALE"}
]);

const academicYears = ref([
    {name: "1 курс", value: "0"},
    {name: "2 курс", value: "1"},
    {name: "3 курс", value: "2"},
    {name: "4 курс", value: "3"},
    {name: "5 курс", value: "4"}
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

const submitForm = async () => {
    const formData = {
        gender: gender.value,
        academicYear: selectedAcademicYear.value,
        faculty: selectedFaculty.value,
        studyMode: selectedStudyMode.value
    };

    console.log('Form Data:', formData); // Add this line

    try {
        const response = await fetch('http://localhost:8080/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        console.log("Response status:", response.status); // Debugging Log

        if (response.ok) {
            const result = await response.json();
            console.log('Success:', result);
            studentStore.setStudentData(formData);
            await router.push({name: 'professor-survey'}); // Redirect to ProfessorSurvey.vue
        } else {
            console.error('Error:', response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
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
