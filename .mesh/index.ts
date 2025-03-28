// @ts-nocheck
import { GraphQLResolveInfo, SelectionSetNode, FieldNode, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { defaultImportFn, handleImport } from '@graphql-mesh/utils';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import type { MeshResolvedSource } from '@graphql-mesh/runtime';
import type { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import { printWithCache } from '@graphql-mesh/utils';
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
  Datetime: { input: any; output: any; }
  Cursor: { input: any; output: any; }
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** Reads and enables pagination through a set of `Friendship`. */
  allFriendships?: Maybe<FriendshipsConnection>;
  /** Reads and enables pagination through a set of `HugRequest`. */
  allHugRequests?: Maybe<HugRequestsConnection>;
  /** Reads and enables pagination through a set of `Hug`. */
  allHugs?: Maybe<HugsConnection>;
  /** Reads and enables pagination through a set of `Migration`. */
  allMigrations?: Maybe<MigrationsConnection>;
  /** Reads and enables pagination through a set of `Mood`. */
  allMoods?: Maybe<MoodsConnection>;
  /** Reads and enables pagination through a set of `User`. */
  allUsers?: Maybe<UsersConnection>;
  friendshipById?: Maybe<Friendship>;
  friendshipByRequesterIdAndRecipientId?: Maybe<Friendship>;
  hugRequestById?: Maybe<HugRequest>;
  hugById?: Maybe<Hug>;
  migrationById?: Maybe<Migration>;
  migrationByName?: Maybe<Migration>;
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
  migration?: Maybe<Migration>;
  /** Reads a single `Mood` using its globally unique `ID`. */
  mood?: Maybe<Mood>;
  /** Reads a single `User` using its globally unique `ID`. */
  user?: Maybe<User>;
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
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<FriendshipsOrderBy>>;
  condition?: InputMaybe<FriendshipCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallHugRequestsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<HugRequestsOrderBy>>;
  condition?: InputMaybe<HugRequestCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallHugsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<HugsOrderBy>>;
  condition?: InputMaybe<HugCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallMigrationsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<MigrationsOrderBy>>;
  condition?: InputMaybe<MigrationCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallMoodsArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<MoodsOrderBy>>;
  condition?: InputMaybe<MoodCondition>;
};


/** The root query type which gives access points into the data universe. */
export type QueryallUsersArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
  condition?: InputMaybe<UserCondition>;
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

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** A connection to a list of `Friendship` values. */
export type FriendshipsConnection = {
  /** A list of `Friendship` objects. */
  nodes: Array<Friendship>;
  /** A list of edges which contains the `Friendship` and cursor to aid in pagination. */
  edges: Array<FriendshipsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Friendship` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

export type Friendship = Node & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['UUID']['output'];
  requesterId: Scalars['UUID']['output'];
  recipientId: Scalars['UUID']['output'];
  status: Scalars['String']['output'];
  followsMood: Scalars['Boolean']['output'];
  createdAt: Scalars['Datetime']['output'];
  updatedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Friendship`. */
  userByRecipientId?: Maybe<User>;
};

/** A user of the application */
export type User = Node & {
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
  avatarUrl?: Maybe<Scalars['String']['output']>;
  /** Whether this user is anonymous */
  isAnonymous: Scalars['Boolean']['output'];
  createdAt: Scalars['Datetime']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads and enables pagination through a set of `Mood`. */
  moodsByUserId: MoodsConnection;
  /** Reads and enables pagination through a set of `Hug`. */
  hugsBySenderId: HugsConnection;
  /** Reads and enables pagination through a set of `Hug`. */
  hugsByRecipientId: HugsConnection;
  /** Reads and enables pagination through a set of `HugRequest`. */
  hugRequestsByRequesterId: HugRequestsConnection;
  /** Reads and enables pagination through a set of `HugRequest`. */
  hugRequestsByRecipientId: HugRequestsConnection;
  /** Reads and enables pagination through a set of `Friendship`. */
  friendshipsByRequesterId: FriendshipsConnection;
  /** Reads and enables pagination through a set of `Friendship`. */
  friendshipsByRecipientId: FriendshipsConnection;
};


/** A user of the application */
export type UsermoodsByUserIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<MoodsOrderBy>>;
  condition?: InputMaybe<MoodCondition>;
};


/** A user of the application */
export type UserhugsBySenderIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<HugsOrderBy>>;
  condition?: InputMaybe<HugCondition>;
};


/** A user of the application */
export type UserhugsByRecipientIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<HugsOrderBy>>;
  condition?: InputMaybe<HugCondition>;
};


/** A user of the application */
export type UserhugRequestsByRequesterIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<HugRequestsOrderBy>>;
  condition?: InputMaybe<HugRequestCondition>;
};


/** A user of the application */
export type UserhugRequestsByRecipientIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<HugRequestsOrderBy>>;
  condition?: InputMaybe<HugRequestCondition>;
};


/** A user of the application */
export type UserfriendshipsByRequesterIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<FriendshipsOrderBy>>;
  condition?: InputMaybe<FriendshipCondition>;
};


/** A user of the application */
export type UserfriendshipsByRecipientIdArgs = {
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  after?: InputMaybe<Scalars['Cursor']['input']>;
  orderBy?: InputMaybe<Array<FriendshipsOrderBy>>;
  condition?: InputMaybe<FriendshipCondition>;
};

/** A connection to a list of `Mood` values. */
export type MoodsConnection = {
  /** A list of `Mood` objects. */
  nodes: Array<Mood>;
  /** A list of edges which contains the `Mood` and cursor to aid in pagination. */
  edges: Array<MoodsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Mood` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A mood entry recorded by a user */
export type Mood = Node & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['UUID']['output'];
  /** The mood score from 1-10 */
  score: Scalars['Int']['output'];
  note?: Maybe<Scalars['String']['output']>;
  /** Whether this mood entry is publicly visible */
  isPublic: Scalars['Boolean']['output'];
  userId: Scalars['UUID']['output'];
  createdAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Mood`. */
  userByUserId?: Maybe<User>;
};

/** A `Mood` edge in the connection. */
export type MoodsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Mood` at the end of the edge. */
  node: Mood;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
};

/** Methods to use when ordering `Mood`. */
export type MoodsOrderBy =
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
export type MoodCondition = {
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
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `Hug` values. */
export type HugsConnection = {
  /** A list of `Hug` objects. */
  nodes: Array<Hug>;
  /** A list of edges which contains the `Hug` and cursor to aid in pagination. */
  edges: Array<HugsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Hug` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A virtual hug sent from one user to another */
export type Hug = Node & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['UUID']['output'];
  /** The type of hug (QUICK, WARM, SUPPORTIVE, etc) */
  type: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  senderId: Scalars['UUID']['output'];
  recipientId: Scalars['UUID']['output'];
  /** Whether the recipient has read the hug */
  isRead: Scalars['Boolean']['output'];
  createdAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Hug`. */
  userBySenderId?: Maybe<User>;
  /** Reads a single `User` that is related to this `Hug`. */
  userByRecipientId?: Maybe<User>;
};

/** A `Hug` edge in the connection. */
export type HugsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Hug` at the end of the edge. */
  node: Hug;
};

