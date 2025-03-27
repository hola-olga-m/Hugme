import{m as $e,d as n,j as e,r as x,c as K,u as Pe,a as We,L as Ae}from"./main-80d2cd30.js";import{u as _,G as Ie,E as Ne,a as Be,b as Le,S as ae,c as Ue,d as Ge,M as Ve}from"./ErrorMessage-8a3f2950.js";import{m as f}from"./motion-5f45b8a7.js";import{F as _e,a as Oe,b as A,c as Ye,d as Me,e as Fe,f as Xe,g as Je,h as qe,i as Qe,j as Ee,k as ce}from"./index.esm-22e5da1a.js";import{A as V}from"./index-f01790a2.js";const Ze=$e`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,Ke=n.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`,et=n.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${Ze} 1s linear infinite;
`,tt=n.div`
  margin-top: 1rem;
  color: var(--gray-600);
  font-size: 0.9rem;
`,rt=({text:t="Loading..."})=>e.jsxs(Ke,{children:[e.jsx(et,{}),t&&e.jsx(tt,{children:t})]}),de=n.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,le=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
`,ue=n.button`
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
`,nt=n.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,it=n.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`,at=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,ot=n.div`
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
`,st=n.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,ct=n.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`,dt=n.div`
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
`,lt=n.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,ut=t=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(t)-1,4)],gt=t=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(t)-1,4)],ht=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),pt=t=>t?t.split(" ").map(i=>i[0]).join("").toUpperCase().substring(0,2):"?",mt=()=>{const{loading:t,error:i,data:r,refetch:d}=_(Ie);if(t)return e.jsx(rt,{text:"Loading public moods..."});if(i)return e.jsx(Ne,{error:i});const a=(r==null?void 0:r.publicMoods)||[];return a.length===0?e.jsxs(de,{children:[e.jsxs(le,{children:[e.jsx("h2",{children:"Community Moods"}),e.jsx(ue,{onClick:()=>d(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsxs(lt,{children:[e.jsx("p",{children:"No public moods have been shared yet."}),e.jsx("p",{children:"The community mood board will populate as users share their feelings."})]})]}):e.jsxs(de,{children:[e.jsxs(le,{children:[e.jsx("h2",{children:"Community Moods"}),e.jsx(ue,{onClick:()=>d(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsx(nt,{children:a.map(s=>{var o,c;return e.jsxs(it,{children:[e.jsxs(at,{children:[e.jsxs(ot,{children:[e.jsx("span",{className:"emoji",children:ut(s.score)}),e.jsx("span",{className:"label",children:gt(s.score)})]}),e.jsx(st,{children:ht(s.createdAt)})]}),s.note&&e.jsx(ct,{children:s.note}),e.jsxs(dt,{children:[e.jsx("div",{className:"avatar",children:pt((o=s.user)==null?void 0:o.name)}),e.jsx("span",{children:((c=s.user)==null?void 0:c.name)||"Anonymous User"})]})]},s.id)})})]})},xt="/assets/happy-face-8e76819c.svg",ft="/assets/hug-icon-a65e4efe.svg",bt="/assets/mood-tracker-8aaefd8f.svg",yt="/assets/community-ef14f86f.svg",vt="/assets/ComfortingHug-7b35f3f0.png",wt="/assets/EnthusiasticHug-34cb3319.png",jt="/assets/GroupHug-720ddcec.png",ge="/assets/StandardHug-fced95c7.png",kt="/assets/SupportiveHug-de556136.png",Ct="/assets/VirtualHug-f24120c7.png",Ht="/assets/RelaxingHug-b42c8043.png",St="/assets/WelcomeHug-41a086c9.png",Mt="/assets/FriendlyHug-108d9a39.png",Ft="/assets/GentleHug-9e995eae.png",Et="/assets/FamilyHug-e5aea984.png",Tt="/assets/SmilingHug-06fbeb08.png",zt={verySad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 45C40 45 45 40 50 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 45C70 45 75 40 80 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 85C40 85 60 75 80 85' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",sad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 80C40 80 60 70 80 80' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",neutral:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 75C40 75 60 75 80 75' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",happy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 70C40 70 60 80 80 70' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",veryHappy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M35 45C35 45 40 40 45 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M75 45C75 45 80 40 85 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M35 65C35 65 60 90 85 65' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E"},Dt="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23EC4899'/%3E%3C/svg%3E",Rt="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2c3 4 5 6 9 7-4 4-7 8-7 13H10c0-5-3-9-7-13 4-1 6-3 9-7z' fill='%23F59E0B'/%3E%3C/svg%3E",w=({type:t,score:i,size:r=40,animate:d=!0,...a})=>{if(t==="mood"&&i!==void 0){let c;if(i===null)return e.jsx("div",{style:{width:r,height:r}});i>=8.5?c="veryHappy":i>=7?c="happy":i>=5?c="neutral":i>=3?c="sad":c="verySad";const h=zt[c];return d?e.jsx(f.img,{src:h,alt:`Mood level: ${c}`,width:r,height:r,initial:{scale:0},animate:{scale:1,rotate:[0,10,-10,0]},transition:{type:"spring",damping:10,stiffness:100,delay:.3},...a}):e.jsx("img",{src:h,alt:`Mood level: ${c}`,width:r,height:r,...a})}let s,o;switch(t){case"happyFace":s=xt,o="Happy Face";break;case"hugIcon":s=ft,o="Hug Icon";break;case"moodTracker":s=bt,o="Mood Tracker";break;case"community":s=yt,o="Community";break;case"heart":s=Dt,o="Heart";break;case"fire":s=Rt,o="Fire";break;case"Comforting":case"ComfortingHug":s=vt,o="Comforting Hug";break;case"Enthusiastic":case"EnthusiasticHug":s=wt,o="Enthusiastic Hug";break;case"Group":case"GroupHug":s=jt,o="Group Hug";break;case"Standard":case"StandardHug":s=ge,o="Standard Hug";break;case"Supportive":case"SupportiveHug":s=kt,o="Supportive Hug";break;case"Virtual":case"VirtualHug":s=Ct,o="Virtual Hug";break;case"Relaxing":case"RelaxingHug":s=Ht,o="Relaxing Hug";break;case"Welcome":case"WelcomeHug":s=St,o="Welcome Hug";break;case"Friendly":case"FriendlyHug":s=Mt,o="Friendly Hug";break;case"Gentle":case"GentleHug":s=Ft,o="Gentle Hug";break;case"Family":case"FamilyHug":s=Et,o="Family Hug";break;case"Smiling":case"SmilingHug":s=Tt,o="Smiling Hug";break;default:if(t&&t.includes("Hug"))s=ge,o=t;else return null}return d?o&&o.includes("Hug")?e.jsx(f.img,{src:s,alt:o,width:r,height:r,initial:{scale:0,rotate:-5},animate:{scale:1,rotate:0,y:[0,-5,0]},whileHover:{scale:1.1,rotate:[-2,2,-2,0],transition:{rotate:{repeat:0,duration:.5},scale:{duration:.2}}},transition:{type:"spring",damping:12,stiffness:150,delay:.2,y:{repeat:1/0,repeatType:"reverse",duration:1.5,ease:"easeInOut"}},...a}):e.jsx(f.img,{src:s,alt:o,width:r,height:r,initial:{scale:0},animate:{scale:1},transition:{type:"spring",damping:15,stiffness:200,delay:.2},...a}):e.jsx("img",{src:s,alt:o,width:r,height:r,...a})},he=n.div`
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
`,pe=n(f.div)`
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
`,me=n.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0 5px;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
`,xe=n.div`
  font-size: 1rem;
  color: var(--gray-600);
  font-weight: 500;
  position: relative;
  z-index: 1;
`,fe=n.div`
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
`,$t=n.div`
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
`,Pt={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.15}}},Wt={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{type:"spring",damping:12,stiffness:200}}},At=()=>{const{data:t,loading:i}=_(Be),r=(t==null?void 0:t.userStats)||{moodStreak:0,totalMoodEntries:0,hugsSent:0,hugsReceived:0},d=[{label:"Day Streak",value:r.moodStreak,icon:"fire",color:"#FF9800",bgColor:"rgba(255, 152, 0, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#FF9800"})})},{label:"Moods Tracked",value:r.totalMoodEntries,icon:"moodTracker",color:"#4CAF50",bgColor:"rgba(76, 175, 80, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#4CAF50"})})},{label:"Hugs Sent",value:r.hugsSent,icon:"StandardHug",color:"#6c5ce7",bgColor:"rgba(108, 92, 231, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#6c5ce7"})})},{label:"Hugs Received",value:r.hugsReceived,icon:"ComfortingHug",color:"#9D65C9",bgColor:"rgba(157, 101, 201, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#9D65C9"})})}];return i?e.jsx(he,{children:[1,2,3,4].map((a,s)=>e.jsxs(pe,{style:{opacity:.5},children:[e.jsx(fe,{style:{background:"#f0f0f0"}}),e.jsx(me,{style:{background:"#f0f0f0",width:"60px",height:"40px"}}),e.jsx(xe,{style:{background:"#f0f0f0",width:"80px",height:"20px"}})]},s))}):e.jsx(he,{as:f.div,variants:Pt,initial:"hidden",animate:"visible",children:d.map((a,s)=>e.jsxs(pe,{variants:Wt,children:[e.jsx(fe,{bgColor:a.bgColor,iconColor:a.color,children:e.jsx(w,{type:a.icon,size:28})}),e.jsx(me,{style:{color:a.color},children:a.value}),e.jsx(xe,{children:a.label}),e.jsx($t,{children:a.decoration})]},s))})},X=43200,be=1440,ye=Symbol.for("constructDateFrom");function oe(t,i){return typeof t=="function"?t(i):t&&typeof t=="object"&&ye in t?t[ye](i):t instanceof Date?new t.constructor(i):new Date(i)}function z(t,i){return oe(i||t,t)}let It={};function Nt(){return It}function ve(t){const i=z(t),r=new Date(Date.UTC(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours(),i.getMinutes(),i.getSeconds(),i.getMilliseconds()));return r.setUTCFullYear(i.getFullYear()),+t-+r}function se(t,...i){const r=oe.bind(null,t||i.find(d=>typeof d=="object"));return i.map(r)}function Z(t,i){const r=+z(t)-+z(i);return r<0?-1:r>0?1:r}function Bt(t){return oe(t,Date.now())}function Lt(t,i,r){const[d,a]=se(r==null?void 0:r.in,t,i),s=d.getFullYear()-a.getFullYear(),o=d.getMonth()-a.getMonth();return s*12+o}function Ut(t){return i=>{const d=(t?Math[t]:Math.trunc)(i);return d===0?0:d}}function Gt(t,i){return+z(t)-+z(i)}function Vt(t,i){const r=z(t,i==null?void 0:i.in);return r.setHours(23,59,59,999),r}function _t(t,i){const r=z(t,i==null?void 0:i.in),d=r.getMonth();return r.setFullYear(r.getFullYear(),d+1,0),r.setHours(23,59,59,999),r}function Ot(t,i){const r=z(t,i==null?void 0:i.in);return+Vt(r,i)==+_t(r,i)}function Yt(t,i,r){const[d,a,s]=se(r==null?void 0:r.in,t,t,i),o=Z(a,s),c=Math.abs(Lt(a,s));if(c<1)return 0;a.getMonth()===1&&a.getDate()>27&&a.setDate(30),a.setMonth(a.getMonth()-o*c);let h=Z(a,s)===-o;Ot(d)&&c===1&&Z(d,s)===1&&(h=!1);const m=o*(c-+h);return m===0?0:m}function Xt(t,i,r){const d=Gt(t,i)/1e3;return Ut(r==null?void 0:r.roundingMethod)(d)}const Jt={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},qt=(t,i,r)=>{let d;const a=Jt[t];return typeof a=="string"?d=a:i===1?d=a.one:d=a.other.replace("{{count}}",i.toString()),r!=null&&r.addSuffix?r.comparison&&r.comparison>0?"in "+d:d+" ago":d};function ee(t){return(i={})=>{const r=i.width?String(i.width):t.defaultWidth;return t.formats[r]||t.formats[t.defaultWidth]}}const Qt={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},Zt={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},Kt={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},er={date:ee({formats:Qt,defaultWidth:"full"}),time:ee({formats:Zt,defaultWidth:"full"}),dateTime:ee({formats:Kt,defaultWidth:"full"})},tr={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},rr=(t,i,r,d)=>tr[t];function U(t){return(i,r)=>{const d=r!=null&&r.context?String(r.context):"standalone";let a;if(d==="formatting"&&t.formattingValues){const o=t.defaultFormattingWidth||t.defaultWidth,c=r!=null&&r.width?String(r.width):o;a=t.formattingValues[c]||t.formattingValues[o]}else{const o=t.defaultWidth,c=r!=null&&r.width?String(r.width):t.defaultWidth;a=t.values[c]||t.values[o]}const s=t.argumentCallback?t.argumentCallback(i):i;return a[s]}}const nr={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},ir={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},ar={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},or={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},sr={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},cr={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},dr=(t,i)=>{const r=Number(t),d=r%100;if(d>20||d<10)switch(d%10){case 1:return r+"st";case 2:return r+"nd";case 3:return r+"rd"}return r+"th"},lr={ordinalNumber:dr,era:U({values:nr,defaultWidth:"wide"}),quarter:U({values:ir,defaultWidth:"wide",argumentCallback:t=>t-1}),month:U({values:ar,defaultWidth:"wide"}),day:U({values:or,defaultWidth:"wide"}),dayPeriod:U({values:sr,defaultWidth:"wide",formattingValues:cr,defaultFormattingWidth:"wide"})};function G(t){return(i,r={})=>{const d=r.width,a=d&&t.matchPatterns[d]||t.matchPatterns[t.defaultMatchWidth],s=i.match(a);if(!s)return null;const o=s[0],c=d&&t.parsePatterns[d]||t.parsePatterns[t.defaultParseWidth],h=Array.isArray(c)?gr(c,k=>k.test(o)):ur(c,k=>k.test(o));let m;m=t.valueCallback?t.valueCallback(h):h,m=r.valueCallback?r.valueCallback(m):m;const y=i.slice(o.length);return{value:m,rest:y}}}function ur(t,i){for(const r in t)if(Object.prototype.hasOwnProperty.call(t,r)&&i(t[r]))return r}function gr(t,i){for(let r=0;r<t.length;r++)if(i(t[r]))return r}function hr(t){return(i,r={})=>{const d=i.match(t.matchPattern);if(!d)return null;const a=d[0],s=i.match(t.parsePattern);if(!s)return null;let o=t.valueCallback?t.valueCallback(s[0]):s[0];o=r.valueCallback?r.valueCallback(o):o;const c=i.slice(a.length);return{value:o,rest:c}}}const pr=/^(\d+)(th|st|nd|rd)?/i,mr=/\d+/i,xr={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},fr={any:[/^b/i,/^(a|c)/i]},br={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},yr={any:[/1/i,/2/i,/3/i,/4/i]},vr={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},wr={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},jr={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},kr={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},Cr={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},Hr={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},Sr={ordinalNumber:hr({matchPattern:pr,parsePattern:mr,valueCallback:t=>parseInt(t,10)}),era:G({matchPatterns:xr,defaultMatchWidth:"wide",parsePatterns:fr,defaultParseWidth:"any"}),quarter:G({matchPatterns:br,defaultMatchWidth:"wide",parsePatterns:yr,defaultParseWidth:"any",valueCallback:t=>t+1}),month:G({matchPatterns:vr,defaultMatchWidth:"wide",parsePatterns:wr,defaultParseWidth:"any"}),day:G({matchPatterns:jr,defaultMatchWidth:"wide",parsePatterns:kr,defaultParseWidth:"any"}),dayPeriod:G({matchPatterns:Cr,defaultMatchWidth:"any",parsePatterns:Hr,defaultParseWidth:"any"})},Mr={code:"en-US",formatDistance:qt,formatLong:er,formatRelative:rr,localize:lr,match:Sr,options:{weekStartsOn:0,firstWeekContainsDate:1}};function Fr(t,i,r){const d=Nt(),a=(r==null?void 0:r.locale)??d.locale??Mr,s=2520,o=Z(t,i);if(isNaN(o))throw new RangeError("Invalid time value");const c=Object.assign({},r,{addSuffix:r==null?void 0:r.addSuffix,comparison:o}),[h,m]=se(r==null?void 0:r.in,...o>0?[i,t]:[t,i]),y=Xt(m,h),k=(ve(m)-ve(h))/1e3,p=Math.round((y-k)/60);let S;if(p<2)return r!=null&&r.includeSeconds?y<5?a.formatDistance("lessThanXSeconds",5,c):y<10?a.formatDistance("lessThanXSeconds",10,c):y<20?a.formatDistance("lessThanXSeconds",20,c):y<40?a.formatDistance("halfAMinute",0,c):y<60?a.formatDistance("lessThanXMinutes",1,c):a.formatDistance("xMinutes",1,c):p===0?a.formatDistance("lessThanXMinutes",1,c):a.formatDistance("xMinutes",p,c);if(p<45)return a.formatDistance("xMinutes",p,c);if(p<90)return a.formatDistance("aboutXHours",1,c);if(p<be){const j=Math.round(p/60);return a.formatDistance("aboutXHours",j,c)}else{if(p<s)return a.formatDistance("xDays",1,c);if(p<X){const j=Math.round(p/be);return a.formatDistance("xDays",j,c)}else if(p<X*2)return S=Math.round(p/X),a.formatDistance("aboutXMonths",S,c)}if(S=Yt(m,h),S<12){const j=Math.round(p/X);return a.formatDistance("xMonths",j,c)}else{const j=S%12,H=Math.trunc(S/12);return j<3?a.formatDistance("aboutXYears",H,c):j<9?a.formatDistance("overXYears",H,c):a.formatDistance("almostXYears",H+1,c)}}function Te(t,i){return Fr(t,Bt(t),i)}const Er=n(f.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,Tr=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,zr=n.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,Dr=n.button`
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
`,te=n.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
`,Rr=n.div`
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
`,$r=n(f.div)`
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
`,Pr=n.div`
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
`,Wr=n.div`
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
`,Ar=n.div`
  flex: 1;
`,Ir=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`,Nr=n.span`
  font-weight: 600;
  color: #333;
`,Br=n.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: ${t=>t.score>=8?"#4cd964":t.score>=5?"#ffcc00":"#ff3b30"};
  color: ${t=>t.score>=8?"#006400":t.score>=5?"#664d00":"#fff"};
`,Lr=n.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Ur=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #888;
  font-size: 0.8rem;
`,Gr=n.span`
  display: flex;
  align-items: center;
  gap: 4px;
`,Vr=n.button`
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
`,_r=n.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`,Or=n(f.div)`
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
`,Yr=n(f.div)`
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
`,Xr=n.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`,re=n.button`
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
`,Jr=()=>{var $;const{loading:t,error:i,data:r,refetch:d}=_(Le,{variables:{limit:10},fetchPolicy:"network-only",pollInterval:6e4}),[a,s]=x.useState(null),[o,c]=x.useState("all"),[h,m]=x.useState(!1),[y,k]=x.useState(null),[p,S]=x.useState(null),[j,{loading:H}]=K(ae),M=(($=r==null?void 0:r.friendsMoods)==null?void 0:$.filter(b=>b.score<=4))||[],F=M.length>0;x.useEffect(()=>{if(h){const b=setTimeout(()=>{m(!1)},3e3);return()=>clearTimeout(b)}},[h]);const D=b=>b?b.split(" ").map(u=>u[0]).join("").toUpperCase().substring(0,2):"?",R=b=>{const u=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],C=b?b.charCodeAt(0)%u.length:0;return u[C]},I=async(b,u)=>{var C;if(b.stopPropagation(),!H){S(u.user.id);try{(C=(await j({variables:{input:{receiverId:u.user.id,type:u.score<=4?"ComfortingHug":"StandardHug",message:u.score<=4?"I noticed you're not feeling great. Sending you a comforting hug!":"Hey! Just sending a friendly hug your way!"}}})).data)!=null&&C.sendHug&&(k(u.user.name||u.user.username),m(!0),setTimeout(()=>{d()},1e3))}catch(T){console.error("Error sending hug:",T)}finally{S(null)}}},N=()=>{if(!(r!=null&&r.friendsMoods))return[];let b=[...r.friendsMoods];return o==="needSupport"?b.filter(u=>u.score<=4):o==="recent"?b.sort((u,C)=>new Date(C.createdAt)-new Date(u.createdAt)):b},E=()=>{if(t)return e.jsx(_r,{children:"Loading friends' moods..."});if(i)return e.jsx(te,{children:"Couldn't load friends' moods. Please try again."});if(!r||!r.friendsMoods||r.friendsMoods.length===0)return e.jsx(te,{children:"No friend moods yet. Add friends to see their moods here!"});const b=N();return b.length===0?e.jsx(te,{children:"No moods match the current filter."}):e.jsx(Rr,{children:b.map(u=>{const C=u.score<=4;return e.jsxs($r,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},onClick:()=>s(a===u.id?null:u.id),needsSupport:C,children:[C&&e.jsx(Wr,{children:e.jsx(Ye,{size:12})}),e.jsx(Pr,{bgColor:R(u.user.id),children:u.user.avatarUrl?e.jsx("img",{src:u.user.avatarUrl,alt:u.user.name}):D(u.user.name||u.user.username)}),e.jsxs(Ar,{children:[e.jsxs(Ir,{children:[e.jsx(Nr,{children:u.user.name||u.user.username}),e.jsxs(Br,{score:u.score,children:[u.score,"/10"]})]}),e.jsx(Lr,{children:u.note||"No description provided."}),e.jsxs(Ur,{children:[e.jsxs(Gr,{children:[e.jsx(Me,{size:12}),Te(new Date(u.createdAt),{addSuffix:!0})]}),e.jsx(Vr,{onClick:T=>I(T,u),needsSupport:C,disabled:H&&p===u.user.id,children:H&&p===u.user.id?"Sending...":e.jsxs(e.Fragment,{children:[C?e.jsx(A,{size:12}):e.jsx(Fe,{size:12}),C?"Send Support":"Send Hug"]})})]})]})]},u.id)})})};return e.jsxs(Er,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsxs(Tr,{children:[e.jsxs(zr,{children:[e.jsx(_e,{size:16}),"Friends' Moods",F&&e.jsx(f.span,{style:{background:"#ff3b30",color:"white",borderRadius:"50%",width:"20px",height:"20px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:"bold"},initial:{scale:0},animate:{scale:1},transition:{type:"spring",stiffness:500,damping:15},children:M.length})]}),e.jsx(Dr,{children:"View All"})]}),e.jsx(V,{children:F&&e.jsxs(Or,{initial:{opacity:0,height:0,marginBottom:0},animate:{opacity:1,height:"auto",marginBottom:12},exit:{opacity:0,height:0,marginBottom:0},children:[e.jsx(Oe,{size:18,color:"#d32f2f"}),e.jsxs("p",{children:[M.length===1?`${M[0].user.name||"Your friend"} is feeling down.`:`${M.length} friends are having a tough time.`,"Consider sending support!"]})]})}),e.jsxs(Xr,{children:[e.jsx(re,{active:o==="all",onClick:()=>c("all"),children:"All"}),e.jsxs(re,{active:o==="needSupport",onClick:()=>c("needSupport"),children:["Needs Support ",F&&`(${M.length})`]}),e.jsx(re,{active:o==="recent",onClick:()=>c("recent"),children:"Recent"})]}),E(),e.jsx(V,{children:h&&e.jsxs(Yr,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(A,{size:16}),"Hug sent to ",y,"!"]})})]})},qr=n(f.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,Qr=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Zr=n.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,Kr=n.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`,en=n.input`
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
`,tn=n.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
`,rn=n.button`
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
`,nn=n.div`
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
`,W=n.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  background: ${t=>t.selected?"rgba(108, 92, 231, 0.1)":"transparent"};
  border: 1px solid ${t=>t.selected?"#6c5ce7":"#eee"};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 70px;
  flex-shrink: 0;
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
  }
  
  .icon-wrapper {
    width: 30px;
    height: 30px;
    margin-bottom: 6px;
  }
  
  span {
    font-size: 0.7rem;
    color: ${t=>t.selected?"#6c5ce7":"#666"};
  }
`,an=n.div`
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
`,on=n.div`
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
`,sn=n.div`
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
`,cn=n.div`
  flex: 1;
`,dn=n.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`,ln=n.div`
  color: #888;
  font-size: 0.8rem;
`,un=n.button`
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
`,gn=n.textarea`
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
`,we=n.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
`,J=n.button`
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
`,hn=n.div`
  margin-bottom: 1rem;
`,pn=n.input`
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
`,mn=n.button`
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
`,je=n.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`,xn=n.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`,fn=n(f.div)`
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
`,ke=n.div`
  color: #ff3b30;
  font-size: 0.8rem;
  margin-top: 4px;
  margin-bottom: 8px;
`,bn=()=>{const[t,i]=x.useState("friends"),[r,d]=x.useState(""),[a,s]=x.useState("StandardHug"),[o,c]=x.useState(null),[h,m]=x.useState(""),[y,k]=x.useState(""),[p,S]=x.useState("email"),[j,H]=x.useState(!1),[M,F]=x.useState(""),[D,R]=x.useState(!1),{loading:I,error:N,data:E}=_(Ue,{variables:{limit:10,search:r},fetchPolicy:"network-only"}),[$,{loading:b}]=K(ae);x.useEffect(()=>{if(j){const l=setTimeout(()=>{H(!1)},3e3);return()=>clearTimeout(l)}},[j]),x.useEffect(()=>{t==="external"&&(p==="email"?R(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(y)):p==="telegram"&&R(y.trim().length>0))},[y,p,t]),x.useEffect(()=>{let l="";switch(a){case"ComfortingHug":l="I'm sending you a comforting hug to help you feel better!";break;case"FriendlyHug":l="Hey friend! Thought you might appreciate a friendly hug today.";break;case"EnthusiasticHug":l="Sending you an enthusiastic hug to celebrate with you!";break;case"GroupHug":l="Group hug! Bringing us all together.";break;case"FamilyHug":l="A warm family hug to let you know I care about you.";break;case"StandardHug":default:l="Just sending a hug to brighten your day!";break}m(l)},[a]);const u=l=>l?l.split(" ").map(P=>P[0]).join("").toUpperCase().substring(0,2):"?",C=l=>{const P=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],L=l?l.charCodeAt(0)%P.length:0;return P[L]},T=async()=>{var l,P;F("");try{t==="friends"&&o?(l=(await $({variables:{input:{receiverId:o.id,type:a,message:h.trim()}}})).data)!=null&&l.sendHug&&(H(!0),c(null),O()):t==="external"&&D&&(P=(await $({variables:{input:{externalRecipient:{type:p,contact:y.trim()},type:a,message:h.trim()}}})).data)!=null&&P.sendHug&&(H(!0),O())}catch(L){console.error("Error sending hug:",L),F("Failed to send hug. Please try again.")}},O=()=>{m(Y(a)),k("")},Y=l=>{switch(l){case"ComfortingHug":return"I'm sending you a comforting hug to help you feel better!";case"FriendlyHug":return"Hey friend! Thought you might appreciate a friendly hug today.";case"EnthusiasticHug":return"Sending you an enthusiastic hug to celebrate with you!";case"GroupHug":return"Group hug! Bringing us all together.";case"FamilyHug":return"A warm family hug to let you know I care about you.";case"StandardHug":default:return"Just sending a hug to brighten your day!"}},g=l=>{d(l.target.value)},v=()=>{d("")},B=l=>{o&&o.id===l.id?c(null):c(l)},ze=()=>I?e.jsx(xn,{children:"Loading friends..."}):N?e.jsx(je,{children:"Error loading friends. Please try again."}):!E||!E.users||E.users.length===0?e.jsx(je,{children:"No friends found. Add some friends to send hugs!"}):e.jsx(an,{children:E.users.map(l=>e.jsxs(on,{selected:o&&o.id===l.id,onClick:()=>B(l),children:[e.jsx(sn,{bgColor:C(l.id),children:l.avatarUrl?e.jsx("img",{src:l.avatarUrl,alt:l.name}):u(l.name||l.username)}),e.jsxs(cn,{children:[e.jsx(dn,{children:l.name||"Unnamed User"}),e.jsxs(ln,{children:["@",l.username]})]}),e.jsx(un,{selected:o&&o.id===l.id,children:o&&o.id===l.id?e.jsx(Ee,{size:14}):null})]},l.id))}),De=()=>e.jsxs(hn,{children:[e.jsxs(we,{style:{marginBottom:"8px"},children:[e.jsx(J,{active:p==="email",onClick:()=>S("email"),children:"Email"}),e.jsx(J,{active:p==="telegram",onClick:()=>S("telegram"),children:"Telegram"})]}),e.jsx(pn,{type:p==="email"?"email":"text",placeholder:p==="email"?"Enter email address":"Enter Telegram username",value:y,onChange:l=>k(l.target.value)}),!D&&y.trim()!==""&&e.jsx(ke,{children:p==="email"?"Please enter a valid email address.":"Please enter a valid Telegram username."})]}),Re=()=>t==="friends"?o!==null&&h.trim()!=="":t==="external"?D&&h.trim()!=="":!1;return e.jsxs(qr,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsx(Qr,{children:e.jsxs(Zr,{children:[e.jsx(Fe,{size:16}),"Quick Send Hug"]})}),e.jsxs(we,{children:[e.jsxs(J,{active:t==="friends",onClick:()=>i("friends"),children:[e.jsx(Xe,{size:14,style:{marginRight:"4px"}}),"Friends"]}),e.jsxs(J,{active:t==="external",onClick:()=>i("external"),children:[e.jsx(Je,{size:14,style:{marginRight:"4px"}}),"External"]})]}),t==="friends"&&e.jsxs(e.Fragment,{children:[e.jsxs(Kr,{children:[e.jsx(tn,{children:e.jsx(qe,{size:16})}),e.jsx(en,{type:"text",placeholder:"Search friends...",value:r,onChange:g}),e.jsx(rn,{visible:r!=="",onClick:v,children:e.jsx(Qe,{size:16})})]}),ze()]}),t==="external"&&De(),e.jsxs(nn,{children:[e.jsxs(W,{selected:a==="StandardHug",onClick:()=>s("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"StandardHug",size:24})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(W,{selected:a==="FriendlyHug",onClick:()=>s("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"FriendlyHug",size:24})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(W,{selected:a==="ComfortingHug",onClick:()=>s("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"ComfortingHug",size:24})}),e.jsx("span",{children:"Comforting"})]}),e.jsxs(W,{selected:a==="EnthusiasticHug",onClick:()=>s("EnthusiasticHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"EnthusiasticHug",size:24})}),e.jsx("span",{children:"Enthusiastic"})]}),e.jsxs(W,{selected:a==="FamilyHug",onClick:()=>s("FamilyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"FamilyHug",size:24})}),e.jsx("span",{children:"Family"})]}),e.jsxs(W,{selected:a==="GroupHug",onClick:()=>s("GroupHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"GroupHug",size:24})}),e.jsx("span",{children:"Group"})]})]}),e.jsx(gn,{placeholder:"Write your message...",value:h,onChange:l=>m(l.target.value)}),M&&e.jsx(ke,{children:M}),e.jsxs(mn,{onClick:T,disabled:!Re()||b,children:[b?"Sending...":"Send Hug",e.jsx(A,{size:16})]}),e.jsx(V,{children:j&&e.jsxs(fn,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(A,{size:16}),"Hug sent successfully!"]})})]})},yn=n(f.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,vn=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,wn=n.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,jn=n.button`
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
`,Ce=n.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
`,kn=n.div`
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
`,Cn=n(f.div)`
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
  
  ${t=>!t.isRead&&`
    &::before {
      content: '';
      position: absolute;
      top: 12px;
      left: 0;
      width: 4px;
      height: 30px;
      background: #6c5ce7;
      border-radius: 0 4px 4px 0;
    }
  `}
`,Hn=n.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${t=>t.bgColor||"rgba(108, 92, 231, 0.1)"};
  flex-shrink: 0;
  padding: 8px;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`,Sn=n.div`
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
`,Mn=n.div`
  flex: 1;
`,Fn=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`,En=n.span`
  font-weight: 600;
  color: #333;
`,Tn=n.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.75rem;
  background: ${t=>{switch(t.type){case"ComfortingHug":return"rgba(255, 152, 0, 0.15)";case"GroupHug":return"rgba(76, 175, 80, 0.15)";case"EnthusiasticHug":return"rgba(233, 30, 99, 0.15)";case"FriendlyHug":return"rgba(33, 150, 243, 0.15)";case"FamilyHug":return"rgba(156, 39, 176, 0.15)";case"StandardHug":default:return"rgba(108, 92, 231, 0.15)"}}};
  color: ${t=>{switch(t.type){case"ComfortingHug":return"#f57c00";case"GroupHug":return"#388e3c";case"EnthusiasticHug":return"#c2185b";case"FriendlyHug":return"#1976d2";case"FamilyHug":return"#7b1fa2";case"StandardHug":default:return"#5c4ccc"}}};
`,zn=n.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Dn=n.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  font-size: 0.8rem;
`,Rn=n.span`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
`,$n=n.button`
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
`,Pn=n.button`
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
`,Wn=n.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`,An=n.span`
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
`,In=n(f.div)`
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
`,Nn=n(f.div)`
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
`,Bn=n(f.div)`
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
`,Ln=n.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 1rem;
`,q=n.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: ${t=>t.selected?"rgba(108, 92, 231, 0.1)":"#f8f9fa"};
  border: 1px solid ${t=>t.selected?"#6c5ce7":"#eee"};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(108, 92, 231, 0.05);
  }
  
  .icon-wrapper {
    width: 40px;
    height: 40px;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 0.8rem;
    color: #333;
    text-align: center;
  }
`,Un=n.textarea`
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
`,Gn=n.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`,Vn=n.button`
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
`,_n=n.button`
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
`,On=()=>{var Y;const{loading:t,error:i,data:r,refetch:d}=_(Ge,{variables:{limit:10},fetchPolicy:"network-only"}),[a]=K(Ve),[s,{loading:o}]=K(ae),[c,h]=x.useState(null),[m,y]=x.useState(""),[k,p]=x.useState("StandardHug"),[S,j]=x.useState(!1),[H,M]=x.useState(!1),[F,D]=x.useState(null),R=((Y=r==null?void 0:r.receivedHugs)==null?void 0:Y.filter(g=>!g.isRead))||[],I=R.length>0;x.useEffect(()=>{if(H){const g=setTimeout(()=>{M(!1)},3e3);return()=>clearTimeout(g)}},[H]);const N=g=>g?g.split(" ").map(v=>v[0]).join("").toUpperCase().substring(0,2):"?",E=g=>{const v=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],B=g?g.charCodeAt(0)%v.length:0;return v[B]},$=async(g,v)=>{g.stopPropagation();try{await a({variables:{id:v}}),d()}catch(B){console.error("Error marking hug as read:",B)}},b=(g,v)=>{g.stopPropagation(),h(v),y(`Thanks for the ${v.type.replace(/([A-Z])/g," $1").trim().toLowerCase()}!`),p("StandardHug"),j(!0)},u=()=>{j(!1),h(null),y("")},C=async()=>{var g;if(!(!c||!m.trim()))try{(g=(await s({variables:{input:{receiverId:c.sender.id,type:k,message:m.trim()}}})).data)!=null&&g.sendHug&&(D(c.sender.name||c.sender.username),M(!0),u(),setTimeout(()=>{d()},1e3))}catch(v){console.error("Error sending reply hug:",v)}},T=g=>{switch(g){case"ComfortingHug":return"rgba(255, 152, 0, 0.1)";case"GroupHug":return"rgba(76, 175, 80, 0.1)";case"EnthusiasticHug":return"rgba(233, 30, 99, 0.1)";case"FriendlyHug":return"rgba(33, 150, 243, 0.1)";case"FamilyHug":return"rgba(156, 39, 176, 0.1)";case"StandardHug":default:return"rgba(108, 92, 231, 0.1)"}},O=()=>t?e.jsx(Wn,{children:"Loading received hugs..."}):i?e.jsx(Ce,{children:"Couldn't load hugs. Please try again."}):!r||!r.receivedHugs||r.receivedHugs.length===0?e.jsx(Ce,{children:"No hugs received yet. Send some to get the ball rolling!"}):e.jsx(kn,{children:r.receivedHugs.map(g=>e.jsxs(Cn,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},isRead:g.isRead,children:[e.jsxs(Hn,{bgColor:T(g.type),children:[e.jsx(w,{type:g.type,size:30}),e.jsx(Sn,{bgColor:E(g.sender.id),children:N(g.sender.name||g.sender.username)})]}),e.jsxs(Mn,{children:[e.jsxs(Fn,{children:[e.jsx(En,{children:g.sender.name||g.sender.username}),e.jsx(Tn,{type:g.type,children:g.type.replace(/([A-Z])/g," $1").trim()})]}),e.jsx(zn,{children:g.message||"Sent you a hug!"}),e.jsxs(Dn,{children:[e.jsxs(Rn,{children:[e.jsx(Me,{size:12}),Te(new Date(g.createdAt),{addSuffix:!0})]}),!g.isRead&&e.jsxs($n,{onClick:v=>$(v,g.id),children:[e.jsx(Ee,{size:12}),"Mark Read"]}),e.jsxs(Pn,{onClick:v=>b(v,g),children:[e.jsx(ce,{size:12}),"Reply"]})]})]})]},g.id))});return e.jsxs(yn,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsxs(vn,{children:[e.jsxs(wn,{children:[e.jsx(A,{size:16}),"Received Hugs",I&&e.jsx(An,{children:R.length})]}),e.jsx(jn,{children:"View All"})]}),O(),e.jsx(V,{children:S&&c&&e.jsx(Nn,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Bn,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},exit:{y:20,opacity:0},children:[e.jsxs("h4",{children:[e.jsx(ce,{size:18}),"Reply to ",c.sender.name||c.sender.username]}),e.jsxs(Ln,{children:[e.jsxs(q,{selected:k==="StandardHug",onClick:()=>p("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"StandardHug",size:30})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(q,{selected:k==="FriendlyHug",onClick:()=>p("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"FriendlyHug",size:30})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(q,{selected:k==="EnthusiasticHug",onClick:()=>p("EnthusiasticHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"EnthusiasticHug",size:30})}),e.jsx("span",{children:"Enthusiastic"})]}),e.jsxs(q,{selected:k==="ComfortingHug",onClick:()=>p("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(w,{type:"ComfortingHug",size:30})}),e.jsx("span",{children:"Comforting"})]})]}),e.jsx(Un,{value:m,onChange:g=>y(g.target.value),placeholder:"Write your reply message..."}),e.jsxs(Gn,{children:[e.jsx(Vn,{onClick:u,children:"Cancel"}),e.jsx(_n,{onClick:C,disabled:!m.trim()||o,children:o?"Sending...":"Send Reply"})]})]})})}),e.jsx(V,{children:H&&e.jsxs(In,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(A,{size:16}),"Hug sent to ",F,"!"]})})]})},Yn=n.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`,Xn=n.header`
  background-color: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`,Jn=n.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 8px;
`,qn=n.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    .user-name {
      display: none;
    }
  }
