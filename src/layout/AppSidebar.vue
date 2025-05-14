<template>
    <div class="layout-sidebar">
        <professor-list></professor-list>
    </div>
    <div class="layout-sidebar-mobile">
        <professor-list-mobile></professor-list-mobile>
    </div>
</template>

<script setup>
import ProfessorList from '../components/ProfessorList.vue';
import ProfessorListMobile from "@/components/ProfessorListMobile.vue";
</script>


<style lang="scss" scoped>

.layout-sidebar-mobile {
    display: none;
    width: 100%;
}
</style>