/** Methods to use when ordering `Hug`. */
export type HugsOrderBy =
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
export type HugCondition = {
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
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `HugRequest` values. */
export type HugRequestsConnection = {
  /** A list of `HugRequest` objects. */
  nodes: Array<HugRequest>;
  /** A list of edges which contains the `HugRequest` and cursor to aid in pagination. */
  edges: Array<HugRequestsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `HugRequest` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A request for a hug from another user or the community */
export type HugRequest = Node & {
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
  createdAt: Scalars['Datetime']['output'];
  respondedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRequesterId?: Maybe<User>;
  /** Reads a single `User` that is related to this `HugRequest`. */
  userByRecipientId?: Maybe<User>;
};

/** A `HugRequest` edge in the connection. */
export type HugRequestsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `HugRequest` at the end of the edge. */
  node: HugRequest;
};

/** Methods to use when ordering `HugRequest`. */
export type HugRequestsOrderBy =
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
export type HugRequestCondition = {
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
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `respondedAt` field. */
  respondedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Methods to use when ordering `Friendship`. */
export type FriendshipsOrderBy =
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
export type FriendshipCondition = {
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
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A `Friendship` edge in the connection. */
export type FriendshipsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Friendship` at the end of the edge. */
  node: Friendship;
};

/** A connection to a list of `Migration` values. */
export type MigrationsConnection = {
  /** A list of `Migration` objects. */
  nodes: Array<Migration>;
  /** A list of edges which contains the `Migration` and cursor to aid in pagination. */
  edges: Array<MigrationsEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Migration` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

export type Migration = Node & {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  appliedAt?: Maybe<Scalars['Datetime']['output']>;
};

/** A `Migration` edge in the connection. */
export type MigrationsEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Migration` at the end of the edge. */
  node: Migration;
};

/** Methods to use when ordering `Migration`. */
export type MigrationsOrderBy =
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
export type MigrationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `appliedAt` field. */
  appliedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `User` values. */
export type UsersConnection = {
  /** A list of `User` objects. */
  nodes: Array<User>;
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `User` at the end of the edge. */
  node: User;
};

/** Methods to use when ordering `User`. */
export type UsersOrderBy =
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
export type UserCondition = {
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
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  /** Creates a single `Friendship`. */
  createFriendship?: Maybe<CreateFriendshipPayload>;
  /** Creates a single `HugRequest`. */
  createHugRequest?: Maybe<CreateHugRequestPayload>;
  /** Creates a single `Hug`. */
  createHug?: Maybe<CreateHugPayload>;
  /** Creates a single `Migration`. */
  createMigration?: Maybe<CreateMigrationPayload>;
  /** Creates a single `Mood`. */
  createMood?: Maybe<CreateMoodPayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Updates a single `Friendship` using its globally unique id and a patch. */
  updateFriendship?: Maybe<UpdateFriendshipPayload>;
  /** Updates a single `Friendship` using a unique key and a patch. */
  updateFriendshipById?: Maybe<UpdateFriendshipPayload>;
  /** Updates a single `Friendship` using a unique key and a patch. */
  updateFriendshipByRequesterIdAndRecipientId?: Maybe<UpdateFriendshipPayload>;
  /** Updates a single `HugRequest` using its globally unique id and a patch. */
  updateHugRequest?: Maybe<UpdateHugRequestPayload>;
  /** Updates a single `HugRequest` using a unique key and a patch. */
  updateHugRequestById?: Maybe<UpdateHugRequestPayload>;
  /** Updates a single `Hug` using its globally unique id and a patch. */
  updateHug?: Maybe<UpdateHugPayload>;
  /** Updates a single `Hug` using a unique key and a patch. */
  updateHugById?: Maybe<UpdateHugPayload>;
  /** Updates a single `Migration` using its globally unique id and a patch. */
  updateMigration?: Maybe<UpdateMigrationPayload>;
  /** Updates a single `Migration` using a unique key and a patch. */
  updateMigrationById?: Maybe<UpdateMigrationPayload>;
  /** Updates a single `Migration` using a unique key and a patch. */
  updateMigrationByName?: Maybe<UpdateMigrationPayload>;
  /** Updates a single `Mood` using its globally unique id and a patch. */
  updateMood?: Maybe<UpdateMoodPayload>;
  /** Updates a single `Mood` using a unique key and a patch. */
  updateMoodById?: Maybe<UpdateMoodPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserById?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByUsername?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUserByEmail?: Maybe<UpdateUserPayload>;
  /** Deletes a single `Friendship` using its globally unique id. */
  deleteFriendship?: Maybe<DeleteFriendshipPayload>;
  /** Deletes a single `Friendship` using a unique key. */
  deleteFriendshipById?: Maybe<DeleteFriendshipPayload>;
  /** Deletes a single `Friendship` using a unique key. */
  deleteFriendshipByRequesterIdAndRecipientId?: Maybe<DeleteFriendshipPayload>;
  /** Deletes a single `HugRequest` using its globally unique id. */
  deleteHugRequest?: Maybe<DeleteHugRequestPayload>;
  /** Deletes a single `HugRequest` using a unique key. */
  deleteHugRequestById?: Maybe<DeleteHugRequestPayload>;
  /** Deletes a single `Hug` using its globally unique id. */
  deleteHug?: Maybe<DeleteHugPayload>;
  /** Deletes a single `Hug` using a unique key. */
  deleteHugById?: Maybe<DeleteHugPayload>;
  /** Deletes a single `Migration` using its globally unique id. */
  deleteMigration?: Maybe<DeleteMigrationPayload>;
  /** Deletes a single `Migration` using a unique key. */
  deleteMigrationById?: Maybe<DeleteMigrationPayload>;
  /** Deletes a single `Migration` using a unique key. */
  deleteMigrationByName?: Maybe<DeleteMigrationPayload>;
  /** Deletes a single `Mood` using its globally unique id. */
  deleteMood?: Maybe<DeleteMoodPayload>;
  /** Deletes a single `Mood` using a unique key. */
  deleteMoodById?: Maybe<DeleteMoodPayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserById?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByUsername?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUserByEmail?: Maybe<DeleteUserPayload>;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateFriendshipArgs = {
  input: CreateFriendshipInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateHugRequestArgs = {
  input: CreateHugRequestInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateHugArgs = {
  input: CreateHugInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateMigrationArgs = {
  input: CreateMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateMoodArgs = {
  input: CreateMoodInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationcreateUserArgs = {
  input: CreateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateFriendshipArgs = {
  input: UpdateFriendshipInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateFriendshipByIdArgs = {
  input: UpdateFriendshipByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateFriendshipByRequesterIdAndRecipientIdArgs = {
  input: UpdateFriendshipByRequesterIdAndRecipientIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateHugRequestArgs = {
  input: UpdateHugRequestInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateHugRequestByIdArgs = {
  input: UpdateHugRequestByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateHugArgs = {
  input: UpdateHugInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateHugByIdArgs = {
  input: UpdateHugByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMigrationArgs = {
  input: UpdateMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMigrationByIdArgs = {
  input: UpdateMigrationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMigrationByNameArgs = {
  input: UpdateMigrationByNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMoodArgs = {
  input: UpdateMoodInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateMoodByIdArgs = {
  input: UpdateMoodByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateUserArgs = {
  input: UpdateUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateUserByIdArgs = {
  input: UpdateUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateUserByUsernameArgs = {
  input: UpdateUserByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationupdateUserByEmailArgs = {
  input: UpdateUserByEmailInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteFriendshipArgs = {
  input: DeleteFriendshipInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteFriendshipByIdArgs = {
  input: DeleteFriendshipByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteFriendshipByRequesterIdAndRecipientIdArgs = {
  input: DeleteFriendshipByRequesterIdAndRecipientIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteHugRequestArgs = {
  input: DeleteHugRequestInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteHugRequestByIdArgs = {
  input: DeleteHugRequestByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteHugArgs = {
  input: DeleteHugInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteHugByIdArgs = {
  input: DeleteHugByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMigrationArgs = {
  input: DeleteMigrationInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMigrationByIdArgs = {
  input: DeleteMigrationByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMigrationByNameArgs = {
  input: DeleteMigrationByNameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMoodArgs = {
  input: DeleteMoodInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteMoodByIdArgs = {
  input: DeleteMoodByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteUserArgs = {
  input: DeleteUserInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteUserByIdArgs = {
  input: DeleteUserByIdInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteUserByUsernameArgs = {
  input: DeleteUserByUsernameInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationdeleteUserByEmailArgs = {
  input: DeleteUserByEmailInput;
};

/** The output of our create `Friendship` mutation. */
export type CreateFriendshipPayload = {
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
  friendshipEdge?: Maybe<FriendshipsEdge>;
};


/** The output of our create `Friendship` mutation. */
export type CreateFriendshipPayloadfriendshipEdgeArgs = {
  orderBy?: InputMaybe<Array<FriendshipsOrderBy>>;
};

/** All input for the create `Friendship` mutation. */
export type CreateFriendshipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Friendship` to be created by this mutation. */
  friendship: FriendshipInput;
};

/** An input for mutations affecting `Friendship` */
export type FriendshipInput = {
  id: Scalars['UUID']['input'];
  requesterId: Scalars['UUID']['input'];
  recipientId: Scalars['UUID']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  followsMood?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** The output of our create `HugRequest` mutation. */
export type CreateHugRequestPayload = {
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
  hugRequestEdge?: Maybe<HugRequestsEdge>;
};


/** The output of our create `HugRequest` mutation. */
export type CreateHugRequestPayloadhugRequestEdgeArgs = {
  orderBy?: InputMaybe<Array<HugRequestsOrderBy>>;
};

/** All input for the create `HugRequest` mutation. */
export type CreateHugRequestInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `HugRequest` to be created by this mutation. */
  hugRequest: HugRequestInput;
};

/** An input for mutations affecting `HugRequest` */
export type HugRequestInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  requesterId: Scalars['UUID']['input'];
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Whether this is a request to the community rather than a specific user */
  isCommunityRequest?: InputMaybe<Scalars['Boolean']['input']>;
  /** The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED) */
  status?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  respondedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** The output of our create `Hug` mutation. */
export type CreateHugPayload = {
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
  hugEdge?: Maybe<HugsEdge>;
};


/** The output of our create `Hug` mutation. */
export type CreateHugPayloadhugEdgeArgs = {
  orderBy?: InputMaybe<Array<HugsOrderBy>>;
};

/** All input for the create `Hug` mutation. */
export type CreateHugInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Hug` to be created by this mutation. */
  hug: HugInput;
};

/** An input for mutations affecting `Hug` */
export type HugInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The type of hug (QUICK, WARM, SUPPORTIVE, etc) */
  type: Scalars['String']['input'];
  message?: InputMaybe<Scalars['String']['input']>;
  senderId: Scalars['UUID']['input'];
  recipientId: Scalars['UUID']['input'];
  /** Whether the recipient has read the hug */
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** The output of our create `Migration` mutation. */
export type CreateMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Migration` that was created by this mutation. */
  migration?: Maybe<Migration>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Migration`. May be used by Relay 1. */
  migrationEdge?: Maybe<MigrationsEdge>;
};


/** The output of our create `Migration` mutation. */
export type CreateMigrationPayloadmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<MigrationsOrderBy>>;
};

/** All input for the create `Migration` mutation. */
export type CreateMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Migration` to be created by this mutation. */
  migration: MigrationInput;
};

/** An input for mutations affecting `Migration` */
export type MigrationInput = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  appliedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** The output of our create `Mood` mutation. */
export type CreateMoodPayload = {
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
  moodEdge?: Maybe<MoodsEdge>;
};


/** The output of our create `Mood` mutation. */
export type CreateMoodPayloadmoodEdgeArgs = {
  orderBy?: InputMaybe<Array<MoodsOrderBy>>;
};

/** All input for the create `Mood` mutation. */
export type CreateMoodInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Mood` to be created by this mutation. */
  mood: MoodInput;
};

/** An input for mutations affecting `Mood` */
export type MoodInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The mood score from 1-10 */
  score: Scalars['Int']['input'];
  note?: InputMaybe<Scalars['String']['input']>;
  /** Whether this mood entry is publicly visible */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['UUID']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
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
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our create `User` mutation. */
export type CreateUserPayloaduserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
};

/** An input for mutations affecting `User` */
export type UserInput = {
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
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** The output of our update `Friendship` mutation. */
export type UpdateFriendshipPayload = {
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
  friendshipEdge?: Maybe<FriendshipsEdge>;
};


/** The output of our update `Friendship` mutation. */
export type UpdateFriendshipPayloadfriendshipEdgeArgs = {
  orderBy?: InputMaybe<Array<FriendshipsOrderBy>>;
};

/** All input for the `updateFriendship` mutation. */
export type UpdateFriendshipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Friendship` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Friendship` being updated. */
  friendshipPatch: FriendshipPatch;
};

/** Represents an update to a `Friendship`. Fields that are set will be updated. */
export type FriendshipPatch = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  requesterId?: InputMaybe<Scalars['UUID']['input']>;
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  followsMood?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** All input for the `updateFriendshipById` mutation. */
export type UpdateFriendshipByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Friendship` being updated. */
  friendshipPatch: FriendshipPatch;
  id: Scalars['UUID']['input'];
};