`,Qn=n(f.div)`
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
`,Zn=n.span`
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
`,Kn=n(f.button)`
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
`,ei=n.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`,ti=n(f.div)`
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
`,ri=n.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
`,ni=n(f.div)`
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
`,ii=n.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2.5rem 0;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`,He=n.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,Se=n(f.h2)`
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
`,ne=n(f.div)`
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
`,ie=n.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
`,Q={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.5,ease:[.22,1,.36,1]}}},ai={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},ui=()=>{const{currentUser:t,logout:i}=Pe(),[r,d]=x.useState(!0),a=We();x.useEffect(()=>{const h=localStorage.getItem("redirectToDashboard")==="true";h&&(console.log("Dashboard detected redirect flag from login"),localStorage.removeItem("redirectToDashboard"));const m=setTimeout(()=>{d(!1),h&&console.log("Dashboard fully loaded after login redirect")},1e3);return()=>clearTimeout(m)},[]);const s=async()=>{await i(),a("/login")},o=h=>{a(h)},c=h=>h?h.split(" ").map(m=>m[0]).join("").toUpperCase().substring(0,2):"?";return r?e.jsx(Ae,{text:"Loading dashboard..."}):e.jsxs(Yn,{children:[e.jsxs(Xn,{children:[e.jsxs(Jn,{children:[e.jsx(w,{type:"hugIcon",size:28}),"HugMeNow"]}),e.jsxs(qn,{children:[e.jsx(Qn,{initial:{scale:0},animate:{scale:1},transition:{type:"spring",bounce:.5},whileHover:{scale:1.1},children:c(t==null?void 0:t.name)}),e.jsx(Zn,{className:"user-name",children:(t==null?void 0:t.name)||"Guest"}),e.jsx(Kn,{onClick:s,whileHover:{scale:1.05},whileTap:{scale:.95},children:"Logout"})]})]}),e.jsxs(ei,{children:[e.jsxs(ti,{initial:"hidden",animate:"visible",variants:Q,children:[e.jsx(ri,{children:e.jsxs("svg",{viewBox:"0 0 300 200",fill:"none",children:[e.jsx("circle",{cx:"250",cy:"50",r:"200",fill:"white"}),e.jsx("circle",{cx:"50",cy:"150",r:"100",fill:"white"})]})}),e.jsxs("h1",{children:["Welcome, ",(t==null?void 0:t.name)||"Friend","!"]}),e.jsx("p",{children:"Track your daily emotions, send and receive virtual hugs, and connect with supportive friends."})]}),e.jsx(At,{}),e.jsxs(Se,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx(w,{type:"heart",size:20}),"Your Activity Center"]}),e.jsxs(ii,{children:[e.jsxs(He,{children:[e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:e.jsx(Jr,{})}),e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},children:e.jsx(mt,{})})]}),e.jsxs(He,{children:[e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.4},children:e.jsx(On,{})}),e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},children:e.jsx(bn,{})})]})]}),e.jsxs(Se,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx(w,{type:"moodTracker",size:20}),"Featured Tools"]}),e.jsxs(ni,{variants:ai,initial:"hidden",animate:"visible",children:[e.jsxs(ne,{onClick:()=>o("/mood-tracker"),variants:Q,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(ie,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"var(--primary-color)"})})}),e.jsxs("h3",{children:[e.jsx(w,{type:"moodTracker",size:24}),"Mood Tracker"]}),e.jsx("p",{children:"Track your daily mood and discover patterns in your emotional well-being over time."})]}),e.jsxs(ne,{onClick:()=>o("/hug-center"),variants:Q,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(ie,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#9D65C9"})})}),e.jsxs("h3",{children:[e.jsx(w,{type:"ComfortingHug",size:28}),"Hug Center"]}),e.jsx("p",{children:"Send customized virtual hugs to friends or request support from your community."})]}),e.jsxs(ne,{onClick:()=>o("/profile"),variants:Q,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(ie,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#4CAF50"})})}),e.jsxs("h3",{children:[e.jsx(w,{type:"profile",size:24}),"Profile"]}),e.jsx("p",{children:"Customize your profile, manage privacy settings, and track your emotional journey."})]})]})]})]})};export{ui as default};
//# sourceMappingURL=Dashboard-b7d3a825.js.map
