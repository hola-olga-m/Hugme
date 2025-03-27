import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string };
};

export type AnonymousLoginInput = {
  avatarUrl: InputMaybe<Scalars["String"]["input"]>;
  nickname: Scalars["String"]["input"];
};

export type AuthResponse = {
  __typename?: "AuthResponse";
  accessToken: Scalars["String"]["output"];
  user: User;
};

export type CreateFriendshipInput = {
  followMood: InputMaybe<Scalars["Boolean"]["input"]>;
  recipientId: Scalars["String"]["input"];
};

export type CreateHugRequestInput = {
  isCommunityRequest: Scalars["Boolean"]["input"];
  message: InputMaybe<Scalars["String"]["input"]>;
  recipientId: InputMaybe<Scalars["String"]["input"]>;
};

export type CreateMoodInput = {
  isPublic: Scalars["Boolean"]["input"];
  note: InputMaybe<Scalars["String"]["input"]>;
  score: Scalars["Int"]["input"];
};

export type ExternalRecipient = {
  __typename?: "ExternalRecipient";
  contact: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type ExternalRecipientInput = {
  contact: Scalars["String"]["input"];
  type: ExternalRecipientType;
};

/** The type of external recipient contact */
export enum ExternalRecipientType {
  Email = "EMAIL",
  Telegram = "TELEGRAM",
}

export type Friendship = {
  __typename?: "Friendship";
  createdAt: Scalars["DateTime"]["output"];
  followsMood: Maybe<Scalars["Boolean"]["output"]>;
  id: Scalars["ID"]["output"];
  recipient: User;
  recipientId: Scalars["String"]["output"];
  requester: User;
  requesterId: Scalars["String"]["output"];
  status: FriendshipStatus;
  updatedAt: Maybe<Scalars["DateTime"]["output"]>;
};

/** The status of a friendship between two users */
export enum FriendshipStatus {
  Accepted = "ACCEPTED",
  Blocked = "BLOCKED",
  Pending = "PENDING",
  Rejected = "REJECTED",
}

export type Hug = {
  __typename?: "Hug";
  createdAt: Scalars["DateTime"]["output"];
  externalRecipient: Maybe<ExternalRecipient>;
  id: Scalars["ID"]["output"];
  isRead: Scalars["Boolean"]["output"];
  message: Maybe<Scalars["String"]["output"]>;
  recipient: Maybe<User>;
  recipientId: Maybe<Scalars["String"]["output"]>;
  sender: User;
  senderId: Scalars["String"]["output"];
  type: HugType;
};

export type HugRequest = {
  __typename?: "HugRequest";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  isCommunityRequest: Scalars["Boolean"]["output"];
  message: Maybe<Scalars["String"]["output"]>;
  recipient: Maybe<User>;
  recipientId: Maybe<Scalars["String"]["output"]>;
  requester: User;
  requesterId: Scalars["String"]["output"];
  respondedAt: Maybe<Scalars["DateTime"]["output"]>;
  status: HugRequestStatus;
};

/** The status of a hug request */
export enum HugRequestStatus {
  Accepted = "ACCEPTED",
  Cancelled = "CANCELLED",
  Declined = "DECLINED",
  Expired = "EXPIRED",
  Pending = "PENDING",
}

/** The type of hug sent */
export enum HugType {
  Celebratory = "CELEBRATORY",
  Comforting = "COMFORTING",
  ComfortingHug = "ComfortingHug",
  Encouraging = "ENCOURAGING",
  EnthusiasticHug = "EnthusiasticHug",
  FamilyHug = "FamilyHug",
  FriendlyHug = "FriendlyHug",
  GentleHug = "GentleHug",
  GroupHug = "GroupHug",
  Quick = "QUICK",
  RelaxingHug = "RelaxingHug",
  Supportive = "SUPPORTIVE",
  SmilingHug = "SmilingHug",
  StandardHug = "StandardHug",
  SupportiveHug = "SupportiveHug",
  VirtualHug = "VirtualHug",
  Warm = "WARM",
  WelcomeHug = "WelcomeHug",
}

export type LoginInput = {
  email: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
};

export type Mood = {
  __typename?: "Mood";
  createdAt: Scalars["DateTime"]["output"];
  id: Scalars["ID"]["output"];
  isPublic: Scalars["Boolean"]["output"];
  note: Maybe<Scalars["String"]["output"]>;
  score: Scalars["Int"]["output"];
  user: User;
  userId: Scalars["String"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  anonymousLogin: AuthResponse;
  cancelHugRequest: HugRequest;
  createHugRequest: HugRequest;
  createMood: Mood;
  login: AuthResponse;
  markHugAsRead: Hug;
  register: AuthResponse;
  removeMood: Scalars["Boolean"]["output"];
  removeUser: Scalars["Boolean"]["output"];
  respondToFriendRequest: Friendship;
  respondToHugRequest: HugRequest;
  sendFriendRequest: Friendship;
  sendHug: Hug;
  updateMood: Mood;
  updateMoodFollowing: Friendship;
  updateUser: User;
};

export type MutationAnonymousLoginArgs = {
  anonymousLoginInput: AnonymousLoginInput;
};

export type MutationCancelHugRequestArgs = {
  requestId: Scalars["ID"]["input"];
};

export type MutationCreateHugRequestArgs = {
  createHugRequestInput: CreateHugRequestInput;
};

export type MutationCreateMoodArgs = {
  createMoodInput: CreateMoodInput;
};

export type MutationLoginArgs = {
  loginInput: LoginInput;
};

export type MutationMarkHugAsReadArgs = {
  hugId: Scalars["ID"]["input"];
};

export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};

export type MutationRemoveMoodArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationRespondToFriendRequestArgs = {
  updateFriendshipInput: UpdateFriendshipInput;
};

export type MutationRespondToHugRequestArgs = {
  respondToRequestInput: RespondToRequestInput;
};

export type MutationSendFriendRequestArgs = {
  createFriendshipInput: CreateFriendshipInput;
};

export type MutationSendHugArgs = {
  sendHugInput: SendHugInput;
};

export type MutationUpdateMoodArgs = {
  updateMoodInput: UpdateMoodInput;
};

export type MutationUpdateMoodFollowingArgs = {
  updateFriendshipInput: UpdateFriendshipInput;
};

export type MutationUpdateUserArgs = {
  updateUserInput: UpdateUserInput;
};

export type Query = {
  __typename?: "Query";
  checkFriendship: Scalars["Boolean"]["output"];
  communityHugRequests: Array<HugRequest>;
  friendsMoods: Array<Mood>;
  hug: Hug;
  hugRequest: HugRequest;
  me: User;
  mood: Mood;
  moodFollowing: Array<Friendship>;
  moodStreak: Scalars["Float"]["output"];
  myFriends: Array<Friendship>;
  myHugRequests: Array<HugRequest>;
  pendingFriendRequests: Array<Friendship>;
  pendingHugRequests: Array<HugRequest>;
  publicMoods: Array<Mood>;
  receivedHugs: Array<Hug>;
  sentFriendRequests: Array<Friendship>;
  sentHugs: Array<Hug>;
  user: User;
  userMoods: Array<Mood>;
  users: Array<User>;
};

export type QueryCheckFriendshipArgs = {
  userId: Scalars["String"]["input"];
};

export type QueryFriendsMoodsArgs = {
  limit?: InputMaybe<Scalars["Float"]["input"]>;
};

export type QueryHugArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryHugRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryMoodArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUserArgs = {
  id: Scalars["ID"]["input"];
};

export type RegisterInput = {
  avatarUrl: InputMaybe<Scalars["String"]["input"]>;
  email: Scalars["String"]["input"];
  name: Scalars["String"]["input"];
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type RespondToRequestInput = {
  message: InputMaybe<Scalars["String"]["input"]>;
  requestId: Scalars["String"]["input"];
  status: HugRequestStatus;
};

export type SendHugInput = {
  externalRecipient: InputMaybe<ExternalRecipientInput>;
  message: InputMaybe<Scalars["String"]["input"]>;
  recipientId: InputMaybe<Scalars["String"]["input"]>;
  type: HugType;
};

export type UpdateFriendshipInput = {
  followMood: InputMaybe<Scalars["Boolean"]["input"]>;
  friendshipId: Scalars["String"]["input"];
  status: InputMaybe<FriendshipStatus>;
};

export type UpdateMoodInput = {
  id: Scalars["ID"]["input"];
  isPublic: InputMaybe<Scalars["Boolean"]["input"]>;
  note: InputMaybe<Scalars["String"]["input"]>;
  score: InputMaybe<Scalars["Int"]["input"]>;
};

export type UpdateUserInput = {
  avatarUrl: InputMaybe<Scalars["String"]["input"]>;
  name: InputMaybe<Scalars["String"]["input"]>;
  password: InputMaybe<Scalars["String"]["input"]>;
};

export type User = {
  __typename?: "User";
  avatarUrl: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["DateTime"]["output"];
  email: Scalars["String"]["output"];
  id: Scalars["ID"]["output"];
  isAnonymous: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  updatedAt: Scalars["DateTime"]["output"];
  username: Scalars["String"]["output"];
};

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login: {
    __typename?: "AuthResponse";
    accessToken: string;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      email: string;
      name: string;
      avatarUrl: string | null;
      isAnonymous: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;

export type RegisterMutation = {
  __typename?: "Mutation";
  register: {
    __typename?: "AuthResponse";
    accessToken: string;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      email: string;
      name: string;
      avatarUrl: string | null;
      isAnonymous: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type AnonymousLoginMutationVariables = Exact<{
  anonymousLoginInput: AnonymousLoginInput;
}>;

export type AnonymousLoginMutation = {
  __typename?: "Mutation";
  anonymousLogin: {
    __typename?: "AuthResponse";
    accessToken: string;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      email: string;
      name: string;
      avatarUrl: string | null;
      isAnonymous: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type UpdateUserMutationVariables = Exact<{
  updateUserInput: UpdateUserInput;
}>;

export type UpdateUserMutation = {
  __typename?: "Mutation";
  updateUser: {
    __typename?: "User";
    id: string;
    username: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    updatedAt: string;
  };
};

export type RemoveUserMutationVariables = Exact<{ [key: string]: never }>;

export type RemoveUserMutation = {
  __typename?: "Mutation";
  removeUser: boolean;
};

export type CreateMoodMutationVariables = Exact<{
  createMoodInput: CreateMoodInput;
}>;

export type CreateMoodMutation = {
  __typename?: "Mutation";
  createMood: {
    __typename?: "Mood";
    id: string;
    score: number;
    note: string | null;
    isPublic: boolean;
    createdAt: string;
    userId: string;
  };
};

export type UpdateMoodMutationVariables = Exact<{
  updateMoodInput: UpdateMoodInput;
}>;

export type UpdateMoodMutation = {
  __typename?: "Mutation";
  updateMood: {
    __typename?: "Mood";
    id: string;
    score: number;
    note: string | null;
    isPublic: boolean;
    createdAt: string;
    userId: string;
  };
};

export type RemoveMoodMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type RemoveMoodMutation = {
  __typename?: "Mutation";
  removeMood: boolean;
};

export type SendHugMutationVariables = Exact<{
  sendHugInput: SendHugInput;
}>;

export type SendHugMutation = {
  __typename?: "Mutation";
  sendHug: {
    __typename?: "Hug";
    id: string;
    type: HugType;
    message: string | null;
    isRead: boolean;
    createdAt: string;
    senderId: string;
    recipientId: string | null;
  };
};

export type MarkHugAsReadMutationVariables = Exact<{
  hugId: Scalars["ID"]["input"];
}>;

export type MarkHugAsReadMutation = {
  __typename?: "Mutation";
  markHugAsRead: { __typename?: "Hug"; id: string; isRead: boolean };
};

export type CreateHugRequestMutationVariables = Exact<{
  createHugRequestInput: CreateHugRequestInput;
}>;

export type CreateHugRequestMutation = {
  __typename?: "Mutation";
  createHugRequest: {
    __typename?: "HugRequest";
    id: string;
    message: string | null;
    isCommunityRequest: boolean;
    status: HugRequestStatus;
    createdAt: string;
    requesterId: string;
    recipientId: string | null;
  };
};

export type RespondToHugRequestMutationVariables = Exact<{
  respondToRequestInput: RespondToRequestInput;
}>;

export type RespondToHugRequestMutation = {
  __typename?: "Mutation";
  respondToHugRequest: {
    __typename?: "HugRequest";
    id: string;
    status: HugRequestStatus;
    respondedAt: string | null;
  };
};

export type CancelHugRequestMutationVariables = Exact<{
  requestId: Scalars["ID"]["input"];
}>;

export type CancelHugRequestMutation = {
  __typename?: "Mutation";
  cancelHugRequest: {
    __typename?: "HugRequest";
    id: string;
    status: HugRequestStatus;
  };
};

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;

export type LoginMutation = {
  __typename?: "Mutation";
  login: {
    __typename?: "AuthResponse";
    accessToken: string;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      email: string;
      name: string;
      avatarUrl: string | null;
      isAnonymous: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;

export type RegisterMutation = {
  __typename?: "Mutation";
  register: {
    __typename?: "AuthResponse";
    accessToken: string;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      email: string;
      name: string;
      avatarUrl: string | null;
      isAnonymous: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type AnonymousLoginMutationVariables = Exact<{
  anonymousLoginInput: AnonymousLoginInput;
}>;

export type AnonymousLoginMutation = {
  __typename?: "Mutation";
  anonymousLogin: {
    __typename?: "AuthResponse";
    accessToken: string;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      email: string;
      name: string;
      avatarUrl: string | null;
      isAnonymous: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
};

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserProfileQuery = {
  __typename?: "Query";
  me: {
    __typename?: "User";
    id: string;
    username: string;
    email: string;
    name: string;
    avatarUrl: string | null;
    isAnonymous: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

export type GetUserStatsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserStatsQuery = {
  __typename?: "Query";
  userMoods: Array<{ __typename?: "Mood"; id: string; score: number }>;
};

export type GetUserMoodsCountQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserMoodsCountQuery = {
  __typename?: "Query";
  userMoods: Array<{ __typename?: "Mood"; id: string }>;
};

export type GetSentHugsCountQueryVariables = Exact<{ [key: string]: never }>;

export type GetSentHugsCountQuery = {
  __typename?: "Query";
  sentHugs: Array<{ __typename?: "Hug"; id: string }>;
};

export type GetReceivedHugsCountQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetReceivedHugsCountQuery = {
  __typename?: "Query";
  receivedHugs: Array<{ __typename?: "Hug"; id: string }>;
};

export type GetMoodStreakQueryVariables = Exact<{ [key: string]: never }>;

export type GetMoodStreakQuery = { __typename?: "Query"; moodStreak: number };

export type GetUserMoodsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserMoodsQuery = {
  __typename?: "Query";
  userMoods: Array<{
    __typename?: "Mood";
    id: string;
    score: number;
    note: string | null;
    createdAt: string;
  }>;
};

export type GetPublicMoodsQueryVariables = Exact<{ [key: string]: never }>;

export type GetPublicMoodsQuery = {
  __typename?: "Query";
  publicMoods: Array<{
    __typename?: "Mood";
    id: string;
    score: number;
    note: string | null;
    createdAt: string;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
      avatarUrl: string | null;
    };
  }>;
};

export type GetFriendsMoodsQueryVariables = Exact<{
  limit: InputMaybe<Scalars["Float"]["input"]>;
}>;

export type GetFriendsMoodsQuery = {
  __typename?: "Query";
  friendsMoods: Array<{
    __typename?: "Mood";
    id: string;
    score: number;
    note: string | null;
    createdAt: string;
    user: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
      avatarUrl: string | null;
    };
  }>;
};

export type CreateMoodEntryMutationVariables = Exact<{
  createMoodInput: CreateMoodInput;
}>;

export type CreateMoodEntryMutation = {
  __typename?: "Mutation";
  createMood: {
    __typename?: "Mood";
    id: string;
    score: number;
    note: string | null;
    createdAt: string;
  };
};

export type GetReceivedHugsQueryVariables = Exact<{ [key: string]: never }>;

export type GetReceivedHugsQuery = {
  __typename?: "Query";
  receivedHugs: Array<{
    __typename?: "Hug";
    id: string;
    type: HugType;
    message: string | null;
    isRead: boolean;
    createdAt: string;
    sender: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
      avatarUrl: string | null;
    };
  }>;
};

export type GetSentHugsQueryVariables = Exact<{ [key: string]: never }>;

export type GetSentHugsQuery = {
  __typename?: "Query";
  sentHugs: Array<{
    __typename?: "Hug";
    id: string;
    type: HugType;
    message: string | null;
    isRead: boolean;
    createdAt: string;
    recipient: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
      avatarUrl: string | null;
    } | null;
  }>;
};

export type SendHugMutationVariables = Exact<{
  sendHugInput: SendHugInput;
}>;

export type SendHugMutation = {
  __typename?: "Mutation";
  sendHug: {
    __typename?: "Hug";
    id: string;
    type: HugType;
    message: string | null;
    isRead: boolean;
    createdAt: string;
    sender: { __typename?: "User"; id: string; username: string; name: string };
    recipient: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
    } | null;
  };
};

export type MarkHugAsReadMutationVariables = Exact<{
  hugId: Scalars["ID"]["input"];
}>;

export type MarkHugAsReadMutation = {
  __typename?: "Mutation";
  markHugAsRead: { __typename?: "Hug"; id: string; isRead: boolean };
};

export type GetUsersQueryVariables = Exact<{ [key: string]: never }>;

export type GetUsersQuery = {
  __typename?: "Query";
  users: Array<{
    __typename?: "User";
    id: string;
    username: string;
    name: string;
    avatarUrl: string | null;
    isAnonymous: boolean;
    createdAt: string;
  }>;
};

export type GetMyHugRequestsQueryVariables = Exact<{ [key: string]: never }>;

export type GetMyHugRequestsQuery = {
  __typename?: "Query";
  myHugRequests: Array<{
    __typename?: "HugRequest";
    id: string;
    message: string | null;
    isCommunityRequest: boolean;
    status: HugRequestStatus;
    createdAt: string;
  }>;
};

export type GetPendingHugRequestsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPendingHugRequestsQuery = {
  __typename?: "Query";
  pendingHugRequests: Array<{
    __typename?: "HugRequest";
    id: string;
    message: string | null;
    isCommunityRequest: boolean;
    status: HugRequestStatus;
    createdAt: string;
    requester: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
      avatarUrl: string | null;
    };
  }>;
};

export type GetCommunityHugRequestsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetCommunityHugRequestsQuery = {
  __typename?: "Query";
  communityHugRequests: Array<{
    __typename?: "HugRequest";
    id: string;
    message: string | null;
    isCommunityRequest: boolean;
    status: HugRequestStatus;
    createdAt: string;
    requester: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
      avatarUrl: string | null;
    };
  }>;
};

export type CreateHugRequestMutationVariables = Exact<{
  createHugRequestInput: CreateHugRequestInput;
}>;

export type CreateHugRequestMutation = {
  __typename?: "Mutation";
  createHugRequest: {
    __typename?: "HugRequest";
    id: string;
    message: string | null;
    isCommunityRequest: boolean;
    status: HugRequestStatus;
    createdAt: string;
    requesterId: string;
    recipientId: string | null;
  };
};

export type RespondToHugRequestMutationVariables = Exact<{
  respondToRequestInput: RespondToRequestInput;
}>;

export type RespondToHugRequestMutation = {
  __typename?: "Mutation";
  respondToHugRequest: {
    __typename?: "HugRequest";
    id: string;
    status: HugRequestStatus;
    respondedAt: string | null;
  };
};

export type SendFriendRequestMutationVariables = Exact<{
  createFriendshipInput: CreateFriendshipInput;
}>;

export type SendFriendRequestMutation = {
  __typename?: "Mutation";
  sendFriendRequest: {
    __typename?: "Friendship";
    id: string;
    requesterId: string;
    recipientId: string;
    status: FriendshipStatus;
    followsMood: boolean | null;
    createdAt: string;
    requester: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
    };
    recipient: {
      __typename?: "User";
      id: string;
      username: string;
      name: string;
    };
  };
};

export type RespondToFriendRequestMutationVariables = Exact<{
  updateFriendshipInput: UpdateFriendshipInput;
}>;

export type RespondToFriendRequestMutation = {
  __typename?: "Mutation";
  respondToFriendRequest: {
    __typename?: "Friendship";
    id: string;
    status: FriendshipStatus;
    followsMood: boolean | null;
    updatedAt: string | null;
  };
};

export const LoginDocument = gql`
  mutation login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        username
        email
        name
        avatarUrl
        isAnonymous
        createdAt
        updatedAt
      }
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options,
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const RegisterDocument = gql`
  mutation register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
        id
        username
        email
        name
        avatarUrl
        isAnonymous
        createdAt
        updatedAt
      }
    }
  }
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options,
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const AnonymousLoginDocument = gql`
  mutation anonymousLogin($anonymousLoginInput: AnonymousLoginInput!) {
    anonymousLogin(anonymousLoginInput: $anonymousLoginInput) {
      accessToken
      user {
        id
        username
        email
        name
        avatarUrl
        isAnonymous
        createdAt
        updatedAt
      }
    }
  }
`;
export type AnonymousLoginMutationFn = Apollo.MutationFunction<
  AnonymousLoginMutation,
  AnonymousLoginMutationVariables
>;

/**
 * __useAnonymousLoginMutation__
 *
 * To run a mutation, you first call `useAnonymousLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnonymousLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [anonymousLoginMutation, { data, loading, error }] = useAnonymousLoginMutation({
 *   variables: {
 *      anonymousLoginInput: // value for 'anonymousLoginInput'
 *   },
 * });
 */
export function useAnonymousLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AnonymousLoginMutation,
    AnonymousLoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AnonymousLoginMutation,
    AnonymousLoginMutationVariables
  >(AnonymousLoginDocument, options);
}
export type AnonymousLoginMutationHookResult = ReturnType<
  typeof useAnonymousLoginMutation
>;
export type AnonymousLoginMutationResult =
  Apollo.MutationResult<AnonymousLoginMutation>;
export type AnonymousLoginMutationOptions = Apollo.BaseMutationOptions<
  AnonymousLoginMutation,
  AnonymousLoginMutationVariables
>;
export const UpdateUserDocument = gql`
  mutation updateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      id
      username
      email
      name
      avatarUrl
      updatedAt
    }
  }
`;
export type UpdateUserMutationFn = Apollo.MutationFunction<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      updateUserInput: // value for 'updateUserInput'
 *   },
 * });
 */