/** All input for the `updateFriendshipByRequesterIdAndRecipientId` mutation. */
export type UpdateFriendshipByRequesterIdAndRecipientIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Friendship` being updated. */
  friendshipPatch: FriendshipPatch;
  requesterId: Scalars['UUID']['input'];
  recipientId: Scalars['UUID']['input'];
};

/** The output of our update `HugRequest` mutation. */
export type UpdateHugRequestPayload = {
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
  hugRequestEdge?: Maybe<HugRequestsEdge>;
};


/** The output of our update `HugRequest` mutation. */
export type UpdateHugRequestPayloadhugRequestEdgeArgs = {
  orderBy?: InputMaybe<Array<HugRequestsOrderBy>>;
};

/** All input for the `updateHugRequest` mutation. */
export type UpdateHugRequestInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `HugRequest` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `HugRequest` being updated. */
  hugRequestPatch: HugRequestPatch;
};

/** Represents an update to a `HugRequest`. Fields that are set will be updated. */
export type HugRequestPatch = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  requesterId?: InputMaybe<Scalars['UUID']['input']>;
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Whether this is a request to the community rather than a specific user */
  isCommunityRequest?: InputMaybe<Scalars['Boolean']['input']>;
  /** The status of the request (PENDING, ACCEPTED, DECLINED, EXPIRED, CANCELLED) */
  status?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  respondedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** All input for the `updateHugRequestById` mutation. */
export type UpdateHugRequestByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `HugRequest` being updated. */
  hugRequestPatch: HugRequestPatch;
  id: Scalars['UUID']['input'];
};

/** The output of our update `Hug` mutation. */
export type UpdateHugPayload = {
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
  hugEdge?: Maybe<HugsEdge>;
};


/** The output of our update `Hug` mutation. */
export type UpdateHugPayloadhugEdgeArgs = {
  orderBy?: InputMaybe<Array<HugsOrderBy>>;
};

/** All input for the `updateHug` mutation. */
export type UpdateHugInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Hug` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Hug` being updated. */
  hugPatch: HugPatch;
};

/** Represents an update to a `Hug`. Fields that are set will be updated. */
export type HugPatch = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The type of hug (QUICK, WARM, SUPPORTIVE, etc) */
  type?: InputMaybe<Scalars['String']['input']>;
  message?: InputMaybe<Scalars['String']['input']>;
  senderId?: InputMaybe<Scalars['UUID']['input']>;
  recipientId?: InputMaybe<Scalars['UUID']['input']>;
  /** Whether the recipient has read the hug */
  isRead?: InputMaybe<Scalars['Boolean']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** All input for the `updateHugById` mutation. */
export type UpdateHugByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Hug` being updated. */
  hugPatch: HugPatch;
  id: Scalars['UUID']['input'];
};

/** The output of our update `Migration` mutation. */
export type UpdateMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Migration` that was updated by this mutation. */
  migration?: Maybe<Migration>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Migration`. May be used by Relay 1. */
  migrationEdge?: Maybe<MigrationsEdge>;
};


/** The output of our update `Migration` mutation. */
export type UpdateMigrationPayloadmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<MigrationsOrderBy>>;
};

/** All input for the `updateMigration` mutation. */
export type UpdateMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Migration` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Migration` being updated. */
  migrationPatch: MigrationPatch;
};

/** Represents an update to a `Migration`. Fields that are set will be updated. */
export type MigrationPatch = {
  id?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  appliedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** All input for the `updateMigrationById` mutation. */
export type UpdateMigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Migration` being updated. */
  migrationPatch: MigrationPatch;
  id: Scalars['Int']['input'];
};

/** All input for the `updateMigrationByName` mutation. */
export type UpdateMigrationByNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Migration` being updated. */
  migrationPatch: MigrationPatch;
  name: Scalars['String']['input'];
};

/** The output of our update `Mood` mutation. */
export type UpdateMoodPayload = {
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
  moodEdge?: Maybe<MoodsEdge>;
};


/** The output of our update `Mood` mutation. */
export type UpdateMoodPayloadmoodEdgeArgs = {
  orderBy?: InputMaybe<Array<MoodsOrderBy>>;
};

/** All input for the `updateMood` mutation. */
export type UpdateMoodInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Mood` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Mood` being updated. */
  moodPatch: MoodPatch;
};

/** Represents an update to a `Mood`. Fields that are set will be updated. */
export type MoodPatch = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  /** The mood score from 1-10 */
  score?: InputMaybe<Scalars['Int']['input']>;
  note?: InputMaybe<Scalars['String']['input']>;
  /** Whether this mood entry is publicly visible */
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** All input for the `updateMoodById` mutation. */
export type UpdateMoodByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `Mood` being updated. */
  moodPatch: MoodPatch;
  id: Scalars['UUID']['input'];
};

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
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
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our update `User` mutation. */
export type UpdateUserPayloaduserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
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
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** All input for the `updateUserById` mutation. */
export type UpdateUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
  /** The primary unique identifier for the user */
  id: Scalars['UUID']['input'];
};

/** All input for the `updateUserByUsername` mutation. */
export type UpdateUserByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
  /** The username used to login */
  username: Scalars['String']['input'];
};

/** All input for the `updateUserByEmail` mutation. */
export type UpdateUserByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `User` being updated. */
  userPatch: UserPatch;
  /** The email address of the user */
  email: Scalars['String']['input'];
};

/** The output of our delete `Friendship` mutation. */
export type DeleteFriendshipPayload = {
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
  friendshipEdge?: Maybe<FriendshipsEdge>;
};


/** The output of our delete `Friendship` mutation. */
export type DeleteFriendshipPayloadfriendshipEdgeArgs = {
  orderBy?: InputMaybe<Array<FriendshipsOrderBy>>;
};

/** All input for the `deleteFriendship` mutation. */
export type DeleteFriendshipInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Friendship` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteFriendshipById` mutation. */
export type DeleteFriendshipByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteFriendshipByRequesterIdAndRecipientId` mutation. */
export type DeleteFriendshipByRequesterIdAndRecipientIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  requesterId: Scalars['UUID']['input'];
  recipientId: Scalars['UUID']['input'];
};

/** The output of our delete `HugRequest` mutation. */
export type DeleteHugRequestPayload = {
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
  hugRequestEdge?: Maybe<HugRequestsEdge>;
};


/** The output of our delete `HugRequest` mutation. */
export type DeleteHugRequestPayloadhugRequestEdgeArgs = {
  orderBy?: InputMaybe<Array<HugRequestsOrderBy>>;
};

/** All input for the `deleteHugRequest` mutation. */
export type DeleteHugRequestInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `HugRequest` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteHugRequestById` mutation. */
export type DeleteHugRequestByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `Hug` mutation. */
export type DeleteHugPayload = {
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
  hugEdge?: Maybe<HugsEdge>;
};


/** The output of our delete `Hug` mutation. */
export type DeleteHugPayloadhugEdgeArgs = {
  orderBy?: InputMaybe<Array<HugsOrderBy>>;
};

/** All input for the `deleteHug` mutation. */
export type DeleteHugInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Hug` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteHugById` mutation. */
export type DeleteHugByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `Migration` mutation. */
export type DeleteMigrationPayload = {
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Migration` that was deleted by this mutation. */
  migration?: Maybe<Migration>;
  deletedMigrationId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** An edge for our `Migration`. May be used by Relay 1. */
  migrationEdge?: Maybe<MigrationsEdge>;
};


/** The output of our delete `Migration` mutation. */
export type DeleteMigrationPayloadmigrationEdgeArgs = {
  orderBy?: InputMaybe<Array<MigrationsOrderBy>>;
};

/** All input for the `deleteMigration` mutation. */
export type DeleteMigrationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Migration` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteMigrationById` mutation. */
export type DeleteMigrationByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** All input for the `deleteMigrationByName` mutation. */
export type DeleteMigrationByNameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

/** The output of our delete `Mood` mutation. */
export type DeleteMoodPayload = {
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
  moodEdge?: Maybe<MoodsEdge>;
};


/** The output of our delete `Mood` mutation. */
export type DeleteMoodPayloadmoodEdgeArgs = {
  orderBy?: InputMaybe<Array<MoodsOrderBy>>;
};

/** All input for the `deleteMood` mutation. */
export type DeleteMoodInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Mood` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteMoodById` mutation. */
export type DeleteMoodByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['UUID']['input'];
};

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
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
  userEdge?: Maybe<UsersEdge>;
};


/** The output of our delete `User` mutation. */
export type DeleteUserPayloaduserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteUserById` mutation. */
export type DeleteUserByIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The primary unique identifier for the user */
  id: Scalars['UUID']['input'];
};

/** All input for the `deleteUserByUsername` mutation. */
export type DeleteUserByUsernameInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The username used to login */
  username: Scalars['String']['input'];
};

