import{i as I,c as v,e as Y,R as K,f as N,_ as j,g as J,h as P,k as U,l as X,m as Z,n as F,N as k,o as z,A as $,v as ee,D as re,p as h,q as te,d as s,j as a,u as ae,r as M,a as ne,L as oe}from"./main-33aa0690.js";var D=!1,ie="useSyncExternalStore",se=K[ie],de=se||function(e,r,t){var n=r();globalThis.__DEV__!==!1&&!D&&n!==r()&&(D=!0,globalThis.__DEV__!==!1&&I.error(68));var o=v.useState({inst:{value:n,getSnapshot:r}}),i=o[0].inst,c=o[1];return Y?v.useLayoutEffect(function(){Object.assign(i,{value:n,getSnapshot:r}),R(i)&&c({inst:i})},[e,n,r]):Object.assign(i,{value:n,getSnapshot:r}),v.useEffect(function(){return R(i)&&c({inst:i}),e(function(){R(i)&&c({inst:i})})},[e]),n};function R(e){var r=e.value,t=e.getSnapshot;try{return r!==t()}catch{return!0}}var ce=Symbol.for("apollo.hook.wrappers");function ue(e,r,t){var n=t.queryManager,o=n&&n[ce],i=o&&o[e];return i?i(r):r}var le=Object.prototype.hasOwnProperty;function O(){}var C=Symbol();function me(e,r){return r===void 0&&(r=Object.create(null)),ue("useQuery",he,N(r&&r.client))(e,r)}function he(e,r){var t=pe(e,r),n=t.result,o=t.obsQueryFields;return v.useMemo(function(){return j(j({},n),o)},[n,o])}function ge(e,r,t,n,o){function i(l){var g;ee(r,re.Query);var y={client:e,query:r,observable:n&&n.getSSRObservable(o())||e.watchQuery(W(void 0,e,t,o())),resultData:{previousData:(g=l==null?void 0:l.resultData.current)===null||g===void 0?void 0:g.data}};return y}var c=v.useState(i),d=c[0],u=c[1];function p(l){var g,y;Object.assign(d.observable,(g={},g[C]=l,g));var x=d.resultData;u(j(j({},d),{query:l.query,resultData:Object.assign(x,{previousData:((y=x.current)===null||y===void 0?void 0:y.data)||x.previousData,current:void 0})}))}if(e!==d.client||r!==d.query){var m=i(d);return u(m),[m,p]}return[d,p]}function pe(e,r){var t=N(r.client),n=v.useContext(J()).renderPromises,o=!!n,i=t.disableNetworkFetches,c=r.ssr!==!1&&!r.skip,d=r.partialRefetch,u=xe(t,e,r,o),p=ge(t,e,r,n,u),m=p[0],l=m.observable,g=m.resultData,y=p[1],x=u(l);ye(g,l,t,r,x);var S=v.useMemo(function(){return ke(l)},[l]);ve(l,n,c);var w=fe(g,l,t,r,x,i,d,o,{onCompleted:r.onCompleted||O,onError:r.onError||O});return{result:w,obsQueryFields:S,observable:l,resultData:g,client:t,onQueryExecuted:y}}function fe(e,r,t,n,o,i,c,d,u){var p=v.useRef(u);v.useEffect(function(){p.current=u});var m=(d||i)&&n.ssr===!1&&!n.skip?B:n.skip||o.fetchPolicy==="standby"?G:void 0,l=e.previousData,g=v.useMemo(function(){return m&&V(m,l,r,t)},[t,r,m,l]);return de(v.useCallback(function(y){if(d)return function(){};var x=function(){var b=e.current,f=r.getCurrentResult();b&&b.loading===f.loading&&b.networkStatus===f.networkStatus&&P(b.data,f.data)||A(f,e,r,t,c,y,p.current)},S=function(b){if(w.current.unsubscribe(),w.current=r.resubscribeAfterError(x,S),!le.call(b,"graphQLErrors"))throw b;var f=e.current;(!f||f&&f.loading||!P(b,f.error))&&A({data:f&&f.data,error:b,loading:!1,networkStatus:k.error},e,r,t,c,y,p.current)},w={current:r.subscribe(x,S)};return function(){setTimeout(function(){return w.current.unsubscribe()})}},[i,d,r,e,c,t]),function(){return g||T(e,r,p.current,c,t)},function(){return g||T(e,r,p.current,c,t)})}function ve(e,r,t){r&&t&&(r.registerSSRObservable(e),e.getCurrentResult().loading&&r.addObservableQueryPromise(e))}function ye(e,r,t,n,o){var i;r[C]&&!P(r[C],o)&&(r.reobserve(W(r,t,n,o)),e.previousData=((i=e.current)===null||i===void 0?void 0:i.data)||e.previousData,e.current=void 0),r[C]=o}function xe(e,r,t,n){t===void 0&&(t={});var o=t.skip;t.ssr,t.onCompleted,t.onError;var i=t.defaultOptions,c=U(t,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(d){var u=Object.assign(c,{query:r});return n&&(u.fetchPolicy==="network-only"||u.fetchPolicy==="cache-and-network")&&(u.fetchPolicy="cache-first"),u.variables||(u.variables={}),o?(u.initialFetchPolicy=u.initialFetchPolicy||u.fetchPolicy||L(i,e.defaultOptions),u.fetchPolicy="standby"):u.fetchPolicy||(u.fetchPolicy=(d==null?void 0:d.options.initialFetchPolicy)||L(i,e.defaultOptions)),u}}function W(e,r,t,n){var o=[],i=r.defaultOptions.watchQuery;return i&&o.push(i),t.defaultOptions&&o.push(t.defaultOptions),o.push(X(e&&e.options,n)),o.reduce(Z)}function A(e,r,t,n,o,i,c){var d=r.current;d&&d.data&&(r.previousData=d.data),!e.error&&z(e.errors)&&(e.error=new $({graphQLErrors:e.errors})),r.current=V(we(e,t,o),r.previousData,t,n),i(),be(e,d==null?void 0:d.networkStatus,c)}function be(e,r,t){if(!e.loading){var n=je(e);Promise.resolve().then(function(){n?t.onError(n):e.data&&r!==e.networkStatus&&e.networkStatus===k.ready&&t.onCompleted(e.data)}).catch(function(o){globalThis.__DEV__!==!1&&I.warn(o)})}}function T(e,r,t,n,o){return e.current||A(r.getCurrentResult(),e,r,o,n,function(){},t),e.current}function L(e,r){var t;return(e==null?void 0:e.fetchPolicy)||((t=r==null?void 0:r.watchQuery)===null||t===void 0?void 0:t.fetchPolicy)||"cache-first"}function je(e){return z(e.errors)?new $({graphQLErrors:e.errors}):e.error}function V(e,r,t,n){var o=e.data;e.partial;var i=U(e,["data","partial"]),c=j(j({data:o},i),{client:n,observable:t,variables:t.variables,called:e!==B&&e!==G,previousData:r});return c}function we(e,r,t){return e.partial&&t&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&r.options.fetchPolicy!=="cache-only"?(r.refetch(),j(j({},e),{loading:!0,networkStatus:k.refetch})):e}var B=F({loading:!0,data:void 0,error:void 0,networkStatus:k.loading}),G=F({loading:!1,data:void 0,error:void 0,networkStatus:k.ready});function ke(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}h`
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
`;h`
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
`;h`
  query users {
    users {
      id
      username
      name
      avatarUrl
      isAnonymous
    }
  }
`;h`
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
`;const Se=h`
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
`;h`
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
`;h`
  query moodStreak {
    moodStreak
  }
`;h`
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
`;h`
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
`;h`
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
`;h`
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
`;h`
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
`;h`
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
`;h`
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
`;h`
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
`;const Ee=te`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,Ce=s.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`,Me=s.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${Ee} 1s linear infinite;
  margin-bottom: 1rem;
`,Re=s.p`
  color: var(--gray-600);
  font-size: 0.9rem;
`,qe=({text:e="Loading..."})=>a.jsxs(Ce,{children:[a.jsx(Me,{}),a.jsx(Re,{children:e})]}),Pe=(e,r={})=>{var n;const t=((n=e==null?void 0:e.message)==null?void 0:n.toLowerCase())||"";return t.includes("unauthorized")||t.includes("unauthenticated")||t.includes("auth")||t.includes("login")||t.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":t.includes("network")||t.includes("connection")||t.includes("offline")||t.includes("failed to fetch")||e.name==="NetworkError"||r.isNetworkError?"network":t.includes("not found")||t.includes("404")||t.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||r.isRouteError?"route":t.includes("validation")||t.includes("invalid")||t.includes("data")||t.includes("database")||t.includes("constraint")||r.isDataError?"data":"general"},Ae=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},De=s.div`
  background-color: var(--danger-light);
  border: 1px solid var(--danger-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 1rem 0;
  color: var(--danger-dark);
`,Oe=s.h3`
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`,Te=s.p`
  margin: 0;
  font-size: 0.9rem;
`,Le=s.button`
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 0.85rem;
  
  &:hover {
    background-color: var(--danger-dark);
  }
`,Qe=({error:e,onRetry:r})=>{const t=Pe(e),{title:n,description:o}=Ae(t);return a.jsxs(De,{children:[a.jsx(Oe,{children:n}),a.jsx(Te,{children:o}),r&&a.jsx(Le,{onClick:r,children:"Try Again"})]})},Q=s.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,_=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
`,H=s.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`,_e=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,He=s.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`,Ie=s.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,Ne=s.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .emoji {
    font-size: 1.5rem;
  }
  
  .label {
    font-weight: 500;
    color: var(--gray-800);
  }
`,Ue=s.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,Fe=s.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`,ze=s.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--gray-600);
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.7rem;
    margin-right: 0.5rem;
  }
