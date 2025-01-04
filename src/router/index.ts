import AppLayout from "@/layout/AppLayout.vue";
import AppTeamMenu from "@/layout/AppTeamMenu.vue";
import AppTopBar from "@/layout/AppTeamMenuMobile.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: AppLayout,
            children: [
                {
                    path: "/",
                    name: "professor-survey",
                    component: () => import("@/views/ProfessorSurvey.vue")
                },
            ]
        },
        {
            path: "/team",
            component: AppTeamMenu
        },
        {
            path: "/tabs",
            component: AppTopBar
        }
    ]
});

export default router;