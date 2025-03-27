import{i as b,k as g,l as W,n as V,o as Q,_ as S,p as K,q as T,s as C,t as Y,v as B,w as D,N as A,x as j,A as x,y as J,D as X,z as u,d as _,j as v}from"./main-80d2cd30.js";var U=!1,Z="useSyncExternalStore",ee=V[Z],te=ee||function(e,t,r){var n=t();globalThis.__DEV__!==!1&&!U&&n!==t()&&(U=!0,globalThis.__DEV__!==!1&&b.error(68));var a=g.useState({inst:{value:n,getSnapshot:t}}),i=a[0].inst,o=a[1];return W?g.useLayoutEffect(function(){Object.assign(i,{value:n,getSnapshot:t}),w(i)&&o({inst:i})},[e,n,t]):Object.assign(i,{value:n,getSnapshot:t}),g.useEffect(function(){return w(i)&&o({inst:i}),e(function(){w(i)&&o({inst:i})})},[e]),n};function w(e){var t=e.value,r=e.getSnapshot;try{return t!==r()}catch{return!0}}var re=Symbol.for("apollo.hook.wrappers");function ne(e,t,r){var n=r.queryManager,a=n&&n[re],i=a&&a[e];return i?i(t):t}var ae=Object.prototype.hasOwnProperty;function O(){}var k=Symbol();function Se(e,t){return t===void 0&&(t=Object.create(null)),ne("useQuery",ie,Q(t&&t.client))(e,t)}function ie(e,t){var r=oe(e,t),n=r.result,a=r.obsQueryFields;return g.useMemo(function(){return S(S({},n),a)},[n,a])}function se(e,t,r,n,a){function i(c){var l;J(t,X.Query);var p={client:e,query:t,observable:n&&n.getSSRObservable(a())||e.watchQuery(F(void 0,e,r,a())),resultData:{previousData:(l=c==null?void 0:c.resultData.current)===null||l===void 0?void 0:l.data}};return p}var o=g.useState(i),s=o[0],d=o[1];function f(c){var l,p;Object.assign(s.observable,(l={},l[k]=c,l));var h=s.resultData;d(S(S({},s),{query:c.query,resultData:Object.assign(h,{previousData:((p=h.current)===null||p===void 0?void 0:p.data)||h.previousData,current:void 0})}))}if(e!==s.client||t!==s.query){var y=i(s);return d(y),[y,f]}return[s,f]}function oe(e,t){var r=Q(t.client),n=g.useContext(K()).renderPromises,a=!!n,i=r.disableNetworkFetches,o=t.ssr!==!1&&!t.skip,s=t.partialRefetch,d=le(r,e,t,a),f=se(r,e,t,n,d),y=f[0],c=y.observable,l=y.resultData,p=f[1],h=d(c);ce(l,c,r,t,h);var R=g.useMemo(function(){return pe(c)},[c]);de(c,n,o);var $=ue(l,c,r,t,h,i,s,a,{onCompleted:t.onCompleted||O,onError:t.onError||O});return{result:$,obsQueryFields:R,observable:c,resultData:l,client:r,onQueryExecuted:p}}function ue(e,t,r,n,a,i,o,s,d){var f=g.useRef(d);g.useEffect(function(){f.current=d});var y=(s||i)&&n.ssr===!1&&!n.skip?L:n.skip||a.fetchPolicy==="standby"?z:void 0,c=e.previousData,l=g.useMemo(function(){return y&&N(y,c,t,r)},[r,t,y,c]);return te(g.useCallback(function(p){if(s)return function(){};var h=function(){var E=e.current,m=t.getCurrentResult();E&&E.loading===m.loading&&E.networkStatus===m.networkStatus&&T(E.data,m.data)||P(m,e,t,r,o,p,f.current)},R=function(E){if($.current.unsubscribe(),$.current=t.resubscribeAfterError(h,R),!ae.call(E,"graphQLErrors"))throw E;var m=e.current;(!m||m&&m.loading||!T(E,m.error))&&P({data:m&&m.data,error:E,loading:!1,networkStatus:A.error},e,t,r,o,p,f.current)},$={current:t.subscribe(h,R)};return function(){setTimeout(function(){return $.current.unsubscribe()})}},[i,s,t,e,o,r]),function(){return l||G(e,t,f.current,o,r)},function(){return l||G(e,t,f.current,o,r)})}function de(e,t,r){t&&r&&(t.registerSSRObservable(e),e.getCurrentResult().loading&&t.addObservableQueryPromise(e))}function ce(e,t,r,n,a){var i;t[k]&&!T(t[k],a)&&(t.reobserve(F(t,r,n,a)),e.previousData=((i=e.current)===null||i===void 0?void 0:i.data)||e.previousData,e.current=void 0),t[k]=a}function le(e,t,r,n){r===void 0&&(r={});var a=r.skip;r.ssr,r.onCompleted,r.onError;var i=r.defaultOptions,o=C(r,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(s){var d=Object.assign(o,{query:t});return n&&(d.fetchPolicy==="network-only"||d.fetchPolicy==="cache-and-network")&&(d.fetchPolicy="cache-first"),d.variables||(d.variables={}),a?(d.initialFetchPolicy=d.initialFetchPolicy||d.fetchPolicy||I(i,e.defaultOptions),d.fetchPolicy="standby"):d.fetchPolicy||(d.fetchPolicy=(s==null?void 0:s.options.initialFetchPolicy)||I(i,e.defaultOptions)),d}}function F(e,t,r,n){var a=[],i=t.defaultOptions.watchQuery;return i&&a.push(i),r.defaultOptions&&a.push(r.defaultOptions),a.push(Y(e&&e.options,n)),a.reduce(B)}function P(e,t,r,n,a,i,o){var s=t.current;s&&s.data&&(t.previousData=s.data),!e.error&&j(e.errors)&&(e.error=new x({graphQLErrors:e.errors})),t.current=N(ge(e,r,a),t.previousData,r,n),i(),fe(e,s==null?void 0:s.networkStatus,o)}function fe(e,t,r){if(!e.loading){var n=me(e);Promise.resolve().then(function(){n?r.onError(n):e.data&&t!==e.networkStatus&&e.networkStatus===A.ready&&r.onCompleted(e.data)}).catch(function(a){globalThis.__DEV__!==!1&&b.warn(a)})}}function G(e,t,r,n,a){return e.current||P(t.getCurrentResult(),e,t,a,n,function(){},r),e.current}function I(e,t){var r;return(e==null?void 0:e.fetchPolicy)||((r=t==null?void 0:t.watchQuery)===null||r===void 0?void 0:r.fetchPolicy)||"cache-first"}function me(e){return j(e.errors)?new x({graphQLErrors:e.errors}):e.error}function N(e,t,r,n){var a=e.data;e.partial;var i=C(e,["data","partial"]),o=S(S({data:a},i),{client:n,observable:r,variables:r.variables,called:e!==L&&e!==z,previousData:t});return o}function ge(e,t,r){return e.partial&&r&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&t.options.fetchPolicy!=="cache-only"?(t.refetch(),S(S({},e),{loading:!0,networkStatus:A.refetch})):e}var L=D({loading:!0,data:void 0,error:void 0,networkStatus:A.loading}),z=D({loading:!1,data:void 0,error:void 0,networkStatus:A.ready});function pe(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}u`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
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
  mutation AnonymousLogin($nickname: String!) {
    anonymousLogin(nickname: $nickname) {
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
      bio
      isAnonymous
      createdAt
      updatedAt
      settings {
        theme
        language
        notifications
        privacy
      }
    }
  }
`;const $e=u`
  query GetUserStats {
    userStats {
      moodStreak
      totalMoodEntries
      averageMoodScore
      highestMoodThisMonth
      lowestMoodThisMonth
      hugsSent
      hugsReceived
    }
  }
`,Ae=u`
  query GetMoodStreak {
    moodStreak
  }
`,Re=u`
  query GetUserMoods($limit: Int, $offset: Int) {
    userMoods(limit: $limit, offset: $offset) {
      id
      score
      note
      tags
      createdAt
      updatedAt
    }
  }
`,ke=u`
  query GetPublicMoods($limit: Int, $offset: Int) {
    publicMoods(limit: $limit, offset: $offset) {
      id
      score
      note
      tags
      createdAt
      updatedAt
      user {
        id
        username
        name
        avatarUrl
      }
    }
  }
`,_e=u`
  query GetFriendsMoods($limit: Float) {
    friendsMoods(limit: $limit) {
      id
      score
      note
      isPublic
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
  mutation CreateMoodEntry($input: MoodInput!) {
    createMoodEntry(input: $input) {
      id
      score
      note
      tags
      createdAt
      updatedAt
    }
  }
`;const we=u`
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
`,Me=u`
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
`,Te=u`
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
`,Pe=u`
  mutation MarkHugAsRead($id: ID!) {
    markHugAsRead(id: $id) {
      id
      isRead
    }
  }
`;u`
  query GetCommunityFeed($limit: Int, $offset: Int) {
    communityFeed(limit: $limit, offset: $offset) {
      id
      type
      content
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
      ... on MoodPost {
        score
        tags
      }
      ... on HugPost {
        hugType
        recipient {
          id
          username
          name
          avatarUrl
        }
      }
      ... on AchievementPost {
        achievementType
        title
        description
      }
    }
  }
`;const Ue=u`
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
`;u`
  query GetHugRequests($status: String, $limit: Int, $offset: Int) {
    hugRequests(status: $status, limit: $limit, offset: $offset) {
      id
      message
      type
      status
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;const Oe=u`
  query GetMyHugRequests($limit: Int, $offset: Int) {
    myHugRequests(limit: $limit, offset: $offset) {
      id
      message
      type
      status
      createdAt
      updatedAt
    }
  }
`,Ge=u`
  query GetPendingHugRequests($limit: Int, $offset: Int) {
    pendingHugRequests(limit: $limit, offset: $offset) {
      id
      message
      type
      status
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
    }
  }
`,Ie=u`
  query GetCommunityHugRequests($limit: Int, $offset: Int) {
    communityHugRequests(limit: $limit, offset: $offset) {
      id
      message
      type
      status
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
  mutation CreateHugRequest($input: HugRequestInput!) {
    createHugRequest(input: $input) {
      id
      message
      type
      status
      createdAt
    }
  }
`;u`
  mutation RespondToHugRequest($id: ID!, $accept: Boolean!) {
    respondToHugRequest(id: $id, accept: $accept) {
      id
      status
      updatedAt
    }
  }
`;const ve=(e,t={})=>{var n;const r=((n=e==null?void 0:e.message)==null?void 0:n.toLowerCase())||"";return r.includes("unauthorized")||r.includes("unauthenticated")||r.includes("auth")||r.includes("login")||r.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":r.includes("network")||r.includes("connection")||r.includes("offline")||r.includes("failed to fetch")||e.name==="NetworkError"||t.isNetworkError?"network":r.includes("not found")||r.includes("404")||r.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||t.isRouteError?"route":r.includes("validation")||r.includes("invalid")||r.includes("data")||r.includes("database")||r.includes("constraint")||t.isDataError?"data":"general"},ye=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},q=_.div`
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger-color);
  color: var(--danger-dark);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
`,H=_.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`,M=_.p`
  margin: 0;
  font-size: 0.9rem;
`,he=_.div`
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
`,qe=({error:e,context:t={}})=>{var o;if(!e)return v.jsxs(q,{children:[v.jsx(H,{children:"An unknown error occurred"}),v.jsx(M,{children:"Please try again later or contact support if the problem persists."})]});const r=ve(e,t),n=ye(r),a=e.message||e.graphQLErrors&&((o=e.graphQLErrors[0])==null?void 0:o.message)||"An unknown error occurred",i=()=>{window.location.reload()};return v.jsxs(q,{children:[v.jsx(H,{children:n.title}),v.jsx(M,{children:n.description}),v.jsxs(M,{children:[v.jsx("strong",{children:"Details:"})," ",a]}),v.jsx(he,{children:v.jsx("button",{onClick:i,children:"Refresh the page"})})]})};export{qe as E,ke as G,Pe as M,Te as S,$e as a,_e as b,Ue as c,we as d,Re as e,Ae as f,Me as g,Oe as h,Ge as i,Ie as j,Se as u};
//# sourceMappingURL=ErrorMessage-8a3f2950.js.map