`,$e=s.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,We=e=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(e)-1,4)],Ve=e=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(e)-1,4)],Be=e=>new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),Ge=e=>e?e.split(" ").map(r=>r[0]).join("").toUpperCase().substring(0,2):"?",Ye=()=>{const{loading:e,error:r,data:t,refetch:n}=me(Se);if(e)return a.jsx(qe,{text:"Loading public moods..."});if(r)return a.jsx(Qe,{error:r});const o=(t==null?void 0:t.publicMoods)||[];return o.length===0?a.jsxs(Q,{children:[a.jsxs(_,{children:[a.jsx("h2",{children:"Community Moods"}),a.jsx(H,{onClick:()=>n(),children:a.jsx("span",{children:"Refresh"})})]}),a.jsxs($e,{children:[a.jsx("p",{children:"No public moods have been shared yet."}),a.jsx("p",{children:"The community mood board will populate as users share their feelings."})]})]}):a.jsxs(Q,{children:[a.jsxs(_,{children:[a.jsx("h2",{children:"Community Moods"}),a.jsx(H,{onClick:()=>n(),children:a.jsx("span",{children:"Refresh"})})]}),a.jsx(_e,{children:o.map(i=>{var c,d;return a.jsxs(He,{children:[a.jsxs(Ie,{children:[a.jsxs(Ne,{children:[a.jsx("span",{className:"emoji",children:We(i.score)}),a.jsx("span",{className:"label",children:Ve(i.score)})]}),a.jsx(Ue,{children:Be(i.createdAt)})]}),i.note&&a.jsx(Fe,{children:i.note}),a.jsxs(ze,{children:[a.jsx("div",{className:"avatar",children:Ge((c=i.user)==null?void 0:c.name)}),a.jsx("span",{children:((d=i.user)==null?void 0:d.name)||"Anonymous User"})]})]},i.id)})})]})},Ke=s.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,Je=s.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,Xe=s.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
`,Ze=s.div`
  display: flex;
  align-items: center;
`,er=s.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
`,rr=s.span`
  font-weight: 500;
  margin-right: 1rem;