export function useUpdateUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateUserMutation,
    UpdateUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(
    UpdateUserDocument,
    options,
  );
}
export type UpdateUserMutationHookResult = ReturnType<
  typeof useUpdateUserMutation
>;
export type UpdateUserMutationResult =
  Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<
  UpdateUserMutation,
  UpdateUserMutationVariables
>;
export const RemoveUserDocument = gql`
  mutation removeUser {
    removeUser
  }
`;
export type RemoveUserMutationFn = Apollo.MutationFunction<
  RemoveUserMutation,
  RemoveUserMutationVariables
>;

/**
 * __useRemoveUserMutation__
 *
 * To run a mutation, you first call `useRemoveUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserMutation, { data, loading, error }] = useRemoveUserMutation({
 *   variables: {
 *   },
 * });
 */
export function useRemoveUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveUserMutation,
    RemoveUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RemoveUserMutation, RemoveUserMutationVariables>(
    RemoveUserDocument,
    options,
  );
}
export type RemoveUserMutationHookResult = ReturnType<
  typeof useRemoveUserMutation
>;
export type RemoveUserMutationResult =
  Apollo.MutationResult<RemoveUserMutation>;
export type RemoveUserMutationOptions = Apollo.BaseMutationOptions<
  RemoveUserMutation,
  RemoveUserMutationVariables