/** All input for the `deleteUserByEmail` mutation. */
export type DeleteUserByEmailInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The email address of the user */
  email: Scalars['String']['input'];
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
  Node: ( Omit<Query, 'query' | 'node'> & { query: _RefType['Query'], node?: Maybe<_RefType['Node']> } ) | ( Friendship ) | ( User ) | ( Mood ) | ( Hug ) | ( HugRequest ) | ( Migration );
}>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Query: ResolverTypeWrapper<{}>;
  Node: ResolverTypeWrapper<ResolversInterfaceTypes<ResolversTypes>['Node']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  FriendshipsConnection: ResolverTypeWrapper<FriendshipsConnection>;
  Friendship: ResolverTypeWrapper<Friendship>;
  UUID: ResolverTypeWrapper<Scalars['UUID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Datetime: ResolverTypeWrapper<Scalars['Datetime']['output']>;
  User: ResolverTypeWrapper<User>;
  MoodsConnection: ResolverTypeWrapper<MoodsConnection>;
  Mood: ResolverTypeWrapper<Mood>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  MoodsEdge: ResolverTypeWrapper<MoodsEdge>;
  Cursor: ResolverTypeWrapper<Scalars['Cursor']['output']>;
  PageInfo: ResolverTypeWrapper<PageInfo>;
  MoodsOrderBy: MoodsOrderBy;
  MoodCondition: MoodCondition;
  HugsConnection: ResolverTypeWrapper<HugsConnection>;
  Hug: ResolverTypeWrapper<Hug>;
  HugsEdge: ResolverTypeWrapper<HugsEdge>;
  HugsOrderBy: HugsOrderBy;
  HugCondition: HugCondition;
  HugRequestsConnection: ResolverTypeWrapper<HugRequestsConnection>;
  HugRequest: ResolverTypeWrapper<HugRequest>;
  HugRequestsEdge: ResolverTypeWrapper<HugRequestsEdge>;
  HugRequestsOrderBy: HugRequestsOrderBy;
  HugRequestCondition: HugRequestCondition;
  FriendshipsOrderBy: FriendshipsOrderBy;
  FriendshipCondition: FriendshipCondition;
  FriendshipsEdge: ResolverTypeWrapper<FriendshipsEdge>;
  MigrationsConnection: ResolverTypeWrapper<MigrationsConnection>;
  Migration: ResolverTypeWrapper<Migration>;
  MigrationsEdge: ResolverTypeWrapper<MigrationsEdge>;
  MigrationsOrderBy: MigrationsOrderBy;
  MigrationCondition: MigrationCondition;
  UsersConnection: ResolverTypeWrapper<UsersConnection>;
  UsersEdge: ResolverTypeWrapper<UsersEdge>;
  UsersOrderBy: UsersOrderBy;
  UserCondition: UserCondition;
  Mutation: ResolverTypeWrapper<{}>;
  CreateFriendshipPayload: ResolverTypeWrapper<Omit<CreateFriendshipPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  CreateFriendshipInput: CreateFriendshipInput;
  FriendshipInput: FriendshipInput;
  CreateHugRequestPayload: ResolverTypeWrapper<Omit<CreateHugRequestPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  CreateHugRequestInput: CreateHugRequestInput;
  HugRequestInput: HugRequestInput;
  CreateHugPayload: ResolverTypeWrapper<Omit<CreateHugPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  CreateHugInput: CreateHugInput;
  HugInput: HugInput;
  CreateMigrationPayload: ResolverTypeWrapper<Omit<CreateMigrationPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  CreateMigrationInput: CreateMigrationInput;
  MigrationInput: MigrationInput;
  CreateMoodPayload: ResolverTypeWrapper<Omit<CreateMoodPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  CreateMoodInput: CreateMoodInput;
  MoodInput: MoodInput;
  CreateUserPayload: ResolverTypeWrapper<Omit<CreateUserPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  CreateUserInput: CreateUserInput;
  UserInput: UserInput;
  UpdateFriendshipPayload: ResolverTypeWrapper<Omit<UpdateFriendshipPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  UpdateFriendshipInput: UpdateFriendshipInput;
  FriendshipPatch: FriendshipPatch;
  UpdateFriendshipByIdInput: UpdateFriendshipByIdInput;
  UpdateFriendshipByRequesterIdAndRecipientIdInput: UpdateFriendshipByRequesterIdAndRecipientIdInput;
  UpdateHugRequestPayload: ResolverTypeWrapper<Omit<UpdateHugRequestPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  UpdateHugRequestInput: UpdateHugRequestInput;
  HugRequestPatch: HugRequestPatch;
  UpdateHugRequestByIdInput: UpdateHugRequestByIdInput;
  UpdateHugPayload: ResolverTypeWrapper<Omit<UpdateHugPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  UpdateHugInput: UpdateHugInput;
  HugPatch: HugPatch;
  UpdateHugByIdInput: UpdateHugByIdInput;
  UpdateMigrationPayload: ResolverTypeWrapper<Omit<UpdateMigrationPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  UpdateMigrationInput: UpdateMigrationInput;
  MigrationPatch: MigrationPatch;
  UpdateMigrationByIdInput: UpdateMigrationByIdInput;
  UpdateMigrationByNameInput: UpdateMigrationByNameInput;
  UpdateMoodPayload: ResolverTypeWrapper<Omit<UpdateMoodPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  UpdateMoodInput: UpdateMoodInput;
  MoodPatch: MoodPatch;
  UpdateMoodByIdInput: UpdateMoodByIdInput;
  UpdateUserPayload: ResolverTypeWrapper<Omit<UpdateUserPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  UpdateUserInput: UpdateUserInput;
  UserPatch: UserPatch;
  UpdateUserByIdInput: UpdateUserByIdInput;
  UpdateUserByUsernameInput: UpdateUserByUsernameInput;
  UpdateUserByEmailInput: UpdateUserByEmailInput;
  DeleteFriendshipPayload: ResolverTypeWrapper<Omit<DeleteFriendshipPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  DeleteFriendshipInput: DeleteFriendshipInput;
  DeleteFriendshipByIdInput: DeleteFriendshipByIdInput;
  DeleteFriendshipByRequesterIdAndRecipientIdInput: DeleteFriendshipByRequesterIdAndRecipientIdInput;
  DeleteHugRequestPayload: ResolverTypeWrapper<Omit<DeleteHugRequestPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  DeleteHugRequestInput: DeleteHugRequestInput;
  DeleteHugRequestByIdInput: DeleteHugRequestByIdInput;
  DeleteHugPayload: ResolverTypeWrapper<Omit<DeleteHugPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  DeleteHugInput: DeleteHugInput;
  DeleteHugByIdInput: DeleteHugByIdInput;
  DeleteMigrationPayload: ResolverTypeWrapper<Omit<DeleteMigrationPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  DeleteMigrationInput: DeleteMigrationInput;
  DeleteMigrationByIdInput: DeleteMigrationByIdInput;
  DeleteMigrationByNameInput: DeleteMigrationByNameInput;
  DeleteMoodPayload: ResolverTypeWrapper<Omit<DeleteMoodPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  DeleteMoodInput: DeleteMoodInput;
  DeleteMoodByIdInput: DeleteMoodByIdInput;
  DeleteUserPayload: ResolverTypeWrapper<Omit<DeleteUserPayload, 'query'> & { query?: Maybe<ResolversTypes['Query']> }>;
  DeleteUserInput: DeleteUserInput;
  DeleteUserByIdInput: DeleteUserByIdInput;
  DeleteUserByUsernameInput: DeleteUserByUsernameInput;
  DeleteUserByEmailInput: DeleteUserByEmailInput;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Query: {};
  Node: ResolversInterfaceTypes<ResolversParentTypes>['Node'];
  ID: Scalars['ID']['output'];
  FriendshipsConnection: FriendshipsConnection;
  Friendship: Friendship;
  UUID: Scalars['UUID']['output'];
  String: Scalars['String']['output'];
  Boolean: Scalars['Boolean']['output'];
  Datetime: Scalars['Datetime']['output'];
  User: User;
  MoodsConnection: MoodsConnection;
  Mood: Mood;
  Int: Scalars['Int']['output'];
  MoodsEdge: MoodsEdge;
  Cursor: Scalars['Cursor']['output'];
  PageInfo: PageInfo;
  MoodCondition: MoodCondition;
  HugsConnection: HugsConnection;
  Hug: Hug;
  HugsEdge: HugsEdge;
  HugCondition: HugCondition;
  HugRequestsConnection: HugRequestsConnection;
  HugRequest: HugRequest;
  HugRequestsEdge: HugRequestsEdge;
  HugRequestCondition: HugRequestCondition;
  FriendshipCondition: FriendshipCondition;
  FriendshipsEdge: FriendshipsEdge;
  MigrationsConnection: MigrationsConnection;
  Migration: Migration;
  MigrationsEdge: MigrationsEdge;
  MigrationCondition: MigrationCondition;
  UsersConnection: UsersConnection;
  UsersEdge: UsersEdge;
  UserCondition: UserCondition;
  Mutation: {};
  CreateFriendshipPayload: Omit<CreateFriendshipPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  CreateFriendshipInput: CreateFriendshipInput;
  FriendshipInput: FriendshipInput;
  CreateHugRequestPayload: Omit<CreateHugRequestPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  CreateHugRequestInput: CreateHugRequestInput;
  HugRequestInput: HugRequestInput;
  CreateHugPayload: Omit<CreateHugPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  CreateHugInput: CreateHugInput;
  HugInput: HugInput;
  CreateMigrationPayload: Omit<CreateMigrationPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  CreateMigrationInput: CreateMigrationInput;
  MigrationInput: MigrationInput;
  CreateMoodPayload: Omit<CreateMoodPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  CreateMoodInput: CreateMoodInput;
  MoodInput: MoodInput;
  CreateUserPayload: Omit<CreateUserPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  CreateUserInput: CreateUserInput;
  UserInput: UserInput;
  UpdateFriendshipPayload: Omit<UpdateFriendshipPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  UpdateFriendshipInput: UpdateFriendshipInput;
  FriendshipPatch: FriendshipPatch;
  UpdateFriendshipByIdInput: UpdateFriendshipByIdInput;
  UpdateFriendshipByRequesterIdAndRecipientIdInput: UpdateFriendshipByRequesterIdAndRecipientIdInput;
  UpdateHugRequestPayload: Omit<UpdateHugRequestPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  UpdateHugRequestInput: UpdateHugRequestInput;
  HugRequestPatch: HugRequestPatch;
  UpdateHugRequestByIdInput: UpdateHugRequestByIdInput;
  UpdateHugPayload: Omit<UpdateHugPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  UpdateHugInput: UpdateHugInput;
  HugPatch: HugPatch;
  UpdateHugByIdInput: UpdateHugByIdInput;
  UpdateMigrationPayload: Omit<UpdateMigrationPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  UpdateMigrationInput: UpdateMigrationInput;
  MigrationPatch: MigrationPatch;
  UpdateMigrationByIdInput: UpdateMigrationByIdInput;
  UpdateMigrationByNameInput: UpdateMigrationByNameInput;
  UpdateMoodPayload: Omit<UpdateMoodPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  UpdateMoodInput: UpdateMoodInput;
  MoodPatch: MoodPatch;
  UpdateMoodByIdInput: UpdateMoodByIdInput;
  UpdateUserPayload: Omit<UpdateUserPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  UpdateUserInput: UpdateUserInput;
  UserPatch: UserPatch;
  UpdateUserByIdInput: UpdateUserByIdInput;
  UpdateUserByUsernameInput: UpdateUserByUsernameInput;
  UpdateUserByEmailInput: UpdateUserByEmailInput;
  DeleteFriendshipPayload: Omit<DeleteFriendshipPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  DeleteFriendshipInput: DeleteFriendshipInput;
  DeleteFriendshipByIdInput: DeleteFriendshipByIdInput;
  DeleteFriendshipByRequesterIdAndRecipientIdInput: DeleteFriendshipByRequesterIdAndRecipientIdInput;
  DeleteHugRequestPayload: Omit<DeleteHugRequestPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  DeleteHugRequestInput: DeleteHugRequestInput;
  DeleteHugRequestByIdInput: DeleteHugRequestByIdInput;
  DeleteHugPayload: Omit<DeleteHugPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  DeleteHugInput: DeleteHugInput;
  DeleteHugByIdInput: DeleteHugByIdInput;
  DeleteMigrationPayload: Omit<DeleteMigrationPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  DeleteMigrationInput: DeleteMigrationInput;
  DeleteMigrationByIdInput: DeleteMigrationByIdInput;
  DeleteMigrationByNameInput: DeleteMigrationByNameInput;
  DeleteMoodPayload: Omit<DeleteMoodPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  DeleteMoodInput: DeleteMoodInput;
  DeleteMoodByIdInput: DeleteMoodByIdInput;
  DeleteUserPayload: Omit<DeleteUserPayload, 'query'> & { query?: Maybe<ResolversParentTypes['Query']> };
  DeleteUserInput: DeleteUserInput;
  DeleteUserByIdInput: DeleteUserByIdInput;
  DeleteUserByUsernameInput: DeleteUserByUsernameInput;
  DeleteUserByEmailInput: DeleteUserByEmailInput;
}>;

