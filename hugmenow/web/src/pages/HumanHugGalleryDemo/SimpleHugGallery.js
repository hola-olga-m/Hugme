import React from 'react';
import styled from 'styled-components';

// Page container
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    color: #666;
  }
`;

const ReferenceImage = styled.div`
  margin: 2rem 0;
  text-align: center;
  
  img {
    max-width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  p {
    margin-top: 1rem;
    font-style: italic;
    color: #666;
  }
`;

/**
 * A very simplified version of the Human Hug Gallery that just shows the reference image
 * This avoids any potential circular dependencies or complex component interactions
 */
const SimpleHugGallery = () => {
  return (
    <PageContainer>
      <Header>
        <h1>Human Hug Icons Gallery</h1>
        <p>Explore our collection of human-figured hug icons</p>
      </Header>
      
      <ReferenceImage>
        <img src="/images/reference-hugs.png" alt="Hug types reference grid" />
        <p>Reference grid showing all hug types: Bear Hug, Supporting, Comforting, Loving, Celebrating, Festive, Caring, Teasing, Inviting, and Moody</p>
      </ReferenceImage>
      
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <p>This is a simplified version of the hug gallery. The full version will include individual icons and animations.</p>
      </div>
    </PageContainer>
  );
};

export default SimpleHugGallery;