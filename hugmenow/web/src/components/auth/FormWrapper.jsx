
import React from 'react';
import styled from 'styled-components';

const FormWrapperContainer = styled.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;

const FormWrapper = ({ children }) => {
  return (
    <FormWrapperContainer>
      {children}
    </FormWrapperContainer>
  );
};

export default FormWrapper;
