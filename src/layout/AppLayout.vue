<template>
  <div class="layout-wrapper grid flex-wrap" :class="containerClass">
    <app-sidebar></app-sidebar>
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

const { layoutConfig, layoutState } = useLayout();


const containerClass = computed(() => {
  return {
    'layout-overlay': layoutConfig.menuMode === 'overlay',
    'layout-static': layoutConfig.menuMode === 'static',
    'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
    'layout-overlay-active': layoutState.overlayMenuActive,
    'layout-mobile-active': layoutState.staticMenuMobileActive
  };
});

</script>

<style scoped>
</style>
