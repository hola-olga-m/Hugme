/**
 * GraphQL Mesh Additional Resolvers
 * 
 * These resolvers stitch together the different GraphQL services 
 * and resolve relationships between types from different services.
 */

module.exports = {
  // Resolve relationships from HugMood API to User Service
  HugMood_Mood: {
    user: {
      selectionSet: `{ userId }`,
      resolve: (mood, args, context, info) => {
        return context.User.Query.userById({ id: mood.userId });
      }
    }
  },
  
  HugMood_Hug: {
    sender: {
      selectionSet: `{ senderId }`,
      resolve: (hug, args, context, info) => {
        return context.User.Query.userById({ id: hug.senderId });
      }
    },
    recipient: {
      selectionSet: `{ recipientId }`,
      resolve: (hug, args, context, info) => {
        return context.User.Query.userById({ id: hug.recipientId });
      }
    }
  },
  
  HugMood_GroupHug: {
    creator: {
      selectionSet: `{ creatorId }`,
      resolve: (groupHug, args, context, info) => {
        return context.User.Query.userById({ id: groupHug.creatorId });
      }
    }
  },
  
  HugMood_GroupHugParticipant: {
    user: {
      selectionSet: `{ userId }`,
      resolve: (participant, args, context, info) => {
        return context.User.Query.userById({ id: participant.userId });
      }
    }
  },
  
  // Resolve relationships from Mood Service to HugMood API
  Mood_MoodInsight: {
    relatedMoods: {
      selectionSet: `{ moodIds }`,
      resolve: (insight, args, context, info) => {
        if (!insight.moodIds || !insight.moodIds.length) return [];
        
        return Promise.all(
          insight.moodIds.map(id => context.HugMood.Query.moodById({ id }))
        );
      }
    }
  },
  
  // Resolve relationships from Hug Service to User Service
  Hug_HugRequestResponse: {
    responder: {
      selectionSet: `{ responderId }`,
      resolve: (response, args, context, info) => {
        return context.User.Query.userById({ id: response.responderId });
      }
    }
  },
  
  // Add cross-service mutations and queries as needed
  Mutation: {
    // Example of a complex mutation that spans multiple services
    createMoodAndNotifyFollowers: {
      resolve: async (root, { input }, context, info) => {
        // Create mood in mood service
        const mood = await context.Mood.Mutation.createMood({ input });
        
        // Get user's followers from user service
        const followers = await context.User.Query.userFollowers({ userId: input.userId });
        
        // Create notifications in hug service
        if (followers && followers.length) {
          await Promise.all(
            followers.map(follower => 
              context.Hug.Mutation.createNotification({ 
                input: {
                  userId: follower.id,
                  type: 'MOOD_UPDATE',
                  referenceId: mood.id,
                  message: `${mood.user.displayName} just updated their mood!`
                }
              })
            )
          );
        }
        
        return mood;
      }
    }
  },
  
  Query: {
    // Example of a complex query that spans multiple services
    userDashboard: {
      resolve: async (root, { userId }, context, info) => {
        // Execute queries in parallel for better performance
        const [
          user,
          moods,
          hugs,
          analytics,
          streakInfo
        ] = await Promise.all([
          context.User.Query.userById({ id: userId }),
          context.Mood.Query.userMoods({ userId, limit: 5 }),
          context.Hug.Query.userHugs({ userId, limit: 5 }),
          context.Analytics.Query.userMoodAnalytics({ userId, timeRange: 30 }),
          context.HugMood.Query.userStreakInfo({ userId })
        ]);
        
        return {
          user,
          recentMoods: moods,
          recentHugs: hugs,
          analytics,
          streakInfo
        };
      }
    }
  }
};