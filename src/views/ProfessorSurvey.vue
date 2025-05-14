<template>
    <div class="card">
        <Fieldset>
            <template #legend>
                <div class="flex items-center pl-2">
                    <Avatar :image="professorImage" shape="circle"/>
                    <span class="font-bold p-2">{{ professorName }}</span>
                </div>
            </template>
            <div class="card sub-card">
                <p class="m-0">
                    Ясное и доступное изложение учебного материала
                </p>
                <Rating v-model="value1">
                    <template #onicon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24"
                             width="24"/>
                    </template>
                    <template #officon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24"
                             width="24"/>
                    </template>
                </Rating>
            </div>
            <div class="card sub-card">
                <p class="m-0">
                    Умеет вызвать и поддержать интерес к предмету
                </p>
                <Rating v-model="value2">
                    <template #onicon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24"
                             width="24"/>
                    </template>
                    <template #officon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24"
                             width="24"/>
                    </template>
                </Rating>
            </div>
            <div class="card sub-card">
                <p class="m-0">
                    Вопросы на модулях, экзамене соответствуют содержанию аудиторных занятий
                </p>
                <Rating v-model="value3">
                    <template #onicon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24"
                             width="24"/>
                    </template>
                    <template #officon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24"
                             width="24"/>
                    </template>
                </Rating>
            </div>
            <div class="card sub-card">
                <p class="m-0">
                    Доброжелательность и тактичность в отношениях со студентами
                </p>
                <Rating v-model="value4">
                    <template #onicon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24"
                             width="24"/>
                    </template>
                    <template #officon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24"
                             width="24"/>
                    </template>
                </Rating>
            </div>
            <div class="card sub-card">
                <p class="m-0">
                    Объективность в оценке знаний студентов
                </p>
                <Rating v-model="value5">
                    <template #onicon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-onicon.png" height="24"
                             width="24"/>
                    </template>
                    <template #officon>
                        <img src="https://primefaces.org/cdn/primevue/images/rating/custom-officon.png" height="24"
                             width="24"/>
                    </template>
                </Rating>
            </div>
            <div class="card sub-card">
                <p class="m-0">
                    Дополнительные комментарии  и предложения
                </p>
                <Textarea placeholder="Your Message" :autoResize="true" class="w-full"/>
            </div>
        </Fieldset>
    </div>

    <div class="w-full flex items-center justify-center">
        <Button class="w-full h-12 max-w-[12rem] sm:max-w-[17.35rem] mx-auto" disabled alt="J" label="Отправить"/>
    </div>


</template>

<script setup>
import { ref, computed } from 'vue';
import { useProfessorStore } from '@/stores/professorStore';
import { getProfessorImage } from '@/utils/professorUtils';

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

const value1 = ref(null);
const value2 = ref(null);
const value3 = ref(null);
const value4 = ref(null);
const value5 = ref(null);
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

</style>
