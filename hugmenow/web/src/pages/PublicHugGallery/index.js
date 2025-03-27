import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ANIMAL_HUG_ICONS, getAnimalHugTypeDescription } from '../../utils/animalsHugIcons';

/**
 * A simplified public version of the HugGalleryDemo page
 * Uses plain HTML/CSS instead of styled-components to avoid theme dependencies
 */
const PublicHugGallery = () => {
  const [selectedType, setSelectedType] = useState('fox');
  
  // Get hug types
  const hugTypes = Object.keys(ANIMAL_HUG_ICONS);
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#ffffff',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <h1 style={{
            fontSize: '1.5rem',
            color: '#4a90e2',
            margin: 0
          }}>HugMeNow</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '20px',
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto'
      }}>
        <div style={{
          padding: '16px',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Page Header */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{
              fontSize: '2rem',
              color: '#333',
              margin: '0 0 8px 0'
            }}>Hug Icon Gallery</h1>
            <p style={{
              fontSize: '1rem',
              color: '#666',
              margin: '0 0 16px 0'
            }}>
              Explore the different types of hugs available in the HugMeNow app.
              These icons are used throughout the application to represent different
              types of virtual hugs that you can send to friends and loved ones.
            </p>
          </div>
          
          {/* Icon Gallery */}
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#333',
              margin: '0 0 16px 0'
            }}>Hug Types</h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              {hugTypes.map(hugType => (
                <div 
                  key={hugType}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    cursor: 'pointer',
                    border: selectedType === hugType ? `2px solid ${ANIMAL_HUG_ICONS[hugType].color}` : '2px solid transparent'
                  }}
                  onClick={() => setSelectedType(hugType)}
                >
                  <img 
                    src={ANIMAL_HUG_ICONS[hugType].icon} 
                    alt={ANIMAL_HUG_ICONS[hugType].name}
                    style={{
                      width: '64px',
                      height: '64px'
                    }}
                  />
                  <h3 style={{
                    fontSize: '0.9rem',
                    color: '#333',
                    margin: '8px 0 0 0',
                    textAlign: 'center'
                  }}>{ANIMAL_HUG_ICONS[hugType].name}</h3>
                </div>
              ))}
            </div>
          </div>
          
          {/* Selected Hug Section */}
          <div style={{
            marginBottom: '32px',
            backgroundColor: '#f5f5f5',
            padding: '24px',
            borderRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              color: '#333',
              margin: '0 0 16px 0',
              textAlign: 'center'
            }}>Selected Hug Type</h2>
            
            <img 
              src={ANIMAL_HUG_ICONS[selectedType].icon} 
              alt={ANIMAL_HUG_ICONS[selectedType].name}
              style={{
                width: '80px',
                height: '80px',
                padding: '8px',
                backgroundColor: 'white',
                borderRadius: '50%',
                border: `2px solid ${ANIMAL_HUG_ICONS[selectedType].color}`
              }}
            />
            
            <div style={{
              marginTop: '16px',
              textAlign: 'center'
            }}>
              <h3 style={{
                fontSize: '1.2rem',
                color: '#333',
                margin: '0 0 8px 0'
              }}>{ANIMAL_HUG_ICONS[selectedType].name}</h3>
              <p style={{
                fontSize: '0.9rem',
                color: '#666',
                margin: 0
              }}>{getAnimalHugTypeDescription(selectedType)}</p>
            </div>
          </div>
          
          {/* Call to Action */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '24px'
          }}>
            <Link to="/login">
              <button style={{
                padding: '12px 24px',
                backgroundColor: '#4a90e2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Sign In to HugMeNow
              </button>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{
        backgroundColor: '#ffffff',
        padding: '16px',
        textAlign: 'center',
        boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <p style={{
          margin: 0,
          fontSize: '0.9rem',
          color: '#666'
        }}>© {new Date().getFullYear()} HugMeNow. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PublicHugGallery;