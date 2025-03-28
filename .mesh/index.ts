// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode } from 'graphql';
import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { defaultImportFn, handleImport } from '@graphql-mesh/utils';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import type { MeshResolvedSource } from '@graphql-mesh/runtime';
import type { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import { parse } from 'graphql';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import { getMesh, type ExecuteMeshFn, type SubscribeMeshFn, type MeshContext as BaseMeshContext, type MeshInstance } from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import type { ImportFn } from '@graphql-mesh/types';
import type { HugMeNowApiTypes } from './sources/HugMeNowAPI/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Query = {
  hello?: Maybe<Scalars['String']['output']>;
  dbTest?: Maybe<Scalars['String']['output']>;
  users?: Maybe<Array<Maybe<User>>>;
  currentUser?: Maybe<User>;
  user?: Maybe<User>;
  userByUsername?: Maybe<User>;
  moods?: Maybe<Array<Maybe<MoodEntry>>>;
  moodById?: Maybe<MoodEntry>;
  moodStreak?: Maybe<MoodStreak>;
  publicMoods?: Maybe<Array<Maybe<PublicMood>>>;
  hugs?: Maybe<Array<Maybe<Hug>>>;
  hugById?: Maybe<Hug>;
  hugRequests?: Maybe<Array<Maybe<HugRequest>>>;
  clientInfo: ClientInfo;
  friendsMoods?: Maybe<Array<Maybe<PublicMood>>>;
  userMoods?: Maybe<Array<Maybe<MoodEntry>>>;
  sentHugs?: Maybe<Array<Maybe<Hug>>>;
  receivedHugs?: Maybe<Array<Maybe<Hug>>>;
};


export type QueryuserArgs = {
  id: Scalars['ID']['input'];
};


export type QueryuserByUsernameArgs = {
  username: Scalars['String']['input'];
};


export type QuerymoodsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerymoodByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QuerymoodStreakArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type QuerypublicMoodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryhugsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryhugByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryhugRequestsArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryuserMoodsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QuerysentHugsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryreceivedHugsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  login?: Maybe<AuthPayload>;
  register?: Maybe<AuthPayload>;
  anonymousLogin?: Maybe<AuthPayload>;
  createMoodEntry?: Maybe<MoodEntry>;
  sendHug?: Maybe<Hug>;
  markHugAsRead?: Maybe<Hug>;
  createHugRequest?: Maybe<HugRequest>;
  respondToHugRequest?: Maybe<HugRequest>;
};


export type MutationloginArgs = {
  loginInput: LoginInput;
};


export type MutationregisterArgs = {
  registerInput: RegisterInput;
};


export type MutationanonymousLoginArgs = {
  anonymousLoginInput: AnonymousLoginInput;
};


export type MutationcreateMoodEntryArgs = {
  moodInput: MoodEntryInput;
};


export type MutationsendHugArgs = {
  hugInput: SendHugInput;
};


export type MutationmarkHugAsReadArgs = {
  hugId: Scalars['ID']['input'];
};


export type MutationcreateHugRequestArgs = {
  hugRequestInput: HugRequestInput;
};


export type MutationrespondToHugRequestArgs = {
  requestId: Scalars['ID']['input'];
  accept: Scalars['Boolean']['input'];
};

export type User = {
  id?: Maybe<Scalars['ID']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  isAnonymous?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  moods?: Maybe<Array<Maybe<MoodEntry>>>;
  hugs?: Maybe<Array<Maybe<Hug>>>;
  friends?: Maybe<Array<Maybe<User>>>;
};

