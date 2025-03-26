import{d as o,r as n,u as I,a as D,j as r,L as E,b as F}from"./main-35d8db85.js";const N=o.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: var(--spacing-md);
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, 
    var(--primary-lightest) 0%, 
    var(--background-color) 100%
  );
  
  &::before, &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    z-index: 0;
  }
  
  &::before {
    width: 30vw;
    height: 30vw;
    background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
    top: -8%;
    right: -8%;
    opacity: 0.05;
    animation: floatAnimation 15s ease-in-out infinite alternate;
    
    @keyframes floatAnimation {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(-30px, 30px) rotate(5deg); }
    }
  }
  
  &::after {
    width: 25vw;
    height: 25vw;
    background: linear-gradient(to right, var(--tertiary-color), var(--primary-color));
    bottom: -5%;
    left: -5%;
    opacity: 0.05;
    animation: floatAnimation2 10s ease-in-out infinite alternate-reverse;
    
    @keyframes floatAnimation2 {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(20px, -20px) rotate(-5deg); }
    }
  }
`,T=o.div`
  position: relative;
  z-index: 1;
  background: var(--glassmorph-bg);
  backdrop-filter: blur(var(--backdrop-blur));
  -webkit-backdrop-filter: blur(var(--backdrop-blur));
  border-radius: var(--radius-xl);
  border: 1px solid var(--glassmorph-border);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeInUp 0.5s ease-out forwards;
  
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
  }
`,Y=o.div`
  text-align: center;
  margin-bottom: var(--spacing-xl);
  
  h1 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s ease-in-out infinite;
    background-size: 200% 100%;
    
    @keyframes shimmer {
      0% { background-position: 100% 50%; }
      50% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
  }
  
  p {
    color: var(--text-tertiary);
    font-size: var(--font-size-md);
    font-weight: var(--font-weight-medium);
    margin-top: var(--spacing-xs);
  }
`,v=o.form`
  display: flex;
  flex-direction: column;
`,c=o.div`
  margin-bottom: var(--spacing-lg);
  position: relative;
`,m=o.label`
  display: block;
  margin-bottom: var(--spacing-xs);
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  transition: color 0.3s ease;
  
  ${c}:focus-within & {
    color: var(--primary-color);
  }
`,p=o.input`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-lg);
  color: var(--text-primary);
  font-size: var(--font-size-md);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  
  &::placeholder {
    color: var(--text-placeholder);
  }
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 3px var(--primary-alpha-10);
  }
  
  &:hover:not(:focus) {
    border-color: var(--input-border-hover);
  }
`,b=o.button`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(to right, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: all 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(to right, var(--primary-dark), var(--primary-darkest));
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    background: var(--gray-400);
    cursor: not-allowed;
    box-shadow: none;
    
    &::before {
      display: none;
    }
  }
`,P=o.div`
  background-color: var(--danger-alpha-10);
  color: var(--danger-dark);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  border-left: 4px solid var(--danger-color);
  font-size: var(--font-size-sm);
  display: flex;
  align-items: center;
  
  &::before {
    content: "!";
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--danger-color);
    border-radius: 50%;
    color: white;
    font-weight: bold;
    margin-right: var(--spacing-sm);
    flex-shrink: 0;
  }
`,x=o.div`
  text-align: center;
  margin-top: var(--spacing-lg);
  
  p {
    color: var(--text-tertiary);
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-sm);
  }
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: var(--font-weight-medium);
    transition: all 0.3s ease;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: -2px;
      left: 0;
      background-color: var(--primary-color);
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: var(--primary-dark);
      
      &::after {
        transform: scaleX(1);
        transform-origin: bottom left;
      }
    }
  }
`,O=o.div`
  display: flex;
  align-items: center;
  margin: var(--spacing-lg) 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid var(--gray-200);
  }
  
  span {
    padding: 0 var(--spacing-md);
    color: var(--text-tertiary);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`,X=o.button`
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--input-border);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-md);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: var(--spacing-md);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--gray-100);
    z-index: -1;
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.5s ease;
  }
  
  &:hover {
    color: var(--text-primary);
    border-color: var(--gray-300);
    
    &::before {
      transform: scaleX(1);
    }
  }
