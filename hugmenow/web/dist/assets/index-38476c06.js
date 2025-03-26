import{d as o,j as t,E as T,r as y,a as C,b as k}from"./main-9fd70443.js";import{m as g}from"./motion-95f78768.js";const I=o.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${e=>e.theme.colors.background.primary};
`,z=o.main`
  flex: 1;
  padding: 20px;
`,O=({children:e})=>t.jsx(I,{children:t.jsx(z,{children:e})});var v={exports:{}},E="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",G=E,R=G;function j(){}function S(){}S.resetWarningCache=j;var P=function(){function e(s,p,c,u,h,m){if(m!==R){var d=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw d.name="Invariant Violation",d}}e.isRequired=e;function n(){return e}var r={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:n,element:e,elementType:e,instanceOf:n,node:e,objectOf:n,oneOf:n,oneOfType:n,shape:n,exact:n,checkPropTypes:S,resetWarningCache:j};return r.PropTypes=r,r};v.exports=P();var B=v.exports;const i=T(B),D="/assets/StandardHug-f3a81997.svg",F="/assets/SupportiveHug-383c77e0.svg",L="/assets/GroupHug-a4accea5.svg",N="/assets/ComfortingHug-a58615ec.svg",_="/assets/EnthusiasticHug-e3f65777.svg",A="/assets/VirtualHug-1835d1d0.svg",a={standard:{icon:D,name:"Standard Hug",color:"#FFC107",description:"A warm, friendly hug to show you care"},supportive:{icon:F,name:"Supportive Hug",color:"#FFA726",description:"A reassuring hug when someone needs support"},group:{icon:L,name:"Group Hug",color:"#4CAF50",description:"Bring everyone together with a group hug"},comforting:{icon:N,name:"Comforting Hug",color:"#5C6BC0",description:"A gentle hug to comfort in difficult times"},enthusiastic:{icon:_,name:"Enthusiastic Hug",color:"#FF7043",description:"An energetic hug to celebrate good news"},virtual:{icon:A,name:"Virtual Hug",color:"#7E57C2",description:"A digital hug across any distance"}},V=e=>{var r;const n=(e==null?void 0:e.toLowerCase())||"standard";return((r=a[n])==null?void 0:r.icon)||a.standard.icon},W=()=>Object.keys(a),$=e=>{var r;const n=(e==null?void 0:e.toLowerCase())||"standard";return((r=a[n])==null?void 0:r.color)||a.standard.color},w=e=>{var r;const n=(e==null?void 0:e.toLowerCase())||"standard";return((r=a[n])==null?void 0:r.name)||a.standard.name},M=e=>{var r;const n=(e==null?void 0:e.toLowerCase())||"standard";return((r=a[n])==null?void 0:r.description)||a.standard.description},U=o(g.div)`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${e=>e.margin||"0"};
  cursor: ${e=>e.onClick?"pointer":"default"};
`,Y=o(g.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${e=>{switch(e.size){case"xs":return"24px";case"sm":return"32px";case"md":return"48px";case"lg":return"64px";case"xl":return"96px";default:return e.size||"48px"}}};
  height: ${e=>{switch(e.size){case"xs":return"24px";case"sm":return"32px";case"md":return"48px";case"lg":return"64px";case"xl":return"96px";default:return e.size||"48px"}}};
  background-color: ${e=>e.showBackground?e.theme.colors.background.secondary:"transparent"};
  border-radius: 50%;
  padding: ${e=>e.showBackground?"8px":"0"};
  border: ${e=>e.isSelected?`2px solid ${e.color||e.theme.colors.primary}`:"none"};
  box-shadow: ${e=>e.isSelected?"0 0 10px rgba(0,0,0,0.1)":"none"};
`,q=o.img`
  width: 100%;
  height: 100%;
`,J=o.span`
  margin-top: 8px;
  font-size: ${e=>e.theme.typography.sizes.small};
  color: ${e=>e.theme.colors.text.primary};
  text-align: center;
`,K={initial:{scale:1},hover:{scale:1.1},tap:{scale:.95},selected:{scale:1.05,transition:{type:"spring",stiffness:400,damping:10}}},x=({type:e="standard",size:n="md",showLabel:r=!1,showBackground:s=!1,isSelected:p=!1,animate:c=!0,margin:u,onClick:h})=>{const m=V(e),d=$(e),l=w(e);return t.jsxs(U,{margin:u,onClick:h,"data-testid":`hug-icon-${e}`,children:[t.jsx(Y,{size:n,showBackground:s,isSelected:p,color:d,initial:"initial",whileHover:c?"hover":"",whileTap:c?"tap":"",animate:p&&c?"selected":"initial",variants:c?K:{},children:t.jsx(q,{src:m,alt:`${l} icon`})}),r&&t.jsx(J,{children:l})]})};x.propTypes={type:i.oneOf(["standard","supportive","group","comforting","enthusiastic","virtual"]),size:i.oneOfType([i.oneOf(["xs","sm","md","lg","xl"]),i.string]),showLabel:i.bool,showBackground:i.bool,isSelected:i.bool,animate:i.bool,margin:i.string,onClick:i.func};const Q=o.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${e=>e.theme.colors.background.primary};
  border-radius: ${e=>e.theme.borderRadius};
  padding: 16px;
  box-shadow: ${e=>e.theme.shadows.light};
`,X=o.div`
  margin-bottom: 16px;
`,Z=o.h3`
  font-size: ${e=>e.theme.typography.sizes.large};
  color: ${e=>e.theme.colors.text.primary};
  margin: 0 0 4px 0;
