import{k as T,l as y,m as j,n as $,o as C,_ as S,p as x,q as A,s as M,t as L,v as V,w as D,N as _,x as G,A as H,y as W,D as z,z as c}from"./main-47485e27.js";var w=!1,K="useSyncExternalStore",Y=$[K],B=Y||function(e,r,t){var a=r();globalThis.__DEV__!==!1&&!w&&a!==r()&&(w=!0,globalThis.__DEV__!==!1&&T.error(68));var n=y.useState({inst:{value:a,getSnapshot:r}}),u=n[0].inst,o=n[1];return j?y.useLayoutEffect(function(){Object.assign(u,{value:a,getSnapshot:r}),O(u)&&o({inst:u})},[e,a,r]):Object.assign(u,{value:a,getSnapshot:r}),y.useEffect(function(){return O(u)&&o({inst:u}),e(function(){O(u)&&o({inst:u})})},[e]),a};function O(e){var r=e.value,t=e.getSnapshot;try{return r!==t()}catch{return!0}}var J=Symbol.for("apollo.hook.wrappers");function X(e,r,t){var a=t.queryManager,n=a&&a[J],u=n&&n[e];return u?u(r):r}var Z=Object.prototype.hasOwnProperty;function P(){}var q=Symbol();function fe(e,r){return r===void 0&&(r=Object.create(null)),X("useQuery",ee,C(r&&r.client))(e,r)}function ee(e,r){var t=te(e,r),a=t.result,n=t.obsQueryFields;return y.useMemo(function(){return S(S({},a),n)},[a,n])}function re(e,r,t,a,n){function u(d){var l;W(r,z.Query);var m={client:e,query:r,observable:a&&a.getSSRObservable(n())||e.watchQuery(b(void 0,e,t,n())),resultData:{previousData:(l=d==null?void 0:d.resultData.current)===null||l===void 0?void 0:l.data}};return m}var o=y.useState(u),i=o[0],s=o[1];function f(d){var l,m;Object.assign(i.observable,(l={},l[q]=d,l));var g=i.resultData;s(S(S({},i),{query:d.query,resultData:Object.assign(g,{previousData:((m=g.current)===null||m===void 0?void 0:m.data)||g.previousData,current:void 0})}))}if(e!==i.client||r!==i.query){var p=u(i);return s(p),[p,f]}return[i,f]}function te(e,r){var t=C(r.client),a=y.useContext(x()).renderPromises,n=!!a,u=t.disableNetworkFetches,o=r.ssr!==!1&&!r.skip,i=r.partialRefetch,s=ie(t,e,r,n),f=re(t,e,r,a,s),p=f[0],d=p.observable,l=p.resultData,m=f[1],g=s(d);ue(l,d,t,r,g);var R=y.useMemo(function(){return ce(d)},[d]);ne(d,a,o);var E=ae(l,d,t,r,g,u,i,n,{onCompleted:r.onCompleted||P,onError:r.onError||P});return{result:E,obsQueryFields:R,observable:d,resultData:l,client:t,onQueryExecuted:m}}function ae(e,r,t,a,n,u,o,i,s){var f=y.useRef(s);y.useEffect(function(){f.current=s});var p=(i||u)&&a.ssr===!1&&!a.skip?F:a.skip||n.fetchPolicy==="standby"?N:void 0,d=e.previousData,l=y.useMemo(function(){return p&&I(p,d,r,t)},[t,r,p,d]);return B(y.useCallback(function(m){if(i)return function(){};var g=function(){var h=e.current,v=r.getCurrentResult();h&&h.loading===v.loading&&h.networkStatus===v.networkStatus&&A(h.data,v.data)||k(v,e,r,t,o,m,f.current)},R=function(h){if(E.current.unsubscribe(),E.current=r.resubscribeAfterError(g,R),!Z.call(h,"graphQLErrors"))throw h;var v=e.current;(!v||v&&v.loading||!A(h,v.error))&&k({data:v&&v.data,error:h,loading:!1,networkStatus:_.error},e,r,t,o,m,f.current)},E={current:r.subscribe(g,R)};return function(){setTimeout(function(){return E.current.unsubscribe()})}},[u,i,r,e,o,t]),function(){return l||Q(e,r,f.current,o,t)},function(){return l||Q(e,r,f.current,o,t)})}function ne(e,r,t){r&&t&&(r.registerSSRObservable(e),e.getCurrentResult().loading&&r.addObservableQueryPromise(e))}function ue(e,r,t,a,n){var u;r[q]&&!A(r[q],n)&&(r.reobserve(b(r,t,a,n)),e.previousData=((u=e.current)===null||u===void 0?void 0:u.data)||e.previousData,e.current=void 0),r[q]=n}function ie(e,r,t,a){t===void 0&&(t={});var n=t.skip;t.ssr,t.onCompleted,t.onError;var u=t.defaultOptions,o=M(t,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(i){var s=Object.assign(o,{query:r});return a&&(s.fetchPolicy==="network-only"||s.fetchPolicy==="cache-and-network")&&(s.fetchPolicy="cache-first"),s.variables||(s.variables={}),n?(s.initialFetchPolicy=s.initialFetchPolicy||s.fetchPolicy||U(u,e.defaultOptions),s.fetchPolicy="standby"):s.fetchPolicy||(s.fetchPolicy=(i==null?void 0:i.options.initialFetchPolicy)||U(u,e.defaultOptions)),s}}function b(e,r,t,a){var n=[],u=r.defaultOptions.watchQuery;return u&&n.push(u),t.defaultOptions&&n.push(t.defaultOptions),n.push(L(e&&e.options,a)),n.reduce(V)}function k(e,r,t,a,n,u,o){var i=r.current;i&&i.data&&(r.previousData=i.data),!e.error&&G(e.errors)&&(e.error=new H({graphQLErrors:e.errors})),r.current=I(de(e,t,n),r.previousData,t,a),u(),se(e,i==null?void 0:i.networkStatus,o)}function se(e,r,t){if(!e.loading){var a=oe(e);Promise.resolve().then(function(){a?t.onError(a):e.data&&r!==e.networkStatus&&e.networkStatus===_.ready&&t.onCompleted(e.data)}).catch(function(n){globalThis.__DEV__!==!1&&T.warn(n)})}}function Q(e,r,t,a,n){return e.current||k(r.getCurrentResult(),e,r,n,a,function(){},t),e.current}function U(e,r){var t;return(e==null?void 0:e.fetchPolicy)||((t=r==null?void 0:r.watchQuery)===null||t===void 0?void 0:t.fetchPolicy)||"cache-first"}function oe(e){return G(e.errors)?new H({graphQLErrors:e.errors}):e.error}function I(e,r,t,a){var n=e.data;e.partial;var u=M(e,["data","partial"]),o=S(S({data:n},u),{client:a,observable:t,variables:t.variables,called:e!==F&&e!==N,previousData:r});return o}function de(e,r,t){return e.partial&&t&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&r.options.fetchPolicy!=="cache-only"?(r.refetch(),S(S({},e),{loading:!0,networkStatus:_.refetch})):e}var F=D({loading:!0,data:void 0,error:void 0,networkStatus:_.loading}),N=D({loading:!1,data:void 0,error:void 0,networkStatus:_.ready});function ce(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}c`
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
`;const ve=c`
  query users {
    users {
      id
      username
      name
      avatarUrl
      isAnonymous
    }
  }
`,ye=c`
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
`;c`
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
`;const me=c`
  query moodStreak {
    moodStreak
  }
`,pe=c`
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
`,ge=c`
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
`;const he=c`
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
`,Se=c`
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
`,Ee=c`
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
`;export{ye as G,ge as a,Se as b,me as c,ve as d,pe as e,he as f,Ee as g,fe as u};
//# sourceMappingURL=queries-6f5c6dc6.js.map
