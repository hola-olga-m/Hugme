import{d as r,r as t,u as S,a as N,j as e,L as F,b as T,R as A,c as w,N as D}from"./main-400279ba.js";const B=r.form`
  width: 100%;
`,P=r.div`
  margin-bottom: 1.5rem;
`,L=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,C=r.input`
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
`,H=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,J=r.button`
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
`,M=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,$=r(F)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,W=()=>{const[o,u]=t.useState(""),[i,h]=t.useState(""),[s,g]=t.useState(!1),[m,l]=t.useState(""),p=S(),{login:c}=N(),b=async n=>{n.preventDefault(),l(""),g(!0);try{console.log("Login attempt with:",{email:o});const f=await c({email:o,password:i});if(f&&f.success)console.log("Login successful, navigating to dashboard"),p("/dashboard");else throw new Error("Login failed")}catch(f){console.error("Login error:",f),l(f.message||"Invalid email or password. Please try again.")}finally{g(!1)}};return e.jsxs(B,{onSubmit:b,children:[m&&e.jsx(H,{children:m}),e.jsxs(P,{children:[e.jsx(L,{htmlFor:"email",children:"Email"}),e.jsx(C,{id:"email",type:"email",value:o,onChange:n=>u(n.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(P,{children:[e.jsx(L,{htmlFor:"password",children:"Password"}),e.jsx(C,{id:"password",type:"password",value:i,onChange:n=>h(n.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(J,{type:"submit",disabled:s,children:s?"Signing in...":"Sign In"}),e.jsxs(M,{children:[e.jsx("p",{children:e.jsx($,{to:"/auth/forgot-password",children:"Forgot password?"})}),e.jsxs("p",{children:["Don't have an account?"," ",e.jsx($,{to:"/auth/register",children:"Sign up"})]})]})]})},Y=r.form`
  width: 100%;
`,j=r.div`
  margin-bottom: 1.5rem;
`,y=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,k=r.input`
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
`,U=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,G=r.button`
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
`,K=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,O=r(F)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,Q=()=>{const[o,u]=t.useState(""),[i,h]=t.useState(""),[s,g]=t.useState(""),[m,l]=t.useState(""),[p,c]=t.useState(!1),[b,n]=t.useState("");S();const{register:f}=N(),v=async d=>{if(d.preventDefault(),s!==m){n("Passwords do not match");return}c(!0),n("");try{n("Creating your account...");const a={name:o,email:i,password:s};console.log("Submitting registration with:",{name:o,email:i,hasPassword:!!s,hasName:!!o});const x=setTimeout(()=>{n("Still working on creating your account. This might take a moment...")},5e3);await f(a),clearTimeout(x)}catch(a){console.error("Registration form error:",a),a.message.includes("timeout")||a.message.includes("too long")?n("The server is taking too long to respond. Please try again later or check your internet connection."):a.message.includes("NetworkError")||a.message.includes("connect")?n("Cannot connect to the server. Please check your internet connection and try again."):n(a.message||"Registration failed. Please try again.")}finally{c(!1)}};return e.jsxs(Y,{onSubmit:v,children:[b&&e.jsx(U,{children:b}),e.jsxs(j,{children:[e.jsx(y,{htmlFor:"name",children:"Full Name"}),e.jsx(k,{id:"name",type:"text",value:o,onChange:d=>u(d.target.value),required:!0,placeholder:"John Doe"})]}),e.jsxs(j,{children:[e.jsx(y,{htmlFor:"email",children:"Email"}),e.jsx(k,{id:"email",type:"email",value:i,onChange:d=>h(d.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(j,{children:[e.jsx(y,{htmlFor:"password",children:"Password"}),e.jsx(k,{id:"password",type:"password",value:s,onChange:d=>g(d.target.value),required:!0,placeholder:"••••••••"})]}),e.jsxs(j,{children:[e.jsx(y,{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx(k,{id:"confirmPassword",type:"password",value:m,onChange:d=>l(d.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(G,{type:"submit",disabled:p,children:p?"Creating account...":"Create Account"}),e.jsx(K,{children:e.jsxs("p",{children:["Already have an account?"," ",e.jsx(O,{to:"/auth/login",children:"Sign in"})]})})]})},V=r.form`
  width: 100%;
`,X=r.div`
  margin-bottom: 1.5rem;
`,Z=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,_=r.input`
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
`,ee=r.button`
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
`,re=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,oe=r.div`
  color: var(--success-color, #22c55e);
  background-color: var(--success-bg-color, #dcfce7);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`,te=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,se=r(F)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,ne=()=>{const[o,u]=t.useState(""),[i,h]=t.useState(!1),[s,g]=t.useState(""),[m,l]=t.useState(!1),p=async c=>{c.preventDefault(),g(""),l(!1),h(!0);try{console.log("Password reset requested for:",o),setTimeout(()=>{h(!1),l(!0)},1e3)}catch(b){h(!1),g("Could not process your request. Please try again."),console.error("Password reset error:",b)}};return e.jsxs(V,{onSubmit:p,children:[s&&e.jsx(re,{children:s}),m?e.jsx(oe,{children:e.jsx("p",{children:"We've sent a password reset link to your email address. Please check your inbox."})}):e.jsxs(e.Fragment,{children:[e.jsxs(X,{children:[e.jsx(Z,{htmlFor:"email",children:"Email"}),e.jsx(_,{id:"email",type:"email",value:o,onChange:c=>u(c.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsx(ee,{type:"submit",disabled:i,children:i?"Sending Reset Link...":"Send Reset Link"})]}),e.jsx(te,{children:e.jsx("p",{children:e.jsx(se,{to:"/auth/login",children:"Back to login"})})})]})},ae=r.form`
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
`,ie=r.button`
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
`,ce=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,le=r.div`
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
`,de=()=>{const[o,u]=t.useState(""),[i,h]=t.useState(""),[s,g]=t.useState(""),[m,l]=t.useState(!1),[p,c]=t.useState(""),[b,n]=t.useState(!1),f=S(),v=T();t.useEffect(()=>{const x=new URLSearchParams(v.search).get("token");x?g(x):c("Invalid or missing reset token. Please request a new password reset link.")},[v]);const d=async a=>{if(a.preventDefault(),c(""),o!==i){c("Passwords do not match");return}if(o.length<8){c("Password must be at least 8 characters long");return}l(!0);try{console.log("Password reset attempted with token:",s),setTimeout(()=>{l(!1),n(!0),setTimeout(()=>{f("/auth/login")},3e3)},1e3)}catch(x){l(!1),c("Password reset failed. Please try again or request a new reset link."),console.error("Password reset error:",x)}};return b?e.jsxs(le,{children:[e.jsx("p",{children:"Your password has been successfully reset. You will be redirected to the login page shortly."}),e.jsx(R,{children:e.jsx("p",{children:e.jsx(I,{to:"/auth/login",children:"Back to login"})})})]}):e.jsxs(ae,{onSubmit:d,children:[p&&e.jsx(ce,{children:p}),e.jsxs(E,{children:[e.jsx(z,{htmlFor:"password",children:"New Password"}),e.jsx(q,{id:"password",type:"password",value:o,onChange:a=>u(a.target.value),required:!0,disabled:!s,placeholder:"••••••••"})]}),e.jsxs(E,{children:[e.jsx(z,{htmlFor:"confirmPassword",children:"Confirm New Password"}),e.jsx(q,{id:"confirmPassword",type:"password",value:i,onChange:a=>h(a.target.value),required:!0,disabled:!s,placeholder:"••••••••"})]}),e.jsx(ie,{type:"submit",disabled:m||!s,children:m?"Resetting Password...":"Reset Password"}),e.jsx(R,{children:e.jsx("p",{children:e.jsx(I,{to:"/auth/login",children:"Back to login"})})})]})},me=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`,ue=r.div`
  margin-bottom: 2rem;
  text-align: center;
`,he=r.h1`
  font-size: 1.75rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 0.5rem;
`,ge=r.p`
  color: var(--text-secondary-color, #6b7280);
`,fe=()=>{const o=T(),u=()=>o.pathname.includes("/register")?"Create an Account":o.pathname.includes("/forgot-password")?"Forgot Password":o.pathname.includes("/reset-password")?"Reset Password":"Welcome Back",i=()=>o.pathname.includes("/register")?"Join HugMeNow to start tracking your moods and connecting with others.":o.pathname.includes("/forgot-password")?"Enter your email to receive a password reset link.":o.pathname.includes("/reset-password")?"Create a new password for your account.":"Sign in to access your HugMeNow account.";return e.jsxs(me,{children:[e.jsxs(ue,{children:[e.jsx(he,{children:u()}),e.jsx(ge,{children:i()})]}),e.jsxs(A,{children:[e.jsx(w,{path:"login",element:e.jsx(W,{})}),e.jsx(w,{path:"register",element:e.jsx(Q,{})}),e.jsx(w,{path:"forgot-password",element:e.jsx(ne,{})}),e.jsx(w,{path:"reset-password",element:e.jsx(de,{})}),e.jsx(w,{path:"*",element:e.jsx(D,{to:"/auth/login",replace:!0})})]})]})};export{fe as default};
//# sourceMappingURL=AuthPage-c9efe04c.js.map
