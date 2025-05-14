/**
 * Utility functions for professor-related operations
 */

/**
 * Get the image URL for a professor
 * @param {Object} professor - The professor object
 * @returns {string} - The image URL
 */
export const getProfessorImage = (professor) => {
  if (professor && professor.image) {
    return `https://primefaces.org/cdn/primevue/images/avatar/${professor.image}`;
  }
  return 'https://docs.gravatar.com/wp-content/uploads/2025/02/avatar-mysteryperson-20250210-256.png';
};