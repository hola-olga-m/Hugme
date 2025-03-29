import{d as r,r as t,u as w,a as $,j as e,L as v,f as z,b as N,R as I,c as b,N as T}from"./main-a3287410.js";const A=r.form`
  width: 100%;
`,y=r.div`
  margin-bottom: 1.5rem;
`,P=r.label`
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
`,D=r.p`
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
`,H=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,F=r(v)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,J=()=>{const[o,m]=t.useState(""),[a,n]=t.useState(""),[l,d]=t.useState(!1),[u,i]=t.useState(""),s=w(),{login:c}=$(),f=async g=>{g.preventDefault(),i(""),d(!0);try{console.log("Login attempt with:",{email:o});const h=await c({email:o,password:a});if(h&&h.success)console.log("Login successful, navigating to dashboard"),s("/dashboard");else throw new Error("Login failed")}catch(h){console.error("Login error:",h),i(h.message||"Invalid email or password. Please try again.")}finally{d(!1)}};return e.jsxs(A,{onSubmit:f,children:[u&&e.jsx(D,{children:u}),e.jsxs(y,{children:[e.jsx(P,{htmlFor:"email",children:"Email"}),e.jsx(k,{id:"email",type:"email",value:o,onChange:g=>m(g.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsxs(y,{children:[e.jsx(P,{htmlFor:"password",children:"Password"}),e.jsx(k,{id:"password",type:"password",value:a,onChange:g=>n(g.target.value),required:!0,placeholder:"••••••••"})]}),e.jsx(B,{type:"submit",disabled:l,children:l?"Signing in...":"Sign In"}),e.jsxs(H,{children:[e.jsx("p",{children:e.jsx(F,{to:"/auth/forgot-password",children:"Forgot password?"})}),e.jsxs("p",{children:["Don't have an account?"," ",e.jsx(F,{to:"/auth/register",children:"Sign up"})]})]})]})};r.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
`;r.div`
  background-color: var(--danger-color, #ff5252);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md, 0.375rem);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;const M=()=>{const[o,m]=t.useState({username:"",email:"",password:"",confirmPassword:""}),[a,n]=t.useState("");$();const l=w(),d=i=>{const{name:s,value:c}=i.target;m({...o,[s]:c})},u=async i=>{if(i.preventDefault(),n(""),o.password!==o.confirmPassword){n("Passwords do not match");return}try{console.log("[Register] Attempting registration with:",o);try{const s=await z("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({registerInput:o})});console.log("[Register] Response:",s),l("/login")}catch(s){console.error("[Register] API Error:",s),s.message&&s.message.includes("HTML instead of JSON")?n("The server encountered an error. Please try again or contact support."):n(s.message||"Registration failed. Please try again.")}}catch(s){console.error("[Register] General Error:",s),n(s.message||"Registration failed. Please try again.")}};return e.jsx("div",{className:"form-container",children:e.jsxs("form",{onSubmit:u,children:[a&&e.jsx("div",{className:"error-message",children:a}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"username",children:"Username"}),e.jsx("input",{type:"text",id:"username",name:"username",value:o.username,onChange:d,required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"email",children:"Email"}),e.jsx("input",{type:"email",id:"email",name:"email",value:o.email,onChange:d,required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"password",children:"Password"}),e.jsx("input",{type:"password",id:"password",name:"password",value:o.password,onChange:d,required:!0})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"confirmPassword",children:"Confirm Password"}),e.jsx("input",{type:"password",id:"confirmPassword",name:"confirmPassword",value:o.confirmPassword,onChange:d,required:!0})]}),e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Register"})]})})},O=r.form`
  width: 100%;
`,W=r.div`
  margin-bottom: 1.5rem;
`,U=r.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-color, #1f2937);
`,Y=r.input`
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
`,Q=r.div`
  color: var(--success-color, #22c55e);
  background-color: var(--success-bg-color, #dcfce7);
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
`,V=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,X=r(v)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,Z=()=>{const[o,m]=t.useState(""),[a,n]=t.useState(!1),[l,d]=t.useState(""),[u,i]=t.useState(!1),s=async c=>{c.preventDefault(),d(""),i(!1),n(!0);try{console.log("Password reset requested for:",o),setTimeout(()=>{n(!1),i(!0)},1e3)}catch(f){n(!1),d("Could not process your request. Please try again."),console.error("Password reset error:",f)}};return e.jsxs(O,{onSubmit:s,children:[l&&e.jsx(K,{children:l}),u?e.jsx(Q,{children:e.jsx("p",{children:"We've sent a password reset link to your email address. Please check your inbox."})}):e.jsxs(e.Fragment,{children:[e.jsxs(W,{children:[e.jsx(U,{htmlFor:"email",children:"Email"}),e.jsx(Y,{id:"email",type:"email",value:o,onChange:c=>m(c.target.value),required:!0,placeholder:"you@example.com"})]}),e.jsx(G,{type:"submit",disabled:a,children:a?"Sending Reset Link...":"Send Reset Link"})]}),e.jsx(V,{children:e.jsx("p",{children:e.jsx(X,{to:"/auth/login",children:"Back to login"})})})]})},_=r.form`
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
`,E=r.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary-color, #6b7280);
`,R=r(v)`
  color: var(--primary-color, #6366f1);
  text-decoration: none;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`,se=()=>{const[o,m]=t.useState(""),[a,n]=t.useState(""),[l,d]=t.useState(""),[u,i]=t.useState(!1),[s,c]=t.useState(""),[f,g]=t.useState(!1),h=w(),j=N();t.useEffect(()=>{const x=new URLSearchParams(j.search).get("token");x?d(x):c("Invalid or missing reset token. Please request a new password reset link.")},[j]);const q=async p=>{if(p.preventDefault(),c(""),o!==a){c("Passwords do not match");return}if(o.length<8){c("Password must be at least 8 characters long");return}i(!0);try{console.log("Password reset attempted with token:",l),setTimeout(()=>{i(!1),g(!0),setTimeout(()=>{h("/auth/login")},3e3)},1e3)}catch(x){i(!1),c("Password reset failed. Please try again or request a new reset link."),console.error("Password reset error:",x)}};return f?e.jsxs(oe,{children:[e.jsx("p",{children:"Your password has been successfully reset. You will be redirected to the login page shortly."}),e.jsx(E,{children:e.jsx("p",{children:e.jsx(R,{to:"/auth/login",children:"Back to login"})})})]}):e.jsxs(_,{onSubmit:q,children:[s&&e.jsx(re,{children:s}),e.jsxs(S,{children:[e.jsx(L,{htmlFor:"password",children:"New Password"}),e.jsx(C,{id:"password",type:"password",value:o,onChange:p=>m(p.target.value),required:!0,disabled:!l,placeholder:"••••••••"})]}),e.jsxs(S,{children:[e.jsx(L,{htmlFor:"confirmPassword",children:"Confirm New Password"}),e.jsx(C,{id:"confirmPassword",type:"password",value:a,onChange:p=>n(p.target.value),required:!0,disabled:!l,placeholder:"••••••••"})]}),e.jsx(ee,{type:"submit",disabled:u||!l,children:u?"Resetting Password...":"Reset Password"}),e.jsx(E,{children:e.jsx("p",{children:e.jsx(R,{to:"/auth/login",children:"Back to login"})})})]})},te=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
`,ae=r.div`
  margin-bottom: 2rem;
  text-align: center;
`,ne=r.h1`
  font-size: 1.75rem;
  color: var(--text-color, #1f2937);
  margin-bottom: 0.5rem;
`,ie=r.p`
  color: var(--text-secondary-color, #6b7280);
`,le=()=>{const o=N(),m=()=>o.pathname.includes("/register")?"Create an Account":o.pathname.includes("/forgot-password")?"Forgot Password":o.pathname.includes("/reset-password")?"Reset Password":"Welcome Back",a=()=>o.pathname.includes("/register")?"Join HugMeNow to start tracking your moods and connecting with others.":o.pathname.includes("/forgot-password")?"Enter your email to receive a password reset link.":o.pathname.includes("/reset-password")?"Create a new password for your account.":"Sign in to access your HugMeNow account.";return e.jsxs(te,{children:[e.jsxs(ae,{children:[e.jsx(ne,{children:m()}),e.jsx(ie,{children:a()})]}),e.jsxs(I,{children:[e.jsx(b,{path:"login",element:e.jsx(J,{})}),e.jsx(b,{path:"register",element:e.jsx(M,{})}),e.jsx(b,{path:"forgot-password",element:e.jsx(Z,{})}),e.jsx(b,{path:"reset-password",element:e.jsx(se,{})}),e.jsx(b,{path:"*",element:e.jsx(T,{to:"/auth/login",replace:!0})})]})]})};export{le as default};
