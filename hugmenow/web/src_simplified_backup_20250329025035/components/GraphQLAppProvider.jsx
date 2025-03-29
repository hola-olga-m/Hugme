import React from 'react';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { onError } from "@apollo/client/link/error";

/**
 * GraphQLAppProvider Component
 * Configures and provides Apollo Client for GraphQL operations
 */
const GraphQLAppProvider = ({ children, options = {} }) => {
  const {
    httpUrl = '/graphql',
    wsUrl = 'ws://localhost:3002/graphql',
    useSubscriptions = true,
    defaultFetchPolicy = 'network-only'
  } = options;
  
  // This needs to be mutable, so we declare it separately
  let usePollFallback = options.usePollFallback || false;

  // Create an HTTP link for standard queries and mutations
  const httpLink = new HttpLink({
    uri: httpUrl,
    credentials: 'same-origin',
  });

  // Create an error link for better error handling
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      });
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  // Setup for WebSocket link if used
  let wsLink = null;
  if (useSubscriptions && wsUrl) {
    try {
      wsLink = new GraphQLWsLink(
        createClient({
          url: wsUrl,
          connectionParams: {
            // Add authentication if needed
            authToken: localStorage.getItem('authToken'),
          },
        })
      );
    } catch (error) {
      console.error('Failed to create WebSocket link:', error);
      // Fall back to polling if WebSocket setup fails
      usePollFallback = true;
    }
  }

  // Split traffic between HTTP and WebSocket links based on operation type
  let link;
  if (wsLink && useSubscriptions) {
    link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink
    );
  } else {
    link = httpLink;
  }

  // Create the Apollo Client
  const client = new ApolloClient({
    link: errorLink.concat(link),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: defaultFetchPolicy,
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: defaultFetchPolicy,
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
      // If WebSocket isn't available but we want real-time, use polling
      ...(usePollFallback && !wsLink ? { pollInterval: 10000 } : {}),
    },
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default GraphQLAppProvider;