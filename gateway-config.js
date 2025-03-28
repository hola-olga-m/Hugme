/**
 * Gateway Configuration for HugMeNow
 * 
 * This file defines all ports, endpoints, and service names
 * for the HugMeNow GraphQL gateway architecture.
 */

// Service Names
export const SERVICE_NAMES = {
  POSTGRAPHILE: 'PostGraphileAPI',
  CUSTOM_GATEWAY: 'CustomGraphQLGateway',
  SIMPLE_GATEWAY: 'SimpleGraphQLGateway',
  MESH_APOLLO: 'GraphQLMeshApollo',
  APOLLO_MESH: 'ApolloMeshGateway',
  ENHANCED_GATEWAY: 'EnhancedGraphQLGateway',
  HUGMENOW_APP: 'HugMeNowApp'
};

// Service Ports
export const SERVICE_PORTS = {
  POSTGRAPHILE: 3003,
  CUSTOM_GATEWAY: 5002, 
  SIMPLE_GATEWAY: 5000,
  MESH_APOLLO: 5001,
  APOLLO_MESH: 5003,
  ENHANCED_GATEWAY: 5004,
  HUGMENOW_APP: 3000
};

// Service Endpoints
export const SERVICE_ENDPOINTS = {
  POSTGRAPHILE: `http://localhost:${SERVICE_PORTS.POSTGRAPHILE}/postgraphile/graphql`,
  CUSTOM_GATEWAY: `http://localhost:${SERVICE_PORTS.CUSTOM_GATEWAY}/graphql`,
  SIMPLE_GATEWAY: `http://localhost:${SERVICE_PORTS.SIMPLE_GATEWAY}/graphql`,
  MESH_APOLLO: `http://localhost:${SERVICE_PORTS.MESH_APOLLO}/graphql`,
  APOLLO_MESH: `http://localhost:${SERVICE_PORTS.APOLLO_MESH}/graphql`,
  ENHANCED_GATEWAY: `http://localhost:${SERVICE_PORTS.ENHANCED_GATEWAY}/graphql`,
  HUGMENOW_APP: `http://localhost:${SERVICE_PORTS.HUGMENOW_APP}`
};

// Default client information
export const CLIENT_INFO = {
  VERSION: '1.0.0',
  PLATFORM: 'web',
  FEATURES: [
    'mood-tracking',
    'friend-moods',
    'theme-support',
    'streak-tracking'
  ]
};

// Export configuration
export default {
  services: SERVICE_NAMES,
  ports: SERVICE_PORTS,
  endpoints: SERVICE_ENDPOINTS,
  client: CLIENT_INFO
};