import { defineStore } from 'pinia';
import { ProfessorService } from '@/service/ProfessorService';

export const useProfessorStore = defineStore('professor', {
    state: () => ({
        professors: [],
        loading: false,
        error: null
    }),
    actions: {
        async fetchProfessors() {
            this.loading = true;
            try {
                this.professors = await ProfessorService.getProfessors();
                this.error = null;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        }
    }
});