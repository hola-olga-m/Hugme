import{m as Ie,d as r,j as e,r as l,u as Be,a as Ye,L as Ve}from"./main-0012ce0c.js";import{u as De,G as Oe,E as Ge,a as Xe,b as _e,S as qe}from"./mutations-a04fa3c5.js";import{m as w}from"./motion-e813246d.js";import{u as Q}from"./useMeshSdk-3d4c1d79.js";import{F as Qe,a as Je,b as Y,c as le,d as Pe,e as re,f as Re,g as Ze,h as Ae,i as ue,j as We,k as he,l as me}from"./index.esm-6afec3ae.js";import{A as V}from"./index-823a7d64.js";const Ke=Ie`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,et=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`,tt=r.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${Ke} 1s linear infinite;
`,rt=r.div`
  margin-top: 1rem;
  color: var(--gray-600);
  font-size: 0.9rem;
`,nt=({text:t="Loading..."})=>e.jsxs(et,{children:[e.jsx(tt,{}),t&&e.jsx(rt,{children:t})]}),xe=r.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,fe=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
`,be=r.button`
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
`,it=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,at=r.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`,ot=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,st=r.div`
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
`,ct=r.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,dt=r.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`,lt=r.div`
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
`,ut=r.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,gt=t=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(t/2)-1,4)],pt=t=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(t/2)-1,4)],ht=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),mt=t=>t?t.split(" ").map(i=>i[0]).join("").toUpperCase().substring(0,2):"?",xt=()=>{const{loading:t,error:i,data:n,refetch:d}=De(Oe);if(t)return e.jsx(nt,{text:"Loading friends' moods..."});if(i)return e.jsx(Ge,{error:i});const o=(n==null?void 0:n.friendsMoods)||[];return o.length===0?e.jsxs(xe,{children:[e.jsxs(fe,{children:[e.jsx("h2",{children:"Friends' Moods"}),e.jsx(be,{onClick:()=>d(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsxs(ut,{children:[e.jsx("p",{children:"No friend moods have been shared yet."}),e.jsx("p",{children:"Your friends' mood board will populate as they share their feelings."})]})]}):e.jsxs(xe,{children:[e.jsxs(fe,{children:[e.jsx("h2",{children:"Friends' Moods"}),e.jsx(be,{onClick:()=>d(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsx(it,{children:o.map(c=>{var s,u;return e.jsxs(at,{children:[e.jsxs(ot,{children:[e.jsxs(st,{children:[e.jsx("span",{className:"emoji",children:gt(c.intensity)}),e.jsx("span",{className:"label",children:pt(c.intensity)})]}),e.jsx(ct,{children:ht(c.createdAt)})]}),c.note&&e.jsx(dt,{children:c.note}),e.jsxs(lt,{children:[e.jsx("div",{className:"avatar",children:mt((s=c.user)==null?void 0:s.name)}),e.jsx("span",{children:((u=c.user)==null?void 0:u.name)||"Anonymous User"})]})]},c.id)})})]})},ft="/assets/happy-face-8e76819c.svg",bt="/assets/hug-icon-a65e4efe.svg",yt="/assets/mood-tracker-8aaefd8f.svg",wt="/assets/community-ef14f86f.svg",vt="/assets/ComfortingHug-7b35f3f0.png",jt="/assets/EnthusiasticHug-34cb3319.png",kt="/assets/GroupHug-720ddcec.png",ye="/assets/StandardHug-fced95c7.png",St="/assets/SupportiveHug-de556136.png",Ct="/assets/VirtualHug-f24120c7.png",Ht="/assets/RelaxingHug-b42c8043.png",Mt="/assets/WelcomeHug-41a086c9.png",Et="/assets/FriendlyHug-108d9a39.png",Ft="/assets/GentleHug-9e995eae.png",zt="/assets/FamilyHug-e5aea984.png",Tt="/assets/SmilingHug-06fbeb08.png",$t={verySad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 45C40 45 45 40 50 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 45C70 45 75 40 80 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 85C40 85 60 75 80 85' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",sad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 80C40 80 60 70 80 80' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",neutral:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 75C40 75 60 75 80 75' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",happy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 70C40 70 60 80 80 70' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",veryHappy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M35 45C35 45 40 40 45 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M75 45C75 45 80 40 85 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M35 65C35 65 60 90 85 65' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E"},Dt="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23EC4899'/%3E%3C/svg%3E",Pt="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2c3 4 5 6 9 7-4 4-7 8-7 13H10c0-5-3-9-7-13 4-1 6-3 9-7z' fill='%23F59E0B'/%3E%3C/svg%3E",M=({type:t,score:i,size:n=40,animate:d=!0,...o})=>{if(t==="mood"&&i!==void 0){let u;if(i===null)return e.jsx("div",{style:{width:n,height:n}});i>=8.5?u="veryHappy":i>=7?u="happy":i>=5?u="neutral":i>=3?u="sad":u="verySad";const x=$t[u];return d?e.jsx(w.img,{src:x,alt:`Mood level: ${u}`,width:n,height:n,initial:{scale:0},animate:{scale:1,rotate:[0,10,-10,0]},transition:{type:"spring",damping:10,stiffness:100,delay:.3},...o}):e.jsx("img",{src:x,alt:`Mood level: ${u}`,width:n,height:n,...o})}let c,s;switch(t){case"happyFace":c=ft,s="Happy Face";break;case"hugIcon":c=bt,s="Hug Icon";break;case"moodTracker":c=yt,s="Mood Tracker";break;case"community":c=wt,s="Community";break;case"heart":c=Dt,s="Heart";break;case"fire":c=Pt,s="Fire";break;case"Comforting":case"ComfortingHug":c=vt,s="Comforting Hug";break;case"Enthusiastic":case"EnthusiasticHug":c=jt,s="Enthusiastic Hug";break;case"Group":case"GroupHug":c=kt,s="Group Hug";break;case"Standard":case"StandardHug":c=ye,s="Standard Hug";break;case"Supportive":case"SupportiveHug":c=St,s="Supportive Hug";break;case"Virtual":case"VirtualHug":c=Ct,s="Virtual Hug";break;case"Relaxing":case"RelaxingHug":c=Ht,s="Relaxing Hug";break;case"Welcome":case"WelcomeHug":c=Mt,s="Welcome Hug";break;case"Friendly":case"FriendlyHug":c=Et,s="Friendly Hug";break;case"Gentle":case"GentleHug":c=Ft,s="Gentle Hug";break;case"Family":case"FamilyHug":c=zt,s="Family Hug";break;case"Smiling":case"SmilingHug":c=Tt,s="Smiling Hug";break;default:if(t&&t.includes("Hug"))c=ye,s=t;else return null}return d?s&&s.includes("Hug")?e.jsx(w.img,{src:c,alt:s,width:n,height:n,initial:{scale:0,rotate:-5},animate:{scale:1,rotate:0,y:[0,-5,0]},whileHover:{scale:1.1,rotate:[-2,2,-2,0],transition:{rotate:{repeat:0,duration:.5},scale:{duration:.2}}},transition:{type:"spring",damping:12,stiffness:150,delay:.2,y:{repeat:1/0,repeatType:"reverse",duration:1.5,ease:"easeInOut"}},...o}):e.jsx(w.img,{src:c,alt:s,width:n,height:n,initial:{scale:0},animate:{scale:1},transition:{type:"spring",damping:15,stiffness:200,delay:.2},...o}):e.jsx("img",{src:c,alt:s,width:n,height:n,...o})},we=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`,ve=r(w.div)`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`,je=r.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0 5px;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
`,ke=r.div`
  font-size: 1rem;
  color: var(--gray-600);
  font-weight: 500;
  position: relative;
  z-index: 1;
`,Se=r.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: ${t=>t.bgColor||"var(--primary-lightest)"};
  color: ${t=>t.iconColor||"var(--primary-color)"};
  position: relative;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`,Rt=r.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  opacity: 0.05;
  z-index: 0;
  
  svg {
    width: 100%;
    height: 100%;
  }
`,At={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.15}}},Wt={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{type:"spring",damping:12,stiffness:200}}},Ut=()=>{const{getMoodStreak:t,getUserMoods:i,getSentHugs:n,getReceivedHugs:d}=Q(),[o,c]=l.useState({moodStreak:0,totalMoodEntries:0,hugsSent:0,hugsReceived:0}),[s,u]=l.useState(!0);l.useEffect(()=>{async function g(){try{u(!0);const[b,j,p,S]=await Promise.all([t(),i(),n(),d()]);c({moodStreak:(b==null?void 0:b.currentStreak)||0,totalMoodEntries:(j==null?void 0:j.length)||0,hugsSent:(p==null?void 0:p.length)||0,hugsReceived:(S==null?void 0:S.length)||0})}catch(b){console.error("Error fetching dashboard stats:",b)}finally{u(!1)}}g()},[t,i,n,d]);const x=[{label:"Day Streak",value:o.moodStreak,icon:"fire",color:"#FF9800",bgColor:"rgba(255, 152, 0, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#FF9800"})})},{label:"Moods Tracked",value:o.totalMoodEntries,icon:"moodTracker",color:"#4CAF50",bgColor:"rgba(76, 175, 80, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#4CAF50"})})},{label:"Hugs Sent",value:o.hugsSent,icon:"StandardHug",color:"#6c5ce7",bgColor:"rgba(108, 92, 231, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#6c5ce7"})})},{label:"Hugs Received",value:o.hugsReceived,icon:"ComfortingHug",color:"#9D65C9",bgColor:"rgba(157, 101, 201, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#9D65C9"})})}];return s?e.jsx(we,{children:[1,2,3,4].map((g,b)=>e.jsxs(ve,{style:{opacity:.5},children:[e.jsx(Se,{style:{background:"#f0f0f0"}}),e.jsx(je,{style:{background:"#f0f0f0",width:"60px",height:"40px"}}),e.jsx(ke,{style:{background:"#f0f0f0",width:"80px",height:"20px"}})]},b))}):e.jsx(we,{as:w.div,variants:At,initial:"hidden",animate:"visible",children:x.map((g,b)=>e.jsxs(ve,{variants:Wt,children:[e.jsx(Se,{bgColor:g.bgColor,iconColor:g.color,children:e.jsx(M,{type:g.icon,size:28})}),e.jsx(je,{style:{color:g.color},children:g.value}),e.jsx(ke,{children:g.label}),e.jsx(Rt,{children:g.decoration})]},b))})},J=43200,Ce=1440,He=Symbol.for("constructDateFrom");function ge(t,i){return typeof t=="function"?t(i):t&&typeof t=="object"&&He in t?t[He](i):t instanceof Date?new t.constructor(i):new Date(i)}function G(t,i){return ge(i||t,t)}let Nt={};function Lt(){return Nt}function Me(t){const i=G(t),n=new Date(Date.UTC(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours(),i.getMinutes(),i.getSeconds(),i.getMilliseconds()));return n.setUTCFullYear(i.getFullYear()),+t-+n}function pe(t,...i){const n=ge.bind(null,t||i.find(d=>typeof d=="object"));return i.map(n)}function te(t,i){const n=+G(t)-+G(i);return n<0?-1:n>0?1:n}function It(t){return ge(t,Date.now())}function Bt(t,i,n){const[d,o]=pe(n==null?void 0:n.in,t,i),c=d.getFullYear()-o.getFullYear(),s=d.getMonth()-o.getMonth();return c*12+s}function Yt(t){return i=>{const d=(t?Math[t]:Math.trunc)(i);return d===0?0:d}}function Vt(t,i){return+G(t)-+G(i)}function Ot(t,i){const n=G(t,i==null?void 0:i.in);return n.setHours(23,59,59,999),n}function Gt(t,i){const n=G(t,i==null?void 0:i.in),d=n.getMonth();return n.setFullYear(n.getFullYear(),d+1,0),n.setHours(23,59,59,999),n}function Xt(t,i){const n=G(t,i==null?void 0:i.in);return+Ot(n,i)==+Gt(n,i)}function _t(t,i,n){const[d,o,c]=pe(n==null?void 0:n.in,t,t,i),s=te(o,c),u=Math.abs(Bt(o,c));if(u<1)return 0;o.getMonth()===1&&o.getDate()>27&&o.setDate(30),o.setMonth(o.getMonth()-s*u);let x=te(o,c)===-s;Xt(d)&&u===1&&te(d,c)===1&&(x=!1);const g=s*(u-+x);return g===0?0:g}function qt(t,i,n){const d=Vt(t,i)/1e3;return Yt(n==null?void 0:n.roundingMethod)(d)}const Qt={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},Jt=(t,i,n)=>{let d;const o=Qt[t];return typeof o=="string"?d=o:i===1?d=o.one:d=o.other.replace("{{count}}",i.toString()),n!=null&&n.addSuffix?n.comparison&&n.comparison>0?"in "+d:d+" ago":d};function ne(t){return(i={})=>{const n=i.width?String(i.width):t.defaultWidth;return t.formats[n]||t.formats[t.defaultWidth]}}const Zt={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},Kt={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},er={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},tr={date:ne({formats:Zt,defaultWidth:"full"}),time:ne({formats:Kt,defaultWidth:"full"}),dateTime:ne({formats:er,defaultWidth:"full"})},rr={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},nr=(t,i,n,d)=>rr[t];function _(t){return(i,n)=>{const d=n!=null&&n.context?String(n.context):"standalone";let o;if(d==="formatting"&&t.formattingValues){const s=t.defaultFormattingWidth||t.defaultWidth,u=n!=null&&n.width?String(n.width):s;o=t.formattingValues[u]||t.formattingValues[s]}else{const s=t.defaultWidth,u=n!=null&&n.width?String(n.width):t.defaultWidth;o=t.values[u]||t.values[s]}const c=t.argumentCallback?t.argumentCallback(i):i;return o[c]}}const ir={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},ar={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},or={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},sr={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},cr={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},dr={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},lr=(t,i)=>{const n=Number(t),d=n%100;if(d>20||d<10)switch(d%10){case 1:return n+"st";case 2:return n+"nd";case 3:return n+"rd"}return n+"th"},ur={ordinalNumber:lr,era:_({values:ir,defaultWidth:"wide"}),quarter:_({values:ar,defaultWidth:"wide",argumentCallback:t=>t-1}),month:_({values:or,defaultWidth:"wide"}),day:_({values:sr,defaultWidth:"wide"}),dayPeriod:_({values:cr,defaultWidth:"wide",formattingValues:dr,defaultFormattingWidth:"wide"})};function q(t){return(i,n={})=>{const d=n.width,o=d&&t.matchPatterns[d]||t.matchPatterns[t.defaultMatchWidth],c=i.match(o);if(!c)return null;const s=c[0],u=d&&t.parsePatterns[d]||t.parsePatterns[t.defaultParseWidth],x=Array.isArray(u)?pr(u,j=>j.test(s)):gr(u,j=>j.test(s));let g;g=t.valueCallback?t.valueCallback(x):x,g=n.valueCallback?n.valueCallback(g):g;const b=i.slice(s.length);return{value:g,rest:b}}}function gr(t,i){for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&i(t[n]))return n}function pr(t,i){for(let n=0;n<t.length;n++)if(i(t[n]))return n}function hr(t){return(i,n={})=>{const d=i.match(t.matchPattern);if(!d)return null;const o=d[0],c=i.match(t.parsePattern);if(!c)return null;let s=t.valueCallback?t.valueCallback(c[0]):c[0];s=n.valueCallback?n.valueCallback(s):s;const u=i.slice(o.length);return{value:s,rest:u}}}const mr=/^(\d+)(th|st|nd|rd)?/i,xr=/\d+/i,fr={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},br={any:[/^b/i,/^(a|c)/i]},yr={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},wr={any:[/1/i,/2/i,/3/i,/4/i]},vr={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},jr={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},kr={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},Sr={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},Cr={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},Hr={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},Mr={ordinalNumber:hr({matchPattern:mr,parsePattern:xr,valueCallback:t=>parseInt(t,10)}),era:q({matchPatterns:fr,defaultMatchWidth:"wide",parsePatterns:br,defaultParseWidth:"any"}),quarter:q({matchPatterns:yr,defaultMatchWidth:"wide",parsePatterns:wr,defaultParseWidth:"any",valueCallback:t=>t+1}),month:q({matchPatterns:vr,defaultMatchWidth:"wide",parsePatterns:jr,defaultParseWidth:"any"}),day:q({matchPatterns:kr,defaultMatchWidth:"wide",parsePatterns:Sr,defaultParseWidth:"any"}),dayPeriod:q({matchPatterns:Cr,defaultMatchWidth:"any",parsePatterns:Hr,defaultParseWidth:"any"})},Er={code:"en-US",formatDistance:Jt,formatLong:tr,formatRelative:nr,localize:ur,match:Mr,options:{weekStartsOn:0,firstWeekContainsDate:1}};function Fr(t,i,n){const d=Lt(),o=(n==null?void 0:n.locale)??d.locale??Er,c=2520,s=te(t,i);if(isNaN(s))throw new RangeError("Invalid time value");const u=Object.assign({},n,{addSuffix:n==null?void 0:n.addSuffix,comparison:s}),[x,g]=pe(n==null?void 0:n.in,...s>0?[i,t]:[t,i]),b=qt(g,x),j=(Me(g)-Me(x))/1e3,p=Math.round((b-j)/60);let S;if(p<2)return n!=null&&n.includeSeconds?b<5?o.formatDistance("lessThanXSeconds",5,u):b<10?o.formatDistance("lessThanXSeconds",10,u):b<20?o.formatDistance("lessThanXSeconds",20,u):b<40?o.formatDistance("halfAMinute",0,u):b<60?o.formatDistance("lessThanXMinutes",1,u):o.formatDistance("xMinutes",1,u):p===0?o.formatDistance("lessThanXMinutes",1,u):o.formatDistance("xMinutes",p,u);if(p<45)return o.formatDistance("xMinutes",p,u);if(p<90)return o.formatDistance("aboutXHours",1,u);if(p<Ce){const C=Math.round(p/60);return o.formatDistance("aboutXHours",C,u)}else{if(p<c)return o.formatDistance("xDays",1,u);if(p<J){const C=Math.round(p/Ce);return o.formatDistance("xDays",C,u)}else if(p<J*2)return S=Math.round(p/J),o.formatDistance("aboutXMonths",S,u)}if(S=_t(g,x),S<12){const C=Math.round(p/J);return o.formatDistance("xMonths",C,u)}else{const C=S%12,E=Math.trunc(S/12);return C<3?o.formatDistance("aboutXYears",E,u):C<9?o.formatDistance("overXYears",E,u):o.formatDistance("almostXYears",E+1,u)}}function Ue(t,i){return Fr(t,It(t),i)}const zr=r(w.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,Tr=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,$r=r.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,Dr=r.button`
  background: none;
  border: none;
  color: #6c5ce7;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`,ie=r.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
`,Pr=r.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(108, 92, 231, 0.4);
  }
`,Rr=r(w.div)`
  display: flex;
  padding: 12px;
  border-radius: 12px;
  background: #f8f9fa;
  gap: 12px;
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }

  ${t=>t.needsSupport&&`
    border: 1px solid rgba(255, 59, 48, 0.3);
    background: rgba(255, 59, 48, 0.05);
  `}
`,Ar=r.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${t=>t.bgColor||"#6c5ce7"};
  color: white;
  font-weight: 600;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`,Wr=r.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff3b30;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`,Ur=r.div`
  flex: 1;
`,Nr=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`,Lr=r.span`
  font-weight: 600;
  color: #333;
`,Ir=r.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: ${t=>t.intensity>=8?"#4cd964":t.intensity>=5?"#ffcc00":"#ff3b30"};
  color: ${t=>t.intensity>=8?"#006400":t.intensity>=5?"#664d00":"#fff"};
`,Br=r.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Yr=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #888;
  font-size: 0.8rem;
`,Vr=r.span`
  display: flex;
  align-items: center;
  gap: 4px;
`,Or=r.button`
  background: none;
  border: none;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }

  ${t=>t.needsSupport&&`
    color: #ff3b30;
    font-weight: 600;

    &:hover {
      background: rgba(255, 59, 48, 0.1);
    }
  `}
`,Gr=r.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`,Xr=r(w.div)`
  background-color: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 8px;
  padding: 10px 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #d32f2f;
    flex: 1;
  }
`,_r=r(w.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4cd964;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`,qr=r.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`,ae=r.button`
  background: ${t=>t.active?"rgba(108, 92, 231, 0.1)":"transparent"};
  border: 1px solid ${t=>t.active?"rgba(108, 92, 231, 0.3)":"#eee"};
  color: ${t=>t.active?"#6c5ce7":"#666"};
  font-size: 0.8rem;
  padding: 4px 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
    border-color: rgba(108, 92, 231, 0.3);
  }
`,Qr=()=>{const{FriendsMoods:t,sendHug:i}=Q(),[n,d]=l.useState(null),[o,c]=l.useState("all"),[s,u]=l.useState(!1),[x,g]=l.useState(null),[b,j]=l.useState(null),[p,S]=l.useState([]),[C,E]=l.useState(!0),[P,R]=l.useState(null),[A,$]=l.useState(!1),W=async()=>{try{E(!0);const y=await t({limit:10,offset:0});S((y==null?void 0:y.friendsMoods)||[]),R(null)}catch(y){console.error("Error fetching friends moods:",y),R(y)}finally{E(!1)}};l.useEffect(()=>{W();const y=setInterval(()=>{W()},6e4);return()=>clearInterval(y)},[]);const z=p.filter(y=>y.intensity<=4)||[],T=z.length>0;l.useEffect(()=>{if(s){const y=setTimeout(()=>{u(!1)},3e3);return()=>clearTimeout(y)}},[s]);const D=y=>y?y.split(" ").map(h=>h[0]).join("").toUpperCase().substring(0,2):"?",U=y=>{const h=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],H=y?y.charCodeAt(0)%h.length:0;return h[H]},N=async(y,h)=>{if(y.stopPropagation(),!A){j(h.user.id),$(!0);try{const H={recipientId:h.user.id,type:h.intensity<=4?"ComfortingHug":"StandardHug",message:h.intensity<=4?"I noticed you're not feeling great. Sending you a comforting hug!":"Hey! Just sending a friendly hug your way!"};await i(H)&&(g(h.user.name||h.user.username),u(!0),setTimeout(()=>{W()},1e3))}catch(H){console.error("Error sending hug:",H)}finally{j(null),$(!1)}}},L=()=>{if(!p||p.length===0)return[];let y=[...p];return o==="needSupport"?y.filter(h=>h.intensity<=4):o==="recent"?y.sort((h,H)=>new Date(H.createdAt)-new Date(h.createdAt)):y},I=()=>{if(C)return e.jsx(Gr,{children:"Loading friends' moods..."});if(P)return e.jsx(ie,{children:"Couldn't load friends' moods. Please try again."});if(!p||p.length===0)return e.jsx(ie,{children:"No friend moods yet. Add friends to see their moods here!"});const y=L();return y.length===0?e.jsx(ie,{children:"No moods match the current filter."}):e.jsx(Pr,{children:y.map(h=>{const H=h.intensity<=4;return e.jsxs(Rr,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},onClick:()=>d(n===h.id?null:h.id),needsSupport:H,children:[H&&e.jsx(Wr,{children:e.jsx(le,{size:12})}),e.jsx(Ar,{bgColor:U(h.user.id),children:h.user.avatarUrl?e.jsx("img",{src:h.user.avatarUrl,alt:h.user.name}):D(h.user.name||h.user.username)}),e.jsxs(Ur,{children:[e.jsxs(Nr,{children:[e.jsx(Lr,{children:h.user.name||h.user.username}),e.jsxs(Ir,{intensity:h.intensity,children:[h.intensity,"/10"]})]}),e.jsx(Br,{children:h.note||"No description provided."}),e.jsxs(Yr,{children:[e.jsxs(Vr,{children:[e.jsx(Pe,{size:12}),Ue(new Date(h.createdAt),{addSuffix:!0})]}),e.jsx(Or,{onClick:B=>N(B,h),needsSupport:H,disabled:A&&b===h.user.id,children:A&&b===h.user.id?"Sending...":e.jsxs(e.Fragment,{children:[H?e.jsx(Y,{size:12}):e.jsx(re,{size:12}),H?"Send Support":"Send Hug"]})})]})]})]},h.id)})})};return e.jsxs(zr,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsxs(Tr,{children:[e.jsxs($r,{children:[e.jsx(Qe,{size:16}),"Friends' Moods",T&&e.jsx(w.span,{style:{background:"#ff3b30",color:"white",borderRadius:"50%",width:"20px",height:"20px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:"bold"},initial:{scale:0},animate:{scale:1},transition:{type:"spring",stiffness:500,damping:15},children:z.length})]}),e.jsx(Dr,{children:"View All"})]}),e.jsx(V,{children:T&&e.jsxs(Xr,{initial:{opacity:0,height:0,marginBottom:0},animate:{opacity:1,height:"auto",marginBottom:12},exit:{opacity:0,height:0,marginBottom:0},children:[e.jsx(Je,{size:18,color:"#d32f2f"}),e.jsxs("p",{children:[z.length===1?`${z[0].user.name||"Your friend"} is feeling down.`:`${z.length} friends are having a tough time.`,"Consider sending support!"]})]})}),e.jsxs(qr,{children:[e.jsx(ae,{active:o==="all",onClick:()=>c("all"),children:"All"}),e.jsxs(ae,{active:o==="needSupport",onClick:()=>c("needSupport"),children:["Needs Support ",T&&`(${z.length})`]}),e.jsx(ae,{active:o==="recent",onClick:()=>c("recent"),children:"Recent"})]}),I(),e.jsx(V,{children:s&&e.jsxs(_r,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(Y,{size:16}),"Hug sent to ",x,"!"]})})]})},Jr=r(w.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,Zr=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Kr=r.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,en=r.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`,tn=r.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #eee;
  border-radius: 12px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
    box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
  }
`,rn=r.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
`,nn=r.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: ${t=>t.visible?"flex":"none"};
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    background: #f0f0f0;
  }
`,an=r.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 8px;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }
`,X=r.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: ${t=>t.selected?"rgba(108, 92, 231, 0.1)":"transparent"};
  border: 1px solid ${t=>t.selected?"#6c5ce7":"#eee"};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  flex-shrink: 0;
  box-shadow: ${t=>t.selected?"0 4px 8px rgba(108, 92, 231, 0.15)":"none"};
  transform: ${t=>t.selected?"translateY(-2px)":"none"};
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
    box-shadow: 0 4px 8px rgba(108, 92, 231, 0.08);
    transform: translateY(-2px);
  }
  
  .icon-wrapper {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  span {
    font-size: 0.75rem;
    font-weight: ${t=>t.selected?"600":"500"};
    color: ${t=>t.selected?"#6c5ce7":"#666"};
  }
`,on=r.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(108, 92, 231, 0.4);
  }
`,sn=r.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${t=>t.selected?"rgba(108, 92, 231, 0.1)":"#f8f9fa"};
  border: 1px solid ${t=>t.selected?"rgba(108, 92, 231, 0.3)":"transparent"};
  transition: all 0.2s;
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
  }
`,cn=r.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${t=>t.bgColor||"#6c5ce7"};
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  margin-right: 12px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`,dn=r.div`
  flex: 1;
`,ln=r.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`,un=r.div`
  color: #888;
  font-size: 0.8rem;
`,gn=r.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${t=>t.selected?"#6c5ce7":"#f0f0f0"};
  color: ${t=>t.selected?"white":"#666"};
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${t=>t.selected?"#5b4cc8":"#e0e0e0"};
  }
`,pn=r.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 12px;
  font-size: 0.9rem;
  resize: none;
  height: 80px;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`,Ee=r.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
`,Z=r.button`
  padding: 8px 12px;
  background: none;
  border: none;
  color: ${t=>t.active?"#6c5ce7":"#888"};
  font-weight: ${t=>t.active?"600":"400"};
  border-bottom: 2px solid ${t=>t.active?"#6c5ce7":"transparent"};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    color: #6c5ce7;
  }
`,hn=r.div`
  margin-bottom: 1rem;
`,mn=r.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`,xn=r.button`
  width: 100%;
  padding: 12px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: #5b4cc8;
  }
  
  &:disabled {
    background: #a8a3e1;
    cursor: not-allowed;
  }
`,oe=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`,fn=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`,bn=r(w.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4cd964;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`,Fe=r.div`
  color: #ff3b30;
  font-size: 0.8rem;
  margin-top: 4px;
  margin-bottom: 8px;
`,yn=()=>{const[t,i]=l.useState("friends"),[n,d]=l.useState(""),[o,c]=l.useState("StandardHug"),[s,u]=l.useState(null),[x,g]=l.useState(""),[b,j]=l.useState(""),[p,S]=l.useState("email"),[C,E]=l.useState(!1),[P,R]=l.useState(""),[A,$]=l.useState(!1),{loading:W,error:z,data:T}=De(Xe,{fetchPolicy:"network-only"}),[D,{loading:U}]=_e(qe);l.useEffect(()=>{if(C){const f=setTimeout(()=>{E(!1)},3e3);return()=>clearTimeout(f)}},[C]),l.useEffect(()=>{t==="external"&&(p==="email"?$(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b)):p==="telegram"&&$(b.trim().length>0))},[b,p,t]),l.useEffect(()=>{let f="";switch(o){case"ComfortingHug":f="I'm sending you a comforting hug to help you feel better!";break;case"FriendlyHug":f="Hey friend! Thought you might appreciate a friendly hug today.";break;case"EnthusiasticHug":f="Sending you an enthusiastic hug to celebrate with you!";break;case"GroupHug":f="Group hug! Bringing us all together.";break;case"FamilyHug":f="A warm family hug to let you know I care about you.";break;case"StandardHug":default:f="Just sending a hug to brighten your day!";break}g(f)},[o]);const N=f=>f?f.split(" ").map(k=>k[0]).join("").toUpperCase().substring(0,2):"?",L=f=>{const k=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],O=f?f.charCodeAt(0)%k.length:0;return k[O]},I=async()=>{var f,k;R("");try{t==="friends"&&s?(f=(await D({variables:{hugInput:{recipientId:s.id,type:o,message:x.trim()}}})).data)!=null&&f.sendHug&&(E(!0),u(null),y()):t==="external"&&A&&(k=(await D({variables:{hugInput:{externalRecipient:{type:p,contact:b.trim()},type:o,message:x.trim()}}})).data)!=null&&k.sendHug&&(E(!0),y())}catch(O){console.error("Error sending hug:",O),R("Failed to send hug. Please try again.")}},y=()=>{g(h(o)),j("")},h=f=>{switch(f){case"ComfortingHug":return"I'm sending you a comforting hug to help you feel better!";case"FriendlyHug":return"Hey friend! Thought you might appreciate a friendly hug today.";case"EnthusiasticHug":return"Sending you an enthusiastic hug to celebrate with you!";case"GroupHug":return"Group hug! Bringing us all together.";case"FamilyHug":return"A warm family hug to let you know I care about you.";case"StandardHug":default:return"Just sending a hug to brighten your day!"}},H=f=>{d(f.target.value)},B=()=>{d("")},m=f=>{s&&s.id===f.id?u(null):u(f)},F=()=>{if(W)return e.jsx(fn,{children:"Loading friends..."});if(z)return e.jsx(oe,{children:"Error loading friends. Please try again."});if(!T||!T.users||T.users.length===0)return e.jsx(oe,{children:"No friends found. Add some friends to send hugs!"});const f=T.users.filter(k=>{if(!n)return!0;const O=n.toLowerCase();return k.name&&k.name.toLowerCase().includes(O)||k.username&&k.username.toLowerCase().includes(O)});return f.length===0?e.jsx(oe,{children:"No friends match your search."}):e.jsx(on,{children:f.map(k=>e.jsxs(sn,{selected:s&&s.id===k.id,onClick:()=>m(k),children:[e.jsx(cn,{bgColor:L(k.id),children:k.avatarUrl?e.jsx("img",{src:k.avatarUrl,alt:k.name}):N(k.name||k.username)}),e.jsxs(dn,{children:[e.jsx(ln,{children:k.name||"Unnamed User"}),e.jsxs(un,{children:["@",k.username]})]}),e.jsx(gn,{selected:s&&s.id===k.id,children:s&&s.id===k.id?e.jsx(We,{size:14}):null})]},k.id))})},a=()=>e.jsxs(hn,{children:[e.jsxs(Ee,{style:{marginBottom:"8px"},children:[e.jsx(Z,{active:p==="email",onClick:()=>S("email"),children:"Email"}),e.jsx(Z,{active:p==="telegram",onClick:()=>S("telegram"),children:"Telegram"})]}),e.jsx(mn,{type:p==="email"?"email":"text",placeholder:p==="email"?"Enter email address":"Enter Telegram username",value:b,onChange:f=>j(f.target.value)}),!A&&b.trim()!==""&&e.jsx(Fe,{children:p==="email"?"Please enter a valid email address.":"Please enter a valid Telegram username."})]}),v=()=>t==="friends"?s!==null&&x.trim()!=="":t==="external"?A&&x.trim()!=="":!1;return e.jsxs(Jr,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsx(Zr,{children:e.jsxs(Kr,{children:[e.jsx(re,{size:16}),"Quick Send Hug"]})}),e.jsxs(Ee,{children:[e.jsxs(Z,{active:t==="friends",onClick:()=>i("friends"),children:[e.jsx(Re,{size:14,style:{marginRight:"4px"}}),"Friends"]}),e.jsxs(Z,{active:t==="external",onClick:()=>i("external"),children:[e.jsx(Ze,{size:14,style:{marginRight:"4px"}}),"External"]})]}),t==="friends"&&e.jsxs(e.Fragment,{children:[e.jsxs(en,{children:[e.jsx(rn,{children:e.jsx(Ae,{size:16})}),e.jsx(tn,{type:"text",placeholder:"Search friends...",value:n,onChange:H}),e.jsx(nn,{visible:n!=="",onClick:B,children:e.jsx(ue,{size:16})})]}),F()]}),t==="external"&&a(),e.jsxs(an,{children:[e.jsxs(X,{selected:o==="StandardHug",onClick:()=>c("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"StandardHug",size:36,animate:!0})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(X,{selected:o==="FriendlyHug",onClick:()=>c("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"FriendlyHug",size:36,animate:!0})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(X,{selected:o==="ComfortingHug",onClick:()=>c("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"ComfortingHug",size:36,animate:!0})}),e.jsx("span",{children:"Comforting"})]}),e.jsxs(X,{selected:o==="EnthusiasticHug",onClick:()=>c("EnthusiasticHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"EnthusiasticHug",size:36,animate:!0})}),e.jsx("span",{children:"Enthusiastic"})]}),e.jsxs(X,{selected:o==="FamilyHug",onClick:()=>c("FamilyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"FamilyHug",size:36,animate:!0})}),e.jsx("span",{children:"Family"})]}),e.jsxs(X,{selected:o==="GroupHug",onClick:()=>c("GroupHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"GroupHug",size:36,animate:!0})}),e.jsx("span",{children:"Group"})]})]}),e.jsx(pn,{placeholder:"Write your message...",value:x,onChange:f=>g(f.target.value)}),P&&e.jsx(Fe,{children:P}),e.jsxs(xn,{onClick:I,disabled:!v()||U,children:[U?"Sending...":"Send Hug",e.jsx(Y,{size:16})]}),e.jsx(V,{children:C&&e.jsxs(bn,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(Y,{size:16}),"Hug sent successfully!"]})})]})},wn=r(w.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,vn=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,jn=r.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,kn=r.button`
  background: none;
  border: none;
  color: #6c5ce7;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`,ze=r.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
`,Sn=r.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(108, 92, 231, 0.4);
  }
`,Cn=r(w.div)`
  display: flex;
  padding: 16px;
  border-radius: 16px;
  background: ${t=>t.isRead?"#f8f9fa":"linear-gradient(to right, rgba(108, 92, 231, 0.05), #f8f9fa)"};
  gap: 16px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  border: 1px solid ${t=>t.isRead?"transparent":"rgba(108, 92, 231, 0.1)"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
    background: ${t=>t.isRead?"#f0f0f5":"linear-gradient(to right, rgba(108, 92, 231, 0.08), #f0f0f5)"};
  }

  ${t=>!t.isRead&&`
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 100%;
      background: #6c5ce7;
      border-radius: 0 4px 4px 0;
      box-shadow: 0 0 10px rgba(108, 92, 231, 0.3);
    }
  `}
`,Hn=r.div`
  width: 62px;
  height: 62px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${t=>t.bgColor||"rgba(108, 92, 231, 0.1)"};
  flex-shrink: 0;
  padding: 6px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`,Mn=r.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${t=>t.bgColor||"#6c5ce7"};
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  position: absolute;
  bottom: -5px;
  left: -5px;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  font-size: 0.7rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`,En=r.div`
  flex: 1;
`,Fn=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`,zn=r.span`
  font-weight: 600;
  color: #333;
`,Tn=r.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.75rem;
  background: ${t=>{switch(t.type){case"ComfortingHug":return"rgba(255, 152, 0, 0.15)";case"GroupHug":return"rgba(76, 175, 80, 0.15)";case"EnthusiasticHug":return"rgba(233, 30, 99, 0.15)";case"FriendlyHug":return"rgba(33, 150, 243, 0.15)";case"FamilyHug":return"rgba(156, 39, 176, 0.15)";case"StandardHug":default:return"rgba(108, 92, 231, 0.15)"}}};
  color: ${t=>{switch(t.type){case"ComfortingHug":return"#f57c00";case"GroupHug":return"#388e3c";case"EnthusiasticHug":return"#c2185b";case"FriendlyHug":return"#1976d2";case"FamilyHug":return"#7b1fa2";case"StandardHug":default:return"#5c4ccc"}}};
`,$n=r.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Dn=r.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  font-size: 0.8rem;
`,Pn=r.span`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
`,Rn=r.button`
  background: none;
  border: none;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`,An=r.button`
  background: none;
  border: none;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(108, 92, 231, 0.1);
  }
`,Wn=r.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`,Un=r.span`
  background-color: #ff3b30;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 6px;
`,Nn=r(w.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #4cd964;
  color: white;
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`,Ln=r(w.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`,In=r(w.div)`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #333;
  }
`,Bn=r.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 1.25rem;
  padding: 5px;
  max-height: 225px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }
`,K=r.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px;
  background: ${t=>t.selected?"rgba(108, 92, 231, 0.1)":"#f8f9fa"};
  border: 1px solid ${t=>t.selected?"#6c5ce7":"#eee"};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: ${t=>t.selected?"0 2px 8px rgba(108, 92, 231, 0.15)":"none"};

  &:hover {
    background: rgba(108, 92, 231, 0.05);
    border-color: #d0ccfa;
    transform: translateY(-2px);
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span {
    font-size: 0.85rem;
    font-weight: ${t=>t.selected?"500":"normal"};
    color: ${t=>t.selected?"#6c5ce7":"#444"};
    text-align: center;
  }
`,Yn=r.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  resize: none;
  height: 100px;

  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`,Vn=r.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`,On=r.button`
  padding: 8px 16px;
  background: #f8f9fa;
  color: #666;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #eee;
  }
`,Gn=r.button`
  padding: 8px 16px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;

  &:hover {
    background: #5b4cc8;
  }

  &:disabled {
    background: #a8a3e1;
    cursor: not-allowed;
  }
`,Xn=()=>{const{getReceivedHugs:t,markHugAsRead:i,sendHug:n}=Q(),[d,o]=l.useState([]),[c,s]=l.useState(!0),[u,x]=l.useState(null),[g,b]=l.useState(!1),[j,p]=l.useState(null),[S,C]=l.useState(""),[E,P]=l.useState("StandardHug"),[R,A]=l.useState(!1),[$,W]=l.useState(!1),[z,T]=l.useState(null);l.useEffect(()=>{D()},[]);const D=async()=>{try{s(!0);const a=await t();o(a||[]),x(null)}catch(a){console.error("Error fetching received hugs:",a),x(a)}finally{s(!1)}},U=d.filter(a=>!a.isRead)||[],N=U.length>0;l.useEffect(()=>{if($){const a=setTimeout(()=>{W(!1)},3e3);return()=>clearTimeout(a)}},[$]);const L=a=>a?a.split(" ").map(v=>v[0]).join("").toUpperCase().substring(0,2):"?",I=a=>{const v=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],f=a?a.charCodeAt(0)%v.length:0;return v[f]},y=async(a,v)=>{a.stopPropagation();try{await i(v),D()}catch(f){console.error("Error marking hug as read:",f)}},h=(a,v)=>{a.stopPropagation(),p(v),C(`Thanks for the ${v.type.replace(/([A-Z])/g," $1").trim().toLowerCase()}!`),P("StandardHug"),A(!0)},H=()=>{A(!1),p(null),C("")},B=async()=>{if(!(!j||!S.trim()))try{b(!0);const a={recipientId:j.sender.id,type:E,message:S.trim()};await n(a)&&(T(j.sender.name||j.sender.username),W(!0),H(),setTimeout(()=>{D()},1e3))}catch(a){console.error("Error sending reply hug:",a)}finally{b(!1)}},m=a=>{switch(a){case"ComfortingHug":return"rgba(255, 152, 0, 0.1)";case"GroupHug":return"rgba(76, 175, 80, 0.1)";case"EnthusiasticHug":return"rgba(233, 30, 99, 0.1)";case"FriendlyHug":return"rgba(33, 150, 243, 0.1)";case"FamilyHug":return"rgba(156, 39, 176, 0.1)";case"StandardHug":default:return"rgba(108, 92, 231, 0.1)"}},F=()=>c?e.jsx(Wn,{children:"Loading received hugs..."}):u?e.jsx(ze,{children:"Couldn't load hugs. Please try again."}):!d||d.length===0?e.jsx(ze,{children:"No hugs received yet. Send some to get the ball rolling!"}):e.jsx(Sn,{children:d.map(a=>e.jsxs(Cn,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},isRead:a.isRead,children:[e.jsxs(Hn,{bgColor:m(a.type),children:[e.jsx(M,{type:a.type,size:48,animate:!0}),e.jsx(Mn,{bgColor:I(a.sender.id),children:L(a.sender.name||a.sender.username)})]}),e.jsxs(En,{children:[e.jsxs(Fn,{children:[e.jsx(zn,{children:a.sender.name||a.sender.username}),e.jsx(Tn,{type:a.type,children:a.type.replace(/([A-Z])/g," $1").trim()})]}),e.jsx($n,{children:a.message||"Sent you a hug!"}),e.jsxs(Dn,{children:[e.jsxs(Pn,{children:[e.jsx(Pe,{size:12}),Ue(new Date(a.createdAt),{addSuffix:!0})]}),!a.isRead&&e.jsxs(Rn,{onClick:v=>y(v,a.id),children:[e.jsx(We,{size:12}),"Mark Read"]}),e.jsxs(An,{onClick:v=>h(v,a),children:[e.jsx(he,{size:12}),"Reply"]})]})]})]},a.id))});return e.jsxs(wn,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsxs(vn,{children:[e.jsxs(jn,{children:[e.jsx(Y,{size:16}),"Received Hugs",N&&e.jsx(Un,{children:U.length})]}),e.jsx(kn,{children:"View All"})]}),F(),e.jsx(V,{children:R&&j&&e.jsx(Ln,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(In,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},exit:{y:20,opacity:0},children:[e.jsxs("h4",{children:[e.jsx(he,{size:18}),"Reply to ",j.sender.name||j.sender.username]}),e.jsxs(Bn,{children:[e.jsxs(K,{selected:E==="StandardHug",onClick:()=>P("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"StandardHug",size:42,animate:!0})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(K,{selected:E==="FriendlyHug",onClick:()=>P("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"FriendlyHug",size:42,animate:!0})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(K,{selected:E==="EnthusiasticHug",onClick:()=>P("EnthusiasticHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"EnthusiasticHug",size:42,animate:!0})}),e.jsx("span",{children:"Enthusiastic"})]}),e.jsxs(K,{selected:E==="ComfortingHug",onClick:()=>P("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"ComfortingHug",size:42,animate:!0})}),e.jsx("span",{children:"Comforting"})]})]}),e.jsx(Yn,{value:S,onChange:a=>C(a.target.value),placeholder:"Write your reply message..."}),e.jsxs(Vn,{children:[e.jsx(On,{onClick:H,children:"Cancel"}),e.jsx(Gn,{onClick:B,disabled:!S.trim()||g,children:g?"Sending...":"Send Reply"})]})]})})}),e.jsx(V,{children:$&&e.jsxs(Nn,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(Y,{size:16}),"Hug sent to ",z,"!"]})})]})},_n=r(w.div)`
  position: relative;
`,qn=r(w.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(108, 92, 231, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
`,Qn=r(w.div)`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  width: 320px;
  z-index: 100;
  
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    border-radius: 2px;
  }
`,Jn=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Zn=r.h4`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`,Kn=r.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    background: #f0f0f0;
  }
`,ei=r.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }
`,ti=r.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${t=>t.selected?"rgba(108, 92, 231, 0.1)":"#f8f9fa"};
  border: 1px solid ${t=>t.selected?"rgba(108, 92, 231, 0.3)":"transparent"};
  transition: all 0.2s;
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
  }
`,ri=r.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${t=>t.bgColor||"#6c5ce7"};
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  margin-right: 12px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`,ni=r.div`
  flex: 1;
`,ii=r.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`,ai=r.div`
  color: #888;
  font-size: 0.8rem;
`,oi=r.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  overflow-x: auto;
  padding-bottom: 8px;
  
  /* Hide scrollbar */
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(108, 92, 231, 0.2);
    border-radius: 10px;
  }
`,se=r.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: ${t=>t.selected?"rgba(108, 92, 231, 0.1)":"transparent"};
  border: 1px solid ${t=>t.selected?"#6c5ce7":"#eee"};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  flex-shrink: 0;
  box-shadow: ${t=>t.selected?"0 4px 8px rgba(108, 92, 231, 0.15)":"none"};
  transform: ${t=>t.selected?"translateY(-2px)":"none"};
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
    box-shadow: 0 4px 8px rgba(108, 92, 231, 0.08);
    transform: translateY(-2px);
  }
  
  .icon-wrapper {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  span {
    font-size: 0.75rem;
    font-weight: ${t=>t.selected?"600":"500"};
    color: ${t=>t.selected?"#6c5ce7":"#666"};
  }
`,si=r(w.button)`
  width: 100%;
  padding: 12px;
  background: #6c5ce7;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: #5b4cc8;
  }
  
  &:disabled {
    background: #a8a3e1;
    cursor: not-allowed;
  }
`,ci=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`,di=r.div`
  text-align: center;
  padding: 1rem;
  color: #e74c3c;
  font-size: 0.9rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
`,li=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`,Ne=r(w.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`,ui=r(Ne)`
  background-color: #4cd964;
  color: white;
`,gi=r(Ne)`
  background-color: #e74c3c;
  color: white;
`,pi=({onSent:t=()=>{}})=>{const{getUsers:i,sendHug:n}=Q(),[d,o]=l.useState(!1),[c,s]=l.useState(null),[u,x]=l.useState("StandardHug"),[g,b]=l.useState(!1),[j,p]=l.useState(!1),[S,C]=l.useState(""),[E,P]=l.useState(""),[R,A]=l.useState([]),[$,W]=l.useState(!1),[z,T]=l.useState(null),[D,U]=l.useState(!1);l.useEffect(()=>{d&&N()},[d]);const N=async()=>{try{W(!0);const m=await i();A(m||[]),T(null)}catch(m){console.error("Error fetching users:",m),T(m)}finally{W(!1)}};l.useEffect(()=>{const m=F=>{d&&F.target.closest(".quick-hug-popup")===null&&F.target.closest(".quick-hug-trigger")===null&&o(!1)};return document.addEventListener("mousedown",m),()=>document.removeEventListener("mousedown",m)},[d]),l.useEffect(()=>{if(g){const m=setTimeout(()=>{b(!1)},3e3);return()=>clearTimeout(m)}},[g]),l.useEffect(()=>{if(j){const m=setTimeout(()=>{p(!1)},3e3);return()=>clearTimeout(m)}},[j]);const L=()=>{o(m=>!m),d||(s(null),x("StandardHug"))},I=()=>{o(!1)},y=m=>{s(m===c?null:m)},h=m=>m?m.split(" ").map(F=>F[0]).join("").toUpperCase().substring(0,2):"?",H=m=>{const F=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],a=m?m.charCodeAt(0)%F.length:0;return F[a]},B=async()=>{var m;if(c)try{U(!0);const F={recipientId:c.id,type:u,message:`Sending you a quick ${u.replace(/([A-Z])/g," $1").trim().toLowerCase()}!`};await n(F)&&(P(c.name||c.username),b(!0),I(),t())}catch(F){console.error("Error sending hug:",F),C(((m=F.message)==null?void 0:m.split(":")[0])||"Failed to send hug"),p(!0)}finally{U(!1)}};return e.jsxs(_n,{children:[e.jsxs(qn,{className:"quick-hug-trigger",onClick:L,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(Y,{size:16}),"Quick Hug"]}),e.jsx(V,{children:d&&e.jsxs(Qn,{className:"quick-hug-popup",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.2},children:[e.jsxs(Jn,{children:[e.jsxs(Zn,{children:[e.jsx(Y,{size:16}),"Send a Quick Hug"]}),e.jsx(Kn,{onClick:I,children:e.jsx(ue,{size:18})})]}),$?e.jsx(li,{children:"Loading friends..."}):z?e.jsxs(di,{children:["Couldn't load friends list.",z.message&&e.jsxs("div",{children:["Error: ",z.message.split(":")[0]]})]}):!R||R.length===0?e.jsx(ci,{children:"No friends found"}):e.jsx(ei,{children:R.map(m=>e.jsxs(ti,{selected:c&&c.id===m.id,onClick:()=>y(m),children:[e.jsx(ri,{bgColor:H(m.id),children:m.avatarUrl?e.jsx("img",{src:m.avatarUrl,alt:m.name}):h(m.name||m.username)}),e.jsxs(ni,{children:[e.jsx(ii,{children:m.name||"Unnamed User"}),e.jsxs(ai,{children:["@",m.username]})]})]},m.id))}),e.jsxs(oi,{children:[e.jsxs(se,{selected:u==="StandardHug",onClick:()=>x("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"StandardHug",size:48,animate:!0})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(se,{selected:u==="FriendlyHug",onClick:()=>x("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"FriendlyHug",size:48,animate:!0})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(se,{selected:u==="ComfortingHug",onClick:()=>x("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"ComfortingHug",size:48,animate:!0})}),e.jsx("span",{children:"Comforting"})]})]}),e.jsxs(si,{onClick:B,disabled:!c||D,whileHover:{scale:1.02},whileTap:{scale:.98},children:[D?"Sending...":"Send Hug",e.jsx(re,{size:16})]})]})}),e.jsxs(V,{children:[g&&e.jsxs(ui,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(Y,{size:16}),"Hug sent to ",E,"!"]}),j&&e.jsxs(gi,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(le,{size:16}),S]})]})]})},hi=r(w.div)`
  position: relative;
`,mi=r(w.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9rem;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
`,xi=r(w.div)`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  width: 320px;
  z-index: 100;
  
  &:before {
    content: '';
    position: absolute;
    top: -6px;
    right: 20px;
    width: 12px;
    height: 12px;
    background: white;
    transform: rotate(45deg);
    border-radius: 2px;
  }
`,fi=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,bi=r.h4`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`,yi=r.button`
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  
  &:hover {
    background: #f0f0f0;
  }
`,wi=r.div`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 0 12px;
  margin-bottom: 16px;
  
  input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 12px 8px;
    outline: none;
    font-size: 0.9rem;
    
    &::placeholder {
      color: #aaa;
    }
  }
  
  svg {
    color: #888;
  }
`,vi=r.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  margin-bottom: 1rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.03);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(76, 175, 80, 0.2);
    border-radius: 10px;
  }
`,ji=r.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  background: ${t=>t.selected?"rgba(76, 175, 80, 0.1)":"#f8f9fa"};
  border: 1px solid ${t=>t.selected?"rgba(76, 175, 80, 0.3)":"transparent"};
  transition: all 0.2s;
  
  &:hover {
    background: rgba(76, 175, 80, 0.05);
  }
`,ki=r.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${t=>t.bgColor||"#4CAF50"};
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  margin-right: 12px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`,Si=r.div`
  flex: 1;
`,Ci=r.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`,Hi=r.div`
  color: #888;
  font-size: 0.8rem;
`,Mi=r.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: none;
  font-size: 0.9rem;
  margin-bottom: 16px;
  font-family: inherit;
  outline: none;
  
  &:focus {
    border-color: #4CAF50;
  }
`,Ei=r(w.button)`
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: #388E3C;
  }
  
  &:disabled {
    background: #A5D6A7;
    cursor: not-allowed;
  }
`,Fi=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`,zi=r.div`
  text-align: center;
  padding: 1rem;
  color: #e74c3c;
  font-size: 0.9rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
`,Ti=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`,Le=r(w.div)`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
`,$i=r(Le)`
  background-color: #4CAF50;
  color: white;
`,Di=r(Le)`
  background-color: #e74c3c;
  color: white;
`,Pi=({onSent:t=()=>{}})=>{const[i,n]=l.useState(!1),[d,o]=l.useState(null),[c,s]=l.useState(""),[u,x]=l.useState(""),[g,b]=l.useState(!1),[j,p]=l.useState(!1),[S,C]=l.useState(""),[E,P]=l.useState("");l.useEffect(()=>{u||x("Hi there! I'd like to connect and be friends on HugMeNow! Sending you a warm welcome hug. 🤗")},[]);const{getUsers:R,sendHug:A}=Q(),[$,W]=l.useState([]),[z,T]=l.useState(!1),[D,U]=l.useState(null),[N,L]=l.useState(!1);l.useEffect(()=>{async function a(){if(i){T(!0),U(null);try{const v=await R();v&&Array.isArray(v)?W(v):W([])}catch(v){console.error("Error fetching users:",v),U(v)}finally{T(!1)}}}a()},[i,c,R]),l.useEffect(()=>{const a=v=>{i&&v.target.closest(".welcome-hug-popup")===null&&v.target.closest(".welcome-hug-trigger")===null&&n(!1)};return document.addEventListener("mousedown",a),()=>document.removeEventListener("mousedown",a)},[i]),l.useEffect(()=>{if(g){const a=setTimeout(()=>{b(!1)},3e3);return()=>clearTimeout(a)}},[g]),l.useEffect(()=>{if(j){const a=setTimeout(()=>{p(!1)},3e3);return()=>clearTimeout(a)}},[j]);const I=()=>{n(a=>!a),i||(o(null),s(""),u||x("Hi there! I'd like to connect and be friends on HugMeNow! Sending you a warm welcome hug. 🤗"))},y=()=>{n(!1)},h=a=>{s(a.target.value)},H=a=>{o(a===d?null:a)},B=a=>a?a.split(" ").map(v=>v[0]).join("").toUpperCase().substring(0,2):"?",m=a=>{const v=["#4CAF50","#8BC34A","#CDDC39","#009688","#00BCD4","#3F51B5"],f=a?a.charCodeAt(0)%v.length:0;return v[f]},F=async()=>{if(d)try{L(!0);const a={recipientId:d.id,type:"WelcomeHug",message:u||"Hi there! I'd like to connect and be friends on HugMeNow! Sending you a warm welcome hug."};await A(a)&&(P(d.name||d.username),b(!0),y(),t())}catch(a){console.error("Error:",a),C(a.message||"Something went wrong"),p(!0)}finally{L(!1)}};return e.jsxs(hi,{children:[e.jsxs(mi,{className:"welcome-hug-trigger",onClick:I,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(me,{size:16}),"Welcome Friend"]}),e.jsx(V,{children:i&&e.jsxs(xi,{className:"welcome-hug-popup",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.2},children:[e.jsxs(fi,{children:[e.jsxs(bi,{children:[e.jsx(Re,{size:16}),"Welcome a New Friend"]}),e.jsx(yi,{onClick:y,children:e.jsx(ue,{size:18})})]}),e.jsxs(wi,{children:[e.jsx(Ae,{size:16}),e.jsx("input",{type:"text",placeholder:"Search users...",value:c,onChange:h})]}),z?e.jsx(Ti,{children:"Loading users..."}):D?e.jsxs(zi,{children:["Couldn't load users list.",D.message&&e.jsxs("div",{children:["Error: ",D.message.split(":")[0]]})]}):!$||$.length===0?e.jsx(Fi,{children:"No users found"}):e.jsx(vi,{children:$.filter(a=>{var v,f;return c?((v=a.name)==null?void 0:v.toLowerCase().includes(c.toLowerCase()))||((f=a.username)==null?void 0:f.toLowerCase().includes(c.toLowerCase())):!0}).map(a=>e.jsxs(ji,{selected:d&&d.id===a.id,onClick:()=>H(a),children:[e.jsx(ki,{bgColor:m(a.id),children:a.avatarUrl?e.jsx("img",{src:a.avatarUrl,alt:a.name}):B(a.name||a.username)}),e.jsxs(Si,{children:[e.jsx(Ci,{children:a.name||"Unnamed User"}),e.jsxs(Hi,{children:["@",a.username]})]})]},a.id))}),e.jsx(Mi,{placeholder:"Add a welcome message (optional)",value:u,onChange:a=>x(a.target.value),rows:3}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginBottom:"16px"},children:e.jsx(M,{type:"WelcomeHug",size:64,animate:!0})}),e.jsxs(Ei,{onClick:F,disabled:!d||N,whileHover:{scale:1.02},whileTap:{scale:.98},children:[N?"Sending...":"Send Welcome Hug",e.jsx(re,{size:16})]})]})}),e.jsxs(V,{children:[g&&e.jsxs($i,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(me,{size:16}),"Welcome hug sent to ",E,"!"]}),j&&e.jsxs(Di,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(le,{size:16}),S]})]})]})},Ri=r.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`,Ai=r.header`
  background-color: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`,Wi=r.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 8px;
`,Ui=r.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`,Ni=r.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    .user-name {
      display: none;
    }
  }
`,Li=r(w.div)`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #6c5ce7;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
  box-shadow: 0 2px 8px rgba(108, 92, 231, 0.25);
`,Ii=r.span`
  font-weight: 500;
  margin-right: 1rem;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  
  @media (max-width: 480px) {
    max-width: 80px;
  }
`,Bi=r(w.button)`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
  
  &:hover {
    color: #e74c3c;
    background-color: #f8f9fa;
  }
`,Yi=r.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`,Vi=r(w.div)`
  background-color: #6c5ce7;
  background-image: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 20px rgba(108, 92, 231, 0.15);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  h1 {
    margin-bottom: 1rem;
    color: white;
    position: relative;
    z-index: 1;
    font-size: 1.8rem;
    
    @media (max-width: 480px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 1rem;
    position: relative;
    z-index: 1;
    max-width: 700px;
    font-size: 1.1rem;
    line-height: 1.5;
    
    @media (max-width: 480px) {
      font-size: 1rem;
    }
  }
`,Oi=r.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
`,Gi=r(w.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`,Xi=r.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2.5rem 0;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`,Te=r.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,$e=r(w.h2)`
  margin: 2rem 0 1rem;
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, #e0e0e0, transparent);
    margin-left: 1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`,ce=r(w.div)`
  background-color: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    color: #6c5ce7;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;
    z-index: 1;
    font-size: 1.3rem;
  }
  
  p {
    color: #666;
    position: relative;
    z-index: 1;
    margin-bottom: 0;
    line-height: 1.5;
  }
`,de=r.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
`,ee={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.5,ease:[.22,1,.36,1]}}},_i={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},ta=()=>{const{currentUser:t,logout:i}=Be(),[n,d]=l.useState(!0),o=Ye();l.useEffect(()=>{const x=localStorage.getItem("redirectToDashboard")==="true";x&&(console.log("Dashboard detected redirect flag from login"),localStorage.removeItem("redirectToDashboard"));const g=setTimeout(()=>{d(!1),x&&console.log("Dashboard fully loaded after login redirect")},1e3);return()=>clearTimeout(g)},[]);const c=async()=>{await i(),o("/login")},s=x=>{o(x)},u=x=>x?x.split(" ").map(g=>g[0]).join("").toUpperCase().substring(0,2):"?";return n?e.jsx(Ve,{text:"Loading dashboard..."}):e.jsxs(Ri,{children:[e.jsxs(Ai,{children:[e.jsxs(Wi,{children:[e.jsx(M,{type:"hugIcon",size:28}),"HugMeNow"]}),e.jsxs(Ui,{children:[e.jsx(pi,{onSent:()=>console.log("Quick hug sent successfully!")}),e.jsx(Pi,{onSent:()=>console.log("Welcome hug and friend request sent successfully!")}),e.jsxs(Ni,{children:[e.jsx(Li,{initial:{scale:0},animate:{scale:1},transition:{type:"spring",bounce:.5},whileHover:{scale:1.1},children:u(t==null?void 0:t.name)}),e.jsx(Ii,{className:"user-name",children:(t==null?void 0:t.name)||"Guest"}),e.jsx(Bi,{onClick:c,whileHover:{scale:1.05},whileTap:{scale:.95},children:"Logout"})]})]})]}),e.jsxs(Yi,{children:[e.jsxs(Vi,{initial:"hidden",animate:"visible",variants:ee,children:[e.jsx(Oi,{children:e.jsxs("svg",{viewBox:"0 0 300 200",fill:"none",children:[e.jsx("circle",{cx:"250",cy:"50",r:"200",fill:"white"}),e.jsx("circle",{cx:"50",cy:"150",r:"100",fill:"white"})]})}),e.jsxs("h1",{children:["Welcome, ",(t==null?void 0:t.name)||"Friend","!"]}),e.jsx("p",{children:"Track your daily emotions, send and receive virtual hugs, and connect with supportive friends."})]}),e.jsx(Ut,{}),e.jsxs($e,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx(M,{type:"heart",size:20}),"Your Activity Center"]}),e.jsxs(Xi,{children:[e.jsxs(Te,{children:[e.jsx(w.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:e.jsx(Qr,{})}),e.jsx(w.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},children:e.jsx(xt,{})})]}),e.jsxs(Te,{children:[e.jsx(w.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.4},children:e.jsx(Xn,{})}),e.jsx(w.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},children:e.jsx(yn,{})})]})]}),e.jsxs($e,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx(M,{type:"moodTracker",size:20}),"Featured Tools"]}),e.jsxs(Gi,{variants:_i,initial:"hidden",animate:"visible",children:[e.jsxs(ce,{onClick:()=>s("/mood-tracker"),variants:ee,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(de,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"var(--primary-color)"})})}),e.jsxs("h3",{children:[e.jsx(M,{type:"moodTracker",size:24}),"Mood Tracker"]}),e.jsx("p",{children:"Track your daily mood and discover patterns in your emotional well-being over time."})]}),e.jsxs(ce,{onClick:()=>s("/hug-center"),variants:ee,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(de,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#9D65C9"})})}),e.jsxs("h3",{children:[e.jsx(M,{type:"ComfortingHug",size:28}),"Hug Center"]}),e.jsx("p",{children:"Send customized virtual hugs to friends or request support from your community."})]}),e.jsxs(ce,{onClick:()=>s("/profile"),variants:ee,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(de,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#4CAF50"})})}),e.jsxs("h3",{children:[e.jsx(M,{type:"profile",size:24}),"Profile"]}),e.jsx("p",{children:"Customize your profile, manage privacy settings, and track your emotional journey."})]})]})]})]})};export{ta as default};
//# sourceMappingURL=Dashboard-159eb982.js.map
