import{m as D,d as i,j as e,u as T,r as w,a as B,L as z}from"./main-e7991d53.js";import{u as b,G as L,E as A,a as I,b as R}from"./ErrorMessage-2faaaf6f.js";import{m as g}from"./motion-eb880a85.js";import{A as G}from"./index-c290c4ab.js";const V=D`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,$=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`,W=i.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${V} 1s linear infinite;
`,N=i.div`
  margin-top: 1rem;
  color: var(--gray-600);
  font-size: 0.9rem;
`,P=({text:r="Loading..."})=>e.jsxs($,{children:[e.jsx(W,{}),r&&e.jsx(N,{children:r})]}),j=i.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,C=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
`,k=i.button`
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
`,U=i.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,_=i.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`,Y=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,Z=i.div`
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
`,O=i.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,q=i.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`,Q=i.div`
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
`,X=i.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,J=r=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(r)-1,4)],K=r=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(r)-1,4)],ee=r=>new Date(r).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),re=r=>r?r.split(" ").map(n=>n[0]).join("").toUpperCase().substring(0,2):"?",ie=()=>{const{loading:r,error:n,data:a,refetch:c}=b(L);if(r)return e.jsx(P,{text:"Loading public moods..."});if(n)return e.jsx(A,{error:n});const l=(a==null?void 0:a.publicMoods)||[];return l.length===0?e.jsxs(j,{children:[e.jsxs(C,{children:[e.jsx("h2",{children:"Community Moods"}),e.jsx(k,{onClick:()=>c(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsxs(X,{children:[e.jsx("p",{children:"No public moods have been shared yet."}),e.jsx("p",{children:"The community mood board will populate as users share their feelings."})]})]}):e.jsxs(j,{children:[e.jsxs(C,{children:[e.jsx("h2",{children:"Community Moods"}),e.jsx(k,{onClick:()=>c(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsx(U,{children:l.map(o=>{var t,s;return e.jsxs(_,{children:[e.jsxs(Y,{children:[e.jsxs(Z,{children:[e.jsx("span",{className:"emoji",children:J(o.score)}),e.jsx("span",{className:"label",children:K(o.score)})]}),e.jsx(O,{children:ee(o.createdAt)})]}),o.note&&e.jsx(q,{children:o.note}),e.jsxs(Q,{children:[e.jsx("div",{className:"avatar",children:re((t=o.user)==null?void 0:t.name)}),e.jsx("span",{children:((s=o.user)==null?void 0:s.name)||"Anonymous User"})]})]},o.id)})})]})},oe="/assets/happy-face-8e76819c.svg",te="/assets/hug-icon-a65e4efe.svg",ae="/assets/mood-tracker-8aaefd8f.svg",ne="/assets/community-ef14f86f.svg",se="/assets/ComfortingHug-7b35f3f0.png",le="/assets/EnthusiasticHug-34cb3319.png",de="/assets/GroupHug-720ddcec.png",H="/assets/StandardHug-fced95c7.png",ce="/assets/SupportiveHug-de556136.png",ge="/assets/VirtualHug-f24120c7.png",pe="/assets/RelaxingHug-b42c8043.png",he="/assets/WelcomeHug-41a086c9.png",me="/assets/FriendlyHug-108d9a39.png",ue="/assets/GentleHug-9e995eae.png",xe="/assets/FamilyHug-e5aea984.png",ve="/assets/SmilingHug-06fbeb08.png",fe={verySad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 45C40 45 45 40 50 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 45C70 45 75 40 80 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 85C40 85 60 75 80 85' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",sad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 80C40 80 60 70 80 80' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",neutral:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 75C40 75 60 75 80 75' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",happy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 70C40 70 60 80 80 70' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",veryHappy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M35 45C35 45 40 40 45 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M75 45C75 45 80 40 85 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M35 65C35 65 60 90 85 65' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E"},ye="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23EC4899'/%3E%3C/svg%3E",be="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2c3 4 5 6 9 7-4 4-7 8-7 13H10c0-5-3-9-7-13 4-1 6-3 9-7z' fill='%23F59E0B'/%3E%3C/svg%3E",p=({type:r,score:n,size:a=40,animate:c=!0,...l})=>{if(r==="mood"&&n!==void 0){let s;if(n===null)return e.jsx("div",{style:{width:a,height:a}});n>=8.5?s="veryHappy":n>=7?s="happy":n>=5?s="neutral":n>=3?s="sad":s="verySad";const d=fe[s];return c?e.jsx(g.img,{src:d,alt:`Mood level: ${s}`,width:a,height:a,initial:{scale:0},animate:{scale:1,rotate:[0,10,-10,0]},transition:{type:"spring",damping:10,stiffness:100,delay:.3},...l}):e.jsx("img",{src:d,alt:`Mood level: ${s}`,width:a,height:a,...l})}let o,t;switch(r){case"happyFace":o=oe,t="Happy Face";break;case"hugIcon":o=te,t="Hug Icon";break;case"moodTracker":o=ae,t="Mood Tracker";break;case"community":o=ne,t="Community";break;case"heart":o=ye,t="Heart";break;case"fire":o=be,t="Fire";break;case"Comforting":case"ComfortingHug":o=se,t="Comforting Hug";break;case"Enthusiastic":case"EnthusiasticHug":o=le,t="Enthusiastic Hug";break;case"Group":case"GroupHug":o=de,t="Group Hug";break;case"Standard":case"StandardHug":o=H,t="Standard Hug";break;case"Supportive":case"SupportiveHug":o=ce,t="Supportive Hug";break;case"Virtual":case"VirtualHug":o=ge,t="Virtual Hug";break;case"Relaxing":case"RelaxingHug":o=pe,t="Relaxing Hug";break;case"Welcome":case"WelcomeHug":o=he,t="Welcome Hug";break;case"Friendly":case"FriendlyHug":o=me,t="Friendly Hug";break;case"Gentle":case"GentleHug":o=ue,t="Gentle Hug";break;case"Family":case"FamilyHug":o=xe,t="Family Hug";break;case"Smiling":case"SmilingHug":o=ve,t="Smiling Hug";break;default:if(r&&r.includes("Hug"))o=H,t=r;else return null}return c?t&&t.includes("Hug")?e.jsx(g.img,{src:o,alt:t,width:a,height:a,initial:{scale:0,rotate:-5},animate:{scale:1,rotate:0,y:[0,-5,0]},whileHover:{scale:1.1,rotate:[-2,2,-2,0],transition:{rotate:{repeat:0,duration:.5},scale:{duration:.2}}},transition:{type:"spring",damping:12,stiffness:150,delay:.2,y:{repeat:1/0,repeatType:"reverse",duration:1.5,ease:"easeInOut"}},...l}):e.jsx(g.img,{src:o,alt:t,width:a,height:a,initial:{scale:0},animate:{scale:1},transition:{type:"spring",damping:15,stiffness:200,delay:.2},...l}):e.jsx("img",{src:o,alt:t,width:a,height:a,...l})},E=i.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 24px;
  margin-bottom: 24px;
  overflow: hidden;
  position: relative;
`,F=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`,S=i.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,we=i.span`
  background-color: var(--primary-color);
  color: white;
  border-radius: 20px;
  padding: 3px 10px;
  font-size: 0.85rem;
  font-weight: 600;
`,je=i.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 12px;
`,Ce=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
  
  h4 {
    margin: 16px 0 8px;
    color: var(--gray-700);
  }
  
  p {
    color: var(--gray-500);
    max-width: 360px;
    margin: 0 auto;
  }
`,ke={hidden:{opacity:0,y:20},visible:r=>({opacity:1,y:0,transition:{delay:r*.1,duration:.4,ease:[.2,.65,.3,.9]}})},He=({hugs:r=[]})=>{const n=r.filter(a=>!a.isRead).length;return r.length===0?e.jsxs(E,{children:[e.jsx(F,{children:e.jsxs(S,{children:[e.jsx(p,{type:"hugIcon",size:24}),"Received Hugs"]})}),e.jsxs(Ce,{children:[e.jsx(p,{type:"ComfortingHug",size:80,animate:!0}),e.jsx("h4",{children:"No hugs yet"}),e.jsx("p",{children:"When someone sends you a hug, it will appear here. Why not send a hug to a friend first?"})]})]}):e.jsxs(E,{children:[e.jsx(F,{children:e.jsxs(S,{children:[e.jsx(p,{type:"hugIcon",size:24}),"Received Hugs",n>0&&e.jsxs(we,{children:[n," new"]})]})}),e.jsx(je,{children:e.jsx(G,{children:r.map((a,c)=>e.jsx(Le,{hug:a,index:c,isNew:!a.isRead},a.id))})})]})},Ee=i(g.div)`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 16px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
  
  ${r=>r.isNew&&`
    border-left: 3px solid var(--primary-color);
    background-color: var(--primary-lightest);
  `}
`,Fe=i.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--primary-color);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 12px;
  z-index: 2;
`,Se=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 1;
`,Me=i.div`
  margin-bottom: 12px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 4px;
    background: ${r=>r.color||"var(--primary-color)"};
    border-radius: 2px;
    opacity: 0.5;
  }
`,De=i.div`
  margin-top: 16px;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--gray-700);
`,Te=i.div`
  font-size: 0.8rem;
  color: var(--gray-500);
  margin-bottom: 12px;
`,Be=i.div`
  background-color: ${r=>`${r.color}10`||"rgba(0,0,0,0.03)"};
  padding: 10px 12px;
  border-radius: 8px;
  font-style: italic;
  color: var(--gray-600);
  font-size: 0.9rem;
  margin-top: 8px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`,ze=i.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.04;
  z-index: 0;
  pointer-events: none;
  
  svg {
    width: 100%;
    height: 100%;
  }
`,Le=({hug:r,index:n,isNew:a})=>{var d,h;const c=v=>({ComfortingHug:"#9D65C9",EnthusiasticHug:"#FF7043",GroupHug:"#4CAF50",StandardHug:"#FFC107",SupportiveHug:"#5C6BC0",VirtualHug:"#7E57C2",RelaxingHug:"#26A69A",WelcomeHug:"#42A5F5",FriendlyHug:"#66BB6A",GentleHug:"#AB47BC",FamilyHug:"#EF5350",SmilingHug:"#FFA726"})[v]||"#4A90E2",l=v=>{const m=new Date(v),M=new Date-m,u=Math.floor(M/(1e3*60*60*24));return u===0?`Today at ${m.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}`:u===1?"Yesterday":u<7?`${u} days ago`:m.toLocaleDateString()},o=r.type||"StandardHug",t=c(o),s=((d=r.sender)==null?void 0:d.name)||((h=r.sender)==null?void 0:h.username)||"Anonymous";return e.jsxs(Ee,{variants:ke,initial:"hidden",animate:"visible",custom:n,exit:"hidden",isNew:a,children:[a&&e.jsx(Fe,{children:"New"}),e.jsx(ze,{children:e.jsxs("svg",{viewBox:"0 0 200 200",fill:"none",children:[e.jsx("circle",{cx:"180",cy:"20",r:"60",fill:t}),e.jsx("circle",{cx:"20",cy:"180",r:"40",fill:t})]})}),e.jsxs(Se,{children:[e.jsx(Me,{color:t,children:e.jsx(p,{type:o,size:64,animate:!0})}),e.jsx("h4",{style:{margin:"12px 0 4px",color:t},children:o.replace(/([A-Z])/g," $1").trim()}),e.jsxs(De,{children:["From: ",s]}),e.jsx(Te,{children:l(r.createdAt||new Date)}),r.message&&e.jsxs(Be,{color:t,children:['"',r.message,'"']})]})]})},Ae=i.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,Ie=i(g.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
`,Re=i.div`
  font-size: 2.8rem;
  font-weight: 700;
  margin: 12px 0;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
`,Ge=i.div`
  font-size: 1rem;
  color: var(--gray-600);
  position: relative;
  z-index: 1;
`,Ve=i.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${r=>r.bgColor||"var(--primary-lightest)"};
  color: ${r=>r.iconColor||"var(--primary-color)"};
  position: relative;
  z-index: 1;
`,$e=i.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  opacity: 0.04;
  z-index: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`,We={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.15}}},Ne={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{type:"spring",damping:12,stiffness:200}}},Pe=()=>{const{data:r,loading:n}=b(I),{data:a,loading:c}=b(R),l=(r==null?void 0:r.userStats)||{moodStreak:0,totalMoodEntries:0,hugsSent:0,hugsReceived:0},o=(a==null?void 0:a.receivedHugs)||[],t=[{label:"Day Streak",value:l.moodStreak,icon:"fire",color:"#FF9800",bgColor:"#FFF3E0",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#FF9800"})})},{label:"Moods Tracked",value:l.totalMoodEntries,icon:"moodTracker",color:"#4CAF50",bgColor:"#E8F5E9",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#4CAF50"})})},{label:"Hugs Sent",value:l.hugsSent,icon:"StandardHug",color:"#5C6BC0",bgColor:"#E8EAF6",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#5C6BC0"})})},{label:"Hugs Received",value:l.hugsReceived,icon:"ComfortingHug",color:"#9D65C9",bgColor:"#F3E5F5",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#9D65C9"})})}];return n||c?e.jsx("div",{children:"Loading dashboard stats..."}):e.jsxs("div",{children:[e.jsx(Ae,{as:g.div,variants:We,initial:"hidden",animate:"visible",children:t.map((s,d)=>e.jsxs(Ie,{variants:Ne,children:[e.jsx(Ve,{bgColor:s.bgColor,iconColor:s.color,children:e.jsx(p,{type:s.icon,size:28})}),e.jsx(Re,{style:{color:s.color},children:s.value}),e.jsx(Ge,{children:s.label}),e.jsx($e,{children:s.decoration})]},d))}),e.jsx(He,{hugs:o})]})},Ue=i.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,_e=i.header`
  background-color: white;
  padding: 1rem 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,Ye=i.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
`,Ze=i.div`
  display: flex;
  align-items: center;
`,Oe=i(g.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
`,qe=i.span`
  font-weight: 500;
  margin-right: 1rem;
`,Qe=i(g.button)`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  
  &:hover {
    color: var(--danger-color);
    background-color: var(--gray-100);
  }
`,Xe=i.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,Je=i(g.div)`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  h1 {
    margin-bottom: 1rem;
    color: var(--gray-800);
    position: relative;
    z-index: 1;
  }
  
  p {
    color: var(--gray-600);
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
    max-width: 700px;
  }
`,Ke=i.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  opacity: 0.05;
  z-index: 0;
  pointer-events: none;
`,er=i(g.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
`,f=i(g.div)`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
  }
  
  p {
    color: var(--gray-600);
    position: relative;
    z-index: 1;
  }
`,y=i.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
`,x={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.5,ease:[.22,1,.36,1]}}},rr={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},sr=()=>{const{currentUser:r,logout:n}=T(),[a,c]=w.useState(!0),l=B();w.useEffect(()=>{const d=localStorage.getItem("redirectToDashboard")==="true";d&&(console.log("Dashboard detected redirect flag from login"),localStorage.removeItem("redirectToDashboard"));const h=setTimeout(()=>{c(!1),d&&console.log("Dashboard fully loaded after login redirect")},1e3);return()=>clearTimeout(h)},[]);const o=async()=>{await n(),l("/login")},t=d=>{l(d)},s=d=>d?d.split(" ").map(h=>h[0]).join("").toUpperCase().substring(0,2):"?";return a?e.jsx(z,{text:"Loading dashboard..."}):e.jsxs(Ue,{children:[e.jsxs(_e,{children:[e.jsxs(Ye,{children:[e.jsx(p,{type:"hugIcon",size:28}),"HugMeNow"]}),e.jsxs(Ze,{children:[e.jsx(Oe,{initial:{scale:0},animate:{scale:1},transition:{type:"spring",bounce:.5},whileHover:{scale:1.1},children:s(r==null?void 0:r.name)}),e.jsx(qe,{children:(r==null?void 0:r.name)||"Guest"}),e.jsx(Qe,{onClick:o,whileHover:{scale:1.05},whileTap:{scale:.95},children:"Logout"})]})]}),e.jsxs(Xe,{children:[e.jsxs(Je,{initial:"hidden",animate:"visible",variants:x,children:[e.jsx(Ke,{children:e.jsxs("svg",{viewBox:"0 0 300 200",fill:"none",children:[e.jsx("circle",{cx:"250",cy:"50",r:"200",fill:"var(--primary-color)"}),e.jsx("circle",{cx:"50",cy:"150",r:"100",fill:"var(--primary-color)"})]})}),e.jsxs("h1",{children:["Welcome, ",(r==null?void 0:r.name)||"Friend","!"]}),e.jsx("p",{children:"This is your personal dashboard where you can track your mood, send and receive virtual hugs, and connect with others."})]}),e.jsx(Pe,{}),e.jsxs(er,{variants:rr,initial:"hidden",animate:"visible",children:[e.jsxs(f,{onClick:()=>t("/mood-tracker"),variants:x,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(y,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"var(--primary-color)"})})}),e.jsxs("h2",{children:[e.jsx(p,{type:"moodTracker",size:24}),"Mood Tracker"]}),e.jsx("p",{children:"Track your daily mood and see patterns in your emotional wellbeing over time."})]}),e.jsxs(f,{onClick:()=>t("/hug-center"),variants:x,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(y,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#9D65C9"})})}),e.jsxs("h2",{children:[e.jsx(p,{type:"ComfortingHug",size:28}),"Hug Center"]}),e.jsx("p",{children:"Send virtual hugs to friends or request hugs from the community when you need support."})]}),e.jsxs(f,{onClick:()=>t("/profile"),variants:x,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(y,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#4CAF50"})})}),e.jsxs("h2",{children:[e.jsx(p,{type:"profile",size:24}),"Profile"]}),e.jsx("p",{children:"Manage your personal information, preferences, and privacy settings."})]})]}),e.jsx("div",{style:{marginTop:"2rem"},children:e.jsx(ie,{})})]})]})};export{sr as default};
//# sourceMappingURL=Dashboard-fe69b515.js.map
