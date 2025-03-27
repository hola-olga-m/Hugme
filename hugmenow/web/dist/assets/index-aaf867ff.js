import{d as t,m as c,a as s,r as d,j as e}from"./animal-hug-gallery-3fae840f.js";import{a as v,w as S,b as H}from"./main-babefb8b.js";import{a as p,g as w,H as x,b as I,c as k,d as T}from"./hug-icons-90039baa.js";const z=t.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`,C=t.div`
  margin-bottom: 16px;
`,G=t.h3`
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 4px 0;
`,D=t.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`,N=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: ${n=>n.showSelectedSection?"16px":"0"};
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`,B=t(c.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin-top: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
`,E=t.h4`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
`,O=t.div`
  margin-top: 16px;
  text-align: center;
`,L=t.h5`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 8px 0;
`,P=t.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`,V={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},M={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{type:"spring",stiffness:300,damping:25}}},y=({title:n="Hug Types",description:l="Select a hug type to send",showSelectedSection:r=!0,defaultSelectedType:i="standard",onSelectHugType:g})=>{var h;const[a,m]=d.useState(i);d.useEffect(()=>{m(i)},[i]);const j=o=>{m(o),g&&g(o)},b=w(a);return e.jsxs(z,{"data-testid":"hug-icon-gallery",children:[e.jsxs(C,{children:[e.jsx(G,{children:n}),e.jsx(D,{children:l})]}),e.jsx(c.div,{variants:V,initial:"hidden",animate:"visible",children:e.jsx(N,{showSelectedSection:r,children:Object.keys(p).map(o=>e.jsx(c.div,{variants:M,children:e.jsx(x,{type:o,showLabel:!0,showBackground:!0,isSelected:a===o,margin:"8px 0",onClick:()=>j(o)})},o))})}),r&&e.jsxs(B,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},transition:{duration:.3},children:[e.jsx(E,{children:"Selected Hug Type"}),e.jsx(x,{type:a,size:"lg",showBackground:!0,isSelected:!0}),e.jsxs(O,{children:[e.jsx(L,{children:(h=p[a])==null?void 0:h.name}),e.jsx(P,{children:b})]})]})]})};y.propTypes={title:s.string,description:s.string,showSelectedSection:s.bool,defaultSelectedType:s.oneOf(Object.keys(p)),onSelectHugType:s.func};const $=t.div`
  padding: 16px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`,R=t.div`
  margin-bottom: 24px;
`,U=t.h1`
  font-size: 2rem;
  color: #333;
  margin: 0 0 8px 0;
`,Y=t.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 16px 0;
`,u=t.div`
  margin-bottom: 32px;
`,f=t.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 16px 0;
`,_=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`,q=t(c.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid ${n=>n.isSelected?n.color:"transparent"};
`,A=t.h3`
  font-size: 0.9rem;
  color: #333;
  margin: 8px 0 0 0;
  text-align: center;
`,F=t.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`,J=t.button`
  padding: 12px 24px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3a80d2;
  }
  
  &:active {
    transform: translateY(1px);
  }
`,K={hover:{scale:1.05,boxShadow:"0 5px 15px rgba(0,0,0,0.1)",transition:{type:"spring",stiffness:300,damping:15}},tap:{scale:.98,transition:{type:"spring",stiffness:300,damping:15}}},Z=()=>{v();const[n,l]=d.useState("standard"),r=i=>{l(i)};return e.jsx(S,{children:e.jsxs($,{children:[e.jsxs(R,{children:[e.jsx(U,{children:"Hug Icon Gallery"}),e.jsx(Y,{children:"Explore the different types of hugs available in the HugMeNow app. These icons are used throughout the application to represent different types of virtual hugs that you can send to friends and loved ones."})]}),e.jsxs(u,{children:[e.jsx(f,{children:"Individual Hug Icons"}),e.jsx(_,{children:I().map(i=>e.jsxs(q,{whileHover:"hover",whileTap:"tap",variants:K,isSelected:n===i,color:k(i),onClick:()=>r(i),children:[e.jsx(x,{type:i,size:"md",showBackground:!1}),e.jsx(A,{children:T(i)})]},i))})]}),e.jsxs(u,{children:[e.jsx(f,{children:"Hug Icon Gallery Component"}),e.jsx(y,{title:"Select a Hug Type",description:"Choose the type of hug you want to send",defaultSelectedType:n,onSelectHugType:r})]}),e.jsx(F,{children:e.jsx(H,{to:"/login",children:e.jsx(J,{children:"Sign In to HugMeNow"})})})]})})};export{Z as default};
//# sourceMappingURL=index-aaf867ff.js.map
