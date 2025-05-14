import { ref, computed } from 'vue';
import axios from 'axios';
import { useStudentStore } from '@/stores/studentStore.js';
import { useProfessorStore } from '@/stores/professorStore.js';

export function useProfessors() {
  const professors = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const professorStore = useProfessorStore();

  // Use computed to access the selectedProfessor from the store
  const selectedProfessor = computed(() => professorStore.selectedProfessor);

  const fetchProfessors = async () => {
    const studentStore = useStudentStore();

    if (!studentStore.formData) {
      error.value = "No student information available";
      return;
    }

    loading.value = true;
    try {
      const { faculty, academicYear, studyMode } = studentStore.formData;

      console.log('Form data:', { faculty, academicYear, studyMode });

      // Check if academicYear is valid
      if (!academicYear) {
        throw new Error("Academic year is required");
      }

      const response = await axios.get('http://localhost:8080/api/professors/by-assignments', {
        params: { faculty, academicYear, studyMode }
      });

      professors.value = response.data || [];
      error.value = null;
    } catch (err) {
      console.error('Failed to fetch professors:', err);
      error.value = `Error loading professors: ${err.message}`;
      professors.value = [];
    } finally {
      loading.value = false;
    }
  };

  const selectProfessor = (professor) => {
    // Use the store's action to select a professor
    professorStore.selectProfessor(professor);
  };

  return {
    professors,
    loading,
    error,
    selectedProfessor,
    fetchProfessors,
    selectProfessor
  };
}
