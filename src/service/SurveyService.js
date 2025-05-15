/**
 * Service for fetching survey questions from the API
 */

export const SurveyService = {
  /**
   * Fetch student info survey questions from the API
   * @returns {Promise<Object>} - The survey questions data
   */
  getStudentInfoQuestions: async () => {
    try {
      const response = await fetch('http://localhost:8080/api/surveys/student-info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch survey questions: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching survey questions:', error);
      throw error;
    }
  },

  /**
   * Fetch professor survey questions from the API
   * @param {number} professorId - The ID of the professor
   * @returns {Promise<Array>} - The professor survey questions
   */
  getProfessorSurveyQuestions: async (professorId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/surveys/professor/${professorId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch professor survey questions: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching professor survey questions:', error);

      // For development/testing purposes, return mock data if API call fails
      console.warn('Using mock data for professor survey questions');

      // Mock data with different question types
      return [
        { 
          id: 1, 
          text: 'Ясное и доступное изложение учебного материала', 
          questionType: 'RATING',
          questionCategory: 'FOR_PROFESSOR',
          order: 1
        },
        { 
          id: 2, 
          text: 'Умеет вызвать и поддержать интерес к предмету', 
          questionType: 'RATING',
          questionCategory: 'FOR_PROFESSOR',
          order: 2
        },
        { 
          id: 3, 
          text: 'Вопросы на модулях, экзамене соответствуют содержанию аудиторных занятий', 
          questionType: 'RATING',
          questionCategory: 'FOR_PROFESSOR',
          order: 3
        },
        { 
          id: 4, 
          text: 'Доброжелательность и тактичность в отношениях со студентами', 
          questionType: 'RATING',
          questionCategory: 'FOR_PROFESSOR',
          order: 4
        },
        { 
          id: 5, 
          text: 'Объективность в оценке знаний студентов', 
          questionType: 'RATING',
          questionCategory: 'FOR_PROFESSOR',
          order: 5
        },
        { 
          id: 6, 
          text: 'Как вы оцениваете качество преподавания?', 
          questionType: 'SINGLE_CHOICE',
          questionCategory: 'FOR_PROFESSOR',
          order: 6,
          options: [
            { id: 1, text: 'Отлично', value: 'EXCELLENT' },
            { id: 2, text: 'Хорошо', value: 'GOOD' },
            { id: 3, text: 'Удовлетворительно', value: 'SATISFACTORY' },
            { id: 4, text: 'Неудовлетворительно', value: 'UNSATISFACTORY' }
          ]
        },
        { 
          id: 7, 
          text: 'Какие аспекты преподавания вы считаете наиболее важными?', 
          questionType: 'MULTIPLE_CHOICE',
          questionCategory: 'FOR_PROFESSOR',
          order: 7,
          options: [
            { id: 5, text: 'Ясность изложения', value: 'CLARITY' },
            { id: 6, text: 'Интерактивность занятий', value: 'INTERACTIVITY' },
            { id: 7, text: 'Практическая применимость', value: 'PRACTICALITY' },
            { id: 8, text: 'Доступность материалов', value: 'ACCESSIBILITY' },
            { id: 9, text: 'Объективность оценивания', value: 'FAIR_GRADING' }
          ]
        },
        { 
          id: 8, 
          text: 'Дополнительные комментарии и предложения', 
          questionType: 'TEXT',
          questionCategory: 'FOR_PROFESSOR',
          order: 8
        }
      ];
    }
  }
};
