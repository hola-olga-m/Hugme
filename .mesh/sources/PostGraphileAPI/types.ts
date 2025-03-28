// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace PostGraphileApiTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
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

  export type QuerySdk = {
      /** Exposes the root query type nested one level down. This is helpful for Relay 1
which can only query top level fields if they are in a particular form. **/
  query: InContextSdkMethod<Query['query'], {}, MeshContext>,
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. **/
  nodeId: InContextSdkMethod<Query['nodeId'], {}, MeshContext>,
  /** Fetches an object given its globally unique `ID`. **/
  node: InContextSdkMethod<Query | Friendship | User | Mood | Hug | HugRequest | Migration, QuerynodeArgs, MeshContext>,
  /** Reads and enables pagination through a set of `Friendship`. **/
  allFriendships: InContextSdkMethod<Query['allFriendships'], QueryallFriendshipsArgs, MeshContext>,
  /** Reads and enables pagination through a set of `HugRequest`. **/
  allHugRequests: InContextSdkMethod<Query['allHugRequests'], QueryallHugRequestsArgs, MeshContext>,
  /** Reads and enables pagination through a set of `Hug`. **/
  allHugs: InContextSdkMethod<Query['allHugs'], QueryallHugsArgs, MeshContext>,
  /** Reads and enables pagination through a set of `Migration`. **/
  allMigrations: InContextSdkMethod<Query['allMigrations'], QueryallMigrationsArgs, MeshContext>,
  /** Reads and enables pagination through a set of `Mood`. **/
  allMoods: InContextSdkMethod<Query['allMoods'], QueryallMoodsArgs, MeshContext>,
  /** Reads and enables pagination through a set of `User`. **/
  allUsers: InContextSdkMethod<Query['allUsers'], QueryallUsersArgs, MeshContext>,
  /** null **/
  friendshipById: InContextSdkMethod<Query['friendshipById'], QueryfriendshipByIdArgs, MeshContext>,
  /** null **/
  friendshipByRequesterIdAndRecipientId: InContextSdkMethod<Query['friendshipByRequesterIdAndRecipientId'], QueryfriendshipByRequesterIdAndRecipientIdArgs, MeshContext>,
  /** null **/
  hugRequestById: InContextSdkMethod<Query['hugRequestById'], QueryhugRequestByIdArgs, MeshContext>,
  /** null **/
  hugById: InContextSdkMethod<Query['hugById'], QueryhugByIdArgs, MeshContext>,
  /** null **/
  migrationById: InContextSdkMethod<Query['migrationById'], QuerymigrationByIdArgs, MeshContext>,
  /** null **/
  migrationByName: InContextSdkMethod<Query['migrationByName'], QuerymigrationByNameArgs, MeshContext>,
  /** null **/
  moodById: InContextSdkMethod<Query['moodById'], QuerymoodByIdArgs, MeshContext>,
  /** null **/
  userById: InContextSdkMethod<Query['userById'], QueryuserByIdArgs, MeshContext>,
  /** null **/
  userByUsername: InContextSdkMethod<Query['userByUsername'], QueryuserByUsernameArgs, MeshContext>,
  /** null **/
  userByEmail: InContextSdkMethod<Query['userByEmail'], QueryuserByEmailArgs, MeshContext>,
  /** Reads a single `Friendship` using its globally unique `ID`. **/
  friendship: InContextSdkMethod<Query['friendship'], QueryfriendshipArgs, MeshContext>,
  /** Reads a single `HugRequest` using its globally unique `ID`. **/
  hugRequest: InContextSdkMethod<Query['hugRequest'], QueryhugRequestArgs, MeshContext>,
  /** Reads a single `Hug` using its globally unique `ID`. **/
  hug: InContextSdkMethod<Query['hug'], QueryhugArgs, MeshContext>,
  /** Reads a single `Migration` using its globally unique `ID`. **/
  migration: InContextSdkMethod<Query['migration'], QuerymigrationArgs, MeshContext>,
  /** Reads a single `Mood` using its globally unique `ID`. **/
  mood: InContextSdkMethod<Query['mood'], QuerymoodArgs, MeshContext>,
  /** Reads a single `User` using its globally unique `ID`. **/
  user: InContextSdkMethod<Query['user'], QueryuserArgs, MeshContext>
  };

  export type MutationSdk = {
      /** Creates a single `Friendship`. **/
  createFriendship: InContextSdkMethod<Mutation['createFriendship'], MutationcreateFriendshipArgs, MeshContext>,
  /** Creates a single `HugRequest`. **/
  createHugRequest: InContextSdkMethod<Mutation['createHugRequest'], MutationcreateHugRequestArgs, MeshContext>,
  /** Creates a single `Hug`. **/
  createHug: InContextSdkMethod<Mutation['createHug'], MutationcreateHugArgs, MeshContext>,
  /** Creates a single `Migration`. **/
  createMigration: InContextSdkMethod<Mutation['createMigration'], MutationcreateMigrationArgs, MeshContext>,
  /** Creates a single `Mood`. **/
  createMood: InContextSdkMethod<Mutation['createMood'], MutationcreateMoodArgs, MeshContext>,
  /** Creates a single `User`. **/
  createUser: InContextSdkMethod<Mutation['createUser'], MutationcreateUserArgs, MeshContext>,
  /** Updates a single `Friendship` using its globally unique id and a patch. **/
  updateFriendship: InContextSdkMethod<Mutation['updateFriendship'], MutationupdateFriendshipArgs, MeshContext>,
  /** Updates a single `Friendship` using a unique key and a patch. **/
  updateFriendshipById: InContextSdkMethod<Mutation['updateFriendshipById'], MutationupdateFriendshipByIdArgs, MeshContext>,
  /** Updates a single `Friendship` using a unique key and a patch. **/
  updateFriendshipByRequesterIdAndRecipientId: InContextSdkMethod<Mutation['updateFriendshipByRequesterIdAndRecipientId'], MutationupdateFriendshipByRequesterIdAndRecipientIdArgs, MeshContext>,
  /** Updates a single `HugRequest` using its globally unique id and a patch. **/
  updateHugRequest: InContextSdkMethod<Mutation['updateHugRequest'], MutationupdateHugRequestArgs, MeshContext>,
  /** Updates a single `HugRequest` using a unique key and a patch. **/
  updateHugRequestById: InContextSdkMethod<Mutation['updateHugRequestById'], MutationupdateHugRequestByIdArgs, MeshContext>,
  /** Updates a single `Hug` using its globally unique id and a patch. **/
  updateHug: InContextSdkMethod<Mutation['updateHug'], MutationupdateHugArgs, MeshContext>,
  /** Updates a single `Hug` using a unique key and a patch. **/
  updateHugById: InContextSdkMethod<Mutation['updateHugById'], MutationupdateHugByIdArgs, MeshContext>,
  /** Updates a single `Migration` using its globally unique id and a patch. **/
  updateMigration: InContextSdkMethod<Mutation['updateMigration'], MutationupdateMigrationArgs, MeshContext>,
  /** Updates a single `Migration` using a unique key and a patch. **/
  updateMigrationById: InContextSdkMethod<Mutation['updateMigrationById'], MutationupdateMigrationByIdArgs, MeshContext>,
  /** Updates a single `Migration` using a unique key and a patch. **/
  updateMigrationByName: InContextSdkMethod<Mutation['updateMigrationByName'], MutationupdateMigrationByNameArgs, MeshContext>,
  /** Updates a single `Mood` using its globally unique id and a patch. **/
  updateMood: InContextSdkMethod<Mutation['updateMood'], MutationupdateMoodArgs, MeshContext>,
  /** Updates a single `Mood` using a unique key and a patch. **/
  updateMoodById: InContextSdkMethod<Mutation['updateMoodById'], MutationupdateMoodByIdArgs, MeshContext>,
  /** Updates a single `User` using its globally unique id and a patch. **/
  updateUser: InContextSdkMethod<Mutation['updateUser'], MutationupdateUserArgs, MeshContext>,
  /** Updates a single `User` using a unique key and a patch. **/
  updateUserById: InContextSdkMethod<Mutation['updateUserById'], MutationupdateUserByIdArgs, MeshContext>,
  /** Updates a single `User` using a unique key and a patch. **/
  updateUserByUsername: InContextSdkMethod<Mutation['updateUserByUsername'], MutationupdateUserByUsernameArgs, MeshContext>,
  /** Updates a single `User` using a unique key and a patch. **/
  updateUserByEmail: InContextSdkMethod<Mutation['updateUserByEmail'], MutationupdateUserByEmailArgs, MeshContext>,
  /** Deletes a single `Friendship` using its globally unique id. **/
  deleteFriendship: InContextSdkMethod<Mutation['deleteFriendship'], MutationdeleteFriendshipArgs, MeshContext>,
  /** Deletes a single `Friendship` using a unique key. **/
  deleteFriendshipById: InContextSdkMethod<Mutation['deleteFriendshipById'], MutationdeleteFriendshipByIdArgs, MeshContext>,
  /** Deletes a single `Friendship` using a unique key. **/
  deleteFriendshipByRequesterIdAndRecipientId: InContextSdkMethod<Mutation['deleteFriendshipByRequesterIdAndRecipientId'], MutationdeleteFriendshipByRequesterIdAndRecipientIdArgs, MeshContext>,
  /** Deletes a single `HugRequest` using its globally unique id. **/
  deleteHugRequest: InContextSdkMethod<Mutation['deleteHugRequest'], MutationdeleteHugRequestArgs, MeshContext>,
  /** Deletes a single `HugRequest` using a unique key. **/
  deleteHugRequestById: InContextSdkMethod<Mutation['deleteHugRequestById'], MutationdeleteHugRequestByIdArgs, MeshContext>,
  /** Deletes a single `Hug` using its globally unique id. **/
  deleteHug: InContextSdkMethod<Mutation['deleteHug'], MutationdeleteHugArgs, MeshContext>,
  /** Deletes a single `Hug` using a unique key. **/
  deleteHugById: InContextSdkMethod<Mutation['deleteHugById'], MutationdeleteHugByIdArgs, MeshContext>,
  /** Deletes a single `Migration` using its globally unique id. **/
  deleteMigration: InContextSdkMethod<Mutation['deleteMigration'], MutationdeleteMigrationArgs, MeshContext>,
  /** Deletes a single `Migration` using a unique key. **/
  deleteMigrationById: InContextSdkMethod<Mutation['deleteMigrationById'], MutationdeleteMigrationByIdArgs, MeshContext>,
  /** Deletes a single `Migration` using a unique key. **/
  deleteMigrationByName: InContextSdkMethod<Mutation['deleteMigrationByName'], MutationdeleteMigrationByNameArgs, MeshContext>,
  /** Deletes a single `Mood` using its globally unique id. **/
  deleteMood: InContextSdkMethod<Mutation['deleteMood'], MutationdeleteMoodArgs, MeshContext>,
  /** Deletes a single `Mood` using a unique key. **/
  deleteMoodById: InContextSdkMethod<Mutation['deleteMoodById'], MutationdeleteMoodByIdArgs, MeshContext>,
  /** Deletes a single `User` using its globally unique id. **/
  deleteUser: InContextSdkMethod<Mutation['deleteUser'], MutationdeleteUserArgs, MeshContext>,
  /** Deletes a single `User` using a unique key. **/
  deleteUserById: InContextSdkMethod<Mutation['deleteUserById'], MutationdeleteUserByIdArgs, MeshContext>,
  /** Deletes a single `User` using a unique key. **/
  deleteUserByUsername: InContextSdkMethod<Mutation['deleteUserByUsername'], MutationdeleteUserByUsernameArgs, MeshContext>,
  /** Deletes a single `User` using a unique key. **/
  deleteUserByEmail: InContextSdkMethod<Mutation['deleteUserByEmail'], MutationdeleteUserByEmailArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["PostGraphileAPI"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
