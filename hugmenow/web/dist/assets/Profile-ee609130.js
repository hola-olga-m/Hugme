import{d as o,u as B,a as F,r as i,j as r,L as U}from"./main-0012ce0c.js";const A=o.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,E=o.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,L=o.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`,N=o.button`
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
`,z=o.main`
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
`,R=o.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,T=o.h1`
  color: var(--gray-800);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--gray-200);
`,G=o.form`
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
`,H=o.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    gap: 1rem;
  }
`,h=o.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`,I=o(h)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`,q=o(h)`
  background-color: white;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  
  &:hover:not(:disabled) {
    background-color: var(--danger-color);
    color: white;
  }
`,Y=o.div`
  background-color: var(--danger-color);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
`,J=o.div`
  background-color: var(--success-color);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: var(--border-radius-md);
  margin-bottom: 1.5rem;
`,K=o.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`,O=o.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-lg);
  max-width: 500px;
  width: 90%;
  
  h2 {
    color: var(--danger-color);
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`,Q=o.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`,V=o(h)`
  background-color: white;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  
  &:hover {
    background-color: var(--gray-100);
  }
`,W=o(h)`
  background-color: var(--danger-color);
  color: white;
  border: none;
  
  &:hover {
    background-color: var(--danger-dark);
  }
`,Z=()=>{const{currentUser:a,updateProfile:y,logout:j,loading:k}=B(),b=F(),[e,C]=i.useState({name:(a==null?void 0:a.name)||"",password:"",confirmPassword:"",avatarUrl:(a==null?void 0:a.avatarUrl)||""}),[t,l]=i.useState(!1),[P,p]=i.useState(!1),[v,d]=i.useState(""),[x,w]=i.useState(""),c=n=>{const{name:s,value:M}=n.target;C({...e,[s]:M})},D=async n=>{if(n.preventDefault(),e.password&&e.password!==e.confirmPassword){d("Passwords do not match");return}l(!0),d(""),w("");try{const s={name:e.name,...e.password?{password:e.password}:{},...e.avatarUrl?{avatarUrl:e.avatarUrl}:{}};await y(s),w("Profile updated successfully")}catch(s){console.error("Update error:",s),d(s.message||"Failed to update profile")}finally{l(!1)}},S=async()=>{l(!0),d("");try{await j(),b("/login")}catch(n){console.error("Delete account error:",n),d(n.message||"Failed to delete account"),p(!1)}finally{l(!1)}},f=()=>{b("/dashboard")};return k?r.jsx(U,{text:"Loading profile..."}):r.jsxs(A,{children:[r.jsxs(E,{children:[r.jsx(L,{onClick:f,children:"HugMeNow"}),r.jsx(N,{onClick:f,children:"Back to Dashboard"})]}),r.jsx(z,{children:r.jsxs(R,{children:[r.jsx(T,{children:"Your Profile"}),v&&r.jsx(Y,{children:v}),x&&r.jsx(J,{children:x}),r.jsxs(G,{onSubmit:D,children:[r.jsxs(m,{children:[r.jsx(u,{htmlFor:"name",children:"Full Name"}),r.jsx(g,{type:"text",id:"name",name:"name",value:e.name,onChange:c,placeholder:"Enter your full name",required:!0})]}),r.jsxs(m,{children:[r.jsx(u,{htmlFor:"avatarUrl",children:"Avatar URL (optional)"}),r.jsx(g,{type:"text",id:"avatarUrl",name:"avatarUrl",value:e.avatarUrl,onChange:c,placeholder:"Enter URL for your avatar image"})]}),r.jsxs(m,{children:[r.jsx(u,{htmlFor:"password",children:"New Password (leave blank to keep current)"}),r.jsx(g,{type:"password",id:"password",name:"password",value:e.password,onChange:c,placeholder:"Enter new password"})]}),r.jsxs(m,{children:[r.jsx(u,{htmlFor:"confirmPassword",children:"Confirm New Password"}),r.jsx(g,{type:"password",id:"confirmPassword",name:"confirmPassword",value:e.confirmPassword,onChange:c,placeholder:"Confirm new password"})]}),r.jsxs(H,{children:[r.jsx(q,{type:"button",onClick:()=>p(!0),disabled:t,children:"Delete Account"}),r.jsx(I,{type:"submit",disabled:t,children:t?"Saving...":"Save Changes"})]})]})]})}),P&&r.jsx(K,{children:r.jsxs(O,{children:[r.jsx("h2",{children:"Delete Account"}),r.jsx("p",{children:"Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."}),r.jsxs(Q,{children:[r.jsx(V,{type:"button",onClick:()=>p(!1),disabled:t,children:"Cancel"}),r.jsx(W,{type:"button",onClick:S,disabled:t,children:t?"Processing...":"Delete Account"})]})]})})]})};export{Z as default};
//# sourceMappingURL=Profile-ee609130.js.map
