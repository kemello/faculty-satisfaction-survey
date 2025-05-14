<template>
    <div class="professor-list">
        <!-- Loading State -->
        <div v-if="loading" class="p-4 text-blue-500">
            Loading professors...
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4 text-red-500">
            {{ error }}
        </div>

        <!-- Empty State -->
        <div v-else-if="professors.length === 0" class="p-4 text-gray-500">
            No professors found for your selection.
        </div>

        <!-- Professor List - Responsive design handled by CSS -->
        <ul v-else class="professor-list__content">
            <li
                v-for="professor in professors"
                :key="professor.id"
                :class="['professor-item', { 'professor-item--selected': selectedProfessor?.id === professor.id }]"
                @click="selectProfessor(professor)"
            >
                <div class="professor-item__content">
                    <img
                        :src="getProfessorImage(professor)"
                        :alt="professor.name"
                        class="professor-item__avatar"
                    />
                    <span class="professor-item__name">{{ professor.name }}</span>
                </div>
            </li>
        </ul>

        <!-- Mobile View - Only shown on small screens via CSS -->
        <div class="professor-list__mobile">
            <div class="card">

                <Tabs scrollable>
                    <TabList class="professor-list__tabs" :pt="{
                    root: { style: { justifyContent: 'space-around'} },
                    content: { style: { flexGrow: '0' } }
                }">
                        <Tab
                            v-for="professor in professors"
                            :key="professor.id"
                            :value="professor.id.toString()"
                            as="div"
                            class="professor-list__tab"
                            @click="selectProfessor(professor)"
                        >
                            <Avatar
                                :image="getProfessorImage(professor)"
                                shape="circle"
                                class="professor-list__avatar"
                            />
                        </Tab>
                    </TabList>
                </Tabs>

            </div>

        </div>

        <Toast/>
    </div>
</template>

<script setup>
import {onMounted} from 'vue';
import {useProfessors} from '@/composables/useProfessors';
import {getProfessorImage} from '@/utils/professorUtils';
import Toast from 'primevue/toast';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import Avatar from 'primevue/avatar';

// Use the professors composable
const {
    professors,
    loading,
    error,
    selectedProfessor,
    fetchProfessors,
    selectProfessor
} = useProfessors();

// Fetch professors on component mount
onMounted(() => {
    fetchProfessors();
});
</script>

<style scoped>
.professor-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

/* Main professor list - visible on desktop */
.professor-list__content {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
    margin: 0;
    list-style: none;
}

.professor-item {
    padding: 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid transparent;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
}

.professor-item:hover {
    background-color: #f5f5f5;
}

.professor-item--selected {
    border-color: #4f46e5;
}

.professor-item__content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.professor-item__avatar {
    width: 4rem;
    height: 4rem;
}

.professor-item__name {
    font-weight: bold;
    font-size: 1rem;
}

/* Mobile view - hidden by default, shown on small screens */
.professor-list__mobile {
    display: none;
    width: 100%;
}

.professor-list__tabs {
    display: flex;
    justify-content: space-around;
}

.professor-list__tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Responsive styles */
@media (min-width: 640px) {
    .professor-list__content {
        gap: 1rem;
    }
}

/* Apply responsive styles from _responsive.scss */
@media (max-width: 575px) {
    .professor-list__content {
        display: none;
    }

    .professor-list__mobile {
        display: block;
    }
}
</style>
