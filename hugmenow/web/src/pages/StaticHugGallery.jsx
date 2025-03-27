import React from 'react';

/**
 * A completely static, isolated component with no dependencies
 * This avoids any circular reference issues
 */
const StaticHugGallery = () => {
  // Inline styles to avoid any styled-components dependencies
  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  };
  
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };
  
  const headingStyle = {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '0.5rem'
  };
  
  const subheadingStyle = {
    fontSize: '1rem',
    color: '#666'
  };
  
  const imageContainerStyle = {
    margin: '2rem 0',
    textAlign: 'center'
  };
  
  const imageStyle = {
    maxWidth: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)'
  };
  
  const captionStyle = {
    marginTop: '1rem',
    fontStyle: 'italic',
    color: '#666'
  };
  
  const footerStyle = {
    textAlign: 'center',
    marginTop: '2rem'
  };
  
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={headingStyle}>Human Hug Icons Gallery</h1>
        <p style={subheadingStyle}>Explore our collection of human-figured hug icons</p>
      </div>
      
      <div style={imageContainerStyle}>
        <img 
          src="/images/reference-hugs.png" 
          alt="Hug types reference grid" 
          style={imageStyle}
        />
        <p style={captionStyle}>
          Reference grid showing all hug types: Bear Hug, Supporting, Comforting, Loving, 
          Celebrating, Festive, Caring, Teasing, Inviting, and Moody
        </p>
      </div>
      
      <div style={footerStyle}>
        <p>This is a simplified version of the hug gallery. The full version will include individual icons and animations.</p>
      </div>
    </div>
  );
};

export default StaticHugGallery;