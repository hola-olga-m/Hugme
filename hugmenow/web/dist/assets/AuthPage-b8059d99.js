import{d as r,r as s,u as w,a as q,j as e,L as v,b as N,R as z,c as x,N as D}from"./main-e694d9c7.js";const I=r.form`
  width: 100%;
`,y=r.div`
  margin-bottom: 1.5rem;
`,F=r.label`
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
`,A=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,B=r.button`
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
`,T=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,P=r(v)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,H=()=>{const[o,m]=s.useState(""),[a,c]=s.useState(""),[n,u]=s.useState(!1),[i,l]=s.useState(""),d=w(),{login:t}=q(),h=async g=>{g.preventDefault(),l(""),u(!0);try{console.log("Login attempt with:",{email:o});const p=await t({email:o,password:a});if(p&&p.success)console.log("Login successful, navigating to dashboard"),d("/dashboard");else throw new Error("Login failed")}catch(p){console.error("Login error:",p),l(p.message||"Invalid email or password. Please try again.")}finally{u(!1)}};return e.jsxs(I,{onSubmit:h,children:[i&&e.jsx(A,{children:i}),e.jsxs(y,{children:[e.jsx(F,{htmlFor:"email",children:"Email"}),e.jsx(k,{id:"email",type:"email",value:o,onChange:g=>m(g.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(y,{children:[e.jsx(F,{htmlFor:"password",children:"Password"}),e.jsx(k,{id:"password",type:"password",value:a,onChange:g=>c(g.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(B,{type:"submit",disabled:n,children:n?"Signing in...":"Sign In"}),e.jsxs(T,{children:[e.jsx("p",{children:e.jsx(P,{to:"/auth/forgot-password",children:"Forgot password?"})}),e.jsxs("p",{children:["Don't have an account?"," ",e.jsx(P,{to:"/auth/register",children:"Sign up"})]})]})]})},M=()=>{const[o,m]=s.useState({username:"",email:"",password:"",confirmPassword:""}),[a,c]=s.useState(""),{register:n}=q(),u=w(),i=d=>{const{name:t,value:h}=d.target;m({...o,[t]:h})},l=async d=>{if(d.preventDefault(),c(""),o.password!==o.confirmPassword){c("Passwords do not match");return}try{await n(o),u("/login")}catch(t){c(t.message||"Registration failed")}};return e.jsx("div",{className:"form-container",children:e.jsxs("form",{onSubmit:l,children:[a&&e.jsx("div",{className:"error-message",children:a}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"username",children:"Username"}),e.jsx("input",{type:"text",id:"username",name:"username",value:o.username,onChange:i,required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:"Email"}),e.jsx("input",{type:"email",id:"email",name:"email",value:o.email,onChange:i,required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"password",children:"Password"}),e.jsx("input",{type:"password",id:"password",name:"password",value:o.password,onChange:i,required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx("input",{type:"password",id:"confirmPassword",name:"confirmPassword",value:o.confirmPassword,onChange:i,required:!0})]}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Register"})]})})},U=r.form`
  width: 100%;
`,W=r.div`
  margin-bottom: 1.5rem;
`,Y=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,J=r.input`
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
`,K=r.p`
  color: var(--error-color, #ef4444);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,O=r.div`
  color: var(--success-color, #22c55e);
  background-color: var(--success-bg-color, #dcfce7);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`,Q=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,V=r(v)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,X=()=>{const[o,m]=s.useState(""),[a,c]=s.useState(!1),[n,u]=s.useState(""),[i,l]=s.useState(!1),d=async t=>{t.preventDefault(),u(""),l(!1),c(!0);try{console.log("Password reset requested for:",o),setTimeout(()=>{c(!1),l(!0)},1e3)}catch(h){c(!1),u("Could not process your request. Please try again."),console.error("Password reset error:",h)}};return e.jsxs(U,{onSubmit:d,children:[n&&e.jsx(K,{children:n}),i?e.jsx(O,{children:e.jsx("p",{children:"We've sent a password reset link to your email address. Please check your inbox."})}):e.jsxs(e.Fragment,{children:[e.jsxs(W,{children:[e.jsx(Y,{htmlFor:"email",children:"Email"}),e.jsx(J,{id:"email",type:"email",value:o,onChange:t=>m(t.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsx(G,{type:"submit",disabled:a,children:a?"Sending Reset Link...":"Send Reset Link"})]}),e.jsx(Q,{children:e.jsx("p",{children:e.jsx(V,{to:"/auth/login",children:"Back to login"})})})]})},Z=r.form`
  width: 100%;
`,S=r.div`
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
`,E=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,$=r(v)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,oe=()=>{const[o,m]=s.useState(""),[a,c]=s.useState(""),[n,u]=s.useState(""),[i,l]=s.useState(!1),[d,t]=s.useState(""),[h,g]=s.useState(!1),p=w(),j=N();s.useEffect(()=>{const b=new URLSearchParams(j.search).get("token");b?u(b):t("Invalid or missing reset token. Please request a new password reset link.")},[j]);const R=async f=>{if(f.preventDefault(),t(""),o!==a){t("Passwords do not match");return}if(o.length<8){t("Password must be at least 8 characters long");return}l(!0);try{console.log("Password reset attempted with token:",n),setTimeout(()=>{l(!1),g(!0),setTimeout(()=>{p("/auth/login")},3e3)},1e3)}catch(b){l(!1),t("Password reset failed. Please try again or request a new reset link."),console.error("Password reset error:",b)}};return h?e.jsxs(re,{children:[e.jsx("p",{children:"Your password has been successfully reset. You will be redirected to the login page shortly."}),e.jsx(E,{children:e.jsx("p",{children:e.jsx($,{to:"/auth/login",children:"Back to login"})})})]}):e.jsxs(Z,{onSubmit:R,children:[d&&e.jsx(ee,{children:d}),e.jsxs(S,{children:[e.jsx(L,{htmlFor:"password",children:"New Password"}),e.jsx(C,{id:"password",type:"password",value:o,onChange:f=>m(f.target.value),required:!0,disabled:!n,placeholder:"••••••••"})]}),e.jsxs(S,{children:[e.jsx(L,{htmlFor:"confirmPassword",children:"Confirm New Password"}),e.jsx(C,{id:"confirmPassword",type:"password",value:a,onChange:f=>c(f.target.value),required:!0,disabled:!n,placeholder:"••••••••"})]}),e.jsx(_,{type:"submit",disabled:i||!n,children:i?"Resetting Password...":"Reset Password"}),e.jsx(E,{children:e.jsx("p",{children:e.jsx($,{to:"/auth/login",children:"Back to login"})})})]})},se=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`,te=r.div`
  margin-bottom: 2rem;
  text-align: center;
`,ae=r.h1`
  font-size: 1.75rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 0.5rem;
`,ne=r.p`
  color: var(--text-secondary-color, #6b7280);
`,ce=()=>{const o=N(),m=()=>o.pathname.includes("/register")?"Create an Account":o.pathname.includes("/forgot-password")?"Forgot Password":o.pathname.includes("/reset-password")?"Reset Password":"Welcome Back",a=()=>o.pathname.includes("/register")?"Join HugMeNow to start tracking your moods and connecting with others.":o.pathname.includes("/forgot-password")?"Enter your email to receive a password reset link.":o.pathname.includes("/reset-password")?"Create a new password for your account.":"Sign in to access your HugMeNow account.";return e.jsxs(se,{children:[e.jsxs(te,{children:[e.jsx(ae,{children:m()}),e.jsx(ne,{children:a()})]}),e.jsxs(z,{children:[e.jsx(x,{path:"login",element:e.jsx(H,{})}),e.jsx(x,{path:"register",element:e.jsx(M,{})}),e.jsx(x,{path:"forgot-password",element:e.jsx(X,{})}),e.jsx(x,{path:"reset-password",element:e.jsx(oe,{})}),e.jsx(x,{path:"*",element:e.jsx(D,{to:"/auth/login",replace:!0})})]})]})};export{ce as default};
