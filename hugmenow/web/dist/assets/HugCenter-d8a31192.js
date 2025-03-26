import{d as r,r as h,u as z,a as U,j as e}from"./main-33aa0690.js";const D=r.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,J=r.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,V=r.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`,$=r.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    color: var(--primary-color);
  }
  
  &::before {
    content: '←';
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }
`,G=r.main`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`,L=r.h1`
  color: var(--gray-800);
  margin-bottom: 1.5rem;
`,W=r.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`,Q=r.div`
  margin-bottom: 2rem;
`,Y=r.div`
  display: flex;
  border-bottom: 1px solid var(--gray-300);
  margin-bottom: 2rem;
`,l=r.button`
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-weight: ${o=>o.active?"600":"400"};
  color: ${o=>o.active?"var(--primary-color)":"var(--gray-600)"};
  border-bottom: ${o=>o.active?"2px solid var(--primary-color)":"2px solid transparent"};
  margin-bottom: -1px;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--primary-color);
  }
`,w=r.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,u=r.h2`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`,a=r.div`
  margin-bottom: 1.5rem;
`,s=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-800);
`;r.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`;const m=r.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`,k=r.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`,K=r.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: 0.5rem;
  }
  
  label {
    font-weight: normal;
  }
`,S=r.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: var(--border-radius-md);
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
`,X=r.div`
  background-color: var(--gray-200);
  color: var(--gray-600);
  padding: 2rem;
  text-align: center;
  border-radius: var(--border-radius-md);
`,T=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`,g=r.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${o=>o.received?"var(--secondary-color)":"var(--primary-color)"};
`,p=r.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`,v=r.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${o=>o.received?"var(--secondary-light)":"var(--primary-light)"};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.75rem;
`,x=r.div`
  flex: 1;
  
  .name {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .date {
    font-size: 0.8rem;
    color: var(--gray-600);
  }
`,b=r.div`
  background-color: ${o=>o.received?"var(--secondary-color)":"var(--primary-color)"};
  color: white;
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: var(--border-radius-sm);
  margin-left: 0.5rem;
`,y=r.p`
  color: var(--gray-700);
  font-size: 0.95rem;
  margin-bottom: 1rem;
`;r.div`
  text-align: center;
  padding: 3rem 1rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1.5rem;
  }