export type QueryResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  query?: Resolver<ResolversTypes['Query'], ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  node?: Resolver<Maybe<ResolversTypes['Node']>, ParentType, ContextType, RequireFields<QuerynodeArgs, 'nodeId'>>;
  allFriendships?: Resolver<Maybe<ResolversTypes['FriendshipsConnection']>, ParentType, ContextType, RequireFields<QueryallFriendshipsArgs, 'orderBy'>>;
  allHugRequests?: Resolver<Maybe<ResolversTypes['HugRequestsConnection']>, ParentType, ContextType, RequireFields<QueryallHugRequestsArgs, 'orderBy'>>;
  allHugs?: Resolver<Maybe<ResolversTypes['HugsConnection']>, ParentType, ContextType, RequireFields<QueryallHugsArgs, 'orderBy'>>;
  allMigrations?: Resolver<Maybe<ResolversTypes['MigrationsConnection']>, ParentType, ContextType, RequireFields<QueryallMigrationsArgs, 'orderBy'>>;
  allMoods?: Resolver<Maybe<ResolversTypes['MoodsConnection']>, ParentType, ContextType, RequireFields<QueryallMoodsArgs, 'orderBy'>>;
  allUsers?: Resolver<Maybe<ResolversTypes['UsersConnection']>, ParentType, ContextType, RequireFields<QueryallUsersArgs, 'orderBy'>>;
  friendshipById?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType, RequireFields<QueryfriendshipByIdArgs, 'id'>>;
  friendshipByRequesterIdAndRecipientId?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType, RequireFields<QueryfriendshipByRequesterIdAndRecipientIdArgs, 'requesterId' | 'recipientId'>>;
  hugRequestById?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType, RequireFields<QueryhugRequestByIdArgs, 'id'>>;
  hugById?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<QueryhugByIdArgs, 'id'>>;
  migrationById?: Resolver<Maybe<ResolversTypes['Migration']>, ParentType, ContextType, RequireFields<QuerymigrationByIdArgs, 'id'>>;
  migrationByName?: Resolver<Maybe<ResolversTypes['Migration']>, ParentType, ContextType, RequireFields<QuerymigrationByNameArgs, 'name'>>;
  moodById?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType, RequireFields<QuerymoodByIdArgs, 'id'>>;
  userById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserByIdArgs, 'id'>>;
  userByUsername?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserByUsernameArgs, 'username'>>;
  userByEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserByEmailArgs, 'email'>>;
  friendship?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType, RequireFields<QueryfriendshipArgs, 'nodeId'>>;
  hugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType, RequireFields<QueryhugRequestArgs, 'nodeId'>>;
  hug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType, RequireFields<QueryhugArgs, 'nodeId'>>;
  migration?: Resolver<Maybe<ResolversTypes['Migration']>, ParentType, ContextType, RequireFields<QuerymigrationArgs, 'nodeId'>>;
  mood?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType, RequireFields<QuerymoodArgs, 'nodeId'>>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryuserArgs, 'nodeId'>>;
}>;

export type NodeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Node'] = ResolversParentTypes['Node']> = ResolversObject<{
  __resolveType: TypeResolveFn<'Query' | 'Friendship' | 'User' | 'Mood' | 'Hug' | 'HugRequest' | 'Migration', ParentType, ContextType>;
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
}>;

export type FriendshipsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FriendshipsConnection'] = ResolversParentTypes['FriendshipsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['Friendship']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['FriendshipsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
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
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  updatedAt?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface UUIDScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID';
}

export interface DatetimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Datetime'], any> {
  name: 'Datetime';
}

export type UserResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  avatarUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isAnonymous?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  moodsByUserId?: Resolver<ResolversTypes['MoodsConnection'], ParentType, ContextType, RequireFields<UsermoodsByUserIdArgs, 'orderBy'>>;
  hugsBySenderId?: Resolver<ResolversTypes['HugsConnection'], ParentType, ContextType, RequireFields<UserhugsBySenderIdArgs, 'orderBy'>>;
  hugsByRecipientId?: Resolver<ResolversTypes['HugsConnection'], ParentType, ContextType, RequireFields<UserhugsByRecipientIdArgs, 'orderBy'>>;
  hugRequestsByRequesterId?: Resolver<ResolversTypes['HugRequestsConnection'], ParentType, ContextType, RequireFields<UserhugRequestsByRequesterIdArgs, 'orderBy'>>;
  hugRequestsByRecipientId?: Resolver<ResolversTypes['HugRequestsConnection'], ParentType, ContextType, RequireFields<UserhugRequestsByRecipientIdArgs, 'orderBy'>>;
  friendshipsByRequesterId?: Resolver<ResolversTypes['FriendshipsConnection'], ParentType, ContextType, RequireFields<UserfriendshipsByRequesterIdArgs, 'orderBy'>>;
  friendshipsByRecipientId?: Resolver<ResolversTypes['FriendshipsConnection'], ParentType, ContextType, RequireFields<UserfriendshipsByRecipientIdArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoodsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MoodsConnection'] = ResolversParentTypes['MoodsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['Mood']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['MoodsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoodResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mood'] = ResolversParentTypes['Mood']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  score?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  isPublic?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  userByUserId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MoodsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MoodsEdge'] = ResolversParentTypes['MoodsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Mood'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface CursorScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Cursor'], any> {
  name: 'Cursor';
}

