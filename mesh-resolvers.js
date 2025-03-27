/**
 * Custom resolvers for GraphQL Mesh
 * 
 * This file provides resolvers for client-side fields and 
 * any custom logic needed for the Mesh gateway.
 */

module.exports = {
  Query: {
    _clientInfo: () => ({
      version: process.env.CLIENT_VERSION || '1.0.0',
      buildDate: new Date().toISOString()
    })
  }
};