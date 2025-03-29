import{d as r,r as o,u as S,j as e,L as F,a as N,R as T,b as x,N as A}from"./main-1dd0d4cc.js";const B=r.form`
  width: 100%;
`,P=r.div`
  margin-bottom: 1.5rem;
`,L=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,$=r.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`,D=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,H=r.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark-color, #4f46e5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,J=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,C=r(F)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,M=()=>{const[t,u]=o.useState(""),[a,h]=o.useState(""),[n,d]=o.useState(!1),[m,c]=o.useState(""),g=S(),s=async i=>{i.preventDefault(),c(""),d(!0);try{console.log("Login attempted with:",{email:t,password:a}),setTimeout(()=>{d(!1),g("/dashboard")},1e3)}catch(b){d(!1),c("Invalid email or password. Please try again."),console.error("Login error:",b)}};return e.jsxs(B,{onSubmit:s,children:[m&&e.jsx(D,{children:m}),e.jsxs(P,{children:[e.jsx(L,{htmlFor:"email",children:"Email"}),e.jsx($,{id:"email",type:"email",value:t,onChange:i=>u(i.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(P,{children:[e.jsx(L,{htmlFor:"password",children:"Password"}),e.jsx($,{id:"password",type:"password",value:a,onChange:i=>h(i.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(H,{type:"submit",disabled:n,children:n?"Signing in...":"Sign In"}),e.jsxs(J,{children:[e.jsx("p",{children:e.jsx(C,{to:"/auth/forgot-password",children:"Forgot password?"})}),e.jsxs("p",{children:["Don't have an account?"," ",e.jsx(C,{to:"/auth/register",children:"Sign up"})]})]})]})},W=r.form`
  width: 100%;
`,v=r.div`
  margin-bottom: 1.5rem;
`,j=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,y=r.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`,Y=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,U=r.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark-color, #4f46e5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,G=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,K=r(F)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,O=()=>{const[t,u]=o.useState(""),[a,h]=o.useState(""),[n,d]=o.useState(""),[m,c]=o.useState(""),[g,s]=o.useState(!1),[i,b]=o.useState(""),k=S(),f=async l=>{if(l.preventDefault(),b(""),n!==m){b("Passwords do not match");return}s(!0);try{console.log("Registration attempted with:",{name:t,email:a,password:n}),setTimeout(()=>{s(!1),k("/onboarding")},1e3)}catch(p){s(!1),b("Registration failed. Please try again."),console.error("Registration error:",p)}};return e.jsxs(W,{onSubmit:f,children:[i&&e.jsx(Y,{children:i}),e.jsxs(v,{children:[e.jsx(j,{htmlFor:"name",children:"Full Name"}),e.jsx(y,{id:"name",type:"text",value:t,onChange:l=>u(l.target.value),required:!0,placeholder:"John Doe"})]}),e.jsxs(v,{children:[e.jsx(j,{htmlFor:"email",children:"Email"}),e.jsx(y,{id:"email",type:"email",value:a,onChange:l=>h(l.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(v,{children:[e.jsx(j,{htmlFor:"password",children:"Password"}),e.jsx(y,{id:"password",type:"password",value:n,onChange:l=>d(l.target.value),required:!0,placeholder:"••••••••"})]}),e.jsxs(v,{children:[e.jsx(j,{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx(y,{id:"confirmPassword",type:"password",value:m,onChange:l=>c(l.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(U,{type:"submit",disabled:g,children:g?"Creating account...":"Create Account"}),e.jsx(G,{children:e.jsxs("p",{children:["Already have an account?"," ",e.jsx(K,{to:"/auth/login",children:"Sign in"})]})})]})},Q=r.form`
  width: 100%;
`,V=r.div`
  margin-bottom: 1.5rem;
