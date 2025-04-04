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
  SIMPLE_UNIFIED_GATEWAY: 'SimpleUnifiedGateway',
  SIMPLE_MESH_GATEWAY: 'SimpleMeshGateway',
  HUGMENOW_APP: 'HugMeNowApp'
};

// Service Ports
export const SERVICE_PORTS = {
  POSTGRAPHILE: 5003, // Changed from 3003 to avoid conflicts with individual workflow
  CUSTOM_GATEWAY: 5002, 
  SIMPLE_GATEWAY: 5005,
  MESH_APOLLO: 5001,
  APOLLO_MESH: 5008, // Changed from 5003 to avoid conflict with POSTGRAPHILE
  ENHANCED_GATEWAY: 5004,
  SIMPLE_UNIFIED_GATEWAY: 5007,
  SIMPLE_MESH_GATEWAY: 5009, // Changed from 5006 to avoid conflict with DIRECT_POSTGRES_PROXY
  HUGMENOW_APP: 3000,
  DIRECT_POSTGRES_PROXY: 5006 // Direct Postgres Proxy port
};

// Service Endpoints
export const SERVICE_ENDPOINTS = {
  POSTGRAPHILE: `http://localhost:${SERVICE_PORTS.POSTGRAPHILE}/postgraphile/graphql`,
  CUSTOM_GATEWAY: `http://localhost:${SERVICE_PORTS.CUSTOM_GATEWAY}/graphql`,
  SIMPLE_GATEWAY: `http://localhost:${SERVICE_PORTS.SIMPLE_GATEWAY}/graphql`,
  MESH_APOLLO: `http://localhost:${SERVICE_PORTS.MESH_APOLLO}/graphql`,
  APOLLO_MESH: `http://localhost:${SERVICE_PORTS.APOLLO_MESH}/graphql`,
  ENHANCED_GATEWAY: `http://localhost:${SERVICE_PORTS.ENHANCED_GATEWAY}/graphql`,
  SIMPLE_UNIFIED_GATEWAY: `http://localhost:${SERVICE_PORTS.SIMPLE_UNIFIED_GATEWAY}/graphql`,
  SIMPLE_UNIFIED_GATEWAY_LIVE: `http://localhost:${SERVICE_PORTS.SIMPLE_UNIFIED_GATEWAY}/live-query`,
  SIMPLE_UNIFIED_GATEWAY_TRANSLATE: `http://localhost:${SERVICE_PORTS.SIMPLE_UNIFIED_GATEWAY}/translate`,
  SIMPLE_MESH_GATEWAY: `http://localhost:${SERVICE_PORTS.SIMPLE_MESH_GATEWAY}/graphql`,
  HUGMENOW_APP: `http://localhost:${SERVICE_PORTS.HUGMENOW_APP}`,
  DIRECT_POSTGRES_PROXY: `http://localhost:${SERVICE_PORTS.DIRECT_POSTGRES_PROXY}/query` // Updated for direct postgres proxy
};

// Default client information
export const CLIENT_INFO = {
  VERSION: '1.0.0',
  PLATFORM: 'web',
  FEATURES: [
    'mood-tracking',
    'friend-moods',
    'theme-support',
    'streak-tracking',
    'live-queries'
  ]
};

// Export configuration
export default {
  services: SERVICE_NAMES,
  ports: SERVICE_PORTS,
  endpoints: SERVICE_ENDPOINTS,
  client: CLIENT_INFO
};