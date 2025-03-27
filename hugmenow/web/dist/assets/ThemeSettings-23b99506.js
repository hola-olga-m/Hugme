import{r as g,d as l,j as t,B as F,a as K,e as Q}from"./main-cf2c803f.js";const Z=(e,o,r,s)=>{var n,d,u,m;const i=[r,{code:o,...s||{}}];if((d=(n=e==null?void 0:e.services)==null?void 0:n.logger)!=null&&d.forward)return e.services.logger.forward(i,"warn","react-i18next::",!0);k(i[0])&&(i[0]=`react-i18next:: ${i[0]}`),(m=(u=e==null?void 0:e.services)==null?void 0:u.logger)!=null&&m.warn?e.services.logger.warn(...i):console!=null&&console.warn&&console.warn(...i)},_={},P=(e,o,r,s)=>{k(r)&&_[r]||(k(r)&&(_[r]=new Date),Z(e,o,r,s))},G=(e,o)=>()=>{if(e.isInitialized)o();else{const r=()=>{setTimeout(()=>{e.off("initialized",r)},0),o()};e.on("initialized",r)}},I=(e,o,r)=>{e.loadNamespaces(o,G(e,r))},$=(e,o,r,s)=>{if(k(r)&&(r=[r]),e.options.preload&&e.options.preload.indexOf(o)>-1)return I(e,r,s);r.forEach(i=>{e.options.ns.indexOf(i)<0&&e.options.ns.push(i)}),e.loadLanguages(o,G(e,s))},V=(e,o,r={})=>!o.languages||!o.languages.length?(P(o,"NO_LANGUAGES","i18n.languages were undefined or empty",{languages:o.languages}),!0):o.hasLoadedNamespace(e,{lng:r.lng,precheck:(s,i)=>{var n;if(((n=r.bindI18n)==null?void 0:n.indexOf("languageChanging"))>-1&&s.services.backendConnector.backend&&s.isLanguageChangingTo&&!i(s.isLanguageChangingTo,e))return!1}}),k=e=>typeof e=="string",ee=e=>typeof e=="object"&&e!==null,re=/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,te={"&amp;":"&","&#38;":"&","&lt;":"<","&#60;":"<","&gt;":">","&#62;":">","&apos;":"'","&#39;":"'","&quot;":'"',"&#34;":'"',"&nbsp;":" ","&#160;":" ","&copy;":"©","&#169;":"©","&reg;":"®","&#174;":"®","&hellip;":"…","&#8230;":"…","&#x2F;":"/","&#47;":"/"},oe=e=>te[e],ae=e=>e.replace(re,oe);let ne={bindI18n:"languageChanged",bindI18nStore:"",transEmptyNodeValue:"",transSupportBasicHtmlNodes:!0,transWrapTextNodes:"",transKeepBasicHtmlNodesFor:["br","strong","i","p"],useSuspense:!0,unescape:ae};const se=()=>ne;let ie;const le=()=>ie,ce=g.createContext();class de{constructor(){this.usedNamespaces={}}addUsedNamespaces(o){o.forEach(r=>{this.usedNamespaces[r]||(this.usedNamespaces[r]=!0)})}getUsedNamespaces(){return Object.keys(this.usedNamespaces)}}const ue=(e,o)=>{const r=g.useRef();return g.useEffect(()=>{r.current=o?r.current:e},[e,o]),r.current},U=(e,o,r,s)=>e.getFixedT(o,r,s),me=(e,o,r,s)=>g.useCallback(U(e,o,r,s),[e,o,r,s]),ge=(e,o={})=>{var D,R,M,L;const{i18n:r}=o,{i18n:s,defaultNS:i}=g.useContext(ce)||{},n=r||s||le();if(n&&!n.reportNamespaces&&(n.reportNamespaces=new de),!n){P(n,"NO_I18NEXT_INSTANCE","useTranslation: You will need to pass in an i18next instance by using initReactI18next");const p=(y,v)=>k(v)?v:ee(v)&&k(v.defaultValue)?v.defaultValue:Array.isArray(y)?y[y.length-1]:y,b=[p,{},!1];return b.t=p,b.i18n={},b.ready=!1,b}(D=n.options.react)!=null&&D.wait&&P(n,"DEPRECATED_OPTION","useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");const d={...se(),...n.options.react,...o},{useSuspense:u,keyPrefix:m}=d;let c=e||i||((R=n.options)==null?void 0:R.defaultNS);c=k(c)?[c]:c||["translation"],(L=(M=n.reportNamespaces).addUsedNamespaces)==null||L.call(M,c);const f=(n.isInitialized||n.initializedStoreOnce)&&c.every(p=>V(p,n,d)),A=me(n,o.lng||null,d.nsMode==="fallback"?c:c[0],m),T=()=>A,a=()=>U(n,o.lng||null,d.nsMode==="fallback"?c:c[0],m),[h,x]=g.useState(T);let E=c.join();o.lng&&(E=`${o.lng}${E}`);const O=ue(E),C=g.useRef(!0);g.useEffect(()=>{const{bindI18n:p,bindI18nStore:b}=d;C.current=!0,!f&&!u&&(o.lng?$(n,o.lng,c,()=>{C.current&&x(a)}):I(n,c,()=>{C.current&&x(a)})),f&&O&&O!==E&&C.current&&x(a);const y=()=>{C.current&&x(a)};return p&&(n==null||n.on(p,y)),b&&(n==null||n.store.on(b,y)),()=>{C.current=!1,n&&(p==null||p.split(" ").forEach(v=>n.off(v,y))),b&&n&&b.split(" ").forEach(v=>n.store.off(v,y))}},[n,E]),g.useEffect(()=>{C.current&&f&&x(T)},[n,m,f]);const N=[h,n,f];if(N.t=h,N.i18n=n,N.ready=f,f||!f&&!u)return N;throw new Promise(p=>{o.lng?$(n,o.lng,c,()=>p()):I(n,c,()=>p())})},pe=l.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`,he=l.h3`
  margin-bottom: 1rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .title-icon {
    color: var(--primary-color);
  }
