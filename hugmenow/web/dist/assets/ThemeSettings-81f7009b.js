import{r as d,d as s,j as r,a as W,e as Y}from"./main-39f24046.js";import{l as _,m as X}from"./index.esm-ac3fa17b.js";const q=(e,n,t,l)=>{var a,u,g,v;const i=[t,{code:n,...l||{}}];if((u=(a=e==null?void 0:e.services)==null?void 0:a.logger)!=null&&u.forward)return e.services.logger.forward(i,"warn","react-i18next::",!0);C(i[0])&&(i[0]=`react-i18next:: ${i[0]}`),(v=(g=e==null?void 0:e.services)==null?void 0:g.logger)!=null&&v.warn?e.services.logger.warn(...i):console!=null&&console.warn&&console.warn(...i)},O={},B=(e,n,t,l)=>{C(t)&&O[t]||(C(t)&&(O[t]=new Date),q(e,n,t,l))},H=(e,n)=>()=>{if(e.isInitialized)n();else{const t=()=>{setTimeout(()=>{e.off("initialized",t)},0),n()};e.on("initialized",t)}},P=(e,n,t)=>{e.loadNamespaces(n,H(e,t))},$=(e,n,t,l)=>{if(C(t)&&(t=[t]),e.options.preload&&e.options.preload.indexOf(n)>-1)return P(e,t,l);t.forEach(i=>{e.options.ns.indexOf(i)<0&&e.options.ns.push(i)}),e.loadLanguages(n,H(e,l))},J=(e,n,t={})=>!n.languages||!n.languages.length?(B(n,"NO_LANGUAGES","i18n.languages were undefined or empty",{languages:n.languages}),!0):n.hasLoadedNamespace(e,{lng:t.lng,precheck:(l,i)=>{var a;if(((a=t.bindI18n)==null?void 0:a.indexOf("languageChanging"))>-1&&l.services.backendConnector.backend&&l.isLanguageChangingTo&&!i(l.isLanguageChangingTo,e))return!1}}),C=e=>typeof e=="string",K=e=>typeof e=="object"&&e!==null,Q=/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,Z={"&amp;":"&","&#38;":"&","&lt;":"<","&#60;":"<","&gt;":">","&#62;":">","&apos;":"'","&#39;":"'","&quot;":'"',"&#34;":'"',"&nbsp;":" ","&#160;":" ","&copy;":"©","&#169;":"©","&reg;":"®","&#174;":"®","&hellip;":"…","&#8230;":"…","&#x2F;":"/","&#47;":"/"},V=e=>Z[e],ee=e=>e.replace(Q,V);let re={bindI18n:"languageChanged",bindI18nStore:"",transEmptyNodeValue:"",transSupportBasicHtmlNodes:!0,transWrapTextNodes:"",transKeepBasicHtmlNodesFor:["br","strong","i","p"],useSuspense:!0,unescape:ee};const oe=()=>re;let te;const ae=()=>te,ne=d.createContext();class se{constructor(){this.usedNamespaces={}}addUsedNamespaces(n){n.forEach(t=>{this.usedNamespaces[t]||(this.usedNamespaces[t]=!0)})}getUsedNamespaces(){return Object.keys(this.usedNamespaces)}}const ie=(e,n)=>{const t=d.useRef();return d.useEffect(()=>{t.current=n?t.current:e},[e,n]),t.current},U=(e,n,t,l)=>e.getFixedT(n,t,l),le=(e,n,t,l)=>d.useCallback(U(e,n,t,l),[e,n,t,l]),ce=(e,n={})=>{var I,D,R,M;const{i18n:t}=n,{i18n:l,defaultNS:i}=d.useContext(ne)||{},a=t||l||ae();if(a&&!a.reportNamespaces&&(a.reportNamespaces=new se),!a){B(a,"NO_I18NEXT_INSTANCE","useTranslation: You will need to pass in an i18next instance by using initReactI18next");const m=(b,y)=>C(y)?y:K(y)&&C(y.defaultValue)?y.defaultValue:Array.isArray(b)?b[b.length-1]:b,x=[m,{},!1];return x.t=m,x.i18n={},x.ready=!1,x}(I=a.options.react)!=null&&I.wait&&B(a,"DEPRECATED_OPTION","useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");const u={...oe(),...a.options.react,...n},{useSuspense:g,keyPrefix:v}=u;let c=e||i||((D=a.options)==null?void 0:D.defaultNS);c=C(c)?[c]:c||["translation"],(M=(R=a.reportNamespaces).addUsedNamespaces)==null||M.call(R,c);const h=(a.isInitialized||a.initializedStoreOnce)&&c.every(m=>J(m,a,u)),N=le(a,n.lng||null,u.nsMode==="fallback"?c:c[0],v),S=()=>N,o=()=>U(a,n.lng||null,u.nsMode==="fallback"?c:c[0],v),[p,f]=d.useState(S);let F=c.join();n.lng&&(F=`${n.lng}${F}`);const z=ie(F),j=d.useRef(!0);d.useEffect(()=>{const{bindI18n:m,bindI18nStore:x}=u;j.current=!0,!h&&!g&&(n.lng?$(a,n.lng,c,()=>{j.current&&f(o)}):P(a,c,()=>{j.current&&f(o)})),h&&z&&z!==F&&j.current&&f(o);const b=()=>{j.current&&f(o)};return m&&(a==null||a.on(m,b)),x&&(a==null||a.store.on(x,b)),()=>{j.current=!1,a&&(m==null||m.split(" ").forEach(y=>a.off(y,b))),x&&a&&x.split(" ").forEach(y=>a.store.off(y,b))}},[a,F]),d.useEffect(()=>{j.current&&h&&f(S)},[a,v,h]);const k=[p,a,h];if(k.t=p,k.i18n=a,k.ready=h,h||!h&&!g)return k;throw new Promise(m=>{n.lng?$(a,n.lng,c,()=>m()):P(a,c,()=>m())})},de=s.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`,me=s.h3`
  margin-bottom: 1rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .title-icon {
    color: var(--primary-color);
  }
