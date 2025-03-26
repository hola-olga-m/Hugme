import{d as o,r as a,u as A,a as P,j as r,L as D,b as I}from"./main-1b1c44e2.js";const N=o.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--gray-100);
`,q=o.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
`,B=o.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-600);
  }
`,x=o.form`
  display: flex;
  flex-direction: column;
`,m=o.div`
  margin-bottom: 1.5rem;
`,u=o.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-800);
`,g=o.input`
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
`,v=o.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--primary-color);
  color: white;
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
`,M=o.div`
  background-color: var(--danger-color);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
`,y=o.div`
  text-align: center;
  margin-top: 1.5rem;
  
  p {
    color: var(--gray-600);
    margin-bottom: 0.5rem;
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`,z=o.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--gray-300);
  }
  
  span {
    padding: 0 0.75rem;
    color: var(--gray-600);
  }
`,G=o.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: var(--gray-200);
  color: var(--gray-800);
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  margin-top: 1rem;
  
  &:hover {
    background-color: var(--gray-300);
  }
`,O=()=>{const[d,j]=a.useState(""),[l,f]=a.useState(""),[c,w]=a.useState(""),[k,h]=a.useState(!1),[i,s]=a.useState(!1),[p,n]=a.useState(""),{login:L,anonymousLogin:S,loading:F}=A(),b=P(),C=async e=>{if(e.preventDefault(),!d||!l){n("Please enter both email and password");return}s(!0),n("");try{await L(d,l),b("/dashboard")}catch(t){console.error("Login error:",t),n(t.message||"Invalid email or password")}finally{s(!1)}},E=async e=>{if(e.preventDefault(),!c){n("Please enter a nickname");return}s(!0),n("");try{await S(c),b("/dashboard")}catch(t){console.error("Anonymous login error:",t),n(t.message||"Failed to login anonymously")}finally{s(!1)}};return F?r.jsx(D,{text:"Checking authentication..."}):r.jsx(N,{children:r.jsxs(q,{children:[r.jsxs(B,{children:[r.jsx("h1",{children:"HugMeNow"}),r.jsx("p",{children:"Your emotional wellness companion"})]}),p&&r.jsx(M,{children:p}),k?r.jsxs(x,{onSubmit:E,children:[r.jsxs(m,{children:[r.jsx(u,{htmlFor:"nickname",children:"Nickname"}),r.jsx(g,{type:"text",id:"nickname",value:c,onChange:e=>w(e.target.value),placeholder:"Enter your nickname",required:!0})]}),r.jsx(v,{type:"submit",disabled:i,children:i?"Processing...":"Continue Anonymously"}),r.jsx(y,{children:r.jsx("p",{children:r.jsx("a",{href:"#",onClick:()=>h(!1),children:"Back to login"})})})]}):r.jsxs(r.Fragment,{children:[r.jsxs(x,{onSubmit:C,children:[r.jsxs(m,{children:[r.jsx(u,{htmlFor:"email",children:"Email"}),r.jsx(g,{type:"email",id:"email",value:d,onChange:e=>j(e.target.value),placeholder:"Enter your email",required:!0})]}),r.jsxs(m,{children:[r.jsx(u,{htmlFor:"password",children:"Password"}),r.jsx(g,{type:"password",id:"password",value:l,onChange:e=>f(e.target.value),placeholder:"Enter your password",required:!0})]}),r.jsx(v,{type:"submit",disabled:i,children:i?"Signing in...":"Sign In"})]}),r.jsx(z,{children:r.jsx("span",{children:"or"})}),r.jsx(G,{type:"button",onClick:()=>h(!0),children:"Continue Anonymously"}),r.jsx(y,{children:r.jsxs("p",{children:["Don't have an account?"," ",r.jsx(I,{to:"/register",children:"Sign Up"})]})})]})]})})};export{O as default};
//# sourceMappingURL=Login-883f3a86.js.map
