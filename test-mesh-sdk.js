/**
 * Test script for the Mesh SDK
 * This directly imports and tests the Mesh SDK functionality
 */
import { getSdk } from './mesh-sdk/index.js';

async function testMeshSdk() {
  console.log('Testing Mesh SDK...');
  
  // Create an SDK instance
  const sdk = getSdk({
    baseUrl: 'http://localhost:5000/graphql',
    token: null
  });
  
  try {
    // Test getting public moods
    console.log('Fetching public moods...');
    const publicMoodsResult = await sdk.PublicMoods();
    
    if (publicMoodsResult && publicMoodsResult.publicMoods) {
      console.log(`Success! Found ${publicMoodsResult.publicMoods.length} public moods`);
      
      // Log the first mood if available
      if (publicMoodsResult.publicMoods.length > 0) {
        console.log('First mood:', JSON.stringify(publicMoodsResult.publicMoods[0], null, 2));
      }
    } else {
      console.error('Error: Could not retrieve public moods');
    }
    
    // Test creating a mood
    console.log('\nCreating a new mood...');
    const createMoodResult = await sdk.CreateMoodEntry({
      mood: 'HAPPY',
      intensity: 8,
      note: 'Created via Mesh SDK test script',
      isPublic: true
    });
    
    if (createMoodResult && createMoodResult.createMoodEntry) {
      console.log('Mood created successfully:', JSON.stringify(createMoodResult.createMoodEntry, null, 2));
    } else {
      console.error('Error: Could not create mood');
    }
    
    console.log('\nMesh SDK test completed successfully!');
  } catch (error) {
    console.error('Error testing Mesh SDK:', error);
  }
}

// Run the test as a standalone module
if (import.meta.url === import.meta.resolve('./test-mesh-sdk.js')) {
  testMeshSdk().catch(console.error);
}