`,ue=s.p`
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
`,ge=s.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,pe=s.div`
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  transition: var(--transition-base);
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-md);
  }
  
  ${e=>e.selected&&`
    box-shadow: 0 0 0 3px var(--primary-color);
  `}
  
  &::after {
    content: '✓';
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 24px;
    height: 24px;
    background-color: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: ${e=>e.selected?"flex":"none"};
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
  }
`,A=s.div`
  height: 25px;
  width: 100%;
  background-color: ${e=>e.color};
`,he=s.div`
  padding: 0.75rem;
  background-color: white;
  font-weight: 500;
  color: var(--gray-700);
  text-align: center;
  font-size: 0.9rem;
`,fe=s.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
`,xe=s.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`,T=s.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,w=s.div`
  flex: 1;
  min-width: 200px;
  
  label {
    display: block;
    font-size: 0.9rem;
    color: var(--gray-700);
    margin-bottom: 0.5rem;
  }
  
  input[type="color"] {
    width: 100%;
    height: 40px;
    border: 1px solid var(--gray-300);
    border-radius: var(--border-radius-sm);
    padding: 2px;
    cursor: pointer;
    
    &::-webkit-color-swatch-wrapper {
      padding: 0;
    }
    
    &::-webkit-color-swatch {
      border: none;
      border-radius: var(--border-radius-sm);
    }
  }
`,be=s.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`,G=s.button`
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`,ye=s(G)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`,ve=s(G)`
  background-color: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  
  &:hover:not(:disabled) {
    background-color: var(--gray-100);
  }
`,we=s.div`
  margin-top: 2rem;
