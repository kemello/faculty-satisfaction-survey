import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import StudentInfoSurvey from "@/views/StudentInfoSurvey.vue";
import ProfessorSurvey from "@/views/ProfessorSurvey.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: AppLayout,
            children: [
                {
                    path: "/",
                    name: "student-info-survey",
                    component: StudentInfoSurvey,
                    meta: { showSidebar: false }
                },
                {
                    path: "/professor-survey",
                    name: "professor-survey",
                    component: ProfessorSurvey,
                    meta: { showSidebar: true }
                },
                // {
                //     path: "/:pathMatch(.*)*",
                //     name: "not-found",
                //     component: () => import("@/views/NotFound.vue")
                // }
            ]
        },
        {
            path: "/team",
            component: () => import("@/components/ProfessorList.vue")
        },
        {
            path: "/test",
            component: () => import("@/views/test.vue")
        }
    ]
});

export default router;
