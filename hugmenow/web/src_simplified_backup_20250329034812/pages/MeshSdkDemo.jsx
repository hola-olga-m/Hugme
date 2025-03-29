import React from 'react';
import MainLayout from '../layouts/MainLayout';
import MeshSdkExample from '../components/examples/MeshSdkExample';

/**
 * Mesh SDK Demo Page
 * Demonstrates how to use the Mesh SDK for API interactions
 */
function MeshSdkDemo() {
  return (
    <MainLayout title="Mesh SDK Demo">
      <div className="mesh-sdk-demo">
        <div className="page-header">
          <h1>Mesh SDK Demo</h1>
          <p className="description">
            This page demonstrates how to use the GraphQL Mesh SDK to interact
            with the HugMeNow API directly, without using the Apollo client.
          </p>
        </div>
        
        <div className="content-section">
          <MeshSdkExample />
        </div>
        
        <div className="info-section">
          <h2>About Mesh SDK</h2>
          <p>
            GraphQL Mesh SDK provides a lightweight, type-safe way to interact with
            the GraphQL API. It supports all the operations available in the API
            without needing the full Apollo client infrastructure.
          </p>
          <h3>Benefits:</h3>
          <ul>
            <li>Lightweight - minimal dependencies</li>
            <li>Type-safe - provides typed methods for all operations</li>
            <li>Simple - straightforward promise-based API</li>
            <li>Compatible - works with all modern JavaScript frameworks</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}

export default MeshSdkDemo;