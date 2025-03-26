import{d as o,r as t,u as E,a as F,j as r,L as I,b as N}from"./main-57df069b.js";const T=o.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--gray-100);
`,P=o.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  max-width: 450px;
  width: 100%;
  margin: 0 auto;
`,O=o.div`
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
`,v=o.form`
  display: flex;
  flex-direction: column;
`,g=o.div`
  margin-bottom: 1.5rem;
`,u=o.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-800);
`,m=o.input`
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
`,x=o.button`
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
`,q=o.div`
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
`,B=o.div`
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
`,M=o.button`
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
`,G=()=>{const[i,f]=t.useState(""),[c,w]=t.useState(""),[s,j]=t.useState(""),[S,h]=t.useState(!1),[l,d]=t.useState(!1),[p,a]=t.useState(""),{login:k,anonymousLogin:L,loading:C}=E(),b=F(),A=async n=>{if(n.preventDefault(),!i||!c){a("Please enter both email and password");return}d(!0),a("");try{console.log("Starting regular login with email:",i),await k(i,c),console.log("Regular login successful, setting redirect flag"),localStorage.setItem("redirectToDashboard","true"),console.log("Navigating to dashboard after login"),b("/dashboard",{replace:!0,state:{fromLogin:!0,loginTime:new Date().toISOString()}})}catch(e){console.error("Login error:",e),a(e.message||"Invalid email or password")}finally{d(!1)}},D=async n=>{if(n.preventDefault(),!s){a("Please enter a nickname");return}console.log("Starting anonymous login process with nickname:",s),d(!0),a("");try{console.log("Calling anonymousLogin from AuthContext");const e=await L(s);console.log("Anonymous login successful, received auth data:",JSON.stringify({...e,accessToken:e.accessToken?"[REDACTED]":void 0,user:e.user?{...e.user,id:e.user.id||"[MISSING ID]"}:null})),console.log("Forcing auth state refresh before navigation"),setTimeout(()=>{console.log("Attempting navigation to dashboard after successful login"),localStorage.setItem("redirectToDashboard","true"),b("/dashboard",{replace:!0,state:{fromLogin:!0,loginTime:new Date().toISOString()}}),console.log("Navigation completed")},500)}catch(e){console.error("Anonymous login error:",e),a(e.message||"Failed to login anonymously")}finally{d(!1)}};return C?r.jsx(I,{text:"Checking authentication..."}):r.jsx(T,{children:r.jsxs(P,{children:[r.jsxs(O,{children:[r.jsx("h1",{children:"HugMeNow"}),r.jsx("p",{children:"Your emotional wellness companion"})]}),p&&r.jsx(q,{children:p}),S?r.jsxs(v,{onSubmit:D,children:[r.jsxs(g,{children:[r.jsx(u,{htmlFor:"nickname",children:"Nickname"}),r.jsx(m,{type:"text",id:"nickname",value:s,onChange:n=>j(n.target.value),placeholder:"Enter your nickname",required:!0})]}),r.jsx(x,{type:"submit",disabled:l,children:l?"Processing...":"Continue Anonymously"}),r.jsx(y,{children:r.jsx("p",{children:r.jsx("a",{href:"#",onClick:()=>h(!1),children:"Back to login"})})})]}):r.jsxs(r.Fragment,{children:[r.jsxs(v,{onSubmit:A,children:[r.jsxs(g,{children:[r.jsx(u,{htmlFor:"email",children:"Email"}),r.jsx(m,{type:"email",id:"email",value:i,onChange:n=>f(n.target.value),placeholder:"Enter your email",required:!0})]}),r.jsxs(g,{children:[r.jsx(u,{htmlFor:"password",children:"Password"}),r.jsx(m,{type:"password",id:"password",value:c,onChange:n=>w(n.target.value),placeholder:"Enter your password",required:!0})]}),r.jsx(x,{type:"submit",disabled:l,children:l?"Signing in...":"Sign In"})]}),r.jsx(B,{children:r.jsx("span",{children:"or"})}),r.jsx(M,{type:"button",onClick:()=>h(!0),children:"Continue Anonymously"}),r.jsx(y,{children:r.jsxs("p",{children:["Don't have an account?"," ",r.jsx(N,{to:"/register",children:"Sign Up"})]})})]})]})})};export{G as default};
//# sourceMappingURL=Login-d5dc4c23.js.map