>;
export const CreateMoodDocument = gql`
  mutation createMood($createMoodInput: CreateMoodInput!) {
    createMood(createMoodInput: $createMoodInput) {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;
export type CreateMoodMutationFn = Apollo.MutationFunction<
  CreateMoodMutation,
  CreateMoodMutationVariables
>;

/**
 * __useCreateMoodMutation__
 *
 * To run a mutation, you first call `useCreateMoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMoodMutation, { data, loading, error }] = useCreateMoodMutation({
 *   variables: {
 *      createMoodInput: // value for 'createMoodInput'
 *   },
 * });
 */
export function useCreateMoodMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMoodMutation,
    CreateMoodMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateMoodMutation, CreateMoodMutationVariables>(
    CreateMoodDocument,
    options,
  );
}
export type CreateMoodMutationHookResult = ReturnType<
  typeof useCreateMoodMutation
>;
export type CreateMoodMutationResult =
  Apollo.MutationResult<CreateMoodMutation>;
export type CreateMoodMutationOptions = Apollo.BaseMutationOptions<
  CreateMoodMutation,
  CreateMoodMutationVariables
>;
export const UpdateMoodDocument = gql`
  mutation updateMood($updateMoodInput: UpdateMoodInput!) {
    updateMood(updateMoodInput: $updateMoodInput) {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;
export type UpdateMoodMutationFn = Apollo.MutationFunction<
  UpdateMoodMutation,
  UpdateMoodMutationVariables
>;

/**
 * __useUpdateMoodMutation__
 *
 * To run a mutation, you first call `useUpdateMoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMoodMutation, { data, loading, error }] = useUpdateMoodMutation({
 *   variables: {
 *      updateMoodInput: // value for 'updateMoodInput'
 *   },
 * });
 */
