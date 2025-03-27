import{m as Te,d as n,j as e,c as K,r as x,u as De,a as ze,L as Re}from"./main-260c60ee.js";import{u as W,G as $e,E as Pe,a as ve,M as Ae,S as ae,b as We,c as Be,d as Ie}from"./ErrorMessage-216824f1.js";import{m as f}from"./motion-f9543ab0.js";import{F as B,a as ce,b as we,c as je,d as ke,e as Ne,f as Le,g as Ue,h as Ge,i as Ve,j as _e,k as Oe}from"./index.esm-79a19514.js";import{A as _}from"./index-22a75419.js";const Xe=Te`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,Ye=n.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`,Je=n.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${Xe} 1s linear infinite;
`,qe=n.div`
  margin-top: 1rem;
  color: var(--gray-600);
  font-size: 0.9rem;
`,Qe=({text:t="Loading..."})=>e.jsxs(Ye,{children:[e.jsx(Je,{}),t&&e.jsx(qe,{children:t})]}),de=n.div`
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
`,Ze=n.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,Ke=n.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`,et=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,tt=n.div`
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
`,rt=n.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,nt=n.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`,it=n.div`
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
`,at=n.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,ot=t=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(t)-1,4)],st=t=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(t)-1,4)],ct=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),dt=t=>t?t.split(" ").map(i=>i[0]).join("").toUpperCase().substring(0,2):"?",lt=()=>{const{loading:t,error:i,data:r,refetch:d}=W($e);if(t)return e.jsx(Qe,{text:"Loading public moods..."});if(i)return e.jsx(Pe,{error:i});const o=(r==null?void 0:r.publicMoods)||[];return o.length===0?e.jsxs(de,{children:[e.jsxs(le,{children:[e.jsx("h2",{children:"Community Moods"}),e.jsx(ue,{onClick:()=>d(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsxs(at,{children:[e.jsx("p",{children:"No public moods have been shared yet."}),e.jsx("p",{children:"The community mood board will populate as users share their feelings."})]})]}):e.jsxs(de,{children:[e.jsxs(le,{children:[e.jsx("h2",{children:"Community Moods"}),e.jsx(ue,{onClick:()=>d(),children:e.jsx("span",{children:"Refresh"})})]}),e.jsx(Ze,{children:o.map(c=>{var a,s;return e.jsxs(Ke,{children:[e.jsxs(et,{children:[e.jsxs(tt,{children:[e.jsx("span",{className:"emoji",children:ot(c.score)}),e.jsx("span",{className:"label",children:st(c.score)})]}),e.jsx(rt,{children:ct(c.createdAt)})]}),c.note&&e.jsx(nt,{children:c.note}),e.jsxs(it,{children:[e.jsx("div",{className:"avatar",children:dt((a=c.user)==null?void 0:a.name)}),e.jsx("span",{children:((s=c.user)==null?void 0:s.name)||"Anonymous User"})]})]},c.id)})})]})},ut="/assets/happy-face-8e76819c.svg",gt="/assets/hug-icon-a65e4efe.svg",ht="/assets/mood-tracker-8aaefd8f.svg",pt="/assets/community-ef14f86f.svg",mt="/assets/ComfortingHug-7b35f3f0.png",xt="/assets/EnthusiasticHug-34cb3319.png",ft="/assets/GroupHug-720ddcec.png",ge="/assets/StandardHug-fced95c7.png",bt="/assets/SupportiveHug-de556136.png",yt="/assets/VirtualHug-f24120c7.png",vt="/assets/RelaxingHug-b42c8043.png",wt="/assets/WelcomeHug-41a086c9.png",jt="/assets/FriendlyHug-108d9a39.png",kt="/assets/GentleHug-9e995eae.png",Ct="/assets/FamilyHug-e5aea984.png",Ht="/assets/SmilingHug-06fbeb08.png",St={verySad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 45C40 45 45 40 50 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 45C70 45 75 40 80 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 85C40 85 60 75 80 85' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",sad:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 80C40 80 60 70 80 80' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",neutral:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 75C40 75 60 75 80 75' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",happy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M40 50C40 50 45 45 50 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M70 50C70 50 75 45 80 50' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M40 70C40 70 60 80 80 70' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E",veryHappy:"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='60' cy='60' r='50' fill='%23FFCDD2'/%3E%3Cpath d='M35 45C35 45 40 40 45 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M75 45C75 45 80 40 85 45' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3Cpath d='M35 65C35 65 60 90 85 65' stroke='%23374151' stroke-width='3' stroke-linecap='round'/%3E%3C/svg%3E"},Mt="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' fill='%23EC4899'/%3E%3C/svg%3E",Ft="data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 2c3 4 5 6 9 7-4 4-7 8-7 13H10c0-5-3-9-7-13 4-1 6-3 9-7z' fill='%23F59E0B'/%3E%3C/svg%3E",C=({type:t,score:i,size:r=40,animate:d=!0,...o})=>{if(t==="mood"&&i!==void 0){let s;if(i===null)return e.jsx("div",{style:{width:r,height:r}});i>=8.5?s="veryHappy":i>=7?s="happy":i>=5?s="neutral":i>=3?s="sad":s="verySad";const h=St[s];return d?e.jsx(f.img,{src:h,alt:`Mood level: ${s}`,width:r,height:r,initial:{scale:0},animate:{scale:1,rotate:[0,10,-10,0]},transition:{type:"spring",damping:10,stiffness:100,delay:.3},...o}):e.jsx("img",{src:h,alt:`Mood level: ${s}`,width:r,height:r,...o})}let c,a;switch(t){case"happyFace":c=ut,a="Happy Face";break;case"hugIcon":c=gt,a="Hug Icon";break;case"moodTracker":c=ht,a="Mood Tracker";break;case"community":c=pt,a="Community";break;case"heart":c=Mt,a="Heart";break;case"fire":c=Ft,a="Fire";break;case"Comforting":case"ComfortingHug":c=mt,a="Comforting Hug";break;case"Enthusiastic":case"EnthusiasticHug":c=xt,a="Enthusiastic Hug";break;case"Group":case"GroupHug":c=ft,a="Group Hug";break;case"Standard":case"StandardHug":c=ge,a="Standard Hug";break;case"Supportive":case"SupportiveHug":c=bt,a="Supportive Hug";break;case"Virtual":case"VirtualHug":c=yt,a="Virtual Hug";break;case"Relaxing":case"RelaxingHug":c=vt,a="Relaxing Hug";break;case"Welcome":case"WelcomeHug":c=wt,a="Welcome Hug";break;case"Friendly":case"FriendlyHug":c=jt,a="Friendly Hug";break;case"Gentle":case"GentleHug":c=kt,a="Gentle Hug";break;case"Family":case"FamilyHug":c=Ct,a="Family Hug";break;case"Smiling":case"SmilingHug":c=Ht,a="Smiling Hug";break;default:if(t&&t.includes("Hug"))c=ge,a=t;else return null}return d?a&&a.includes("Hug")?e.jsx(f.img,{src:c,alt:a,width:r,height:r,initial:{scale:0,rotate:-5},animate:{scale:1,rotate:0,y:[0,-5,0]},whileHover:{scale:1.1,rotate:[-2,2,-2,0],transition:{rotate:{repeat:0,duration:.5},scale:{duration:.2}}},transition:{type:"spring",damping:12,stiffness:150,delay:.2,y:{repeat:1/0,repeatType:"reverse",duration:1.5,ease:"easeInOut"}},...o}):e.jsx(f.img,{src:c,alt:a,width:r,height:r,initial:{scale:0},animate:{scale:1},transition:{type:"spring",damping:15,stiffness:200,delay:.2},...o}):e.jsx("img",{src:c,alt:a,width:r,height:r,...o})},Y=43200,he=1440,pe=Symbol.for("constructDateFrom");function oe(t,i){return typeof t=="function"?t(i):t&&typeof t=="object"&&pe in t?t[pe](i):t instanceof Date?new t.constructor(i):new Date(i)}function D(t,i){return oe(i||t,t)}let Et={};function Tt(){return Et}function me(t){const i=D(t),r=new Date(Date.UTC(i.getFullYear(),i.getMonth(),i.getDate(),i.getHours(),i.getMinutes(),i.getSeconds(),i.getMilliseconds()));return r.setUTCFullYear(i.getFullYear()),+t-+r}function se(t,...i){const r=oe.bind(null,t||i.find(d=>typeof d=="object"));return i.map(r)}function Z(t,i){const r=+D(t)-+D(i);return r<0?-1:r>0?1:r}function Dt(t){return oe(t,Date.now())}function zt(t,i,r){const[d,o]=se(r==null?void 0:r.in,t,i),c=d.getFullYear()-o.getFullYear(),a=d.getMonth()-o.getMonth();return c*12+a}function Rt(t){return i=>{const d=(t?Math[t]:Math.trunc)(i);return d===0?0:d}}function $t(t,i){return+D(t)-+D(i)}function Pt(t,i){const r=D(t,i==null?void 0:i.in);return r.setHours(23,59,59,999),r}function At(t,i){const r=D(t,i==null?void 0:i.in),d=r.getMonth();return r.setFullYear(r.getFullYear(),d+1,0),r.setHours(23,59,59,999),r}function Wt(t,i){const r=D(t,i==null?void 0:i.in);return+Pt(r,i)==+At(r,i)}function Bt(t,i,r){const[d,o,c]=se(r==null?void 0:r.in,t,t,i),a=Z(o,c),s=Math.abs(zt(o,c));if(s<1)return 0;o.getMonth()===1&&o.getDate()>27&&o.setDate(30),o.setMonth(o.getMonth()-a*s);let h=Z(o,c)===-a;Wt(d)&&s===1&&Z(d,c)===1&&(h=!1);const m=a*(s-+h);return m===0?0:m}function It(t,i,r){const d=$t(t,i)/1e3;return Rt(r==null?void 0:r.roundingMethod)(d)}const Nt={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},Lt=(t,i,r)=>{let d;const o=Nt[t];return typeof o=="string"?d=o:i===1?d=o.one:d=o.other.replace("{{count}}",i.toString()),r!=null&&r.addSuffix?r.comparison&&r.comparison>0?"in "+d:d+" ago":d};function ee(t){return(i={})=>{const r=i.width?String(i.width):t.defaultWidth;return t.formats[r]||t.formats[t.defaultWidth]}}const Ut={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},Gt={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},Vt={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},_t={date:ee({formats:Ut,defaultWidth:"full"}),time:ee({formats:Gt,defaultWidth:"full"}),dateTime:ee({formats:Vt,defaultWidth:"full"})},Ot={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},Xt=(t,i,r,d)=>Ot[t];function G(t){return(i,r)=>{const d=r!=null&&r.context?String(r.context):"standalone";let o;if(d==="formatting"&&t.formattingValues){const a=t.defaultFormattingWidth||t.defaultWidth,s=r!=null&&r.width?String(r.width):a;o=t.formattingValues[s]||t.formattingValues[a]}else{const a=t.defaultWidth,s=r!=null&&r.width?String(r.width):t.defaultWidth;o=t.values[s]||t.values[a]}const c=t.argumentCallback?t.argumentCallback(i):i;return o[c]}}const Yt={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},Jt={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},qt={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Qt={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Zt={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},Kt={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},er=(t,i)=>{const r=Number(t),d=r%100;if(d>20||d<10)switch(d%10){case 1:return r+"st";case 2:return r+"nd";case 3:return r+"rd"}return r+"th"},tr={ordinalNumber:er,era:G({values:Yt,defaultWidth:"wide"}),quarter:G({values:Jt,defaultWidth:"wide",argumentCallback:t=>t-1}),month:G({values:qt,defaultWidth:"wide"}),day:G({values:Qt,defaultWidth:"wide"}),dayPeriod:G({values:Zt,defaultWidth:"wide",formattingValues:Kt,defaultFormattingWidth:"wide"})};function V(t){return(i,r={})=>{const d=r.width,o=d&&t.matchPatterns[d]||t.matchPatterns[t.defaultMatchWidth],c=i.match(o);if(!c)return null;const a=c[0],s=d&&t.parsePatterns[d]||t.parsePatterns[t.defaultParseWidth],h=Array.isArray(s)?nr(s,j=>j.test(a)):rr(s,j=>j.test(a));let m;m=t.valueCallback?t.valueCallback(h):h,m=r.valueCallback?r.valueCallback(m):m;const y=i.slice(a.length);return{value:m,rest:y}}}function rr(t,i){for(const r in t)if(Object.prototype.hasOwnProperty.call(t,r)&&i(t[r]))return r}function nr(t,i){for(let r=0;r<t.length;r++)if(i(t[r]))return r}function ir(t){return(i,r={})=>{const d=i.match(t.matchPattern);if(!d)return null;const o=d[0],c=i.match(t.parsePattern);if(!c)return null;let a=t.valueCallback?t.valueCallback(c[0]):c[0];a=r.valueCallback?r.valueCallback(a):a;const s=i.slice(o.length);return{value:a,rest:s}}}const ar=/^(\d+)(th|st|nd|rd)?/i,or=/\d+/i,sr={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},cr={any:[/^b/i,/^(a|c)/i]},dr={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},lr={any:[/1/i,/2/i,/3/i,/4/i]},ur={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},gr={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},hr={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},pr={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},mr={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},xr={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},fr={ordinalNumber:ir({matchPattern:ar,parsePattern:or,valueCallback:t=>parseInt(t,10)}),era:V({matchPatterns:sr,defaultMatchWidth:"wide",parsePatterns:cr,defaultParseWidth:"any"}),quarter:V({matchPatterns:dr,defaultMatchWidth:"wide",parsePatterns:lr,defaultParseWidth:"any",valueCallback:t=>t+1}),month:V({matchPatterns:ur,defaultMatchWidth:"wide",parsePatterns:gr,defaultParseWidth:"any"}),day:V({matchPatterns:hr,defaultMatchWidth:"wide",parsePatterns:pr,defaultParseWidth:"any"}),dayPeriod:V({matchPatterns:mr,defaultMatchWidth:"any",parsePatterns:xr,defaultParseWidth:"any"})},br={code:"en-US",formatDistance:Lt,formatLong:_t,formatRelative:Xt,localize:tr,match:fr,options:{weekStartsOn:0,firstWeekContainsDate:1}};function yr(t,i,r){const d=Tt(),o=(r==null?void 0:r.locale)??d.locale??br,c=2520,a=Z(t,i);if(isNaN(a))throw new RangeError("Invalid time value");const s=Object.assign({},r,{addSuffix:r==null?void 0:r.addSuffix,comparison:a}),[h,m]=se(r==null?void 0:r.in,...a>0?[i,t]:[t,i]),y=It(m,h),j=(me(m)-me(h))/1e3,p=Math.round((y-j)/60);let S;if(p<2)return r!=null&&r.includeSeconds?y<5?o.formatDistance("lessThanXSeconds",5,s):y<10?o.formatDistance("lessThanXSeconds",10,s):y<20?o.formatDistance("lessThanXSeconds",20,s):y<40?o.formatDistance("halfAMinute",0,s):y<60?o.formatDistance("lessThanXMinutes",1,s):o.formatDistance("xMinutes",1,s):p===0?o.formatDistance("lessThanXMinutes",1,s):o.formatDistance("xMinutes",p,s);if(p<45)return o.formatDistance("xMinutes",p,s);if(p<90)return o.formatDistance("aboutXHours",1,s);if(p<he){const w=Math.round(p/60);return o.formatDistance("aboutXHours",w,s)}else{if(p<c)return o.formatDistance("xDays",1,s);if(p<Y){const w=Math.round(p/he);return o.formatDistance("xDays",w,s)}else if(p<Y*2)return S=Math.round(p/Y),o.formatDistance("aboutXMonths",S,s)}if(S=Bt(m,h),S<12){const w=Math.round(p/Y);return o.formatDistance("xMonths",w,s)}else{const w=S%12,H=Math.trunc(S/12);return w<3?o.formatDistance("aboutXYears",H,s):w<9?o.formatDistance("overXYears",H,s):o.formatDistance("almostXYears",H+1,s)}}function Ce(t,i){return yr(t,Dt(t),i)}const vr=n(f.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,wr=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,jr=n.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,kr=n.button`
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
`,xe=n.div`
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
`,Cr=n.div`
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
`,Hr=n(f.div)`
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
`,Sr=n.div`
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
`,Mr=n.div`
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
`,Fr=n.div`
  flex: 1;
