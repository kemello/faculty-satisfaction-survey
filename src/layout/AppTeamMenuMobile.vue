<template>
    <div class="card">
        <Tabs value="0" scrollable>
            <TabList :pt="{
                root: { style: { justifyContent: 'space-around'} },
                content: { style: { flexGrow: '0' } }
            }">
                <Tab
                    v-for="user in users"
                    :key="user.id"
                    :value="user.id.toString()"
                    as="div"
                    class="flex items-center gap-2"
                >
                    <Avatar :image="`https://primefaces.org/cdn/primevue/images/avatar/${user.image}`" shape="circle"/>
                </Tab>
            </TabList>
        </Tabs>
    </div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {ProfessorService} from '@/service/ProfessorService.js';

const users = ref([]);

onMounted(() => {
    const professors = ProfessorService.getProfessors();
    users.value = professors[0].professors;
});

</script>

<style scoped>

</style>
