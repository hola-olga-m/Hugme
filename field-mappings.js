/**
 * Field Mappings for HugMeNow
 * 
 * This file defines mappings between fields in different APIs to ensure
 * correct translation of field names and types across services.
 */

// Define field-to-field mappings for each type
module.exports = {
  // Mapping for the Mood type
  Mood: {
    // Map score to intensity (from client to server)
    intensity: 'score'
  },
  // Mapping for the PublicMood type
  PublicMood: {
    // Map score to intensity (from client to server)
    intensity: 'score'
  },
  // Mapping for the HMNPublicMood type
  HMNPublicMood: {
    // Map score to intensity (from client to server)
    intensity: 'score'
  }
};