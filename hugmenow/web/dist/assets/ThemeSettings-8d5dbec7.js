import{d as a,r as b,j as e,B as p,a as z,f as D}from"./main-f424badd.js";import{u as T}from"./useTranslation-ae14bfda.js";const I=a.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`,O=a.h3`
  margin-bottom: 1rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .title-icon {
    color: var(--primary-color);
  }
`,N=a.p`
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
`,M=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,R=a.div`
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
  
  ${r=>r.selected&&`
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
    display: ${r=>r.selected?"flex":"none"};
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
  }
`,y=a.div`
  height: 25px;
  width: 100%;
  background-color: ${r=>r.color};
`,_=a.div`
  padding: 0.75rem;
  background-color: white;
  font-weight: 500;
  color: var(--gray-700);
  text-align: center;
  font-size: 0.9rem;
`,$=a.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
`,L=a.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`,j=a.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,u=a.div`
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
`,W=a.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`,F=a.button`
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
`,Y=a(F)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`,G=a(F)`
  background-color: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  
  &:hover:not(:disabled) {
    background-color: var(--gray-100);
  }
`,H=a.div`
  margin-top: 2rem;
`,U=a.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`,X=a.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`,q=a.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  border: 2px solid ${r=>r.selected?"var(--primary-color)":"var(--gray-200)"};
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
`,v=[{id:"ocean",name:"Ocean Calm",description:"Serene blues and teals that evoke calm ocean vibes",colors:{primary:"#4A90E2",secondary:"#50E3C2",tertiary:"#F8E71C",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#F5F8FA",text:"#4A4A4A"}},{id:"lavender",name:"Lavender Fields",description:"Relaxing purples and lavenders for a soothing experience",colors:{primary:"#9B51E0",secondary:"#BD10E0",tertiary:"#E5ACF9",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#F8F7FC",text:"#3E236E"}},{id:"sunset",name:"Sunset Glow",description:"Warm oranges, pinks and purples that evoke a peaceful sunset",colors:{primary:"#FF9500",secondary:"#FF2D55",tertiary:"#5856D6",success:"#4CD964",info:"#34AADC",warning:"#FF9500",danger:"#FF3B30",background:"#FFF9F5",text:"#4A4A4A"}},{id:"forest",name:"Forest Retreat",description:"Earthy greens and browns for a natural, grounded feeling",colors:{primary:"#2E7D32",secondary:"#8BC34A",tertiary:"#FFC107",success:"#4CAF50",info:"#B2EBF2",warning:"#FFB300",danger:"#F44336",background:"#F1F8E9",text:"#33691E"}},{id:"moonlight",name:"Moonlight",description:"Dark blues and purples with silver accents for a calm night feeling",colors:{primary:"#3F51B5",secondary:"#7986CB",tertiary:"#E1BEE7",success:"#69F0AE",info:"#80D8FF",warning:"#FFD180",danger:"#FF5252",background:"#E8EAF6",text:"#1A237E"}},{id:"custom",name:"Custom",description:"Create your own custom color palette",colors:{primary:"#4A90E2",secondary:"#50E3C2",tertiary:"#F8E71C",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#FFFFFF",text:"#4A4A4A"}}],w=[{id:"calm",label:"Calm",emoji:"😌",paletteId:"ocean"},{id:"happy",label:"Happy",emoji:"😊",paletteId:"sunset"},{id:"focused",label:"Focused",emoji:"🧠",paletteId:"moonlight"},{id:"energized",label:"Energized",emoji:"⚡",paletteId:"lavender"},{id:"relaxed",label:"Relaxed",emoji:"🍃",paletteId:"forest"}],J=({onSave:r,initialPalette:s="ocean"})=>{const[t,i]=b.useState(s),[n,l]=b.useState({...v.find(o=>o.id==="custom").colors}),[x,c]=b.useState(null);b.useEffect(()=>{if(t!=="custom"){const o=v.find(m=>m.id===t);l({...o.colors})}},[t]);const h=o=>{i(o),c(null)},d=(o,m)=>{l(f=>({...f,[o]:m})),t!=="custom"&&i("custom")},B=o=>{c(o);const m=w.find(f=>f.id===o);m&&i(m.paletteId)},A=()=>{const o=t==="custom"?{id:"custom",name:"Custom",colors:n}:v.find(m=>m.id===t);r(o)},P=()=>{i("ocean"),l({...v.find(o=>o.id==="custom").colors}),c(null)};return e.jsxs(I,{children:[e.jsxs(O,{children:[e.jsx("span",{className:"title-icon",children:"🎨"}),"Customize Color Palette"]}),e.jsx(N,{children:"Choose a calming color palette that matches your mood, or create your own custom palette."}),e.jsxs(H,{children:[e.jsx(U,{children:"How are you feeling today?"}),e.jsx(X,{children:w.map(o=>e.jsxs(q,{selected:x===o.id,onClick:()=>B(o.id),children:[e.jsx("span",{className:"mood-emoji",children:o.emoji}),e.jsx("span",{className:"mood-label",children:o.label})]},o.id))})]}),e.jsx(M,{children:v.map(o=>e.jsxs(R,{selected:t===o.id,onClick:()=>h(o.id),title:o.description,children:[e.jsx(y,{color:o.colors.primary}),e.jsx(y,{color:o.colors.secondary}),e.jsx(y,{color:o.colors.tertiary}),e.jsx(_,{children:o.name})]},o.id))}),t==="custom"&&e.jsxs($,{children:[e.jsx(L,{children:"Customize Your Palette"}),e.jsxs(j,{children:[e.jsxs(u,{children:[e.jsx("label",{htmlFor:"primary-color",children:"Primary Color"}),e.jsx("input",{id:"primary-color",type:"color",value:n.primary,onChange:o=>d("primary",o.target.value)})]}),e.jsxs(u,{children:[e.jsx("label",{htmlFor:"secondary-color",children:"Secondary Color"}),e.jsx("input",{id:"secondary-color",type:"color",value:n.secondary,onChange:o=>d("secondary",o.target.value)})]}),e.jsxs(u,{children:[e.jsx("label",{htmlFor:"tertiary-color",children:"Tertiary Color"}),e.jsx("input",{id:"tertiary-color",type:"color",value:n.tertiary,onChange:o=>d("tertiary",o.target.value)})]})]}),e.jsxs(j,{children:[e.jsxs(u,{children:[e.jsx("label",{htmlFor:"success-color",children:"Success Color"}),e.jsx("input",{id:"success-color",type:"color",value:n.success,onChange:o=>d("success",o.target.value)})]}),e.jsxs(u,{children:[e.jsx("label",{htmlFor:"warning-color",children:"Warning Color"}),e.jsx("input",{id:"warning-color",type:"color",value:n.warning,onChange:o=>d("warning",o.target.value)})]}),e.jsxs(u,{children:[e.jsx("label",{htmlFor:"danger-color",children:"Danger Color"}),e.jsx("input",{id:"danger-color",type:"color",value:n.danger,onChange:o=>d("danger",o.target.value)})]})]}),e.jsxs(j,{children:[e.jsxs(u,{children:[e.jsx("label",{htmlFor:"background-color",children:"Background Color"}),e.jsx("input",{id:"background-color",type:"color",value:n.background,onChange:o=>d("background",o.target.value)})]}),e.jsxs(u,{children:[e.jsx("label",{htmlFor:"text-color",children:"Text Color"}),e.jsx("input",{id:"text-color",type:"color",value:n.text,onChange:o=>d("text",o.target.value)})]})]})]}),e.jsxs(W,{children:[e.jsx(G,{onClick:P,children:"Reset to Default"}),e.jsx(Y,{onClick:A,children:"Apply Colors"})]})]})},K=a.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`,Q=({children:r})=>e.jsx(K,{children:r});var k={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},C=p.createContext&&p.createContext(k),g=globalThis&&globalThis.__assign||function(){return g=Object.assign||function(r){for(var s,t=1,i=arguments.length;t<i;t++){s=arguments[t];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(r[n]=s[n])}return r},g.apply(this,arguments)},V=globalThis&&globalThis.__rest||function(r,s){var t={};for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&s.indexOf(i)<0&&(t[i]=r[i]);if(r!=null&&typeof Object.getOwnPropertySymbols=="function")for(var n=0,i=Object.getOwnPropertySymbols(r);n<i.length;n++)s.indexOf(i[n])<0&&Object.prototype.propertyIsEnumerable.call(r,i[n])&&(t[i[n]]=r[i[n]]);return t};function E(r){return r&&r.map(function(s,t){return p.createElement(s.tag,g({key:t},s.attr),E(s.child))})}function S(r){return function(s){return p.createElement(Z,g({attr:g({},r.attr)},s),E(r.child))}}function Z(r){var s=function(t){var i=r.attr,n=r.size,l=r.title,x=V(r,["attr","size","title"]),c=n||t.size||"1em",h;return t.className&&(h=t.className),r.className&&(h=(h?h+" ":"")+r.className),p.createElement("svg",g({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},t.attr,i,x,{className:h,style:g(g({color:r.color||t.color},t.style),r.style),height:c,width:c,xmlns:"http://www.w3.org/2000/svg"}),l&&p.createElement("title",null,l),r.children)};return C!==void 0?p.createElement(C.Consumer,null,function(t){return s(t)}):s(k)}function ee(r){return S({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"polyline",attr:{points:"15 18 9 12 15 6"}}]})(r)}function re(r){return S({tag:"svg",attr:{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"},child:[{tag:"circle",attr:{cx:"12",cy:"12",r:"10"}},{tag:"line",attr:{x1:"12",y1:"16",x2:"12",y2:"12"}},{tag:"line",attr:{x1:"12",y1:"8",x2:"12.01",y2:"8"}}]})(r)}const oe=a.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`,te=a.button`
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
`,ae=a.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
`;a.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;const ne=a.div`
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
`,ie=a.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--success-color);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  display: ${r=>r.visible?"block":"none"};
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
`,ce=()=>{const{t:r}=T(),s=z(),{colorPalette:t,setTheme:i}=D(),[n,l]=b.useState(!1),x=c=>{i(c),l(!0),setTimeout(()=>{l(!1)},3e3)};return e.jsxs(Q,{children:[e.jsxs(oe,{children:[e.jsx(te,{onClick:()=>s(-1),"aria-label":r("navigation.back"),children:e.jsx(ee,{})}),e.jsx(ae,{children:r("theme.settings")})]}),e.jsxs(ne,{children:[e.jsx("div",{className:"info-icon",children:e.jsx(re,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx("h4",{children:r("theme.howItWorks")}),e.jsx("p",{children:r("theme.colorPaletteDescription")})]})]}),e.jsx(J,{onSave:x,initialPalette:t.id}),e.jsx(ie,{visible:n,children:r("theme.paletteApplied")})]})};export{ce as default};
//# sourceMappingURL=ThemeSettings-8d5dbec7.js.map
