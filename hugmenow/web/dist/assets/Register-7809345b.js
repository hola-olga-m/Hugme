import{d as o,r as c,u as R,a as E,j as r,L as q,b as L}from"./main-c60bfe80.js";const D=o.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--gray-100);
`,N=o.div`
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
`,b=o.form`
  display: flex;
  flex-direction: column;
`,t=o.div`
  margin-bottom: 1.5rem;
`,i=o.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-800);
`,d=o.input`
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
`,y=o.button`
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
`,I=o.div`
  background-color: var(--danger-color);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
`,v=o.div`
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
`,M=o.div`
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
`,z=o.button`
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
`,H=()=>{const[e,f]=c.useState({username:"",email:"",name:"",password:"",confirmPassword:""}),[h,w]=c.useState(""),[j,g]=c.useState(!1),[m,u]=c.useState(!1),[p,a]=c.useState(""),{register:k,anonymousLogin:C,loading:F}=R(),x=E(),l=n=>{const{name:s,value:A}=n.target;f({...e,[s]:A})},P=async n=>{if(n.preventDefault(),!e.username||!e.email||!e.name||!e.password){a("Please fill in all required fields");return}if(e.password!==e.confirmPassword){a("Passwords do not match");return}if(e.password.length<6){a("Password must be at least 6 characters long");return}u(!0),a("");try{await k({username:e.username,email:e.email,name:e.name,password:e.password}),x("/dashboard")}catch(s){console.error("Registration error:",s),a(s.message||"Registration failed")}finally{u(!1)}},S=async n=>{if(n.preventDefault(),!h){a("Please enter a nickname");return}u(!0),a("");try{await C(h),x("/dashboard")}catch(s){console.error("Anonymous login error:",s),a(s.message||"Failed to login anonymously")}finally{u(!1)}};return F?r.jsx(q,{text:"Checking authentication..."}):r.jsx(D,{children:r.jsxs(N,{children:[r.jsxs(B,{children:[r.jsx("h1",{children:"HugMeNow"}),r.jsx("p",{children:"Create your account"})]}),p&&r.jsx(I,{children:p}),j?r.jsxs(b,{onSubmit:S,children:[r.jsxs(t,{children:[r.jsx(i,{htmlFor:"nickname",children:"Nickname"}),r.jsx(d,{type:"text",id:"nickname",value:h,onChange:n=>w(n.target.value),placeholder:"Enter your nickname",required:!0})]}),r.jsx(y,{type:"submit",disabled:m,children:m?"Processing...":"Continue Anonymously"}),r.jsx(v,{children:r.jsx("p",{children:r.jsx("a",{href:"#",onClick:()=>g(!1),children:"Back to registration"})})})]}):r.jsxs(r.Fragment,{children:[r.jsxs(b,{onSubmit:P,children:[r.jsxs(t,{children:[r.jsx(i,{htmlFor:"username",children:"Username"}),r.jsx(d,{type:"text",id:"username",name:"username",value:e.username,onChange:l,placeholder:"Choose a username",required:!0})]}),r.jsxs(t,{children:[r.jsx(i,{htmlFor:"email",children:"Email"}),r.jsx(d,{type:"email",id:"email",name:"email",value:e.email,onChange:l,placeholder:"Enter your email",required:!0})]}),r.jsxs(t,{children:[r.jsx(i,{htmlFor:"name",children:"Full Name"}),r.jsx(d,{type:"text",id:"name",name:"name",value:e.name,onChange:l,placeholder:"Enter your full name",required:!0})]}),r.jsxs(t,{children:[r.jsx(i,{htmlFor:"password",children:"Password"}),r.jsx(d,{type:"password",id:"password",name:"password",value:e.password,onChange:l,placeholder:"Create a password (min. 6 characters)",required:!0})]}),r.jsxs(t,{children:[r.jsx(i,{htmlFor:"confirmPassword",children:"Confirm Password"}),r.jsx(d,{type:"password",id:"confirmPassword",name:"confirmPassword",value:e.confirmPassword,onChange:l,placeholder:"Confirm your password",required:!0})]}),r.jsx(y,{type:"submit",disabled:m,children:m?"Creating account...":"Create Account"})]}),r.jsx(M,{children:r.jsx("span",{children:"or"})}),r.jsx(z,{type:"button",onClick:()=>g(!0),children:"Continue Anonymously"}),r.jsx(v,{children:r.jsxs("p",{children:["Already have an account?"," ",r.jsx(L,{to:"/login",children:"Sign In"})]})})]})]})})};export{H as default};
//# sourceMappingURL=Register-7809345b.js.map
