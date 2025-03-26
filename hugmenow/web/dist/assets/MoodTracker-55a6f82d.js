import{d as o,r as n,u as x,a as v,j as r}from"./main-ce69c4d0.js";const w=o.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,y=o.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,f=o.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`,j=o.button`
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
`,k=o.main`
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
`,S=o.h1`
  color: var(--gray-800);
  margin-bottom: 1.5rem;
`,M=o.p`
  color: var(--gray-600);
  margin-bottom: 2rem;
`,T=o.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,C=o.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
`,h=o.h2`
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
`,N=o.div`
  margin-bottom: 2rem;
`,z=o.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`,I=o.input`
  flex: 1;
  -webkit-appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(
    to right, 
    var(--danger-color) 0%, 
    var(--warning-color) 50%, 
    var(--success-color) 100%
  );
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    border: 2px solid var(--primary-color);
    cursor: pointer;
  }
`,D=o.div`
  margin-left: 1rem;
  font-weight: bold;
  font-size: 1.25rem;
  min-width: 40px;
  color: ${a=>{const t=a.value;return t<=3?"var(--danger-color)":t<=7?"var(--warning-color)":"var(--success-color)"}};
`,H=o.div`
  display: flex;
  justify-content: space-between;
  
  span {
    font-size: 0.8rem;
    color: var(--gray-600);
  }
`,g=o.div`
  margin-bottom: 1.5rem;
`,P=o.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--gray-800);
`,B=o.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius-md);
  transition: var(--transition-base);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 102, 255, 0.25);
  }
`,E=o.div`
  display: flex;
  align-items: center;
  
  input {
    margin-right: 0.5rem;
  }
  
  label {
    font-weight: normal;
  }
`,F=o.button`
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
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
`,L=o.div`
  background-color: var(--gray-200);
  color: var(--gray-600);
  padding: 2rem;
  text-align: center;
  border-radius: var(--border-radius-md);
`,A=()=>{const[a,t]=n.useState(5),[i,s]=n.useState(""),[d,c]=n.useState(!1),[l,m]=n.useState(!1);x();const b=v(),u=()=>{b("/dashboard")},p=e=>{e.preventDefault(),m(!0),console.log("Submitting mood:",{moodScore:a,moodNote:i,isPublic:d}),setTimeout(()=>{t(5),s(""),c(!1),m(!1),alert("Mood submitted successfully!")},1e3)};return r.jsxs(w,{children:[r.jsxs(y,{children:[r.jsx(f,{onClick:u,children:"HugMeNow"}),r.jsx(j,{onClick:u,children:"Back to Dashboard"})]}),r.jsxs(k,{children:[r.jsx(S,{children:"Mood Tracker"}),r.jsx(M,{children:"Track your mood and emotional well-being. Regular tracking helps you understand patterns and improve self-awareness."}),r.jsxs(T,{children:[r.jsx(h,{children:"How are you feeling today?"}),r.jsxs("form",{onSubmit:p,children:[r.jsxs(N,{children:[r.jsxs(z,{children:[r.jsx(I,{type:"range",min:"1",max:"10",value:a,onChange:e=>t(parseInt(e.target.value))}),r.jsx(D,{value:a,children:a})]}),r.jsxs(H,{children:[r.jsx("span",{children:"Not well"}),r.jsx("span",{children:"Neutral"}),r.jsx("span",{children:"Excellent"})]})]}),r.jsxs(g,{children:[r.jsx(P,{htmlFor:"moodNote",children:"Add a note (optional)"}),r.jsx(B,{id:"moodNote",value:i,onChange:e=>s(e.target.value),placeholder:"Describe how you're feeling or what's been happening..."})]}),r.jsx(g,{children:r.jsxs(E,{children:[r.jsx("input",{type:"checkbox",id:"isPublic",checked:d,onChange:e=>c(e.target.checked)}),r.jsx("label",{htmlFor:"isPublic",children:"Share this mood entry with the community"})]})}),r.jsx(F,{type:"submit",disabled:l,children:l?"Submitting...":"Record Mood"})]})]}),r.jsxs(C,{children:[r.jsx(h,{children:"Your Mood History"}),r.jsxs(L,{children:[r.jsx("p",{children:"Your mood history will be displayed here once you start tracking."}),r.jsx("p",{children:"In the actual app, this would show a graph of your mood over time."})]})]})]})]})};export{A as default};
//# sourceMappingURL=MoodTracker-55a6f82d.js.map