`,ee=o.p`
  font-size: ${e=>e.theme.typography.sizes.small};
  color: ${e=>e.theme.colors.text.secondary};
  margin: 0;
`,te=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: ${e=>e.showSelectedSection?"16px":"0"};
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`,oe=o(g.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin-top: 16px;
  background-color: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius};
`,re=o.h4`
  font-size: ${e=>e.theme.typography.sizes.medium};
  color: ${e=>e.theme.colors.text.primary};
  margin: 0 0 16px 0;
  text-align: center;
`,ne=o.div`
  margin-top: 16px;
  text-align: center;
`,se=o.h5`
  font-size: ${e=>e.theme.typography.sizes.medium};
  color: ${e=>e.theme.colors.text.primary};
  margin: 0 0 8px 0;
`,ie=o.p`
  font-size: ${e=>e.theme.typography.sizes.small};
  color: ${e=>e.theme.colors.text.secondary};
  margin: 0;
`,ae={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},ce={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{type:"spring",stiffness:300,damping:25}}},H=({title:e="Hug Types",description:n="Select a hug type to send",showSelectedSection:r=!0,defaultSelectedType:s="standard",onSelectHugType:p})=>{var d;const[c,u]=y.useState(s);y.useEffect(()=>{u(s)},[s]);const h=l=>{u(l),p&&p(l)},m=M(c);return t.jsxs(Q,{"data-testid":"hug-icon-gallery",children:[t.jsxs(X,{children:[t.jsx(Z,{children:e}),t.jsx(ee,{children:n})]}),t.jsx(g.div,{variants:ae,initial:"hidden",animate:"visible",children:t.jsx(te,{showSelectedSection:r,children:Object.keys(a).map(l=>t.jsx(g.div,{variants:ce,children:t.jsx(x,{type:l,showLabel:!0,showBackground:!0,isSelected:c===l,margin:"8px 0",onClick:()=>h(l)})},l))})}),r&&t.jsxs(oe,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},transition:{duration:.3},children:[t.jsx(re,{children:"Selected Hug Type"}),t.jsx(x,{type:c,size:"lg",showBackground:!0,isSelected:!0}),t.jsxs(ne,{children:[t.jsx(se,{children:(d=a[c])==null?void 0:d.name}),t.jsx(ie,{children:m})]})]})]})};H.propTypes={title:i.string,description:i.string,showSelectedSection:i.bool,defaultSelectedType:i.oneOf(Object.keys(a)),onSelectHugType:i.func};const le=o.div`
  padding: 16px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`,de=o.div`
  margin-bottom: 24px;
`,pe=o.h1`
  font-size: ${e=>e.theme.typography.sizes.xxlarge};
  color: ${e=>e.theme.colors.text.primary};
  margin: 0 0 8px 0;
`,ge=o.p`
  font-size: ${e=>e.theme.typography.sizes.medium};
  color: ${e=>e.theme.colors.text.secondary};
  margin: 0 0 16px 0;
`,f=o.div`
  margin-bottom: 32px;
`,b=o.h2`
  font-size: ${e=>e.theme.typography.sizes.large};
  color: ${e=>e.theme.colors.text.primary};
  margin: 0 0 16px 0;
`,ue=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`,me=o(g.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: ${e=>e.theme.colors.background.secondary};
  border-radius: ${e=>e.theme.borderRadius};
  box-shadow: ${e=>e.theme.shadows.light};
  cursor: pointer;
  border: 2px solid ${e=>e.isSelected?e.color:"transparent"};
`,he=o.h3`
  font-size: ${e=>e.theme.typography.sizes.small};
  color: ${e=>e.theme.colors.text.primary};
  margin: 8px 0 0 0;
  text-align: center;
`,xe=o.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`,ye=o.button`
  padding: 12px 24px;
  background-color: ${e=>e.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${e=>e.theme.borderRadius};
  font-size: ${e=>e.theme.typography.sizes.medium};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${e=>e.theme.colors.primaryDark};
  }
  
  &:active {
    transform: translateY(1px);
  }
`,fe={hover:{scale:1.05,boxShadow:"0 5px 15px rgba(0,0,0,0.1)",transition:{type:"spring",stiffness:300,damping:15}},tap:{scale:.98,transition:{type:"spring",stiffness:300,damping:15}}},je=()=>{C();const[e,n]=y.useState("standard"),r=s=>{n(s)};return t.jsx(O,{children:t.jsxs(le,{children:[t.jsxs(de,{children:[t.jsx(pe,{children:"Hug Icon Gallery"}),t.jsx(ge,{children:"Explore the different types of hugs available in the HugMeNow app. These icons are used throughout the application to represent different types of virtual hugs that you can send to friends and loved ones."})]}),t.jsxs(f,{children:[t.jsx(b,{children:"Individual Hug Icons"}),t.jsx(ue,{children:W().map(s=>t.jsxs(me,{whileHover:"hover",whileTap:"tap",variants:fe,isSelected:e===s,color:$(s),onClick:()=>r(s),children:[t.jsx(x,{type:s,size:"md",showBackground:!1}),t.jsx(he,{children:w(s)})]},s))})]}),t.jsxs(f,{children:[t.jsx(b,{children:"Hug Icon Gallery Component"}),t.jsx(H,{title:"Select a Hug Type",description:"Choose the type of hug you want to send",defaultSelectedType:e,onSelectHugType:r})]}),t.jsx(xe,{children:t.jsx(k,{to:"/login",children:t.jsx(ye,{children:"Sign In to HugMeNow"})})})]})})};export{je as default};
//# sourceMappingURL=index-38476c06.js.map
