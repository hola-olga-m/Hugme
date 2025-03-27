import{i as x,k as g,l as W,n as V,o as j,_ as S,p as Y,q as A,s as G,t as K,v as B,w as H,N as w,x as I,A as N,y as J,D as X,z as c,d as q,j as p}from"./main-fa093eb4.js";var Q=!1,Z="useSyncExternalStore",ee=V[Z],re=ee||function(e,r,t){var n=r();globalThis.__DEV__!==!1&&!Q&&n!==r()&&(Q=!0,globalThis.__DEV__!==!1&&x.error(68));var a=g.useState({inst:{value:n,getSnapshot:r}}),i=a[0].inst,u=a[1];return W?g.useLayoutEffect(function(){Object.assign(i,{value:n,getSnapshot:r}),O(i)&&u({inst:i})},[e,n,r]):Object.assign(i,{value:n,getSnapshot:r}),g.useEffect(function(){return O(i)&&u({inst:i}),e(function(){O(i)&&u({inst:i})})},[e]),n};function O(e){var r=e.value,t=e.getSnapshot;try{return r!==t()}catch{return!0}}var te=Symbol.for("apollo.hook.wrappers");function ne(e,r,t){var n=t.queryManager,a=n&&n[te],i=a&&a[e];return i?i(r):r}var ae=Object.prototype.hasOwnProperty;function T(){}var _=Symbol();function Se(e,r){return r===void 0&&(r=Object.create(null)),ne("useQuery",ie,j(r&&r.client))(e,r)}function ie(e,r){var t=ue(e,r),n=t.result,a=t.obsQueryFields;return g.useMemo(function(){return S(S({},n),a)},[n,a])}function se(e,r,t,n,a){function i(d){var l;J(r,X.Query);var m={client:e,query:r,observable:n&&n.getSSRObservable(a())||e.watchQuery(F(void 0,e,t,a())),resultData:{previousData:(l=d==null?void 0:d.resultData.current)===null||l===void 0?void 0:l.data}};return m}var u=g.useState(i),s=u[0],o=u[1];function f(d){var l,m;Object.assign(s.observable,(l={},l[_]=d,l));var h=s.resultData;o(S(S({},s),{query:d.query,resultData:Object.assign(h,{previousData:((m=h.current)===null||m===void 0?void 0:m.data)||h.previousData,current:void 0})}))}if(e!==s.client||r!==s.query){var y=i(s);return o(y),[y,f]}return[s,f]}function ue(e,r){var t=j(r.client),n=g.useContext(Y()).renderPromises,a=!!n,i=t.disableNetworkFetches,u=r.ssr!==!1&&!r.skip,s=r.partialRefetch,o=le(t,e,r,a),f=se(t,e,r,n,o),y=f[0],d=y.observable,l=y.resultData,m=f[1],h=o(d);ce(l,d,t,r,h);var R=g.useMemo(function(){return me(d)},[d]);de(d,n,u);var k=oe(l,d,t,r,h,i,s,a,{onCompleted:r.onCompleted||T,onError:r.onError||T});return{result:k,obsQueryFields:R,observable:d,resultData:l,client:t,onQueryExecuted:m}}function oe(e,r,t,n,a,i,u,s,o){var f=g.useRef(o);g.useEffect(function(){f.current=o});var y=(s||i)&&n.ssr===!1&&!n.skip?$:n.skip||a.fetchPolicy==="standby"?z:void 0,d=e.previousData,l=g.useMemo(function(){return y&&L(y,d,r,t)},[t,r,y,d]);return re(g.useCallback(function(m){if(s)return function(){};var h=function(){var E=e.current,v=r.getCurrentResult();E&&E.loading===v.loading&&E.networkStatus===v.networkStatus&&A(E.data,v.data)||b(v,e,r,t,u,m,f.current)},R=function(E){if(k.current.unsubscribe(),k.current=r.resubscribeAfterError(h,R),!ae.call(E,"graphQLErrors"))throw E;var v=e.current;(!v||v&&v.loading||!A(E,v.error))&&b({data:v&&v.data,error:E,loading:!1,networkStatus:w.error},e,r,t,u,m,f.current)},k={current:r.subscribe(h,R)};return function(){setTimeout(function(){return k.current.unsubscribe()})}},[i,s,r,e,u,t]),function(){return l||C(e,r,f.current,u,t)},function(){return l||C(e,r,f.current,u,t)})}function de(e,r,t){r&&t&&(r.registerSSRObservable(e),e.getCurrentResult().loading&&r.addObservableQueryPromise(e))}function ce(e,r,t,n,a){var i;r[_]&&!A(r[_],a)&&(r.reobserve(F(r,t,n,a)),e.previousData=((i=e.current)===null||i===void 0?void 0:i.data)||e.previousData,e.current=void 0),r[_]=a}function le(e,r,t,n){t===void 0&&(t={});var a=t.skip;t.ssr,t.onCompleted,t.onError;var i=t.defaultOptions,u=G(t,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(s){var o=Object.assign(u,{query:r});return n&&(o.fetchPolicy==="network-only"||o.fetchPolicy==="cache-and-network")&&(o.fetchPolicy="cache-first"),o.variables||(o.variables={}),a?(o.initialFetchPolicy=o.initialFetchPolicy||o.fetchPolicy||U(i,e.defaultOptions),o.fetchPolicy="standby"):o.fetchPolicy||(o.fetchPolicy=(s==null?void 0:s.options.initialFetchPolicy)||U(i,e.defaultOptions)),o}}function F(e,r,t,n){var a=[],i=r.defaultOptions.watchQuery;return i&&a.push(i),t.defaultOptions&&a.push(t.defaultOptions),a.push(K(e&&e.options,n)),a.reduce(B)}function b(e,r,t,n,a,i,u){var s=r.current;s&&s.data&&(r.previousData=s.data),!e.error&&I(e.errors)&&(e.error=new N({graphQLErrors:e.errors})),r.current=L(ge(e,t,a),r.previousData,t,n),i(),fe(e,s==null?void 0:s.networkStatus,u)}function fe(e,r,t){if(!e.loading){var n=ve(e);Promise.resolve().then(function(){n?t.onError(n):e.data&&r!==e.networkStatus&&e.networkStatus===w.ready&&t.onCompleted(e.data)}).catch(function(a){globalThis.__DEV__!==!1&&x.warn(a)})}}function C(e,r,t,n,a){return e.current||b(r.getCurrentResult(),e,r,a,n,function(){},t),e.current}function U(e,r){var t;return(e==null?void 0:e.fetchPolicy)||((t=r==null?void 0:r.watchQuery)===null||t===void 0?void 0:t.fetchPolicy)||"cache-first"}function ve(e){return I(e.errors)?new N({graphQLErrors:e.errors}):e.error}function L(e,r,t,n){var a=e.data;e.partial;var i=G(e,["data","partial"]),u=S(S({data:a},i),{client:n,observable:t,variables:t.variables,called:e!==$&&e!==z,previousData:r});return u}function ge(e,r,t){return e.partial&&t&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&r.options.fetchPolicy!=="cache-only"?(r.refetch(),S(S({},e),{loading:!0,networkStatus:w.refetch})):e}var $=H({loading:!0,data:void 0,error:void 0,networkStatus:w.loading}),z=H({loading:!1,data:void 0,error:void 0,networkStatus:w.ready});function me(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}c`
  query me {
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
`;c`
  query user($id: ID!) {
    user(id: $id) {
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
`;const ke=c`
  query users {
    users {
      id
      username
      name
      avatarUrl
      isAnonymous
    }
  }
`,we=c`
  query userMoods {
    userMoods {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`,Re=c`
  query publicMoods {
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
`;c`
  query mood($id: ID!) {
    mood(id: $id) {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;const _e=c`
  query moodStreak {
    moodStreak
  }
`,qe=c`
  query sentHugs {
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
`,Oe=c`
  query receivedHugs {
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
`;c`
  query hug($id: ID!) {
    hug(id: $id) {
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
`;const Pe=c`
  query myHugRequests {
    myHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      respondedAt
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`,Ae=c`
  query pendingHugRequests {
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
`,be=c`
  query communityHugRequests {
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
`;c`
  query hugRequest($id: ID!) {
    hugRequest(id: $id) {
      id
      message
      isCommunityRequest
      status
      createdAt
      respondedAt
      requester {
        id
        username
        name
        avatarUrl
      }
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;c`
  query userStats {
    me {
      id
      receivedHugs {
        id
      }
      sentHugs {
        id
      }
    }
    moodStreak
  }
`;const pe=(e,r={})=>{var n;const t=((n=e==null?void 0:e.message)==null?void 0:n.toLowerCase())||"";return t.includes("unauthorized")||t.includes("unauthenticated")||t.includes("auth")||t.includes("login")||t.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":t.includes("network")||t.includes("connection")||t.includes("offline")||t.includes("failed to fetch")||e.name==="NetworkError"||r.isNetworkError?"network":t.includes("not found")||t.includes("404")||t.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||r.isRouteError?"route":t.includes("validation")||t.includes("invalid")||t.includes("data")||t.includes("database")||t.includes("constraint")||r.isDataError?"data":"general"},ye=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},M=q.div`
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger-color);
  color: var(--danger-dark);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
`,D=q.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`,P=q.p`
  margin: 0;
  font-size: 0.9rem;
`,he=q.div`
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
`,Qe=({error:e,context:r={}})=>{var u;if(!e)return p.jsxs(M,{children:[p.jsx(D,{children:"An unknown error occurred"}),p.jsx(P,{children:"Please try again later or contact support if the problem persists."})]});const t=pe(e,r),n=ye(t),a=e.message||e.graphQLErrors&&((u=e.graphQLErrors[0])==null?void 0:u.message)||"An unknown error occurred",i=()=>{window.location.reload()};return p.jsxs(M,{children:[p.jsx(D,{children:n.title}),p.jsx(P,{children:n.description}),p.jsxs(P,{children:[p.jsx("strong",{children:"Details:"})," ",a]}),p.jsx(he,{children:p.jsx("button",{onClick:i,children:"Refresh the page"})})]})};export{Qe as E,Re as G,we as a,_e as b,ke as c,qe as d,Oe as e,Pe as f,Ae as g,be as h,Se as u};
//# sourceMappingURL=ErrorMessage-09b4e1e5.js.map
