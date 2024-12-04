<template>
    <div class="card">
        <Fieldset>
            <template #legend>
                <div class="flex items-center pl-2">
                    <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle"/>
                    <span class="font-bold p-2">Amy Elsner</span>
                </div>
            </template>
            <div class="card flex flex-col justify-center items-center bg-surface-800">
                <p class="m-0">
                    Степень доступности материала для понимания
                </p>
                <Rating v-model="value">
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
            <div class="card flex flex-col justify-center items-center bg-surface-800">
                <p class="m-0">
                    Степень доступности материала для понимания
                </p>
                <Rating v-model="value">
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
        </Fieldset>
    </div>

</template>

<script setup>
import {ref} from 'vue';

const value = ref(null);
</script>
