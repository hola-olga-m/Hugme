import{d as o,r as p,j as e,a as k,c as E}from"./main-0012ce0c.js";import{m as S,n as A}from"./index.esm-6afec3ae.js";import{u as B}from"./useTranslation-03a0810f.js";const D=o.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`,P=o.h3`
  margin-bottom: 1rem;
  color: var(--gray-800);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .title-icon {
    color: var(--primary-color);
  }
`,z=o.p`
  color: var(--gray-600);
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
`,I=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,T=o.div`
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
  
  ${t=>t.selected&&`
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
    display: ${t=>t.selected?"flex":"none"};
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
  }
`,b=o.div`
  height: 25px;
  width: 100%;
  background-color: ${t=>t.color};
`,M=o.div`
  padding: 0.75rem;
  background-color: white;
  font-weight: 500;
  color: var(--gray-700);
  text-align: center;
  font-size: 0.9rem;
`,R=o.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-200);
`,N=o.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`,v=o.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,l=o.div`
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
`,$=o.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`,y=o.button`
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
`,Y=o(y)`
  background-color: var(--primary-color);
  color: white;
  border: none;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-dark);
  }
`,H=o(y)`
  background-color: transparent;
  color: var(--gray-700);
  border: 1px solid var(--gray-300);
  
  &:hover:not(:disabled) {
    background-color: var(--gray-100);
  }
`,O=o.div`
  margin-top: 2rem;
