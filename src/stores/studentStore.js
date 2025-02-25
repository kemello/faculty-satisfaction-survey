import { defineStore } from 'pinia';

export const useStudentStore = defineStore('student', {
  state: () => ({
    formData: null
  }),
  actions: {
    setStudentData(data) {
      this.formData = data;
    }
  }
});
