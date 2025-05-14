<template>
    <div class="layout-sidebar">
        <professor-list></professor-list>
    </div>
    <div class="layout-sidebar-mobile">
        <professor-list></professor-list>
    </div>
</template>

<script setup>
import ProfessorList from '../components/ProfessorList.vue';
</script>


<style lang="scss" scoped>

.layout-sidebar-mobile {
    display: none;
    width: 100%;
}
</style>