`,je=s.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`,Ce=s.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`,Fe=s.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  border: 2px solid ${e=>e.selected?"var(--primary-color)":"var(--gray-200)"};
  background: white;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    border-color: var(--primary-light);
    transform: translateY(-3px);
  }
  
  .mood-emoji {
    font-size: 2rem;
  }
  
  .mood-label {
    font-size: 0.9rem;
    color: var(--gray-700);
    font-weight: 500;
  }
`,E=[{id:"ocean",name:"Ocean Calm",description:"Serene blues and teals that evoke calm ocean vibes",colors:{primary:"#4A90E2",secondary:"#50E3C2",tertiary:"#F8E71C",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#F5F8FA",text:"#4A4A4A"}},{id:"lavender",name:"Lavender Fields",description:"Relaxing purples and lavenders for a soothing experience",colors:{primary:"#9B51E0",secondary:"#BD10E0",tertiary:"#E5ACF9",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#F8F7FC",text:"#3E236E"}},{id:"sunset",name:"Sunset Glow",description:"Warm oranges, pinks and purples that evoke a peaceful sunset",colors:{primary:"#FF9500",secondary:"#FF2D55",tertiary:"#5856D6",success:"#4CD964",info:"#34AADC",warning:"#FF9500",danger:"#FF3B30",background:"#FFF9F5",text:"#4A4A4A"}},{id:"forest",name:"Forest Retreat",description:"Earthy greens and browns for a natural, grounded feeling",colors:{primary:"#2E7D32",secondary:"#8BC34A",tertiary:"#FFC107",success:"#4CAF50",info:"#B2EBF2",warning:"#FFB300",danger:"#F44336",background:"#F1F8E9",text:"#33691E"}},{id:"moonlight",name:"Moonlight",description:"Dark blues and purples with silver accents for a calm night feeling",colors:{primary:"#3F51B5",secondary:"#7986CB",tertiary:"#E1BEE7",success:"#69F0AE",info:"#80D8FF",warning:"#FFD180",danger:"#FF5252",background:"#E8EAF6",text:"#1A237E"}},{id:"custom",name:"Custom",description:"Create your own custom color palette",colors:{primary:"#4A90E2",secondary:"#50E3C2",tertiary:"#F8E71C",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#FFFFFF",text:"#4A4A4A"}}],L=[{id:"calm",label:"Calm",emoji:"😌",paletteId:"ocean"},{id:"happy",label:"Happy",emoji:"😊",paletteId:"sunset"},{id:"focused",label:"Focused",emoji:"🧠",paletteId:"moonlight"},{id:"energized",label:"Energized",emoji:"⚡",paletteId:"lavender"},{id:"relaxed",label:"Relaxed",emoji:"🍃",paletteId:"forest"}],ke=({onSave:e,initialPalette:n="ocean"})=>{const[t,l]=d.useState(n),[i,a]=d.useState({...E.find(o=>o.id==="custom").colors}),[u,g]=d.useState(null);d.useEffect(()=>{if(t!=="custom"){const o=E.find(p=>p.id===t);a({...o.colors})}},[t]);const v=o=>{l(o),g(null)},c=(o,p)=>{a(f=>({...f,[o]:p})),t!=="custom"&&l("custom")},h=o=>{g(o);const p=L.find(f=>f.id===o);p&&l(p.paletteId)},N=()=>{const o=t==="custom"?{id:"custom",name:"Custom",colors:i}:E.find(p=>p.id===t);e(o)},S=()=>{l("ocean"),a({...E.find(o=>o.id==="custom").colors}),g(null)};return r.jsxs(de,{children:[r.jsxs(me,{children:[r.jsx("span",{className:"title-icon",children:"🎨"}),"Customize Color Palette"]}),r.jsx(ue,{children:"Choose a calming color palette that matches your mood, or create your own custom palette."}),r.jsxs(we,{children:[r.jsx(je,{children:"How are you feeling today?"}),r.jsx(Ce,{children:L.map(o=>r.jsxs(Fe,{selected:u===o.id,onClick:()=>h(o.id),children:[r.jsx("span",{className:"mood-emoji",children:o.emoji}),r.jsx("span",{className:"mood-label",children:o.label})]},o.id))})]}),r.jsx(ge,{children:E.map(o=>r.jsxs(pe,{selected:t===o.id,onClick:()=>v(o.id),title:o.description,children:[r.jsx(A,{color:o.colors.primary}),r.jsx(A,{color:o.colors.secondary}),r.jsx(A,{color:o.colors.tertiary}),r.jsx(he,{children:o.name})]},o.id))}),t==="custom"&&r.jsxs(fe,{children:[r.jsx(xe,{children:"Customize Your Palette"}),r.jsxs(T,{children:[r.jsxs(w,{children:[r.jsx("label",{htmlFor:"primary-color",children:"Primary Color"}),r.jsx("input",{id:"primary-color",type:"color",value:i.primary,onChange:o=>c("primary",o.target.value)})]}),r.jsxs(w,{children:[r.jsx("label",{htmlFor:"secondary-color",children:"Secondary Color"}),r.jsx("input",{id:"secondary-color",type:"color",value:i.secondary,onChange:o=>c("secondary",o.target.value)})]}),r.jsxs(w,{children:[r.jsx("label",{htmlFor:"tertiary-color",children:"Tertiary Color"}),r.jsx("input",{id:"tertiary-color",type:"color",value:i.tertiary,onChange:o=>c("tertiary",o.target.value)})]})]}),r.jsxs(T,{children:[r.jsxs(w,{children:[r.jsx("label",{htmlFor:"success-color",children:"Success Color"}),r.jsx("input",{id:"success-color",type:"color",value:i.success,onChange:o=>c("success",o.target.value)})]}),r.jsxs(w,{children:[r.jsx("label",{htmlFor:"warning-color",children:"Warning Color"}),r.jsx("input",{id:"warning-color",type:"color",value:i.warning,onChange:o=>c("warning",o.target.value)})]}),r.jsxs(w,{children:[r.jsx("label",{htmlFor:"danger-color",children:"Danger Color"}),r.jsx("input",{id:"danger-color",type:"color",value:i.danger,onChange:o=>c("danger",o.target.value)})]})]}),r.jsxs(T,{children:[r.jsxs(w,{children:[r.jsx("label",{htmlFor:"background-color",children:"Background Color"}),r.jsx("input",{id:"background-color",type:"color",value:i.background,onChange:o=>c("background",o.target.value)})]}),r.jsxs(w,{children:[r.jsx("label",{htmlFor:"text-color",children:"Text Color"}),r.jsx("input",{id:"text-color",type:"color",value:i.text,onChange:o=>c("text",o.target.value)})]})]})]}),r.jsxs(be,{children:[r.jsx(ve,{onClick:S,children:"Reset to Default"}),r.jsx(ye,{onClick:N,children:"Apply Colors"})]})]})},Ee=s.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`,Se=({children:e})=>r.jsx(Ee,{children:e}),Ne=s.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`,Ae=s.button`
  background: transparent;
  border: none;
  color: var(--primary-color);
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: var(--transition-base);
  padding: 0.5rem;
  
  &:hover {
    color: var(--primary-dark);
    transform: translateX(-3px);
  }
`,Te=s.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
`;s.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;const Be=s.div`
  background-color: var(--info-light, rgba(184, 233, 134, 0.3));
  border-radius: var(--border-radius-md);
  padding: 1.25rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  
  .info-icon {
    color: var(--info-color);
    font-size: 1.25rem;
    margin-top: 0.25rem;
  }
  
  .info-content {
    flex: 1;
    
    h4 {
      font-weight: 600;
      color: var(--gray-800);
      margin-top: 0;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: var(--gray-700);
      margin: 0;
      line-height: 1.5;
      font-size: 0.95rem;
    }
  }
`,Pe=s.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--success-color);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  display: ${e=>e.visible?"block":"none"};
  animation: fadeInUp 0.3s ease-out;
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translate(-50%, 20px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`,De=()=>{const{t:e}=ce(),n=W(),{colorPalette:t,setTheme:l}=Y(),[i,a]=d.useState(!1),u=g=>{l(g),a(!0),setTimeout(()=>{a(!1)},3e3)};return r.jsxs(Se,{children:[r.jsxs(Ne,{children:[r.jsx(Ae,{onClick:()=>n(-1),"aria-label":e("navigation.back"),children:r.jsx(_,{})}),r.jsx(Te,{children:e("theme.settings")})]}),r.jsxs(Be,{children:[r.jsx("div",{className:"info-icon",children:r.jsx(X,{})}),r.jsxs("div",{className:"info-content",children:[r.jsx("h4",{children:e("theme.howItWorks")}),r.jsx("p",{children:e("theme.colorPaletteDescription")})]})]}),r.jsx(ke,{onSave:u,initialPalette:t.id}),r.jsx(Pe,{visible:i,children:e("theme.paletteApplied")})]})};export{De as default};
//# sourceMappingURL=ThemeSettings-81f7009b.js.map
