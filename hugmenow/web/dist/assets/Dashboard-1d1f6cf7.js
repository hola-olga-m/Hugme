import{d as e,u as v,r as i,a as j,j as r,L as b}from"./main-ce69c4d0.js";const f=e.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,y=e.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,w=e.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
`,k=e.div`
  display: flex;
  align-items: center;
`,S=e.div`
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
`,C=e.span`
  font-weight: 500;
  margin-right: 1rem;
`,L=e.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`,M=e.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,T=e.div`
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
`,D=e.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`,d=e.div`
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
`,H=e.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`,s=e.div`
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
`,F=()=>{const{currentUser:o,logout:l}=v(),[h,g]=i.useState(!0),[t,m]=i.useState({moodStreak:0,totalMoods:0,hugsSent:0,hugsReceived:0}),c=j();i.useEffect(()=>{const a=setTimeout(()=>{m({moodStreak:3,totalMoods:15,hugsSent:7,hugsReceived:12}),g(!1)},1e3);return()=>clearTimeout(a)},[]);const u=async()=>{await l(),c("/login")},n=a=>{c(a)},x=a=>a?a.split(" ").map(p=>p[0]).join("").toUpperCase().substring(0,2):"?";return h?r.jsx(b,{text:"Loading dashboard..."}):r.jsxs(f,{children:[r.jsxs(y,{children:[r.jsx(w,{children:"HugMeNow"}),r.jsxs(k,{children:[r.jsx(S,{children:x(o==null?void 0:o.name)}),r.jsx(C,{children:(o==null?void 0:o.name)||"Guest"}),r.jsx(L,{onClick:u,children:"Logout"})]})]}),r.jsxs(M,{children:[r.jsxs(T,{children:[r.jsxs("h1",{children:["Welcome, ",(o==null?void 0:o.name)||"Friend","!"]}),r.jsx("p",{children:"This is your personal dashboard where you can track your mood, send and receive virtual hugs, and connect with others."})]}),r.jsxs(H,{children:[r.jsxs(s,{children:[r.jsx("h3",{children:t.moodStreak}),r.jsx("p",{children:"Day Streak"})]}),r.jsxs(s,{children:[r.jsx("h3",{children:t.totalMoods}),r.jsx("p",{children:"Moods Tracked"})]}),r.jsxs(s,{children:[r.jsx("h3",{children:t.hugsSent}),r.jsx("p",{children:"Hugs Sent"})]}),r.jsxs(s,{children:[r.jsx("h3",{children:t.hugsReceived}),r.jsx("p",{children:"Hugs Received"})]})]}),r.jsxs(D,{children:[r.jsxs(d,{onClick:()=>n("/mood-tracker"),children:[r.jsx("h2",{children:"Mood Tracker"}),r.jsx("p",{children:"Track your daily mood and see patterns in your emotional wellbeing over time."})]}),r.jsxs(d,{onClick:()=>n("/hug-center"),children:[r.jsx("h2",{children:"Hug Center"}),r.jsx("p",{children:"Send virtual hugs to friends or request hugs from the community when you need support."})]}),r.jsxs(d,{onClick:()=>n("/profile"),children:[r.jsx("h2",{children:"Profile"}),r.jsx("p",{children:"Manage your personal information, preferences, and privacy settings."})]})]})]})]})};export{F as default};
//# sourceMappingURL=Dashboard-1d1f6cf7.js.map
