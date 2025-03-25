import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { 
  shield, 
  rule, 
  allow, 
  deny, 
  and, 
  or, 
  not,
  inputRule,
  chain,
  IRules
} from 'graphql-shield';
import { 
  GraphQLError, 
  GraphQLScalarType, 
  Kind, 
  GraphQLString, 
  GraphQLInt,
  GraphQLFloat,
  GraphQLBoolean,
  GraphQLID
} from 'graphql';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  
  // Custom Scalar Types for validation
  public readonly CustomScalars = {
    Email: new GraphQLScalarType({
      name: 'Email',
      description: 'Email scalar type',
      serialize: (value) => {
        const stringValue = String(value);
        if (!this.isValidEmail(stringValue)) {
          throw new GraphQLError('Invalid email format');
        }
        return stringValue;
      },
      parseValue: (value) => {
        const stringValue = String(value);
        if (!this.isValidEmail(stringValue)) {
          throw new GraphQLError('Invalid email format');
        }
        return stringValue;
      },
      parseLiteral: (ast) => {
        if (ast.kind !== Kind.STRING) {
          throw new GraphQLError('Email must be a string');
        }
        if (!this.isValidEmail(ast.value)) {
          throw new GraphQLError('Invalid email format');
        }
        return ast.value;
      }
    }),
    
    URL: new GraphQLScalarType({
      name: 'URL',
      description: 'URL scalar type',
      serialize: (value) => {
        const stringValue = String(value);
        if (!this.isValidURL(stringValue)) {
          throw new GraphQLError('Invalid URL format');
        }
        return stringValue;
      },
      parseValue: (value) => {
        const stringValue = String(value);
        if (!this.isValidURL(stringValue)) {
          throw new GraphQLError('Invalid URL format');
        }
        return stringValue;
      },
      parseLiteral: (ast) => {
        if (ast.kind !== Kind.STRING) {
          throw new GraphQLError('URL must be a string');
        }
        if (!this.isValidURL(ast.value)) {
          throw new GraphQLError('Invalid URL format');
        }
        return ast.value;
      }
    }),
    
    Password: new GraphQLScalarType({
      name: 'Password',
      description: 'Password scalar type with validation',
      serialize: (value) => String(value),
      parseValue: (value) => {
        const stringValue = String(value);
        if (!this.isValidPassword(stringValue)) {
          throw new GraphQLError('Password must be at least 8 characters with a mix of letters, numbers, and symbols');
        }
        return stringValue;
      },
      parseLiteral: (ast) => {
        if (ast.kind !== Kind.STRING) {
          throw new GraphQLError('Password must be a string');
        }
        if (!this.isValidPassword(ast.value)) {
          throw new GraphQLError('Password must be at least 8 characters with a mix of letters, numbers, and symbols');
        }
        return ast.value;
      }
    }),
    
    UUID: new GraphQLScalarType({
      name: 'UUID',
      description: 'UUID scalar type',
      serialize: (value) => {
        const stringValue = String(value);
        if (!this.isValidUUID(stringValue)) {
          throw new GraphQLError('Invalid UUID format');
        }
        return stringValue;
      },
      parseValue: (value) => {
        const stringValue = String(value);
        if (!this.isValidUUID(stringValue)) {
          throw new GraphQLError('Invalid UUID format');
        }
        return stringValue;
      },
      parseLiteral: (ast) => {
        if (ast.kind !== Kind.STRING) {
          throw new GraphQLError('UUID must be a string');
        }
        if (!this.isValidUUID(ast.value)) {
          throw new GraphQLError('Invalid UUID format');
        }
        return ast.value;
      }
    })
  };

  constructor(private jwtService: JwtService) {}
  
  /**
   * Get custom scalar type definitions for use in GraphQL schema
   * @returns string containing scalar definitions for schema stitching
   */
  getCustomScalarTypeDefs(): string {
    return `
      # Custom validation scalars
      scalar Email
      scalar URL
      scalar Password
      scalar UUID
    `;
  }
  
  // Validation helpers
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }
  
  private isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  private isValidPassword(password: string): boolean {
    // Min 8 characters, at least one letter, one number, and one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  }
  
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
  
  // Input validation rules
  validateRegisterInput = inputRule()(
    (yup) => {
      return yup.object({
        username: yup.string().required().min(3).max(30),
        email: yup.string().required().email(),
        name: yup.string().required().min(2).max(50),
        password: yup.string().required().min(8).matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          'Password must contain at least one letter, one number, and one special character'
        ),
        avatarUrl: yup.string().url().nullable()
      });
    }
  );
  
  validateLoginInput = inputRule()(
    (yup) => {
      return yup.object({
        email: yup.string().required().email(),
        password: yup.string().required()
      });
    }
  );
  
  validateMoodInput = inputRule()(
    (yup) => {
      return yup.object({
        score: yup.number().required().min(1).max(10),
        note: yup.string().max(500).nullable(),
        isPublic: yup.boolean().required()
      });
    }
  );
  
  validateHugInput = inputRule()(
    (yup) => {
      return yup.object({
        recipientId: yup.string().required().matches(
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
          'Invalid UUID format'
        ),
        type: yup.string().required().oneOf(
          ['QUICK', 'WARM', 'SUPPORTIVE', 'COMFORTING', 'ENCOURAGING', 'CELEBRATORY']
        ),
        message: yup.string().max(500).nullable()
      });
    }
  );
  
  validateHugRequestInput = inputRule()(
    (yup) => {
      return yup.object({
        recipientId: yup.string().when('isCommunityRequest', {
          is: false,
          then: yup.string().required().matches(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
            'Invalid UUID format'
          ),
          otherwise: yup.string().nullable()
        }),
        message: yup.string().max(500).nullable(),
        isCommunityRequest: yup.boolean().required()
      });
    }
  );

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
          // Auth mutations with input validation
          login: this.validateLoginInput,
          register: this.validateRegisterInput,
          anonymousLogin: allow,
          
          // User mutations
          updateUser: and(this.isAuthenticated, this.isSelf),
          removeUser: and(this.isAuthenticated, this.isSelf),
          
          // Mood mutations with validation
          createMood: and(this.isAuthenticated, this.validateMoodInput),
          updateMood: and(this.isAuthenticated, this.isOwnMood, this.validateMoodInput),
          removeMood: and(this.isAuthenticated, this.isOwnMood),
          
          // Hug mutations with validation
          sendHug: and(this.isAuthenticated, this.validateHugInput),
          markHugAsRead: and(this.isAuthenticated, this.isHugSenderOrRecipient),
          
          // Hug request mutations with validation
          createHugRequest: and(this.isAuthenticated, this.validateHugRequestInput),
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