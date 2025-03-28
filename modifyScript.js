const fs = require('fs');

const filePath = 'apollo-mesh-gateway.js';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(`publicMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.publicMoods');
      return executeGraphQL(\`
        query GetPublicMoods($limit: Int, $offset: Int) {
          allMoods(
            first: $limit
            offset: $offset
          ) {
            nodes {
              id
              score
              note
              isPublic
              createdAt
              userId
              userByUserId {
                id
                username
                name
                avatarUrl
              }
            }
          }
        }
      \`,
        { limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => {
        // Transform the response from allMoods.nodes to match our PublicMood type
        const moods = data?.allMoods?.nodes || [];
        return moods.map(mood => ({`,
        
`publicMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.publicMoods');
      return executeGraphQL(\`
        query GetPublicMoods($limit: Int, $offset: Int) {
          allMoods(
            first: $limit
            offset: $offset
          ) {
            nodes {
              id
              score
              note
              isPublic
              createdAt
              userId
              userByUserId {
                id
                username
                name
                avatarUrl
              }
            }
          }
        }
      \`,
        { limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => {
        // Transform the response from allMoods.nodes to match our PublicMood type
        const moods = data?.allMoods?.nodes || [];
        // Filter to only include public moods
        const publicMoods = moods.filter(mood => mood.isPublic === true);
        return publicMoods.map(mood => ({`);

content = content.replace(`friendsMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.friendsMoods');
      // Maps friendsMoods to allMoods from PostGraphile
      return executeGraphQL(\`
        query GetFriendsMoods($limit: Int, $offset: Int) {
          allMoods(
            first: $limit
            offset: $offset
          ) {
            nodes {
              id
              score
              note
              isPublic
              createdAt
              userId
              userByUserId {
                id
                username
                name
                avatarUrl
              }
            }
          }
        }
      \`,
        { limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => {
        // Transform the response from allMoods.nodes to match our PublicMood type
        const moods = data?.allMoods?.nodes || [];
        return moods.map(mood => ({`,
        
`friendsMoods: async (_, args, context) => {
      console.log('[Gateway] Resolving Query.friendsMoods');
      // Maps friendsMoods to allMoods from PostGraphile
      return executeGraphQL(\`
        query GetFriendsMoods($limit: Int, $offset: Int) {
          allMoods(
            first: $limit
            offset: $offset
          ) {
            nodes {
              id
              score
              note
              isPublic
              createdAt
              userId
              userByUserId {
                id
                username
                name
                avatarUrl
              }
            }
          }
        }
      \`,
        { limit: args.limit || 10, offset: args.offset || 0 },
        context.headers?.authorization
      ).then(data => {
        // Transform the response from allMoods.nodes to match our PublicMood type
        const moods = data?.allMoods?.nodes || [];
        // Filter to only include public moods
        const publicMoods = moods.filter(mood => mood.isPublic === true);
        return publicMoods.map(mood => ({`);

fs.writeFileSync(filePath, content, 'utf8');
