import{d as r,j as o,b as e}from"./main-9bd93a15.js";const t=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--gray-100);
  padding: 2rem;
  text-align: center;
`,n=r.h1`
  font-size: 8rem;
  color: var(--primary-color);
  margin: 0;
  line-height: 1;
  
  @media (max-width: 768px) {
    font-size: 6rem;
  }
`,i=r.h2`
  font-size: 2rem;
  color: var(--gray-800);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`,a=r.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
  max-width: 500px;
`,d=r(e)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--primary-dark);
    text-decoration: none;
  }
`,c=()=>o.jsxs(t,{children:[o.jsx(n,{children:"404"}),o.jsx(i,{children:"Page Not Found"}),o.jsx(a,{children:"The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."}),o.jsx(d,{to:"/",children:"Return to Home"})]});export{c as default};
//# sourceMappingURL=NotFound-fc05dd37.js.map
