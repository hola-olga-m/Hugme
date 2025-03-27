import{i as Q,k as g,l as W,n as V,o as C,_ as S,p as Y,q as M,s as H,t as B,v as K,w as x,N as k,x as j,A as D,y as J,D as X,z as d,d as w,j as v}from"./main-e7991d53.js";var I=!1,Z="useSyncExternalStore",ee=V[Z],te=ee||function(e,t,r){var n=t();globalThis.__DEV__!==!1&&!I&&n!==t()&&(I=!0,globalThis.__DEV__!==!1&&Q.error(68));var a=g.useState({inst:{value:n,getSnapshot:t}}),i=a[0].inst,o=a[1];return W?g.useLayoutEffect(function(){Object.assign(i,{value:n,getSnapshot:t}),_(i)&&o({inst:i})},[e,n,t]):Object.assign(i,{value:n,getSnapshot:t}),g.useEffect(function(){return _(i)&&o({inst:i}),e(function(){_(i)&&o({inst:i})})},[e]),n};function _(e){var t=e.value,r=e.getSnapshot;try{return t!==r()}catch{return!0}}var re=Symbol.for("apollo.hook.wrappers");function ne(e,t,r){var n=r.queryManager,a=n&&n[re],i=a&&a[e];return i?i(t):t}var ae=Object.prototype.hasOwnProperty;function O(){}var A=Symbol();function Se(e,t){return t===void 0&&(t=Object.create(null)),ne("useQuery",ie,C(t&&t.client))(e,t)}function ie(e,t){var r=oe(e,t),n=r.result,a=r.obsQueryFields;return g.useMemo(function(){return S(S({},n),a)},[n,a])}function se(e,t,r,n,a){function i(c){var l;J(t,X.Query);var p={client:e,query:t,observable:n&&n.getSSRObservable(a())||e.watchQuery(N(void 0,e,r,a())),resultData:{previousData:(l=c==null?void 0:c.resultData.current)===null||l===void 0?void 0:l.data}};return p}var o=g.useState(i),s=o[0],u=o[1];function f(c){var l,p;Object.assign(s.observable,(l={},l[A]=c,l));var h=s.resultData;u(S(S({},s),{query:c.query,resultData:Object.assign(h,{previousData:((p=h.current)===null||p===void 0?void 0:p.data)||h.previousData,current:void 0})}))}if(e!==s.client||t!==s.query){var y=i(s);return u(y),[y,f]}return[s,f]}function oe(e,t){var r=C(t.client),n=g.useContext(Y()).renderPromises,a=!!n,i=r.disableNetworkFetches,o=t.ssr!==!1&&!t.skip,s=t.partialRefetch,u=le(r,e,t,a),f=se(r,e,t,n,u),y=f[0],c=y.observable,l=y.resultData,p=f[1],h=u(c);ce(l,c,r,t,h);var R=g.useMemo(function(){return pe(c)},[c]);de(c,n,o);var $=ue(l,c,r,t,h,i,s,a,{onCompleted:t.onCompleted||O,onError:t.onError||O});return{result:$,obsQueryFields:R,observable:c,resultData:l,client:r,onQueryExecuted:p}}function ue(e,t,r,n,a,i,o,s,u){var f=g.useRef(u);g.useEffect(function(){f.current=u});var y=(s||i)&&n.ssr===!1&&!n.skip?L:n.skip||a.fetchPolicy==="standby"?z:void 0,c=e.previousData,l=g.useMemo(function(){return y&&F(y,c,t,r)},[r,t,y,c]);return te(g.useCallback(function(p){if(s)return function(){};var h=function(){var E=e.current,m=t.getCurrentResult();E&&E.loading===m.loading&&E.networkStatus===m.networkStatus&&M(E.data,m.data)||P(m,e,t,r,o,p,f.current)},R=function(E){if($.current.unsubscribe(),$.current=t.resubscribeAfterError(h,R),!ae.call(E,"graphQLErrors"))throw E;var m=e.current;(!m||m&&m.loading||!M(E,m.error))&&P({data:m&&m.data,error:E,loading:!1,networkStatus:k.error},e,t,r,o,p,f.current)},$={current:t.subscribe(h,R)};return function(){setTimeout(function(){return $.current.unsubscribe()})}},[i,s,t,e,o,r]),function(){return l||U(e,t,f.current,o,r)},function(){return l||U(e,t,f.current,o,r)})}function de(e,t,r){t&&r&&(t.registerSSRObservable(e),e.getCurrentResult().loading&&t.addObservableQueryPromise(e))}function ce(e,t,r,n,a){var i;t[A]&&!M(t[A],a)&&(t.reobserve(N(t,r,n,a)),e.previousData=((i=e.current)===null||i===void 0?void 0:i.data)||e.previousData,e.current=void 0),t[A]=a}function le(e,t,r,n){r===void 0&&(r={});var a=r.skip;r.ssr,r.onCompleted,r.onError;var i=r.defaultOptions,o=H(r,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(s){var u=Object.assign(o,{query:t});return n&&(u.fetchPolicy==="network-only"||u.fetchPolicy==="cache-and-network")&&(u.fetchPolicy="cache-first"),u.variables||(u.variables={}),a?(u.initialFetchPolicy=u.initialFetchPolicy||u.fetchPolicy||q(i,e.defaultOptions),u.fetchPolicy="standby"):u.fetchPolicy||(u.fetchPolicy=(s==null?void 0:s.options.initialFetchPolicy)||q(i,e.defaultOptions)),u}}function N(e,t,r,n){var a=[],i=t.defaultOptions.watchQuery;return i&&a.push(i),r.defaultOptions&&a.push(r.defaultOptions),a.push(B(e&&e.options,n)),a.reduce(K)}function P(e,t,r,n,a,i,o){var s=t.current;s&&s.data&&(t.previousData=s.data),!e.error&&j(e.errors)&&(e.error=new D({graphQLErrors:e.errors})),t.current=F(ge(e,r,a),t.previousData,r,n),i(),fe(e,s==null?void 0:s.networkStatus,o)}function fe(e,t,r){if(!e.loading){var n=me(e);Promise.resolve().then(function(){n?r.onError(n):e.data&&t!==e.networkStatus&&e.networkStatus===k.ready&&r.onCompleted(e.data)}).catch(function(a){globalThis.__DEV__!==!1&&Q.warn(a)})}}function U(e,t,r,n,a){return e.current||P(t.getCurrentResult(),e,t,a,n,function(){},r),e.current}function q(e,t){var r;return(e==null?void 0:e.fetchPolicy)||((r=t==null?void 0:t.watchQuery)===null||r===void 0?void 0:r.fetchPolicy)||"cache-first"}function me(e){return j(e.errors)?new D({graphQLErrors:e.errors}):e.error}function F(e,t,r,n){var a=e.data;e.partial;var i=H(e,["data","partial"]),o=S(S({data:a},i),{client:n,observable:r,variables:r.variables,called:e!==L&&e!==z,previousData:t});return o}function ge(e,t,r){return e.partial&&r&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&t.options.fetchPolicy!=="cache-only"?(t.refetch(),S(S({},e),{loading:!0,networkStatus:k.refetch})):e}var L=x({loading:!0,data:void 0,error:void 0,networkStatus:k.loading}),z=x({loading:!1,data:void 0,error:void 0,networkStatus:k.ready});function pe(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}d`
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
`;d`
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
`;d`
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
`;d`
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
`;const $e=d`
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
`,ke=d`
  query GetMoodStreak {
    moodStreak
  }
`,Re=d`
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
`,Ae=d`
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
`;d`
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
`;const we=d`
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
`,_e=d`
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
`;d`
  mutation SendHug($input: HugInput!) {
    sendHug(input: $input) {
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
`;d`
  mutation MarkHugAsRead($id: ID!) {
    markHugAsRead(id: $id) {
      id
      isRead
    }
  }
`;d`
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
`;const Te=d`
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
`;d`
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
`;const Me=d`
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
`,Pe=d`
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
`,Ie=d`
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
`;d`
  mutation CreateHugRequest($input: HugRequestInput!) {
    createHugRequest(input: $input) {
      id
      message
      type
      status
      createdAt
    }
  }
`;d`
  mutation RespondToHugRequest($id: ID!, $accept: Boolean!) {
    respondToHugRequest(id: $id, accept: $accept) {
      id
      status
      updatedAt
    }
  }
`;const ve=(e,t={})=>{var n;const r=((n=e==null?void 0:e.message)==null?void 0:n.toLowerCase())||"";return r.includes("unauthorized")||r.includes("unauthenticated")||r.includes("auth")||r.includes("login")||r.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":r.includes("network")||r.includes("connection")||r.includes("offline")||r.includes("failed to fetch")||e.name==="NetworkError"||t.isNetworkError?"network":r.includes("not found")||r.includes("404")||r.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||t.isRouteError?"route":r.includes("validation")||r.includes("invalid")||r.includes("data")||r.includes("database")||r.includes("constraint")||t.isDataError?"data":"general"},ye=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},G=w.div`
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger-color);
  color: var(--danger-dark);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
`,b=w.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`,T=w.p`
  margin: 0;
  font-size: 0.9rem;
`,he=w.div`
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
`,Oe=({error:e,context:t={}})=>{var o;if(!e)return v.jsxs(G,{children:[v.jsx(b,{children:"An unknown error occurred"}),v.jsx(T,{children:"Please try again later or contact support if the problem persists."})]});const r=ve(e,t),n=ye(r),a=e.message||e.graphQLErrors&&((o=e.graphQLErrors[0])==null?void 0:o.message)||"An unknown error occurred",i=()=>{window.location.reload()};return v.jsxs(G,{children:[v.jsx(b,{children:n.title}),v.jsx(T,{children:n.description}),v.jsxs(T,{children:[v.jsx("strong",{children:"Details:"})," ",a]}),v.jsx(he,{children:v.jsx("button",{onClick:i,children:"Refresh the page"})})]})};export{Oe as E,Ae as G,$e as a,we as b,Re as c,ke as d,Te as e,_e as f,Me as g,Pe as h,Ie as i,Se as u};
//# sourceMappingURL=ErrorMessage-2faaaf6f.js.map
