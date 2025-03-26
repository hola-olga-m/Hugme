import{d as a,u as Pe,a as $e,r as i,c as g,j as e,L as ze,S as Fe,M as Oe,e as Ye,f as Qe,g as Ve}from"./main-8ecaca0c.js";import{u as m,E as Je,c as Be,d as We,e as Ke,f as Xe,g as Ze,h as es}from"./ErrorMessage-72125ac1.js";const ss=a.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,rs=a.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,as=a.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`,ns=a.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,ts=a.h1`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
`,is=a.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--gray-300);
`,l=a.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${r=>r.active?"var(--primary-color)":"transparent"};
  font-weight: ${r=>r.active?"500":"normal"};
  color: ${r=>r.active?"var(--primary-color)":"var(--gray-600)"};
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--primary-color);
  }
`,me=a.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,h=a.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--gray-700);
  }
`,ge=a.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`,he=a.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`,os=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`,ds=a.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid ${r=>r.selected?"var(--primary-color)":"var(--gray-200)"};
  border-radius: var(--border-radius);
  background-color: ${r=>r.selected?"var(--primary-light)":"white"};
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    border-color: var(--primary-color);
  }
  
  .emoji {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-weight: ${r=>r.selected?"500":"normal"};
    color: ${r=>r.selected?"var(--primary-color)":"var(--gray-700)"};
  }
`,xe=a.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`,ve=a.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`,pe=a.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${r=>r.unread?"var(--primary-color)":"transparent"};
`,je=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,x=a.div`
  display: flex;
  align-items: center;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 0.75rem;
  }
  
  .name {
    font-weight: 500;
    color: var(--gray-800);
  }
  
  .username {
    font-size: 0.8rem;
    color: var(--gray-500);
  }
`,v=a.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,ye=a.div`
  margin-bottom: 1rem;
  
  .hug-type {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    
    .emoji {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }
    
    .type {
      font-weight: 500;
      color: var(--primary-color);
    }
  }
  
  .message {
    color: var(--gray-700);
    line-height: 1.5;
  }