export function useUpdateMoodMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateMoodMutation,
    UpdateMoodMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateMoodMutation, UpdateMoodMutationVariables>(
    UpdateMoodDocument,
    options,
  );
}
export type UpdateMoodMutationHookResult = ReturnType<
  typeof useUpdateMoodMutation
>;
export type UpdateMoodMutationResult =
  Apollo.MutationResult<UpdateMoodMutation>;
export type UpdateMoodMutationOptions = Apollo.BaseMutationOptions<
  UpdateMoodMutation,
  UpdateMoodMutationVariables
>;
export const RemoveMoodDocument = gql`
  mutation removeMood($id: ID!) {
    removeMood(id: $id)
  }
`;
export type RemoveMoodMutationFn = Apollo.MutationFunction<
  RemoveMoodMutation,
  RemoveMoodMutationVariables
>;

/**
 * __useRemoveMoodMutation__
 *
 * To run a mutation, you first call `useRemoveMoodMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveMoodMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeMoodMutation, { data, loading, error }] = useRemoveMoodMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRemoveMoodMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveMoodMutation,
    RemoveMoodMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RemoveMoodMutation, RemoveMoodMutationVariables>(
    RemoveMoodDocument,
    options,
  );
}
export type RemoveMoodMutationHookResult = ReturnType<
  typeof useRemoveMoodMutation
>;
export type RemoveMoodMutationResult =
  Apollo.MutationResult<RemoveMoodMutation>;
export type RemoveMoodMutationOptions = Apollo.BaseMutationOptions<
  RemoveMoodMutation,
  RemoveMoodMutationVariables
>;
export const SendHugDocument = gql`
  mutation sendHug($sendHugInput: SendHugInput!) {
    sendHug(sendHugInput: $sendHugInput) {
      id
      type
      message
      isRead
      createdAt
      senderId
      recipientId
    }
  }
`;
export type SendHugMutationFn = Apollo.MutationFunction<
  SendHugMutation,
  SendHugMutationVariables
>;

/**
 * __useSendHugMutation__
 *
 * To run a mutation, you first call `useSendHugMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendHugMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendHugMutation, { data, loading, error }] = useSendHugMutation({
 *   variables: {
 *      sendHugInput: // value for 'sendHugInput'
 *   },
 * });
 */
export function useSendHugMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SendHugMutation,
    SendHugMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SendHugMutation, SendHugMutationVariables>(
    SendHugDocument,
    options,
  );
}
export type SendHugMutationHookResult = ReturnType<typeof useSendHugMutation>;
export type SendHugMutationResult = Apollo.MutationResult<SendHugMutation>;
export type SendHugMutationOptions = Apollo.BaseMutationOptions<
  SendHugMutation,
  SendHugMutationVariables
>;
export const MarkHugAsReadDocument = gql`
  mutation markHugAsRead($hugId: ID!) {
    markHugAsRead(hugId: $hugId) {
      id
      isRead
    }
  }
`;
export type MarkHugAsReadMutationFn = Apollo.MutationFunction<
  MarkHugAsReadMutation,
  MarkHugAsReadMutationVariables
>;

/**
 * __useMarkHugAsReadMutation__
 *
 * To run a mutation, you first call `useMarkHugAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkHugAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markHugAsReadMutation, { data, loading, error }] = useMarkHugAsReadMutation({
 *   variables: {
 *      hugId: // value for 'hugId'
 *   },
 * });
 */
export function useMarkHugAsReadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MarkHugAsReadMutation,
    MarkHugAsReadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MarkHugAsReadMutation,
    MarkHugAsReadMutationVariables
  >(MarkHugAsReadDocument, options);
}
export type MarkHugAsReadMutationHookResult = ReturnType<
  typeof useMarkHugAsReadMutation
>;
export type MarkHugAsReadMutationResult =
  Apollo.MutationResult<MarkHugAsReadMutation>;
export type MarkHugAsReadMutationOptions = Apollo.BaseMutationOptions<
  MarkHugAsReadMutation,
  MarkHugAsReadMutationVariables
>;
export const CreateHugRequestDocument = gql`
  mutation createHugRequest($createHugRequestInput: CreateHugRequestInput!) {
    createHugRequest(createHugRequestInput: $createHugRequestInput) {
      id
      message
      isCommunityRequest
      status
      createdAt
      requesterId
      recipientId
    }
  }
`;
export type CreateHugRequestMutationFn = Apollo.MutationFunction<
  CreateHugRequestMutation,
  CreateHugRequestMutationVariables
>;

/**
 * __useCreateHugRequestMutation__
 *
 * To run a mutation, you first call `useCreateHugRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHugRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHugRequestMutation, { data, loading, error }] = useCreateHugRequestMutation({
 *   variables: {
 *      createHugRequestInput: // value for 'createHugRequestInput'
 *   },
 * });
 */
export function useCreateHugRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateHugRequestMutation,
    CreateHugRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateHugRequestMutation,
    CreateHugRequestMutationVariables
  >(CreateHugRequestDocument, options);
}
export type CreateHugRequestMutationHookResult = ReturnType<
  typeof useCreateHugRequestMutation
>;
export type CreateHugRequestMutationResult =
  Apollo.MutationResult<CreateHugRequestMutation>;
export type CreateHugRequestMutationOptions = Apollo.BaseMutationOptions<
  CreateHugRequestMutation,
  CreateHugRequestMutationVariables
>;
export const RespondToHugRequestDocument = gql`
  mutation respondToHugRequest($respondToRequestInput: RespondToRequestInput!) {
    respondToHugRequest(respondToRequestInput: $respondToRequestInput) {
      id
      status
      respondedAt
    }
  }
`;
export type RespondToHugRequestMutationFn = Apollo.MutationFunction<
  RespondToHugRequestMutation,
  RespondToHugRequestMutationVariables
>;

/**
 * __useRespondToHugRequestMutation__
 *
 * To run a mutation, you first call `useRespondToHugRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRespondToHugRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [respondToHugRequestMutation, { data, loading, error }] = useRespondToHugRequestMutation({
 *   variables: {
 *      respondToRequestInput: // value for 'respondToRequestInput'
 *   },
 * });
 */
export function useRespondToHugRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RespondToHugRequestMutation,
    RespondToHugRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RespondToHugRequestMutation,
    RespondToHugRequestMutationVariables
  >(RespondToHugRequestDocument, options);
}
export type RespondToHugRequestMutationHookResult = ReturnType<
  typeof useRespondToHugRequestMutation
>;
export type RespondToHugRequestMutationResult =
  Apollo.MutationResult<RespondToHugRequestMutation>;
export type RespondToHugRequestMutationOptions = Apollo.BaseMutationOptions<
  RespondToHugRequestMutation,
  RespondToHugRequestMutationVariables
>;
export const CancelHugRequestDocument = gql`
  mutation cancelHugRequest($requestId: ID!) {
    cancelHugRequest(requestId: $requestId) {
      id
      status
    }
  }
`;
export type CancelHugRequestMutationFn = Apollo.MutationFunction<
  CancelHugRequestMutation,
  CancelHugRequestMutationVariables
>;

/**
 * __useCancelHugRequestMutation__
 *
 * To run a mutation, you first call `useCancelHugRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelHugRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelHugRequestMutation, { data, loading, error }] = useCancelHugRequestMutation({
 *   variables: {
 *      requestId: // value for 'requestId'
 *   },
 * });
 */
export function useCancelHugRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CancelHugRequestMutation,
    CancelHugRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CancelHugRequestMutation,
    CancelHugRequestMutationVariables
  >(CancelHugRequestDocument, options);
}
export type CancelHugRequestMutationHookResult = ReturnType<
  typeof useCancelHugRequestMutation
