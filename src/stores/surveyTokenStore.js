import { defineStore } from 'pinia';

export const useSurveyTokenStore = defineStore('surveyToken', {
  state: () => ({
    // Token and survey information from validation
    validatedToken: null,
    surveyData: null,
    
    // Student information for the survey
    studentInfo: null,
    
    // Survey flow state
    isTokenValidated: false,
    isStudentInfoCompleted: false,
    
    // Submission tracking
    submissionHash: null,
    isSubmitted: false
  }),
  
  actions: {
    /**
     * Store validated token and survey information
     * @param {string} token - The validated token
     * @param {Object} survey - Survey data from validation
     */
    setValidatedToken(token, survey) {
      this.validatedToken = token;
      this.surveyData = survey;
      this.isTokenValidated = true;
      console.log('=== TOKEN VALIDATION STORE DEBUG ===');
      console.log('Token validated and stored:', { token, survey });
      console.log('Survey ID stored:', survey?.id);
      console.log('Survey name stored:', survey?.name);
    },
    
    /**
     * Store student information for survey submission
     * @param {Object} studentData - Student form data
     */
    setStudentInfo(studentData) {
      this.studentInfo = studentData;
      this.isStudentInfoCompleted = true;
      console.log('=== SURVEY TOKEN STORE DEBUG ===');
      console.log('Student info stored:', studentData);
      console.log('Store state after setting student info:', {
        validatedToken: this.validatedToken,
        surveyData: this.surveyData,
        studentInfo: this.studentInfo,
        isTokenValidated: this.isTokenValidated,
        isStudentInfoCompleted: this.isStudentInfoCompleted
      });
    },
    
    /**
     * Mark survey as submitted with hash
     * @param {string} hash - Submission hash from backend
     */
    setSubmitted(hash) {
      this.submissionHash = hash;
      this.isSubmitted = true;
      console.log('Survey marked as submitted with hash:', hash);
    },
    
    /**
     * Clear all survey token data (for new survey or logout)
     */
    clearSurveyData() {
      this.validatedToken = null;
      this.surveyData = null;
      this.studentInfo = null;
      this.isTokenValidated = false;
      this.isStudentInfoCompleted = false;
      this.submissionHash = null;
      this.isSubmitted = false;
      console.log('Survey token data cleared');
    },
    
    /**
     * Check if user can proceed to professor survey
     * @returns {boolean} True if token is validated and student info is completed
     */
    canProceedToProfessorSurvey() {
      return this.isTokenValidated && this.isStudentInfoCompleted && !this.isSubmitted;
    },
    
    /**
     * Get complete survey context for API calls
     * @returns {Object} Complete survey context
     */
    getSurveyContext() {
      return {
        token: this.validatedToken,
        surveyId: this.surveyData?.id,
        studentInfo: this.studentInfo,
        isValidated: this.isTokenValidated,
        isCompleted: this.isStudentInfoCompleted
      };
    },

    /**
     * Validate that all required data is present for submission
     * @returns {Object} Validation result with success flag and missing fields
     */
    validateSubmissionData() {
      const missing = [];

      if (!this.validatedToken) missing.push('validatedToken');
      if (!this.surveyData?.id) missing.push('surveyId');
      if (!this.studentInfo) missing.push('studentInfo');
      if (!this.studentInfo?.faculty) missing.push('faculty');
      if (!this.studentInfo?.academicYear) missing.push('academicYear');
      if (!this.studentInfo?.studyMode) missing.push('studyMode');
      if (!this.studentInfo?.gender) missing.push('gender');

      return {
        isValid: missing.length === 0,
        missingFields: missing,
        data: {
          token: this.validatedToken,
          surveyId: this.surveyData?.id,
          studentInfo: this.studentInfo
        }
      };
    }
  },
  
  getters: {
    /**
     * Check if survey flow is in progress
     * @returns {boolean} True if survey flow has started
     */
    isSurveyInProgress: (state) => {
      return state.isTokenValidated && !state.isSubmitted;
    },
    
    /**
     * Get current survey step
     * @returns {string} Current step in the survey flow
     */
    currentStep: (state) => {
      if (!state.isTokenValidated) return 'token-validation';
      if (!state.isStudentInfoCompleted) return 'student-info';
      if (!state.isSubmitted) return 'professor-survey';
      return 'completed';
    },
    
    /**
     * Get survey title for display
     * @returns {string} Survey title or default
     */
    surveyTitle: (state) => {
      return state.surveyData?.name || 'Опрос';
    }
  }
});
