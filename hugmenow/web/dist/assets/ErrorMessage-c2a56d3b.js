import{d as r,j as t}from"./main-f424badd.js";const g=(e,s={})=>{var i;const n=((i=e==null?void 0:e.message)==null?void 0:i.toLowerCase())||"";return n.includes("unauthorized")||n.includes("unauthenticated")||n.includes("auth")||n.includes("login")||n.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":n.includes("network")||n.includes("connection")||n.includes("offline")||n.includes("failed to fetch")||e.name==="NetworkError"||s.isNetworkError?"network":n.includes("not found")||n.includes("404")||n.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||s.isRouteError?"route":n.includes("validation")||n.includes("invalid")||n.includes("data")||n.includes("database")||n.includes("constraint")||s.isDataError?"data":"general"},h=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},d=r.div`
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger-color);
  color: var(--danger-dark);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
`,c=r.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`,a=r.p`
  margin: 0;
  font-size: 0.9rem;
`,p=r.div`
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
`,f=({error:e,context:s={}})=>{var o;if(!e)return t.jsxs(d,{children:[t.jsx(c,{children:"An unknown error occurred"}),t.jsx(a,{children:"Please try again later or contact support if the problem persists."})]});const n=g(e,s),i=h(n),l=e.message||e.graphQLErrors&&((o=e.graphQLErrors[0])==null?void 0:o.message)||"An unknown error occurred",u=()=>{window.location.reload()};return t.jsxs(d,{children:[t.jsx(c,{children:i.title}),t.jsx(a,{children:i.description}),t.jsxs(a,{children:[t.jsx("strong",{children:"Details:"})," ",l]}),t.jsx(p,{children:t.jsx("button",{onClick:u,children:"Refresh the page"})})]})};export{f as E};
//# sourceMappingURL=ErrorMessage-c2a56d3b.js.map
