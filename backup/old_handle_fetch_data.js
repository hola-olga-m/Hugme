async function handleFetchData(ws, clients, data) {
  try {
    const { dataType, timeRange, includeCorrelations } = data;

    // Find the client info
    const clientEntry = Array.from(clients.entries())
      .find(([_, client]) => client.ws === ws);

    if (!clientEntry || !clientEntry[1].isAuthenticated) {
      console.error('Client not authenticated');
      return;
    }

    const userId = clientEntry[1].userId;
    
    // Check if user is anonymous (stored only in memory)
    const isAnonymous = userId && userId.startsWith('anon-');
    switch (dataType) {
      case 'hugs':
        if (isAnonymous) {
          // For anonymous users, use in-memory data
          const userHugs = hugHistory.get(userId) || [];
          send(ws, {
            type: 'hugs_data',
            hugs: userHugs
          });
        } else {
          // For registered users, query from database
          const hugs = await Hug.findAll({
            where: {
              [Op.or]: [
                { senderId: userId },
                { recipientId: userId }
              ]
            },
            order: [['createdAt', 'DESC']],
            limit: data.limit || 10
          });
          
          // Format hugs for the client
          const formattedHugs = hugs.map(hug => ({
            id: hug.id,
            senderId: hug.senderId,
            senderName: hug.senderName, // This should come from a join with User model ideally
            recipientId: hug.recipientId,
            hugType: hug.hugType,
            message: hug.message,
            timestamp: hug.createdAt.getTime(),
            viewed: hug.viewed
          }));
          
          send(ws, {
            type: 'hugs_data',
            hugs: formattedHugs
          });
        }
        break;

      case 'hug_requests':
        if (isAnonymous) {
          // For anonymous users, use in-memory data
          // Fetch directed requests first (where user is recipient)
          const directedRequests = Array.from(hugRequests.values())
            .flat()
            .filter(req => req.recipientId === userId && req.status === 'pending');

          // Now get anonymous community requests
          const communityRequests = Array.from(hugRequests.values())
            .flat()
            .filter(req => req.isAnonymous && req.status === 'pending' && req.senderId !== userId);

          // Combine both types
          const allRequests = [...directedRequests, ...communityRequests];

          send(ws, {
            type: 'hug_requests_data',
            requests: allRequests
          });
        } else {
          // For registered users, we would query from database
          // Note: Since HugRequest model isn't implemented yet, we'll use in-memory for now
          // TODO: Implement HugRequest model and database queries
          
          // Temporary fallback to in-memory data:
          const directedRequests = Array.from(hugRequests.values())
            .flat()
            .filter(req => req.recipientId === userId && req.status === 'pending');

          const communityRequests = Array.from(hugRequests.values())
            .flat()
            .filter(req => req.isAnonymous && req.status === 'pending' && req.senderId !== userId);

          const allRequests = [...directedRequests, ...communityRequests];

          send(ws, {
            type: 'hug_requests_data',
            requests: allRequests
          });
        }
        break;

      case 'group_hugs':
        if (isAnonymous) {
          // Anonymous users don't have group hugs
          send(ws, {
            type: 'group_hugs_data',
            groupHugs: []
          });
        } else {
          // For registered users, query from database through joins
          // TODO: Implement proper GroupHug model querying
          // For now, use in-memory data
          const userGroupHugs = Array.from(groupHugs.values())
            .filter(group => group.participantIds.includes(userId));

          send(ws, {
            type: 'group_hugs_data',
            groupHugs: userGroupHugs
          });
        }
        break;

      case 'mood_analytics': // Changed from moodAnalytics for consistency
        // Generate and send advanced mood analytics
        let analytics;
        
        if (isAnonymous) {
          // For anonymous users, use in-memory data
          analytics = generateMoodAnalytics(userId, timeRange, includeCorrelations);
        } else {
          // For registered users, query mood data from database
          const moodEntries = await Mood.findAll({
            where: {
              userId: userId,
              createdAt: {
                [Op.gte]: new Date(Date.now() - (timeRange * 24 * 60 * 60 * 1000))
              }
            },
            order: [['createdAt', 'DESC']]
          });
          
          // If user has no mood entries, return starter data
          if (moodEntries.length === 0) {
            analytics = {
              moodEntries: [],
              summary: {
                dominantMoodGroup: 'neutral',
                moodVariability: 'insufficientdata',
                longestStreak: 0,
                currentStreak: 0,
                improvementTrend: 'insufficient_data',
                averageMoodScore: 5,
              },
              insights: [],
              recommendations: [
                {
                  type: 'general',
                  title: 'Start Your Mood Journey',
                  description: 'Track your mood daily to receive personalized recommendations.',
                  actionLabel: 'Log Mood'
                }
              ]
            };
          } else {
            // We need to update the generateMoodAnalytics function to work with DB entities
            // For now, convert DB entities to the format expected by generateMoodAnalytics
            const formattedEntries = moodEntries.map(entry => ({
              id: entry.id,
              userId: entry.userId,
              mood: entry.mood,
              intensity: entry.intensity,
              note: entry.note,
              isPublic: !entry.isPrivate,
              activities: entry.activities,
              location: entry.location,
              timestamp: entry.createdAt.getTime()
            }));
            
            // Store in memory for analytics processing
            moodHistory.set(userId, formattedEntries);
            
            // Generate analytics using the formatted entries
            analytics = generateMoodAnalytics(userId, timeRange, includeCorrelations);
          }
        }
        
        send(ws, {
          type: 'mood_analytics_data', // Updated to match the expected type in frontend
          data: analytics
        });
        break;

      send(ws, {
        type: 'moodAnalytics',
        data: analytics
      });
      break;

    case 'mood_history':
      // Send mood history for this user
      const userMoodHistory = moodHistory.get(userId) || [];

      // Convert to object with current user's mood history and latest moods of followed users
      const formattedMoodHistory = {
        [userId]: {
          history: userMoodHistory,
          latestMood: userMoodHistory.length > 0 ? {
            mood: userMoodHistory[0].mood,
            intensity: userMoodHistory[0].intensity,
            timestamp: userMoodHistory[0].timestamp
          } : null
        }
      };

      // Add mood data for followed users
      const followedUsers = Array.from(followConnections.values())
        .filter(follow => follow.followerId === userId)
        .map(follow => follow.followingId);

      for (const followedId of followedUsers) {
        const followedMoodHistory = moodHistory.get(followedId) || [];

        if (followedMoodHistory.length > 0) {
          const latestPublicMood = followedMoodHistory.find(m => m.isPublic);

          if (latestPublicMood) {
            formattedMoodHistory[followedId] = {
              latestMood: {
                mood: latestPublicMood.mood,
                intensity: latestPublicMood.intensity,
                timestamp: latestPublicMood.timestamp
              }
            };
          }
        }
      }

      send(ws, {
        type: 'mood_history_data',
        moodHistory: formattedMoodHistory
      });
      break;

    case 'following':
      // Send users that this user follows
      const following = Array.from(followConnections.values())
        .filter(follow => follow.followerId === userId)
        .map(follow => {
          const user = users.get(follow.followingId);
          return {
            id: follow.followingId,
            username: user?.username || 'User',
            avatar: user?.avatar || null,
            isOnline: onlineUsers.has(follow.followingId)
          };
        });

      send(ws, {
        type: 'following_data',
        following
      });
      break;

    case 'followers':
      // Send users that follow this user
      const followers = Array.from(followConnections.values())
        .filter(follow => follow.followingId === userId)
        .map(follow => {
          const user = users.get(follow.followerId);
          return {
            id: follow.followerId,
            username: user?.username || 'User',
            avatar: user?.avatar || null,
            isOnline: onlineUsers.has(follow.followerId)
          };
        });

      send(ws, {
        type: 'followers_data',
        followers
      });
      break;

    case 'badges':
      // Send badges earned by this user
      const userBadgesList = [];

      if (userId in userBadges) {
        userBadgesList.push(...userBadges.get(userId));
      }

      send(ws, {
        type: 'badges_data',
        badges: userBadgesList
      });
      break;

    case 'hug_types':
      // Send available hug types
      send(ws, {
        type: 'hug_types_data',
        hugTypes: [
          {
            id: 'comfort',
            name: 'Comfort Hug',
            description: 'A warm embrace to lift your spirits',
            icon: 'fas fa-cloud'
          },
          {
            id: 'celebration',
            name: 'Celebration Hug',
            description: 'Share your joy with someone special',
            icon: 'fas fa-birthday-cake'
          },
          {
            id: 'support',
            name: 'Support Hug',
            description: 'Let them know you\'re there for them',
            icon: 'fas fa-hands-helping'
          },
          {
            id: 'energizing',
            name: 'Energizing Hug',
            description: 'A burst of positive energy and encouragement',
            icon: 'fas fa-bolt'
          },
          {
            id: 'bear',
            name: 'Bear Hug',
            description: 'A big, strong, enveloping hug',
            icon: 'fas fa-paw'
          },
          {
            id: 'healing',
            name: 'Healing Hug',
            description: 'A gentle embrace to help recovery',
            icon: 'fas fa-heart'
          },
          {
            id: 'friendship',
            name: 'Friendship Hug',
            description: 'A hug that celebrates your special bond',
            icon: 'fas fa-user-friends'
          }
        ]
      });
      break;

    case 'contacts':
      // Send user contacts (including additional data for RequestHug component)
      const userContacts = Array.from(followConnections.values())
        .filter(follow => follow.followerId === userId || follow.followingId === userId)
        .map(follow => {
          const contactId = follow.followerId === userId ? follow.followingId : follow.followerId;
          const user = users.get(contactId);
          const lastMood = moodHistory.get(contactId)?.find(m => m.isPublic)?.mood || null;

          return {
            contactId: contactId,  // Use contactId property name for consistency
            name: user?.username || 'User',  // Usename property name for consistency
            avatar: user?.avatar || null,
            isOnline: onlineUsers.has(contactId),
            isFavorite: false,
            mood: lastMood,
            lastInteraction: Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000), // Random time in last week
            recentHugs: (hugHistory.get(contactId) || [])
              .filter(hug => hug.recipientId === userId || hug.senderId === userId)
              .slice(0, 3)
              .map(hug => ({
                type: hug.hugType,
                timestamp: hug.timestamp
              }))
          };
        });

      // Add some default recommended contacts if none exist
      if (userContacts.length === 0) {
        // Generate a couple of default contacts for demo purposes
        const defaultContactIds = ['user1', 'user2', 'user3'];
        for (const contactId of defaultContactIds) {
          if (!users.has(contactId)) {
            users.set(contactId, {
              id: contactId,
              username: `Friend ${contactId.slice(-1)}`,
              avatar: null,
              mood: null,
              lastActivity: Date.now() - (24 * 60 * 60 * 1000)
            });
          }

          userContacts.push({
            contactId: contactId,
            name: users.get(contactId).username,
            avatar: null,
            isOnline: onlineUsers.has(contactId),
            isFavorite: false,
            mood: null,
            lastInteraction: Date.now() - (24 * 60 * 60 * 1000),
            recentHugs: []
          });
        }
      }

      send(ws, {
        type: 'contacts_data',
        contacts: userContacts
      });
      break;

    case 'status_tags':
      // Send available status tags
      send(ws, {
        type: 'status_tags_data',
        statusTags: [
          {
            id: 'relaxing',
            name: 'Relaxing',
            icon: 'fa-couch',
            color: '#4CAF50',
            isSelected: false
          },
          {
            id: 'working',
            name: 'Working',
            icon: 'fa-briefcase',
            color: '#2196F3',
            isSelected: false
          },
          {
            id: 'traveling',
            name: 'Traveling',
            icon: 'fa-plane',
            color: '#FF9800',
            isSelected: false
          },
          {
            id: 'gaming',
            name: 'Gaming',
            icon: 'fa-gamepad',
            color: '#9C27B0',
            isSelected: false
          },
          {
            id: 'exercising',
            name: 'Exercising',
            icon: 'fa-running',
            color: '#F44336',
            isSelected: false
          },
          {
            id: 'eating',
            name: 'Eating',
            icon: 'fa-utensils',
            color: '#795548',
            isSelected: false
          },
          {
            id: 'studying',
            name: 'Studying',
            icon: 'fa-book',
            color: '#3F51B5',
            isSelected: false
          }
        ]
      });
      break;

    case 'notification_settings':
      // Send notification settings for followed users
      const notificationSettings = {};
      const followedUserIds = Array.from(followConnections.values())
        .filter(follow => follow.followerId === userId)
        .map(follow => follow.followingId);

      for (const followedId of followedUserIds) {
        notificationSettings[followedId] = {
          notifyOnUpdate: true,
          notifyOnLowMood: true
        };
      }

      send(ws, {
        type: 'notification_settings_data',
        settings: notificationSettings
      });
      break;

    case 'community_feed':
      // Get filter parameter if provided
      const feedFilter = data.filter || 'all';

      // Generate sample community feed data
      const communityPosts = generateCommunityFeedData(feedFilter);

      send(ws, {
        type: 'community_feed_data',
        posts: communityPosts
      });
      break;

    default:
      console.log(`Unknown data type requested: ${dataType}`);
  }
}