export type PageInfoResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['PageInfo'] = ResolversParentTypes['PageInfo']> = ResolversObject<{
  hasNextPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  hasPreviousPage?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  startCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  endCursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HugsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HugsConnection'] = ResolversParentTypes['HugsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['Hug']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['HugsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
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
  isRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  userBySenderId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HugsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HugsEdge'] = ResolversParentTypes['HugsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Hug'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HugRequestsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HugRequestsConnection'] = ResolversParentTypes['HugRequestsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['HugRequest']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['HugRequestsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
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
  createdAt?: Resolver<ResolversTypes['Datetime'], ParentType, ContextType>;
  respondedAt?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type HugRequestsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['HugRequestsEdge'] = ResolversParentTypes['HugRequestsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['HugRequest'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type FriendshipsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['FriendshipsEdge'] = ResolversParentTypes['FriendshipsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Friendship'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MigrationsConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MigrationsConnection'] = ResolversParentTypes['MigrationsConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['Migration']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['MigrationsEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MigrationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Migration'] = ResolversParentTypes['Migration']> = ResolversObject<{
  nodeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  appliedAt?: Resolver<Maybe<ResolversTypes['Datetime']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MigrationsEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['MigrationsEdge'] = ResolversParentTypes['MigrationsEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['Migration'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsersConnectionResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UsersConnection'] = ResolversParentTypes['UsersConnection']> = ResolversObject<{
  nodes?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  edges?: Resolver<Array<ResolversTypes['UsersEdge']>, ParentType, ContextType>;
  pageInfo?: Resolver<ResolversTypes['PageInfo'], ParentType, ContextType>;
  totalCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UsersEdgeResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UsersEdge'] = ResolversParentTypes['UsersEdge']> = ResolversObject<{
  cursor?: Resolver<Maybe<ResolversTypes['Cursor']>, ParentType, ContextType>;
  node?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createFriendship?: Resolver<Maybe<ResolversTypes['CreateFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationcreateFriendshipArgs, 'input'>>;
  createHugRequest?: Resolver<Maybe<ResolversTypes['CreateHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationcreateHugRequestArgs, 'input'>>;
  createHug?: Resolver<Maybe<ResolversTypes['CreateHugPayload']>, ParentType, ContextType, RequireFields<MutationcreateHugArgs, 'input'>>;
  createMigration?: Resolver<Maybe<ResolversTypes['CreateMigrationPayload']>, ParentType, ContextType, RequireFields<MutationcreateMigrationArgs, 'input'>>;
  createMood?: Resolver<Maybe<ResolversTypes['CreateMoodPayload']>, ParentType, ContextType, RequireFields<MutationcreateMoodArgs, 'input'>>;
  createUser?: Resolver<Maybe<ResolversTypes['CreateUserPayload']>, ParentType, ContextType, RequireFields<MutationcreateUserArgs, 'input'>>;
  updateFriendship?: Resolver<Maybe<ResolversTypes['UpdateFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationupdateFriendshipArgs, 'input'>>;
  updateFriendshipById?: Resolver<Maybe<ResolversTypes['UpdateFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationupdateFriendshipByIdArgs, 'input'>>;
  updateFriendshipByRequesterIdAndRecipientId?: Resolver<Maybe<ResolversTypes['UpdateFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationupdateFriendshipByRequesterIdAndRecipientIdArgs, 'input'>>;
  updateHugRequest?: Resolver<Maybe<ResolversTypes['UpdateHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationupdateHugRequestArgs, 'input'>>;
  updateHugRequestById?: Resolver<Maybe<ResolversTypes['UpdateHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationupdateHugRequestByIdArgs, 'input'>>;
  updateHug?: Resolver<Maybe<ResolversTypes['UpdateHugPayload']>, ParentType, ContextType, RequireFields<MutationupdateHugArgs, 'input'>>;
  updateHugById?: Resolver<Maybe<ResolversTypes['UpdateHugPayload']>, ParentType, ContextType, RequireFields<MutationupdateHugByIdArgs, 'input'>>;
  updateMigration?: Resolver<Maybe<ResolversTypes['UpdateMigrationPayload']>, ParentType, ContextType, RequireFields<MutationupdateMigrationArgs, 'input'>>;
  updateMigrationById?: Resolver<Maybe<ResolversTypes['UpdateMigrationPayload']>, ParentType, ContextType, RequireFields<MutationupdateMigrationByIdArgs, 'input'>>;
  updateMigrationByName?: Resolver<Maybe<ResolversTypes['UpdateMigrationPayload']>, ParentType, ContextType, RequireFields<MutationupdateMigrationByNameArgs, 'input'>>;
  updateMood?: Resolver<Maybe<ResolversTypes['UpdateMoodPayload']>, ParentType, ContextType, RequireFields<MutationupdateMoodArgs, 'input'>>;
  updateMoodById?: Resolver<Maybe<ResolversTypes['UpdateMoodPayload']>, ParentType, ContextType, RequireFields<MutationupdateMoodByIdArgs, 'input'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['UpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationupdateUserArgs, 'input'>>;
  updateUserById?: Resolver<Maybe<ResolversTypes['UpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationupdateUserByIdArgs, 'input'>>;
  updateUserByUsername?: Resolver<Maybe<ResolversTypes['UpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationupdateUserByUsernameArgs, 'input'>>;
  updateUserByEmail?: Resolver<Maybe<ResolversTypes['UpdateUserPayload']>, ParentType, ContextType, RequireFields<MutationupdateUserByEmailArgs, 'input'>>;
  deleteFriendship?: Resolver<Maybe<ResolversTypes['DeleteFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationdeleteFriendshipArgs, 'input'>>;
  deleteFriendshipById?: Resolver<Maybe<ResolversTypes['DeleteFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationdeleteFriendshipByIdArgs, 'input'>>;
  deleteFriendshipByRequesterIdAndRecipientId?: Resolver<Maybe<ResolversTypes['DeleteFriendshipPayload']>, ParentType, ContextType, RequireFields<MutationdeleteFriendshipByRequesterIdAndRecipientIdArgs, 'input'>>;
  deleteHugRequest?: Resolver<Maybe<ResolversTypes['DeleteHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationdeleteHugRequestArgs, 'input'>>;
  deleteHugRequestById?: Resolver<Maybe<ResolversTypes['DeleteHugRequestPayload']>, ParentType, ContextType, RequireFields<MutationdeleteHugRequestByIdArgs, 'input'>>;
  deleteHug?: Resolver<Maybe<ResolversTypes['DeleteHugPayload']>, ParentType, ContextType, RequireFields<MutationdeleteHugArgs, 'input'>>;
  deleteHugById?: Resolver<Maybe<ResolversTypes['DeleteHugPayload']>, ParentType, ContextType, RequireFields<MutationdeleteHugByIdArgs, 'input'>>;
  deleteMigration?: Resolver<Maybe<ResolversTypes['DeleteMigrationPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMigrationArgs, 'input'>>;
  deleteMigrationById?: Resolver<Maybe<ResolversTypes['DeleteMigrationPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMigrationByIdArgs, 'input'>>;
  deleteMigrationByName?: Resolver<Maybe<ResolversTypes['DeleteMigrationPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMigrationByNameArgs, 'input'>>;
  deleteMood?: Resolver<Maybe<ResolversTypes['DeleteMoodPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMoodArgs, 'input'>>;
  deleteMoodById?: Resolver<Maybe<ResolversTypes['DeleteMoodPayload']>, ParentType, ContextType, RequireFields<MutationdeleteMoodByIdArgs, 'input'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['DeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationdeleteUserArgs, 'input'>>;
  deleteUserById?: Resolver<Maybe<ResolversTypes['DeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationdeleteUserByIdArgs, 'input'>>;
  deleteUserByUsername?: Resolver<Maybe<ResolversTypes['DeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationdeleteUserByUsernameArgs, 'input'>>;
  deleteUserByEmail?: Resolver<Maybe<ResolversTypes['DeleteUserPayload']>, ParentType, ContextType, RequireFields<MutationdeleteUserByEmailArgs, 'input'>>;
}>;

export type CreateFriendshipPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CreateFriendshipPayload'] = ResolversParentTypes['CreateFriendshipPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friendship?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  friendshipEdge?: Resolver<Maybe<ResolversTypes['FriendshipsEdge']>, ParentType, ContextType, RequireFields<CreateFriendshipPayloadfriendshipEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateHugRequestPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CreateHugRequestPayload'] = ResolversParentTypes['CreateHugRequestPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugRequestEdge?: Resolver<Maybe<ResolversTypes['HugRequestsEdge']>, ParentType, ContextType, RequireFields<CreateHugRequestPayloadhugRequestEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateHugPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CreateHugPayload'] = ResolversParentTypes['CreateHugPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userBySenderId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugEdge?: Resolver<Maybe<ResolversTypes['HugsEdge']>, ParentType, ContextType, RequireFields<CreateHugPayloadhugEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateMigrationPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CreateMigrationPayload'] = ResolversParentTypes['CreateMigrationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  migration?: Resolver<Maybe<ResolversTypes['Migration']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  migrationEdge?: Resolver<Maybe<ResolversTypes['MigrationsEdge']>, ParentType, ContextType, RequireFields<CreateMigrationPayloadmigrationEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateMoodPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CreateMoodPayload'] = ResolversParentTypes['CreateMoodPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mood?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByUserId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  moodEdge?: Resolver<Maybe<ResolversTypes['MoodsEdge']>, ParentType, ContextType, RequireFields<CreateMoodPayloadmoodEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CreateUserPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['CreateUserPayload'] = ResolversParentTypes['CreateUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['UsersEdge']>, ParentType, ContextType, RequireFields<CreateUserPayloaduserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateFriendshipPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UpdateFriendshipPayload'] = ResolversParentTypes['UpdateFriendshipPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friendship?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  friendshipEdge?: Resolver<Maybe<ResolversTypes['FriendshipsEdge']>, ParentType, ContextType, RequireFields<UpdateFriendshipPayloadfriendshipEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateHugRequestPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UpdateHugRequestPayload'] = ResolversParentTypes['UpdateHugRequestPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugRequestEdge?: Resolver<Maybe<ResolversTypes['HugRequestsEdge']>, ParentType, ContextType, RequireFields<UpdateHugRequestPayloadhugRequestEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateHugPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UpdateHugPayload'] = ResolversParentTypes['UpdateHugPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userBySenderId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugEdge?: Resolver<Maybe<ResolversTypes['HugsEdge']>, ParentType, ContextType, RequireFields<UpdateHugPayloadhugEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateMigrationPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UpdateMigrationPayload'] = ResolversParentTypes['UpdateMigrationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  migration?: Resolver<Maybe<ResolversTypes['Migration']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  migrationEdge?: Resolver<Maybe<ResolversTypes['MigrationsEdge']>, ParentType, ContextType, RequireFields<UpdateMigrationPayloadmigrationEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateMoodPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UpdateMoodPayload'] = ResolversParentTypes['UpdateMoodPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mood?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByUserId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  moodEdge?: Resolver<Maybe<ResolversTypes['MoodsEdge']>, ParentType, ContextType, RequireFields<UpdateMoodPayloadmoodEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UpdateUserPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['UpdateUserPayload'] = ResolversParentTypes['UpdateUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['UsersEdge']>, ParentType, ContextType, RequireFields<UpdateUserPayloaduserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteFriendshipPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DeleteFriendshipPayload'] = ResolversParentTypes['DeleteFriendshipPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  friendship?: Resolver<Maybe<ResolversTypes['Friendship']>, ParentType, ContextType>;
  deletedFriendshipId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  friendshipEdge?: Resolver<Maybe<ResolversTypes['FriendshipsEdge']>, ParentType, ContextType, RequireFields<DeleteFriendshipPayloadfriendshipEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteHugRequestPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DeleteHugRequestPayload'] = ResolversParentTypes['DeleteHugRequestPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hugRequest?: Resolver<Maybe<ResolversTypes['HugRequest']>, ParentType, ContextType>;
  deletedHugRequestId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByRequesterId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugRequestEdge?: Resolver<Maybe<ResolversTypes['HugRequestsEdge']>, ParentType, ContextType, RequireFields<DeleteHugRequestPayloadhugRequestEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteHugPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DeleteHugPayload'] = ResolversParentTypes['DeleteHugPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  hug?: Resolver<Maybe<ResolversTypes['Hug']>, ParentType, ContextType>;
  deletedHugId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userBySenderId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  userByRecipientId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  hugEdge?: Resolver<Maybe<ResolversTypes['HugsEdge']>, ParentType, ContextType, RequireFields<DeleteHugPayloadhugEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteMigrationPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DeleteMigrationPayload'] = ResolversParentTypes['DeleteMigrationPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  migration?: Resolver<Maybe<ResolversTypes['Migration']>, ParentType, ContextType>;
  deletedMigrationId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  migrationEdge?: Resolver<Maybe<ResolversTypes['MigrationsEdge']>, ParentType, ContextType, RequireFields<DeleteMigrationPayloadmigrationEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteMoodPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DeleteMoodPayload'] = ResolversParentTypes['DeleteMoodPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  mood?: Resolver<Maybe<ResolversTypes['Mood']>, ParentType, ContextType>;
  deletedMoodId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userByUserId?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  moodEdge?: Resolver<Maybe<ResolversTypes['MoodsEdge']>, ParentType, ContextType, RequireFields<DeleteMoodPayloadmoodEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type DeleteUserPayloadResolvers<ContextType = MeshContext, ParentType extends ResolversParentTypes['DeleteUserPayload'] = ResolversParentTypes['DeleteUserPayload']> = ResolversObject<{
  clientMutationId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  deletedUserId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  query?: Resolver<Maybe<ResolversTypes['Query']>, ParentType, ContextType>;
  userEdge?: Resolver<Maybe<ResolversTypes['UsersEdge']>, ParentType, ContextType, RequireFields<DeleteUserPayloaduserEdgeArgs, 'orderBy'>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  Query?: QueryResolvers<ContextType>;
  Node?: NodeResolvers<ContextType>;
  FriendshipsConnection?: FriendshipsConnectionResolvers<ContextType>;
  Friendship?: FriendshipResolvers<ContextType>;
  UUID?: GraphQLScalarType;
  Datetime?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
  MoodsConnection?: MoodsConnectionResolvers<ContextType>;
  Mood?: MoodResolvers<ContextType>;
  MoodsEdge?: MoodsEdgeResolvers<ContextType>;
  Cursor?: GraphQLScalarType;
  PageInfo?: PageInfoResolvers<ContextType>;
  HugsConnection?: HugsConnectionResolvers<ContextType>;
  Hug?: HugResolvers<ContextType>;
  HugsEdge?: HugsEdgeResolvers<ContextType>;
  HugRequestsConnection?: HugRequestsConnectionResolvers<ContextType>;
  HugRequest?: HugRequestResolvers<ContextType>;
  HugRequestsEdge?: HugRequestsEdgeResolvers<ContextType>;
  FriendshipsEdge?: FriendshipsEdgeResolvers<ContextType>;
  MigrationsConnection?: MigrationsConnectionResolvers<ContextType>;
  Migration?: MigrationResolvers<ContextType>;
  MigrationsEdge?: MigrationsEdgeResolvers<ContextType>;
  UsersConnection?: UsersConnectionResolvers<ContextType>;
  UsersEdge?: UsersEdgeResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  CreateFriendshipPayload?: CreateFriendshipPayloadResolvers<ContextType>;
  CreateHugRequestPayload?: CreateHugRequestPayloadResolvers<ContextType>;
  CreateHugPayload?: CreateHugPayloadResolvers<ContextType>;
  CreateMigrationPayload?: CreateMigrationPayloadResolvers<ContextType>;
  CreateMoodPayload?: CreateMoodPayloadResolvers<ContextType>;
  CreateUserPayload?: CreateUserPayloadResolvers<ContextType>;
  UpdateFriendshipPayload?: UpdateFriendshipPayloadResolvers<ContextType>;
  UpdateHugRequestPayload?: UpdateHugRequestPayloadResolvers<ContextType>;
  UpdateHugPayload?: UpdateHugPayloadResolvers<ContextType>;
  UpdateMigrationPayload?: UpdateMigrationPayloadResolvers<ContextType>;
  UpdateMoodPayload?: UpdateMoodPayloadResolvers<ContextType>;
  UpdateUserPayload?: UpdateUserPayloadResolvers<ContextType>;
  DeleteFriendshipPayload?: DeleteFriendshipPayloadResolvers<ContextType>;
  DeleteHugRequestPayload?: DeleteHugRequestPayloadResolvers<ContextType>;
  DeleteHugPayload?: DeleteHugPayloadResolvers<ContextType>;
  DeleteMigrationPayload?: DeleteMigrationPayloadResolvers<ContextType>;
  DeleteMoodPayload?: DeleteMoodPayloadResolvers<ContextType>;
  DeleteUserPayload?: DeleteUserPayloadResolvers<ContextType>;
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

export const rawServeConfig: YamlConfig.Config['serve'] = {"browser":false,"playground":true} as any
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
const additionalTypeDefs = [] as any[];
const PostGraphileApiHandler = await import("@graphql-mesh/graphql").then(handleImport);
const postGraphileApiHandler = new PostGraphileApiHandler({
              name: "PostGraphileAPI",
              config: {"endpoint":"http://localhost:3003/postgraphile/graphql","batch":true},
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
const additionalResolvers = [] as any[]
const Merger = await import("@graphql-mesh/merger-bare").then(handleImport);
const merger = new Merger({
        cache,
        pubsub,
        logger: logger.child({ merger: "bare" }),
        store: rootStore.child("bare")
      })
const documentHashMap = {
        "174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": PublicMoodsDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": UserMoodsDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": MoodStreakDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": CommunityHugRequestsDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": ReceivedHugsDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": SentHugsDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": CreateMoodDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": SendHugDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": CreateHugRequestDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": UpdateHugRequestDocument,
"174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa": PendingHugRequestsDocument
      }
const usePersistedOperations = await import('@graphql-yoga/plugin-persisted-operations').then(m => m?.usePersistedOperations);
additionalEnvelopPlugins.push(usePersistedOperations({
        getPersistedOperation(key) {
          return documentHashMap[key];
        },
        allowArbitraryOperations: true,
        ...{}
      }))

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
      {
        document: PublicMoodsDocument,
        get rawSDL() {
          return printWithCache(PublicMoodsDocument);
        },
        location: 'PublicMoodsDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: UserMoodsDocument,
        get rawSDL() {
          return printWithCache(UserMoodsDocument);
        },
        location: 'UserMoodsDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: MoodStreakDocument,
        get rawSDL() {
          return printWithCache(MoodStreakDocument);
        },
        location: 'MoodStreakDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: CommunityHugRequestsDocument,
        get rawSDL() {
          return printWithCache(CommunityHugRequestsDocument);
        },
        location: 'CommunityHugRequestsDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: ReceivedHugsDocument,
        get rawSDL() {
          return printWithCache(ReceivedHugsDocument);
        },
        location: 'ReceivedHugsDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: SentHugsDocument,
        get rawSDL() {
          return printWithCache(SentHugsDocument);
        },
        location: 'SentHugsDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: CreateMoodDocument,
        get rawSDL() {
          return printWithCache(CreateMoodDocument);
        },
        location: 'CreateMoodDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: SendHugDocument,
        get rawSDL() {
          return printWithCache(SendHugDocument);
        },
        location: 'SendHugDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: CreateHugRequestDocument,
        get rawSDL() {
          return printWithCache(CreateHugRequestDocument);
        },
        location: 'CreateHugRequestDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: UpdateHugRequestDocument,
        get rawSDL() {
          return printWithCache(UpdateHugRequestDocument);
        },
        location: 'UpdateHugRequestDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      },{
        document: PendingHugRequestsDocument,
        get rawSDL() {
          return printWithCache(PendingHugRequestsDocument);
        },
        location: 'PendingHugRequestsDocument.graphql',
        sha256Hash: '174d131fe089d421ee32d764efa775b9755d421c7bfb40298c772149d2c354fa'
      }
    ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<TServerContext = {}>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltMesh,
    rawServeConfig: {"browser":false,"playground":true},
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
export function getMeshSDK<TGlobalContext = any, TOperationContext = any>(globalContext?: TGlobalContext) {
  const sdkRequester$ = getBuiltMesh().then(({ sdkRequesterFactory }) => sdkRequesterFactory(globalContext));
  return getSdk<TOperationContext, TGlobalContext>((...args) => sdkRequester$.then(sdkRequester => sdkRequester(...args)));
}
export type publicMoodsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type publicMoodsQuery = { allMoods?: Maybe<{ nodes: Array<(
      Pick<Mood, 'id' | 'score' | 'note' | 'createdAt'>
      & { userByUserId?: Maybe<Pick<User, 'id' | 'name' | 'username' | 'avatarUrl'>> }
    )> }> };

export type userMoodsQueryVariables = Exact<{
  userId?: InputMaybe<Scalars['UUID']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type userMoodsQuery = { allMoods?: Maybe<{ nodes: Array<Pick<Mood, 'id' | 'score' | 'note' | 'createdAt' | 'isPublic'>> }> };

export type moodStreakQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type moodStreakQuery = { userById?: Maybe<(
    Pick<User, 'id'>
    & { moodsByUserId: Pick<MoodsConnection, 'totalCount'> }
  )> };

export type communityHugRequestsQueryVariables = Exact<{
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type communityHugRequestsQuery = { allHugRequests?: Maybe<{ nodes: Array<(
      Pick<HugRequest, 'id' | 'message' | 'createdAt'>
      & { userByRequesterId?: Maybe<Pick<User, 'id' | 'name' | 'username' | 'avatarUrl'>> }
    )> }> };

export type receivedHugsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type receivedHugsQuery = { allHugs?: Maybe<{ nodes: Array<(
      Pick<Hug, 'id' | 'message' | 'createdAt' | 'isRead'>
      & { userBySenderId?: Maybe<Pick<User, 'id' | 'name' | 'username' | 'avatarUrl'>> }
    )> }> };

export type sentHugsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
  first?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
}>;


export type sentHugsQuery = { allHugs?: Maybe<{ nodes: Array<(
      Pick<Hug, 'id' | 'message' | 'createdAt'>
      & { userByRecipientId?: Maybe<Pick<User, 'id' | 'name' | 'username' | 'avatarUrl'>> }
    )> }> };

export type createMoodMutationVariables = Exact<{
  input: CreateMoodInput;
}>;


export type createMoodMutation = { createMood?: Maybe<{ mood?: Maybe<Pick<Mood, 'id' | 'score' | 'note' | 'createdAt' | 'isPublic'>> }> };

export type sendHugMutationVariables = Exact<{
  input: CreateHugInput;
}>;


export type sendHugMutation = { createHug?: Maybe<{ hug?: Maybe<(
      Pick<Hug, 'id' | 'message' | 'createdAt'>
      & { userBySenderId?: Maybe<Pick<User, 'id' | 'name'>>, userByRecipientId?: Maybe<Pick<User, 'id' | 'name'>> }
    )> }> };

export type createHugRequestMutationVariables = Exact<{
  input: CreateHugRequestInput;
}>;


export type createHugRequestMutation = { createHugRequest?: Maybe<{ hugRequest?: Maybe<(
      Pick<HugRequest, 'id' | 'message' | 'createdAt'>
      & { userByRequesterId?: Maybe<Pick<User, 'id' | 'name'>> }
    )> }> };

export type updateHugRequestMutationVariables = Exact<{
  input: UpdateHugRequestInput;
}>;


export type updateHugRequestMutation = { updateHugRequest?: Maybe<{ hugRequest?: Maybe<Pick<HugRequest, 'id' | 'status' | 'createdAt'>> }> };

export type pendingHugRequestsQueryVariables = Exact<{
  userId: Scalars['UUID']['input'];
}>;


export type pendingHugRequestsQuery = { allHugRequests?: Maybe<{ nodes: Array<(
      Pick<HugRequest, 'id' | 'message' | 'createdAt'>
      & { userByRequesterId?: Maybe<Pick<User, 'id' | 'name' | 'username'>> }
    )> }> };


export const publicMoodsDocument = gql`
    query publicMoods($first: Int, $offset: Int) {
  allMoods(first: $first, offset: $offset, condition: {isPublic: true}) {
    nodes {
      id
      score
      note
      createdAt
      userByUserId {
        id
        name
        username
        avatarUrl
      }
    }
  }
}
    ` as unknown as DocumentNode<publicMoodsQuery, publicMoodsQueryVariables>;
export const userMoodsDocument = gql`
    query userMoods($userId: UUID, $first: Int, $offset: Int) {
  allMoods(first: $first, offset: $offset, condition: {userId: $userId}) {
    nodes {
      id
      score
      note
      createdAt
      isPublic
    }
  }
}
    ` as unknown as DocumentNode<userMoodsQuery, userMoodsQueryVariables>;
export const moodStreakDocument = gql`
    query moodStreak($userId: UUID!) {
  userById(id: $userId) {
    id
    moodsByUserId {
      totalCount
    }
  }
}
    ` as unknown as DocumentNode<moodStreakQuery, moodStreakQueryVariables>;
export const communityHugRequestsDocument = gql`
    query communityHugRequests($first: Int, $offset: Int) {
  allHugRequests(first: $first, offset: $offset) {
    nodes {
      id
      message
      createdAt
      userByRequesterId {
        id
        name
        username
        avatarUrl
      }
    }
  }
}
    ` as unknown as DocumentNode<communityHugRequestsQuery, communityHugRequestsQueryVariables>;
export const receivedHugsDocument = gql`
    query receivedHugs($userId: UUID!, $first: Int, $offset: Int) {
  allHugs(first: $first, offset: $offset, condition: {recipientId: $userId}) {
    nodes {
      id
      message
      createdAt
      isRead
      userBySenderId {
        id
        name
        username
        avatarUrl
      }
    }
  }
}
    ` as unknown as DocumentNode<receivedHugsQuery, receivedHugsQueryVariables>;
export const sentHugsDocument = gql`
    query sentHugs($userId: UUID!, $first: Int, $offset: Int) {
  allHugs(first: $first, offset: $offset, condition: {senderId: $userId}) {
    nodes {
      id
      message
      createdAt
      userByRecipientId {
        id
        name
        username
        avatarUrl
      }
    }
  }
}
    ` as unknown as DocumentNode<sentHugsQuery, sentHugsQueryVariables>;
export const createMoodDocument = gql`
    mutation createMood($input: CreateMoodInput!) {
  createMood(input: $input) {
    mood {
      id
      score
      note
      createdAt
      isPublic
    }
  }
}
    ` as unknown as DocumentNode<createMoodMutation, createMoodMutationVariables>;
export const sendHugDocument = gql`
    mutation sendHug($input: CreateHugInput!) {
  createHug(input: $input) {
    hug {
      id
      message
      createdAt
      userBySenderId {
        id
        name
      }
      userByRecipientId {
        id
        name
      }
    }
  }
}
    ` as unknown as DocumentNode<sendHugMutation, sendHugMutationVariables>;
export const createHugRequestDocument = gql`
    mutation createHugRequest($input: CreateHugRequestInput!) {
  createHugRequest(input: $input) {
    hugRequest {
      id
      message
      createdAt
      userByRequesterId {
        id
        name
      }
    }
  }
}
    ` as unknown as DocumentNode<createHugRequestMutation, createHugRequestMutationVariables>;
export const updateHugRequestDocument = gql`
    mutation updateHugRequest($input: UpdateHugRequestInput!) {
  updateHugRequest(input: $input) {
    hugRequest {
      id
      status
      createdAt
    }
  }
}
    ` as unknown as DocumentNode<updateHugRequestMutation, updateHugRequestMutationVariables>;
export const pendingHugRequestsDocument = gql`
    query pendingHugRequests($userId: UUID!) {
  allHugRequests(condition: {requesterId: $userId, status: "PENDING"}) {
    nodes {
      id
      message
      createdAt
      userByRequesterId {
        id
        name
        username
      }
    }
  }
}
    ` as unknown as DocumentNode<pendingHugRequestsQuery, pendingHugRequestsQueryVariables>;












export type Requester<C = {}, E = unknown> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> | AsyncIterable<R>
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    publicMoods(variables?: publicMoodsQueryVariables, options?: C): Promise<publicMoodsQuery> {
      return requester<publicMoodsQuery, publicMoodsQueryVariables>(publicMoodsDocument, variables, options) as Promise<publicMoodsQuery>;
    },
    userMoods(variables?: userMoodsQueryVariables, options?: C): Promise<userMoodsQuery> {
      return requester<userMoodsQuery, userMoodsQueryVariables>(userMoodsDocument, variables, options) as Promise<userMoodsQuery>;
    },
    moodStreak(variables: moodStreakQueryVariables, options?: C): Promise<moodStreakQuery> {
      return requester<moodStreakQuery, moodStreakQueryVariables>(moodStreakDocument, variables, options) as Promise<moodStreakQuery>;
    },
    communityHugRequests(variables?: communityHugRequestsQueryVariables, options?: C): Promise<communityHugRequestsQuery> {
      return requester<communityHugRequestsQuery, communityHugRequestsQueryVariables>(communityHugRequestsDocument, variables, options) as Promise<communityHugRequestsQuery>;
    },
    receivedHugs(variables: receivedHugsQueryVariables, options?: C): Promise<receivedHugsQuery> {
      return requester<receivedHugsQuery, receivedHugsQueryVariables>(receivedHugsDocument, variables, options) as Promise<receivedHugsQuery>;
    },
    sentHugs(variables: sentHugsQueryVariables, options?: C): Promise<sentHugsQuery> {
      return requester<sentHugsQuery, sentHugsQueryVariables>(sentHugsDocument, variables, options) as Promise<sentHugsQuery>;
    },
    createMood(variables: createMoodMutationVariables, options?: C): Promise<createMoodMutation> {
      return requester<createMoodMutation, createMoodMutationVariables>(createMoodDocument, variables, options) as Promise<createMoodMutation>;
    },
    sendHug(variables: sendHugMutationVariables, options?: C): Promise<sendHugMutation> {
      return requester<sendHugMutation, sendHugMutationVariables>(sendHugDocument, variables, options) as Promise<sendHugMutation>;
    },
    createHugRequest(variables: createHugRequestMutationVariables, options?: C): Promise<createHugRequestMutation> {
      return requester<createHugRequestMutation, createHugRequestMutationVariables>(createHugRequestDocument, variables, options) as Promise<createHugRequestMutation>;
    },
    updateHugRequest(variables: updateHugRequestMutationVariables, options?: C): Promise<updateHugRequestMutation> {
      return requester<updateHugRequestMutation, updateHugRequestMutationVariables>(updateHugRequestDocument, variables, options) as Promise<updateHugRequestMutation>;
    },
    pendingHugRequests(variables: pendingHugRequestsQueryVariables, options?: C): Promise<pendingHugRequestsQuery> {
      return requester<pendingHugRequestsQuery, pendingHugRequestsQueryVariables>(pendingHugRequestsDocument, variables, options) as Promise<pendingHugRequestsQuery>;
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;