>;
export type CancelHugRequestMutationResult =
  Apollo.MutationResult<CancelHugRequestMutation>;
export type CancelHugRequestMutationOptions = Apollo.BaseMutationOptions<
  CancelHugRequestMutation,
  CancelHugRequestMutationVariables
>;
export const LoginDocument = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      accessToken
      user {
        id
        username
        email
        name
        avatarUrl
        isAnonymous
        createdAt
        updatedAt
      }
    }
  }
`;
export type LoginMutationFn = Apollo.MutationFunction<
  LoginMutation,
  LoginMutationVariables
>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      loginInput: // value for 'loginInput'
 *   },
 * });
 */
export function useLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    LoginMutation,
    LoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<LoginMutation, LoginMutationVariables>(
    LoginDocument,
    options,
  );
}
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<
  LoginMutation,
  LoginMutationVariables
>;
export const RegisterDocument = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      accessToken
      user {
        id
        username
        email
        name
        avatarUrl
        isAnonymous
        createdAt
        updatedAt
      }
    }
  }
`;
export type RegisterMutationFn = Apollo.MutationFunction<
  RegisterMutation,
  RegisterMutationVariables
>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      registerInput: // value for 'registerInput'
 *   },
 * });
 */
export function useRegisterMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RegisterMutation,
    RegisterMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(
    RegisterDocument,
    options,
  );
}
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<
  RegisterMutation,
  RegisterMutationVariables
>;
export const AnonymousLoginDocument = gql`
  mutation AnonymousLogin($anonymousLoginInput: AnonymousLoginInput!) {
    anonymousLogin(anonymousLoginInput: $anonymousLoginInput) {
      accessToken
      user {
        id
        username
        email
        name
        avatarUrl
        isAnonymous
        createdAt
        updatedAt
      }
    }
  }
`;
export type AnonymousLoginMutationFn = Apollo.MutationFunction<
  AnonymousLoginMutation,
  AnonymousLoginMutationVariables
>;

/**
 * __useAnonymousLoginMutation__
 *
 * To run a mutation, you first call `useAnonymousLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAnonymousLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [anonymousLoginMutation, { data, loading, error }] = useAnonymousLoginMutation({
 *   variables: {
 *      anonymousLoginInput: // value for 'anonymousLoginInput'
 *   },
 * });
 */
export function useAnonymousLoginMutation(
  baseOptions?: Apollo.MutationHookOptions<
    AnonymousLoginMutation,
    AnonymousLoginMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    AnonymousLoginMutation,
    AnonymousLoginMutationVariables
  >(AnonymousLoginDocument, options);
}
export type AnonymousLoginMutationHookResult = ReturnType<
  typeof useAnonymousLoginMutation
>;
export type AnonymousLoginMutationResult =
  Apollo.MutationResult<AnonymousLoginMutation>;
export type AnonymousLoginMutationOptions = Apollo.BaseMutationOptions<
  AnonymousLoginMutation,
  AnonymousLoginMutationVariables
>;
export const GetUserProfileDocument = gql`
  query GetUserProfile {
    me {
      id
      username
      email
      name
      avatarUrl
      isAnonymous
      createdAt
      updatedAt
    }
  }
`;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserProfileQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(
    GetUserProfileDocument,
    options,
  );
}
export function useGetUserProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(
    GetUserProfileDocument,
    options,
  );
}
export function useGetUserProfileSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserProfileQuery,
        GetUserProfileQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >(GetUserProfileDocument, options);
}
export type GetUserProfileQueryHookResult = ReturnType<
  typeof useGetUserProfileQuery
>;
export type GetUserProfileLazyQueryHookResult = ReturnType<
  typeof useGetUserProfileLazyQuery
>;
export type GetUserProfileSuspenseQueryHookResult = ReturnType<
  typeof useGetUserProfileSuspenseQuery
>;
export type GetUserProfileQueryResult = Apollo.QueryResult<
  GetUserProfileQuery,
  GetUserProfileQueryVariables
>;
export const GetUserStatsDocument = gql`
  query GetUserStats {
    userMoods {
      id
      score
    }
  }
`;