`,B=()=>{const[i,y]=n.useState(""),[g,w]=n.useState(""),[s,k]=n.useState(""),[j,u]=n.useState(!1),[l,d]=n.useState(!1),[h,t]=n.useState(""),{login:S,anonymousLogin:z,loading:L}=I(),f=D(),A=async a=>{if(a.preventDefault(),!i||!g){t("Please enter both email and password");return}d(!0),t("");try{console.log("Starting regular login with email:",i),await S(i,g),console.log("Regular login successful, setting redirect flag"),localStorage.setItem("redirectToDashboard","true"),console.log("Navigating to dashboard after login"),f("/dashboard",{replace:!0,state:{fromLogin:!0,loginTime:new Date().toISOString()}})}catch(e){console.error("Login error:",e),t(e.message||"Invalid email or password")}finally{d(!1)}},C=async a=>{if(a.preventDefault(),!s){t("Please enter a nickname");return}console.log("Starting anonymous login process with nickname:",s),d(!0),t("");try{console.log("Calling anonymousLogin from AuthContext");const e=await z(s);console.log("Anonymous login successful, received auth data:",JSON.stringify({...e,accessToken:e.accessToken?"[REDACTED]":void 0,user:e.user?{...e.user,id:e.user.id||"[MISSING ID]"}:null})),console.log("Forcing auth state refresh before navigation"),setTimeout(()=>{console.log("Attempting navigation to dashboard after successful login"),localStorage.setItem("redirectToDashboard","true"),f("/dashboard",{replace:!0,state:{fromLogin:!0,loginTime:new Date().toISOString()}}),console.log("Navigation completed")},500)}catch(e){console.error("Anonymous login error:",e),t(e.message||"Failed to login anonymously")}finally{d(!1)}};return L?r.jsx(E,{text:"Checking authentication..."}):r.jsx(N,{children:r.jsxs(T,{children:[r.jsxs(Y,{children:[r.jsx("h1",{children:"HugMeNow"}),r.jsx("p",{children:"Your emotional wellness companion"})]}),h&&r.jsx(P,{children:h}),j?r.jsxs(v,{onSubmit:C,children:[r.jsxs(c,{children:[r.jsx(m,{htmlFor:"nickname",children:"Nickname"}),r.jsx(p,{type:"text",id:"nickname",value:s,onChange:a=>k(a.target.value),placeholder:"Enter your nickname",required:!0})]}),r.jsx(b,{type:"submit",disabled:l,children:l?"Processing...":"Continue Anonymously"}),r.jsx(x,{children:r.jsx("p",{children:r.jsx("a",{href:"#",onClick:()=>u(!1),children:"Back to login"})})})]}):r.jsxs(r.Fragment,{children:[r.jsxs(v,{onSubmit:A,children:[r.jsxs(c,{children:[r.jsx(m,{htmlFor:"email",children:"Email"}),r.jsx(p,{type:"email",id:"email",value:i,onChange:a=>y(a.target.value),placeholder:"Enter your email",required:!0})]}),r.jsxs(c,{children:[r.jsx(m,{htmlFor:"password",children:"Password"}),r.jsx(p,{type:"password",id:"password",value:g,onChange:a=>w(a.target.value),placeholder:"Enter your password",required:!0})]}),r.jsx(b,{type:"submit",disabled:l,children:l?"Signing in...":"Sign In"})]}),r.jsx(O,{children:r.jsx("span",{children:"or"})}),r.jsx(X,{type:"button",onClick:()=>u(!0),children:"Continue Anonymously"}),r.jsx(x,{children:r.jsxs("p",{children:["Don't have an account?"," ",r.jsx(F,{to:"/register",children:"Sign Up"})]})})]})]})})};export{B as default};
//# sourceMappingURL=Login-5de04d0d.js.map