`,be=a.div`
  display: flex;
  justify-content: flex-end;
  
  button {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 0.9rem;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`,U=a.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`,_=a.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${r=>r.status==="PENDING"?"var(--warning-color)":r.status==="ACCEPTED"?"var(--success-color)":r.status==="REJECTED"?"var(--danger-color)":r.status==="CANCELLED"?"var(--gray-500)":"transparent"};
`,G=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,P=a.div`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  
  background-color: ${r=>r.status==="PENDING"?"var(--warning-light)":r.status==="ACCEPTED"?"var(--success-light)":r.status==="REJECTED"?"var(--danger-light)":r.status==="CANCELLED"?"var(--gray-200)":"transparent"};
  
  color: ${r=>r.status==="PENDING"?"var(--warning-color)":r.status==="ACCEPTED"?"var(--success-color)":r.status==="REJECTED"?"var(--danger-color)":(r.status==="CANCELLED","var(--gray-700)")};
`,$=a.div`
  margin-bottom: 1rem;
  
  .message {
    color: var(--gray-700);
    line-height: 1.5;
  }
  
  .community-tag {
    display: inline-block;
    background-color: var(--primary-light);
    color: var(--primary-color);
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    margin-top: 0.5rem;
  }
`,f=a.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  
  button {
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    cursor: pointer;
    transition: var(--transition-base);
  }
  
  .accept-btn {
    background-color: var(--success-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--success-dark);
    }
  }
  
  .reject-btn {
    background-color: var(--danger-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--danger-dark);
    }
  }
  
  .cancel-btn {
    background: none;
    border: 1px solid var(--gray-400);
    color: var(--gray-700);
    
    &:hover {
      background-color: var(--gray-100);
    }
  }
`,p=a.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,z=r=>({STANDARD:"🤗",VIRTUAL:"💻",SPECIAL:"✨",ANIMATED:"🎭",CUSTOM:"🎨"})[r]||"🤗",F=r=>({STANDARD:"Standard",VIRTUAL:"Virtual",SPECIAL:"Special",ANIMATED:"Animated",CUSTOM:"Custom"})[r]||"Standard",O=r=>({PENDING:"Pending",ACCEPTED:"Accepted",REJECTED:"Rejected",CANCELLED:"Cancelled"})[r]||"Unknown",j=r=>new Date(r).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),y=r=>r?r.split(" ").map(o=>o[0]).join("").toUpperCase().substring(0,2):"?",ms=()=>{const{currentUser:r}=Pe(),o=$e(),[n,d]=i.useState("send"),[u,b]=i.useState(""),[Y,Q]=i.useState("STANDARD"),[V,J]=i.useState(""),[R,B]=i.useState(""),[c,W]=i.useState(!1),[fe,Re]=i.useState(!0),[K,t]=i.useState(null),{data:C,loading:X,error:E}=m(Be),{data:N,loading:Z,error:H,refetch:Ce}=m(We),{data:S,loading:ee,error:T,refetch:Ee}=m(Ke),{data:w,loading:se,error:A,refetch:re}=m(Xe),{data:q,loading:ae,error:k,refetch:Ne}=m(Ze),{data:D,loading:ne,error:L,refetch:M}=m(es),[He,{loading:Se}]=g(Fe,{onCompleted:()=>{Ce(),De()},onError:s=>{t(s.message)}}),[Te]=g(Oe,{onCompleted:()=>{Ee()},onError:s=>{t(s.message)}}),[we,{loading:Ae}]=g(Ye,{onCompleted:()=>{re(),M(),Le()},onError:s=>{t(s.message)}}),[qe]=g(Qe,{onCompleted:()=>{Ne(),M()},onError:s=>{t(s.message)}}),[ke]=g(Ve,{onCompleted:()=>{re(),M()},onError:s=>{t(s.message)}});i.useEffect(()=>{Re(X||Z||ee||se||ae||ne),E&&t(E.message),H&&t(H.message),T&&t(T.message),A&&t(A.message),k&&t(k.message),L&&t(L.message)},[X,Z,ee,se,ae,ne,E,H,T,A,k,L]);const De=()=>{b(""),Q("STANDARD"),J("")},Le=()=>{b(""),B(""),W(!1)},Me=async s=>{s.preventDefault(),await He({variables:{sendHugInput:{recipientId:u,type:Y,message:V}}})},Ie=async s=>{s.preventDefault(),await we({variables:{createHugRequestInput:{recipientId:c?null:u,message:R,isCommunityRequest:c}}})},Ue=async s=>{await Te({variables:{id:s}})},I=async(s,Ge)=>{await qe({variables:{respondToRequestInput:{requestId:s,accepted:Ge}}})},te=async s=>{window.confirm("Are you sure you want to cancel this request?")&&await ke({variables:{id:s}})},_e=()=>{o("/dashboard")};if(fe)return e.jsx(ze,{text:"Loading hug center..."});const ie=((C==null?void 0:C.users)||[]).filter(s=>s.id!==(r==null?void 0:r.id)),oe=(N==null?void 0:N.sentHugs)||[],de=(S==null?void 0:S.receivedHugs)||[],ce=(w==null?void 0:w.myHugRequests)||[],le=(q==null?void 0:q.pendingHugRequests)||[],ue=(D==null?void 0:D.communityHugRequests)||[];return e.jsxs(ss,{children:[e.jsx(rs,{children:e.jsx(as,{onClick:_e,children:"HugMeNow"})}),e.jsxs(ns,{children:[e.jsx(ts,{children:"Hug Center"}),K&&e.jsx(Je,{error:K}),e.jsxs(is,{children:[e.jsx(l,{active:n==="send",onClick:()=>d("send"),children:"Send a Hug"}),e.jsx(l,{active:n==="received",onClick:()=>d("received"),children:"Received Hugs"}),e.jsx(l,{active:n==="sent",onClick:()=>d("sent"),children:"Sent Hugs"}),e.jsx(l,{active:n==="request",onClick:()=>d("request"),children:"Request a Hug"}),e.jsx(l,{active:n==="myRequests",onClick:()=>d("myRequests"),children:"My Requests"}),e.jsx(l,{active:n==="pendingRequests",onClick:()=>d("pendingRequests"),children:"Pending Requests"}),e.jsx(l,{active:n==="communityRequests",onClick:()=>d("communityRequests"),children:"Community"})]}),n==="send"&&e.jsxs(me,{children:[e.jsx("h2",{children:"Send a Virtual Hug"}),e.jsx("p",{children:"Brighten someone's day with a virtual hug!"}),e.jsxs("form",{onSubmit:Me,children:[e.jsxs(h,{children:[e.jsx("label",{htmlFor:"recipient",children:"Select Recipient"}),e.jsxs(ge,{id:"recipient",value:u,onChange:s=>b(s.target.value),required:!0,children:[e.jsx("option",{value:"",children:"Select a user..."}),ie.map(s=>e.jsxs("option",{value:s.id,children:[s.name," (",s.username,")"]},s.id))]})]}),e.jsxs(h,{children:[e.jsx("label",{children:"Hug Type"}),e.jsx(os,{children:["STANDARD","VIRTUAL","SPECIAL","ANIMATED","CUSTOM"].map(s=>e.jsxs(ds,{type:"button",selected:Y===s,onClick:()=>Q(s),children:[e.jsx("span",{className:"emoji",children:z(s)}),e.jsx("span",{className:"label",children:F(s)})]},s))})]}),e.jsxs(h,{children:[e.jsx("label",{htmlFor:"message",children:"Message (Optional)"}),e.jsx(he,{id:"message",value:V,onChange:s=>J(s.target.value),placeholder:"Add a personal message...",maxLength:500})]}),e.jsx(xe,{type:"submit",disabled:!u||Se,children:"Send Hug"})]})]}),n==="received"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Received Hugs"}),de.length===0?e.jsxs(p,{children:[e.jsx("p",{children:"You haven't received any hugs yet."}),e.jsx("p",{children:"Hugs you receive will appear here."})]}):e.jsx(ve,{children:de.map(s=>e.jsxs(pe,{unread:!s.isRead,children:[e.jsxs(je,{children:[e.jsxs(x,{children:[e.jsx("div",{className:"avatar",children:y(s.sender.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:s.sender.name}),e.jsxs("div",{className:"username",children:["@",s.sender.username]})]})]}),e.jsx(v,{children:j(s.createdAt)})]}),e.jsxs(ye,{children:[e.jsxs("div",{className:"hug-type",children:[e.jsx("span",{className:"emoji",children:z(s.type)}),e.jsxs("span",{className:"type",children:[F(s.type)," Hug"]})]}),s.message&&e.jsx("div",{className:"message",children:s.message})]}),!s.isRead&&e.jsx(be,{children:e.jsx("button",{onClick:()=>Ue(s.id),children:"Mark as Read"})})]},s.id))})]}),n==="sent"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Sent Hugs"}),oe.length===0?e.jsxs(p,{children:[e.jsx("p",{children:"You haven't sent any hugs yet."}),e.jsx("p",{children:'Use the "Send a Hug" tab to send your first hug!'})]}):e.jsx(ve,{children:oe.map(s=>e.jsxs(pe,{children:[e.jsxs(je,{children:[e.jsxs(x,{children:[e.jsx("div",{className:"avatar",children:y(s.recipient.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:s.recipient.name}),e.jsxs("div",{className:"username",children:["@",s.recipient.username]})]})]}),e.jsx(v,{children:j(s.createdAt)})]}),e.jsxs(ye,{children:[e.jsxs("div",{className:"hug-type",children:[e.jsx("span",{className:"emoji",children:z(s.type)}),e.jsxs("span",{className:"type",children:[F(s.type)," Hug"]})]}),s.message&&e.jsx("div",{className:"message",children:s.message})]}),e.jsx(be,{children:e.jsx("span",{children:s.isRead?"Read":"Unread"})})]},s.id))})]}),n==="request"&&e.jsxs(me,{children:[e.jsx("h2",{children:"Request a Hug"}),e.jsx("p",{children:"Need a virtual hug? Request one here!"}),e.jsxs("form",{onSubmit:Ie,children:[e.jsxs(h,{children:[e.jsx("label",{children:"Request Type"}),e.jsx("div",{style:{marginBottom:"1rem"},children:e.jsxs("label",{style:{display:"flex",alignItems:"center"},children:[e.jsx("input",{type:"checkbox",checked:c,onChange:()=>W(!c),style:{marginRight:"0.5rem"}}),"Request from the community"]})}),!c&&e.jsxs(ge,{value:u,onChange:s=>b(s.target.value),required:!c,children:[e.jsx("option",{value:"",children:"Select a specific user..."}),ie.map(s=>e.jsxs("option",{value:s.id,children:[s.name," (",s.username,")"]},s.id))]})]}),e.jsxs(h,{children:[e.jsx("label",{htmlFor:"requestMessage",children:"Your Message"}),e.jsx(he,{id:"requestMessage",value:R,onChange:s=>B(s.target.value),placeholder:"Why do you need a hug today?",maxLength:500,required:!0})]}),e.jsx(xe,{type:"submit",disabled:!c&&!u||!R||Ae,children:"Request Hug"})]})]}),n==="myRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"My Hug Requests"}),ce.length===0?e.jsxs(p,{children:[e.jsx("p",{children:"You haven't created any hug requests yet."}),e.jsx("p",{children:'Use the "Request a Hug" tab to create your first request!'})]}):e.jsx(U,{children:ce.map(s=>e.jsxs(_,{status:s.status,children:[e.jsxs(G,{children:[e.jsx("div",{children:s.recipient?e.jsxs(x,{children:[e.jsx("div",{className:"avatar",children:y(s.recipient.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:s.recipient.name}),e.jsxs("div",{className:"username",children:["@",s.recipient.username]})]})]}):e.jsx("div",{children:"Community Request"})}),e.jsx(P,{status:s.status,children:O(s.status)})]}),e.jsxs($,{children:[e.jsx("div",{className:"message",children:s.message}),s.isCommunityRequest&&e.jsx("div",{className:"community-tag",children:"Community Request"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(v,{children:j(s.createdAt)}),s.status==="PENDING"&&e.jsx(f,{children:e.jsx("button",{className:"cancel-btn",onClick:()=>te(s.id),children:"Cancel Request"})})]})]},s.id))})]}),n==="pendingRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Pending Requests For You"}),le.length===0?e.jsxs(p,{children:[e.jsx("p",{children:"You don't have any pending hug requests."}),e.jsx("p",{children:"When someone requests a hug from you, it will appear here."})]}):e.jsx(U,{children:le.map(s=>e.jsxs(_,{status:s.status,children:[e.jsxs(G,{children:[e.jsxs(x,{children:[e.jsx("div",{className:"avatar",children:y(s.requester.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:s.requester.name}),e.jsxs("div",{className:"username",children:["@",s.requester.username]})]})]}),e.jsx(P,{status:s.status,children:O(s.status)})]}),e.jsx($,{children:e.jsx("div",{className:"message",children:s.message})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(v,{children:j(s.createdAt)}),e.jsxs(f,{children:[e.jsx("button",{className:"accept-btn",onClick:()=>I(s.id,!0),children:"Accept"}),e.jsx("button",{className:"reject-btn",onClick:()=>I(s.id,!1),children:"Decline"})]})]})]},s.id))})]}),n==="communityRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Community Hug Requests"}),ue.length===0?e.jsxs(p,{children:[e.jsx("p",{children:"There are no active community hug requests."}),e.jsx("p",{children:"When someone requests a hug from the community, it will appear here."})]}):e.jsx(U,{children:ue.map(s=>e.jsxs(_,{status:s.status,children:[e.jsxs(G,{children:[e.jsxs(x,{children:[e.jsx("div",{className:"avatar",children:y(s.requester.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:s.requester.name}),e.jsxs("div",{className:"username",children:["@",s.requester.username]})]})]}),e.jsx(P,{status:s.status,children:O(s.status)})]}),e.jsxs($,{children:[e.jsx("div",{className:"message",children:s.message}),e.jsx("div",{className:"community-tag",children:"Community Request"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(v,{children:j(s.createdAt)}),s.status==="PENDING"&&s.requester.id!==(r==null?void 0:r.id)&&e.jsx(f,{children:e.jsx("button",{className:"accept-btn",onClick:()=>I(s.id,!0),children:"Send a Hug"})}),s.status==="PENDING"&&s.requester.id===(r==null?void 0:r.id)&&e.jsx(f,{children:e.jsx("button",{className:"cancel-btn",onClick:()=>te(s.id),children:"Cancel Request"})})]})]},s.id))})]})]})]})};export{ms as default};
//# sourceMappingURL=HugCenter-42e5d213.js.map