/**
 * __useGetUserStatsQuery__
 *
 * To run a query within a React component, call `useGetUserStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserStatsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserStatsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetUserStatsQuery,
    GetUserStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(
    GetUserStatsDocument,
    options,
  );
}
export function useGetUserStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserStatsQuery,
    GetUserStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(
    GetUserStatsDocument,
    options,
  );
}
export function useGetUserStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserStatsQuery,
        GetUserStatsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUserStatsQuery, GetUserStatsQueryVariables>(
    GetUserStatsDocument,
    options,
  );
}
export type GetUserStatsQueryHookResult = ReturnType<
  typeof useGetUserStatsQuery
>;
export type GetUserStatsLazyQueryHookResult = ReturnType<
  typeof useGetUserStatsLazyQuery
>;
export type GetUserStatsSuspenseQueryHookResult = ReturnType<
  typeof useGetUserStatsSuspenseQuery
>;
export type GetUserStatsQueryResult = Apollo.QueryResult<
  GetUserStatsQuery,
  GetUserStatsQueryVariables
>;
export const GetUserMoodsCountDocument = gql`
  query GetUserMoodsCount {
    userMoods {
      id
    }
  }
`;

/**
 * __useGetUserMoodsCountQuery__
 *
 * To run a query within a React component, call `useGetUserMoodsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserMoodsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserMoodsCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserMoodsCountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetUserMoodsCountQuery,
    GetUserMoodsCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetUserMoodsCountQuery,
    GetUserMoodsCountQueryVariables
  >(GetUserMoodsCountDocument, options);
}
export function useGetUserMoodsCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserMoodsCountQuery,
    GetUserMoodsCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetUserMoodsCountQuery,
    GetUserMoodsCountQueryVariables
  >(GetUserMoodsCountDocument, options);
}
export function useGetUserMoodsCountSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserMoodsCountQuery,
        GetUserMoodsCountQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetUserMoodsCountQuery,
    GetUserMoodsCountQueryVariables
  >(GetUserMoodsCountDocument, options);
}
export type GetUserMoodsCountQueryHookResult = ReturnType<
  typeof useGetUserMoodsCountQuery
>;
export type GetUserMoodsCountLazyQueryHookResult = ReturnType<
  typeof useGetUserMoodsCountLazyQuery
>;
export type GetUserMoodsCountSuspenseQueryHookResult = ReturnType<
  typeof useGetUserMoodsCountSuspenseQuery
>;
export type GetUserMoodsCountQueryResult = Apollo.QueryResult<
  GetUserMoodsCountQuery,
  GetUserMoodsCountQueryVariables
>;
export const GetSentHugsCountDocument = gql`
  query GetSentHugsCount {
    sentHugs {
      id
    }
  }
`;

/**
 * __useGetSentHugsCountQuery__
 *
 * To run a query within a React component, call `useGetSentHugsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSentHugsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSentHugsCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSentHugsCountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetSentHugsCountQuery,
    GetSentHugsCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSentHugsCountQuery, GetSentHugsCountQueryVariables>(
    GetSentHugsCountDocument,
    options,
  );
}
export function useGetSentHugsCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSentHugsCountQuery,
    GetSentHugsCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetSentHugsCountQuery,
    GetSentHugsCountQueryVariables
  >(GetSentHugsCountDocument, options);
}
export function useGetSentHugsCountSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetSentHugsCountQuery,
        GetSentHugsCountQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetSentHugsCountQuery,
    GetSentHugsCountQueryVariables
  >(GetSentHugsCountDocument, options);
}
export type GetSentHugsCountQueryHookResult = ReturnType<
  typeof useGetSentHugsCountQuery
>;
export type GetSentHugsCountLazyQueryHookResult = ReturnType<
  typeof useGetSentHugsCountLazyQuery
>;
export type GetSentHugsCountSuspenseQueryHookResult = ReturnType<
  typeof useGetSentHugsCountSuspenseQuery
>;
export type GetSentHugsCountQueryResult = Apollo.QueryResult<
  GetSentHugsCountQuery,
  GetSentHugsCountQueryVariables
>;
export const GetReceivedHugsCountDocument = gql`
  query GetReceivedHugsCount {
    receivedHugs {
      id
    }
  }
`;

/**
 * __useGetReceivedHugsCountQuery__
 *
 * To run a query within a React component, call `useGetReceivedHugsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReceivedHugsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReceivedHugsCountQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetReceivedHugsCountQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetReceivedHugsCountQuery,
    GetReceivedHugsCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetReceivedHugsCountQuery,
    GetReceivedHugsCountQueryVariables
  >(GetReceivedHugsCountDocument, options);
}
export function useGetReceivedHugsCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetReceivedHugsCountQuery,
    GetReceivedHugsCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetReceivedHugsCountQuery,
    GetReceivedHugsCountQueryVariables
  >(GetReceivedHugsCountDocument, options);
}
export function useGetReceivedHugsCountSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetReceivedHugsCountQuery,
        GetReceivedHugsCountQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetReceivedHugsCountQuery,
    GetReceivedHugsCountQueryVariables
  >(GetReceivedHugsCountDocument, options);
}
export type GetReceivedHugsCountQueryHookResult = ReturnType<
  typeof useGetReceivedHugsCountQuery
>;
export type GetReceivedHugsCountLazyQueryHookResult = ReturnType<
  typeof useGetReceivedHugsCountLazyQuery
>;
export type GetReceivedHugsCountSuspenseQueryHookResult = ReturnType<
  typeof useGetReceivedHugsCountSuspenseQuery
>;
export type GetReceivedHugsCountQueryResult = Apollo.QueryResult<
  GetReceivedHugsCountQuery,
  GetReceivedHugsCountQueryVariables
>;
export const GetMoodStreakDocument = gql`
  query GetMoodStreak {
    moodStreak
  }
`;

/**
 * __useGetMoodStreakQuery__
 *
 * To run a query within a React component, call `useGetMoodStreakQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMoodStreakQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMoodStreakQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMoodStreakQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetMoodStreakQuery,
    GetMoodStreakQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMoodStreakQuery, GetMoodStreakQueryVariables>(
    GetMoodStreakDocument,
    options,
  );
}
export function useGetMoodStreakLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMoodStreakQuery,
    GetMoodStreakQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetMoodStreakQuery, GetMoodStreakQueryVariables>(
    GetMoodStreakDocument,
    options,
  );
}
export function useGetMoodStreakSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetMoodStreakQuery,
        GetMoodStreakQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetMoodStreakQuery,
    GetMoodStreakQueryVariables
  >(GetMoodStreakDocument, options);
}
export type GetMoodStreakQueryHookResult = ReturnType<
  typeof useGetMoodStreakQuery
>;
export type GetMoodStreakLazyQueryHookResult = ReturnType<
  typeof useGetMoodStreakLazyQuery
>;
export type GetMoodStreakSuspenseQueryHookResult = ReturnType<
  typeof useGetMoodStreakSuspenseQuery
>;
export type GetMoodStreakQueryResult = Apollo.QueryResult<
  GetMoodStreakQuery,
  GetMoodStreakQueryVariables
>;
export const GetUserMoodsDocument = gql`
  query GetUserMoods {
    userMoods {
      id
      score
      note
      createdAt
    }
  }
`;

/**
 * __useGetUserMoodsQuery__
 *
 * To run a query within a React component, call `useGetUserMoodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserMoodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserMoodsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserMoodsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetUserMoodsQuery,
    GetUserMoodsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUserMoodsQuery, GetUserMoodsQueryVariables>(
    GetUserMoodsDocument,
    options,
  );
}
export function useGetUserMoodsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUserMoodsQuery,
    GetUserMoodsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUserMoodsQuery, GetUserMoodsQueryVariables>(
    GetUserMoodsDocument,
    options,
  );
}
export function useGetUserMoodsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUserMoodsQuery,
        GetUserMoodsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUserMoodsQuery, GetUserMoodsQueryVariables>(
    GetUserMoodsDocument,
    options,
  );
}
export type GetUserMoodsQueryHookResult = ReturnType<
  typeof useGetUserMoodsQuery
>;
export type GetUserMoodsLazyQueryHookResult = ReturnType<
  typeof useGetUserMoodsLazyQuery
>;
export type GetUserMoodsSuspenseQueryHookResult = ReturnType<
  typeof useGetUserMoodsSuspenseQuery
>;
export type GetUserMoodsQueryResult = Apollo.QueryResult<
  GetUserMoodsQuery,
  GetUserMoodsQueryVariables
>;
export const GetPublicMoodsDocument = gql`
  query GetPublicMoods {
    publicMoods {
      id
      score
      note
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

/**
 * __useGetPublicMoodsQuery__
 *
 * To run a query within a React component, call `useGetPublicMoodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublicMoodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublicMoodsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPublicMoodsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPublicMoodsQuery,
    GetPublicMoodsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetPublicMoodsQuery, GetPublicMoodsQueryVariables>(
    GetPublicMoodsDocument,
    options,
  );
}
export function useGetPublicMoodsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPublicMoodsQuery,
    GetPublicMoodsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetPublicMoodsQuery, GetPublicMoodsQueryVariables>(
    GetPublicMoodsDocument,
    options,
  );
}
export function useGetPublicMoodsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetPublicMoodsQuery,
        GetPublicMoodsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetPublicMoodsQuery,
    GetPublicMoodsQueryVariables
  >(GetPublicMoodsDocument, options);
}
export type GetPublicMoodsQueryHookResult = ReturnType<
  typeof useGetPublicMoodsQuery
>;
export type GetPublicMoodsLazyQueryHookResult = ReturnType<
  typeof useGetPublicMoodsLazyQuery
>;
export type GetPublicMoodsSuspenseQueryHookResult = ReturnType<
  typeof useGetPublicMoodsSuspenseQuery
>;
export type GetPublicMoodsQueryResult = Apollo.QueryResult<
  GetPublicMoodsQuery,
  GetPublicMoodsQueryVariables
>;
export const GetFriendsMoodsDocument = gql`
  query GetFriendsMoods($limit: Float) {
    friendsMoods(limit: $limit) {
      id
      score
      note
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

/**
 * __useGetFriendsMoodsQuery__
 *
 * To run a query within a React component, call `useGetFriendsMoodsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFriendsMoodsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFriendsMoodsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useGetFriendsMoodsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetFriendsMoodsQuery,
    GetFriendsMoodsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetFriendsMoodsQuery, GetFriendsMoodsQueryVariables>(
    GetFriendsMoodsDocument,
    options,
  );
}
export function useGetFriendsMoodsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetFriendsMoodsQuery,
    GetFriendsMoodsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetFriendsMoodsQuery,
    GetFriendsMoodsQueryVariables
  >(GetFriendsMoodsDocument, options);
}
export function useGetFriendsMoodsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetFriendsMoodsQuery,
        GetFriendsMoodsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetFriendsMoodsQuery,
    GetFriendsMoodsQueryVariables
  >(GetFriendsMoodsDocument, options);
}
export type GetFriendsMoodsQueryHookResult = ReturnType<
  typeof useGetFriendsMoodsQuery
>;
export type GetFriendsMoodsLazyQueryHookResult = ReturnType<
  typeof useGetFriendsMoodsLazyQuery
>;
export type GetFriendsMoodsSuspenseQueryHookResult = ReturnType<
  typeof useGetFriendsMoodsSuspenseQuery
>;
export type GetFriendsMoodsQueryResult = Apollo.QueryResult<
  GetFriendsMoodsQuery,
  GetFriendsMoodsQueryVariables
>;
export const CreateMoodEntryDocument = gql`
  mutation CreateMoodEntry($createMoodInput: CreateMoodInput!) {
    createMood(createMoodInput: $createMoodInput) {
      id
      score
      note
      createdAt
    }
  }
`;
export type CreateMoodEntryMutationFn = Apollo.MutationFunction<
  CreateMoodEntryMutation,
  CreateMoodEntryMutationVariables
>;

/**
 * __useCreateMoodEntryMutation__
 *
 * To run a mutation, you first call `useCreateMoodEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMoodEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMoodEntryMutation, { data, loading, error }] = useCreateMoodEntryMutation({
 *   variables: {
 *      createMoodInput: // value for 'createMoodInput'
 *   },
 * });
 */
export function useCreateMoodEntryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateMoodEntryMutation,
    CreateMoodEntryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateMoodEntryMutation,
    CreateMoodEntryMutationVariables
  >(CreateMoodEntryDocument, options);
}
export type CreateMoodEntryMutationHookResult = ReturnType<
  typeof useCreateMoodEntryMutation
