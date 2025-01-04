<template>
    <div class="layout-sidebar">
        <app-team-menu></app-team-menu>
    </div>
    <div class="layout-sidebar-mobile">
        <app-team-menu-mobile></app-team-menu-mobile>
    </div>
</template>

<script setup>
import AppTeamMenu from './AppTeamMenu.vue';
import AppTeamMenuMobile from "@/layout/AppTeamMenuMobile.vue";
</script>


<style lang="scss" scoped>

.layout-sidebar-mobile {
  display: none;
}
</style>
