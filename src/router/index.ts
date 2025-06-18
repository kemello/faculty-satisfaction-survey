import AppLayout from "@/layout/AppLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import Homepage from "@/views/Homepage.vue";
import StudentInfoSurvey from "@/views/StudentInfoSurvey.vue";
import ProfessorSurvey from "@/views/ProfessorSurvey.vue";
import { useStudentStore } from "@/stores/studentStore";
import { useSurveyTokenStore } from "@/stores/surveyTokenStore";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: AppLayout,
            children: [
                {
                    path: "/",
                    name: "homepage",
                    component: Homepage,
                    meta: { showSidebar: false, requiresAuth: false }
                },
                {
                    path: "/student-info",
                    name: "student-info-survey",
                    component: StudentInfoSurvey,
                    meta: { showSidebar: false, requiresAuth: true },
                    beforeEnter: (to, from, next) => {
                        const surveyTokenStore = useSurveyTokenStore();

                        // Check if user has validated token
                        if (!surveyTokenStore.isTokenValidated) {
                            console.warn('Access denied: No validated token found. Redirecting to homepage.');
                            next({ name: 'homepage' });
                            return;
                        }

                        next();
                    }
                },
                {
                    path: "/professor-survey",
                    name: "professor-survey",
                    component: ProfessorSurvey,
                    meta: { showSidebar: true, requiresAuth: true },
                    beforeEnter: (to, from, next) => {
                        const surveyTokenStore = useSurveyTokenStore();
                        const studentStore = useStudentStore();

                        // Check if user can proceed to professor survey (token validated + student info completed)
                        if (surveyTokenStore.canProceedToProfessorSurvey()) {
                            next();
                            return;
                        }

                        // Legacy check for student form data (backward compatibility)
                        if (studentStore.formData) {
                            const { gender, academicYear, faculty, studyMode } = studentStore.formData;
                            if (gender && academicYear && faculty && studyMode) {
                                next();
                                return;
                            }
                        }

                        console.warn('Access denied: Survey flow not completed. Redirecting to homepage.');
                        next({ name: 'homepage' });
                    }
                },
                // Catch-all route for 404 handling
                {
                    path: "/:pathMatch(.*)*",
                    name: "not-found",
                    redirect: { name: "homepage" }
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
    const surveyTokenStore = useSurveyTokenStore();
    const studentStore = useStudentStore();

    // Handle page refresh on protected routes
    if (to.meta?.requiresAuth) {
        // For student-info-survey, check token validation
        if (to.name === 'student-info-survey' && !surveyTokenStore.isTokenValidated) {
            console.warn('Page refresh detected on student-info route without token. Redirecting to homepage.');
            next({ name: 'homepage' });
            return;
        }

        // For professor-survey, check complete flow or legacy data
        if (to.name === 'professor-survey') {
            if (!surveyTokenStore.canProceedToProfessorSurvey() && !studentStore.formData) {
                console.warn('Page refresh detected on professor-survey without proper flow. Redirecting to homepage.');
                next({ name: 'homepage' });
                return;
            }
        }
    }

    next();
});

export default router;
