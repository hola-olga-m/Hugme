import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background-color: var(--background-color, #f9fafb);
`;

const ErrorCode = styled.h1`
  font-size: 6rem;
  color: var(--primary-color, #6366f1);
  margin: 0;
  line-height: 1;
`;

const ErrorTitle = styled.h2`
  font-size: 2rem;
  color: var(--text-color, #1f2937);
  margin: 1rem 0;
`;

const ErrorMessage = styled.p`
  font-size: 1.25rem;
  color: var(--text-secondary-color, #6b7280);
  max-width: 600px;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark-color, #4f46e5);
  }
`;

const SecondaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: var(--primary-color, #6366f1);
  border: 1px solid var(--primary-color, #6366f1);
  border-radius: 0.375rem;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--primary-color, #6366f1);
    color: white;
  }
`;

const ErrorPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <ErrorContainer>
      <ErrorCode>404</ErrorCode>
      <ErrorTitle>Page Not Found</ErrorTitle>
      <ErrorMessage>
        Sorry, we couldn't find the page you're looking for. It might have been removed, 
        renamed, or did not exist in the first place.
      </ErrorMessage>
      <ButtonContainer>
        <PrimaryButton to="/">Back to Home</PrimaryButton>
        <SecondaryButton onClick={handleGoBack}>Go Back</SecondaryButton>
      </ButtonContainer>
    </ErrorContainer>
  );
};

export default ErrorPage;