`,X=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,Z=r.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`,_=r.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark-color, #4f46e5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,ee=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,re=r.div`
  color: var(--success-color, #22c55e);
  background-color: var(--success-bg-color, #dcfce7);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`,oe=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,te=r(F)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,se=()=>{const[t,u]=o.useState(""),[a,h]=o.useState(!1),[n,d]=o.useState(""),[m,c]=o.useState(!1),g=async s=>{s.preventDefault(),d(""),c(!1),h(!0);try{console.log("Password reset requested for:",t),setTimeout(()=>{h(!1),c(!0)},1e3)}catch(i){h(!1),d("Could not process your request. Please try again."),console.error("Password reset error:",i)}};return e.jsxs(Q,{onSubmit:g,children:[n&&e.jsx(ee,{children:n}),m?e.jsx(re,{children:e.jsx("p",{children:"We've sent a password reset link to your email address. Please check your inbox."})}):e.jsxs(e.Fragment,{children:[e.jsxs(V,{children:[e.jsx(X,{htmlFor:"email",children:"Email"}),e.jsx(Z,{id:"email",type:"email",value:t,onChange:s=>u(s.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsx(_,{type:"submit",disabled:a,children:a?"Sending Reset Link...":"Send Reset Link"})]}),e.jsx(oe,{children:e.jsx("p",{children:e.jsx(te,{to:"/auth/login",children:"Back to login"})})})]})},ne=r.form`
  width: 100%;
`,E=r.div`
  margin-bottom: 1.5rem;
`,z=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,q=r.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #e5e7eb);
  border-radius: 0.375rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: var(--primary-color, #6366f1);
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
`,ae=r.button`
  width: 100%;
  padding: 0.75rem;
  background-color: var(--primary-color, #6366f1);
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--primary-dark-color, #4f46e5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,ie=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,ce=r.div`
  color: var(--success-color, #22c55e);
  background-color: var(--success-bg-color, #dcfce7);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`,R=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,I=r(F)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,le=()=>{const[t,u]=o.useState(""),[a,h]=o.useState(""),[n,d]=o.useState(""),[m,c]=o.useState(!1),[g,s]=o.useState(""),[i,b]=o.useState(!1),k=S(),f=N();o.useEffect(()=>{const w=new URLSearchParams(f.search).get("token");w?d(w):s("Invalid or missing reset token. Please request a new password reset link.")},[f]);const l=async p=>{if(p.preventDefault(),s(""),t!==a){s("Passwords do not match");return}if(t.length<8){s("Password must be at least 8 characters long");return}c(!0);try{console.log("Password reset attempted with token:",n),setTimeout(()=>{c(!1),b(!0),setTimeout(()=>{k("/auth/login")},3e3)},1e3)}catch(w){c(!1),s("Password reset failed. Please try again or request a new reset link."),console.error("Password reset error:",w)}};return i?e.jsxs(ce,{children:[e.jsx("p",{children:"Your password has been successfully reset. You will be redirected to the login page shortly."}),e.jsx(R,{children:e.jsx("p",{children:e.jsx(I,{to:"/auth/login",children:"Back to login"})})})]}):e.jsxs(ne,{onSubmit:l,children:[g&&e.jsx(ie,{children:g}),e.jsxs(E,{children:[e.jsx(z,{htmlFor:"password",children:"New Password"}),e.jsx(q,{id:"password",type:"password",value:t,onChange:p=>u(p.target.value),required:!0,disabled:!n,placeholder:"••••••••"})]}),e.jsxs(E,{children:[e.jsx(z,{htmlFor:"confirmPassword",children:"Confirm New Password"}),e.jsx(q,{id:"confirmPassword",type:"password",value:a,onChange:p=>h(p.target.value),required:!0,disabled:!n,placeholder:"••••••••"})]}),e.jsx(ae,{type:"submit",disabled:m||!n,children:m?"Resetting Password...":"Reset Password"}),e.jsx(R,{children:e.jsx("p",{children:e.jsx(I,{to:"/auth/login",children:"Back to login"})})})]})},de=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`,me=r.div`
  margin-bottom: 2rem;
  text-align: center;
`,ue=r.h1`
  font-size: 1.75rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 0.5rem;
`,he=r.p`
  color: var(--text-secondary-color, #6b7280);
`,pe=()=>{const t=N(),u=()=>t.pathname.includes("/register")?"Create an Account":t.pathname.includes("/forgot-password")?"Forgot Password":t.pathname.includes("/reset-password")?"Reset Password":"Welcome Back",a=()=>t.pathname.includes("/register")?"Join HugMeNow to start tracking your moods and connecting with others.":t.pathname.includes("/forgot-password")?"Enter your email to receive a password reset link.":t.pathname.includes("/reset-password")?"Create a new password for your account.":"Sign in to access your HugMeNow account.";return e.jsxs(de,{children:[e.jsxs(me,{children:[e.jsx(ue,{children:u()}),e.jsx(he,{children:a()})]}),e.jsxs(T,{children:[e.jsx(x,{path:"login",element:e.jsx(M,{})}),e.jsx(x,{path:"register",element:e.jsx(O,{})}),e.jsx(x,{path:"forgot-password",element:e.jsx(se,{})}),e.jsx(x,{path:"reset-password",element:e.jsx(le,{})}),e.jsx(x,{path:"*",element:e.jsx(A,{to:"/auth/login",replace:!0})})]})]})};export{pe as default};
//# sourceMappingURL=AuthPage-214a3b5d.js.map
