<template>
  <div class="layout-wrapper" :class="containerClass">
    <!-- Conditionally render the sidebar -->
    <app-sidebar v-if="shouldShowSidebar"></app-sidebar>
    <div class="layout-main-container">
      <div class="layout-main">
        <router-view></router-view>
      </div>
    </div>
<!--    <div class="layout-mask animate-fadein"></div>-->
  </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';
import AppSidebar from "@/layout/AppSidebar.vue";
import { useRoute } from 'vue-router';

const { layoutConfig, layoutState } = useLayout();
const route = useRoute();

const containerClass = computed(() => {
  return {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive
  };
});

// Computed property to determine if the sidebar should be shown
const shouldShowSidebar = computed(() => {
  return route.meta.showSidebar;
});
</script>

<style scoped>
</style>