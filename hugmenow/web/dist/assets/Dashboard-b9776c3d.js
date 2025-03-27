import{m as _e,d as r,j as e,r as g,c as G,u as Oe,a as Ge,L as Ve}from"./main-c3ebb1fd.js";import{u as W,G as Ye,E as Xe,a as qe,b as Qe,c as Je,d as Ze,e as Ke,S as Q,f as le,g as et,M as tt,h as rt}from"./ErrorMessage-c0d6e0b9.js";import{m as b}from"./motion-6793201f.js";import{F as nt,a as it,b as N,c as ue,d as Pe,e as re,f as Ae,g as ot,h as We,i as ge,j as Ue,k as xe,l as fe}from"./index.esm-ae6bf928.js";import{A as I}from"./index-91438d28.js";const at=_e`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,st=r.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`,ct=r.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${at} 1s linear infinite;
`,dt=r.div`
  margin-top: 1rem;
  color: var(--gray-600);
  font-size: 0.9rem;
`,lt=({text:t="Loading..."})=>e.jsxs(st,{children:[e.jsx(ct,{}),t&&e.jsx(dt,{children:t})]}),be=r.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,ye=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
`,we=r.button`
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
`,ut=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,gt=r.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`,pt=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,ht=r.div`
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
`,mt=r.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,xt=r.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`,ft=r.div`
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
`,bt=r.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,yt=t=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(t)-1,4)],wt=t=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(t)-1,4)],vt=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),jt=t=>t?t.split(" ").map(i=>i[0]).join("").toUpperCase().substring(0,2):"?",kt=()=>{const{loading:t,error:i,data:n,refetch:s}=W(Ye);if(t)return e.jsx(lt,{text:"Loading public moods..."});if(i)return e.jsx(Xe,{error:i});const a=(n==null?void 0:n.publicMoods)||[];return a.length===0?e.jsxs(be,{children:[e.jsxs(ye,{children:[e.jsx("h2",{children:"Community Moods"}),e.jsx(we,{onClick:()=>s(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsxs(bt,{children:[e.jsx("p",{children:"No public moods have been shared yet."}),e.jsx("p",{children:"The community mood board will populate as users share their feelings."})]})]}):e.jsxs(be,{children:[e.jsxs(ye,{children:[e.jsx("h2",{children:"Community Moods"}),e.jsx(we,{onClick:()=>s(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsx(ut,{children:a.map(d=>{var o,c;return e.jsxs(gt,{children:[e.jsxs(pt,{children:[e.jsxs(ht,{children:[e.jsx("span",{className:"emoji",children:yt(d.score)}),e.jsx("span",{className:"label",children:wt(d.score)})]}),e.jsx(mt,{children:vt(d.createdAt)})]}),d.note&&e.jsx(xt,{children:d.note}),e.jsxs(ft,{children:[e.jsx("div",{className:"avatar",children:jt((o=d.user)==null?void 0:o.name)}),e.jsx("span",{children:((c=d.user)==null?void 0:c.name)||"Anonymous User"})]})]},d.id)})})]})},Ht="/assets/happy-face-8e76819c.svg",Ct="/assets/hug-icon-a65e4efe.svg",St="/assets/mood-tracker-8aaefd8f.svg",Mt="/assets/community-ef14f86f.svg",Et="/assets/ComfortingHug-7b35f3f0.png",Tt="/assets/EnthusiasticHug-34cb3319.png",Ft="/assets/GroupHug-720ddcec.png",ve="/assets/StandardHug-fced95c7.png",zt="/assets/SupportiveHug-de556136.png",$t="/assets/VirtualHug-f24120c7.png",Dt="/assets/RelaxingHug-b42c8043.png",Rt="/assets/WelcomeHug-41a086c9.png",Pt="/assets/FriendlyHug-108d9a39.png",At="/assets/GentleHug-9e995eae.png",Wt="/assets/FamilyHug-e5aea984.png",Ut="/assets/SmilingHug-06fbeb08.png",Nt={verySad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 45C40 45 45 40 50 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 45C70 45 75 40 80 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 85C40 85 60 75 80 85' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",sad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 80C40 80 60 70 80 80' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",neutral:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 75C40 75 60 75 80 75' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",happy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 70C40 70 60 80 80 70' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",veryHappy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M35 45C35 45 40 40 45 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M75 45C75 45 80 40 85 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M35 65C35 65 60 90 85 65' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E"},It="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23EC4899'/%3E%3C/svg%3E",Lt="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2c3 4 5 6 9 7-4 4-7 8-7 13H10c0-5-3-9-7-13 4-1 6-3 9-7z' fill='%23F59E0B'/%3E%3C/svg%3E",M=({type:t,score:i,size:n=40,animate:s=!0,...a})=>{if(t==="mood"&&i!==void 0){let c;if(i===null)return e.jsx("div",{style:{width:n,height:n}});i>=8.5?c="veryHappy":i>=7?c="happy":i>=5?c="neutral":i>=3?c="sad":c="verySad";const m=Nt[c];return s?e.jsx(b.img,{src:m,alt:`Mood level: ${c}`,width:n,height:n,initial:{scale:0},animate:{scale:1,rotate:[0,10,-10,0]},transition:{type:"spring",damping:10,stiffness:100,delay:.3},...a}):e.jsx("img",{src:m,alt:`Mood level: ${c}`,width:n,height:n,...a})}let d,o;switch(t){case"happyFace":d=Ht,o="Happy Face";break;case"hugIcon":d=Ct,o="Hug Icon";break;case"moodTracker":d=St,o="Mood Tracker";break;case"community":d=Mt,o="Community";break;case"heart":d=It,o="Heart";break;case"fire":d=Lt,o="Fire";break;case"Comforting":case"ComfortingHug":d=Et,o="Comforting Hug";break;case"Enthusiastic":case"EnthusiasticHug":d=Tt,o="Enthusiastic Hug";break;case"Group":case"GroupHug":d=Ft,o="Group Hug";break;case"Standard":case"StandardHug":d=ve,o="Standard Hug";break;case"Supportive":case"SupportiveHug":d=zt,o="Supportive Hug";break;case"Virtual":case"VirtualHug":d=$t,o="Virtual Hug";break;case"Relaxing":case"RelaxingHug":d=Dt,o="Relaxing Hug";break;case"Welcome":case"WelcomeHug":d=Rt,o="Welcome Hug";break;case"Friendly":case"FriendlyHug":d=Pt,o="Friendly Hug";break;case"Gentle":case"GentleHug":d=At,o="Gentle Hug";break;case"Family":case"FamilyHug":d=Wt,o="Family Hug";break;case"Smiling":case"SmilingHug":d=Ut,o="Smiling Hug";break;default:if(t&&t.includes("Hug"))d=ve,o=t;else return null}return s?o&&o.includes("Hug")?e.jsx(b.img,{src:d,alt:o,width:n,height:n,initial:{scale:0,rotate:-5},animate:{scale:1,rotate:0,y:[0,-5,0]},whileHover:{scale:1.1,rotate:[-2,2,-2,0],transition:{rotate:{repeat:0,duration:.5},scale:{duration:.2}}},transition:{type:"spring",damping:12,stiffness:150,delay:.2,y:{repeat:1/0,repeatType:"reverse",duration:1.5,ease:"easeInOut"}},...a}):e.jsx(b.img,{src:d,alt:o,width:n,height:n,initial:{scale:0},animate:{scale:1},transition:{type:"spring",damping:15,stiffness:200,delay:.2},...a}):e.jsx("img",{src:d,alt:o,width:n,height:n,...a})},je=r.div`
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
`,ke=r(b.div)`
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
`,He=r.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 10px 0 5px;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
`,Ce=r.div`
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
`,Bt=r.div`
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
`,_t={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.15}}},Ot={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{type:"spring",damping:12,stiffness:200}}},Gt=()=>{const{data:t,loading:i}=W(qe),{data:n,loading:s}=W(Qe),{data:a,loading:d}=W(Je),{data:o,loading:c}=W(Ze),m=i||s||d||c,x=g.useMemo(()=>{var y,p,E;return{moodStreak:(t==null?void 0:t.moodStreak)||0,totalMoodEntries:((y=n==null?void 0:n.userMoods)==null?void 0:y.length)||0,hugsSent:((p=a==null?void 0:a.sentHugs)==null?void 0:p.length)||0,hugsReceived:((E=o==null?void 0:o.receivedHugs)==null?void 0:E.length)||0}},[t,n,a,o]),v=[{label:"Day Streak",value:x.moodStreak,icon:"fire",color:"#FF9800",bgColor:"rgba(255, 152, 0, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#FF9800"})})},{label:"Moods Tracked",value:x.totalMoodEntries,icon:"moodTracker",color:"#4CAF50",bgColor:"rgba(76, 175, 80, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#4CAF50"})})},{label:"Hugs Sent",value:x.hugsSent,icon:"StandardHug",color:"#6c5ce7",bgColor:"rgba(108, 92, 231, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#6c5ce7"})})},{label:"Hugs Received",value:x.hugsReceived,icon:"ComfortingHug",color:"#9D65C9",bgColor:"rgba(157, 101, 201, 0.1)",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#9D65C9"})})}];return m?e.jsx(je,{children:[1,2,3,4].map((y,p)=>e.jsxs(ke,{style:{opacity:.5},children:[e.jsx(Se,{style:{background:"#f0f0f0"}}),e.jsx(He,{style:{background:"#f0f0f0",width:"60px",height:"40px"}}),e.jsx(Ce,{style:{background:"#f0f0f0",width:"80px",height:"20px"}})]},p))}):e.jsx(je,{as:b.div,variants:_t,initial:"hidden",animate:"visible",children:v.map((y,p)=>e.jsxs(ke,{variants:Ot,children:[e.jsx(Se,{bgColor:y.bgColor,iconColor:y.color,children:e.jsx(M,{type:y.icon,size:28})}),e.jsx(He,{style:{color:y.color},children:y.value}),e.jsx(Ce,{children:y.label}),e.jsx(Bt,{children:y.decoration})]},p))})},J=43200,Me=1440,Ee=Symbol.for("constructDateFrom");function pe(t,i){return typeof t=="function"?t(i):t&&typeof t=="object"&&Ee in t?t[Ee](i):t instanceof Date?new t.constructor(i):new Date(i)}function _(t,i){return pe(i||t,t)}let Vt={};function Yt(){return Vt}function Te(t){const i=_(t),n=new Date(Date.UTC(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours(),i.getMinutes(),i.getSeconds(),i.getMilliseconds()));return n.setUTCFullYear(i.getFullYear()),+t-+n}function he(t,...i){const n=pe.bind(null,t||i.find(s=>typeof s=="object"));return i.map(n)}function te(t,i){const n=+_(t)-+_(i);return n<0?-1:n>0?1:n}function Xt(t){return pe(t,Date.now())}function qt(t,i,n){const[s,a]=he(n==null?void 0:n.in,t,i),d=s.getFullYear()-a.getFullYear(),o=s.getMonth()-a.getMonth();return d*12+o}function Qt(t){return i=>{const s=(t?Math[t]:Math.trunc)(i);return s===0?0:s}}function Jt(t,i){return+_(t)-+_(i)}function Zt(t,i){const n=_(t,i==null?void 0:i.in);return n.setHours(23,59,59,999),n}function Kt(t,i){const n=_(t,i==null?void 0:i.in),s=n.getMonth();return n.setFullYear(n.getFullYear(),s+1,0),n.setHours(23,59,59,999),n}function er(t,i){const n=_(t,i==null?void 0:i.in);return+Zt(n,i)==+Kt(n,i)}function tr(t,i,n){const[s,a,d]=he(n==null?void 0:n.in,t,t,i),o=te(a,d),c=Math.abs(qt(a,d));if(c<1)return 0;a.getMonth()===1&&a.getDate()>27&&a.setDate(30),a.setMonth(a.getMonth()-o*c);let m=te(a,d)===-o;er(s)&&c===1&&te(s,d)===1&&(m=!1);const x=o*(c-+m);return x===0?0:x}function rr(t,i,n){const s=Jt(t,i)/1e3;return Qt(n==null?void 0:n.roundingMethod)(s)}const nr={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},ir=(t,i,n)=>{let s;const a=nr[t];return typeof a=="string"?s=a:i===1?s=a.one:s=a.other.replace("{{count}}",i.toString()),n!=null&&n.addSuffix?n.comparison&&n.comparison>0?"in "+s:s+" ago":s};function ne(t){return(i={})=>{const n=i.width?String(i.width):t.defaultWidth;return t.formats[n]||t.formats[t.defaultWidth]}}const or={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},ar={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},sr={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},cr={date:ne({formats:or,defaultWidth:"full"}),time:ne({formats:ar,defaultWidth:"full"}),dateTime:ne({formats:sr,defaultWidth:"full"})},dr={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},lr=(t,i,n,s)=>dr[t];function X(t){return(i,n)=>{const s=n!=null&&n.context?String(n.context):"standalone";let a;if(s==="formatting"&&t.formattingValues){const o=t.defaultFormattingWidth||t.defaultWidth,c=n!=null&&n.width?String(n.width):o;a=t.formattingValues[c]||t.formattingValues[o]}else{const o=t.defaultWidth,c=n!=null&&n.width?String(n.width):t.defaultWidth;a=t.values[c]||t.values[o]}const d=t.argumentCallback?t.argumentCallback(i):i;return a[d]}}const ur={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},gr={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},pr={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},hr={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},mr={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},xr={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},fr=(t,i)=>{const n=Number(t),s=n%100;if(s>20||s<10)switch(s%10){case 1:return n+"st";case 2:return n+"nd";case 3:return n+"rd"}return n+"th"},br={ordinalNumber:fr,era:X({values:ur,defaultWidth:"wide"}),quarter:X({values:gr,defaultWidth:"wide",argumentCallback:t=>t-1}),month:X({values:pr,defaultWidth:"wide"}),day:X({values:hr,defaultWidth:"wide"}),dayPeriod:X({values:mr,defaultWidth:"wide",formattingValues:xr,defaultFormattingWidth:"wide"})};function q(t){return(i,n={})=>{const s=n.width,a=s&&t.matchPatterns[s]||t.matchPatterns[t.defaultMatchWidth],d=i.match(a);if(!d)return null;const o=d[0],c=s&&t.parsePatterns[s]||t.parsePatterns[t.defaultParseWidth],m=Array.isArray(c)?wr(c,y=>y.test(o)):yr(c,y=>y.test(o));let x;x=t.valueCallback?t.valueCallback(m):m,x=n.valueCallback?n.valueCallback(x):x;const v=i.slice(o.length);return{value:x,rest:v}}}function yr(t,i){for(const n in t)if(Object.prototype.hasOwnProperty.call(t,n)&&i(t[n]))return n}function wr(t,i){for(let n=0;n<t.length;n++)if(i(t[n]))return n}function vr(t){return(i,n={})=>{const s=i.match(t.matchPattern);if(!s)return null;const a=s[0],d=i.match(t.parsePattern);if(!d)return null;let o=t.valueCallback?t.valueCallback(d[0]):d[0];o=n.valueCallback?n.valueCallback(o):o;const c=i.slice(a.length);return{value:o,rest:c}}}const jr=/^(\d+)(th|st|nd|rd)?/i,kr=/\d+/i,Hr={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},Cr={any:[/^b/i,/^(a|c)/i]},Sr={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},Mr={any:[/1/i,/2/i,/3/i,/4/i]},Er={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},Tr={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},Fr={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},zr={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},$r={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},Dr={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},Rr={ordinalNumber:vr({matchPattern:jr,parsePattern:kr,valueCallback:t=>parseInt(t,10)}),era:q({matchPatterns:Hr,defaultMatchWidth:"wide",parsePatterns:Cr,defaultParseWidth:"any"}),quarter:q({matchPatterns:Sr,defaultMatchWidth:"wide",parsePatterns:Mr,defaultParseWidth:"any",valueCallback:t=>t+1}),month:q({matchPatterns:Er,defaultMatchWidth:"wide",parsePatterns:Tr,defaultParseWidth:"any"}),day:q({matchPatterns:Fr,defaultMatchWidth:"wide",parsePatterns:zr,defaultParseWidth:"any"}),dayPeriod:q({matchPatterns:$r,defaultMatchWidth:"any",parsePatterns:Dr,defaultParseWidth:"any"})},Pr={code:"en-US",formatDistance:ir,formatLong:cr,formatRelative:lr,localize:br,match:Rr,options:{weekStartsOn:0,firstWeekContainsDate:1}};function Ar(t,i,n){const s=Yt(),a=(n==null?void 0:n.locale)??s.locale??Pr,d=2520,o=te(t,i);if(isNaN(o))throw new RangeError("Invalid time value");const c=Object.assign({},n,{addSuffix:n==null?void 0:n.addSuffix,comparison:o}),[m,x]=he(n==null?void 0:n.in,...o>0?[i,t]:[t,i]),v=rr(x,m),y=(Te(x)-Te(m))/1e3,p=Math.round((v-y)/60);let E;if(p<2)return n!=null&&n.includeSeconds?v<5?a.formatDistance("lessThanXSeconds",5,c):v<10?a.formatDistance("lessThanXSeconds",10,c):v<20?a.formatDistance("lessThanXSeconds",20,c):v<40?a.formatDistance("halfAMinute",0,c):v<60?a.formatDistance("lessThanXMinutes",1,c):a.formatDistance("xMinutes",1,c):p===0?a.formatDistance("lessThanXMinutes",1,c):a.formatDistance("xMinutes",p,c);if(p<45)return a.formatDistance("xMinutes",p,c);if(p<90)return a.formatDistance("aboutXHours",1,c);if(p<Me){const C=Math.round(p/60);return a.formatDistance("aboutXHours",C,c)}else{if(p<d)return a.formatDistance("xDays",1,c);if(p<J){const C=Math.round(p/Me);return a.formatDistance("xDays",C,c)}else if(p<J*2)return E=Math.round(p/J),a.formatDistance("aboutXMonths",E,c)}if(E=tr(x,m),E<12){const C=Math.round(p/J);return a.formatDistance("xMonths",C,c)}else{const C=E%12,T=Math.trunc(E/12);return C<3?a.formatDistance("aboutXYears",T,c):C<9?a.formatDistance("overXYears",T,c):a.formatDistance("almostXYears",T+1,c)}}function Ne(t,i){return Ar(t,Xt(t),i)}const Wr=r(b.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,Ur=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Nr=r.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,Ir=r.button`
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
`,Lr=r.div`
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
`,Br=r(b.div)`
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
`,_r=r.div`
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
`,Or=r.div`
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
`,Gr=r.div`
  flex: 1;
`,Vr=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`,Yr=r.span`
  font-weight: 600;
  color: #333;
`,Xr=r.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: ${t=>t.score>=8?"#4cd964":t.score>=5?"#ffcc00":"#ff3b30"};
  color: ${t=>t.score>=8?"#006400":t.score>=5?"#664d00":"#fff"};
`,qr=r.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Qr=r.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #888;
  font-size: 0.8rem;
`,Jr=r.span`
  display: flex;
  align-items: center;
  gap: 4px;
`,Zr=r.button`
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
`,Kr=r.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`,en=r(b.div)`
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
`,tn=r(b.div)`
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
`,rn=r.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`,oe=r.button`
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
`,nn=()=>{var P;const{loading:t,error:i,data:n,refetch:s}=W(Ke,{fetchPolicy:"network-only",pollInterval:6e4}),[a,d]=g.useState(null),[o,c]=g.useState("all"),[m,x]=g.useState(!1),[v,y]=g.useState(null),[p,E]=g.useState(null),[C,{loading:T}]=G(Q),F=((P=n==null?void 0:n.friendsMoods)==null?void 0:P.filter(j=>j.score<=4))||[],z=F.length>0;g.useEffect(()=>{if(m){const j=setTimeout(()=>{x(!1)},3e3);return()=>clearTimeout(j)}},[m]);const D=j=>j?j.split(" ").map(h=>h[0]).join("").toUpperCase.substring(0,2):"?",$=j=>{const h=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],u=j?j.charCodeAt(0)%h.length:0;return h[u]},U=async(j,h)=>{var u;if(j.stopPropagation,!T){E(h.user.id);try{(u=(await C({variables:{sendHugInput:{recipientId:h.user.id,type:h.score<=4?"ComfortingHug":"StandardHug",message:h.score<=4?"I noticed you're not feeling great. Sending you a comforting hug!":"Hey! Just sending a friendly hug your way!"}}})).data)!=null&&u.sendHug&&(y(h.user.name||h.user.username),x(!0),setTimeout(()=>{},1e3))}catch(H){console.error("Error sending hug:",H)}finally{E(null)}}},A=()=>{if(!(n!=null&&n.friendsMoods))return[];let j=[...n.friendsMoods];return o==="needSupport"?j.filter(h=>h.score<=4):o==="recent"?j.sort((h,u)=>new Date(u.createdAt)-new Date(h.createdAt)):j},R=()=>{if(t)return e.jsx(Kr,{children:"Loading friends' moods..."});if(i)return e.jsx(ie,{children:"Couldn't load friends' moods. Please try again."});if(!n||!n.friendsMoods||n.friendsMoods.length===0)return e.jsx(ie,{children:"No friend moods yet. Add friends to see their moods here!"});const j=A;return j.length===0?e.jsx(ie,{children:"No moods match the current filter."}):e.jsx(Lr,{children:j.map(h=>{const u=h.score<=4;return e.jsxs(Br,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},onClick:()=>d(a===h.id?null:h.id),needsSupport:u,children:[u&&e.jsx(Or,{children:e.jsx(ue,{size:12})}),e.jsx(_r,{bgColor:$(h.user.id),children:h.user.avatarUrl?e.jsx("img",{src:h.user.avatarUrl,alt:h.user.name}):D(h.user.name||h.user.username)}),e.jsxs(Gr,{children:[e.jsxs(Vr,{children:[e.jsx(Yr,{children:h.user.name||h.user.username}),e.jsxs(Xr,{score:h.score,children:[h.score,"/10"]})]}),e.jsx(qr,{children:h.note||"No description provided."}),e.jsxs(Qr,{children:[e.jsxs(Jr,{children:[e.jsx(Pe,{size:12}),Ne(new Date(h.createdAt),{addSuffix:!0})]}),e.jsx(Zr,{onClick:H=>U(H,h),needsSupport:u,disabled:T&&p===h.user.id,children:T&&p===h.user.id?"Sending...":e.jsxs(e.Fragment,{children:[u?e.jsx(N,{size:12}):e.jsx(re,{size:12}),u?"Send Support":"Send Hug"]})})]})]})]},h.id)})})};return e.jsxs(Wr,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsxs(Ur,{children:[e.jsxs(Nr,{children:[e.jsx(nt,{size:16}),"Friends' Moods",z&&e.jsx(b.span,{style:{background:"#ff3b30",color:"white",borderRadius:"50%",width:"20px",height:"20px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:"bold"},initial:{scale:0},animate:{scale:1},transition:{type:"spring",stiffness:500,damping:15},children:F.length})]}),e.jsx(Ir,{children:"View All"})]}),e.jsx(I,{children:z&&e.jsxs(en,{initial:{opacity:0,height:0,marginBottom:0},animate:{opacity:1,height:"auto",marginBottom:12},exit:{opacity:0,height:0,marginBottom:0},children:[e.jsx(it,{size:18,color:"#d32f2f"}),e.jsxs("p",{children:[F.length===1?`${F[0].user.name||"Your friend"} is feeling down.`:`${F.length} friends are having a tough time.`,"Consider sending support!"]})]})}),e.jsxs(rn,{children:[e.jsx(oe,{active:o==="all",onClick:()=>c("all"),children:"All"}),e.jsxs(oe,{active:o==="needSupport",onClick:()=>c("needSupport"),children:["Needs Support ",z&&`(${F.length})`]}),e.jsx(oe,{active:o==="recent",onClick:()=>c("recent"),children:"Recent"})]}),R,e.jsx(I,{children:m&&e.jsxs(tn,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(N,{size:16}),"Hug sent to ",v,"!"]})})]})},on=r(b.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,an=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,sn=r.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,cn=r.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`,dn=r.input`
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
`,ln=r.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
`,un=r.button`
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
`,gn=r.div`
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
`,Y=r.button`
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
`,pn=r.div`
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
`,hn=r.div`
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
`,mn=r.div`
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
`,xn=r.div`
  flex: 1;
`,fn=r.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`,bn=r.div`
  color: #888;
  font-size: 0.8rem;
`,yn=r.button`
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
`,wn=r.textarea`
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
`,Fe=r.div`
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
`,vn=r.div`
  margin-bottom: 1rem;
`,jn=r.input`
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
`,kn=r.button`
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
`,ae=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`,Hn=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`,Cn=r(b.div)`
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
`,ze=r.div`
  color: #ff3b30;
  font-size: 0.8rem;
  margin-top: 4px;
  margin-bottom: 8px;
`,Sn=()=>{const[t,i]=g.useState("friends"),[n,s]=g.useState(""),[a,d]=g.useState("StandardHug"),[o,c]=g.useState(null),[m,x]=g.useState(""),[v,y]=g.useState(""),[p,E]=g.useState("email"),[C,T]=g.useState(!1),[F,z]=g.useState(""),[D,$]=g.useState(!1),{loading:U,error:A,data:R}=W(le,{fetchPolicy:"network-only"}),[P,{loading:j}]=G(Q);g.useEffect(()=>{if(C){const w=setTimeout(()=>{T(!1)},3e3);return()=>clearTimeout(w)}},[C]),g.useEffect(()=>{t==="external"&&(p==="email"?$(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)):p==="telegram"&&$(v.trim().length>0))},[v,p,t]),g.useEffect(()=>{let w="";switch(a){case"ComfortingHug":w="I'm sending you a comforting hug to help you feel better!";break;case"FriendlyHug":w="Hey friend! Thought you might appreciate a friendly hug today.";break;case"EnthusiasticHug":w="Sending you an enthusiastic hug to celebrate with you!";break;case"GroupHug":w="Group hug! Bringing us all together.";break;case"FamilyHug":w="A warm family hug to let you know I care about you.";break;case"StandardHug":default:w="Just sending a hug to brighten your day!";break}x(w)},[a]);const h=w=>w?w.split(" ").map(k=>k[0]).join("").toUpperCase().substring(0,2):"?",u=w=>{const k=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],B=w?w.charCodeAt(0)%k.length:0;return k[B]},H=async()=>{var w,k;z("");try{t==="friends"&&o?(w=(await P({variables:{sendHugInput:{recipientId:o.id,type:a,message:m.trim()}}})).data)!=null&&w.sendHug&&(T(!0),c(null),L()):t==="external"&&D&&(k=(await P({variables:{sendHugInput:{externalRecipient:{type:p,contact:v.trim()},type:a,message:m.trim()}}})).data)!=null&&k.sendHug&&(T(!0),L())}catch(B){console.error("Error sending hug:",B),z("Failed to send hug. Please try again.")}},L=()=>{x(V(a)),y("")},V=w=>{switch(w){case"ComfortingHug":return"I'm sending you a comforting hug to help you feel better!";case"FriendlyHug":return"Hey friend! Thought you might appreciate a friendly hug today.";case"EnthusiasticHug":return"Sending you an enthusiastic hug to celebrate with you!";case"GroupHug":return"Group hug! Bringing us all together.";case"FamilyHug":return"A warm family hug to let you know I care about you.";case"StandardHug":default:return"Just sending a hug to brighten your day!"}},f=w=>{s(w.target.value)},l=()=>{s("")},S=w=>{o&&o.id===w.id?c(null):c(w)},O=()=>{if(U)return e.jsx(Hn,{children:"Loading friends..."});if(A)return e.jsx(ae,{children:"Error loading friends. Please try again."});if(!R||!R.users||R.users.length===0)return e.jsx(ae,{children:"No friends found. Add some friends to send hugs!"});const w=R.users.filter(k=>{if(!n)return!0;const B=n.toLowerCase();return k.name&&k.name.toLowerCase().includes(B)||k.username&&k.username.toLowerCase().includes(B)});return w.length===0?e.jsx(ae,{children:"No friends match your search."}):e.jsx(pn,{children:w.map(k=>e.jsxs(hn,{selected:o&&o.id===k.id,onClick:()=>S(k),children:[e.jsx(mn,{bgColor:u(k.id),children:k.avatarUrl?e.jsx("img",{src:k.avatarUrl,alt:k.name}):h(k.name||k.username)}),e.jsxs(xn,{children:[e.jsx(fn,{children:k.name||"Unnamed User"}),e.jsxs(bn,{children:["@",k.username]})]}),e.jsx(yn,{selected:o&&o.id===k.id,children:o&&o.id===k.id?e.jsx(Ue,{size:14}):null})]},k.id))})},me=()=>e.jsxs(vn,{children:[e.jsxs(Fe,{style:{marginBottom:"8px"},children:[e.jsx(Z,{active:p==="email",onClick:()=>E("email"),children:"Email"}),e.jsx(Z,{active:p==="telegram",onClick:()=>E("telegram"),children:"Telegram"})]}),e.jsx(jn,{type:p==="email"?"email":"text",placeholder:p==="email"?"Enter email address":"Enter Telegram username",value:v,onChange:w=>y(w.target.value)}),!D&&v.trim()!==""&&e.jsx(ze,{children:p==="email"?"Please enter a valid email address.":"Please enter a valid Telegram username."})]}),Be=()=>t==="friends"?o!==null&&m.trim()!=="":t==="external"?D&&m.trim()!=="":!1;return e.jsxs(on,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsx(an,{children:e.jsxs(sn,{children:[e.jsx(re,{size:16}),"Quick Send Hug"]})}),e.jsxs(Fe,{children:[e.jsxs(Z,{active:t==="friends",onClick:()=>i("friends"),children:[e.jsx(Ae,{size:14,style:{marginRight:"4px"}}),"Friends"]}),e.jsxs(Z,{active:t==="external",onClick:()=>i("external"),children:[e.jsx(ot,{size:14,style:{marginRight:"4px"}}),"External"]})]}),t==="friends"&&e.jsxs(e.Fragment,{children:[e.jsxs(cn,{children:[e.jsx(ln,{children:e.jsx(We,{size:16})}),e.jsx(dn,{type:"text",placeholder:"Search friends...",value:n,onChange:f}),e.jsx(un,{visible:n!=="",onClick:l,children:e.jsx(ge,{size:16})})]}),O()]}),t==="external"&&me(),e.jsxs(gn,{children:[e.jsxs(Y,{selected:a==="StandardHug",onClick:()=>d("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"StandardHug",size:36,animate:!0})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(Y,{selected:a==="FriendlyHug",onClick:()=>d("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"FriendlyHug",size:36,animate:!0})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(Y,{selected:a==="ComfortingHug",onClick:()=>d("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"ComfortingHug",size:36,animate:!0})}),e.jsx("span",{children:"Comforting"})]}),e.jsxs(Y,{selected:a==="EnthusiasticHug",onClick:()=>d("EnthusiasticHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"EnthusiasticHug",size:36,animate:!0})}),e.jsx("span",{children:"Enthusiastic"})]}),e.jsxs(Y,{selected:a==="FamilyHug",onClick:()=>d("FamilyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"FamilyHug",size:36,animate:!0})}),e.jsx("span",{children:"Family"})]}),e.jsxs(Y,{selected:a==="GroupHug",onClick:()=>d("GroupHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"GroupHug",size:36,animate:!0})}),e.jsx("span",{children:"Group"})]})]}),e.jsx(wn,{placeholder:"Write your message...",value:m,onChange:w=>x(w.target.value)}),F&&e.jsx(ze,{children:F}),e.jsxs(kn,{onClick:H,disabled:!Be()||j,children:[j?"Sending...":"Send Hug",e.jsx(N,{size:16})]}),e.jsx(I,{children:C&&e.jsxs(Cn,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(N,{size:16}),"Hug sent successfully!"]})})]})},Mn=r(b.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,En=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Tn=r.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,Fn=r.button`
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
`,$e=r.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
`,zn=r.div`
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
`,$n=r(b.div)`
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
`,Dn=r.div`
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
`,Rn=r.div`
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
`,Pn=r.div`
  flex: 1;
`,An=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`,Wn=r.span`
  font-weight: 600;
  color: #333;
`,Un=r.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.75rem;
  background: ${t=>{switch(t.type){case"ComfortingHug":return"rgba(255, 152, 0, 0.15)";case"GroupHug":return"rgba(76, 175, 80, 0.15)";case"EnthusiasticHug":return"rgba(233, 30, 99, 0.15)";case"FriendlyHug":return"rgba(33, 150, 243, 0.15)";case"FamilyHug":return"rgba(156, 39, 176, 0.15)";case"StandardHug":default:return"rgba(108, 92, 231, 0.15)"}}};
  color: ${t=>{switch(t.type){case"ComfortingHug":return"#f57c00";case"GroupHug":return"#388e3c";case"EnthusiasticHug":return"#c2185b";case"FriendlyHug":return"#1976d2";case"FamilyHug":return"#7b1fa2";case"StandardHug":default:return"#5c4ccc"}}};
`,Nn=r.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,In=r.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  font-size: 0.8rem;
`,Ln=r.span`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
`,Bn=r.button`
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
`,_n=r.button`
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
`,On=r.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`,Gn=r.span`
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
`,Vn=r(b.div)`
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
`,Yn=r(b.div)`
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
`,Xn=r(b.div)`
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
`,qn=r.div`
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
`,Qn=r.textarea`
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
`,Jn=r.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`,Zn=r.button`
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
`,Kn=r.button`
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
`,ei=()=>{var V;const{loading:t,error:i,data:n,refetch:s}=W(et,{fetchPolicy:"network-only"}),[a]=G(tt),[d,{loading:o}]=G(Q),[c,m]=g.useState(null),[x,v]=g.useState(""),[y,p]=g.useState("StandardHug"),[E,C]=g.useState(!1),[T,F]=g.useState(!1),[z,D]=g.useState(null),$=((V=n==null?void 0:n.receivedHugs)==null?void 0:V.filter(f=>!f.isRead))||[],U=$.length>0;g.useEffect(()=>{if(T){const f=setTimeout(()=>{F(!1)},3e3);return()=>clearTimeout(f)}},[T]);const A=f=>f?f.split(" ").map(l=>l[0]).join("").toUpperCase().substring(0,2):"?",R=f=>{const l=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],S=f?f.charCodeAt(0)%l.length:0;return l[S]},P=async(f,l)=>{f.stopPropagation();try{await a({variables:{id:l}}),s()}catch(S){console.error("Error marking hug as read:",S)}},j=(f,l)=>{f.stopPropagation(),m(l),v(`Thanks for the ${l.type.replace(/([A-Z])/g," $1").trim().toLowerCase()}!`),p("StandardHug"),C(!0)},h=()=>{C(!1),m(null),v("")},u=async()=>{var f;if(!(!c||!x.trim()))try{(f=(await d({variables:{input:{receiverId:c.sender.id,type:y,message:x.trim()}}})).data)!=null&&f.sendHug&&(D(c.sender.name||c.sender.username),F(!0),h(),setTimeout(()=>{s()},1e3))}catch(l){console.error("Error sending reply hug:",l)}},H=f=>{switch(f){case"ComfortingHug":return"rgba(255, 152, 0, 0.1)";case"GroupHug":return"rgba(76, 175, 80, 0.1)";case"EnthusiasticHug":return"rgba(233, 30, 99, 0.1)";case"FriendlyHug":return"rgba(33, 150, 243, 0.1)";case"FamilyHug":return"rgba(156, 39, 176, 0.1)";case"StandardHug":default:return"rgba(108, 92, 231, 0.1)"}},L=()=>t?e.jsx(On,{children:"Loading received hugs..."}):i?e.jsx($e,{children:"Couldn't load hugs. Please try again."}):!n||!n.receivedHugs||n.receivedHugs.length===0?e.jsx($e,{children:"No hugs received yet. Send some to get the ball rolling!"}):e.jsx(zn,{children:n.receivedHugs.map(f=>e.jsxs($n,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},isRead:f.isRead,children:[e.jsxs(Dn,{bgColor:H(f.type),children:[e.jsx(M,{type:f.type,size:48,animate:!0}),e.jsx(Rn,{bgColor:R(f.sender.id),children:A(f.sender.name||f.sender.username)})]}),e.jsxs(Pn,{children:[e.jsxs(An,{children:[e.jsx(Wn,{children:f.sender.name||f.sender.username}),e.jsx(Un,{type:f.type,children:f.type.replace(/([A-Z])/g," $1").trim()})]}),e.jsx(Nn,{children:f.message||"Sent you a hug!"}),e.jsxs(In,{children:[e.jsxs(Ln,{children:[e.jsx(Pe,{size:12}),Ne(new Date(f.createdAt),{addSuffix:!0})]}),!f.isRead&&e.jsxs(Bn,{onClick:l=>P(l,f.id),children:[e.jsx(Ue,{size:12}),"Mark Read"]}),e.jsxs(_n,{onClick:l=>j(l,f),children:[e.jsx(xe,{size:12}),"Reply"]})]})]})]},f.id))});return e.jsxs(Mn,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsxs(En,{children:[e.jsxs(Tn,{children:[e.jsx(N,{size:16}),"Received Hugs",U&&e.jsx(Gn,{children:$.length})]}),e.jsx(Fn,{children:"View All"})]}),L(),e.jsx(I,{children:E&&c&&e.jsx(Yn,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Xn,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},exit:{y:20,opacity:0},children:[e.jsxs("h4",{children:[e.jsx(xe,{size:18}),"Reply to ",c.sender.name||c.sender.username]}),e.jsxs(qn,{children:[e.jsxs(K,{selected:y==="StandardHug",onClick:()=>p("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"StandardHug",size:42,animate:!0})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(K,{selected:y==="FriendlyHug",onClick:()=>p("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"FriendlyHug",size:42,animate:!0})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(K,{selected:y==="EnthusiasticHug",onClick:()=>p("EnthusiasticHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"EnthusiasticHug",size:42,animate:!0})}),e.jsx("span",{children:"Enthusiastic"})]}),e.jsxs(K,{selected:y==="ComfortingHug",onClick:()=>p("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"ComfortingHug",size:42,animate:!0})}),e.jsx("span",{children:"Comforting"})]})]}),e.jsx(Qn,{value:x,onChange:f=>v(f.target.value),placeholder:"Write your reply message..."}),e.jsxs(Jn,{children:[e.jsx(Zn,{onClick:h,children:"Cancel"}),e.jsx(Kn,{onClick:u,disabled:!x.trim()||o,children:o?"Sending...":"Send Reply"})]})]})})}),e.jsx(I,{children:T&&e.jsxs(Vn,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(N,{size:16}),"Hug sent to ",z,"!"]})})]})},ti=r(b.div)`
  position: relative;
`,ri=r(b.button)`
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
`,ni=r(b.div)`
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
`,ii=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,oi=r.h4`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`,ai=r.button`
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
`,si=r.div`
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
`,ci=r.div`
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
`,di=r.div`
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
`,li=r.div`
  flex: 1;
`,ui=r.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`,gi=r.div`
  color: #888;
  font-size: 0.8rem;
`,pi=r.div`
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
`,hi=r(b.button)`
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
`,mi=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`,xi=r.div`
  text-align: center;
  padding: 1rem;
  color: #e74c3c;
  font-size: 0.9rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
`,fi=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`,Ie=r(b.div)`
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
`,bi=r(Ie)`
  background-color: #4cd964;
  color: white;
`,yi=r(Ie)`
  background-color: #e74c3c;
  color: white;
`,wi=({onSent:t=()=>{}})=>{const[i,n]=g.useState(!1),[s,a]=g.useState(null),[d,o]=g.useState("StandardHug"),[c,m]=g.useState(!1),[x,v]=g.useState(!1),[y,p]=g.useState(""),[E,C]=g.useState(""),{loading:T,error:F,data:z}=W(le,{fetchPolicy:"network-only",skip:!i,onError:u=>{console.error("Error fetching users:",u)}}),[D,{loading:$}]=G(Q,{onError:u=>{var H;console.error("Error sending hug:",u),p(((H=u.message)==null?void 0:H.split(":")[0])||"Failed to send hug"),v(!0)}});g.useEffect(()=>{const u=H=>{i&&H.target.closest(".quick-hug-popup")===null&&H.target.closest(".quick-hug-trigger")===null&&n(!1)};return document.addEventListener("mousedown",u),()=>document.removeEventListener("mousedown",u)},[i]),g.useEffect(()=>{if(c){const u=setTimeout(()=>{m(!1)},3e3);return()=>clearTimeout(u)}},[c]),g.useEffect(()=>{if(x){const u=setTimeout(()=>{v(!1)},3e3);return()=>clearTimeout(u)}},[x]);const U=()=>{n(u=>!u),i||(a(null),o("StandardHug"))},A=()=>{n(!1)},R=u=>{a(u===s?null:u)},P=u=>u?u.split(" ").map(H=>H[0]).join("").toUpperCase().substring(0,2):"?",j=u=>{const H=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],L=u?u.charCodeAt(0)%H.length:0;return H[L]},h=async()=>{var u;if(s)try{(u=(await D({variables:{sendHugInput:{recipientId:s.id,type:d,message:`Sending you a quick ${d.replace(/([A-Z])/g," $1").trim().toLowerCase()}!`}}})).data)!=null&&u.sendHug&&(C(s.name||s.username),m(!0),A(),t())}catch(H){console.error("Error sending hug:",H)}};return e.jsxs(ti,{children:[e.jsxs(ri,{className:"quick-hug-trigger",onClick:U,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(N,{size:16}),"Quick Hug"]}),e.jsx(I,{children:i&&e.jsxs(ni,{className:"quick-hug-popup",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.2},children:[e.jsxs(ii,{children:[e.jsxs(oi,{children:[e.jsx(N,{size:16}),"Send a Quick Hug"]}),e.jsx(ai,{onClick:A,children:e.jsx(ge,{size:18})})]}),T?e.jsx(fi,{children:"Loading friends..."}):F?e.jsxs(xi,{children:["Couldn't load friends list.",F.message&&e.jsxs("div",{children:["Error: ",F.message.split(":")[0]]})]}):!z||!z.users||z.users.length===0?e.jsx(mi,{children:"No friends found"}):e.jsx(si,{children:z.users.map(u=>e.jsxs(ci,{selected:s&&s.id===u.id,onClick:()=>R(u),children:[e.jsx(di,{bgColor:j(u.id),children:u.avatarUrl?e.jsx("img",{src:u.avatarUrl,alt:u.name}):P(u.name||u.username)}),e.jsxs(li,{children:[e.jsx(ui,{children:u.name||"Unnamed User"}),e.jsxs(gi,{children:["@",u.username]})]})]},u.id))}),e.jsxs(pi,{children:[e.jsxs(se,{selected:d==="StandardHug",onClick:()=>o("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"StandardHug",size:48,animate:!0})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(se,{selected:d==="FriendlyHug",onClick:()=>o("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"FriendlyHug",size:48,animate:!0})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(se,{selected:d==="ComfortingHug",onClick:()=>o("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(M,{type:"ComfortingHug",size:48,animate:!0})}),e.jsx("span",{children:"Comforting"})]})]}),e.jsxs(hi,{onClick:h,disabled:!s||$,whileHover:{scale:1.02},whileTap:{scale:.98},children:[$?"Sending...":"Send Hug",e.jsx(re,{size:16})]})]})}),e.jsxs(I,{children:[c&&e.jsxs(bi,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(N,{size:16}),"Hug sent to ",E,"!"]}),x&&e.jsxs(yi,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(ue,{size:16}),y]})]})]})},vi=r(b.div)`
  position: relative;
`,ji=r(b.button)`
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
`,ki=r(b.div)`
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
`,Hi=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Ci=r.h4`
  margin: 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
`,Si=r.button`
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
`,Mi=r.div`
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
`,Ei=r.div`
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
`,Ti=r.div`
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
`,Fi=r.div`
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
`,zi=r.div`
  flex: 1;
`,$i=r.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`,Di=r.div`
  color: #888;
  font-size: 0.8rem;
`,Ri=r.textarea`
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
`,Pi=r(b.button)`
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
`,Ai=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`,Wi=r.div`
  text-align: center;
  padding: 1rem;
  color: #e74c3c;
  font-size: 0.9rem;
  background-color: rgba(231, 76, 60, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
`,Ui=r.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`,Le=r(b.div)`
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
`,Ni=r(Le)`
  background-color: #4CAF50;
  color: white;
`,Ii=r(Le)`
  background-color: #e74c3c;
  color: white;
`,Li=({onSent:t=()=>{}})=>{const[i,n]=g.useState(!1),[s,a]=g.useState(null),[d,o]=g.useState(""),[c,m]=g.useState(""),[x,v]=g.useState(!1),[y,p]=g.useState(!1),[E,C]=g.useState(""),[T,F]=g.useState("");g.useEffect(()=>{c||m("Hi there! I'd like to connect and be friends on HugMeNow! Sending you a warm welcome hug. 🤗")},[]);const{loading:z,error:D,data:$}=W(le,{variables:{search:d},fetchPolicy:"network-only",skip:!i,onError:l=>{console.error("Error fetching users:",l)}}),[U,{loading:A}]=G(Q,{onError:l=>{var S;console.error("Error sending hug:",l),C(((S=l.message)==null?void 0:S.split(":")[0])||"Failed to send welcome hug"),p(!0)}}),[R,{loading:P}]=G(rt,{onError:l=>{var S;console.error("Error sending friend request:",l),C(((S=l.message)==null?void 0:S.split(":")[0])||"Failed to send friend request"),p(!0)}});g.useEffect(()=>{const l=S=>{i&&S.target.closest(".welcome-hug-popup")===null&&S.target.closest(".welcome-hug-trigger")===null&&n(!1)};return document.addEventListener("mousedown",l),()=>document.removeEventListener("mousedown",l)},[i]),g.useEffect(()=>{if(x){const l=setTimeout(()=>{v(!1)},3e3);return()=>clearTimeout(l)}},[x]),g.useEffect(()=>{if(y){const l=setTimeout(()=>{p(!1)},3e3);return()=>clearTimeout(l)}},[y]);const j=()=>{n(l=>!l),i||(a(null),o(""),c||m("Hi there! I'd like to connect and be friends on HugMeNow! Sending you a warm welcome hug. 🤗"))},h=()=>{n(!1)},u=l=>{o(l.target.value)},H=l=>{a(l===s?null:l)},L=l=>l?l.split(" ").map(S=>S[0]).join("").toUpperCase().substring(0,2):"?",V=l=>{const S=["#4CAF50","#8BC34A","#CDDC39","#009688","#00BCD4","#3F51B5"],O=l?l.charCodeAt(0)%S.length:0;return S[O]},f=async()=>{var l,S;if(s)try{(l=(await R({variables:{createFriendshipInput:{recipientId:s.id,followMood:!0}}})).data)!=null&&l.sendFriendRequest&&(S=(await U({variables:{sendHugInput:{recipientId:s.id,type:"WelcomeHug",message:c||"Hi there! I'd like to connect and be friends on HugMeNow! Sending you a warm welcome hug."}}})).data)!=null&&S.sendHug&&(F(s.name||s.username),v(!0),h(),t())}catch(O){console.error("Error:",O),C(O.message||"Something went wrong"),p(!0)}};return e.jsxs(vi,{children:[e.jsxs(ji,{className:"welcome-hug-trigger",onClick:j,whileHover:{scale:1.05},whileTap:{scale:.95},children:[e.jsx(fe,{size:16}),"Welcome Friend"]}),e.jsx(I,{children:i&&e.jsxs(ki,{className:"welcome-hug-popup",initial:{opacity:0,y:-10},animate:{opacity:1,y:0},exit:{opacity:0,y:-10},transition:{duration:.2},children:[e.jsxs(Hi,{children:[e.jsxs(Ci,{children:[e.jsx(Ae,{size:16}),"Welcome a New Friend"]}),e.jsx(Si,{onClick:h,children:e.jsx(ge,{size:18})})]}),e.jsxs(Mi,{children:[e.jsx(We,{size:16}),e.jsx("input",{type:"text",placeholder:"Search users...",value:d,onChange:u})]}),z?e.jsx(Ui,{children:"Loading users..."}):D?e.jsxs(Wi,{children:["Couldn't load users list.",D.message&&e.jsxs("div",{children:["Error: ",D.message.split(":")[0]]})]}):!$||!$.users||$.users.length===0?e.jsx(Ai,{children:"No users found"}):e.jsx(Ei,{children:$.users.map(l=>e.jsxs(Ti,{selected:s&&s.id===l.id,onClick:()=>H(l),children:[e.jsx(Fi,{bgColor:V(l.id),children:l.avatarUrl?e.jsx("img",{src:l.avatarUrl,alt:l.name}):L(l.name||l.username)}),e.jsxs(zi,{children:[e.jsx($i,{children:l.name||"Unnamed User"}),e.jsxs(Di,{children:["@",l.username]})]})]},l.id))}),e.jsx(Ri,{placeholder:"Add a welcome message (optional)",value:c,onChange:l=>m(l.target.value),rows:3}),e.jsx("div",{style:{display:"flex",justifyContent:"center",marginBottom:"16px"},children:e.jsx(M,{type:"WelcomeHug",size:64,animate:!0})}),e.jsxs(Pi,{onClick:f,disabled:!s||A||P,whileHover:{scale:1.02},whileTap:{scale:.98},children:[A||P?"Sending...":"Send Welcome Hug",e.jsx(re,{size:16})]})]})}),e.jsxs(I,{children:[x&&e.jsxs(Ni,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(fe,{size:16}),"Friend request and welcome hug sent to ",T,"!"]}),y&&e.jsxs(Ii,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(ue,{size:16}),E]})]})]})},Bi=r.div`
  min-height: 100vh;
  background-color: #f8f9fa;
`,_i=r.header`
  background-color: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
`,Oi=r.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #6c5ce7;
  display: flex;
  align-items: center;
  gap: 8px;
`,Gi=r.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
`,Vi=r.div`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    .user-name {
      display: none;
    }
  }
`,Yi=r(b.div)`
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
`,Xi=r.span`
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
`,qi=r(b.button)`
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
`,Qi=r.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`,Ji=r(b.div)`
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
`,Zi=r.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
`,Ki=r(b.div)`
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
`,eo=r.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2.5rem 0;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`,De=r.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,Re=r(b.h2)`
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
`,ce=r(b.div)`
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
`,ee={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.5,ease:[.22,1,.36,1]}}},to={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},so=()=>{const{currentUser:t,logout:i}=Oe(),[n,s]=g.useState(!0),a=Ge();g.useEffect(()=>{const m=localStorage.getItem("redirectToDashboard")==="true";m&&(console.log("Dashboard detected redirect flag from login"),localStorage.removeItem("redirectToDashboard"));const x=setTimeout(()=>{s(!1),m&&console.log("Dashboard fully loaded after login redirect")},1e3);return()=>clearTimeout(x)},[]);const d=async()=>{await i(),a("/login")},o=m=>{a(m)},c=m=>m?m.split(" ").map(x=>x[0]).join("").toUpperCase().substring(0,2):"?";return n?e.jsx(Ve,{text:"Loading dashboard..."}):e.jsxs(Bi,{children:[e.jsxs(_i,{children:[e.jsxs(Oi,{children:[e.jsx(M,{type:"hugIcon",size:28}),"HugMeNow"]}),e.jsxs(Gi,{children:[e.jsx(wi,{onSent:()=>console.log("Quick hug sent successfully!")}),e.jsx(Li,{onSent:()=>console.log("Welcome hug and friend request sent successfully!")}),e.jsxs(Vi,{children:[e.jsx(Yi,{initial:{scale:0},animate:{scale:1},transition:{type:"spring",bounce:.5},whileHover:{scale:1.1},children:c(t==null?void 0:t.name)}),e.jsx(Xi,{className:"user-name",children:(t==null?void 0:t.name)||"Guest"}),e.jsx(qi,{onClick:d,whileHover:{scale:1.05},whileTap:{scale:.95},children:"Logout"})]})]})]}),e.jsxs(Qi,{children:[e.jsxs(Ji,{initial:"hidden",animate:"visible",variants:ee,children:[e.jsx(Zi,{children:e.jsxs("svg",{viewBox:"0 0 300 200",fill:"none",children:[e.jsx("circle",{cx:"250",cy:"50",r:"200",fill:"white"}),e.jsx("circle",{cx:"50",cy:"150",r:"100",fill:"white"})]})}),e.jsxs("h1",{children:["Welcome, ",(t==null?void 0:t.name)||"Friend","!"]}),e.jsx("p",{children:"Track your daily emotions, send and receive virtual hugs, and connect with supportive friends."})]}),e.jsx(Gt,{}),e.jsxs(Re,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx(M,{type:"heart",size:20}),"Your Activity Center"]}),e.jsxs(eo,{children:[e.jsxs(De,{children:[e.jsx(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:e.jsx(nn,{})}),e.jsx(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},children:e.jsx(kt,{})})]}),e.jsxs(De,{children:[e.jsx(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.4},children:e.jsx(ei,{})}),e.jsx(b.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},children:e.jsx(Sn,{})})]})]}),e.jsxs(Re,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},children:[e.jsx(M,{type:"moodTracker",size:20}),"Featured Tools"]}),e.jsxs(Ki,{variants:to,initial:"hidden",animate:"visible",children:[e.jsxs(ce,{onClick:()=>o("/mood-tracker"),variants:ee,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(de,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"var(--primary-color)"})})}),e.jsxs("h3",{children:[e.jsx(M,{type:"moodTracker",size:24}),"Mood Tracker"]}),e.jsx("p",{children:"Track your daily mood and discover patterns in your emotional well-being over time."})]}),e.jsxs(ce,{onClick:()=>o("/hug-center"),variants:ee,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(de,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#9D65C9"})})}),e.jsxs("h3",{children:[e.jsx(M,{type:"ComfortingHug",size:28}),"Hug Center"]}),e.jsx("p",{children:"Send customized virtual hugs to friends or request support from your community."})]}),e.jsxs(ce,{onClick:()=>o("/profile"),variants:ee,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(de,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#4CAF50"})})}),e.jsxs("h3",{children:[e.jsx(M,{type:"profile",size:24}),"Profile"]}),e.jsx("p",{children:"Customize your profile, manage privacy settings, and track your emotional journey."})]})]})]})]})};export{so as default};
//# sourceMappingURL=Dashboard-b9776c3d.js.map