>;
export type CreateMoodEntryMutationResult =
  Apollo.MutationResult<CreateMoodEntryMutation>;
export type CreateMoodEntryMutationOptions = Apollo.BaseMutationOptions<
  CreateMoodEntryMutation,
  CreateMoodEntryMutationVariables
>;
export const GetReceivedHugsDocument = gql`
  query GetReceivedHugs {
    receivedHugs {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

/**
 * __useGetReceivedHugsQuery__
 *
 * To run a query within a React component, call `useGetReceivedHugsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReceivedHugsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReceivedHugsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetReceivedHugsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetReceivedHugsQuery,
    GetReceivedHugsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetReceivedHugsQuery, GetReceivedHugsQueryVariables>(
    GetReceivedHugsDocument,
    options,
  );
}
export function useGetReceivedHugsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetReceivedHugsQuery,
    GetReceivedHugsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetReceivedHugsQuery,
    GetReceivedHugsQueryVariables
  >(GetReceivedHugsDocument, options);
}
export function useGetReceivedHugsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetReceivedHugsQuery,
        GetReceivedHugsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetReceivedHugsQuery,
    GetReceivedHugsQueryVariables
  >(GetReceivedHugsDocument, options);
}
export type GetReceivedHugsQueryHookResult = ReturnType<
  typeof useGetReceivedHugsQuery
>;
export type GetReceivedHugsLazyQueryHookResult = ReturnType<
  typeof useGetReceivedHugsLazyQuery
>;
export type GetReceivedHugsSuspenseQueryHookResult = ReturnType<
  typeof useGetReceivedHugsSuspenseQuery
>;
export type GetReceivedHugsQueryResult = Apollo.QueryResult<
  GetReceivedHugsQuery,
  GetReceivedHugsQueryVariables
>;
export const GetSentHugsDocument = gql`
  query GetSentHugs {
    sentHugs {
      id
      type
      message
      isRead
      createdAt
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

/**
 * __useGetSentHugsQuery__
 *
 * To run a query within a React component, call `useGetSentHugsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSentHugsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSentHugsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetSentHugsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetSentHugsQuery,
    GetSentHugsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetSentHugsQuery, GetSentHugsQueryVariables>(
    GetSentHugsDocument,
    options,
  );
}
export function useGetSentHugsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSentHugsQuery,
    GetSentHugsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetSentHugsQuery, GetSentHugsQueryVariables>(
    GetSentHugsDocument,
    options,
  );
}
export function useGetSentHugsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetSentHugsQuery,
        GetSentHugsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetSentHugsQuery, GetSentHugsQueryVariables>(
    GetSentHugsDocument,
    options,
  );
}
export type GetSentHugsQueryHookResult = ReturnType<typeof useGetSentHugsQuery>;
export type GetSentHugsLazyQueryHookResult = ReturnType<
  typeof useGetSentHugsLazyQuery
>;
export type GetSentHugsSuspenseQueryHookResult = ReturnType<
  typeof useGetSentHugsSuspenseQuery
>;
export type GetSentHugsQueryResult = Apollo.QueryResult<
  GetSentHugsQuery,
  GetSentHugsQueryVariables
>;
export const SendHugDocument = gql`
  mutation SendHug($sendHugInput: SendHugInput!) {
    sendHug(sendHugInput: $sendHugInput) {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        username
        name
      }
      recipient {
        id
        username
        name
      }
    }
  }
`;
export type SendHugMutationFn = Apollo.MutationFunction<
  SendHugMutation,
  SendHugMutationVariables
>;

/**
 * __useSendHugMutation__
 *
 * To run a mutation, you first call `useSendHugMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendHugMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendHugMutation, { data, loading, error }] = useSendHugMutation({
 *   variables: {
 *      sendHugInput: // value for 'sendHugInput'
 *   },
 * });
 */
export function useSendHugMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SendHugMutation,
    SendHugMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<SendHugMutation, SendHugMutationVariables>(
    SendHugDocument,
    options,
  );
}
export type SendHugMutationHookResult = ReturnType<typeof useSendHugMutation>;
export type SendHugMutationResult = Apollo.MutationResult<SendHugMutation>;
export type SendHugMutationOptions = Apollo.BaseMutationOptions<
  SendHugMutation,
  SendHugMutationVariables
>;
export const MarkHugAsReadDocument = gql`
  mutation MarkHugAsRead($hugId: ID!) {
    markHugAsRead(hugId: $hugId) {
      id
      isRead
    }
  }
`;
export type MarkHugAsReadMutationFn = Apollo.MutationFunction<
  MarkHugAsReadMutation,
  MarkHugAsReadMutationVariables
>;

/**
 * __useMarkHugAsReadMutation__
 *
 * To run a mutation, you first call `useMarkHugAsReadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMarkHugAsReadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [markHugAsReadMutation, { data, loading, error }] = useMarkHugAsReadMutation({
 *   variables: {
 *      hugId: // value for 'hugId'
 *   },
 * });
 */
export function useMarkHugAsReadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    MarkHugAsReadMutation,
    MarkHugAsReadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    MarkHugAsReadMutation,
    MarkHugAsReadMutationVariables
  >(MarkHugAsReadDocument, options);
}
export type MarkHugAsReadMutationHookResult = ReturnType<
  typeof useMarkHugAsReadMutation
>;
export type MarkHugAsReadMutationResult =
  Apollo.MutationResult<MarkHugAsReadMutation>;
export type MarkHugAsReadMutationOptions = Apollo.BaseMutationOptions<
  MarkHugAsReadMutation,
  MarkHugAsReadMutationVariables
>;
export const GetUsersDocument = gql`
  query GetUsers {
    users {
      id
      username
      name
      avatarUrl
      isAnonymous
      createdAt
    }
  }
`;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(
  baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    options,
  );
}
export function useGetUsersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUsersQuery,
    GetUsersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    options,
  );
}
export function useGetUsersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GetUsersQuery, GetUsersQueryVariables>(
    GetUsersDocument,
    options,
  );
}
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<
  typeof useGetUsersLazyQuery
>;
export type GetUsersSuspenseQueryHookResult = ReturnType<
  typeof useGetUsersSuspenseQuery
>;
export type GetUsersQueryResult = Apollo.QueryResult<
  GetUsersQuery,
  GetUsersQueryVariables
>;
export const GetMyHugRequestsDocument = gql`
  query GetMyHugRequests {
    myHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
    }
  }
`;