`,Er=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`,Tr=n.span`
  font-weight: 600;
  color: #333;
`,Dr=n.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 0.75rem;
  background: ${t=>{switch(t.type){case"ComfortingHug":return"rgba(255, 152, 0, 0.15)";case"GroupHug":return"rgba(76, 175, 80, 0.15)";case"EnthusiasticHug":return"rgba(233, 30, 99, 0.15)";case"FriendlyHug":return"rgba(33, 150, 243, 0.15)";case"FamilyHug":return"rgba(156, 39, 176, 0.15)";case"StandardHug":default:return"rgba(108, 92, 231, 0.15)"}}};
  color: ${t=>{switch(t.type){case"ComfortingHug":return"#f57c00";case"GroupHug":return"#388e3c";case"EnthusiasticHug":return"#c2185b";case"FriendlyHug":return"#1976d2";case"FamilyHug":return"#7b1fa2";case"StandardHug":default:return"#5c4ccc"}}};
`,zr=n.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Rr=n.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
  font-size: 0.8rem;
`,$r=n.span`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-right: auto;
`,Pr=n.button`
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
`,Ar=n.button`
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
`,Wr=n.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`,Br=n.span`
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
`,Ir=n(f.div)`
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
`,Nr=n(f.div)`
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
`,Lr=n(f.div)`
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
`,Ur=n.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-bottom: 1rem;
`,J=n.button`
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
`,Gr=n.textarea`
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
`,Vr=n.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`,_r=n.button`
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
`,Or=n.button`
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
`,He=()=>{var X;const{loading:t,error:i,data:r,refetch:d}=W(ve,{variables:{limit:10},fetchPolicy:"network-only"}),[o]=K(Ae),[c,{loading:a}]=K(ae),[s,h]=x.useState(null),[m,y]=x.useState(""),[j,p]=x.useState("StandardHug"),[S,w]=x.useState(!1),[H,M]=x.useState(!1),[F,z]=x.useState(null),R=((X=r==null?void 0:r.receivedHugs)==null?void 0:X.filter(g=>!g.isRead))||[],I=R.length>0;x.useEffect(()=>{if(H){const g=setTimeout(()=>{M(!1)},3e3);return()=>clearTimeout(g)}},[H]);const N=g=>g?g.split(" ").map(v=>v[0]).join("").toUpperCase().substring(0,2):"?",E=g=>{const v=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],L=g?g.charCodeAt(0)%v.length:0;return v[L]},$=async(g,v)=>{g.stopPropagation();try{await o({variables:{id:v}}),d()}catch(L){console.error("Error marking hug as read:",L)}},b=(g,v)=>{g.stopPropagation(),h(v),y(`Thanks for the ${v.type.replace(/([A-Z])/g," $1").trim().toLowerCase()}!`),p("StandardHug"),w(!0)},u=()=>{w(!1),h(null),y("")},k=async()=>{var g;if(!(!s||!m.trim()))try{(g=(await c({variables:{input:{receiverId:s.sender.id,type:j,message:m.trim()}}})).data)!=null&&g.sendHug&&(z(s.sender.name||s.sender.username),M(!0),u(),setTimeout(()=>{d()},1e3))}catch(v){console.error("Error sending reply hug:",v)}},T=g=>{switch(g){case"ComfortingHug":return"rgba(255, 152, 0, 0.1)";case"GroupHug":return"rgba(76, 175, 80, 0.1)";case"EnthusiasticHug":return"rgba(233, 30, 99, 0.1)";case"FriendlyHug":return"rgba(33, 150, 243, 0.1)";case"FamilyHug":return"rgba(156, 39, 176, 0.1)";case"StandardHug":default:return"rgba(108, 92, 231, 0.1)"}},O=()=>t?e.jsx(Wr,{children:"Loading received hugs..."}):i?e.jsx(xe,{children:"Couldn't load hugs. Please try again."}):!r||!r.receivedHugs||r.receivedHugs.length===0?e.jsx(xe,{children:"No hugs received yet. Send some to get the ball rolling!"}):e.jsx(Cr,{children:r.receivedHugs.map(g=>e.jsxs(Hr,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},isRead:g.isRead,children:[e.jsxs(Sr,{bgColor:T(g.type),children:[e.jsx(C,{type:g.type,size:30}),e.jsx(Mr,{bgColor:E(g.sender.id),children:N(g.sender.name||g.sender.username)})]}),e.jsxs(Fr,{children:[e.jsxs(Er,{children:[e.jsx(Tr,{children:g.sender.name||g.sender.username}),e.jsx(Dr,{type:g.type,children:g.type.replace(/([A-Z])/g," $1").trim()})]}),e.jsx(zr,{children:g.message||"Sent you a hug!"}),e.jsxs(Rr,{children:[e.jsxs($r,{children:[e.jsx(we,{size:12}),Ce(new Date(g.createdAt),{addSuffix:!0})]}),!g.isRead&&e.jsxs(Pr,{onClick:v=>$(v,g.id),children:[e.jsx(je,{size:12}),"Mark Read"]}),e.jsxs(Ar,{onClick:v=>b(v,g),children:[e.jsx(ce,{size:12}),"Reply"]})]})]})]},g.id))});return e.jsxs(vr,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsxs(wr,{children:[e.jsxs(jr,{children:[e.jsx(B,{size:16}),"Received Hugs",I&&e.jsx(Br,{children:R.length})]}),e.jsx(kr,{children:"View All"})]}),O(),e.jsx(_,{children:S&&s&&e.jsx(Nr,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:e.jsxs(Lr,{initial:{y:20,opacity:0},animate:{y:0,opacity:1},exit:{y:20,opacity:0},children:[e.jsxs("h4",{children:[e.jsx(ce,{size:18}),"Reply to ",s.sender.name||s.sender.username]}),e.jsxs(Ur,{children:[e.jsxs(J,{selected:j==="StandardHug",onClick:()=>p("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"StandardHug",size:30})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(J,{selected:j==="FriendlyHug",onClick:()=>p("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"FriendlyHug",size:30})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(J,{selected:j==="EnthusiasticHug",onClick:()=>p("EnthusiasticHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"EnthusiasticHug",size:30})}),e.jsx("span",{children:"Enthusiastic"})]}),e.jsxs(J,{selected:j==="ComfortingHug",onClick:()=>p("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"ComfortingHug",size:30})}),e.jsx("span",{children:"Comforting"})]})]}),e.jsx(Gr,{value:m,onChange:g=>y(g.target.value),placeholder:"Write your reply message..."}),e.jsxs(Vr,{children:[e.jsx(_r,{onClick:u,children:"Cancel"}),e.jsx(Or,{onClick:k,disabled:!m.trim()||a,children:a?"Sending...":"Send Reply"})]})]})})}),e.jsx(_,{children:H&&e.jsxs(Ir,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(B,{size:16}),"Hug sent to ",F,"!"]})})]})},Xr=n(f.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,Yr=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Jr=n.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,qr=n.div`
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
`,Qr=n.input`
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
`,Zr=n.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  display: flex;
  align-items: center;
  justify-content: center;
`,Kr=n.button`
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
`,en=n.div`
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
`,A=n.button`
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
`,tn=n.div`
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
`,rn=n.div`
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
`,nn=n.div`
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
`,an=n.div`
  flex: 1;
`,on=n.div`
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
`,sn=n.div`
  color: #888;
  font-size: 0.8rem;
`,cn=n.button`
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
`,dn=n.textarea`
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
`,fe=n.div`
  display: flex;
  gap: 8px;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
`,q=n.button`
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
`,ln=n.div`
  margin-bottom: 1rem;
`,un=n.input`
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
`,gn=n.button`
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
`,be=n.div`
  text-align: center;
  padding: 1rem;
  color: #888;
  font-size: 0.9rem;
`,hn=n.div`
  text-align: center;
  padding: 1rem;
  color: #888;
`,pn=n(f.div)`
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
`,ye=n.div`
  color: #ff3b30;
  font-size: 0.8rem;
  margin-top: 4px;
  margin-bottom: 8px;
`,Se=()=>{const[t,i]=x.useState("friends"),[r,d]=x.useState(""),[o,c]=x.useState("StandardHug"),[a,s]=x.useState(null),[h,m]=x.useState(""),[y,j]=x.useState(""),[p,S]=x.useState("email"),[w,H]=x.useState(!1),[M,F]=x.useState(""),[z,R]=x.useState(!1),{loading:I,error:N,data:E}=W(We,{variables:{limit:10,search:r},fetchPolicy:"network-only"}),[$,{loading:b}]=K(ae);x.useEffect(()=>{if(w){const l=setTimeout(()=>{H(!1)},3e3);return()=>clearTimeout(l)}},[w]),x.useEffect(()=>{t==="external"&&(p==="email"?R(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(y)):p==="telegram"&&R(y.trim().length>0))},[y,p,t]),x.useEffect(()=>{let l="";switch(o){case"ComfortingHug":l="I'm sending you a comforting hug to help you feel better!";break;case"FriendlyHug":l="Hey friend! Thought you might appreciate a friendly hug today.";break;case"EnthusiasticHug":l="Sending you an enthusiastic hug to celebrate with you!";break;case"GroupHug":l="Group hug! Bringing us all together.";break;case"FamilyHug":l="A warm family hug to let you know I care about you.";break;case"StandardHug":default:l="Just sending a hug to brighten your day!";break}m(l)},[o]);const u=l=>l?l.split(" ").map(P=>P[0]).join("").toUpperCase().substring(0,2):"?",k=l=>{const P=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],U=l?l.charCodeAt(0)%P.length:0;return P[U]},T=async()=>{var l,P;F("");try{t==="friends"&&a?(l=(await $({variables:{input:{receiverId:a.id,type:o,message:h.trim()}}})).data)!=null&&l.sendHug&&(H(!0),s(null),O()):t==="external"&&z&&(P=(await $({variables:{input:{externalRecipient:{type:p,contact:y.trim()},type:o,message:h.trim()}}})).data)!=null&&P.sendHug&&(H(!0),O())}catch(U){console.error("Error sending hug:",U),F("Failed to send hug. Please try again.")}},O=()=>{m(X(o)),j("")},X=l=>{switch(l){case"ComfortingHug":return"I'm sending you a comforting hug to help you feel better!";case"FriendlyHug":return"Hey friend! Thought you might appreciate a friendly hug today.";case"EnthusiasticHug":return"Sending you an enthusiastic hug to celebrate with you!";case"GroupHug":return"Group hug! Bringing us all together.";case"FamilyHug":return"A warm family hug to let you know I care about you.";case"StandardHug":default:return"Just sending a hug to brighten your day!"}},g=l=>{d(l.target.value)},v=()=>{d("")},L=l=>{a&&a.id===l.id?s(null):s(l)},Me=()=>I?e.jsx(hn,{children:"Loading friends..."}):N?e.jsx(be,{children:"Error loading friends. Please try again."}):!E||!E.users||E.users.length===0?e.jsx(be,{children:"No friends found. Add some friends to send hugs!"}):e.jsx(tn,{children:E.users.map(l=>e.jsxs(rn,{selected:a&&a.id===l.id,onClick:()=>L(l),children:[e.jsx(nn,{bgColor:k(l.id),children:l.avatarUrl?e.jsx("img",{src:l.avatarUrl,alt:l.name}):u(l.name||l.username)}),e.jsxs(an,{children:[e.jsx(on,{children:l.name||"Unnamed User"}),e.jsxs(sn,{children:["@",l.username]})]}),e.jsx(cn,{selected:a&&a.id===l.id,children:a&&a.id===l.id?e.jsx(je,{size:14}):null})]},l.id))}),Fe=()=>e.jsxs(ln,{children:[e.jsxs(fe,{style:{marginBottom:"8px"},children:[e.jsx(q,{active:p==="email",onClick:()=>S("email"),children:"Email"}),e.jsx(q,{active:p==="telegram",onClick:()=>S("telegram"),children:"Telegram"})]}),e.jsx(un,{type:p==="email"?"email":"text",placeholder:p==="email"?"Enter email address":"Enter Telegram username",value:y,onChange:l=>j(l.target.value)}),!z&&y.trim()!==""&&e.jsx(ye,{children:p==="email"?"Please enter a valid email address.":"Please enter a valid Telegram username."})]}),Ee=()=>t==="friends"?a!==null&&h.trim()!=="":t==="external"?z&&h.trim()!=="":!1;return e.jsxs(Xr,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsx(Yr,{children:e.jsxs(Jr,{children:[e.jsx(ke,{size:16}),"Quick Send Hug"]})}),e.jsxs(fe,{children:[e.jsxs(q,{active:t==="friends",onClick:()=>i("friends"),children:[e.jsx(Ne,{size:14,style:{marginRight:"4px"}}),"Friends"]}),e.jsxs(q,{active:t==="external",onClick:()=>i("external"),children:[e.jsx(Le,{size:14,style:{marginRight:"4px"}}),"External"]})]}),t==="friends"&&e.jsxs(e.Fragment,{children:[e.jsxs(qr,{children:[e.jsx(Zr,{children:e.jsx(Ue,{size:16})}),e.jsx(Qr,{type:"text",placeholder:"Search friends...",value:r,onChange:g}),e.jsx(Kr,{visible:r!=="",onClick:v,children:e.jsx(Ge,{size:16})})]}),Me()]}),t==="external"&&Fe(),e.jsxs(en,{children:[e.jsxs(A,{selected:o==="StandardHug",onClick:()=>c("StandardHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"StandardHug",size:24})}),e.jsx("span",{children:"Standard"})]}),e.jsxs(A,{selected:o==="FriendlyHug",onClick:()=>c("FriendlyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"FriendlyHug",size:24})}),e.jsx("span",{children:"Friendly"})]}),e.jsxs(A,{selected:o==="ComfortingHug",onClick:()=>c("ComfortingHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"ComfortingHug",size:24})}),e.jsx("span",{children:"Comforting"})]}),e.jsxs(A,{selected:o==="EnthusiasticHug",onClick:()=>c("EnthusiasticHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"EnthusiasticHug",size:24})}),e.jsx("span",{children:"Enthusiastic"})]}),e.jsxs(A,{selected:o==="FamilyHug",onClick:()=>c("FamilyHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"FamilyHug",size:24})}),e.jsx("span",{children:"Family"})]}),e.jsxs(A,{selected:o==="GroupHug",onClick:()=>c("GroupHug"),children:[e.jsx("div",{className:"icon-wrapper",children:e.jsx(C,{type:"GroupHug",size:24})}),e.jsx("span",{children:"Group"})]})]}),e.jsx(dn,{placeholder:"Write your message...",value:h,onChange:l=>m(l.target.value)}),M&&e.jsx(ye,{children:M}),e.jsxs(gn,{onClick:T,disabled:!Ee()||b,children:[b?"Sending...":"Send Hug",e.jsx(B,{size:16})]}),e.jsx(_,{children:w&&e.jsxs(pn,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(B,{size:16}),"Hug sent successfully!"]})})]})},mn=n.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`,xn=n(f.div)`
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
`,fn=n.div`
  font-size: 2.8rem;
  font-weight: 700;
  margin: 12px 0;
  color: var(--primary-color);
  position: relative;
  z-index: 1;
`,bn=n.div`
  font-size: 1rem;
  color: var(--gray-600);
  position: relative;
  z-index: 1;
`,yn=n.div`
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
`,vn=n.div`
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
`,wn={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.15}}},jn={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{type:"spring",damping:12,stiffness:200}}},kn=()=>{const{data:t,loading:i}=W(Be),{data:r,loading:d}=W(ve),o=(t==null?void 0:t.userStats)||{moodStreak:0,totalMoodEntries:0,hugsSent:0,hugsReceived:0},c=(r==null?void 0:r.receivedHugs)||[],a=[{label:"Day Streak",value:o.moodStreak,icon:"fire",color:"#FF9800",bgColor:"#FFF3E0",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#FF9800"})})},{label:"Moods Tracked",value:o.totalMoodEntries,icon:"moodTracker",color:"#4CAF50",bgColor:"#E8F5E9",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#4CAF50"})})},{label:"Hugs Sent",value:o.hugsSent,icon:"StandardHug",color:"#5C6BC0",bgColor:"#E8EAF6",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#5C6BC0"})})},{label:"Hugs Received",value:o.hugsReceived,icon:"ComfortingHug",color:"#9D65C9",bgColor:"#F3E5F5",decoration:e.jsx("svg",{viewBox:"0 0 120 120",fill:"none",children:e.jsx("circle",{cx:"100",cy:"20",r:"80",fill:"#9D65C9"})})}];return i||d?e.jsx("div",{children:"Loading dashboard stats..."}):e.jsxs("div",{children:[e.jsx(mn,{as:f.div,variants:wn,initial:"hidden",animate:"visible",children:a.map((s,h)=>e.jsxs(xn,{variants:jn,children:[e.jsx(yn,{bgColor:s.bgColor,iconColor:s.color,children:e.jsx(C,{type:s.icon,size:28})}),e.jsx(fn,{style:{color:s.color},children:s.value}),e.jsx(bn,{children:s.label}),e.jsx(vn,{children:s.decoration})]},h))}),e.jsx(Se,{}),e.jsx(He,{hugs:c})]})},Cn=n(f.div)`
  background: #ffffff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 100%;
  overflow: hidden;
`,Hn=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Sn=n.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`,Mn=n.button`
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
`,Fn=n.div`
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
`,En=n(f.div)`
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
`,Tn=n.div`
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
`,Dn=n.div`
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
`,zn=n.div`
  flex: 1;
`,Rn=n.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`,$n=n.span`
  font-weight: 600;
  color: #333;
`,Pn=n.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  background-color: ${t=>t.score>=8?"#4cd964":t.score>=5?"#ffcc00":"#ff3b30"};
  color: ${t=>t.score>=8?"#006400":t.score>=5?"#664d00":"#fff"};
`,An=n.p`
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 8px;
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`,Wn=n.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #888;
  font-size: 0.8rem;
`,Bn=n.span`
  display: flex;
  align-items: center;
  gap: 4px;
`,In=n.button`
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
`,Nn=n.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #888;
`,Ln=n(f.div)`
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
`,Un=n(f.div)`
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
`,Gn=n.div`
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
`,Vn=()=>{var $;const{loading:t,error:i,data:r,refetch:d}=W(Ie,{variables:{limit:10},fetchPolicy:"network-only",pollInterval:6e4}),[o,c]=x.useState(null),[a,s]=x.useState("all"),[h,m]=x.useState(!1),[y,j]=x.useState(null),[p,S]=x.useState(null),[w,{loading:H}]=K(ae),M=(($=r==null?void 0:r.friendsMoods)==null?void 0:$.filter(b=>b.score<=4))||[],F=M.length>0;x.useEffect(()=>{if(h){const b=setTimeout(()=>{m(!1)},3e3);return()=>clearTimeout(b)}},[h]);const z=b=>b?b.split(" ").map(u=>u[0]).join("").toUpperCase().substring(0,2):"?",R=b=>{const u=["#6c5ce7","#00cec9","#fdcb6e","#e17055","#74b9ff","#55efc4"],k=b?b.charCodeAt(0)%u.length:0;return u[k]},I=async(b,u)=>{var k;if(b.stopPropagation(),!H){S(u.user.id);try{(k=(await w({variables:{input:{receiverId:u.user.id,type:u.score<=4?"ComfortingHug":"StandardHug",message:u.score<=4?"I noticed you're not feeling great. Sending you a comforting hug!":"Hey! Just sending a friendly hug your way!"}}})).data)!=null&&k.sendHug&&(j(u.user.name||u.user.username),m(!0),setTimeout(()=>{d()},1e3))}catch(T){console.error("Error sending hug:",T)}finally{S(null)}}},N=()=>{if(!(r!=null&&r.friendsMoods))return[];let b=[...r.friendsMoods];return a==="needSupport"?b.filter(u=>u.score<=4):a==="recent"?b.sort((u,k)=>new Date(k.createdAt)-new Date(u.createdAt)):b},E=()=>{if(t)return e.jsx(Nn,{children:"Loading friends' moods..."});if(i)return e.jsx(te,{children:"Couldn't load friends' moods. Please try again."});if(!r||!r.friendsMoods||r.friendsMoods.length===0)return e.jsx(te,{children:"No friend moods yet. Add friends to see their moods here!"});const b=N();return b.length===0?e.jsx(te,{children:"No moods match the current filter."}):e.jsx(Fn,{children:b.map(u=>{const k=u.score<=4;return e.jsxs(En,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.3},onClick:()=>c(o===u.id?null:u.id),needsSupport:k,children:[k&&e.jsx(Dn,{children:e.jsx(Oe,{size:12})}),e.jsx(Tn,{bgColor:R(u.user.id),children:u.user.avatarUrl?e.jsx("img",{src:u.user.avatarUrl,alt:u.user.name}):z(u.user.name||u.user.username)}),e.jsxs(zn,{children:[e.jsxs(Rn,{children:[e.jsx($n,{children:u.user.name||u.user.username}),e.jsxs(Pn,{score:u.score,children:[u.score,"/10"]})]}),e.jsx(An,{children:u.note||"No description provided."}),e.jsxs(Wn,{children:[e.jsxs(Bn,{children:[e.jsx(we,{size:12}),Ce(new Date(u.createdAt),{addSuffix:!0})]}),e.jsx(In,{onClick:T=>I(T,u),needsSupport:k,disabled:H&&p===u.user.id,children:H&&p===u.user.id?"Sending...":e.jsxs(e.Fragment,{children:[k?e.jsx(B,{size:12}):e.jsx(ke,{size:12}),k?"Send Support":"Send Hug"]})})]})]})]},u.id)})})};return e.jsxs(Cn,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},transition:{duration:.3},children:[e.jsxs(Hn,{children:[e.jsxs(Sn,{children:[e.jsx(Ve,{size:16}),"Friends' Moods",F&&e.jsx(f.span,{style:{background:"#ff3b30",color:"white",borderRadius:"50%",width:"20px",height:"20px",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:"0.7rem",fontWeight:"bold"},initial:{scale:0},animate:{scale:1},transition:{type:"spring",stiffness:500,damping:15},children:M.length})]}),e.jsx(Mn,{children:"View All"})]}),e.jsx(_,{children:F&&e.jsxs(Ln,{initial:{opacity:0,height:0,marginBottom:0},animate:{opacity:1,height:"auto",marginBottom:12},exit:{opacity:0,height:0,marginBottom:0},children:[e.jsx(_e,{size:18,color:"#d32f2f"}),e.jsxs("p",{children:[M.length===1?`${M[0].user.name||"Your friend"} is feeling down.`:`${M.length} friends are having a tough time.`,"Consider sending support!"]})]})}),e.jsxs(Gn,{children:[e.jsx(re,{active:a==="all",onClick:()=>s("all"),children:"All"}),e.jsxs(re,{active:a==="needSupport",onClick:()=>s("needSupport"),children:["Needs Support ",F&&`(${M.length})`]}),e.jsx(re,{active:a==="recent",onClick:()=>s("recent"),children:"Recent"})]}),E(),e.jsx(_,{children:h&&e.jsxs(Un,{initial:{opacity:0,y:50},animate:{opacity:1,y:0},exit:{opacity:0,y:50},children:[e.jsx(B,{size:16}),"Hug sent to ",y,"!"]})})]})},_n=n.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,On=n.header`
  background-color: white;
  padding: 1rem 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,Xn=n.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 8px;
`,Yn=n.div`
  display: flex;
  align-items: center;
`,Jn=n(f.div)`
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
`,qn=n.span`
  font-weight: 500;
  margin-right: 1rem;
`,Qn=n(f.button)`
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
`,Zn=n.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,Kn=n(f.div)`
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
`,ei=n.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  opacity: 0.05;
  z-index: 0;
  pointer-events: none;