`,fe=l.p`
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
`,xe=l.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,be=l.div`
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
`,B=l.div`
  height: 25px;
  width: 100%;
  background-color: ${e=>e.color};
`,ye=l.div`
  padding: 0.75rem;
  background-color: white;
  font-weight: 500;
  color: var(--gray-700);
  text-align: center;
  font-size: 0.9rem;
`,ve=l.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
`,we=l.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`,z=l.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,w=l.div`
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
`,je=l.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`,Y=l.button`
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
`,Ce=l(Y)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`,Fe=l(Y)`
  background-color: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  
  &:hover:not(:disabled) {
    background-color: var(--gray-100);
  }
`,ke=l.div`
  margin-top: 2rem;
`,Ee=l.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`,Ne=l.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`,Se=l.button`
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
`,S=[{id:"ocean",name:"Ocean Calm",description:"Serene blues and teals that evoke calm ocean vibes",colors:{primary:"#4A90E2",secondary:"#50E3C2",tertiary:"#F8E71C",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#F5F8FA",text:"#4A4A4A"}},{id:"lavender",name:"Lavender Fields",description:"Relaxing purples and lavenders for a soothing experience",colors:{primary:"#9B51E0",secondary:"#BD10E0",tertiary:"#E5ACF9",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#F8F7FC",text:"#3E236E"}},{id:"sunset",name:"Sunset Glow",description:"Warm oranges, pinks and purples that evoke a peaceful sunset",colors:{primary:"#FF9500",secondary:"#FF2D55",tertiary:"#5856D6",success:"#4CD964",info:"#34AADC",warning:"#FF9500",danger:"#FF3B30",background:"#FFF9F5",text:"#4A4A4A"}},{id:"forest",name:"Forest Retreat",description:"Earthy greens and browns for a natural, grounded feeling",colors:{primary:"#2E7D32",secondary:"#8BC34A",tertiary:"#FFC107",success:"#4CAF50",info:"#B2EBF2",warning:"#FFB300",danger:"#F44336",background:"#F1F8E9",text:"#33691E"}},{id:"moonlight",name:"Moonlight",description:"Dark blues and purples with silver accents for a calm night feeling",colors:{primary:"#3F51B5",secondary:"#7986CB",tertiary:"#E1BEE7",success:"#69F0AE",info:"#80D8FF",warning:"#FFD180",danger:"#FF5252",background:"#E8EAF6",text:"#1A237E"}},{id:"custom",name:"Custom",description:"Create your own custom color palette",colors:{primary:"#4A90E2",secondary:"#50E3C2",tertiary:"#F8E71C",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#FFFFFF",text:"#4A4A4A"}}],W=[{id:"calm",label:"Calm",emoji:"😌",paletteId:"ocean"},{id:"happy",label:"Happy",emoji:"😊",paletteId:"sunset"},{id:"focused",label:"Focused",emoji:"🧠",paletteId:"moonlight"},{id:"energized",label:"Energized",emoji:"⚡",paletteId:"lavender"},{id:"relaxed",label:"Relaxed",emoji:"🍃",paletteId:"forest"}],Te=({onSave:e,initialPalette:o="ocean"})=>{const[r,s]=g.useState(o),[i,n]=g.useState({...S.find(a=>a.id==="custom").colors}),[d,u]=g.useState(null);g.useEffect(()=>{if(r!=="custom"){const a=S.find(h=>h.id===r);n({...a.colors})}},[r]);const m=a=>{s(a),u(null)},c=(a,h)=>{n(x=>({...x,[a]:h})),r!=="custom"&&s("custom")},f=a=>{u(a);const h=W.find(x=>x.id===a);h&&s(h.paletteId)},A=()=>{const a=r==="custom"?{id:"custom",name:"Custom",colors:i}:S.find(h=>h.id===r);e(a)},T=()=>{s("ocean"),n({...S.find(a=>a.id==="custom").colors}),u(null)};return t.jsxs(pe,{children:[t.jsxs(he,{children:[t.jsx("span",{className:"title-icon",children:"🎨"}),"Customize Color Palette"]}),t.jsx(fe,{children:"Choose a calming color palette that matches your mood, or create your own custom palette."}),t.jsxs(ke,{children:[t.jsx(Ee,{children:"How are you feeling today?"}),t.jsx(Ne,{children:W.map(a=>t.jsxs(Se,{selected:d===a.id,onClick:()=>f(a.id),children:[t.jsx("span",{className:"mood-emoji",children:a.emoji}),t.jsx("span",{className:"mood-label",children:a.label})]},a.id))})]}),t.jsx(xe,{children:S.map(a=>t.jsxs(be,{selected:r===a.id,onClick:()=>m(a.id),title:a.description,children:[t.jsx(B,{color:a.colors.primary}),t.jsx(B,{color:a.colors.secondary}),t.jsx(B,{color:a.colors.tertiary}),t.jsx(ye,{children:a.name})]},a.id))}),r==="custom"&&t.jsxs(ve,{children:[t.jsx(we,{children:"Customize Your Palette"}),t.jsxs(z,{children:[t.jsxs(w,{children:[t.jsx("label",{htmlFor:"primary-color",children:"Primary Color"}),t.jsx("input",{id:"primary-color",type:"color",value:i.primary,onChange:a=>c("primary",a.target.value)})]}),t.jsxs(w,{children:[t.jsx("label",{htmlFor:"secondary-color",children:"Secondary Color"}),t.jsx("input",{id:"secondary-color",type:"color",value:i.secondary,onChange:a=>c("secondary",a.target.value)})]}),t.jsxs(w,{children:[t.jsx("label",{htmlFor:"tertiary-color",children:"Tertiary Color"}),t.jsx("input",{id:"tertiary-color",type:"color",value:i.tertiary,onChange:a=>c("tertiary",a.target.value)})]})]}),t.jsxs(z,{children:[t.jsxs(w,{children:[t.jsx("label",{htmlFor:"success-color",children:"Success Color"}),t.jsx("input",{id:"success-color",type:"color",value:i.success,onChange:a=>c("success",a.target.value)})]}),t.jsxs(w,{children:[t.jsx("label",{htmlFor:"warning-color",children:"Warning Color"}),t.jsx("input",{id:"warning-color",type:"color",value:i.warning,onChange:a=>c("warning",a.target.value)})]}),t.jsxs(w,{children:[t.jsx("label",{htmlFor:"danger-color",children:"Danger Color"}),t.jsx("input",{id:"danger-color",type:"color",value:i.danger,onChange:a=>c("danger",a.target.value)})]})]}),t.jsxs(z,{children:[t.jsxs(w,{children:[t.jsx("label",{htmlFor:"background-color",children:"Background Color"}),t.jsx("input",{id:"background-color",type:"color",value:i.background,onChange:a=>c("background",a.target.value)})]}),t.jsxs(w,{children:[t.jsx("label",{htmlFor:"text-color",children:"Text Color"}),t.jsx("input",{id:"text-color",type:"color",value:i.text,onChange:a=>c("text",a.target.value)})]})]})]}),t.jsxs(je,{children:[t.jsx(Fe,{onClick:T,children:"Reset to Default"}),t.jsx(Ce,{onClick:A,children:"Apply Colors"})]})]})},Ae=l.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`,Be=({children:e})=>t.jsx(Ae,{children:e});var X={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},H=F.createContext&&F.createContext(X),j=globalThis&&globalThis.__assign||function(){return j=Object.assign||function(e){for(var o,r=1,s=arguments.length;r<s;r++){o=arguments[r];for(var i in o)Object.prototype.hasOwnProperty.call(o,i)&&(e[i]=o[i])}return e},j.apply(this,arguments)},ze=globalThis&&globalThis.__rest||function(e,o){var r={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&o.indexOf(s)<0&&(r[s]=e[s]);if(e!=null&&typeof Object.getOwnPropertySymbols=="function")for(var i=0,s=Object.getOwnPropertySymbols(e);i<s.length;i++)o.indexOf(s[i])<0&&Object.prototype.propertyIsEnumerable.call(e,s[i])&&(r[s[i]]=e[s[i]]);return r};function q(e){return e&&e.map(function(o,r){return F.createElement(o.tag,j({key:r},o.attr),q(o.child))})}function J(e){return function(o){return F.createElement(Pe,j({attr:j({},e.attr)},o),q(e.child))}}function Pe(e){var o=function(r){var s=e.attr,i=e.size,n=e.title,d=ze(e,["attr","size","title"]),u=i||r.size||"1em",m;return r.className&&(m=r.className),e.className&&(m=(m?m+" ":"")+e.className),F.createElement("svg",j({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,s,d,{className:m,style:j(j({color:e.color||r.color},r.style),e.style),height:u,width:u,xmlns:"http://www.w3.org/2000/svg"}),n&&F.createElement("title",null,n),e.children)};return H!==void 0?F.createElement(H.Consumer,null,function(r){return o(r)}):o(X)}function Ie(e){return J({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"15 18 9 12 15 6"}}]})(e)}function Oe(e){return J({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"10"}},{tag:"line",attr:{x1:"12",y1:"16",x2:"12",y2:"12"}},{tag:"line",attr:{x1:"12",y1:"8",x2:"12.01",y2:"8"}}]})(e)}const De=l.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`,Re=l.button`
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
`,Me=l.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
`;l.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;const Le=l.div`
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
`,_e=l.div`
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
`,We=()=>{const{t:e}=ge(),o=K(),{colorPalette:r,setTheme:s}=Q(),[i,n]=g.useState(!1),d=u=>{s(u),n(!0),setTimeout(()=>{n(!1)},3e3)};return t.jsxs(Be,{children:[t.jsxs(De,{children:[t.jsx(Re,{onClick:()=>o(-1),"aria-label":e("navigation.back"),children:t.jsx(Ie,{})}),t.jsx(Me,{children:e("theme.settings")})]}),t.jsxs(Le,{children:[t.jsx("div",{className:"info-icon",children:t.jsx(Oe,{})}),t.jsxs("div",{className:"info-content",children:[t.jsx("h4",{children:e("theme.howItWorks")}),t.jsx("p",{children:e("theme.colorPaletteDescription")})]})]}),t.jsx(Te,{onSave:d,initialPalette:r.id}),t.jsx(_e,{visible:i,children:e("theme.paletteApplied")})]})};export{We as default};
//# sourceMappingURL=ThemeSettings-23b99506.js.map
