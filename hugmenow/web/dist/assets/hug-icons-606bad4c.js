import{F as H,B as w,R as b,H as T,P as C,Y as A,d as i,m as d,A as l,a as o,g as v,b as y,c as j,j as t}from"./animal-hug-gallery-c3231598.js";const r={standard:{icon:H,name:"Standard Hug",color:"#FFC107",description:"A warm, friendly hug to show you care"},supportive:{icon:w,name:"Supportive Hug",color:"#FFA726",description:"A reassuring hug when someone needs support"},group:{icon:b,name:"Group Hug",color:"#4CAF50",description:"Bring everyone together with a group hug"},comforting:{icon:T,name:"Comforting Hug",color:"#5C6BC0",description:"A gentle hug to comfort in difficult times"},enthusiastic:{icon:C,name:"Enthusiastic Hug",color:"#FF7043",description:"An energetic hug to celebrate good news"},virtual:{icon:A,name:"Virtual Hug",color:"#7E57C2",description:"A digital hug across any distance"}},$=e=>{var n;const s=(e==null?void 0:e.toLowerCase())||"standard";return((n=r[s])==null?void 0:n.icon)||r.standard.icon},E=()=>Object.keys(r),I=e=>{var n;const s=(e==null?void 0:e.toLowerCase())||"standard";return((n=r[s])==null?void 0:n.color)||r.standard.color},k=e=>{var n;const s=(e==null?void 0:e.toLowerCase())||"standard";return((n=r[s])==null?void 0:n.name)||r.standard.name},G=e=>{var n;const s=(e==null?void 0:e.toLowerCase())||"standard";return((n=r[s])==null?void 0:n.description)||r.standard.description},B=i(d.div)`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${e=>e.margin||"0"};
  cursor: ${e=>e.onClick?"pointer":"default"};
`,F=i(d.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${e=>{switch(e.size){case"xs":return"24px";case"sm":return"32px";case"md":return"48px";case"lg":return"64px";case"xl":return"96px";default:return e.size||"48px"}}};
  height: ${e=>{switch(e.size){case"xs":return"24px";case"sm":return"32px";case"md":return"48px";case"lg":return"64px";case"xl":return"96px";default:return e.size||"48px"}}};
  background-color: ${e=>e.showBackground?"#ffffff":"transparent"};
  border-radius: 50%;
  padding: ${e=>e.showBackground?"8px":"0"};
  border: ${e=>e.isSelected?`2px solid ${e.color||"#4a90e2"}`:"none"};
  box-shadow: ${e=>e.isSelected?"0 0 10px rgba(0,0,0,0.1)":"none"};
`,O=i.img`
  width: 100%;
  height: 100%;
`,S=i.span`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
`,L={initial:{scale:1},hover:{scale:1.1},tap:{scale:.95},selected:{scale:1.05,transition:{type:"spring",stiffness:400,damping:10}}},z=({type:e="standard",size:s="md",showLabel:n=!1,showBackground:p=!1,isSelected:u=!1,animate:a=!0,margin:m,onClick:h})=>{const c=Object.keys(l).includes(e),x=c?v(e):$(e),f=c?y(e):I(e),g=c?j(e):k(e);return t.jsxs(B,{margin:m,onClick:h,"data-testid":`hug-icon-${e}`,children:[t.jsx(F,{size:s,showBackground:p,isSelected:u,color:f,initial:"initial",whileHover:a?"hover":"",whileTap:a?"tap":"",animate:u&&a?"selected":"initial",variants:a?L:{},children:t.jsx(O,{src:x,alt:`${g} icon`})}),n&&t.jsx(S,{children:g})]})},N=["standard","supportive","group","comforting","enthusiastic","virtual",...Object.keys(l)];z.propTypes={type:o.oneOf(N),size:o.oneOfType([o.oneOf(["xs","sm","md","lg","xl"]),o.string]),showLabel:o.bool,showBackground:o.bool,isSelected:o.bool,animate:o.bool,margin:o.string,onClick:o.func};export{r as H,z as a,E as b,I as c,k as d,G as g};
//# sourceMappingURL=hug-icons-606bad4c.js.map
