<template>
    <div class="card">
        <Tabs value="0" scrollable>
            <TabList>
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
    users.value = professors[0].users;
});

</script>

<style scoped>
.p-tabs {
    //width: fit-content;
    //min-width: 150px;

}

.p-tablist {
    //flex-direction: column;
    //align-items: center;
    //width: fit-content;
    //min-width: 150px;
}

.card {
    //width: fit-content;
}
</style>
