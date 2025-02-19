<template>
    <div class="card">
        <h1></h1>
        <div class="font-medium text-3xl mb-4 justify-center flex">Преподаватель глазами студента 2024-2025</div>

        <Fieldset legend="Ваш пол">
            <div class="card sub-card flex items-center justify-center">
                <SelectButton v-model="value" :options="options"/>
            </div>
        </Fieldset>


        <Fieldset legend="Курс">
            <div class="card sub-card">
                <div class="flex flex-col gap-4">
                    <div v-for="category in academicYears" :key="category.key" class="flex items-center gap-2">
                        <RadioButton :inputId="academicYears.key" name="dynamic"
                                     :value="category.name"/>
                        <label :for="category.key">{{ category.name }}</label>
                    </div>
                </div>
            </div>
        </Fieldset>

        <Fieldset legend="Направление на котором Вы обучаетесь">
            <div class="card sub-card">
                <div class="flex flex-col gap-4">
                    <div v-for="faculty in faculties" :key="faculty.key" class="flex items-center gap-2">
                        <RadioButton :inputId="faculty.key" name="dynamic"
                                     :value="faculty.name"/>
                        <label :for="faculty.key">{{ faculty.name }}</label>
                    </div>
                </div>
            </div>
        </Fieldset>

        <Fieldset legend="Форма обучения">
            <div class="card sub-card">
                <div class="flex flex-col gap-4">
                    <div v-for="studyMode in studyModes" :key="studyMode.key" class="flex items-center gap-2">
                        <RadioButton :inputId="studyMode.key" name="dynamic"
                                     :value="studyMode.name"/>
                        <label :for="studyMode.key">{{ studyMode.name }}</label>
                    </div>
                </div>
            </div>
        </Fieldset>


    </div>

    <div class="w-full flex items-center justify-center">
        <Button class="w-full h-12 max-w-[12rem] sm:max-w-[17.35rem] mx-auto" disabled alt="J" label="Отправить"/>
    </div>


</template>

<script setup>
import {ref} from 'vue';

const value = ref('One-Way');
const options = ref(['Мужской', 'Женский']);

const academicYears = ref([
    {name: '1 курс', key: 'A'},
    {name: '2 курс', key: 'M'},
    {name: '3 курс', key: 'P'},
    {name: '4 курс', key: 'R'},
    {name: '5 курс', key: 'R'}
]);

const faculties = ref([
    {name: 'Экономика', key: 'A'},
    {name: 'Менеджмент', key: 'M'},
    {name: 'Туризм', key: 'P'},
    {name: 'Информационные системы и\n' +
            'технологии', key: 'R'},
    {name: 'Управление бизнесом', key: 'R'},
    {name: 'Лечебное дело', key: 'R'}
]);

const studyModes = ref([
    {name: 'Очное', key: 'A'},
    {name: 'Заочное', key: 'M'},
    {name: 'Магистратура', key: 'P'}
]);


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
