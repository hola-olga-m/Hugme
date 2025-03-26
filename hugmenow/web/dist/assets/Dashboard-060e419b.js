import{m as f,d as e,j as r,u as y,r as p,a as w,L as M}from"./main-3e74ada0.js";import{u as S,G as k,E as C}from"./ErrorMessage-80a309c9.js";const L=f`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,D=e.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`,T=e.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${L} 1s linear infinite;
`,z=e.div`
  margin-top: 1rem;
  color: var(--gray-600);
  font-size: 0.9rem;
`,H=({text:o="Loading..."})=>r.jsxs(D,{children:[r.jsx(T,{}),o&&r.jsx(z,{children:o})]}),x=e.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,v=e.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
`,b=e.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`,R=e.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,E=e.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`,I=e.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,N=e.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .emoji {
    font-size: 1.5rem;
  }
  
  .label {
    font-weight: 500;
    color: var(--gray-800);
  }
`,F=e.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,A=e.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`,G=e.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--gray-600);
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.7rem;
    margin-right: 0.5rem;
  }
`,P=e.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,B=o=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(o)-1,4)],U=o=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(o)-1,4)],O=o=>new Date(o).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),V=o=>o?o.split(" ").map(n=>n[0]).join("").toUpperCase().substring(0,2):"?",W=()=>{const{loading:o,error:n,data:i,refetch:c}=S(k);if(o)return r.jsx(H,{text:"Loading public moods..."});if(n)return r.jsx(C,{error:n});const a=(i==null?void 0:i.publicMoods)||[];return a.length===0?r.jsxs(x,{children:[r.jsxs(v,{children:[r.jsx("h2",{children:"Community Moods"}),r.jsx(b,{onClick:()=>c(),children:r.jsx("span",{children:"Refresh"})})]}),r.jsxs(P,{children:[r.jsx("p",{children:"No public moods have been shared yet."}),r.jsx("p",{children:"The community mood board will populate as users share their feelings."})]})]}):r.jsxs(x,{children:[r.jsxs(v,{children:[r.jsx("h2",{children:"Community Moods"}),r.jsx(b,{onClick:()=>c(),children:r.jsx("span",{children:"Refresh"})})]}),r.jsx(R,{children:a.map(t=>{var d,l;return r.jsxs(E,{children:[r.jsxs(I,{children:[r.jsxs(N,{children:[r.jsx("span",{className:"emoji",children:B(t.score)}),r.jsx("span",{className:"label",children:U(t.score)})]}),r.jsx(F,{children:O(t.createdAt)})]}),t.note&&r.jsx(A,{children:t.note}),r.jsxs(G,{children:[r.jsx("div",{className:"avatar",children:V((d=t.user)==null?void 0:d.name)}),r.jsx("span",{children:((l=t.user)==null?void 0:l.name)||"Anonymous User"})]})]},t.id)})})]})},Y=e.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,_=e.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,$=e.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
`,q=e.div`
  display: flex;
  align-items: center;
`,Q=e.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
`,J=e.span`
  font-weight: 500;
  margin-right: 1rem;
`,K=e.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`,X=e.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,Z=e.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  
  h1 {
    margin-bottom: 1rem;
    color: var(--gray-800);
  }
  
  p {
    color: var(--gray-600);
    margin-bottom: 1.5rem;
  }
`,rr=e.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`,u=e.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--gray-600);
  }
`,er=e.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`,h=e.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  text-align: center;
  
  h3 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-600);
    font-size: 0.9rem;
  }
`,nr=()=>{const{currentUser:o,logout:n}=y(),[i,c]=p.useState(!0),[a,t]=p.useState({moodStreak:0,totalMoods:0,hugsSent:0,hugsReceived:0}),d=w();p.useEffect(()=>{const s=localStorage.getItem("redirectToDashboard")==="true";s&&(console.log("Dashboard detected redirect flag from login"),localStorage.removeItem("redirectToDashboard"));const g=setTimeout(()=>{t({moodStreak:3,totalMoods:15,hugsSent:7,hugsReceived:12}),c(!1),s&&console.log("Dashboard fully loaded after login redirect")},1e3);return()=>clearTimeout(g)},[]);const l=async()=>{await n(),d("/login")},m=s=>{d(s)},j=s=>s?s.split(" ").map(g=>g[0]).join("").toUpperCase().substring(0,2):"?";return i?r.jsx(M,{text:"Loading dashboard..."}):r.jsxs(Y,{children:[r.jsxs(_,{children:[r.jsx($,{children:"HugMeNow"}),r.jsxs(q,{children:[r.jsx(Q,{children:j(o==null?void 0:o.name)}),r.jsx(J,{children:(o==null?void 0:o.name)||"Guest"}),r.jsx(K,{onClick:l,children:"Logout"})]})]}),r.jsxs(X,{children:[r.jsxs(Z,{children:[r.jsxs("h1",{children:["Welcome, ",(o==null?void 0:o.name)||"Friend","!"]}),r.jsx("p",{children:"This is your personal dashboard where you can track your mood, send and receive virtual hugs, and connect with others."})]}),r.jsxs(er,{children:[r.jsxs(h,{children:[r.jsx("h3",{children:a.moodStreak}),r.jsx("p",{children:"Day Streak"})]}),r.jsxs(h,{children:[r.jsx("h3",{children:a.totalMoods}),r.jsx("p",{children:"Moods Tracked"})]}),r.jsxs(h,{children:[r.jsx("h3",{children:a.hugsSent}),r.jsx("p",{children:"Hugs Sent"})]}),r.jsxs(h,{children:[r.jsx("h3",{children:a.hugsReceived}),r.jsx("p",{children:"Hugs Received"})]})]}),r.jsxs(rr,{children:[r.jsxs(u,{onClick:()=>m("/mood-tracker"),children:[r.jsx("h2",{children:"Mood Tracker"}),r.jsx("p",{children:"Track your daily mood and see patterns in your emotional wellbeing over time."})]}),r.jsxs(u,{onClick:()=>m("/hug-center"),children:[r.jsx("h2",{children:"Hug Center"}),r.jsx("p",{children:"Send virtual hugs to friends or request hugs from the community when you need support."})]}),r.jsxs(u,{onClick:()=>m("/profile"),children:[r.jsx("h2",{children:"Profile"}),r.jsx("p",{children:"Manage your personal information, preferences, and privacy settings."})]})]}),r.jsx("div",{style:{marginTop:"2rem"},children:r.jsx(W,{})})]})]})};export{nr as default};
//# sourceMappingURL=Dashboard-060e419b.js.map
