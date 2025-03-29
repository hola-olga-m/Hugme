
import React, { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import '../../styles/Settings.css';

const DataManagement = () => {
  const { user, logout } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  
  const [exportFormat, setExportFormat] = useState('json');
  const [exportStarted, setExportStarted] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);
  
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmInput, setConfirmInput] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  
  // Handle data export
  const handleExportData = () => {
    setExportStarted(true);
    setExportProgress(0);
    setExportComplete(false);
    
    // Simulate export process
    const interval = setInterval(() => {
      setExportProgress(prev => {
        const newProgress = prev + 10;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Generate and download file
          setTimeout(() => {
            generateExportFile();
            setExportComplete(true);
          }, 500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 300);
  };
  
  // Generate and download export file
  const generateExportFile = () => {
    // Dummy data for example
    const userData = {
      profile: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      moods: [
        {
          id: 'mood1',
          timestamp: Date.now() - 86400000,
          mood: 'happy',
          intensity: 8,
          note: 'Had a great day!'
        },
        {
          id: 'mood2',
          timestamp: Date.now() - 172800000,
          mood: 'relaxed',
          intensity: 6,
          note: 'Feeling calm today'
        }
      ],
      hugs: [
        {
          id: 'hug1',
          timestamp: Date.now() - 129600000,
          hugType: 'comfort',
          recipient: 'user123',
          message: 'Hope this brightens your day!'
        }
      ]
    };
    
    let dataStr, fileName, mimeType;
    
    // Format based on selection
    if (exportFormat === 'json') {
      dataStr = JSON.stringify(userData, null, 2);
      fileName = `hugmood_data_${user.username}_${new Date().toISOString().split('T')[0]}.json`;
      mimeType = 'application/json';
    } else {
      // CSV format (simplified)
      const moodsCsv = userData.moods.map(m => 
        `${new Date(m.timestamp).toISOString()},${m.mood},${m.intensity},${m.note}`
      ).join('\n');
      
      const hugsCsv = userData.hugs.map(h => 
        `${new Date(h.timestamp).toISOString()},${h.hugType},${h.recipient},${h.message}`
      ).join('\n');
      
      dataStr = `# HugMood Data Export for ${user.username}\n\n` +
                `# PROFILE\nid,username,email\n${user.id},${user.username},${user.email}\n\n` +
                `# MOODS\ntimestamp,mood,intensity,note\n${moodsCsv}\n\n` +
                `# HUGS\ntimestamp,hugType,recipient,message\n${hugsCsv}`;
      
      fileName = `hugmood_data_${user.username}_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    }
    
    // Create download link
    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Handle confirmation flow for destructive actions
  const initiateConfirmAction = (action) => {
    setConfirmAction(action);
    setConfirmInput('');
  };
  
  // Cancel confirmation
  const cancelConfirmAction = () => {
    setConfirmAction(null);
    setConfirmInput('');
  };
  
  // Handle actual action execution after confirmation
  const executeAction = () => {
    if (confirmInput !== 'confirm') {
      return;
    }
    
    setProcessingAction(true);
    
    // Handle different actions
    switch (confirmAction) {
      case 'clearMoods':
        // Simulate API call
        setTimeout(() => {
          setProcessingAction(false);
          setConfirmAction(null);
          alert('All mood data has been successfully cleared.');
        }, 1500);
        break;
        
      case 'clearHugs':
        // Simulate API call
        setTimeout(() => {
          setProcessingAction(false);
          setConfirmAction(null);
          alert('All hug history has been successfully cleared.');
        }, 1500);
        break;
        
      case 'deleteAccount':
        // Simulate API call
        setTimeout(() => {
          setProcessingAction(false);
          setConfirmAction(null);
          alert('Your account has been deleted. You will now be logged out.');
          // Log the user out
          logout();
        }, 2000);
        break;
        
      default:
        setProcessingAction(false);
        setConfirmAction(null);
    }
  };
  
  return (
    <div className={`settings-container data-management theme-${theme}`}>
      <div className="settings-header">
        <h2>Data Management</h2>
        <p>Control your data in the HugMood app.</p>
      </div>
      
      <div className="settings-section">
        <h3>Export Your Data</h3>
        <p className="section-description">
          Download a copy of all your mood entries, hug history, and account information.
        </p>
        
        <div className="export-options">
          <div className="option-group">
            <label>Format:</label>
            <div className="radio-options">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="json" 
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                />
                <span className="radio-text">JSON</span>
              </label>
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="exportFormat" 
                  value="csv" 
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                />
                <span className="radio-text">CSV</span>
              </label>
            </div>
          </div>
          
          <button 
            className="export-btn"
            onClick={handleExportData}
            disabled={exportStarted && !exportComplete}
          >
            {!exportStarted ? 'Export Data' : exportComplete ? 'Export Again' : 'Exporting...'}
          </button>
        </div>
        
        {exportStarted && !exportComplete && (
          <div className="export-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${exportProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">{exportProgress}% Complete</div>
          </div>
        )}
        
        {exportComplete && (
          <div className="export-complete">
            <i className="fas fa-check-circle"></i>
            <span>Export complete! Your file has been downloaded.</span>
          </div>
        )}
      </div>
      
      <div className="settings-section">
        <h3>Clear History</h3>
        <p className="section-description warning-text">
          <i className="fas fa-exclamation-triangle"></i>
          Warning: These actions cannot be undone. Deleted data cannot be recovered.
        </p>
        
        <div className="action-buttons">
          <button 
            className="danger-btn"
            onClick={() => initiateConfirmAction('clearMoods')}
          >
            <i className="fas fa-eraser"></i>
            Clear Mood History
          </button>
          <button 
            className="danger-btn"
            onClick={() => initiateConfirmAction('clearHugs')}
          >
            <i className="fas fa-ban"></i>
            Clear Hug Activity
          </button>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Account Deletion</h3>
        <p className="section-description warning-text">
          <i className="fas fa-exclamation-triangle"></i>
          Warning: This will permanently delete your account and all associated data. This action cannot be undone.
        </p>
        
        <button 
          className="danger-btn delete-account-btn"
          onClick={() => initiateConfirmAction('deleteAccount')}
        >
          <i className="fas fa-user-slash"></i>
          Delete My Account
        </button>
      </div>
      
      {confirmAction && (
        <div className="confirmation-overlay">
          <div className="confirmation-dialog">
            <div className="dialog-header">
              <h3>
                {confirmAction === 'clearMoods' && 'Clear Mood History'}
                {confirmAction === 'clearHugs' && 'Clear Hug Activity'}
                {confirmAction === 'deleteAccount' && 'Delete Account'}
              </h3>
              <button className="close-btn" onClick={cancelConfirmAction}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="dialog-content">
              <p className="warning-text">
                <i className="fas fa-exclamation-triangle"></i>
                {confirmAction === 'clearMoods' && 'Are you sure you want to delete all your mood history? This action cannot be undone.'}
                {confirmAction === 'clearHugs' && 'Are you sure you want to delete all your hug activity? This action cannot be undone.'}
                {confirmAction === 'deleteAccount' && 'Are you sure you want to permanently delete your account? All your data will be removed and this action cannot be undone.'}
              </p>
              
              <div className="confirm-input">
                <label>Type "confirm" to proceed:</label>
                <input 
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="confirm"
                />
              </div>
            </div>
            
            <div className="dialog-actions">
              <button className="cancel-btn" onClick={cancelConfirmAction} disabled={processingAction}>
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={executeAction}
                disabled={confirmInput !== 'confirm' || processingAction}
              >
                {processingAction ? (
                  <>
                    <span className="spinner-small"></span>
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataManagement;
