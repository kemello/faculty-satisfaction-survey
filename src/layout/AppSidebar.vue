<template>
    <div class="layout-sidebar">
        <!-- Sidebar content removed - professor selection now handled in ProfessorSurvey.vue -->
        <div class="sidebar-placeholder">
            <p>Professor selection is now integrated into the survey interface.</p>
        </div>
    </div>
    <div class="layout-sidebar-mobile">
        <!-- Mobile sidebar content removed - professor selection now handled in ProfessorSurvey.vue -->
        <div class="sidebar-placeholder">
            <p>Professor selection is now integrated into the survey interface.</p>
        </div>
    </div>
</template>

<script setup>
// No imports needed - professor selection is now handled in ProfessorSurvey.vue
</script>


<style lang="scss" scoped>
.layout-sidebar-mobile {
    display: none;
    width: 100%;
}

.sidebar-placeholder {
    padding: 1rem;
    text-align: center;
    color: var(--text-color-secondary);
    font-style: italic;
}

.sidebar-placeholder p {
    margin: 0;
    font-size: 0.875rem;
}
</style>