`,tr=s.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`,ar=s.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,nr=s.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  
  h1 {
    margin-bottom: 1rem;
    color: var(--gray-800);
  }
  
  p {
    color: var(--gray-600);
    margin-bottom: 1.5rem;
  }
`,or=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`,q=s.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--gray-600);
  }
`,ir=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`,E=s.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  text-align: center;
  
  h3 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-600);
    font-size: 0.9rem;
  }
`,dr=()=>{const{currentUser:e,logout:r}=ae(),[t,n]=M.useState(!0),[o,i]=M.useState({moodStreak:0,totalMoods:0,hugsSent:0,hugsReceived:0}),c=ne();M.useEffect(()=>{const m=localStorage.getItem("redirectToDashboard")==="true";m&&(console.log("Dashboard detected redirect flag from login"),localStorage.removeItem("redirectToDashboard"));const l=setTimeout(()=>{i({moodStreak:3,totalMoods:15,hugsSent:7,hugsReceived:12}),n(!1),m&&console.log("Dashboard fully loaded after login redirect")},1e3);return()=>clearTimeout(l)},[]);const d=async()=>{await r(),c("/login")},u=m=>{c(m)},p=m=>m?m.split(" ").map(l=>l[0]).join("").toUpperCase().substring(0,2):"?";return t?a.jsx(oe,{text:"Loading dashboard..."}):a.jsxs(Ke,{children:[a.jsxs(Je,{children:[a.jsx(Xe,{children:"HugMeNow"}),a.jsxs(Ze,{children:[a.jsx(er,{children:p(e==null?void 0:e.name)}),a.jsx(rr,{children:(e==null?void 0:e.name)||"Guest"}),a.jsx(tr,{onClick:d,children:"Logout"})]})]}),a.jsxs(ar,{children:[a.jsxs(nr,{children:[a.jsxs("h1",{children:["Welcome, ",(e==null?void 0:e.name)||"Friend","!"]}),a.jsx("p",{children:"This is your personal dashboard where you can track your mood, send and receive virtual hugs, and connect with others."})]}),a.jsxs(ir,{children:[a.jsxs(E,{children:[a.jsx("h3",{children:o.moodStreak}),a.jsx("p",{children:"Day Streak"})]}),a.jsxs(E,{children:[a.jsx("h3",{children:o.totalMoods}),a.jsx("p",{children:"Moods Tracked"})]}),a.jsxs(E,{children:[a.jsx("h3",{children:o.hugsSent}),a.jsx("p",{children:"Hugs Sent"})]}),a.jsxs(E,{children:[a.jsx("h3",{children:o.hugsReceived}),a.jsx("p",{children:"Hugs Received"})]})]}),a.jsxs(or,{children:[a.jsxs(q,{onClick:()=>u("/mood-tracker"),children:[a.jsx("h2",{children:"Mood Tracker"}),a.jsx("p",{children:"Track your daily mood and see patterns in your emotional wellbeing over time."})]}),a.jsxs(q,{onClick:()=>u("/hug-center"),children:[a.jsx("h2",{children:"Hug Center"}),a.jsx("p",{children:"Send virtual hugs to friends or request hugs from the community when you need support."})]}),a.jsxs(q,{onClick:()=>u("/profile"),children:[a.jsx("h2",{children:"Profile"}),a.jsx("p",{children:"Manage your personal information, preferences, and privacy settings."})]})]}),a.jsx("div",{style:{marginTop:"2rem"},children:a.jsx(Ye,{})})]})]})};export{dr as default};
//# sourceMappingURL=Dashboard-f1491abe.js.map
