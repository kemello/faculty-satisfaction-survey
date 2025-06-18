import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export class SurveyAccessService {
  /**
   * Fetch all active surveys
   * @returns {Promise<Array>} Array of active surveys
   */
  static async getActiveSurveys() {
    try {
      const response = await axios.get(`${API_BASE_URL}/surveys/active`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to fetch active surveys:', error);
      throw new Error(`Failed to fetch active surveys: ${error.message}`);
    }
  }

  /**
   * Validate survey access token
   * @param {string} token - The access token
   * @param {number} surveyId - The survey ID
   * @returns {Promise<boolean>} True if token is valid
   */
  static async validateToken(token, surveyId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/survey-tokens/validate`, {
        token: token.toUpperCase(), // Convert to uppercase as specified
        surveyId: surveyId
      });
      
      // 204 No Content indicates success
      return response.status === 204;
    } catch (error) {
      console.error('Token validation failed:', error);
      
      // Handle specific error cases
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data?.message || error.response.data || 'Invalid token';
        throw new Error(errorMessage);
      }
      
      throw new Error(`Token validation failed: ${error.message}`);
    }
  }

  /**
   * Format survey dates for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  static formatDate(dateString) {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  }

  /**
   * Submit survey with token and student information
   * @param {string} token - The validated token
   * @param {number} surveyId - The survey ID
   * @param {Object} studentInfo - Student information
   * @param {Array} responses - Survey responses
   * @returns {Promise<Object>} Submission result with hash
   */
  static async submitSurveyWithToken(token, surveyId, studentInfo, responses) {
    try {
      console.log('=== SURVEY SUBMISSION DEBUG ===');
      console.log('Token:', token);
      console.log('Survey ID:', surveyId);
      console.log('Student Info:', studentInfo);
      console.log('Responses:', responses);

      const payload = {
        token: token.toUpperCase(),
        surveyId: surveyId,
        faculty: studentInfo.faculty,
        academicYear: studentInfo.academicYear,
        studyMode: studentInfo.studyMode,
        gender: studentInfo.gender,
        responses: responses
      };

      console.log('Final payload being sent:', payload);

      const response = await axios.post(`${API_BASE_URL}/survey-tokens/submit`, payload);

      console.log('Submission successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('=== SURVEY SUBMISSION ERROR ===');
      console.error('Error object:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      let errorMessage = 'Submission failed';

      if (error.response) {
        // Handle different error response formats
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
          } else if (error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.data.error) {
            errorMessage = error.response.data.error;
          } else if (error.response.data.errors) {
            // Handle validation errors
            const validationErrors = error.response.data.errors;
            if (Array.isArray(validationErrors)) {
              errorMessage = validationErrors.map(err => err.defaultMessage || err.message || err).join(', ');
            } else {
              errorMessage = Object.values(validationErrors).join(', ');
            }
          } else {
            errorMessage = JSON.stringify(error.response.data);
          }
        } else {
          errorMessage = `HTTP ${error.response.status}: ${error.response.statusText}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  }

  /**
   * Fetch professors based on student assignment
   * @param {Object} studentInfo - Student information for filtering
   * @returns {Promise<Array>} Array of assigned professors
   */
  static async getProfessorsByAssignment(studentInfo) {
    try {
      console.log('=== API CALL DEBUG ===');
      console.log('API Base URL:', API_BASE_URL);
      console.log('Student info for API call:', studentInfo);

      const apiUrl = `${API_BASE_URL}/professors/by-assignment`;
      const params = {
        faculty: studentInfo.faculty,
        academicYear: studentInfo.academicYear,
        studyMode: studentInfo.studyMode
      };

      console.log('Full API URL:', apiUrl);
      console.log('API Parameters:', params);

      const response = await axios.get(apiUrl, { params });

      console.log('API Response status:', response.status);
      console.log('API Response data:', response.data);

      return response.data || [];
    } catch (error) {
      console.error('=== API ERROR ===');
      console.error('Error details:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      // Try the alternative endpoint (plural) as fallback
      try {
        console.log('Trying alternative endpoint: /professors/by-assignments');
        const fallbackResponse = await axios.get(`${API_BASE_URL}/professors/by-assignments`, {
          params: {
            faculty: studentInfo.faculty,
            academicYear: studentInfo.academicYear,
            studyMode: studentInfo.studyMode
          }
        });

        console.log('Fallback API Response:', fallbackResponse.data);
        return fallbackResponse.data || [];
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
        throw new Error(`Failed to fetch professors: ${error.message}`);
      }
    }
  }

  /**
   * Check if survey is currently active
   * @param {Object} survey - Survey object with startDate and endDate
   * @returns {boolean} True if survey is active
   */
  static isSurveyActive(survey) {
    if (!survey.startDate || !survey.endDate) return false;

    const now = new Date();
    const startDate = new Date(survey.startDate);
    const endDate = new Date(survey.endDate);

    return now >= startDate && now <= endDate;
  }
}