`;const _=()=>{const[o,R]=h.useState("sendHug"),[n,j]=h.useState({recipientId:"",hugType:"SUPPORTIVE",message:"",isCommunity:!1}),[d,f]=h.useState(!1);z();const I=U(),H=()=>{I("/dashboard")},c=t=>{R(t)},i=t=>{const{name:E,value:N,type:O,checked:B}=t.target;j({...n,[E]:O==="checkbox"?B:N})},C=t=>{t.preventDefault(),f(!0),console.log("Submitting hug:",n),setTimeout(()=>{j({recipientId:"",hugType:"SUPPORTIVE",message:"",isCommunity:!1}),f(!1),alert("Hug sent successfully!")},1e3)},q=()=>e.jsxs(w,{children:[e.jsx(u,{children:"Send a Virtual Hug"}),e.jsxs("form",{onSubmit:C,children:[e.jsxs(a,{children:[e.jsx(s,{htmlFor:"recipientId",children:"Recipient"}),e.jsxs(m,{id:"recipientId",name:"recipientId",value:n.recipientId,onChange:i,required:!0,children:[e.jsx("option",{value:"",children:"Select a recipient"}),e.jsx("option",{value:"user1",children:"Sarah Johnson"}),e.jsx("option",{value:"user2",children:"Michael Chen"}),e.jsx("option",{value:"user3",children:"Aisha Patel"})]})]}),e.jsxs(a,{children:[e.jsx(s,{htmlFor:"hugType",children:"Hug Type"}),e.jsxs(m,{id:"hugType",name:"hugType",value:n.hugType,onChange:i,required:!0,children:[e.jsx("option",{value:"QUICK",children:"Quick Hug"}),e.jsx("option",{value:"WARM",children:"Warm Hug"}),e.jsx("option",{value:"SUPPORTIVE",children:"Supportive Hug"}),e.jsx("option",{value:"COMFORTING",children:"Comforting Hug"}),e.jsx("option",{value:"ENCOURAGING",children:"Encouraging Hug"}),e.jsx("option",{value:"CELEBRATORY",children:"Celebratory Hug"})]})]}),e.jsxs(a,{children:[e.jsx(s,{htmlFor:"message",children:"Message (optional)"}),e.jsx(k,{id:"message",name:"message",value:n.message,onChange:i,placeholder:"Add a personal message with your hug..."})]}),e.jsx(S,{type:"submit",disabled:d,children:d?"Sending...":"Send Hug"})]})]}),M=()=>e.jsxs(w,{children:[e.jsx(u,{children:"Request a Hug"}),e.jsxs("form",{onSubmit:C,children:[e.jsxs(a,{children:[e.jsx(s,{htmlFor:"message",children:"Why do you need a hug?"}),e.jsx(k,{id:"message",name:"message",value:n.message,onChange:i,placeholder:"Share why you could use some support right now...",required:!0})]}),e.jsx(a,{children:e.jsxs(K,{children:[e.jsx("input",{type:"checkbox",id:"isCommunity",name:"isCommunity",checked:n.isCommunity,onChange:i}),e.jsx("label",{htmlFor:"isCommunity",children:"Make this a community request (anyone can respond)"})]})}),!n.isCommunity&&e.jsxs(a,{children:[e.jsx(s,{htmlFor:"recipientId",children:"Request from specific person"}),e.jsxs(m,{id:"recipientId",name:"recipientId",value:n.recipientId,onChange:i,required:!n.isCommunity,children:[e.jsx("option",{value:"",children:"Select a person"}),e.jsx("option",{value:"user1",children:"Sarah Johnson"}),e.jsx("option",{value:"user2",children:"Michael Chen"}),e.jsx("option",{value:"user3",children:"Aisha Patel"})]})]}),e.jsx(S,{type:"submit",disabled:d,children:d?"Submitting...":"Request Hug"})]})]}),P=()=>e.jsxs(e.Fragment,{children:[e.jsx(u,{children:"Hugs Received"}),e.jsxs(T,{children:[e.jsxs(g,{received:!0,children:[e.jsxs(p,{children:[e.jsx(v,{received:!0,children:"MJ"}),e.jsxs(x,{children:[e.jsx("div",{className:"name",children:"Michael Johnson"}),e.jsx("div",{className:"date",children:"March 20, 2025"})]}),e.jsx(b,{received:!0,children:"SUPPORTIVE"})]}),e.jsx(y,{children:"Hang in there! I know you've been going through a tough time lately, but you're stronger than you think. Here's a hug to remind you that you're not alone."})]}),e.jsxs(g,{received:!0,children:[e.jsxs(p,{children:[e.jsx(v,{received:!0,children:"AP"}),e.jsxs(x,{children:[e.jsx("div",{className:"name",children:"Aisha Patel"}),e.jsx("div",{className:"date",children:"March 15, 2025"})]}),e.jsx(b,{received:!0,children:"CELEBRATORY"})]}),e.jsx(y,{children:"Congratulations on your achievement! So proud of you. Virtual hug sent your way! 🎉"})]})]}),e.jsx(u,{style:{marginTop:"2rem"},children:"Hugs Sent"}),e.jsx(T,{children:e.jsxs(g,{children:[e.jsxs(p,{children:[e.jsx(v,{children:"SJ"}),e.jsxs(x,{children:[e.jsx("div",{className:"name",children:"Sarah Johnson"}),e.jsx("div",{className:"date",children:"March 22, 2025"})]}),e.jsx(b,{children:"COMFORTING"})]}),e.jsx(y,{children:"I heard about what happened. I'm here for you, always. This hug comes with my heartfelt support."})]})})]}),F=()=>e.jsxs(X,{children:[e.jsx("p",{children:"There are no pending hug requests at this time."}),e.jsx("p",{children:"When someone requests a hug from you, it will appear here."})]}),A=()=>{switch(o){case"sendHug":return q();case"requestHug":return M();case"hugHistory":return P();case"pendingRequests":return F();default:return null}};return e.jsxs(D,{children:[e.jsxs(J,{children:[e.jsx(V,{onClick:H,children:"HugMeNow"}),e.jsx($,{onClick:H,children:"Back to Dashboard"})]}),e.jsxs(G,{children:[e.jsx(L,{children:"Hug Center"}),e.jsx(W,{children:"Send and receive virtual hugs to provide emotional support and connection with others. Sometimes a simple gesture can make all the difference."}),e.jsxs(Q,{children:[e.jsxs(Y,{children:[e.jsx(l,{active:o==="sendHug",onClick:()=>c("sendHug"),children:"Send a Hug"}),e.jsx(l,{active:o==="requestHug",onClick:()=>c("requestHug"),children:"Request a Hug"}),e.jsx(l,{active:o==="hugHistory",onClick:()=>c("hugHistory"),children:"Hug History"}),e.jsx(l,{active:o==="pendingRequests",onClick:()=>c("pendingRequests"),children:"Pending Requests"})]}),A()]})]})]})};export{_ as default};
//# sourceMappingURL=HugCenter-d8a31192.js.map
