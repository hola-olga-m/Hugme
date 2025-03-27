import{d as i,r as s,j as n}from"./animal-hug-gallery-3fae840f.js";import"./hug-icons-90039baa.js";const m={BEAR_HUG:"BearHug",SUPPORTING:"Supporting",COMFORTING:"Comforting",LOVING:"Loving",CELEBRATING:"Celebrating",FESTIVE:"Festive",CARING:"Caring",TEASING:"Teasing",INVITING:"Inviting",MOODY:"Moody"};function w(){const e={};return Object.values(m).forEach(r=>{e[r]=[];for(let t=1;t<=4;t++)try{e[r].push({static:`/src/assets/icons/png-icons/${r}_${t}.png`,variant:t})}catch(o){console.error(`Failed to import icon: ${r}_${t}.png`,o)}}),e}const F=(e,r)=>{const t=[];for(let o=1;o<=30;o++)t.push(`/src/assets/icons/png-icons/${e}_frame${o}.png`);return t},S=w(),z=(e,r=1)=>{const t=`${e}_${r}`;return F(t)},k=i.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${e=>e.onClick?"pointer":"default"};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: ${e=>e.onClick?"scale(1.05)":"none"};
  }
`,N=i.div`
  width: ${e=>e.size||"120px"};
  height: ${e=>e.size||"120px"};
  border-radius: ${e=>e.circular?"50%":"12px"};
  overflow: hidden;
  background-color: ${e=>e.backgroundColor||"transparent"};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`,R=i.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`,y=i.div`
  font-size: 14px;
  text-align: center;
  color: ${e=>e.selected?"#ff6b8b":"#666"};
  font-weight: ${e=>e.selected?"bold":"normal"};
  margin-top: 8px;
`,O=({type:e=m.BEAR_HUG,variant:r=1,size:t="120px",circular:o=!1,animated:a=!1,showCaption:g=!0,selected:d=!1,onClick:h=null,backgroundColor:f="transparent"})=>{var v;const[c,$]=s.useState(0),[j,C]=s.useState([]),l=s.useRef(null),u=Object.values(m).includes(e)?e:m.BEAR_HUG,b=Math.min(Math.max(r,1),4),G=((v=S[u])==null?void 0:v.find(p=>p.variant===b))||S[m.BEAR_HUG][0],I=u.replace(/([A-Z])/g," $1").trim();s.useEffect(()=>{if(a){const p=z(u,b);C(p);const A=()=>{$(H=>(H+1)%p.length),l.current=requestAnimationFrame(A)};return l.current=requestAnimationFrame(A),()=>{l.current&&cancelAnimationFrame(l.current)}}else l.current&&cancelAnimationFrame(l.current),C([])},[a,u,b]);const E=a&&j.length>0?j[c]:G.static;return n.jsxs(k,{onClick:h,children:[n.jsx(N,{size:t,circular:o,backgroundColor:f,children:n.jsx(R,{src:E,alt:`${I} hug icon`})}),g&&n.jsx(y,{selected:d,children:I})]})},_=i.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,U=i.header`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1rem;
    color: #666;
  }
`,B=i.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`,x=i.div`
  margin: 0 1rem;
  
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
  
  label {
    margin-right: 0.5rem;
    font-weight: bold;
  }
  
  select, button {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #ccc;
  }
  
  button {
    background-color: #4a90e2;
    color: white;
    border: none;
    cursor: pointer;
    
    &:hover {
      background-color: #357abD;
    }
  }
`,M=i.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
`,L=()=>{const[e,r]=s.useState("120px"),[t,o]=s.useState(!1),[a,g]=s.useState(!1),[d,h]=s.useState(!0),f=Object.values(m);return n.jsxs(_,{children:[n.jsxs(U,{children:[n.jsx("h1",{children:"Human Hug Icons Gallery"}),n.jsx("p",{children:"Explore our collection of human-figured hug icons"})]}),n.jsxs(B,{children:[n.jsxs(x,{children:[n.jsx("label",{htmlFor:"size-select",children:"Size:"}),n.jsxs("select",{id:"size-select",value:e,onChange:c=>r(c.target.value),children:[n.jsx("option",{value:"80px",children:"Small"}),n.jsx("option",{value:"120px",children:"Medium"}),n.jsx("option",{value:"160px",children:"Large"})]})]}),n.jsx(x,{children:n.jsx("button",{onClick:()=>o(!t),children:t?"Disable Animation":"Enable Animation"})}),n.jsx(x,{children:n.jsx("button",{onClick:()=>g(!a),children:a?"Square Icons":"Circular Icons"})}),n.jsx(x,{children:n.jsx("button",{onClick:()=>h(!d),children:d?"Hide Captions":"Show Captions"})})]}),n.jsx(M,{children:f.map(c=>n.jsx(O,{type:c,size:e,animated:t,circular:a,showCaption:d,onClick:()=>console.log(`Clicked on ${c} icon`)},c))})]})};export{L as default};
//# sourceMappingURL=index-006f7123.js.map