`,ti=n(f.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2.5rem;
`,ri=n.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  margin: 2.5rem 0;
`,ne=n(f.div)`
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
`,ie=n.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.03;
  z-index: 0;
  pointer-events: none;
`,Q={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{duration:.5,ease:[.22,1,.36,1]}}},ni={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},di=()=>{const{currentUser:t,logout:i}=De(),[r,d]=x.useState(!0),o=ze();x.useEffect(()=>{const h=localStorage.getItem("redirectToDashboard")==="true";h&&(console.log("Dashboard detected redirect flag from login"),localStorage.removeItem("redirectToDashboard"));const m=setTimeout(()=>{d(!1),h&&console.log("Dashboard fully loaded after login redirect")},1e3);return()=>clearTimeout(m)},[]);const c=async()=>{await i(),o("/login")},a=h=>{o(h)},s=h=>h?h.split(" ").map(m=>m[0]).join("").toUpperCase().substring(0,2):"?";return r?e.jsx(Re,{text:"Loading dashboard..."}):e.jsxs(_n,{children:[e.jsxs(On,{children:[e.jsxs(Xn,{children:[e.jsx(C,{type:"hugIcon",size:28}),"HugMeNow"]}),e.jsxs(Yn,{children:[e.jsx(Jn,{initial:{scale:0},animate:{scale:1},transition:{type:"spring",bounce:.5},whileHover:{scale:1.1},children:s(t==null?void 0:t.name)}),e.jsx(qn,{children:(t==null?void 0:t.name)||"Guest"}),e.jsx(Qn,{onClick:c,whileHover:{scale:1.05},whileTap:{scale:.95},children:"Logout"})]})]}),e.jsxs(Zn,{children:[e.jsxs(Kn,{initial:"hidden",animate:"visible",variants:Q,children:[e.jsx(ei,{children:e.jsxs("svg",{viewBox:"0 0 300 200",fill:"none",children:[e.jsx("circle",{cx:"250",cy:"50",r:"200",fill:"var(--primary-color)"}),e.jsx("circle",{cx:"50",cy:"150",r:"100",fill:"var(--primary-color)"})]})}),e.jsxs("h1",{children:["Welcome, ",(t==null?void 0:t.name)||"Friend","!"]}),e.jsx("p",{children:"This is your personal dashboard where you can track your mood, send and receive virtual hugs, and connect with others."})]}),e.jsx(kn,{}),e.jsxs(ti,{variants:ni,initial:"hidden",animate:"visible",children:[e.jsxs(ne,{onClick:()=>a("/mood-tracker"),variants:Q,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(ie,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"var(--primary-color)"})})}),e.jsxs("h2",{children:[e.jsx(C,{type:"moodTracker",size:24}),"Mood Tracker"]}),e.jsx("p",{children:"Track your daily mood and see patterns in your emotional wellbeing over time."})]}),e.jsxs(ne,{onClick:()=>a("/hug-center"),variants:Q,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(ie,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#9D65C9"})})}),e.jsxs("h2",{children:[e.jsx(C,{type:"ComfortingHug",size:28}),"Hug Center"]}),e.jsx("p",{children:"Send virtual hugs to friends or request hugs from the community when you need support."})]}),e.jsxs(ne,{onClick:()=>a("/profile"),variants:Q,whileHover:{scale:1.02},whileTap:{scale:.98},children:[e.jsx(ie,{children:e.jsx("svg",{viewBox:"0 0 200 200",fill:"none",children:e.jsx("path",{d:"M0 0C50 20 100 50 150 100C170 120 190 150 200 200V0H0Z",fill:"#4CAF50"})})}),e.jsxs("h2",{children:[e.jsx(C,{type:"profile",size:24}),"Profile"]}),e.jsx("p",{children:"Manage your personal information, preferences, and privacy settings."})]})]}),e.jsx(f.h2,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.2},style:{marginTop:"3rem",color:"var(--gray-800)"},children:"Your Activity Center"}),e.jsxs(ri,{children:[e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.3},children:e.jsx(Vn,{})}),e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.4},children:e.jsx(He,{})}),e.jsx(f.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.5},children:e.jsx(Se,{})})]}),e.jsx(f.div,{style:{marginTop:"2rem"},initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{delay:.6},children:e.jsx(lt,{})})]})]})};export{di as default};
//# sourceMappingURL=Dashboard-5985c1d9.js.map
