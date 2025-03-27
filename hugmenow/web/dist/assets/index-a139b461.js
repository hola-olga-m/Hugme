import{E as I,d as n,j as t,r as h,a as k,F as C,b as z}from"./main-cf2c803f.js";import{g as O,a as v,b as j,H as f,c as $,d as P}from"./hugIcons-573ce93f.js";import{m as d}from"./motion-da5b97b2.js";var S={exports:{}},E="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED",G=E,D=G;function w(){}function T(){}T.resetWarningCache=w;var N=function(){function e(r,p,a,x,u,g){if(g!==D){var l=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw l.name="Invariant Violation",l}}e.isRequired=e;function i(){return e}var s={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:i,element:e,elementType:e,instanceOf:i,node:e,objectOf:i,oneOf:i,oneOfType:i,shape:i,exact:i,checkPropTypes:T,resetWarningCache:w};return s.PropTypes=s,s};S.exports=N();var R=S.exports;const o=I(R),_=n(d.div)`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${e=>e.margin||"0"};
  cursor: ${e=>e.onClick?"pointer":"default"};
`,B=n(d.div)`
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
`,L=n.img`
  width: 100%;
  height: 100%;
`,F=n.span`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
`,W={initial:{scale:1},hover:{scale:1.1},tap:{scale:.95},selected:{scale:1.05,transition:{type:"spring",stiffness:400,damping:10}}},m=({type:e="standard",size:i="md",showLabel:s=!1,showBackground:r=!1,isSelected:p=!1,animate:a=!0,margin:x,onClick:u})=>{const g=O(e),l=v(e),c=j(e);return t.jsxs(_,{margin:x,onClick:u,"data-testid":`hug-icon-${e}`,children:[t.jsx(B,{size:i,showBackground:r,isSelected:p,color:l,initial:"initial",whileHover:a?"hover":"",whileTap:a?"tap":"",animate:p&&a?"selected":"initial",variants:a?W:{},children:t.jsx(L,{src:g,alt:`${c} icon`})}),s&&t.jsx(F,{children:c})]})};m.propTypes={type:o.oneOf(["standard","supportive","group","comforting","enthusiastic","virtual"]),size:o.oneOfType([o.oneOf(["xs","sm","md","lg","xl"]),o.string]),showLabel:o.bool,showBackground:o.bool,isSelected:o.bool,animate:o.bool,margin:o.string,onClick:o.func};const V=n.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`,U=n.div`
  margin-bottom: 16px;
`,M=n.h3`
  font-size: 1.3rem;
  color: #333;
  margin: 0 0 4px 0;
`,Y=n.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`,q=n.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 16px;
  margin-bottom: ${e=>e.showSelectedSection?"16px":"0"};
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
  }
`,A=n(d.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  margin-top: 16px;
  background-color: #f5f5f5;
  border-radius: 8px;
`,J=n.h4`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
`,K=n.div`
  margin-top: 16px;
  text-align: center;
`,Q=n.h5`
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 8px 0;
`,X=n.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`,Z={hidden:{opacity:0},visible:{opacity:1,transition:{staggerChildren:.1}}},ee={hidden:{opacity:0,y:20},visible:{opacity:1,y:0,transition:{type:"spring",stiffness:300,damping:25}}},H=({title:e="Hug Types",description:i="Select a hug type to send",showSelectedSection:s=!0,defaultSelectedType:r="standard",onSelectHugType:p})=>{var l;const[a,x]=h.useState(r);h.useEffect(()=>{x(r)},[r]);const u=c=>{x(c),p&&p(c)},g=$(a);return t.jsxs(V,{"data-testid":"hug-icon-gallery",children:[t.jsxs(U,{children:[t.jsx(M,{children:e}),t.jsx(Y,{children:i})]}),t.jsx(d.div,{variants:Z,initial:"hidden",animate:"visible",children:t.jsx(q,{showSelectedSection:s,children:Object.keys(f).map(c=>t.jsx(d.div,{variants:ee,children:t.jsx(m,{type:c,showLabel:!0,showBackground:!0,isSelected:a===c,margin:"8px 0",onClick:()=>u(c)})},c))})}),s&&t.jsxs(A,{initial:{opacity:0,height:0},animate:{opacity:1,height:"auto"},transition:{duration:.3},children:[t.jsx(J,{children:"Selected Hug Type"}),t.jsx(m,{type:a,size:"lg",showBackground:!0,isSelected:!0}),t.jsxs(K,{children:[t.jsx(Q,{children:(l=f[a])==null?void 0:l.name}),t.jsx(X,{children:g})]})]})]})};H.propTypes={title:o.string,description:o.string,showSelectedSection:o.bool,defaultSelectedType:o.oneOf(Object.keys(f)),onSelectHugType:o.func};const te=n.div`
  padding: 16px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`,ne=n.div`
  margin-bottom: 24px;
`,re=n.h1`
  font-size: 2rem;
  color: #333;
  margin: 0 0 8px 0;
`,oe=n.p`
  font-size: 1rem;
  color: #666;
  margin: 0 0 16px 0;
`,y=n.div`
  margin-bottom: 32px;
`,b=n.h2`
  font-size: 1.5rem;
  color: #333;
  margin: 0 0 16px 0;
`,ie=n.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`,se=n(d.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border: 2px solid ${e=>e.isSelected?e.color:"transparent"};
`,ae=n.h3`
  font-size: 0.9rem;
  color: #333;
  margin: 8px 0 0 0;
  text-align: center;
`,ce=n.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`,le=n.button`
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
`,pe={hover:{scale:1.05,boxShadow:"0 5px 15px rgba(0,0,0,0.1)",transition:{type:"spring",stiffness:300,damping:15}},tap:{scale:.98,transition:{type:"spring",stiffness:300,damping:15}}},ue=()=>{k();const[e,i]=h.useState("standard"),s=r=>{i(r)};return t.jsx(C,{children:t.jsxs(te,{children:[t.jsxs(ne,{children:[t.jsx(re,{children:"Hug Icon Gallery"}),t.jsx(oe,{children:"Explore the different types of hugs available in the HugMeNow app. These icons are used throughout the application to represent different types of virtual hugs that you can send to friends and loved ones."})]}),t.jsxs(y,{children:[t.jsx(b,{children:"Individual Hug Icons"}),t.jsx(ie,{children:P().map(r=>t.jsxs(se,{whileHover:"hover",whileTap:"tap",variants:pe,isSelected:e===r,color:v(r),onClick:()=>s(r),children:[t.jsx(m,{type:r,size:"md",showBackground:!1}),t.jsx(ae,{children:j(r)})]},r))})]}),t.jsxs(y,{children:[t.jsx(b,{children:"Hug Icon Gallery Component"}),t.jsx(H,{title:"Select a Hug Type",description:"Choose the type of hug you want to send",defaultSelectedType:e,onSelectHugType:s})]}),t.jsx(ce,{children:t.jsx(z,{to:"/login",children:t.jsx(le,{children:"Sign In to HugMeNow"})})})]})})};export{ue as default};
//# sourceMappingURL=index-a139b461.js.map
