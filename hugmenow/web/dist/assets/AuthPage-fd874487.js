import{d as r,r as t,u as S,a as A,j as e,L as F,b as N,R as B,c as x,N as D}from"./main-3b01713e.js";const T=r.form`
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
`,C=r(F)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,W=()=>{const[o,u]=t.useState(""),[n,h]=t.useState(""),[a,g]=t.useState(!1),[d,c]=t.useState(""),p=S(),{login:i}=A(),f=async l=>{l.preventDefault(),c(""),g(!0);try{console.log("Login attempt with:",{email:o});const b=await i({email:o,password:n});if(b&&b.success)console.log("Login successful, navigating to dashboard"),p("/dashboard");else throw new Error("Login failed")}catch(b){console.error("Login error:",b),c(b.message||"Invalid email or password. Please try again.")}finally{g(!1)}};return e.jsxs(T,{onSubmit:f,children:[d&&e.jsx(H,{children:d}),e.jsxs(P,{children:[e.jsx(L,{htmlFor:"email",children:"Email"}),e.jsx($,{id:"email",type:"email",value:o,onChange:l=>u(l.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(P,{children:[e.jsx(L,{htmlFor:"password",children:"Password"}),e.jsx($,{id:"password",type:"password",value:n,onChange:l=>h(l.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(J,{type:"submit",disabled:a,children:a?"Signing in...":"Sign In"}),e.jsxs(M,{children:[e.jsx("p",{children:e.jsx(C,{to:"/auth/forgot-password",children:"Forgot password?"})}),e.jsxs("p",{children:["Don't have an account?"," ",e.jsx(C,{to:"/auth/register",children:"Sign up"})]})]})]})},Y=r.form`
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
`,Q=()=>{const[o,u]=t.useState(""),[n,h]=t.useState(""),[a,g]=t.useState(""),[d,c]=t.useState(""),[p,i]=t.useState(!1),[f,l]=t.useState(""),b=S(),{register:w}=A(),k=async s=>{if(s.preventDefault(),l(""),a!==d){l("Passwords do not match");return}i(!0);try{console.log("Registration attempt with:",{name:o,email:n});const m=await w({name:o,email:n,password:a});if(m&&m.success)console.log("Registration successful, navigating to onboarding"),b("/onboarding");else throw new Error("Registration failed")}catch(m){console.error("Registration error:",m),l(m.message||"Registration failed. Please try again.")}finally{i(!1)}};return e.jsxs(Y,{onSubmit:k,children:[f&&e.jsx(U,{children:f}),e.jsxs(v,{children:[e.jsx(j,{htmlFor:"name",children:"Full Name"}),e.jsx(y,{id:"name",type:"text",value:o,onChange:s=>u(s.target.value),required:!0,placeholder:"John Doe"})]}),e.jsxs(v,{children:[e.jsx(j,{htmlFor:"email",children:"Email"}),e.jsx(y,{id:"email",type:"email",value:n,onChange:s=>h(s.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(v,{children:[e.jsx(j,{htmlFor:"password",children:"Password"}),e.jsx(y,{id:"password",type:"password",value:a,onChange:s=>g(s.target.value),required:!0,placeholder:"••••••••"})]}),e.jsxs(v,{children:[e.jsx(j,{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx(y,{id:"confirmPassword",type:"password",value:d,onChange:s=>c(s.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(G,{type:"submit",disabled:p,children:p?"Creating account...":"Create Account"}),e.jsx(K,{children:e.jsxs("p",{children:["Already have an account?"," ",e.jsx(O,{to:"/auth/login",children:"Sign in"})]})})]})},V=r.form`
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
`,ne=()=>{const[o,u]=t.useState(""),[n,h]=t.useState(!1),[a,g]=t.useState(""),[d,c]=t.useState(!1),p=async i=>{i.preventDefault(),g(""),c(!1),h(!0);try{console.log("Password reset requested for:",o),setTimeout(()=>{h(!1),c(!0)},1e3)}catch(f){h(!1),g("Could not process your request. Please try again."),console.error("Password reset error:",f)}};return e.jsxs(V,{onSubmit:p,children:[a&&e.jsx(re,{children:a}),d?e.jsx(oe,{children:e.jsx("p",{children:"We've sent a password reset link to your email address. Please check your inbox."})}):e.jsxs(e.Fragment,{children:[e.jsxs(X,{children:[e.jsx(Z,{htmlFor:"email",children:"Email"}),e.jsx(_,{id:"email",type:"email",value:o,onChange:i=>u(i.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsx(ee,{type:"submit",disabled:n,children:n?"Sending Reset Link...":"Send Reset Link"})]}),e.jsx(te,{children:e.jsx("p",{children:e.jsx(se,{to:"/auth/login",children:"Back to login"})})})]})},ae=r.form`
  width: 100%;
`,E=r.div`
  margin-bottom: 1.5rem;
`,z=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,R=r.input`
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
`,q=r.div`
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
`,de=()=>{const[o,u]=t.useState(""),[n,h]=t.useState(""),[a,g]=t.useState(""),[d,c]=t.useState(!1),[p,i]=t.useState(""),[f,l]=t.useState(!1),b=S(),w=N();t.useEffect(()=>{const m=new URLSearchParams(w.search).get("token");m?g(m):i("Invalid or missing reset token. Please request a new password reset link.")},[w]);const k=async s=>{if(s.preventDefault(),i(""),o!==n){i("Passwords do not match");return}if(o.length<8){i("Password must be at least 8 characters long");return}c(!0);try{console.log("Password reset attempted with token:",a),setTimeout(()=>{c(!1),l(!0),setTimeout(()=>{b("/auth/login")},3e3)},1e3)}catch(m){c(!1),i("Password reset failed. Please try again or request a new reset link."),console.error("Password reset error:",m)}};return f?e.jsxs(le,{children:[e.jsx("p",{children:"Your password has been successfully reset. You will be redirected to the login page shortly."}),e.jsx(q,{children:e.jsx("p",{children:e.jsx(I,{to:"/auth/login",children:"Back to login"})})})]}):e.jsxs(ae,{onSubmit:k,children:[p&&e.jsx(ce,{children:p}),e.jsxs(E,{children:[e.jsx(z,{htmlFor:"password",children:"New Password"}),e.jsx(R,{id:"password",type:"password",value:o,onChange:s=>u(s.target.value),required:!0,disabled:!a,placeholder:"••••••••"})]}),e.jsxs(E,{children:[e.jsx(z,{htmlFor:"confirmPassword",children:"Confirm New Password"}),e.jsx(R,{id:"confirmPassword",type:"password",value:n,onChange:s=>h(s.target.value),required:!0,disabled:!a,placeholder:"••••••••"})]}),e.jsx(ie,{type:"submit",disabled:d||!a,children:d?"Resetting Password...":"Reset Password"}),e.jsx(q,{children:e.jsx("p",{children:e.jsx(I,{to:"/auth/login",children:"Back to login"})})})]})},me=r.div`
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
`,be=()=>{const o=N(),u=()=>o.pathname.includes("/register")?"Create an Account":o.pathname.includes("/forgot-password")?"Forgot Password":o.pathname.includes("/reset-password")?"Reset Password":"Welcome Back",n=()=>o.pathname.includes("/register")?"Join HugMeNow to start tracking your moods and connecting with others.":o.pathname.includes("/forgot-password")?"Enter your email to receive a password reset link.":o.pathname.includes("/reset-password")?"Create a new password for your account.":"Sign in to access your HugMeNow account.";return e.jsxs(me,{children:[e.jsxs(ue,{children:[e.jsx(he,{children:u()}),e.jsx(ge,{children:n()})]}),e.jsxs(B,{children:[e.jsx(x,{path:"login",element:e.jsx(W,{})}),e.jsx(x,{path:"register",element:e.jsx(Q,{})}),e.jsx(x,{path:"forgot-password",element:e.jsx(ne,{})}),e.jsx(x,{path:"reset-password",element:e.jsx(de,{})}),e.jsx(x,{path:"*",element:e.jsx(D,{to:"/auth/login",replace:!0})})]})]})};export{be as default};
//# sourceMappingURL=AuthPage-fd874487.js.map
