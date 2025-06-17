import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import StudentInfoSurvey from "@/views/StudentInfoSurvey.vue";
import ProfessorSurvey from "@/views/ProfessorSurvey.vue";
import { useStudentStore } from "@/stores/studentStore";

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
                    meta: { showSidebar: false, requiresAuth: false }
                },
                {
                    path: "/professor-survey",
                    name: "professor-survey",
                    component: ProfessorSurvey,
                    meta: { showSidebar: true, requiresAuth: true },
                    beforeEnter: (to, from, next) => {
                        const studentStore = useStudentStore();

                        // Check if student form data exists
                        if (!studentStore.formData) {
                            console.warn('Access denied: No student data found. Redirecting to main page.');
                            next({ name: 'student-info-survey' });
                            return;
                        }

                        // Validate required fields
                        const { gender, academicYear, faculty, studyMode } = studentStore.formData;
                        if (!gender || !academicYear || !faculty || !studyMode) {
                            console.warn('Access denied: Incomplete student data. Redirecting to main page.');
                            next({ name: 'student-info-survey' });
                            return;
                        }

                        next();
                    }
                },
                // Catch-all route for 404 handling
                {
                    path: "/:pathMatch(.*)*",
                    name: "not-found",
                    redirect: { name: "student-info-survey" }
                }
            ]
        },
        // Development test route
        {
            path: "/test",
            component: () => import("@/views/test.vue")
        }
    ]
});

// Global navigation guard for additional protection
router.beforeEach((to, from, next) => {
    const studentStore = useStudentStore();

    // Handle page refresh on professor-survey route
    if (to.name === 'professor-survey' && !studentStore.formData) {
        console.warn('Page refresh detected on protected route. Redirecting to main page.');
        next({ name: 'student-info-survey' });
        return;
    }

    next();
});

export default router;
