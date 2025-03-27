import{i as P,k as g,l as W,n as V,o as Q,_ as R,p as K,q as M,s as b,t as Y,v as B,w as D,N as I,x as F,A as N,y as J,D as X,z as u,d as A,j as v}from"./main-c60bfe80.js";var U=!1,Z="useSyncExternalStore",ee=V[Z],te=ee||function(e,t,r){var n=t();globalThis.__DEV__!==!1&&!U&&n!==t()&&(U=!0,globalThis.__DEV__!==!1&&P.error(68));var a=g.useState({inst:{value:n,getSnapshot:t}}),s=a[0].inst,o=a[1];return W?g.useLayoutEffect(function(){Object.assign(s,{value:n,getSnapshot:t}),k(s)&&o({inst:s})},[e,n,t]):Object.assign(s,{value:n,getSnapshot:t}),g.useEffect(function(){return k(s)&&o({inst:s}),e(function(){k(s)&&o({inst:s})})},[e]),n};function k(e){var t=e.value,r=e.getSnapshot;try{return t!==r()}catch{return!0}}var re=Symbol.for("apollo.hook.wrappers");function ne(e,t,r){var n=r.queryManager,a=n&&n[re],s=a&&a[e];return s?s(t):t}var ae=Object.prototype.hasOwnProperty;function $(){}var q=Symbol();function Re(e,t){return t===void 0&&(t=Object.create(null)),ne("useQuery",se,Q(t&&t.client))(e,t)}function se(e,t){var r=ue(e,t),n=r.result,a=r.obsQueryFields;return g.useMemo(function(){return R(R({},n),a)},[n,a])}function ie(e,t,r,n,a){function s(c){var l;J(t,X.Query);var m={client:e,query:t,observable:n&&n.getSSRObservable(a())||e.watchQuery(j(void 0,e,r,a())),resultData:{previousData:(l=c==null?void 0:c.resultData.current)===null||l===void 0?void 0:l.data}};return m}var o=g.useState(s),i=o[0],d=o[1];function f(c){var l,m;Object.assign(i.observable,(l={},l[q]=c,l));var h=i.resultData;d(R(R({},i),{query:c.query,resultData:Object.assign(h,{previousData:((m=h.current)===null||m===void 0?void 0:m.data)||h.previousData,current:void 0})}))}if(e!==i.client||t!==i.query){var y=s(i);return d(y),[y,f]}return[i,f]}function ue(e,t){var r=Q(t.client),n=g.useContext(K()).renderPromises,a=!!n,s=r.disableNetworkFetches,o=t.ssr!==!1&&!t.skip,i=t.partialRefetch,d=le(r,e,t,a),f=ie(r,e,t,n,d),y=f[0],c=y.observable,l=y.resultData,m=f[1],h=d(c);ce(l,c,r,t,h);var _=g.useMemo(function(){return me(c)},[c]);de(c,n,o);var S=oe(l,c,r,t,h,s,i,a,{onCompleted:t.onCompleted||$,onError:t.onError||$});return{result:S,obsQueryFields:_,observable:c,resultData:l,client:r,onQueryExecuted:m}}function oe(e,t,r,n,a,s,o,i,d){var f=g.useRef(d);g.useEffect(function(){f.current=d});var y=(i||s)&&n.ssr===!1&&!n.skip?L:n.skip||a.fetchPolicy==="standby"?z:void 0,c=e.previousData,l=g.useMemo(function(){return y&&x(y,c,t,r)},[r,t,y,c]);return te(g.useCallback(function(m){if(i)return function(){};var h=function(){var E=e.current,p=t.getCurrentResult();E&&E.loading===p.loading&&E.networkStatus===p.networkStatus&&M(E.data,p.data)||w(p,e,t,r,o,m,f.current)},_=function(E){if(S.current.unsubscribe(),S.current=t.resubscribeAfterError(h,_),!ae.call(E,"graphQLErrors"))throw E;var p=e.current;(!p||p&&p.loading||!M(E,p.error))&&w({data:p&&p.data,error:E,loading:!1,networkStatus:I.error},e,t,r,o,m,f.current)},S={current:t.subscribe(h,_)};return function(){setTimeout(function(){return S.current.unsubscribe()})}},[s,i,t,e,o,r]),function(){return l||O(e,t,f.current,o,r)},function(){return l||O(e,t,f.current,o,r)})}function de(e,t,r){t&&r&&(t.registerSSRObservable(e),e.getCurrentResult().loading&&t.addObservableQueryPromise(e))}function ce(e,t,r,n,a){var s;t[q]&&!M(t[q],a)&&(t.reobserve(j(t,r,n,a)),e.previousData=((s=e.current)===null||s===void 0?void 0:s.data)||e.previousData,e.current=void 0),t[q]=a}function le(e,t,r,n){r===void 0&&(r={});var a=r.skip;r.ssr,r.onCompleted,r.onError;var s=r.defaultOptions,o=b(r,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(i){var d=Object.assign(o,{query:t});return n&&(d.fetchPolicy==="network-only"||d.fetchPolicy==="cache-and-network")&&(d.fetchPolicy="cache-first"),d.variables||(d.variables={}),a?(d.initialFetchPolicy=d.initialFetchPolicy||d.fetchPolicy||C(s,e.defaultOptions),d.fetchPolicy="standby"):d.fetchPolicy||(d.fetchPolicy=(i==null?void 0:i.options.initialFetchPolicy)||C(s,e.defaultOptions)),d}}function j(e,t,r,n){var a=[],s=t.defaultOptions.watchQuery;return s&&a.push(s),r.defaultOptions&&a.push(r.defaultOptions),a.push(Y(e&&e.options,n)),a.reduce(B)}function w(e,t,r,n,a,s,o){var i=t.current;i&&i.data&&(t.previousData=i.data),!e.error&&F(e.errors)&&(e.error=new N({graphQLErrors:e.errors})),t.current=x(ge(e,r,a),t.previousData,r,n),s(),fe(e,i==null?void 0:i.networkStatus,o)}function fe(e,t,r){if(!e.loading){var n=pe(e);Promise.resolve().then(function(){n?r.onError(n):e.data&&t!==e.networkStatus&&e.networkStatus===I.ready&&r.onCompleted(e.data)}).catch(function(a){globalThis.__DEV__!==!1&&P.warn(a)})}}function O(e,t,r,n,a){return e.current||w(t.getCurrentResult(),e,t,a,n,function(){},r),e.current}function C(e,t){var r;return(e==null?void 0:e.fetchPolicy)||((r=t==null?void 0:t.watchQuery)===null||r===void 0?void 0:r.fetchPolicy)||"cache-first"}function pe(e){return F(e.errors)?new N({graphQLErrors:e.errors}):e.error}function x(e,t,r,n){var a=e.data;e.partial;var s=b(e,["data","partial"]),o=R(R({data:a},s),{client:n,observable:r,variables:r.variables,called:e!==L&&e!==z,previousData:t});return o}function ge(e,t,r){return e.partial&&r&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&t.options.fetchPolicy!=="cache-only"?(t.refetch(),R(R({},e),{loading:!0,networkStatus:I.refetch})):e}var L=D({loading:!0,data:void 0,error:void 0,networkStatus:I.loading}),z=D({loading:!1,data:void 0,error:void 0,networkStatus:I.ready});function me(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}u`
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
`;u`
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
`;u`
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
`;u`
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
`;u`
  query GetUserStats {
    userMoods {
      id
      score
    }
  }
`;const Se=u`
  query GetUserMoodsCount {
    userMoods {
      id
    }
  }
`,Ie=u`
  query GetSentHugsCount {
    sentHugs {
      id
    }
  }
`,_e=u`
  query GetReceivedHugsCount {
    receivedHugs {
      id
    }
  }
`,qe=u`
  query GetMoodStreak {
    moodStreak
  }
`,Ae=u`
  query GetUserMoods {
    userMoods {
      id
      score
      note
      createdAt
    }
  }
`,ke=u`
  query GetPublicMoods($limit: Int, $offset: Int) {
    publicMoods(limit: $limit, offset: $offset) {
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
`,Te=u`
  query GetFriendsMoods($limit: Int, $offset: Int) {
    friendsMoods(limit: $limit, offset: $offset) {
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
`;u`
  mutation CreateMoodEntry($createMoodInput: CreateMoodInput!) {
    createMood(createMoodInput: $createMoodInput) {
      id
      score
      note
      createdAt
    }
  }
`;const Me=u`
  query GetReceivedHugs($limit: Int, $offset: Int) {
    receivedHugs(limit: $limit, offset: $offset) {
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
`,we=u`
  query GetSentHugs($limit: Int, $offset: Int) {
    sentHugs(limit: $limit, offset: $offset) {
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
`,Ue=u`
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
`,$e=u`
  mutation MarkHugAsRead($hugId: ID!) {
    markHugAsRead(hugId: $hugId) {
      id
      isRead
    }
  }
`,Oe=u`
  query GetUsers($search: String, $limit: Int, $offset: Int) {
    users(search: $search, limit: $limit, offset: $offset) {
      id
      username
      name
      avatarUrl
      isAnonymous
      createdAt
    }
  }
`,Ce=u`
  query GetMyHugRequests {
    myHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
    }
  }
`,Ge=u`
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
`,He=u`
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
`;u`
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
`;u`
  mutation RespondToHugRequest($respondToRequestInput: RespondToRequestInput!) {
    respondToHugRequest(respondToRequestInput: $respondToRequestInput) {
      id
      status
      respondedAt
    }
  }
`;const Pe=u`
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
`;u`
  mutation RespondToFriendRequest($updateFriendshipInput: UpdateFriendshipInput!) {
    respondToFriendRequest(updateFriendshipInput: $updateFriendshipInput) {
      id
      status
      followsMood
      updatedAt
    }
  }
`;const ve=(e,t={})=>{var n;const r=((n=e==null?void 0:e.message)==null?void 0:n.toLowerCase())||"";return r.includes("unauthorized")||r.includes("unauthenticated")||r.includes("auth")||r.includes("login")||r.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":r.includes("network")||r.includes("connection")||r.includes("offline")||r.includes("failed to fetch")||e.name==="NetworkError"||t.isNetworkError?"network":r.includes("not found")||r.includes("404")||r.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||t.isRouteError?"route":r.includes("validation")||r.includes("invalid")||r.includes("data")||r.includes("database")||r.includes("constraint")||t.isDataError?"data":"general"},ye=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},G=A.div`
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger-color);
  color: var(--danger-dark);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
`,H=A.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`,T=A.p`
  margin: 0;
  font-size: 0.9rem;
`,he=A.div`
  margin-top: 0.75rem;
  
  button {
    background: none;
    border: none;
    color: var(--danger-dark);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: 0.9rem;
  }
`,Qe=({error:e,context:t={}})=>{var o;if(!e)return v.jsxs(G,{children:[v.jsx(H,{children:"An unknown error occurred"}),v.jsx(T,{children:"Please try again later or contact support if the problem persists."})]});const r=ve(e,t),n=ye(r),a=e.message||e.graphQLErrors&&((o=e.graphQLErrors[0])==null?void 0:o.message)||"An unknown error occurred",s=()=>{window.location.reload()};return v.jsxs(G,{children:[v.jsx(H,{children:n.title}),v.jsx(T,{children:n.description}),v.jsxs(T,{children:[v.jsx("strong",{children:"Details:"})," ",a]}),v.jsx(he,{children:v.jsx("button",{onClick:s,children:"Refresh the page"})})]})};export{Qe as E,ke as G,$e as M,Ue as S,qe as a,Se as b,Ie as c,_e as d,Te as e,Oe as f,Me as g,Pe as h,Ae as i,we as j,Ce as k,Ge as l,He as m,Re as u};
//# sourceMappingURL=ErrorMessage-845ccd12.js.map
