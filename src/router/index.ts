import AppLayout from "@/layout/AppLayout.vue";
import AppTeamMenu from "@/layout/AppTeamMenu.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: AppLayout
        },
        {
            path: "/team",
            component: AppTeamMenu
        }
    ]
});

export default router;