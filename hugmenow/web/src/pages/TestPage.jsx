import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHugMoodAPI } from '../hooks/useHugMoodAPI';
import { gql } from '@apollo/client';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  color: #4a154b;
  margin-bottom: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
`;

const StatusLight = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${props => 
    props.status === 'success' ? '#10b981' : 
    props.status === 'error' ? '#ef4444' : 
    props.status === 'warning' ? '#f59e0b' : 
    '#9ca3af'
  };
`;

const Button = styled.button`
  background-color: #4a154b;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background-color: #3c1138;
  }
  
  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
  
  margin-right: 0.5rem;
`;

const Pre = styled.pre`
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

// GraphQL Query for testing
const TEST_QUERY = gql`
  query TestQuery {
    __typename
  }
`;

// Test authentication query
const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      name
      email
    }
  }
`;

const TestPage = () => {
  const { user, loading: authLoading, isAuthenticated, token } = useAuth();
  const hugmoodAPI = useHugMoodAPI();
  
  const [graphqlStatus, setGraphqlStatus] = useState('unknown');
  const [queryResult, setQueryResult] = useState(null);
  const [authResult, setAuthResult] = useState(null);
  const [error, setError] = useState(null);
  const [testing, setTesting] = useState(false);
  
  // Test basic GraphQL connection
  const testGraphQLConnection = async () => {
    setTesting(true);
    setError(null);
    
    try {
      const client = hugmoodAPI.client;
      if (!client) {
        throw new Error('Apollo client not initialized');
      }
      
      const result = await client.query({
        query: TEST_QUERY,
        fetchPolicy: 'network-only'
      });
      
      setGraphqlStatus('success');
      setQueryResult(result);
    } catch (err) {
      console.error('GraphQL connection test failed:', err);
      setGraphqlStatus('error');
      setError(err);
    } finally {
      setTesting(false);
    }
  };
  
  // Test authentication query
  const testAuthentication = async () => {
    setTesting(true);
    setError(null);
    
    try {
      const client = hugmoodAPI.client;
      if (!client) {
        throw new Error('Apollo client not initialized');
      }
      
      const result = await client.query({
        query: CURRENT_USER_QUERY,
        fetchPolicy: 'network-only'
      });
      
      setAuthResult(result);
    } catch (err) {
      console.error('Authentication test failed:', err);
      setError(err);
      setAuthResult({ error: err.message });
    } finally {
      setTesting(false);
    }
  };
  
  return (
    <Container>
      <Title>HugMeNow System Test Page</Title>
      
      <Card>
        <SectionTitle>System Status</SectionTitle>
        <Section>
          <div>
            <StatusLight status={authLoading ? 'pending' : isAuthenticated ? 'success' : 'warning'} />
            Authentication: {authLoading ? 'Checking...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </div>
          <div>
            <StatusLight status={graphqlStatus} />
            GraphQL: {graphqlStatus === 'unknown' ? 'Not Tested' : 
                     graphqlStatus === 'success' ? 'Connected' : 
                     graphqlStatus === 'error' ? 'Error' : 'Testing...'}
          </div>
        </Section>
        
        <Section>
          <SectionTitle>Auth State</SectionTitle>
          <div>
            <p><strong>Auth Loading:</strong> {String(authLoading)}</p>
            <p><strong>Is Authenticated:</strong> {String(isAuthenticated)}</p>
            <p><strong>Has Token:</strong> {String(!!token)}</p>
            <p><strong>Has User:</strong> {String(!!user)}</p>
            {user && (
              <Pre>{JSON.stringify(user, null, 2)}</Pre>
            )}
          </div>
        </Section>
        
        <Section>
          <SectionTitle>Tests</SectionTitle>
          <div>
            <Button onClick={testGraphQLConnection} disabled={testing}>
              Test GraphQL Connection
            </Button>
            <Button onClick={testAuthentication} disabled={testing}>
              Test Authentication
            </Button>
          </div>
          
          {error && (
            <>
              <p style={{ color: '#ef4444', marginTop: '1rem' }}><strong>Error:</strong></p>
              <Pre>{error.toString()}</Pre>
              {error.graphQLErrors && (
                <Pre>{JSON.stringify(error.graphQLErrors, null, 2)}</Pre>
              )}
              {error.networkError && (
                <Pre>{JSON.stringify(error.networkError, null, 2)}</Pre>
              )}
            </>
          )}
          
          {queryResult && (
            <>
              <p style={{ marginTop: '1rem' }}><strong>GraphQL Test Result:</strong></p>
              <Pre>{JSON.stringify(queryResult, null, 2)}</Pre>
            </>
          )}
          
          {authResult && (
            <>
              <p style={{ marginTop: '1rem' }}><strong>Authentication Test Result:</strong></p>
              <Pre>{JSON.stringify(authResult, null, 2)}</Pre>
            </>
          )}
        </Section>
      </Card>
    </Container>
  );
};

export default TestPage;