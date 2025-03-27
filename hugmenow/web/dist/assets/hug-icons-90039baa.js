import{F as f,B as H,R as b,H as w,P as T,Y as C,d as i,m as d,a as o,g as A,b as v,c as y,j as t}from"./animal-hug-gallery-3fae840f.js";const r={standard:{icon:f,name:"Standard Hug",color:"#FFC107",description:"A warm, friendly hug to show you care"},supportive:{icon:H,name:"Supportive Hug",color:"#FFA726",description:"A reassuring hug when someone needs support"},group:{icon:b,name:"Group Hug",color:"#4CAF50",description:"Bring everyone together with a group hug"},comforting:{icon:w,name:"Comforting Hug",color:"#5C6BC0",description:"A gentle hug to comfort in difficult times"},enthusiastic:{icon:T,name:"Enthusiastic Hug",color:"#FF7043",description:"An energetic hug to celebrate good news"},virtual:{icon:C,name:"Virtual Hug",color:"#7E57C2",description:"A digital hug across any distance"}},I=n=>{var e;const s=(n==null?void 0:n.toLowerCase())||"standard";return((e=r[s])==null?void 0:e.icon)||r.standard.icon},E=()=>Object.keys(r),$=n=>{var e;const s=(n==null?void 0:n.toLowerCase())||"standard";return((e=r[s])==null?void 0:e.color)||r.standard.color},j=n=>{var e;const s=(n==null?void 0:n.toLowerCase())||"standard";return((e=r[s])==null?void 0:e.name)||r.standard.name},G=n=>{var e;const s=(n==null?void 0:n.toLowerCase())||"standard";return((e=r[s])==null?void 0:e.description)||r.standard.description},B=["fox","bear","hedgehog","rabbit","penguin","yinyang","sloth","panda","cat","unicorn"],F=i(d.div)`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${n=>n.margin||"0"};
  cursor: ${n=>n.onClick?"pointer":"default"};
`,S=i(d.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${n=>{switch(n.size){case"xs":return"24px";case"sm":return"32px";case"md":return"48px";case"lg":return"64px";case"xl":return"96px";default:return n.size||"48px"}}};
  height: ${n=>{switch(n.size){case"xs":return"24px";case"sm":return"32px";case"md":return"48px";case"lg":return"64px";case"xl":return"96px";default:return n.size||"48px"}}};
  background-color: ${n=>n.showBackground?"#ffffff":"transparent"};
  border-radius: 50%;
  padding: ${n=>n.showBackground?"8px":"0"};
  border: ${n=>n.isSelected?`2px solid ${n.color||"#4a90e2"}`:"none"};
  box-shadow: ${n=>n.isSelected?"0 0 10px rgba(0,0,0,0.1)":"none"};
`,k=i.img`
  width: 100%;
  height: 100%;
`,L=i.span`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
`,O={initial:{scale:1},hover:{scale:1.1},tap:{scale:.95},selected:{scale:1.05,transition:{type:"spring",stiffness:400,damping:10}}},z=({type:n="standard",size:s="md",showLabel:e=!1,showBackground:l=!1,isSelected:g=!1,animate:a=!0,margin:p,onClick:m})=>{const c=B.includes(n),h=c?A(n):I(n),x=c?v(n):$(n),u=c?y(n):j(n);return t.jsxs(F,{margin:p,onClick:m,"data-testid":`hug-icon-${n}`,children:[t.jsx(S,{size:s,showBackground:l,isSelected:g,color:x,initial:"initial",whileHover:a?"hover":"",whileTap:a?"tap":"",animate:g&&a?"selected":"initial",variants:a?O:{},children:t.jsx(k,{src:h,alt:`${u} icon`})}),e&&t.jsx(L,{children:u})]})},N=["standard","supportive","group","comforting","enthusiastic","virtual",...Object.keys(ANIMAL_HUG_ICONS)];z.propTypes={type:o.oneOf(N),size:o.oneOfType([o.oneOf(["xs","sm","md","lg","xl"]),o.string]),showLabel:o.bool,showBackground:o.bool,isSelected:o.bool,animate:o.bool,margin:o.string,onClick:o.func};export{z as H,r as a,E as b,$ as c,j as d,G as g};
//# sourceMappingURL=hug-icons-90039baa.js.map
