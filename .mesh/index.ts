// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
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
import type { PostGraphileApiTypes } from './sources/PostGraphileAPI/types';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };



/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  UUID: { input: any; output: any; }
  HMNDatetime: { input: any; output: any; }
  HMNCursor: { input: any; output: any; }
};

/** The root query type which gives access points into the data universe. */
export type Query = HMNNode & {
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<HMNNode>;
  /** Reads and enables pagination through a set of `Friendship`. */
  allFriendships?: Maybe<HMNFriendshipsConnection>;
  /** Reads and enables pagination through a set of `HugRequest`. */
  allHugRequests?: Maybe<HMNHugRequestsConnection>;
  /** Reads and enables pagination through a set of `Hug`. */
  allHugs?: Maybe<HMNHugsConnection>;
  /** Reads and enables pagination through a set of `Migration`. */
  allMigrations?: Maybe<HMNMigrationsConnection>;
  /** Reads and enables pagination through a set of `Mood`. */
  allMoods?: Maybe<HMNMoodsConnection>;
  /** Reads and enables pagination through a set of `User`. */
  allUsers?: Maybe<HMNUsersConnection>;
  friendshipById?: Maybe<Friendship>;
  friendshipByRequesterIdAndRecipientId?: Maybe<Friendship>;
  hugRequestById?: Maybe<HugRequest>;
  hugById?: Maybe<Hug>;
  migrationById?: Maybe<HMNMigration>;
  migrationByName?: Maybe<HMNMigration>;
  moodById?: Maybe<Mood>;
  userById?: Maybe<User>;
  userByUsername?: Maybe<User>;
  userByEmail?: Maybe<User>;
  /** Reads a single `Friendship` using its globally unique `ID`. */
  friendship?: Maybe<Friendship>;
  /** Reads a single `HugRequest` using its globally unique `ID`. */
  hugRequest?: Maybe<HugRequest>;
  /** Reads a single `Hug` using its globally unique `ID`. */
  hug?: Maybe<Hug>;
  /** Reads a single `Migration` using its globally unique `ID`. */
  migration?: Maybe<HMNMigration>;
  /** Reads a single `Mood` using its globally unique `ID`. */
  mood?: Maybe<Mood>;
  /** Reads a single `User` using its globally unique `ID`. */
  user?: Maybe<User>;
  clientInfo: HMNClientInfo;
  publicMoods: Array<Mood>;
  userMoods: Array<Mood>;
  moodStreak: MoodStreak;
  communityHugRequests: Array<HugRequest>;
  receivedHugs: Array<Hug>;
  sentHugs: Array<Hug>;
  pendingHugRequests: Array<HugRequest>;
  friendsMoods: Array<Mood>;
};