`,W=o.h4`
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 1rem;
`,G=o.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`,L=o.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: var(--border-radius-md);
  border: 2px solid ${t=>t.selected?"var(--primary-color)":"var(--gray-200)"};
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
`,g=[{id:"ocean",name:"Ocean Calm",description:"Serene blues and teals that evoke calm ocean vibes",colors:{primary:"#4A90E2",secondary:"#50E3C2",tertiary:"#F8E71C",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#F5F8FA",text:"#4A4A4A"}},{id:"lavender",name:"Lavender Fields",description:"Relaxing purples and lavenders for a soothing experience",colors:{primary:"#9B51E0",secondary:"#BD10E0",tertiary:"#E5ACF9",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#F8F7FC",text:"#3E236E"}},{id:"sunset",name:"Sunset Glow",description:"Warm oranges, pinks and purples that evoke a peaceful sunset",colors:{primary:"#FF9500",secondary:"#FF2D55",tertiary:"#5856D6",success:"#4CD964",info:"#34AADC",warning:"#FF9500",danger:"#FF3B30",background:"#FFF9F5",text:"#4A4A4A"}},{id:"forest",name:"Forest Retreat",description:"Earthy greens and browns for a natural, grounded feeling",colors:{primary:"#2E7D32",secondary:"#8BC34A",tertiary:"#FFC107",success:"#4CAF50",info:"#B2EBF2",warning:"#FFB300",danger:"#F44336",background:"#F1F8E9",text:"#33691E"}},{id:"moonlight",name:"Moonlight",description:"Dark blues and purples with silver accents for a calm night feeling",colors:{primary:"#3F51B5",secondary:"#7986CB",tertiary:"#E1BEE7",success:"#69F0AE",info:"#80D8FF",warning:"#FFD180",danger:"#FF5252",background:"#E8EAF6",text:"#1A237E"}},{id:"custom",name:"Custom",description:"Create your own custom color palette",colors:{primary:"#4A90E2",secondary:"#50E3C2",tertiary:"#F8E71C",success:"#7ED321",info:"#B8E986",warning:"#F5A623",danger:"#D0021B",background:"#FFFFFF",text:"#4A4A4A"}}],f=[{id:"calm",label:"Calm",emoji:"😌",paletteId:"ocean"},{id:"happy",label:"Happy",emoji:"😊",paletteId:"sunset"},{id:"focused",label:"Focused",emoji:"🧠",paletteId:"moonlight"},{id:"energized",label:"Energized",emoji:"⚡",paletteId:"lavender"},{id:"relaxed",label:"Relaxed",emoji:"🍃",paletteId:"forest"}],U=({onSave:t,initialPalette:h="ocean"})=>{const[n,d]=p.useState(h),[a,c]=p.useState({...g.find(r=>r.id==="custom").colors}),[u,m]=p.useState(null);p.useEffect(()=>{if(n!=="custom"){const r=g.find(s=>s.id===n);c({...r.colors})}},[n]);const j=r=>{d(r),m(null)},i=(r,s)=>{c(x=>({...x,[r]:s})),n!=="custom"&&d("custom")},w=r=>{m(r);const s=f.find(x=>x.id===r);s&&d(s.paletteId)},F=()=>{const r=n==="custom"?{id:"custom",name:"Custom",colors:a}:g.find(s=>s.id===n);t(r)},C=()=>{d("ocean"),c({...g.find(r=>r.id==="custom").colors}),m(null)};return e.jsxs(D,{children:[e.jsxs(P,{children:[e.jsx("span",{className:"title-icon",children:"🎨"}),"Customize Color Palette"]}),e.jsx(z,{children:"Choose a calming color palette that matches your mood, or create your own custom palette."}),e.jsxs(O,{children:[e.jsx(W,{children:"How are you feeling today?"}),e.jsx(G,{children:f.map(r=>e.jsxs(L,{selected:u===r.id,onClick:()=>w(r.id),children:[e.jsx("span",{className:"mood-emoji",children:r.emoji}),e.jsx("span",{className:"mood-label",children:r.label})]},r.id))})]}),e.jsx(I,{children:g.map(r=>e.jsxs(T,{selected:n===r.id,onClick:()=>j(r.id),title:r.description,children:[e.jsx(b,{color:r.colors.primary}),e.jsx(b,{color:r.colors.secondary}),e.jsx(b,{color:r.colors.tertiary}),e.jsx(M,{children:r.name})]},r.id))}),n==="custom"&&e.jsxs(R,{children:[e.jsx(N,{children:"Customize Your Palette"}),e.jsxs(v,{children:[e.jsxs(l,{children:[e.jsx("label",{htmlFor:"primary-color",children:"Primary Color"}),e.jsx("input",{id:"primary-color",type:"color",value:a.primary,onChange:r=>i("primary",r.target.value)})]}),e.jsxs(l,{children:[e.jsx("label",{htmlFor:"secondary-color",children:"Secondary Color"}),e.jsx("input",{id:"secondary-color",type:"color",value:a.secondary,onChange:r=>i("secondary",r.target.value)})]}),e.jsxs(l,{children:[e.jsx("label",{htmlFor:"tertiary-color",children:"Tertiary Color"}),e.jsx("input",{id:"tertiary-color",type:"color",value:a.tertiary,onChange:r=>i("tertiary",r.target.value)})]})]}),e.jsxs(v,{children:[e.jsxs(l,{children:[e.jsx("label",{htmlFor:"success-color",children:"Success Color"}),e.jsx("input",{id:"success-color",type:"color",value:a.success,onChange:r=>i("success",r.target.value)})]}),e.jsxs(l,{children:[e.jsx("label",{htmlFor:"warning-color",children:"Warning Color"}),e.jsx("input",{id:"warning-color",type:"color",value:a.warning,onChange:r=>i("warning",r.target.value)})]}),e.jsxs(l,{children:[e.jsx("label",{htmlFor:"danger-color",children:"Danger Color"}),e.jsx("input",{id:"danger-color",type:"color",value:a.danger,onChange:r=>i("danger",r.target.value)})]})]}),e.jsxs(v,{children:[e.jsxs(l,{children:[e.jsx("label",{htmlFor:"background-color",children:"Background Color"}),e.jsx("input",{id:"background-color",type:"color",value:a.background,onChange:r=>i("background",r.target.value)})]}),e.jsxs(l,{children:[e.jsx("label",{htmlFor:"text-color",children:"Text Color"}),e.jsx("input",{id:"text-color",type:"color",value:a.text,onChange:r=>i("text",r.target.value)})]})]})]}),e.jsxs($,{children:[e.jsx(H,{onClick:C,children:"Reset to Default"}),e.jsx(Y,{onClick:F,children:"Apply Colors"})]})]})},X=o.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
  min-height: calc(100vh - 200px); /* Adjust based on header/footer height */
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`,q=({children:t})=>e.jsx(X,{children:t}),J=o.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`,K=o.button`
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
`,Q=o.h1`
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--gray-800);
  margin: 0;
`;o.div`
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
`;const V=o.div`
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
`,Z=o.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--success-color);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  display: ${t=>t.visible?"block":"none"};
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
`,oe=()=>{const{t}=B(),h=k(),{colorPalette:n,setTheme:d}=E(),[a,c]=p.useState(!1),u=m=>{d(m),c(!0),setTimeout(()=>{c(!1)},3e3)};return e.jsxs(q,{children:[e.jsxs(J,{children:[e.jsx(K,{onClick:()=>h(-1),"aria-label":t("navigation.back"),children:e.jsx(S,{})}),e.jsx(Q,{children:t("theme.settings")})]}),e.jsxs(V,{children:[e.jsx("div",{className:"info-icon",children:e.jsx(A,{})}),e.jsxs("div",{className:"info-content",children:[e.jsx("h4",{children:t("theme.howItWorks")}),e.jsx("p",{children:t("theme.colorPaletteDescription")})]})]}),e.jsx(U,{onSave:u,initialPalette:n.id}),e.jsx(Z,{visible:a,children:t("theme.paletteApplied")})]})};export{oe as default};
//# sourceMappingURL=ThemeSettings-7315a39f.js.map
