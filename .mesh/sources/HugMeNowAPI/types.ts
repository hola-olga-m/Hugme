// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace HugMeNowApiTypes {
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

export type User = {
  id?: Maybe<Scalars['ID']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  avatarUrl?: Maybe<Scalars['String']['output']>;
  isAnonymous?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
  created_at?: Maybe<Scalars['String']['output']>;
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

  export type QuerySdk = {
      /** null **/
  hello: InContextSdkMethod<Query['hello'], {}, MeshContext>,
  /** null **/
  dbTest: InContextSdkMethod<Query['dbTest'], {}, MeshContext>,
  /** null **/
  users: InContextSdkMethod<Query['users'], {}, MeshContext>,
  /** null **/
  currentUser: InContextSdkMethod<Query['currentUser'], {}, MeshContext>,
  /** null **/
  user: InContextSdkMethod<Query['user'], QueryuserArgs, MeshContext>,
  /** null **/
  userByUsername: InContextSdkMethod<Query['userByUsername'], QueryuserByUsernameArgs, MeshContext>,
  /** null **/
  moods: InContextSdkMethod<Query['moods'], QuerymoodsArgs, MeshContext>,
  /** null **/
  moodById: InContextSdkMethod<Query['moodById'], QuerymoodByIdArgs, MeshContext>,
  /** null **/
  moodStreak: InContextSdkMethod<Query['moodStreak'], QuerymoodStreakArgs, MeshContext>,
  /** null **/
  publicMoods: InContextSdkMethod<Query['publicMoods'], QuerypublicMoodsArgs, MeshContext>,
  /** null **/
  hugs: InContextSdkMethod<Query['hugs'], QueryhugsArgs, MeshContext>,
  /** null **/
  hugById: InContextSdkMethod<Query['hugById'], QueryhugByIdArgs, MeshContext>,
  /** null **/
  hugRequests: InContextSdkMethod<Query['hugRequests'], QueryhugRequestsArgs, MeshContext>
  };

  export type MutationSdk = {
      /** null **/
  login: InContextSdkMethod<Mutation['login'], MutationloginArgs, MeshContext>,
  /** null **/
  register: InContextSdkMethod<Mutation['register'], MutationregisterArgs, MeshContext>,
  /** null **/
  anonymousLogin: InContextSdkMethod<Mutation['anonymousLogin'], MutationanonymousLoginArgs, MeshContext>,
  /** null **/
  createMoodEntry: InContextSdkMethod<Mutation['createMoodEntry'], MutationcreateMoodEntryArgs, MeshContext>,
  /** null **/
  sendHug: InContextSdkMethod<Mutation['sendHug'], MutationsendHugArgs, MeshContext>,
  /** null **/
  markHugAsRead: InContextSdkMethod<Mutation['markHugAsRead'], MutationmarkHugAsReadArgs, MeshContext>,
  /** null **/
  createHugRequest: InContextSdkMethod<Mutation['createHugRequest'], MutationcreateHugRequestArgs, MeshContext>,
  /** null **/
  respondToHugRequest: InContextSdkMethod<Mutation['respondToHugRequest'], MutationrespondToHugRequestArgs, MeshContext>
  };

  export type SubscriptionSdk = {
    
  };

  export type Context = {
      ["HugMeNowAPI"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
