import{i as Q,k as g,l as W,n as V,o as b,_ as R,p as K,q as M,s as D,t as Y,v as B,w as F,N as _,x as N,A as j,y as J,D as X,z as i,d as A,j as v}from"./main-c3ebb1fd.js";var U=!1,Z="useSyncExternalStore",ee=V[Z],te=ee||function(e,t,r){var n=t();globalThis.__DEV__!==!1&&!U&&n!==t()&&(U=!0,globalThis.__DEV__!==!1&&Q.error(68));var a=g.useState({inst:{value:n,getSnapshot:t}}),s=a[0].inst,o=a[1];return W?g.useLayoutEffect(function(){Object.assign(s,{value:n,getSnapshot:t}),k(s)&&o({inst:s})},[e,n,t]):Object.assign(s,{value:n,getSnapshot:t}),g.useEffect(function(){return k(s)&&o({inst:s}),e(function(){k(s)&&o({inst:s})})},[e]),n};function k(e){var t=e.value,r=e.getSnapshot;try{return t!==r()}catch{return!0}}var re=Symbol.for("apollo.hook.wrappers");function ne(e,t,r){var n=r.queryManager,a=n&&n[re],s=a&&a[e];return s?s(t):t}var ae=Object.prototype.hasOwnProperty;function O(){}var q=Symbol();function Re(e,t){return t===void 0&&(t=Object.create(null)),ne("useQuery",se,b(t&&t.client))(e,t)}function se(e,t){var r=ie(e,t),n=r.result,a=r.obsQueryFields;return g.useMemo(function(){return R(R({},n),a)},[n,a])}function ue(e,t,r,n,a){function s(c){var l;J(t,X.Query);var m={client:e,query:t,observable:n&&n.getSSRObservable(a())||e.watchQuery(x(void 0,e,r,a())),resultData:{previousData:(l=c==null?void 0:c.resultData.current)===null||l===void 0?void 0:l.data}};return m}var o=g.useState(s),u=o[0],d=o[1];function p(c){var l,m;Object.assign(u.observable,(l={},l[q]=c,l));var h=u.resultData;d(R(R({},u),{query:c.query,resultData:Object.assign(h,{previousData:((m=h.current)===null||m===void 0?void 0:m.data)||h.previousData,current:void 0})}))}if(e!==u.client||t!==u.query){var y=s(u);return d(y),[y,p]}return[u,p]}function ie(e,t){var r=b(t.client),n=g.useContext(K()).renderPromises,a=!!n,s=r.disableNetworkFetches,o=t.ssr!==!1&&!t.skip,u=t.partialRefetch,d=le(r,e,t,a),p=ue(r,e,t,n,d),y=p[0],c=y.observable,l=y.resultData,m=p[1],h=d(c);ce(l,c,r,t,h);var I=g.useMemo(function(){return me(c)},[c]);de(c,n,o);var S=oe(l,c,r,t,h,s,u,a,{onCompleted:t.onCompleted||O,onError:t.onError||O});return{result:S,obsQueryFields:I,observable:c,resultData:l,client:r,onQueryExecuted:m}}function oe(e,t,r,n,a,s,o,u,d){var p=g.useRef(d);g.useEffect(function(){p.current=d});var y=(u||s)&&n.ssr===!1&&!n.skip?L:n.skip||a.fetchPolicy==="standby"?z:void 0,c=e.previousData,l=g.useMemo(function(){return y&&$(y,c,t,r)},[r,t,y,c]);return te(g.useCallback(function(m){if(u)return function(){};var h=function(){var E=e.current,f=t.getCurrentResult();E&&E.loading===f.loading&&E.networkStatus===f.networkStatus&&M(E.data,f.data)||w(f,e,t,r,o,m,p.current)},I=function(E){if(S.current.unsubscribe(),S.current=t.resubscribeAfterError(h,I),!ae.call(E,"graphQLErrors"))throw E;var f=e.current;(!f||f&&f.loading||!M(E,f.error))&&w({data:f&&f.data,error:E,loading:!1,networkStatus:_.error},e,t,r,o,m,p.current)},S={current:t.subscribe(h,I)};return function(){setTimeout(function(){return S.current.unsubscribe()})}},[s,u,t,e,o,r]),function(){return l||C(e,t,p.current,o,r)},function(){return l||C(e,t,p.current,o,r)})}function de(e,t,r){t&&r&&(t.registerSSRObservable(e),e.getCurrentResult().loading&&t.addObservableQueryPromise(e))}function ce(e,t,r,n,a){var s;t[q]&&!M(t[q],a)&&(t.reobserve(x(t,r,n,a)),e.previousData=((s=e.current)===null||s===void 0?void 0:s.data)||e.previousData,e.current=void 0),t[q]=a}function le(e,t,r,n){r===void 0&&(r={});var a=r.skip;r.ssr,r.onCompleted,r.onError;var s=r.defaultOptions,o=D(r,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(u){var d=Object.assign(o,{query:t});return n&&(d.fetchPolicy==="network-only"||d.fetchPolicy==="cache-and-network")&&(d.fetchPolicy="cache-first"),d.variables||(d.variables={}),a?(d.initialFetchPolicy=d.initialFetchPolicy||d.fetchPolicy||G(s,e.defaultOptions),d.fetchPolicy="standby"):d.fetchPolicy||(d.fetchPolicy=(u==null?void 0:u.options.initialFetchPolicy)||G(s,e.defaultOptions)),d}}function x(e,t,r,n){var a=[],s=t.defaultOptions.watchQuery;return s&&a.push(s),r.defaultOptions&&a.push(r.defaultOptions),a.push(Y(e&&e.options,n)),a.reduce(B)}function w(e,t,r,n,a,s,o){var u=t.current;u&&u.data&&(t.previousData=u.data),!e.error&&N(e.errors)&&(e.error=new j({graphQLErrors:e.errors})),t.current=$(ge(e,r,a),t.previousData,r,n),s(),pe(e,u==null?void 0:u.networkStatus,o)}function pe(e,t,r){if(!e.loading){var n=fe(e);Promise.resolve().then(function(){n?r.onError(n):e.data&&t!==e.networkStatus&&e.networkStatus===_.ready&&r.onCompleted(e.data)}).catch(function(a){globalThis.__DEV__!==!1&&Q.warn(a)})}}function C(e,t,r,n,a){return e.current||w(t.getCurrentResult(),e,t,a,n,function(){},r),e.current}function G(e,t){var r;return(e==null?void 0:e.fetchPolicy)||((r=t==null?void 0:t.watchQuery)===null||r===void 0?void 0:r.fetchPolicy)||"cache-first"}function fe(e){return N(e.errors)?new j({graphQLErrors:e.errors}):e.error}function $(e,t,r,n){var a=e.data;e.partial;var s=D(e,["data","partial"]),o=R(R({data:a},s),{client:n,observable:r,variables:r.variables,called:e!==L&&e!==z,previousData:t});return o}function ge(e,t,r){return e.partial&&r&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&t.options.fetchPolicy!=="cache-only"?(t.refetch(),R(R({},e),{loading:!0,networkStatus:_.refetch})):e}var L=F({loading:!0,data:void 0,error:void 0,networkStatus:_.loading}),z=F({loading:!1,data:void 0,error:void 0,networkStatus:_.ready});function me(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}i`
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
`;i`
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
`;i`
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
`;i`
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
`;i`
  query GetUserStats {
    userMoods {
      id
      score
    }
  }
`;const Se=i`
  query GetUserMoodsCount {
    userMoods {
      id
    }
  }
`,_e=i`
  query GetSentHugsCount {
    sentHugs {
      id
    }
  }
`,Ie=i`
  query GetReceivedHugsCount {
    receivedHugs {
      id
    }
  }
`,qe=i`
  query GetMoodStreak {
    moodStreak
  }
`,Ae=i`
  query GetUserMoods {
    userMoods {
      id
      score
      note
      createdAt
    }
  }
`,ke=i`
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
`,Te=i`
  query GetFriendsMoods {
    friendsMoods {
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
`;i`
  mutation CreateMoodEntry($createMoodInput: CreateMoodInput!) {
    createMood(createMoodInput: $createMoodInput) {
      id
      score
      note
      createdAt
    }
  }
`;const Me=i`
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
`,we=i`
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
`,Ue=i`
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
`,Oe=i`
  mutation MarkHugAsRead($hugId: ID!) {
    markHugAsRead(hugId: $hugId) {
      id
      isRead
    }
  }
`,Ce=i`
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
`,Ge=i`
  query GetMyHugRequests {
    myHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
    }
  }
`,He=i`
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
`,Pe=i`
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
`;i`
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
`;i`
  mutation RespondToHugRequest($respondToRequestInput: RespondToRequestInput!) {
    respondToHugRequest(respondToRequestInput: $respondToRequestInput) {
      id
      status
      respondedAt
    }
  }
`;const Qe=i`
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
`;i`
  mutation RespondToFriendRequest($updateFriendshipInput: UpdateFriendshipInput!) {
    respondToFriendRequest(updateFriendshipInput: $updateFriendshipInput) {
      id
      status
      followsMood
      updatedAt
    }
  }
`;const ve=(e,t={})=>{var n;const r=((n=e==null?void 0:e.message)==null?void 0:n.toLowerCase())||"";return r.includes("unauthorized")||r.includes("unauthenticated")||r.includes("auth")||r.includes("login")||r.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":r.includes("network")||r.includes("connection")||r.includes("offline")||r.includes("failed to fetch")||e.name==="NetworkError"||t.isNetworkError?"network":r.includes("not found")||r.includes("404")||r.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||t.isRouteError?"route":r.includes("validation")||r.includes("invalid")||r.includes("data")||r.includes("database")||r.includes("constraint")||t.isDataError?"data":"general"},ye=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},H=A.div`
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger-color);
  color: var(--danger-dark);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
`,P=A.h3`
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
`,be=({error:e,context:t={}})=>{var o;if(!e)return v.jsxs(H,{children:[v.jsx(P,{children:"An unknown error occurred"}),v.jsx(T,{children:"Please try again later or contact support if the problem persists."})]});const r=ve(e,t),n=ye(r),a=e.message||e.graphQLErrors&&((o=e.graphQLErrors[0])==null?void 0:o.message)||"An unknown error occurred",s=()=>{window.location.reload()};return v.jsxs(H,{children:[v.jsx(P,{children:n.title}),v.jsx(T,{children:n.description}),v.jsxs(T,{children:[v.jsx("strong",{children:"Details:"})," ",a]}),v.jsx(he,{children:v.jsx("button",{onClick:s,children:"Refresh the page"})})]})};export{be as E,ke as G,Oe as M,Ue as S,qe as a,Se as b,_e as c,Ie as d,Te as e,Ce as f,Me as g,Qe as h,Ae as i,we as j,Ge as k,He as l,Pe as m,Re as u};
//# sourceMappingURL=ErrorMessage-c0d6e0b9.js.map
