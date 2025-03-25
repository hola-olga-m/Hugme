import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { shield, rule, allow, deny, and, or, not } from 'graphql-shield';
import { GraphQLError } from 'graphql';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);

  constructor(private jwtService: JwtService) {}

  // Base rules
  isAuthenticated = rule()(async (parent, args, context, info) => {
    return context.user !== null && context.user !== undefined;
  });

  isAdmin = rule()(async (parent, args, context, info) => {
    return context.user?.role === 'ADMIN';
  });

  // User-related rules
  isSelf = rule()(async (parent, args, context, info) => {
    const id = args.id || parent?.id;
    return context.user?.id === id;
  });

  // Mood-related rules
  isOwnMood = rule()(async (parent, args, context, info) => {
    const moodId = args.id || args.updateMoodInput?.id || parent?.id;
    
    // If we're checking a mood directly
    if (parent?.userId) {
      return context.user?.id === parent.userId;
    }
    
    try {
      // Need to fetch the mood to check ownership
      const mood = await context.dataSources.moodsService.findOne(moodId);
      return context.user?.id === mood.userId;
    } catch (error) {
      this.logger.error(`Error checking mood ownership: ${error.message}`);
      return false;
    }
  });

  isPublicMood = rule()(async (parent, args, context, info) => {
    const moodId = args.id || parent?.id;
    
    // If we're checking a mood directly
    if (parent?.isPublic !== undefined) {
      return parent.isPublic === true;
    }
    
    try {
      // Need to fetch the mood to check if it's public
      const mood = await context.dataSources.moodsService.findOne(moodId);
      return mood.isPublic === true;
    } catch (error) {
      this.logger.error(`Error checking if mood is public: ${error.message}`);
      return false;
    }
  });

  // Hug-related rules
  isHugSenderOrRecipient = rule()(async (parent, args, context, info) => {
    const hugId = args.id || parent?.id;
    
    // If we're checking a hug directly
    if (parent?.senderId && parent?.recipientId) {
      return context.user?.id === parent.senderId || context.user?.id === parent.recipientId;
    }
    
    try {
      // Need to fetch the hug to check ownership
      const hug = await context.dataSources.hugsService.findHugById(hugId);
      return context.user?.id === hug.senderId || context.user?.id === hug.recipientId;
    } catch (error) {
      this.logger.error(`Error checking hug sender/recipient: ${error.message}`);
      return false;
    }
  });

  isHugRequestRequesterOrRecipient = rule()(async (parent, args, context, info) => {
    const requestId = args.id || args.requestId || parent?.id;
    
    // If we're checking a request directly
    if (parent?.requesterId && parent?.recipientId) {
      return context.user?.id === parent.requesterId || context.user?.id === parent.recipientId;
    }
    
    try {
      // Need to fetch the request to check ownership
      const request = await context.dataSources.hugsService.findHugRequestById(requestId);
      return context.user?.id === request.requesterId || context.user?.id === request.recipientId;
    } catch (error) {
      this.logger.error(`Error checking hug request requester/recipient: ${error.message}`);
      return false;
    }
  });

  isCommunityHugRequest = rule()(async (parent, args, context, info) => {
    const requestId = args.id || parent?.id;
    
    // If we're checking a request directly
    if (parent?.isCommunityRequest !== undefined) {
      return parent.isCommunityRequest === true;
    }
    
    try {
      // Need to fetch the request to check if it's a community request
      const request = await context.dataSources.hugsService.findHugRequestById(requestId);
      return request.isCommunityRequest === true;
    } catch (error) {
      this.logger.error(`Error checking if hug request is community: ${error.message}`);
      return false;
    }
  });

  // Create permissions schema
  createPermissions() {
    return shield(
      {
        Query: {
          users: this.isAuthenticated,
          user: allow,
          me: this.isAuthenticated,
          publicMoods: allow,
          userMoods: this.isAuthenticated,
          mood: or(this.isAuthenticated, this.isPublicMood),
          moodStreak: this.isAuthenticated,
          sentHugs: this.isAuthenticated,
          receivedHugs: this.isAuthenticated,
          hug: and(this.isAuthenticated, this.isHugSenderOrRecipient),
          myHugRequests: this.isAuthenticated,
          pendingHugRequests: this.isAuthenticated,
          communityHugRequests: this.isAuthenticated,
          hugRequest: and(this.isAuthenticated, 
            or(this.isHugRequestRequesterOrRecipient, this.isCommunityHugRequest))
        },
        Mutation: {
          login: allow,
          register: allow,
          anonymousLogin: allow,
          updateUser: and(this.isAuthenticated, this.isSelf),
          removeUser: and(this.isAuthenticated, this.isSelf),
          createMood: this.isAuthenticated,
          updateMood: and(this.isAuthenticated, this.isOwnMood),
          removeMood: and(this.isAuthenticated, this.isOwnMood),
          sendHug: this.isAuthenticated,
          markHugAsRead: and(this.isAuthenticated, this.isHugSenderOrRecipient),
          createHugRequest: this.isAuthenticated,
          respondToHugRequest: and(this.isAuthenticated, 
            or(this.isHugRequestRequesterOrRecipient, this.isCommunityHugRequest)),
          cancelHugRequest: and(this.isAuthenticated, this.isHugRequestRequesterOrRecipient)
        },
        User: {
          // Control visibility of user fields
          id: allow,
          username: allow,
          email: and(this.isAuthenticated, or(this.isSelf, this.isAdmin)),
          name: allow,
          password: deny,
          avatarUrl: allow,
          isAnonymous: allow,
          createdAt: allow,
          updatedAt: allow
        },
        Mood: {
          // Control visibility of mood fields
          '*': allow, // All fields are publicly visible if the mood itself is accessible
        },
        Hug: {
          // Control visibility of hug fields
          '*': and(this.isAuthenticated, this.isHugSenderOrRecipient),
        },
        HugRequest: {
          // Control visibility of hug request fields
          '*': and(this.isAuthenticated, 
            or(this.isHugRequestRequesterOrRecipient, this.isCommunityHugRequest)),
        }
      },
      {
        fallbackRule: deny,
        fallbackError: new GraphQLError(
          'Access denied. Not authorized to access this resource.',
          { extensions: { code: 'FORBIDDEN' } }
        ),
        allowExternalErrors: true,
        debug: true // Set to false in production
      }
    );
  }
}