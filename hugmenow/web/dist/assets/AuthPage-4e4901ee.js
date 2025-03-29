import{d as r,r as t,u as P,a as A,j as e,L as k,b as B,R as T,c as w,N as H}from"./main-e6a5ccf0.js";const M=r.form`
  width: 100%;
`,L=r.div`
  margin-bottom: 1.5rem;
`,$=r.label`
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
`,J=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,O=r.button`
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
`,W=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,E=r(k)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,Y=()=>{const[o,m]=t.useState(""),[n,h]=t.useState(""),[a,g]=t.useState(!1),[u,l]=t.useState(""),p=P(),{login:i}=A(),b=async c=>{c.preventDefault(),l(""),g(!0);try{console.log("Login attempt with:",{email:o});const f=await i({email:o,password:n});if(f&&f.success)console.log("Login successful, navigating to dashboard"),p("/dashboard");else throw new Error("Login failed")}catch(f){console.error("Login error:",f),l(f.message||"Invalid email or password. Please try again.")}finally{g(!1)}};return e.jsxs(M,{onSubmit:b,children:[u&&e.jsx(J,{children:u}),e.jsxs(L,{children:[e.jsx($,{htmlFor:"email",children:"Email"}),e.jsx(C,{id:"email",type:"email",value:o,onChange:c=>m(c.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(L,{children:[e.jsx($,{htmlFor:"password",children:"Password"}),e.jsx(C,{id:"password",type:"password",value:n,onChange:c=>h(c.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(O,{type:"submit",disabled:a,children:a?"Signing in...":"Sign In"}),e.jsxs(W,{children:[e.jsx("p",{children:e.jsx(E,{to:"/auth/forgot-password",children:"Forgot password?"})}),e.jsxs("p",{children:["Don't have an account?"," ",e.jsx(E,{to:"/auth/register",children:"Sign up"})]})]})]})},U=r.form`
  width: 100%;
`,j=r.div`
  margin-bottom: 1.5rem;
`,y=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,F=r.input`
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
`,G=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,K=r.button`
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
`,Q=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,V=r(k)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,X=()=>{const[o,m]=t.useState(""),[n,h]=t.useState(""),[a,g]=t.useState(""),[u,l]=t.useState(""),[p,i]=t.useState(!1),[b,c]=t.useState(""),f=P(),{register:v}=A(),S=async s=>{var x;if(s.preventDefault(),c(""),a!==u){c("Passwords do not match");return}i(!0);try{console.log("Registration attempt with:",{name:o,email:n});const d=await v({name:o,email:n,password:a});if(d&&d.success)console.log("Registration successful, navigating to onboarding"),f("/onboarding");else throw new Error("Registration failed")}catch(d){if(console.error("Registration error details:",d),d.code==="ECONNABORTED")c("Connection timed out. Server might be busy, please try again.");else if(d.response){const D=((x=d.response.data)==null?void 0:x.error)||`Error ${d.response.status}: ${d.response.statusText}`;c(D)}else d.request?c("Server is not responding. Please try again later."):c(d.message||"Registration failed. Please try again.")}finally{i(!1)}};return e.jsxs(U,{onSubmit:S,children:[b&&e.jsx(G,{children:b}),e.jsxs(j,{children:[e.jsx(y,{htmlFor:"name",children:"Full Name"}),e.jsx(F,{id:"name",type:"text",value:o,onChange:s=>m(s.target.value),required:!0,placeholder:"John Doe"})]}),e.jsxs(j,{children:[e.jsx(y,{htmlFor:"email",children:"Email"}),e.jsx(F,{id:"email",type:"email",value:n,onChange:s=>h(s.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(j,{children:[e.jsx(y,{htmlFor:"password",children:"Password"}),e.jsx(F,{id:"password",type:"password",value:a,onChange:s=>g(s.target.value),required:!0,placeholder:"••••••••"})]}),e.jsxs(j,{children:[e.jsx(y,{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx(F,{id:"confirmPassword",type:"password",value:u,onChange:s=>l(s.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(K,{type:"submit",disabled:p,children:p?"Creating account...":"Create Account"}),e.jsx(Q,{children:e.jsxs("p",{children:["Already have an account?"," ",e.jsx(V,{to:"/auth/login",children:"Sign in"})]})})]})},Z=r.form`
  width: 100%;
`,_=r.div`
  margin-bottom: 1.5rem;
`,ee=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,re=r.input`
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
`,oe=r.button`
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
`,te=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,se=r.div`
  color: var(--success-color, #22c55e);
  background-color: var(--success-bg-color, #dcfce7);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`,ne=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,ae=r(k)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,ie=()=>{const[o,m]=t.useState(""),[n,h]=t.useState(!1),[a,g]=t.useState(""),[u,l]=t.useState(!1),p=async i=>{i.preventDefault(),g(""),l(!1),h(!0);try{console.log("Password reset requested for:",o),setTimeout(()=>{h(!1),l(!0)},1e3)}catch(b){h(!1),g("Could not process your request. Please try again."),console.error("Password reset error:",b)}};return e.jsxs(Z,{onSubmit:p,children:[a&&e.jsx(te,{children:a}),u?e.jsx(se,{children:e.jsx("p",{children:"We've sent a password reset link to your email address. Please check your inbox."})}):e.jsxs(e.Fragment,{children:[e.jsxs(_,{children:[e.jsx(ee,{htmlFor:"email",children:"Email"}),e.jsx(re,{id:"email",type:"email",value:o,onChange:i=>m(i.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsx(oe,{type:"submit",disabled:n,children:n?"Sending Reset Link...":"Send Reset Link"})]}),e.jsx(ne,{children:e.jsx("p",{children:e.jsx(ae,{to:"/auth/login",children:"Back to login"})})})]})},ce=r.form`
  width: 100%;
`,R=r.div`
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
`,le=r.button`
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
`,de=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,ue=r.div`
  color: var(--success-color, #22c55e);
  background-color: var(--success-bg-color, #dcfce7);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`,I=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,N=r(k)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,me=()=>{const[o,m]=t.useState(""),[n,h]=t.useState(""),[a,g]=t.useState(""),[u,l]=t.useState(!1),[p,i]=t.useState(""),[b,c]=t.useState(!1),f=P(),v=B();t.useEffect(()=>{const x=new URLSearchParams(v.search).get("token");x?g(x):i("Invalid or missing reset token. Please request a new password reset link.")},[v]);const S=async s=>{if(s.preventDefault(),i(""),o!==n){i("Passwords do not match");return}if(o.length<8){i("Password must be at least 8 characters long");return}l(!0);try{console.log("Password reset attempted with token:",a),setTimeout(()=>{l(!1),c(!0),setTimeout(()=>{f("/auth/login")},3e3)},1e3)}catch(x){l(!1),i("Password reset failed. Please try again or request a new reset link."),console.error("Password reset error:",x)}};return b?e.jsxs(ue,{children:[e.jsx("p",{children:"Your password has been successfully reset. You will be redirected to the login page shortly."}),e.jsx(I,{children:e.jsx("p",{children:e.jsx(N,{to:"/auth/login",children:"Back to login"})})})]}):e.jsxs(ce,{onSubmit:S,children:[p&&e.jsx(de,{children:p}),e.jsxs(R,{children:[e.jsx(z,{htmlFor:"password",children:"New Password"}),e.jsx(q,{id:"password",type:"password",value:o,onChange:s=>m(s.target.value),required:!0,disabled:!a,placeholder:"••••••••"})]}),e.jsxs(R,{children:[e.jsx(z,{htmlFor:"confirmPassword",children:"Confirm New Password"}),e.jsx(q,{id:"confirmPassword",type:"password",value:n,onChange:s=>h(s.target.value),required:!0,disabled:!a,placeholder:"••••••••"})]}),e.jsx(le,{type:"submit",disabled:u||!a,children:u?"Resetting Password...":"Reset Password"}),e.jsx(I,{children:e.jsx("p",{children:e.jsx(N,{to:"/auth/login",children:"Back to login"})})})]})},he=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`,ge=r.div`
  margin-bottom: 2rem;
  text-align: center;
`,pe=r.h1`
  font-size: 1.75rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 0.5rem;
`,fe=r.p`
  color: var(--text-secondary-color, #6b7280);
`,xe=()=>{const o=B(),m=()=>o.pathname.includes("/register")?"Create an Account":o.pathname.includes("/forgot-password")?"Forgot Password":o.pathname.includes("/reset-password")?"Reset Password":"Welcome Back",n=()=>o.pathname.includes("/register")?"Join HugMeNow to start tracking your moods and connecting with others.":o.pathname.includes("/forgot-password")?"Enter your email to receive a password reset link.":o.pathname.includes("/reset-password")?"Create a new password for your account.":"Sign in to access your HugMeNow account.";return e.jsxs(he,{children:[e.jsxs(ge,{children:[e.jsx(pe,{children:m()}),e.jsx(fe,{children:n()})]}),e.jsxs(T,{children:[e.jsx(w,{path:"login",element:e.jsx(Y,{})}),e.jsx(w,{path:"register",element:e.jsx(X,{})}),e.jsx(w,{path:"forgot-password",element:e.jsx(ie,{})}),e.jsx(w,{path:"reset-password",element:e.jsx(me,{})}),e.jsx(w,{path:"*",element:e.jsx(H,{to:"/auth/login",replace:!0})})]})]})};export{xe as default};
//# sourceMappingURL=AuthPage-4e4901ee.js.map