/**
 * __useGetMyHugRequestsQuery__
 *
 * To run a query within a React component, call `useGetMyHugRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMyHugRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMyHugRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetMyHugRequestsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetMyHugRequestsQuery,
    GetMyHugRequestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetMyHugRequestsQuery, GetMyHugRequestsQueryVariables>(
    GetMyHugRequestsDocument,
    options,
  );
}
export function useGetMyHugRequestsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetMyHugRequestsQuery,
    GetMyHugRequestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetMyHugRequestsQuery,
    GetMyHugRequestsQueryVariables
  >(GetMyHugRequestsDocument, options);
}
export function useGetMyHugRequestsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetMyHugRequestsQuery,
        GetMyHugRequestsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetMyHugRequestsQuery,
    GetMyHugRequestsQueryVariables
  >(GetMyHugRequestsDocument, options);
}
export type GetMyHugRequestsQueryHookResult = ReturnType<
  typeof useGetMyHugRequestsQuery
>;
export type GetMyHugRequestsLazyQueryHookResult = ReturnType<
  typeof useGetMyHugRequestsLazyQuery
>;
export type GetMyHugRequestsSuspenseQueryHookResult = ReturnType<
  typeof useGetMyHugRequestsSuspenseQuery
>;
export type GetMyHugRequestsQueryResult = Apollo.QueryResult<
  GetMyHugRequestsQuery,
  GetMyHugRequestsQueryVariables
>;
export const GetPendingHugRequestsDocument = gql`
  query GetPendingHugRequests {
    pendingHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      requester {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

/**
 * __useGetPendingHugRequestsQuery__
 *
 * To run a query within a React component, call `useGetPendingHugRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPendingHugRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPendingHugRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPendingHugRequestsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPendingHugRequestsQuery,
    GetPendingHugRequestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetPendingHugRequestsQuery,
    GetPendingHugRequestsQueryVariables
  >(GetPendingHugRequestsDocument, options);
}
export function useGetPendingHugRequestsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPendingHugRequestsQuery,
    GetPendingHugRequestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPendingHugRequestsQuery,
    GetPendingHugRequestsQueryVariables
  >(GetPendingHugRequestsDocument, options);
}
export function useGetPendingHugRequestsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetPendingHugRequestsQuery,
        GetPendingHugRequestsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetPendingHugRequestsQuery,
    GetPendingHugRequestsQueryVariables
  >(GetPendingHugRequestsDocument, options);
}
export type GetPendingHugRequestsQueryHookResult = ReturnType<
  typeof useGetPendingHugRequestsQuery
>;
export type GetPendingHugRequestsLazyQueryHookResult = ReturnType<
  typeof useGetPendingHugRequestsLazyQuery
>;
export type GetPendingHugRequestsSuspenseQueryHookResult = ReturnType<
  typeof useGetPendingHugRequestsSuspenseQuery
>;
export type GetPendingHugRequestsQueryResult = Apollo.QueryResult<
  GetPendingHugRequestsQuery,
  GetPendingHugRequestsQueryVariables
>;
export const GetCommunityHugRequestsDocument = gql`
  query GetCommunityHugRequests {
    communityHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      requester {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;

/**
 * __useGetCommunityHugRequestsQuery__
 *
 * To run a query within a React component, call `useGetCommunityHugRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommunityHugRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommunityHugRequestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCommunityHugRequestsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetCommunityHugRequestsQuery,
    GetCommunityHugRequestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCommunityHugRequestsQuery,
    GetCommunityHugRequestsQueryVariables
  >(GetCommunityHugRequestsDocument, options);
}
export function useGetCommunityHugRequestsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCommunityHugRequestsQuery,
    GetCommunityHugRequestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCommunityHugRequestsQuery,
    GetCommunityHugRequestsQueryVariables
  >(GetCommunityHugRequestsDocument, options);
}
export function useGetCommunityHugRequestsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetCommunityHugRequestsQuery,
        GetCommunityHugRequestsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetCommunityHugRequestsQuery,
    GetCommunityHugRequestsQueryVariables
  >(GetCommunityHugRequestsDocument, options);
}
export type GetCommunityHugRequestsQueryHookResult = ReturnType<
  typeof useGetCommunityHugRequestsQuery
>;
export type GetCommunityHugRequestsLazyQueryHookResult = ReturnType<
  typeof useGetCommunityHugRequestsLazyQuery
>;
export type GetCommunityHugRequestsSuspenseQueryHookResult = ReturnType<
  typeof useGetCommunityHugRequestsSuspenseQuery
>;
export type GetCommunityHugRequestsQueryResult = Apollo.QueryResult<
  GetCommunityHugRequestsQuery,
  GetCommunityHugRequestsQueryVariables
>;
export const CreateHugRequestDocument = gql`
  mutation CreateHugRequest($createHugRequestInput: CreateHugRequestInput!) {
    createHugRequest(createHugRequestInput: $createHugRequestInput) {
      id
      message
      isCommunityRequest
      status
      createdAt
      requesterId
      recipientId
    }
  }
`;
export type CreateHugRequestMutationFn = Apollo.MutationFunction<
  CreateHugRequestMutation,
  CreateHugRequestMutationVariables
>;

/**
 * __useCreateHugRequestMutation__
 *
 * To run a mutation, you first call `useCreateHugRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateHugRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createHugRequestMutation, { data, loading, error }] = useCreateHugRequestMutation({
 *   variables: {
 *      createHugRequestInput: // value for 'createHugRequestInput'
 *   },
 * });
 */
export function useCreateHugRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateHugRequestMutation,
    CreateHugRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateHugRequestMutation,
    CreateHugRequestMutationVariables
  >(CreateHugRequestDocument, options);
}
export type CreateHugRequestMutationHookResult = ReturnType<
  typeof useCreateHugRequestMutation
>;
export type CreateHugRequestMutationResult =
  Apollo.MutationResult<CreateHugRequestMutation>;
export type CreateHugRequestMutationOptions = Apollo.BaseMutationOptions<
  CreateHugRequestMutation,
  CreateHugRequestMutationVariables
>;
export const RespondToHugRequestDocument = gql`
  mutation RespondToHugRequest($respondToRequestInput: RespondToRequestInput!) {
    respondToHugRequest(respondToRequestInput: $respondToRequestInput) {
      id
      status
      respondedAt
    }
  }
`;
export type RespondToHugRequestMutationFn = Apollo.MutationFunction<
  RespondToHugRequestMutation,
  RespondToHugRequestMutationVariables
>;

/**
 * __useRespondToHugRequestMutation__
 *
 * To run a mutation, you first call `useRespondToHugRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRespondToHugRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [respondToHugRequestMutation, { data, loading, error }] = useRespondToHugRequestMutation({
 *   variables: {
 *      respondToRequestInput: // value for 'respondToRequestInput'
 *   },
 * });
 */
export function useRespondToHugRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RespondToHugRequestMutation,
    RespondToHugRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RespondToHugRequestMutation,
    RespondToHugRequestMutationVariables
  >(RespondToHugRequestDocument, options);
}
export type RespondToHugRequestMutationHookResult = ReturnType<
  typeof useRespondToHugRequestMutation
>;
export type RespondToHugRequestMutationResult =
  Apollo.MutationResult<RespondToHugRequestMutation>;
export type RespondToHugRequestMutationOptions = Apollo.BaseMutationOptions<
  RespondToHugRequestMutation,
  RespondToHugRequestMutationVariables
>;
export const SendFriendRequestDocument = gql`
  mutation SendFriendRequest($createFriendshipInput: CreateFriendshipInput!) {
    sendFriendRequest(createFriendshipInput: $createFriendshipInput) {
      id
      requesterId
      recipientId
      status
      followsMood
      createdAt
      requester {
        id
        username
        name
      }
      recipient {
        id
        username
        name
      }
    }
  }
`;
export type SendFriendRequestMutationFn = Apollo.MutationFunction<
  SendFriendRequestMutation,
  SendFriendRequestMutationVariables
>;

/**
 * __useSendFriendRequestMutation__
 *
 * To run a mutation, you first call `useSendFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendFriendRequestMutation, { data, loading, error }] = useSendFriendRequestMutation({
 *   variables: {
 *      createFriendshipInput: // value for 'createFriendshipInput'
 *   },
 * });
 */
export function useSendFriendRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    SendFriendRequestMutation,
    SendFriendRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    SendFriendRequestMutation,
    SendFriendRequestMutationVariables
  >(SendFriendRequestDocument, options);
}
export type SendFriendRequestMutationHookResult = ReturnType<
  typeof useSendFriendRequestMutation
>;
export type SendFriendRequestMutationResult =
  Apollo.MutationResult<SendFriendRequestMutation>;
export type SendFriendRequestMutationOptions = Apollo.BaseMutationOptions<
  SendFriendRequestMutation,
  SendFriendRequestMutationVariables
>;
export const RespondToFriendRequestDocument = gql`
  mutation RespondToFriendRequest(
    $updateFriendshipInput: UpdateFriendshipInput!
  ) {
    respondToFriendRequest(updateFriendshipInput: $updateFriendshipInput) {
      id
      status
      followsMood
      updatedAt
    }
  }
`;
export type RespondToFriendRequestMutationFn = Apollo.MutationFunction<
  RespondToFriendRequestMutation,
  RespondToFriendRequestMutationVariables
>;

/**
 * __useRespondToFriendRequestMutation__
 *
 * To run a mutation, you first call `useRespondToFriendRequestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRespondToFriendRequestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [respondToFriendRequestMutation, { data, loading, error }] = useRespondToFriendRequestMutation({
 *   variables: {
 *      updateFriendshipInput: // value for 'updateFriendshipInput'
 *   },
 * });
 */
export function useRespondToFriendRequestMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RespondToFriendRequestMutation,
    RespondToFriendRequestMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RespondToFriendRequestMutation,
    RespondToFriendRequestMutationVariables
  >(RespondToFriendRequestDocument, options);
}
export type RespondToFriendRequestMutationHookResult = ReturnType<
  typeof useRespondToFriendRequestMutation
>;
export type RespondToFriendRequestMutationResult =
  Apollo.MutationResult<RespondToFriendRequestMutation>;
export type RespondToFriendRequestMutationOptions = Apollo.BaseMutationOptions<
  RespondToFriendRequestMutation,
  RespondToFriendRequestMutationVariables
>;