/** The root query type which gives access points into the data universe. */
export type QuerynodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryallFriendshipsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNFriendshipsOrderBy>>;
  condition?: InputMaybe<HMNFriendshipCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallHugRequestsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNHugRequestsOrderBy>>;
  condition?: InputMaybe<HMNHugRequestCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallHugsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNHugsOrderBy>>;
  condition?: InputMaybe<HMNHugCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallMigrationsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNMigrationsOrderBy>>;
  condition?: InputMaybe<HMNMigrationCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallMoodsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNMoodsOrderBy>>;
  condition?: InputMaybe<HMNMoodCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallUsersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNUsersOrderBy>>;
  condition?: InputMaybe<HMNUserCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryfriendshipByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryfriendshipByRequesterIdAndRecipientIdArgs = {
  requesterId: Scalars['UUID']['input'];
  recipientId: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryhugRequestByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryhugByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerymigrationByIdArgs = {
  id: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerymigrationByNameArgs = {
  name: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerymoodByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryuserByIdArgs = {
  id: Scalars['UUID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryuserByUsernameArgs = {
  username: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryuserByEmailArgs = {
  email: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryfriendshipArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryhugRequestArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryhugArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerymigrationArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerymoodArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryuserArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerypublicMoodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryuserMoodsArgs = {
  userId?: InputMaybe<Scalars['ID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QuerymoodStreakArgs = {
  userId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QuerycommunityHugRequestsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QueryreceivedHugsArgs = {
  userId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QuerysentHugsArgs = {
  userId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


/** The root query type which gives access points into the data universe. */
export type QuerypendingHugRequestsArgs = {
  userId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryfriendsMoodsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  /** Creates a single `Friendship`. */
  createFriendship?: Maybe<HMNCreateFriendshipPayload>;
  /** Creates a single `HugRequest`. */
  createHugRequest?: Maybe<HMNCreateHugRequestPayload>;
  /** Creates a single `Hug`. */
  createHug?: Maybe<HMNCreateHugPayload>;
  /** Creates a single `Migration`. */
  createMigration?: Maybe<HMNCreateMigrationPayload>;
  /** Creates a single `Mood`. */
  createMood?: Maybe<HMNCreateMoodPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<HMNCreateUserPayload>;
  /** Updates a single `Friendship` using its globally unique id and a patch. */
  updateFriendship?: Maybe<HMNUpdateFriendshipPayload>;
  /** Updates a single `Friendship` using a unique key and a patch. */
  updateFriendshipById?: Maybe<HMNUpdateFriendshipPayload>;
  /** Updates a single `Friendship` using a unique key and a patch. */
  updateFriendshipByRequesterIdAndRecipientId?: Maybe<HMNUpdateFriendshipPayload>;
  /** Updates a single `HugRequest` using its globally unique id and a patch. */
  updateHugRequest?: Maybe<HMNUpdateHugRequestPayload>;
  /** Updates a single `HugRequest` using a unique key and a patch. */
  updateHugRequestById?: Maybe<HMNUpdateHugRequestPayload>;
  /** Updates a single `Hug` using its globally unique id and a patch. */
  updateHug?: Maybe<HMNUpdateHugPayload>;
  /** Updates a single `Hug` using a unique key and a patch. */
  updateHugById?: Maybe<HMNUpdateHugPayload>;
  /** Updates a single `Migration` using its globally unique id and a patch. */
  updateMigration?: Maybe<HMNUpdateMigrationPayload>;
  /** Updates a single `Migration` using a unique key and a patch. */
  updateMigrationById?: Maybe<HMNUpdateMigrationPayload>;
  /** Updates a single `Migration` using a unique key and a patch. */
  updateMigrationByName?: Maybe<HMNUpdateMigrationPayload>;
  /** Updates a single `Mood` using its globally unique id and a patch. */
  updateMood?: Maybe<HMNUpdateMoodPayload>;
  /** Updates a single `Mood` using a unique key and a patch. */
  updateMoodById?: Maybe<HMNUpdateMoodPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUser?: Maybe<HMNUpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserById?: Maybe<HMNUpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByUsername?: Maybe<HMNUpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByEmail?: Maybe<HMNUpdateUserPayload>;
  /** Deletes a single `Friendship` using its globally unique id. */
  deleteFriendship?: Maybe<HMNDeleteFriendshipPayload>;
  /** Deletes a single `Friendship` using a unique key. */
  deleteFriendshipById?: Maybe<HMNDeleteFriendshipPayload>;
  /** Deletes a single `Friendship` using a unique key. */
  deleteFriendshipByRequesterIdAndRecipientId?: Maybe<HMNDeleteFriendshipPayload>;
  /** Deletes a single `HugRequest` using its globally unique id. */
  deleteHugRequest?: Maybe<HMNDeleteHugRequestPayload>;
  /** Deletes a single `HugRequest` using a unique key. */
  deleteHugRequestById?: Maybe<HMNDeleteHugRequestPayload>;
  /** Deletes a single `Hug` using its globally unique id. */
  deleteHug?: Maybe<HMNDeleteHugPayload>;
  /** Deletes a single `Hug` using a unique key. */
  deleteHugById?: Maybe<HMNDeleteHugPayload>;
  /** Deletes a single `Migration` using its globally unique id. */
  deleteMigration?: Maybe<HMNDeleteMigrationPayload>;
  /** Deletes a single `Migration` using a unique key. */
  deleteMigrationById?: Maybe<HMNDeleteMigrationPayload>;
  /** Deletes a single `Migration` using a unique key. */
  deleteMigrationByName?: Maybe<HMNDeleteMigrationPayload>;
  /** Deletes a single `Mood` using its globally unique id. */
  deleteMood?: Maybe<HMNDeleteMoodPayload>;
  /** Deletes a single `Mood` using a unique key. */
  deleteMoodById?: Maybe<HMNDeleteMoodPayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUser?: Maybe<HMNDeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserById?: Maybe<HMNDeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByUsername?: Maybe<HMNDeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByEmail?: Maybe<HMNDeleteUserPayload>;
  sendHug?: Maybe<Hug>;
  createMoodEntry?: Maybe<Mood>;
  respondToHugRequest?: Maybe<HugRequest>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateFriendshipArgs = {
  input: HMNCreateFriendshipInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateHugRequestArgs = {
  input: HMNCreateHugRequestInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateHugArgs = {
  input: HMNCreateHugInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateMigrationArgs = {
  input: HMNCreateMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateMoodArgs = {
  input: HMNCreateMoodInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateUserArgs = {
  input: HMNCreateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateFriendshipArgs = {
  input: HMNUpdateFriendshipInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateFriendshipByIdArgs = {
  input: HMNUpdateFriendshipByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateFriendshipByRequesterIdAndRecipientIdArgs = {
  input: HMNUpdateFriendshipByRequesterIdAndRecipientIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateHugRequestArgs = {
  input: HMNUpdateHugRequestInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateHugRequestByIdArgs = {
  input: HMNUpdateHugRequestByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateHugArgs = {
  input: HMNUpdateHugInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateHugByIdArgs = {
  input: HMNUpdateHugByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMigrationArgs = {
  input: HMNUpdateMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMigrationByIdArgs = {
  input: HMNUpdateMigrationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMigrationByNameArgs = {
  input: HMNUpdateMigrationByNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMoodArgs = {
  input: HMNUpdateMoodInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMoodByIdArgs = {
  input: HMNUpdateMoodByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateUserArgs = {
  input: HMNUpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateUserByIdArgs = {
  input: HMNUpdateUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateUserByUsernameArgs = {
  input: HMNUpdateUserByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateUserByEmailArgs = {
  input: HMNUpdateUserByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteFriendshipArgs = {
  input: HMNDeleteFriendshipInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteFriendshipByIdArgs = {
  input: HMNDeleteFriendshipByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteFriendshipByRequesterIdAndRecipientIdArgs = {
  input: HMNDeleteFriendshipByRequesterIdAndRecipientIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteHugRequestArgs = {
  input: HMNDeleteHugRequestInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteHugRequestByIdArgs = {
  input: HMNDeleteHugRequestByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteHugArgs = {
  input: HMNDeleteHugInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteHugByIdArgs = {
  input: HMNDeleteHugByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMigrationArgs = {
  input: HMNDeleteMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMigrationByIdArgs = {
  input: HMNDeleteMigrationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMigrationByNameArgs = {
  input: HMNDeleteMigrationByNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMoodArgs = {
  input: HMNDeleteMoodInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMoodByIdArgs = {
  input: HMNDeleteMoodByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteUserArgs = {
  input: HMNDeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteUserByIdArgs = {
  input: HMNDeleteUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteUserByUsernameArgs = {
  input: HMNDeleteUserByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteUserByEmailArgs = {
  input: HMNDeleteUserByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationsendHugArgs = {
  input: HugInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateMoodEntryArgs = {
  moodInput: MoodInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationrespondToHugRequestArgs = {
  requestId: Scalars['ID']['input'];
  accept: Scalars['Boolean']['input'];
};

/** An object with a globally unique `ID`. */
export type HMNNode = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** A connection to a list of `Friendship` values. */
export type HMNFriendshipsConnection = {
  /** A list of `Friendship` objects. */
  nodes: Array<Friendship>;
  /** A list of edges which contains the `Friendship` and cursor to aid in pagination. */
  edges: Array<HMNFriendshipsEdge>;
  /** Information to aid in pagination. */
  pageInfo: HMNPageInfo;
  /** The count of *all* `Friendship` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

export type Friendship = HMNNode & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['UUID']['output'];
  requesterId: Scalars['UUID']['output'];
  recipientId: Scalars['UUID']['output'];
  status: Scalars['String']['output'];
  followsMood: Scalars['Boolean']['output'];
  createdAt: Scalars['HMNDatetime']['output'];
  updatedAt?: Maybe<Scalars['HMNDatetime']['output']>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRecipientId?: Maybe<User>;
};

/** A user of the application */
export type User = HMNNode & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** The primary unique identifier for the user */
  id: Scalars['UUID']['output'];
  /** The username used to login */
  username: Scalars['String']['output'];
  /** The email address of the user */
  email: Scalars['String']['output'];
  /** The display name of the user */
  name: Scalars['String']['output'];
  password: Scalars['String']['output'];
  profileImage?: Maybe<Scalars['String']['output']>;
  /** Whether this user is anonymous */
  isAnonymous: Scalars['Boolean']['output'];
  createdAt: Scalars['HMNDatetime']['output'];
  updatedAt: Scalars['HMNDatetime']['output'];
  /** Reads and enables pagination through a set of `Mood`. */
  moodsByUserId: HMNMoodsConnection;
  /** Reads and enables pagination through a set of `Hug`. */
  hugsBySenderId: HMNHugsConnection;
  /** Reads and enables pagination through a set of `Hug`. */
  hugsByRecipientId: HMNHugsConnection;
  /** Reads and enables pagination through a set of `HugRequest`. */
  hugRequestsByRequesterId: HMNHugRequestsConnection;
  /** Reads and enables pagination through a set of `HugRequest`. */
  hugRequestsByRecipientId: HMNHugRequestsConnection;
  /** Reads and enables pagination through a set of `Friendship`. */
  friendshipsByRequesterId: HMNFriendshipsConnection;
  /** Reads and enables pagination through a set of `Friendship`. */
  friendshipsByRecipientId: HMNFriendshipsConnection;
};


/** A user of the application */
export type UsermoodsByUserIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNMoodsOrderBy>>;
  condition?: InputMaybe<HMNMoodCondition>;
};


/** A user of the application */
export type UserhugsBySenderIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNHugsOrderBy>>;
  condition?: InputMaybe<HMNHugCondition>;
};


/** A user of the application */
export type UserhugsByRecipientIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNHugsOrderBy>>;
  condition?: InputMaybe<HMNHugCondition>;
};


/** A user of the application */
export type UserhugRequestsByRequesterIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNHugRequestsOrderBy>>;
  condition?: InputMaybe<HMNHugRequestCondition>;
};


/** A user of the application */
export type UserhugRequestsByRecipientIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNHugRequestsOrderBy>>;
  condition?: InputMaybe<HMNHugRequestCondition>;
};


/** A user of the application */
export type UserfriendshipsByRequesterIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNFriendshipsOrderBy>>;
  condition?: InputMaybe<HMNFriendshipCondition>;
};


/** A user of the application */
export type UserfriendshipsByRecipientIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['HMNCursor']['input']>;
  after?: InputMaybe<Scalars['HMNCursor']['input']>;
  orderBy?: InputMaybe<Array<HMNFriendshipsOrderBy>>;
  condition?: InputMaybe<HMNFriendshipCondition>;
};

/** A connection to a list of `Mood` values. */
export type HMNMoodsConnection = {
  /** A list of `Mood` objects. */
  nodes: Array<Mood>;
  /** A list of edges which contains the `Mood` and cursor to aid in pagination. */
  edges: Array<HMNMoodsEdge>;
  /** Information to aid in pagination. */
  pageInfo: HMNPageInfo;
  /** The count of *all* `Mood` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A mood entry recorded by a user */
export type Mood = HMNNode & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['UUID']['output'];
  /** The mood score from 1-10 */
  intensity: Scalars['Int']['output'];
  note?: Maybe<Scalars['String']['output']>;
  /** Whether this mood entry is publicly visible */
  public: Scalars['Boolean']['output'];
  userId: Scalars['UUID']['output'];
  createdAt: Scalars['HMNDatetime']['output'];
  /** Reads a single `User` that is related to this `Mood`. */
  userByUserId?: Maybe<User>;
};

/** A `Mood` edge in the connection. */
export type HMNMoodsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['HMNCursor']['output']>;
  /** The `Mood` at the end of the edge. */
  node: Mood;
};

/** Information about pagination in a connection. */
export type HMNPageInfo = {
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['HMNCursor']['output']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['HMNCursor']['output']>;
};

/** Methods to use when ordering `Mood`. */
export type HMNMoodsOrderBy =
  | 'NATURAL'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'SCORE_ASC'
  | 'SCORE_DESC'
  | 'NOTE_ASC'
  | 'NOTE_DESC'
  | 'IS_PUBLIC_ASC'
  | 'IS_PUBLIC_DESC'
  | 'USER_ID_ASC'
  | 'USER_ID_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

/** A condition to be used against `Mood` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type HMNMoodCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `score` field. */
  score?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `note` field. */
  note?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isPublic` field. */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** A connection to a list of `Hug` values. */
export type HMNHugsConnection = {
  /** A list of `Hug` objects. */
  nodes: Array<Hug>;
  /** A list of edges which contains the `Hug` and cursor to aid in pagination. */
  edges: Array<HMNHugsEdge>;
  /** Information to aid in pagination. */
  pageInfo: HMNPageInfo;
  /** The count of *all* `Hug` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A virtual hug sent from one user to another */
export type Hug = HMNNode & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['UUID']['output'];
  /** The type of hug (QUICK, WARM, SUPPORTIVE, etc) */
  type: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  senderId: Scalars['UUID']['output'];
  recipientId: Scalars['UUID']['output'];
  /** Whether the recipient has read the hug */
  read: Scalars['Boolean']['output'];
  createdAt: Scalars['HMNDatetime']['output'];
  /** Reads a single `User` that is related to this `Hug`. */
  userBySenderId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Hug`. */
  userByRecipientId?: Maybe<User>;
  fromUser?: Maybe<User>;
  toUser?: Maybe<User>;
};

/** A `Hug` edge in the connection. */
export type HMNHugsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['HMNCursor']['output']>;
  /** The `Hug` at the end of the edge. */
  node: Hug;
};

/** Methods to use when ordering `Hug`. */
export type HMNHugsOrderBy =
  | 'NATURAL'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'TYPE_ASC'
  | 'TYPE_DESC'
  | 'MESSAGE_ASC'
  | 'MESSAGE_DESC'
  | 'SENDER_ID_ASC'
  | 'SENDER_ID_DESC'
  | 'RECIPIENT_ID_ASC'
  | 'RECIPIENT_ID_DESC'
  | 'IS_READ_ASC'
  | 'IS_READ_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

/** A condition to be used against `Hug` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type HMNHugCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `type` field. */
  type?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `message` field. */
  message?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `senderId` field. */
  senderId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `recipientId` field. */
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `isRead` field. */
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** A connection to a list of `HugRequest` values. */
export type HMNHugRequestsConnection = {
  /** A list of `HugRequest` objects. */
  nodes: Array<HugRequest>;
  /** A list of edges which contains the `HugRequest` and cursor to aid in pagination. */
  edges: Array<HMNHugRequestsEdge>;
  /** Information to aid in pagination. */
  pageInfo: HMNPageInfo;
  /** The count of *all* `HugRequest` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A request for a hug from another user or the community */
export type HugRequest = HMNNode & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['UUID']['output'];
  message?: Maybe<Scalars['String']['output']>;
  requesterId: Scalars['UUID']['output'];
  recipientId?: Maybe<Scalars['UUID']['output']>;
  /** Whether this is a request to the community rather than a specific user */
  isCommunityRequest: Scalars['Boolean']['output'];
  /** The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED) */
  status: Scalars['String']['output'];
  requestedAt: Scalars['HMNDatetime']['output'];
  respondedAt?: Maybe<Scalars['HMNDatetime']['output']>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRecipientId?: Maybe<User>;
  requester?: Maybe<User>;
};

/** A `HugRequest` edge in the connection. */
export type HMNHugRequestsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['HMNCursor']['output']>;
  /** The `HugRequest` at the end of the edge. */
  node: HugRequest;
};

/** Methods to use when ordering `HugRequest`. */
export type HMNHugRequestsOrderBy =
  | 'NATURAL'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'MESSAGE_ASC'
  | 'MESSAGE_DESC'
  | 'REQUESTER_ID_ASC'
  | 'REQUESTER_ID_DESC'
  | 'RECIPIENT_ID_ASC'
  | 'RECIPIENT_ID_DESC'
  | 'IS_COMMUNITY_REQUEST_ASC'
  | 'IS_COMMUNITY_REQUEST_DESC'
  | 'STATUS_ASC'
  | 'STATUS_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'RESPONDED_AT_ASC'
  | 'RESPONDED_AT_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

/**
 * A condition to be used against `HugRequest` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type HMNHugRequestCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `message` field. */
  message?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `requesterId` field. */
  requesterId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `recipientId` field. */
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `isCommunityRequest` field. */
  isCommunityRequest?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  /** Checks for equality with the object’s `respondedAt` field. */
  respondedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** Methods to use when ordering `Friendship`. */
export type HMNFriendshipsOrderBy =
  | 'NATURAL'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'REQUESTER_ID_ASC'
  | 'REQUESTER_ID_DESC'
  | 'RECIPIENT_ID_ASC'
  | 'RECIPIENT_ID_DESC'
  | 'STATUS_ASC'
  | 'STATUS_DESC'
  | 'FOLLOWS_MOOD_ASC'
  | 'FOLLOWS_MOOD_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'UPDATED_AT_ASC'
  | 'UPDATED_AT_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

/**
 * A condition to be used against `Friendship` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type HMNFriendshipCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `requesterId` field. */
  requesterId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `recipientId` field. */
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `followsMood` field. */
  followsMood?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** A `Friendship` edge in the connection. */
export type HMNFriendshipsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['HMNCursor']['output']>;
  /** The `Friendship` at the end of the edge. */
  node: Friendship;
};

/** A connection to a list of `Migration` values. */
export type HMNMigrationsConnection = {
  /** A list of `Migration` objects. */
  nodes: Array<HMNMigration>;
  /** A list of edges which contains the `Migration` and cursor to aid in pagination. */
  edges: Array<HMNMigrationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: HMNPageInfo;
  /** The count of *all* `Migration` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

export type HMNMigration = HMNNode & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  appliedAt?: Maybe<Scalars['HMNDatetime']['output']>;
};

/** A `Migration` edge in the connection. */
export type HMNMigrationsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['HMNCursor']['output']>;
  /** The `Migration` at the end of the edge. */
  node: HMNMigration;
};

/** Methods to use when ordering `Migration`. */
export type HMNMigrationsOrderBy =
  | 'NATURAL'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'APPLIED_AT_ASC'
  | 'APPLIED_AT_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

/**
 * A condition to be used against `Migration` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type HMNMigrationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `appliedAt` field. */
  appliedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** A connection to a list of `User` values. */
export type HMNUsersConnection = {
  /** A list of `User` objects. */
  nodes: Array<User>;
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<HMNUsersEdge>;
  /** Information to aid in pagination. */
  pageInfo: HMNPageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `User` edge in the connection. */
export type HMNUsersEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['HMNCursor']['output']>;
  /** The `User` at the end of the edge. */
  node: User;
};

/** Methods to use when ordering `User`. */
export type HMNUsersOrderBy =
  | 'NATURAL'
  | 'ID_ASC'
  | 'ID_DESC'
  | 'USERNAME_ASC'
  | 'USERNAME_DESC'
  | 'EMAIL_ASC'
  | 'EMAIL_DESC'
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'PASSWORD_ASC'
  | 'PASSWORD_DESC'
  | 'AVATAR_URL_ASC'
  | 'AVATAR_URL_DESC'
  | 'IS_ANONYMOUS_ASC'
  | 'IS_ANONYMOUS_DESC'
  | 'CREATED_AT_ASC'
  | 'CREATED_AT_DESC'
  | 'UPDATED_AT_ASC'
  | 'UPDATED_AT_DESC'
  | 'PRIMARY_KEY_ASC'
  | 'PRIMARY_KEY_DESC';

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type HMNUserCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** Checks for equality with the object’s `username` field. */
  username?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `email` field. */
  email?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `password` field. */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `avatarUrl` field. */
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `isAnonymous` field. */
  isAnonymous?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** The output of our create `Friendship` mutation. */
export type HMNCreateFriendshipPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Friendship` that was created by this mutation. */
  friendship?: Maybe<Friendship>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `Friendship`. May be used by Relay 1. */
  friendshipEdge?: Maybe<HMNFriendshipsEdge>;
};


/** The output of our create `Friendship` mutation. */
export type HMNCreateFriendshipPayloadfriendshipEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNFriendshipsOrderBy>>;
};

/** All input for the create `Friendship` mutation. */
export type HMNCreateFriendshipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Friendship` to be created by this mutation. */
  friendship: HMNFriendshipInput;
};

/** An input for mutations affecting `Friendship` */
export type HMNFriendshipInput = {
  id: Scalars['UUID']['input'];
  requesterId: Scalars['UUID']['input'];
  recipientId: Scalars['UUID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  followsMood?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  updatedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** The output of our create `HugRequest` mutation. */
export type HMNCreateHugRequestPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `HugRequest` that was created by this mutation. */
  hugRequest?: Maybe<HugRequest>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `HugRequest`. May be used by Relay 1. */
  hugRequestEdge?: Maybe<HMNHugRequestsEdge>;
};


/** The output of our create `HugRequest` mutation. */
export type HMNCreateHugRequestPayloadhugRequestEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNHugRequestsOrderBy>>;
};

/** All input for the create `HugRequest` mutation. */
export type HMNCreateHugRequestInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `HugRequest` to be created by this mutation. */
  hugRequest: HugRequestInput;
};

export type HugRequestInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  requesterId: Scalars['ID']['input'];
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Whether this is a request to the community rather than a specific user */
  isCommunityRequest?: InputMaybe<Scalars['Boolean']['input']>;
  /** The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED) */
  status?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  respondedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** The output of our create `Hug` mutation. */
export type HMNCreateHugPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Hug` that was created by this mutation. */
  hug?: Maybe<Hug>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Hug`. */
  userBySenderId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Hug`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `Hug`. May be used by Relay 1. */
  hugEdge?: Maybe<HMNHugsEdge>;
};


/** The output of our create `Hug` mutation. */
export type HMNCreateHugPayloadhugEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNHugsOrderBy>>;
};

/** All input for the create `Hug` mutation. */
export type HMNCreateHugInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Hug` to be created by this mutation. */
  hug: HugInput;
};

export type HugInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The type of hug (QUICK, WARM, SUPPORTIVE, etc) */
  type: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  senderId: Scalars['ID']['input'];
  recipientId: Scalars['ID']['input'];
  /** Whether the recipient has read the hug */
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** The output of our create `Migration` mutation. */
export type HMNCreateMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Migration` that was created by this mutation. */
  migration?: Maybe<HMNMigration>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Migration`. May be used by Relay 1. */
  migrationEdge?: Maybe<HMNMigrationsEdge>;
};


/** The output of our create `Migration` mutation. */
export type HMNCreateMigrationPayloadmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNMigrationsOrderBy>>;
};

/** All input for the create `Migration` mutation. */
export type HMNCreateMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Migration` to be created by this mutation. */
  migration: HMNMigrationInput;
};

/** An input for mutations affecting `Migration` */
export type HMNMigrationInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  appliedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** The output of our create `Mood` mutation. */
export type HMNCreateMoodPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Mood` that was created by this mutation. */
  mood?: Maybe<Mood>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Mood`. */
  userByUserId?: Maybe<User>;
  /** An edge for our `Mood`. May be used by Relay 1. */
  moodEdge?: Maybe<HMNMoodsEdge>;
};


/** The output of our create `Mood` mutation. */
export type HMNCreateMoodPayloadmoodEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNMoodsOrderBy>>;
};

/** All input for the create `Mood` mutation. */
export type HMNCreateMoodInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Mood` to be created by this mutation. */
  mood: MoodInput;
};

export type MoodInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The mood score from 1-10 */
  score: Scalars['Int']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  /** Whether this mood entry is publicly visible */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['ID']['input'];
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  intensity: Scalars['Int']['input'];
  private?: InputMaybe<Scalars['Boolean']['input']>;
};

/** The output of our create `User` mutation. */
export type HMNCreateUserPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<HMNUsersEdge>;
};


/** The output of our create `User` mutation. */
export type HMNCreateUserPayloaduserEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNUsersOrderBy>>;
};

/** All input for the create `User` mutation. */
export type HMNCreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `User` to be created by this mutation. */
  user: HMNUserInput;
};

/** An input for mutations affecting `User` */
export type HMNUserInput = {
  /** The primary unique identifier for the user */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The username used to login */
  username: Scalars['String']['input'];
  /** The email address of the user */
  email: Scalars['String']['input'];
  /** The display name of the user */
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  /** Whether this user is anonymous */
  isAnonymous?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  updatedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** The output of our update `Friendship` mutation. */
export type HMNUpdateFriendshipPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Friendship` that was updated by this mutation. */
  friendship?: Maybe<Friendship>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `Friendship`. May be used by Relay 1. */
  friendshipEdge?: Maybe<HMNFriendshipsEdge>;
};


/** The output of our update `Friendship` mutation. */
export type HMNUpdateFriendshipPayloadfriendshipEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNFriendshipsOrderBy>>;
};

/** All input for the `updateFriendship` mutation. */
export type HMNUpdateFriendshipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Friendship` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Friendship` being updated. */
  friendshipPatch: HMNFriendshipPatch;
};

/** Represents an update to a `Friendship`. Fields that are set will be updated. */
export type HMNFriendshipPatch = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  requesterId?: InputMaybe<Scalars['UUID']['input']>;
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  followsMood?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  updatedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** All input for the `updateFriendshipById` mutation. */
export type HMNUpdateFriendshipByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Friendship` being updated. */
  friendshipPatch: HMNFriendshipPatch;
  id: Scalars['UUID']['input'];
};

/** All input for the `updateFriendshipByRequesterIdAndRecipientId` mutation. */
export type HMNUpdateFriendshipByRequesterIdAndRecipientIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Friendship` being updated. */
  friendshipPatch: HMNFriendshipPatch;
  requesterId: Scalars['UUID']['input'];
  recipientId: Scalars['UUID']['input'];
};

/** The output of our update `HugRequest` mutation. */
export type HMNUpdateHugRequestPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `HugRequest` that was updated by this mutation. */
  hugRequest?: Maybe<HugRequest>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `HugRequest`. May be used by Relay 1. */
  hugRequestEdge?: Maybe<HMNHugRequestsEdge>;
};


/** The output of our update `HugRequest` mutation. */
export type HMNUpdateHugRequestPayloadhugRequestEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNHugRequestsOrderBy>>;
};

/** All input for the `updateHugRequest` mutation. */
export type HMNUpdateHugRequestInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `HugRequest` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `HugRequest` being updated. */
  hugRequestPatch: HMNHugRequestPatch;
};

/** Represents an update to a `HugRequest`. Fields that are set will be updated. */
export type HMNHugRequestPatch = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  requesterId?: InputMaybe<Scalars['UUID']['input']>;
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Whether this is a request to the community rather than a specific user */
  isCommunityRequest?: InputMaybe<Scalars['Boolean']['input']>;
  /** The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED) */
  status?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  respondedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** All input for the `updateHugRequestById` mutation. */
export type HMNUpdateHugRequestByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `HugRequest` being updated. */
  hugRequestPatch: HMNHugRequestPatch;
  id: Scalars['UUID']['input'];
};

/** The output of our update `Hug` mutation. */
export type HMNUpdateHugPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Hug` that was updated by this mutation. */
  hug?: Maybe<Hug>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Hug`. */
  userBySenderId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Hug`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `Hug`. May be used by Relay 1. */
  hugEdge?: Maybe<HMNHugsEdge>;
};


/** The output of our update `Hug` mutation. */
export type HMNUpdateHugPayloadhugEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNHugsOrderBy>>;
};

/** All input for the `updateHug` mutation. */
export type HMNUpdateHugInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Hug` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Hug` being updated. */
  hugPatch: HMNHugPatch;
};

/** Represents an update to a `Hug`. Fields that are set will be updated. */
export type HMNHugPatch = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The type of hug (QUICK, WARM, SUPPORTIVE, etc) */
  type?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  senderId?: InputMaybe<Scalars['UUID']['input']>;
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Whether the recipient has read the hug */
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** All input for the `updateHugById` mutation. */
export type HMNUpdateHugByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Hug` being updated. */
  hugPatch: HMNHugPatch;
  id: Scalars['UUID']['input'];
};

/** The output of our update `Migration` mutation. */
export type HMNUpdateMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Migration` that was updated by this mutation. */
  migration?: Maybe<HMNMigration>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Migration`. May be used by Relay 1. */
  migrationEdge?: Maybe<HMNMigrationsEdge>;
};


/** The output of our update `Migration` mutation. */
export type HMNUpdateMigrationPayloadmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNMigrationsOrderBy>>;
};

/** All input for the `updateMigration` mutation. */
export type HMNUpdateMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Migration` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Migration` being updated. */
  migrationPatch: HMNMigrationPatch;
};

/** Represents an update to a `Migration`. Fields that are set will be updated. */
export type HMNMigrationPatch = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  appliedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** All input for the `updateMigrationById` mutation. */
export type HMNUpdateMigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Migration` being updated. */
  migrationPatch: HMNMigrationPatch;
  id: Scalars['Int']['input'];
};

/** All input for the `updateMigrationByName` mutation. */
export type HMNUpdateMigrationByNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Migration` being updated. */
  migrationPatch: HMNMigrationPatch;
  name: Scalars['String']['input'];
};

/** The output of our update `Mood` mutation. */
export type HMNUpdateMoodPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Mood` that was updated by this mutation. */
  mood?: Maybe<Mood>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Mood`. */
  userByUserId?: Maybe<User>;
  /** An edge for our `Mood`. May be used by Relay 1. */
  moodEdge?: Maybe<HMNMoodsEdge>;
};


/** The output of our update `Mood` mutation. */
export type HMNUpdateMoodPayloadmoodEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNMoodsOrderBy>>;
};

/** All input for the `updateMood` mutation. */
export type HMNUpdateMoodInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Mood` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Mood` being updated. */
  moodPatch: HMNMoodPatch;
};

/** Represents an update to a `Mood`. Fields that are set will be updated. */
export type HMNMoodPatch = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The mood score from 1-10 */
  score?: InputMaybe<Scalars['Int']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  /** Whether this mood entry is publicly visible */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** All input for the `updateMoodById` mutation. */
export type HMNUpdateMoodByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Mood` being updated. */
  moodPatch: HMNMoodPatch;
  id: Scalars['UUID']['input'];
};

/** The output of our update `User` mutation. */
export type HMNUpdateUserPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<HMNUsersEdge>;
};


/** The output of our update `User` mutation. */
export type HMNUpdateUserPayloaduserEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNUsersOrderBy>>;
};

/** All input for the `updateUser` mutation. */
export type HMNUpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: HMNUserPatch;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type HMNUserPatch = {
  /** The primary unique identifier for the user */
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The username used to login */
  username?: InputMaybe<Scalars['String']['input']>;
  /** The email address of the user */
  email?: InputMaybe<Scalars['String']['input']>;
  /** The display name of the user */
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
  avatarUrl?: InputMaybe<Scalars['String']['input']>;
  /** Whether this user is anonymous */
  isAnonymous?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
  updatedAt?: InputMaybe<Scalars['HMNDatetime']['input']>;
};

/** All input for the `updateUserById` mutation. */
export type HMNUpdateUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: HMNUserPatch;
  /** The primary unique identifier for the user */
  id: Scalars['UUID']['input'];
};

/** All input for the `updateUserByUsername` mutation. */
export type HMNUpdateUserByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: HMNUserPatch;
  /** The username used to login */
  username: Scalars['String']['input'];
};

/** All input for the `updateUserByEmail` mutation. */
export type HMNUpdateUserByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: HMNUserPatch;
  /** The email address of the user */
  email: Scalars['String']['input'];
};

/** The output of our delete `Friendship` mutation. */
export type HMNDeleteFriendshipPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Friendship` that was deleted by this mutation. */
  friendship?: Maybe<Friendship>;
  deletedFriendshipId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `Friendship`. May be used by Relay 1. */
  friendshipEdge?: Maybe<HMNFriendshipsEdge>;
};


/** The output of our delete `Friendship` mutation. */
export type HMNDeleteFriendshipPayloadfriendshipEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNFriendshipsOrderBy>>;
};

/** All input for the `deleteFriendship` mutation. */
export type HMNDeleteFriendshipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Friendship` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteFriendshipById` mutation. */
export type HMNDeleteFriendshipByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteFriendshipByRequesterIdAndRecipientId` mutation. */
export type HMNDeleteFriendshipByRequesterIdAndRecipientIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  requesterId: Scalars['UUID']['input'];
  recipientId: Scalars['UUID']['input'];
};

/** The output of our delete `HugRequest` mutation. */
export type HMNDeleteHugRequestPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `HugRequest` that was deleted by this mutation. */
  hugRequest?: Maybe<HugRequest>;
  deletedHugRequestId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `HugRequest`. May be used by Relay 1. */
  hugRequestEdge?: Maybe<HMNHugRequestsEdge>;
};


/** The output of our delete `HugRequest` mutation. */
export type HMNDeleteHugRequestPayloadhugRequestEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNHugRequestsOrderBy>>;
};

/** All input for the `deleteHugRequest` mutation. */
export type HMNDeleteHugRequestInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `HugRequest` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteHugRequestById` mutation. */
export type HMNDeleteHugRequestByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `Hug` mutation. */
export type HMNDeleteHugPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Hug` that was deleted by this mutation. */
  hug?: Maybe<Hug>;
  deletedHugId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Hug`. */
  userBySenderId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Hug`. */
  userByRecipientId?: Maybe<User>;
  /** An edge for our `Hug`. May be used by Relay 1. */
  hugEdge?: Maybe<HMNHugsEdge>;
};


/** The output of our delete `Hug` mutation. */
export type HMNDeleteHugPayloadhugEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNHugsOrderBy>>;
};

/** All input for the `deleteHug` mutation. */
export type HMNDeleteHugInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Hug` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteHugById` mutation. */
export type HMNDeleteHugByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `Migration` mutation. */
export type HMNDeleteMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Migration` that was deleted by this mutation. */
  migration?: Maybe<HMNMigration>;
  deletedMigrationId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Migration`. May be used by Relay 1. */
  migrationEdge?: Maybe<HMNMigrationsEdge>;
};


/** The output of our delete `Migration` mutation. */
export type HMNDeleteMigrationPayloadmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNMigrationsOrderBy>>;
};

/** All input for the `deleteMigration` mutation. */
export type HMNDeleteMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Migration` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteMigrationById` mutation. */
export type HMNDeleteMigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** All input for the `deleteMigrationByName` mutation. */
export type HMNDeleteMigrationByNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** The output of our delete `Mood` mutation. */
export type HMNDeleteMoodPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Mood` that was deleted by this mutation. */
  mood?: Maybe<Mood>;
  deletedMoodId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Mood`. */
  userByUserId?: Maybe<User>;
  /** An edge for our `Mood`. May be used by Relay 1. */
  moodEdge?: Maybe<HMNMoodsEdge>;
};


/** The output of our delete `Mood` mutation. */
export type HMNDeleteMoodPayloadmoodEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNMoodsOrderBy>>;
};

/** All input for the `deleteMood` mutation. */
export type HMNDeleteMoodInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Mood` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteMoodById` mutation. */
export type HMNDeleteMoodByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `User` mutation. */
export type HMNDeleteUserPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>;
  deletedUserId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<HMNUsersEdge>;
};


/** The output of our delete `User` mutation. */
export type HMNDeleteUserPayloaduserEdgeArgs = {
  orderBy?: InputMaybe<Array<HMNUsersOrderBy>>;
};

/** All input for the `deleteUser` mutation. */
export type HMNDeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteUserById` mutation. */
export type HMNDeleteUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The primary unique identifier for the user */
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteUserByUsername` mutation. */
export type HMNDeleteUserByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The username used to login */
  username: Scalars['String']['input'];
};

/** All input for the `deleteUserByEmail` mutation. */
export type HMNDeleteUserByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The email address of the user */
  email: Scalars['String']['input'];
};

export type HMNClientInfo = {
  version: Scalars['String']['output'];
  platform: Scalars['String']['output'];
  buildDate: Scalars['String']['output'];
  deviceInfo?: Maybe<Scalars['String']['output']>;
  features?: Maybe<Array<Scalars['String']['output']>>;
};

export type MoodStreak = {
  currentStreak: Scalars['Int']['output'];
  longestStreak: Scalars['Int']['output'];
  lastMoodDate?: Maybe<Scalars['String']['output']>;
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


/** Mapping of interface types */
export type ResolversInterfaceTypes<_RefType extends Record<string, unknown>> = ResolversObject<{
  HMNNode: ( Omit<Query, 'query' | 'node'> & { query: _RefType['Query'], node?: Maybe<_RefType['HMNNode']> } ) | ( Friendship ) | ( User ) | ( Mood ) | ( Hug ) | ( HugRequest ) | ( HMNMigration );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Mutation: ResolverTypeWrapper<{}>;
  HMNNode: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['HMNNode']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  HMNFriendshipsConnection: ResolverTypeWrapper<HMNFriendshipsConnection>;
  Friendship: ResolverTypeWrapper<Friendship>;
  UUID: ResolverTypeWrapper<Scalars['UUID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  HMNDatetime: ResolverTypeWrapper<Scalars['HMNDatetime']['output']>;
  User: ResolverTypeWrapper<User>;
  HMNMoodsConnection: ResolverTypeWrapper<HMNMoodsConnection>;
  Mood: ResolverTypeWrapper<Mood>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  HMNMoodsEdge: ResolverTypeWrapper<HMNMoodsEdge>;
  HMNCursor: ResolverTypeWrapper<Scalars['HMNCursor']['output']>;
  HMNPageInfo: ResolverTypeWrapper<HMNPageInfo>;
  HMNMoodsOrderBy: HMNMoodsOrderBy;
  HMNMoodCondition: HMNMoodCondition;
  HMNHugsConnection: ResolverTypeWrapper<HMNHugsConnection>;
  Hug: ResolverTypeWrapper<Hug>;
  HMNHugsEdge: ResolverTypeWrapper<HMNHugsEdge>;
  HMNHugsOrderBy: HMNHugsOrderBy;
  HMNHugCondition: HMNHugCondition;
  HMNHugRequestsConnection: ResolverTypeWrapper<HMNHugRequestsConnection>;
  HugRequest: ResolverTypeWrapper<HugRequest>;
  HMNHugRequestsEdge: ResolverTypeWrapper<HMNHugRequestsEdge>;
  HMNHugRequestsOrderBy: HMNHugRequestsOrderBy;
  HMNHugRequestCondition: HMNHugRequestCondition;
  HMNFriendshipsOrderBy: HMNFriendshipsOrderBy;
  HMNFriendshipCondition: HMNFriendshipCondition;
  HMNFriendshipsEdge: ResolverTypeWrapper<HMNFriendshipsEdge>;
  HMNMigrationsConnection: ResolverTypeWrapper<HMNMigrationsConnection>;
  HMNMigration: ResolverTypeWrapper<HMNMigration>;
  HMNMigrationsEdge: ResolverTypeWrapper<HMNMigrationsEdge>;
  HMNMigrationsOrderBy: HMNMigrationsOrderBy;
  HMNMigrationCondition: HMNMigrationCondition;
  HMNUsersConnection: ResolverTypeWrapper<HMNUsersConnection>;
  HMNUsersEdge: ResolverTypeWrapper<HMNUsersEdge>;
  HMNUsersOrderBy: HMNUsersOrderBy;
  HMNUserCondition: HMNUserCondition;
  HMNCreateFriendshipPayload: ResolverTypeWrapper<Omit<HMNCreateFriendshipPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNCreateFriendshipInput: HMNCreateFriendshipInput;
  HMNFriendshipInput: HMNFriendshipInput;
  HMNCreateHugRequestPayload: ResolverTypeWrapper<Omit<HMNCreateHugRequestPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNCreateHugRequestInput: HMNCreateHugRequestInput;
  HugRequestInput: HugRequestInput;
  HMNCreateHugPayload: ResolverTypeWrapper<Omit<HMNCreateHugPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNCreateHugInput: HMNCreateHugInput;
  HugInput: HugInput;
  HMNCreateMigrationPayload: ResolverTypeWrapper<Omit<HMNCreateMigrationPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNCreateMigrationInput: HMNCreateMigrationInput;
  HMNMigrationInput: HMNMigrationInput;
  HMNCreateMoodPayload: ResolverTypeWrapper<Omit<HMNCreateMoodPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNCreateMoodInput: HMNCreateMoodInput;
  MoodInput: MoodInput;
  HMNCreateUserPayload: ResolverTypeWrapper<Omit<HMNCreateUserPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNCreateUserInput: HMNCreateUserInput;
  HMNUserInput: HMNUserInput;
  HMNUpdateFriendshipPayload: ResolverTypeWrapper<Omit<HMNUpdateFriendshipPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNUpdateFriendshipInput: HMNUpdateFriendshipInput;
  HMNFriendshipPatch: HMNFriendshipPatch;
  HMNUpdateFriendshipByIdInput: HMNUpdateFriendshipByIdInput;
  HMNUpdateFriendshipByRequesterIdAndRecipientIdInput: HMNUpdateFriendshipByRequesterIdAndRecipientIdInput;
  HMNUpdateHugRequestPayload: ResolverTypeWrapper<Omit<HMNUpdateHugRequestPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNUpdateHugRequestInput: HMNUpdateHugRequestInput;
  HMNHugRequestPatch: HMNHugRequestPatch;
  HMNUpdateHugRequestByIdInput: HMNUpdateHugRequestByIdInput;
  HMNUpdateHugPayload: ResolverTypeWrapper<Omit<HMNUpdateHugPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNUpdateHugInput: HMNUpdateHugInput;
  HMNHugPatch: HMNHugPatch;
  HMNUpdateHugByIdInput: HMNUpdateHugByIdInput;
  HMNUpdateMigrationPayload: ResolverTypeWrapper<Omit<HMNUpdateMigrationPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNUpdateMigrationInput: HMNUpdateMigrationInput;
  HMNMigrationPatch: HMNMigrationPatch;
  HMNUpdateMigrationByIdInput: HMNUpdateMigrationByIdInput;
  HMNUpdateMigrationByNameInput: HMNUpdateMigrationByNameInput;
  HMNUpdateMoodPayload: ResolverTypeWrapper<Omit<HMNUpdateMoodPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNUpdateMoodInput: HMNUpdateMoodInput;
  HMNMoodPatch: HMNMoodPatch;
  HMNUpdateMoodByIdInput: HMNUpdateMoodByIdInput;
  HMNUpdateUserPayload: ResolverTypeWrapper<Omit<HMNUpdateUserPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNUpdateUserInput: HMNUpdateUserInput;
  HMNUserPatch: HMNUserPatch;
  HMNUpdateUserByIdInput: HMNUpdateUserByIdInput;
  HMNUpdateUserByUsernameInput: HMNUpdateUserByUsernameInput;
  HMNUpdateUserByEmailInput: HMNUpdateUserByEmailInput;
  HMNDeleteFriendshipPayload: ResolverTypeWrapper<Omit<HMNDeleteFriendshipPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNDeleteFriendshipInput: HMNDeleteFriendshipInput;
  HMNDeleteFriendshipByIdInput: HMNDeleteFriendshipByIdInput;
  HMNDeleteFriendshipByRequesterIdAndRecipientIdInput: HMNDeleteFriendshipByRequesterIdAndRecipientIdInput;
  HMNDeleteHugRequestPayload: ResolverTypeWrapper<Omit<HMNDeleteHugRequestPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNDeleteHugRequestInput: HMNDeleteHugRequestInput;
  HMNDeleteHugRequestByIdInput: HMNDeleteHugRequestByIdInput;
  HMNDeleteHugPayload: ResolverTypeWrapper<Omit<HMNDeleteHugPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNDeleteHugInput: HMNDeleteHugInput;
  HMNDeleteHugByIdInput: HMNDeleteHugByIdInput;
  HMNDeleteMigrationPayload: ResolverTypeWrapper<Omit<HMNDeleteMigrationPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNDeleteMigrationInput: HMNDeleteMigrationInput;
  HMNDeleteMigrationByIdInput: HMNDeleteMigrationByIdInput;
  HMNDeleteMigrationByNameInput: HMNDeleteMigrationByNameInput;
  HMNDeleteMoodPayload: ResolverTypeWrapper<Omit<HMNDeleteMoodPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNDeleteMoodInput: HMNDeleteMoodInput;
  HMNDeleteMoodByIdInput: HMNDeleteMoodByIdInput;
  HMNDeleteUserPayload: ResolverTypeWrapper<Omit<HMNDeleteUserPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  HMNDeleteUserInput: HMNDeleteUserInput;
  HMNDeleteUserByIdInput: HMNDeleteUserByIdInput;
  HMNDeleteUserByUsernameInput: HMNDeleteUserByUsernameInput;
  HMNDeleteUserByEmailInput: HMNDeleteUserByEmailInput;
  HMNClientInfo: ResolverTypeWrapper<HMNClientInfo>;
  MoodStreak: ResolverTypeWrapper<MoodStreak>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Mutation: {};
  HMNNode: ResolversInterfaceTypes<ResolversParentTypes>['HMNNode'];
  ID: Scalars['ID']['output'];
  HMNFriendshipsConnection: HMNFriendshipsConnection;
  Friendship: Friendship;
  UUID: Scalars['UUID']['output'];
  String: Scalars['String']['output'];
  Boolean: Scalars['Boolean']['output'];
  HMNDatetime: Scalars['HMNDatetime']['output'];
  User: User;
  HMNMoodsConnection: HMNMoodsConnection;
  Mood: Mood;
  Int: Scalars['Int']['output'];
  HMNMoodsEdge: HMNMoodsEdge;
  HMNCursor: Scalars['HMNCursor']['output'];
  HMNPageInfo: HMNPageInfo;
  HMNMoodCondition: HMNMoodCondition;
  HMNHugsConnection: HMNHugsConnection;
  Hug: Hug;
  HMNHugsEdge: HMNHugsEdge;
  HMNHugCondition: HMNHugCondition;
  HMNHugRequestsConnection: HMNHugRequestsConnection;
  HugRequest: HugRequest;
  HMNHugRequestsEdge: HMNHugRequestsEdge;
  HMNHugRequestCondition: HMNHugRequestCondition;
  HMNFriendshipCondition: HMNFriendshipCondition;
  HMNFriendshipsEdge: HMNFriendshipsEdge;
  HMNMigrationsConnection: HMNMigrationsConnection;
  HMNMigration: HMNMigration;
  HMNMigrationsEdge: HMNMigrationsEdge;
  HMNMigrationCondition: HMNMigrationCondition;
  HMNUsersConnection: HMNUsersConnection;
  HMNUsersEdge: HMNUsersEdge;
  HMNUserCondition: HMNUserCondition;
  HMNCreateFriendshipPayload: Omit<HMNCreateFriendshipPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNCreateFriendshipInput: HMNCreateFriendshipInput;
  HMNFriendshipInput: HMNFriendshipInput;
  HMNCreateHugRequestPayload: Omit<HMNCreateHugRequestPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNCreateHugRequestInput: HMNCreateHugRequestInput;
  HugRequestInput: HugRequestInput;
  HMNCreateHugPayload: Omit<HMNCreateHugPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNCreateHugInput: HMNCreateHugInput;
  HugInput: HugInput;
  HMNCreateMigrationPayload: Omit<HMNCreateMigrationPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNCreateMigrationInput: HMNCreateMigrationInput;
  HMNMigrationInput: HMNMigrationInput;
  HMNCreateMoodPayload: Omit<HMNCreateMoodPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNCreateMoodInput: HMNCreateMoodInput;
  MoodInput: MoodInput;
  HMNCreateUserPayload: Omit<HMNCreateUserPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNCreateUserInput: HMNCreateUserInput;
  HMNUserInput: HMNUserInput;
  HMNUpdateFriendshipPayload: Omit<HMNUpdateFriendshipPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNUpdateFriendshipInput: HMNUpdateFriendshipInput;
  HMNFriendshipPatch: HMNFriendshipPatch;
  HMNUpdateFriendshipByIdInput: HMNUpdateFriendshipByIdInput;
  HMNUpdateFriendshipByRequesterIdAndRecipientIdInput: HMNUpdateFriendshipByRequesterIdAndRecipientIdInput;
  HMNUpdateHugRequestPayload: Omit<HMNUpdateHugRequestPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNUpdateHugRequestInput: HMNUpdateHugRequestInput;
  HMNHugRequestPatch: HMNHugRequestPatch;
  HMNUpdateHugRequestByIdInput: HMNUpdateHugRequestByIdInput;
  HMNUpdateHugPayload: Omit<HMNUpdateHugPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNUpdateHugInput: HMNUpdateHugInput;
  HMNHugPatch: HMNHugPatch;
  HMNUpdateHugByIdInput: HMNUpdateHugByIdInput;
  HMNUpdateMigrationPayload: Omit<HMNUpdateMigrationPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNUpdateMigrationInput: HMNUpdateMigrationInput;
  HMNMigrationPatch: HMNMigrationPatch;
  HMNUpdateMigrationByIdInput: HMNUpdateMigrationByIdInput;
  HMNUpdateMigrationByNameInput: HMNUpdateMigrationByNameInput;
  HMNUpdateMoodPayload: Omit<HMNUpdateMoodPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNUpdateMoodInput: HMNUpdateMoodInput;
  HMNMoodPatch: HMNMoodPatch;
  HMNUpdateMoodByIdInput: HMNUpdateMoodByIdInput;
  HMNUpdateUserPayload: Omit<HMNUpdateUserPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNUpdateUserInput: HMNUpdateUserInput;
  HMNUserPatch: HMNUserPatch;
  HMNUpdateUserByIdInput: HMNUpdateUserByIdInput;
  HMNUpdateUserByUsernameInput: HMNUpdateUserByUsernameInput;
  HMNUpdateUserByEmailInput: HMNUpdateUserByEmailInput;
  HMNDeleteFriendshipPayload: Omit<HMNDeleteFriendshipPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNDeleteFriendshipInput: HMNDeleteFriendshipInput;
  HMNDeleteFriendshipByIdInput: HMNDeleteFriendshipByIdInput;
  HMNDeleteFriendshipByRequesterIdAndRecipientIdInput: HMNDeleteFriendshipByRequesterIdAndRecipientIdInput;
  HMNDeleteHugRequestPayload: Omit<HMNDeleteHugRequestPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNDeleteHugRequestInput: HMNDeleteHugRequestInput;
  HMNDeleteHugRequestByIdInput: HMNDeleteHugRequestByIdInput;
  HMNDeleteHugPayload: Omit<HMNDeleteHugPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNDeleteHugInput: HMNDeleteHugInput;
  HMNDeleteHugByIdInput: HMNDeleteHugByIdInput;
  HMNDeleteMigrationPayload: Omit<HMNDeleteMigrationPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNDeleteMigrationInput: HMNDeleteMigrationInput;
  HMNDeleteMigrationByIdInput: HMNDeleteMigrationByIdInput;
  HMNDeleteMigrationByNameInput: HMNDeleteMigrationByNameInput;
  HMNDeleteMoodPayload: Omit<HMNDeleteMoodPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNDeleteMoodInput: HMNDeleteMoodInput;
  HMNDeleteMoodByIdInput: HMNDeleteMoodByIdInput;
  HMNDeleteUserPayload: Omit<HMNDeleteUserPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  HMNDeleteUserInput: HMNDeleteUserInput;
  HMNDeleteUserByIdInput: HMNDeleteUserByIdInput;
  HMNDeleteUserByUsernameInput: HMNDeleteUserByUsernameInput;
  HMNDeleteUserByEmailInput: HMNDeleteUserByEmailInput;
  HMNClientInfo: HMNClientInfo;
  MoodStreak: MoodStreak;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['HMNNode']>, ParentType, ContextType, RequireFields<QuerynodeArgs, 'nodeId'>>;
  allFriendships?: Resolver<Maybe<ResolversTypes['HMNFriendshipsConnection']>, ParentType, ContextType, RequireFields<QueryallFriendshipsArgs, 'orderBy'>>;
  allHugRequests?: Resolver<Maybe<ResolversTypes['HMNHugRequestsConnection']>, ParentType, ContextType, RequireFields<QueryallHugRequestsArgs, 'orderBy'>>;
  allHugs?: Resolver<Maybe<ResolversTypes['HMNHugsConnection']>, ParentType, ContextType, RequireFields<QueryallHugsArgs, 'orderBy'>>;
  allMigrations?: Resolver<Maybe<ResolversTypes['HMNMigrationsConnection']>, ParentType, ContextType, RequireFields<QueryallMigrationsArgs, 'orderBy'>>;
  allMoods?: Resolver<Maybe<ResolversTypes['HMNMoodsConnection']>, ParentType, ContextType, RequireFields<QueryallMoodsArgs, 'orderBy'>>;
  allUsers?: Resolver<Maybe<ResolversTypes['HMNUsersConnection']>, ParentType, ContextType, RequireFields<QueryallUsersArgs, 'orderBy'>>;
  friendshipById?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType, RequireFields<QueryfriendshipByIdArgs, 'id'>>;
  friendshipByRequesterIdAndRecipientId?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType, RequireFields<QueryfriendshipByRequesterIdAndRecipientIdArgs, 'requesterId' | 'recipientId'>>;
  hugRequestById?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType, RequireFields<QueryhugRequestByIdArgs, 'id'>>;
  hugById?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<QueryhugByIdArgs, 'id'>>;
  migrationById?: Resolver<Maybe<ResolversTypes['HMNMigration']>, ParentType, ContextType, RequireFields<QuerymigrationByIdArgs, 'id'>>;
  migrationByName?: Resolver<Maybe<ResolversTypes['HMNMigration']>, ParentType, ContextType, RequireFields<QuerymigrationByNameArgs, 'name'>>;
  moodById?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType, RequireFields<QuerymoodByIdArgs, 'id'>>;
  userById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserByIdArgs, 'id'>>;
  userByUsername?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserByUsernameArgs, 'username'>>;
  userByEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserByEmailArgs, 'email'>>;
  friendship?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType, RequireFields<QueryfriendshipArgs, 'nodeId'>>;
  hugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType, RequireFields<QueryhugRequestArgs, 'nodeId'>>;
  hug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<QueryhugArgs, 'nodeId'>>;
  migration?: Resolver<Maybe<ResolversTypes['HMNMigration']>, ParentType, ContextType, RequireFields<QuerymigrationArgs, 'nodeId'>>;
  mood?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType, RequireFields<QuerymoodArgs, 'nodeId'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'nodeId'>>;
  clientInfo?: Resolver<ResolversTypes['HMNClientInfo'], ParentType, ContextType>;
  publicMoods?: Resolver<Array<ResolversTypes['Mood']>, ParentType, ContextType, Partial<QuerypublicMoodsArgs>>;
  userMoods?: Resolver<Array<ResolversTypes['Mood']>, ParentType, ContextType, Partial<QueryuserMoodsArgs>>;
  moodStreak?: Resolver<ResolversTypes['MoodStreak'], ParentType, ContextType, RequireFields<QuerymoodStreakArgs, 'userId'>>;
  communityHugRequests?: Resolver<Array<ResolversTypes['HugRequest']>, ParentType, ContextType, Partial<QuerycommunityHugRequestsArgs>>;
  receivedHugs?: Resolver<Array<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<QueryreceivedHugsArgs, 'userId'>>;
  sentHugs?: Resolver<Array<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<QuerysentHugsArgs, 'userId'>>;
  pendingHugRequests?: Resolver<Array<ResolversTypes['HugRequest']>, ParentType, ContextType, RequireFields<QuerypendingHugRequestsArgs, 'userId'>>;
  friendsMoods?: Resolver<Array<ResolversTypes['Mood']>, ParentType, ContextType, Partial<QueryfriendsMoodsArgs>>;
}>;

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createFriendship?: Resolver<Maybe<ResolversTypes['HMNCreateFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationcreateFriendshipArgs, 'input'>>;
  createHugRequest?: Resolver<Maybe<ResolversTypes['HMNCreateHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationcreateHugRequestArgs, 'input'>>;
  createHug?: Resolver<Maybe<ResolversTypes['HMNCreateHugPayload']>, ParentType, ContextType, RequireFields<MutationcreateHugArgs, 'input'>>;
  createMigration?: Resolver<Maybe<ResolversTypes['HMNCreateMigrationPayload']>, ParentType, ContextType, RequireFields<MutationcreateMigrationArgs, 'input'>>;
  createMood?: Resolver<Maybe<ResolversTypes['HMNCreateMoodPayload']>, ParentType, ContextType, RequireFields<MutationcreateMoodArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['HMNCreateUserPayload']>, ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'input'>>;
  updateFriendship?: Resolver<Maybe<ResolversTypes['HMNUpdateFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationupdateFriendshipArgs, 'input'>>;
  updateFriendshipById?: Resolver<Maybe<ResolversTypes['HMNUpdateFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationupdateFriendshipByIdArgs, 'input'>>;
  updateFriendshipByRequesterIdAndRecipientId?: Resolver<Maybe<ResolversTypes['HMNUpdateFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationupdateFriendshipByRequesterIdAndRecipientIdArgs, 'input'>>;
  updateHugRequest?: Resolver<Maybe<ResolversTypes['HMNUpdateHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationupdateHugRequestArgs, 'input'>>;
  updateHugRequestById?: Resolver<Maybe<ResolversTypes['HMNUpdateHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationupdateHugRequestByIdArgs, 'input'>>;
  updateHug?: Resolver<Maybe<ResolversTypes['HMNUpdateHugPayload']>, ParentType, ContextType, RequireFields<MutationupdateHugArgs, 'input'>>;
  updateHugById?: Resolver<Maybe<ResolversTypes['HMNUpdateHugPayload']>, ParentType, ContextType, RequireFields<MutationupdateHugByIdArgs, 'input'>>;
  updateMigration?: Resolver<Maybe<ResolversTypes['HMNUpdateMigrationPayload']>, ParentType, ContextType, RequireFields<MutationupdateMigrationArgs, 'input'>>;
  updateMigrationById?: Resolver<Maybe<ResolversTypes['HMNUpdateMigrationPayload']>, ParentType, ContextType, RequireFields<MutationupdateMigrationByIdArgs, 'input'>>;
  updateMigrationByName?: Resolver<Maybe<ResolversTypes['HMNUpdateMigrationPayload']>, ParentType, ContextType, RequireFields<MutationupdateMigrationByNameArgs, 'input'>>;
  updateMood?: Resolver<Maybe<ResolversTypes['HMNUpdateMoodPayload']>, ParentType, ContextType, RequireFields<MutationupdateMoodArgs, 'input'>>;
  updateMoodById?: Resolver<Maybe<ResolversTypes['HMNUpdateMoodPayload']>, ParentType, ContextType, RequireFields<MutationupdateMoodByIdArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['HMNUpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'input'>>;
  updateUserById?: Resolver<Maybe<ResolversTypes['HMNUpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationupdateUserByIdArgs, 'input'>>;
  updateUserByUsername?: Resolver<Maybe<ResolversTypes['HMNUpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationupdateUserByUsernameArgs, 'input'>>;
  updateUserByEmail?: Resolver<Maybe<ResolversTypes['HMNUpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationupdateUserByEmailArgs, 'input'>>;
  deleteFriendship?: Resolver<Maybe<ResolversTypes['HMNDeleteFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationdeleteFriendshipArgs, 'input'>>;
  deleteFriendshipById?: Resolver<Maybe<ResolversTypes['HMNDeleteFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationdeleteFriendshipByIdArgs, 'input'>>;
  deleteFriendshipByRequesterIdAndRecipientId?: Resolver<Maybe<ResolversTypes['HMNDeleteFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationdeleteFriendshipByRequesterIdAndRecipientIdArgs, 'input'>>;
  deleteHugRequest?: Resolver<Maybe<ResolversTypes['HMNDeleteHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationdeleteHugRequestArgs, 'input'>>;
  deleteHugRequestById?: Resolver<Maybe<ResolversTypes['HMNDeleteHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationdeleteHugRequestByIdArgs, 'input'>>;
  deleteHug?: Resolver<Maybe<ResolversTypes['HMNDeleteHugPayload']>, ParentType, ContextType, RequireFields<MutationdeleteHugArgs, 'input'>>;
  deleteHugById?: Resolver<Maybe<ResolversTypes['HMNDeleteHugPayload']>, ParentType, ContextType, RequireFields<MutationdeleteHugByIdArgs, 'input'>>;
  deleteMigration?: Resolver<Maybe<ResolversTypes['HMNDeleteMigrationPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMigrationArgs, 'input'>>;
  deleteMigrationById?: Resolver<Maybe<ResolversTypes['HMNDeleteMigrationPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMigrationByIdArgs, 'input'>>;
  deleteMigrationByName?: Resolver<Maybe<ResolversTypes['HMNDeleteMigrationPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMigrationByNameArgs, 'input'>>;
  deleteMood?: Resolver<Maybe<ResolversTypes['HMNDeleteMoodPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMoodArgs, 'input'>>;
  deleteMoodById?: Resolver<Maybe<ResolversTypes['HMNDeleteMoodPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMoodByIdArgs, 'input'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['HMNDeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationdeleteUserArgs, 'input'>>;
  deleteUserById?: Resolver<Maybe<ResolversTypes['HMNDeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationdeleteUserByIdArgs, 'input'>>;
  deleteUserByUsername?: Resolver<Maybe<ResolversTypes['HMNDeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationdeleteUserByUsernameArgs, 'input'>>;
  deleteUserByEmail?: Resolver<Maybe<ResolversTypes['HMNDeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationdeleteUserByEmailArgs, 'input'>>;
  sendHug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<MutationsendHugArgs, 'input'>>;
  createMoodEntry?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType, RequireFields<MutationcreateMoodEntryArgs, 'moodInput'>>;
  respondToHugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType, RequireFields<MutationrespondToHugRequestArgs, 'requestId' | 'accept'>>;
}>;

export type HMNNodeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNNode'] = ResolversParentTypes['HMNNode']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Query' | 'Friendship' | 'User' | 'Mood' | 'Hug' | 'HugRequest' | 'HMNMigration', ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type HMNFriendshipsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNFriendshipsConnection'] = ResolversParentTypes['HMNFriendshipsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['Friendship']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['HMNFriendshipsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HMNPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FriendshipResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Friendship'] = ResolversParentTypes['Friendship']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  requesterId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  recipientId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  followsMood?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['HMNDatetime'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['HMNDatetime']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UUIDScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface HMNDatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HMNDatetime'], any> {
  name: 'HMNDatetime';
}

export type UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  profileImage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isAnonymous?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['HMNDatetime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['HMNDatetime'], ParentType, ContextType>;
  moodsByUserId?: Resolver<ResolversTypes['HMNMoodsConnection'], ParentType, ContextType, RequireFields<UsermoodsByUserIdArgs, 'orderBy'>>;
  hugsBySenderId?: Resolver<ResolversTypes['HMNHugsConnection'], ParentType, ContextType, RequireFields<UserhugsBySenderIdArgs, 'orderBy'>>;
  hugsByRecipientId?: Resolver<ResolversTypes['HMNHugsConnection'], ParentType, ContextType, RequireFields<UserhugsByRecipientIdArgs, 'orderBy'>>;
  hugRequestsByRequesterId?: Resolver<ResolversTypes['HMNHugRequestsConnection'], ParentType, ContextType, RequireFields<UserhugRequestsByRequesterIdArgs, 'orderBy'>>;
  hugRequestsByRecipientId?: Resolver<ResolversTypes['HMNHugRequestsConnection'], ParentType, ContextType, RequireFields<UserhugRequestsByRecipientIdArgs, 'orderBy'>>;
  friendshipsByRequesterId?: Resolver<ResolversTypes['HMNFriendshipsConnection'], ParentType, ContextType, RequireFields<UserfriendshipsByRequesterIdArgs, 'orderBy'>>;
  friendshipsByRecipientId?: Resolver<ResolversTypes['HMNFriendshipsConnection'], ParentType, ContextType, RequireFields<UserfriendshipsByRecipientIdArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNMoodsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNMoodsConnection'] = ResolversParentTypes['HMNMoodsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['Mood']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['HMNMoodsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HMNPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoodResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mood'] = ResolversParentTypes['Mood']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  intensity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  public?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['HMNDatetime'], ParentType, ContextType>;
  userByUserId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNMoodsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNMoodsEdge'] = ResolversParentTypes['HMNMoodsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['HMNCursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Mood'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface HMNCursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['HMNCursor'], any> {
  name: 'HMNCursor';
}

export type HMNPageInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNPageInfo'] = ResolversParentTypes['HMNPageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['HMNCursor']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['HMNCursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNHugsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNHugsConnection'] = ResolversParentTypes['HMNHugsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['Hug']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['HMNHugsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HMNPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HugResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Hug'] = ResolversParentTypes['Hug']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  senderId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  recipientId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  read?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['HMNDatetime'], ParentType, ContextType>;
  userBySenderId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  fromUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  toUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNHugsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNHugsEdge'] = ResolversParentTypes['HMNHugsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['HMNCursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Hug'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNHugRequestsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNHugRequestsConnection'] = ResolversParentTypes['HMNHugRequestsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['HugRequest']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['HMNHugRequestsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HMNPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HugRequestResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HugRequest'] = ResolversParentTypes['HugRequest']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  requesterId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  recipientId?: Resolver<Maybe<ResolversTypes['UUID']>, ParentType, ContextType>;
  isCommunityRequest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  requestedAt?: Resolver<ResolversTypes['HMNDatetime'], ParentType, ContextType>;
  respondedAt?: Resolver<Maybe<ResolversTypes['HMNDatetime']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  requester?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNHugRequestsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNHugRequestsEdge'] = ResolversParentTypes['HMNHugRequestsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['HMNCursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['HugRequest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNFriendshipsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNFriendshipsEdge'] = ResolversParentTypes['HMNFriendshipsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['HMNCursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Friendship'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNMigrationsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNMigrationsConnection'] = ResolversParentTypes['HMNMigrationsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['HMNMigration']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['HMNMigrationsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HMNPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNMigrationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNMigration'] = ResolversParentTypes['HMNMigration']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  appliedAt?: Resolver<Maybe<ResolversTypes['HMNDatetime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNMigrationsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNMigrationsEdge'] = ResolversParentTypes['HMNMigrationsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['HMNCursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['HMNMigration'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNUsersConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNUsersConnection'] = ResolversParentTypes['HMNUsersConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['HMNUsersEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['HMNPageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNUsersEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNUsersEdge'] = ResolversParentTypes['HMNUsersEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['HMNCursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNCreateFriendshipPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNCreateFriendshipPayload'] = ResolversParentTypes['HMNCreateFriendshipPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friendship?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  friendshipEdge?: Resolver<Maybe<ResolversTypes['HMNFriendshipsEdge']>, ParentType, ContextType, RequireFields<HMNCreateFriendshipPayloadfriendshipEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNCreateHugRequestPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNCreateHugRequestPayload'] = ResolversParentTypes['HMNCreateHugRequestPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugRequestEdge?: Resolver<Maybe<ResolversTypes['HMNHugRequestsEdge']>, ParentType, ContextType, RequireFields<HMNCreateHugRequestPayloadhugRequestEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNCreateHugPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNCreateHugPayload'] = ResolversParentTypes['HMNCreateHugPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userBySenderId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugEdge?: Resolver<Maybe<ResolversTypes['HMNHugsEdge']>, ParentType, ContextType, RequireFields<HMNCreateHugPayloadhugEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNCreateMigrationPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNCreateMigrationPayload'] = ResolversParentTypes['HMNCreateMigrationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  migration?: Resolver<Maybe<ResolversTypes['HMNMigration']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  migrationEdge?: Resolver<Maybe<ResolversTypes['HMNMigrationsEdge']>, ParentType, ContextType, RequireFields<HMNCreateMigrationPayloadmigrationEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNCreateMoodPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNCreateMoodPayload'] = ResolversParentTypes['HMNCreateMoodPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mood?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByUserId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  moodEdge?: Resolver<Maybe<ResolversTypes['HMNMoodsEdge']>, ParentType, ContextType, RequireFields<HMNCreateMoodPayloadmoodEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNCreateUserPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNCreateUserPayload'] = ResolversParentTypes['HMNCreateUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['HMNUsersEdge']>, ParentType, ContextType, RequireFields<HMNCreateUserPayloaduserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNUpdateFriendshipPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNUpdateFriendshipPayload'] = ResolversParentTypes['HMNUpdateFriendshipPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friendship?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  friendshipEdge?: Resolver<Maybe<ResolversTypes['HMNFriendshipsEdge']>, ParentType, ContextType, RequireFields<HMNUpdateFriendshipPayloadfriendshipEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNUpdateHugRequestPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNUpdateHugRequestPayload'] = ResolversParentTypes['HMNUpdateHugRequestPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugRequestEdge?: Resolver<Maybe<ResolversTypes['HMNHugRequestsEdge']>, ParentType, ContextType, RequireFields<HMNUpdateHugRequestPayloadhugRequestEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNUpdateHugPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNUpdateHugPayload'] = ResolversParentTypes['HMNUpdateHugPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userBySenderId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugEdge?: Resolver<Maybe<ResolversTypes['HMNHugsEdge']>, ParentType, ContextType, RequireFields<HMNUpdateHugPayloadhugEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNUpdateMigrationPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNUpdateMigrationPayload'] = ResolversParentTypes['HMNUpdateMigrationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  migration?: Resolver<Maybe<ResolversTypes['HMNMigration']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  migrationEdge?: Resolver<Maybe<ResolversTypes['HMNMigrationsEdge']>, ParentType, ContextType, RequireFields<HMNUpdateMigrationPayloadmigrationEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNUpdateMoodPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNUpdateMoodPayload'] = ResolversParentTypes['HMNUpdateMoodPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mood?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByUserId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  moodEdge?: Resolver<Maybe<ResolversTypes['HMNMoodsEdge']>, ParentType, ContextType, RequireFields<HMNUpdateMoodPayloadmoodEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNUpdateUserPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNUpdateUserPayload'] = ResolversParentTypes['HMNUpdateUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['HMNUsersEdge']>, ParentType, ContextType, RequireFields<HMNUpdateUserPayloaduserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNDeleteFriendshipPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNDeleteFriendshipPayload'] = ResolversParentTypes['HMNDeleteFriendshipPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friendship?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType>;
  deletedFriendshipId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  friendshipEdge?: Resolver<Maybe<ResolversTypes['HMNFriendshipsEdge']>, ParentType, ContextType, RequireFields<HMNDeleteFriendshipPayloadfriendshipEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNDeleteHugRequestPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNDeleteHugRequestPayload'] = ResolversParentTypes['HMNDeleteHugRequestPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType>;
  deletedHugRequestId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugRequestEdge?: Resolver<Maybe<ResolversTypes['HMNHugRequestsEdge']>, ParentType, ContextType, RequireFields<HMNDeleteHugRequestPayloadhugRequestEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNDeleteHugPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNDeleteHugPayload'] = ResolversParentTypes['HMNDeleteHugPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType>;
  deletedHugId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userBySenderId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugEdge?: Resolver<Maybe<ResolversTypes['HMNHugsEdge']>, ParentType, ContextType, RequireFields<HMNDeleteHugPayloadhugEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNDeleteMigrationPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNDeleteMigrationPayload'] = ResolversParentTypes['HMNDeleteMigrationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  migration?: Resolver<Maybe<ResolversTypes['HMNMigration']>, ParentType, ContextType>;
  deletedMigrationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  migrationEdge?: Resolver<Maybe<ResolversTypes['HMNMigrationsEdge']>, ParentType, ContextType, RequireFields<HMNDeleteMigrationPayloadmigrationEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNDeleteMoodPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNDeleteMoodPayload'] = ResolversParentTypes['HMNDeleteMoodPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mood?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType>;
  deletedMoodId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByUserId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  moodEdge?: Resolver<Maybe<ResolversTypes['HMNMoodsEdge']>, ParentType, ContextType, RequireFields<HMNDeleteMoodPayloadmoodEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNDeleteUserPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNDeleteUserPayload'] = ResolversParentTypes['HMNDeleteUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  deletedUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['HMNUsersEdge']>, ParentType, ContextType, RequireFields<HMNDeleteUserPayloaduserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HMNClientInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HMNClientInfo'] = ResolversParentTypes['HMNClientInfo']> = ResolversObject<{
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  platform?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  buildDate?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  deviceInfo?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  features?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoodStreakResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MoodStreak'] = ResolversParentTypes['MoodStreak']> = ResolversObject<{
  currentStreak?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  longestStreak?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  lastMoodDate?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  HMNNode?: HMNNodeResolvers<ContextType>;
  HMNFriendshipsConnection?: HMNFriendshipsConnectionResolvers<ContextType>;
  Friendship?: FriendshipResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  HMNDatetime?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  HMNMoodsConnection?: HMNMoodsConnectionResolvers<ContextType>;
  Mood?: MoodResolvers<ContextType>;
  HMNMoodsEdge?: HMNMoodsEdgeResolvers<ContextType>;
  HMNCursor?: GraphQLScalarType;
  HMNPageInfo?: HMNPageInfoResolvers<ContextType>;
  HMNHugsConnection?: HMNHugsConnectionResolvers<ContextType>;
  Hug?: HugResolvers<ContextType>;
  HMNHugsEdge?: HMNHugsEdgeResolvers<ContextType>;
  HMNHugRequestsConnection?: HMNHugRequestsConnectionResolvers<ContextType>;
  HugRequest?: HugRequestResolvers<ContextType>;
  HMNHugRequestsEdge?: HMNHugRequestsEdgeResolvers<ContextType>;
  HMNFriendshipsEdge?: HMNFriendshipsEdgeResolvers<ContextType>;
  HMNMigrationsConnection?: HMNMigrationsConnectionResolvers<ContextType>;
  HMNMigration?: HMNMigrationResolvers<ContextType>;
  HMNMigrationsEdge?: HMNMigrationsEdgeResolvers<ContextType>;
  HMNUsersConnection?: HMNUsersConnectionResolvers<ContextType>;
  HMNUsersEdge?: HMNUsersEdgeResolvers<ContextType>;
  HMNCreateFriendshipPayload?: HMNCreateFriendshipPayloadResolvers<ContextType>;
  HMNCreateHugRequestPayload?: HMNCreateHugRequestPayloadResolvers<ContextType>;
  HMNCreateHugPayload?: HMNCreateHugPayloadResolvers<ContextType>;
  HMNCreateMigrationPayload?: HMNCreateMigrationPayloadResolvers<ContextType>;
  HMNCreateMoodPayload?: HMNCreateMoodPayloadResolvers<ContextType>;
  HMNCreateUserPayload?: HMNCreateUserPayloadResolvers<ContextType>;
  HMNUpdateFriendshipPayload?: HMNUpdateFriendshipPayloadResolvers<ContextType>;
  HMNUpdateHugRequestPayload?: HMNUpdateHugRequestPayloadResolvers<ContextType>;
  HMNUpdateHugPayload?: HMNUpdateHugPayloadResolvers<ContextType>;
  HMNUpdateMigrationPayload?: HMNUpdateMigrationPayloadResolvers<ContextType>;
  HMNUpdateMoodPayload?: HMNUpdateMoodPayloadResolvers<ContextType>;
  HMNUpdateUserPayload?: HMNUpdateUserPayloadResolvers<ContextType>;
  HMNDeleteFriendshipPayload?: HMNDeleteFriendshipPayloadResolvers<ContextType>;
  HMNDeleteHugRequestPayload?: HMNDeleteHugRequestPayloadResolvers<ContextType>;
  HMNDeleteHugPayload?: HMNDeleteHugPayloadResolvers<ContextType>;
  HMNDeleteMigrationPayload?: HMNDeleteMigrationPayloadResolvers<ContextType>;
  HMNDeleteMoodPayload?: HMNDeleteMoodPayloadResolvers<ContextType>;
  HMNDeleteUserPayload?: HMNDeleteUserPayloadResolvers<ContextType>;
  HMNClientInfo?: HMNClientInfoResolvers<ContextType>;
  MoodStreak?: MoodStreakResolvers<ContextType>;
}>;


export type MeshContext = PostGraphileApiTypes.Context & BaseMeshContext;


import { fileURLToPath } from '@graphql-mesh/utils';
const baseDir = pathModule.join(pathModule.dirname(fileURLToPath(import.meta.url)), '..');

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (pathModule.isAbsolute(moduleId) ? pathModule.relative(baseDir, moduleId) : moduleId).split('\\').join('/').replace(baseDir + '/', '');
  switch(relativeModuleId) {
    case ".mesh/sources/PostGraphileAPI/introspectionSchema":
      return import("./sources/PostGraphileAPI/introspectionSchema") as T;
    
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

export const rawServeConfig: YamlConfig.Config['serve'] = {"browser":false,"playground":true,"playgroundTitle":"HugMeNow API Gateway","playgroundTabs":[{"name":"Get Public Moods","query":"query GetPublicMoods {\n  publicMoods(limit: 5) {\n    id\n    intensity\n    note\n    createdAt\n    user {\n      id\n      name\n      username\n    }\n  }\n}\n"},{"name":"User Authentication","query":"mutation Login($email: String!, $password: String!) {\n  login(loginInput: { email: $email, password: $password }) {\n    user {\n      id\n      name\n      username\n    }\n    accessToken\n  }\n}\n","variables":"{\n  \"email\": \"demo@example.com\",\n  \"password\": \"password123\"\n}\n"}],"cors":{"origin":"*","credentials":true,"methods":["GET","POST","OPTIONS"],"allowedHeaders":["Content-Type","Authorization","x-client-version","x-client-platform"]},"port":4000,"hostname":"0.0.0.0","tracing":true,"introspection":true,"errorOptions":{"maskError":"{process.env.NODE_ENV !== 'development'}"}} as any
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
const postGraphileApiTransforms = [];
const PostGraphileApiHandler = await import("@graphql-mesh/graphql").then(handleImport);
const postGraphileApiHandler = new PostGraphileApiHandler({
              name: "PostGraphileAPI",
              config: {"endpoint":"http://localhost:3003/postgraphile/graphql","batch":true,"batchingOptions":{"maxBatchSize":15,"delay":30},"retry":3,"retryOptions":{"retryStrategy":"incremental","maxRetryDelay":2000,"initialDelay":100},"timeout":12000,"multipart":true,"operationHeaders":{"Authorization":"{context.headers.authorization}","x-client-version":"{context.headers['x-client-version'] || '1.0.0'}","x-client-platform":"{context.headers['x-client-platform'] || 'web'}","x-request-id":"{context.headers['x-request-id'] || generateId()}","x-mesh-source":"mesh-gateway"},"schemaHeaders":{"Authorization":"{context.headers.authorization}","x-request-type":"schema","x-mesh-internal":"true"}},
              baseDir,
              cache,
              pubsub,
              store: sourcesStore.child("PostGraphileAPI"),
              logger: logger.child({ source: "PostGraphileAPI" }),
              importFn,
            });
sources[0] = {
          name: 'PostGraphileAPI',
          handler: postGraphileApiHandler,
          transforms: postGraphileApiTransforms
        }
const additionalTypeDefs = [parse("type ClientInfo {\n  version: String!\n  platform: String!\n  buildDate: String!\n  deviceInfo: String\n  features: [String!]\n}\n\nextend type Query {\n  clientInfo: ClientInfo!\n  publicMoods(limit: Int, offset: Int): [Mood!]!\n  userMoods(userId: ID, limit: Int, offset: Int): [Mood!]!\n  moodStreak(userId: ID!): MoodStreak!\n  communityHugRequests(limit: Int, offset: Int): [HugRequest!]!\n  receivedHugs(userId: ID!, limit: Int, offset: Int): [Hug!]!\n  sentHugs(userId: ID!, limit: Int, offset: Int): [Hug!]!\n  pendingHugRequests(userId: ID!): [HugRequest!]!\n  friendsMoods(limit: Int, offset: Int): [Mood!]!\n}\n\nextend type Mutation {\n  sendHug(input: HugInput!): Hug\n  createMoodEntry(moodInput: MoodInput!): Mood\n  respondToHugRequest(requestId: ID!, accept: Boolean!): HugRequest\n}\n\ninput HugInput {\n  senderId: ID!\n  recipientId: ID!\n  message: String\n}\n\ninput MoodInput {\n  userId: ID!\n  intensity: Int!\n  note: String\n  private: Boolean\n}\n\ninput HugRequestInput {\n  requesterId: ID!\n  message: String\n}\n\ntype MoodStreak {\n  currentStreak: Int!\n  longestStreak: Int!\n  lastMoodDate: String\n}\n\nextend type Hug {\n  fromUser: User\n  toUser: User\n}\n\nextend type HugRequest {\n  requester: User\n}"),] as any[];
const RootTransform_0 = await import("@graphql-mesh/transform-naming-convention").then(handleImport);
transforms[0] = new RootTransform_0({
            apiName: '',
            config: {"typeNames":"pascalCase","fieldNames":"camelCase","enumValues":"upperCase","transformUnderscore":true},
            baseDir,
            cache,
            pubsub,
            importFn,
            logger,
          })
const RootTransform_1 = await import("@graphql-mesh/transform-prefix").then(handleImport);
transforms[1] = new RootTransform_1({
            apiName: '',
            config: {"includeRootOperations":false,"value":"HMN","ignore":["User","Mood","Hug","HugRequest","Friendship","MoodStreak","MoodInput","HugInput","HugRequestInput","AuthPayload","LoginInput","RegisterInput"]},
            baseDir,
            cache,
            pubsub,
            importFn,
            logger,
          })
const RootTransform_2 = await import("@graphql-mesh/transform-filter-schema").then(handleImport);
transforms[2] = new RootTransform_2({
            apiName: '',
            config: {"filters":["Query.!(_*|metadata|schema|introspection|clientInfo|pgAdmin*|nodeId*|node*)","Mutation.!(_*|metadata|deleteNode|delete*|register*|removeAll*)","Type.!(*Connection|*Edge|*Payload|Node|PageInfo)","User.!(nodeId|firstName|lastName|__typename)","*.!(nodeId)"]},
            baseDir,
            cache,
            pubsub,
            importFn,
            logger,
          })
const RootTransform_3 = await import("@graphql-mesh/transform-rename").then(handleImport);
transforms[3] = new RootTransform_3({
            apiName: '',
            config: {"renames":[{"from":{"type":"Mood","field":"score"},"to":{"type":"Mood","field":"intensity"}},{"from":{"type":"Mood","field":"isPublic"},"to":{"type":"Mood","field":"public"}},{"from":{"type":"Hug","field":"isRead"},"to":{"type":"Hug","field":"read"}},{"from":{"type":"User","field":"avatarUrl"},"to":{"type":"User","field":"profileImage"}},{"from":{"type":"HugRequest","field":"createdAt"},"to":{"type":"HugRequest","field":"requestedAt"}},{"from":{"type":"CreateMoodPayload"},"to":{"type":"MoodResult"}},{"from":{"type":"CreateHugPayload"},"to":{"type":"HugResult"}}]},
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
    rawServeConfig: {"browser":false,"playground":true,"playgroundTitle":"HugMeNow API Gateway","playgroundTabs":[{"name":"Get Public Moods","query":"query GetPublicMoods {\n  publicMoods(limit: 5) {\n    id\n    intensity\n    note\n    createdAt\n    user {\n      id\n      name\n      username\n    }\n  }\n}\n"},{"name":"User Authentication","query":"mutation Login($email: String!, $password: String!) {\n  login(loginInput: { email: $email, password: $password }) {\n    user {\n      id\n      name\n      username\n    }\n    accessToken\n  }\n}\n","variables":"{\n  \"email\": \"demo@example.com\",\n  \"password\": \"password123\"\n}\n"}],"cors":{"origin":"*","credentials":true,"methods":["GET","POST","OPTIONS"],"allowedHeaders":["Content-Type","Authorization","x-client-version","x-client-platform"]},"port":4000,"hostname":"0.0.0.0","tracing":true,"introspection":true,"errorOptions":{"maskError":"{process.env.NODE_ENV !== 'development'}"}},
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