import React, { useState, useEffect } from 'react';
import { useMeshSdk } from '../../hooks/useMeshSdk';

/**
 * Example component demonstrating how to use the Mesh SDK
 */
function MeshSdkExample() {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMood, setNewMood] = useState({ mood: 'HAPPY', intensity: 7, note: '', isPublic: true });
  
  // Get the Mesh SDK hook
  const sdk = useMeshSdk();
  
  // Load moods on component mount
  useEffect(() => {
    async function loadMoods() {
      try {
        setLoading(true);
        
        // Fetch public moods using the SDK
        const publicMoods = await sdk.getPublicMoods();
        
        if (publicMoods) {
          setMoods(publicMoods);
        }
      } catch (err) {
        console.error('Error fetching moods:', err);
        setError(err.message || 'Failed to load moods');
      } finally {
        setLoading(false);
      }
    }
    
    loadMoods();
  }, [sdk]);
  
  // Handle creating a new mood
  const handleCreateMood = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Create a new mood entry using the SDK
      const createdMood = await sdk.createMoodEntry(newMood);
      
      if (createdMood) {
        // Refresh the moods list
        const publicMoods = await sdk.getPublicMoods();
        setMoods(publicMoods);
        
        // Reset the form
        setNewMood({ mood: 'HAPPY', intensity: 7, note: '', isPublic: true });
      }
    } catch (err) {
      console.error('Error creating mood:', err);
      setError(err.message || 'Failed to create mood');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewMood(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  if (loading && moods.length === 0) {
    return <div className="loading">Loading moods...</div>;
  }
  
  if (error) {
    return <div className="error">Error: {error}</div>;
  }
  
  return (
    <div className="mesh-sdk-example">
      <h2>Mesh SDK Example</h2>
      
      {/* Create Mood Form */}
      <form onSubmit={handleCreateMood} className="create-mood-form">
        <h3>Create a New Mood</h3>
        
        <div className="form-group">
          <label htmlFor="mood">Mood:</label>
          <select 
            id="mood" 
            name="mood" 
            value={newMood.mood} 
            onChange={handleInputChange}
          >
            <option value="HAPPY">Happy</option>
            <option value="EXCITED">Excited</option>
            <option value="CALM">Calm</option>
            <option value="GRATEFUL">Grateful</option>
            <option value="PEACEFUL">Peaceful</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="intensity">Intensity (1-10):</label>
          <input 
            type="number" 
            id="intensity" 
            name="intensity" 
            min="1" 
            max="10" 
            value={newMood.intensity} 
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="note">Note:</label>
          <textarea 
            id="note" 
            name="note" 
            value={newMood.note} 
            onChange={handleInputChange}
            placeholder="What's making you feel this way?"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="isPublic">
            <input 
              type="checkbox" 
              id="isPublic" 
              name="isPublic" 
              checked={newMood.isPublic} 
              onChange={handleInputChange}
            />
            Make this mood public
          </label>
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Mood'}
        </button>
      </form>
      
      {/* Display Public Moods */}
      <div className="moods-list">
        <h3>Public Moods</h3>
        
        {moods.length === 0 ? (
          <p>No public moods found.</p>
        ) : (
          <ul>
            {moods.map(mood => (
              <li key={mood.id} className={`mood-item mood-${mood.mood.toLowerCase()}`}>
                <div className="mood-header">
                  <strong>{mood.userId ? `User ${mood.userId}` : 'Anonymous'}</strong>
                  <span className="mood-intensity">{mood.intensity}/10</span>
                </div>
                <div className="mood-content">
                  <span className="mood-type">{mood.mood}</span>
                  {mood.note && <p className="mood-note">{mood.note}</p>}
                </div>
                <div className="mood-footer">
                  <span className="mood-date">
                    {new Date(mood.createdAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MeshSdkExample;