export type MoodEntry = {
  id?: Maybe<Scalars['ID']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
  mood?: Maybe<Scalars['String']['output']>;
  intensity?: Maybe<Scalars['Int']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  isPublic?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type Hug = {
  id?: Maybe<Scalars['ID']['output']>;
  senderId?: Maybe<Scalars['ID']['output']>;
  sender?: Maybe<User>;
  recipientId?: Maybe<Scalars['ID']['output']>;
  recipient?: Maybe<User>;
  type?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  isRead?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  fromUser?: Maybe<User>;
  toUser?: Maybe<User>;
  read?: Maybe<Scalars['Boolean']['output']>;
};

export type MoodStreak = {
  currentStreak?: Maybe<Scalars['Int']['output']>;
  longestStreak?: Maybe<Scalars['Int']['output']>;
  lastMoodDate?: Maybe<Scalars['String']['output']>;
  totalMoods?: Maybe<Scalars['Int']['output']>;
};

export type PublicMood = {
  id?: Maybe<Scalars['ID']['output']>;
  userId?: Maybe<Scalars['ID']['output']>;
  user?: Maybe<User>;
  mood?: Maybe<Scalars['String']['output']>;
  intensity?: Maybe<Scalars['Int']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  score?: Maybe<Scalars['Int']['output']>;
};

export type HugRequest = {
  id?: Maybe<Scalars['ID']['output']>;
  requesterId?: Maybe<Scalars['ID']['output']>;
  requester?: Maybe<User>;
  recipientId?: Maybe<Scalars['ID']['output']>;
  recipient?: Maybe<User>;
  message?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  respondedAt?: Maybe<Scalars['String']['output']>;
};

export type MoodEntryInput = {
  mood: Scalars['String']['input'];
  intensity: Scalars['Int']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
};

export type SendHugInput = {
  recipientId: Scalars['ID']['input'];
  type: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
};

export type HugRequestInput = {
  recipientId: Scalars['ID']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  isCommunityRequest?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AuthPayload = {
  accessToken?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  rememberMe?: InputMaybe<Scalars['Boolean']['input']>;
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  username: Scalars['String']['input'];
  password: Scalars['String']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AnonymousLoginInput = {
  deviceId?: InputMaybe<Scalars['String']['input']>;
};

export type ClientInfo = {
  version: Scalars['String']['output'];
  buildDate: Scalars['String']['output'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> = LegacyStitchingResolver<TResult, TParent, TContext, TArgs> | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  User: ResolverTypeWrapper<User>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  MoodEntry: ResolverTypeWrapper<MoodEntry>;
  Hug: ResolverTypeWrapper<Hug>;
  MoodStreak: ResolverTypeWrapper<MoodStreak>;
  PublicMood: ResolverTypeWrapper<PublicMood>;
  HugRequest: ResolverTypeWrapper<HugRequest>;
  MoodEntryInput: MoodEntryInput;
  SendHugInput: SendHugInput;
  HugRequestInput: HugRequestInput;
  AuthPayload: ResolverTypeWrapper<AuthPayload>;
  LoginInput: LoginInput;
  RegisterInput: RegisterInput;
  AnonymousLoginInput: AnonymousLoginInput;
  ClientInfo: ResolverTypeWrapper<ClientInfo>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  String: Scalars['String']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  User: User;
  Boolean: Scalars['Boolean']['output'];
  MoodEntry: MoodEntry;
  Hug: Hug;
  MoodStreak: MoodStreak;
  PublicMood: PublicMood;
  HugRequest: HugRequest;
  MoodEntryInput: MoodEntryInput;
  SendHugInput: SendHugInput;
  HugRequestInput: HugRequestInput;
  AuthPayload: AuthPayload;
  LoginInput: LoginInput;
  RegisterInput: RegisterInput;
  AnonymousLoginInput: AnonymousLoginInput;
  ClientInfo: ClientInfo;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  hello?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  dbTest?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  currentUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'id'>>;
  userByUsername?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserByUsernameArgs, 'username'>>;
  moods?: Resolver<Maybe<Array<Maybe<ResolversTypes['MoodEntry']>>>, ParentType, ContextType, Partial<QuerymoodsArgs>>;
  moodById?: Resolver<Maybe<ResolversTypes['MoodEntry']>, ParentType, ContextType, RequireFields<QuerymoodByIdArgs, 'id'>>;
  moodStreak?: Resolver<Maybe<ResolversTypes['MoodStreak']>, ParentType, ContextType, Partial<QuerymoodStreakArgs>>;
  publicMoods?: Resolver<Maybe<Array<Maybe<ResolversTypes['PublicMood']>>>, ParentType, ContextType, Partial<QuerypublicMoodsArgs>>;
  hugs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Hug']>>>, ParentType, ContextType, Partial<QueryhugsArgs>>;
  hugById?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<QueryhugByIdArgs, 'id'>>;
  hugRequests?: Resolver<Maybe<Array<Maybe<ResolversTypes['HugRequest']>>>, ParentType, ContextType, Partial<QueryhugRequestsArgs>>;
  clientInfo?: Resolver<ResolversTypes['ClientInfo'], ParentType, ContextType>;
  friendsMoods?: Resolver<Maybe<Array<Maybe<ResolversTypes['PublicMood']>>>, ParentType, ContextType>;
  userMoods?: Resolver<Maybe<Array<Maybe<ResolversTypes['MoodEntry']>>>, ParentType, ContextType, Partial<QueryuserMoodsArgs>>;
  sentHugs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Hug']>>>, ParentType, ContextType, Partial<QuerysentHugsArgs>>;
  receivedHugs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Hug']>>>, ParentType, ContextType, Partial<QueryreceivedHugsArgs>>;
}>;

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  login?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationloginArgs, 'loginInput'>>;
  register?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationregisterArgs, 'registerInput'>>;
  anonymousLogin?: Resolver<Maybe<ResolversTypes['AuthPayload']>, ParentType, ContextType, RequireFields<MutationanonymousLoginArgs, 'anonymousLoginInput'>>;
  createMoodEntry?: Resolver<Maybe<ResolversTypes['MoodEntry']>, ParentType, ContextType, RequireFields<MutationcreateMoodEntryArgs, 'moodInput'>>;
  sendHug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<MutationsendHugArgs, 'hugInput'>>;
  markHugAsRead?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<MutationmarkHugAsReadArgs, 'hugId'>>;
  createHugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType, RequireFields<MutationcreateHugRequestArgs, 'hugRequestInput'>>;
  respondToHugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType, RequireFields<MutationrespondToHugRequestArgs, 'requestId' | 'accept'>>;
}>;

export type UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isAnonymous?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  moods?: Resolver<Maybe<Array<Maybe<ResolversTypes['MoodEntry']>>>, ParentType, ContextType>;
  hugs?: Resolver<Maybe<Array<Maybe<ResolversTypes['Hug']>>>, ParentType, ContextType>;
  friends?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoodEntryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MoodEntry'] = ResolversParentTypes['MoodEntry']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  mood?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  intensity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isPublic?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HugResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Hug'] = ResolversParentTypes['Hug']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  senderId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  sender?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  recipientId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  recipient?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  type?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isRead?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fromUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  toUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  read?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoodStreakResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MoodStreak'] = ResolversParentTypes['MoodStreak']> = ResolversObject<{
  currentStreak?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  longestStreak?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  lastMoodDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalMoods?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PublicMoodResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PublicMood'] = ResolversParentTypes['PublicMood']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  userId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  mood?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  intensity?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HugRequestResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HugRequest'] = ResolversParentTypes['HugRequest']> = ResolversObject<{
  id?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  requesterId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  requester?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  recipientId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  recipient?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  respondedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type AuthPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['AuthPayload'] = ResolversParentTypes['AuthPayload']> = ResolversObject<{
  accessToken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type ClientInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['ClientInfo'] = ResolversParentTypes['ClientInfo']> = ResolversObject<{
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  buildDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  MoodEntry?: MoodEntryResolvers<ContextType>;
  Hug?: HugResolvers<ContextType>;
  MoodStreak?: MoodStreakResolvers<ContextType>;
  PublicMood?: PublicMoodResolvers<ContextType>;
  HugRequest?: HugRequestResolvers<ContextType>;
  AuthPayload?: AuthPayloadResolvers<ContextType>;
  ClientInfo?: ClientInfoResolvers<ContextType>;
}>;


export type MeshContext = HugMeNowApiTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".mesh/sources/HugMeNowAPI/introspectionSchema":
      return import("./sources/HugMeNowAPI/introspectionSchema") as T;
    
    default:
      return Promise.reject(new Error(`Cannot find module '${relativeModuleId}'.`));
  }
};

const rootStore = new MeshStore('.mesh', new FsStoreStorageAdapter({
  cwd: baseDir,
  importFn,
  fileType: "ts",
}), {
  readonly: true,
  validate: false
});

export const rawServeConfig: YamlConfig.Config['serve'] = {"endpoint":"/graphql","playground":true,"cors":{"origin":"*"},"port":5000,"host":"0.0.0.0"} as any
export async function getMeshOptions(): Promise<GetMeshOptions> {
const pubsub = new PubSub();
const sourcesStore = rootStore.child('sources');
const logger = new DefaultLogger("");
const MeshCache = await import("@graphql-mesh/cache-localforage").then(handleImport);
  const cache = new MeshCache({
      ...{},
      importFn,
      store: rootStore.child('cache'),
      pubsub,
      logger,
    })
const fetchFn = await import('@whatwg-node/fetch').then(m => m?.fetch || m);
const sources: MeshResolvedSource[] = [];
const transforms: MeshTransform[] = [];
const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
const hugMeNowApiTransforms = [];
const HugMeNowApiHandler = await import("@graphql-mesh/graphql").then(handleImport);
const hugMeNowApiHandler = new HugMeNowApiHandler({
              name: "HugMeNowAPI",
              config: {"endpoint":"http://localhost:3002/graphql","operationHeaders":{"Authorization":"{env.GRAPHQL_AUTH_TOKEN}"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("HugMeNowAPI"),
              logger: logger.child({ source: "HugMeNowAPI" }),
              importFn,
            });
sources[0] = {
          name: 'HugMeNowAPI',
          handler: hugMeNowApiHandler,
          transforms: hugMeNowApiTransforms
        }
const additionalTypeDefs = [parse("extend type Query {\n  clientInfo: ClientInfo!\n  friendsMoods: [PublicMood]\n  userMoods(userId: ID, limit: Int, offset: Int): [MoodEntry]\n  sentHugs(userId: ID, limit: Int, offset: Int): [Hug]\n  receivedHugs(userId: ID, limit: Int, offset: Int): [Hug]\n}\n\nextend type PublicMood {\n  score: Int\n}\n\nextend type Hug {\n  fromUser: User\n  toUser: User\n  read: Boolean\n}\n\ntype ClientInfo {\n  version: String!\n  buildDate: String!\n}"),] as any[];
const RootTransform_0 = await import("@graphql-mesh/transform-naming-convention").then(handleImport);
transforms[0] = new RootTransform_0({
            apiName: '',
            config: {"typeNames":"pascalCase","fieldNames":"camelCase","enumValues":"upperCase"},
            baseDir,
            cache,
            pubsub,
            importFn,
            logger,
          })
const RootTransform_1 = await import("@graphql-mesh/transform-rename").then(handleImport);
transforms[1] = new RootTransform_1({
            apiName: '',
            config: {"renames":[{"from":{"type":"Query","field":"publicMoods"},"to":"publicMoods"},{"from":{"type":"Query","field":"friendsMoods"},"to":"publicMoods"},{"from":{"type":"Query","field":"userMoods"},"to":"moods"},{"from":{"type":"Query","field":"sentHugs"},"to":"hugs"},{"from":{"type":"Query","field":"receivedHugs"},"to":"hugs"},{"from":{"type":"PublicMood","field":"score"},"to":"intensity"},{"from":{"type":"Hug","field":"fromUser"},"to":"sender"},{"from":{"type":"Hug","field":"toUser"},"to":"recipient"},{"from":{"type":"Hug","field":"read"},"to":"isRead"}]},
            baseDir,
            cache,
            pubsub,
            importFn,
            logger,
          })
const additionalResolvers = await Promise.all([
        import("../mesh-resolvers.js")
            .then(m => m.resolvers || m.default || m)
      ]);
const Merger = await import("@graphql-mesh/merger-bare").then(handleImport);
const merger = new Merger({
        cache,
        pubsub,
        logger: logger.child({ merger: "bare" }),
        store: rootStore.child("bare")
      })

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
      
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltMesh,
    rawServeConfig: {"endpoint":"/graphql","playground":true,"cors":{"origin":"*"},"port":5000,"host":"0.0.0.0"},
  })
}


let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltMesh(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
        .then(meshOptions => getMesh(meshOptions))
        .then(newMesh =>
          meshInstance$.then(oldMesh => {
            oldMesh.destroy()
            meshInstance$ = Promise.resolve(newMesh)
          })
        ).catch(err => {
          console.error("Mesh polling failed so the existing version will be used:", err);
        });
      }, pollingInterval)
    }
    meshInstance$ = getMeshOptions().then(meshOptions => getMesh(meshOptions)).then(mesh => {
      const id = mesh.pubsub.subscribe('destroy', () => {
        meshInstance$ = undefined;
        mesh.pubsub.unsubscribe(id);
      });
      return mesh;
    });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) => getBuiltMesh().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) => getBuiltMesh().then(({ subscribe }) => subscribe(...args));