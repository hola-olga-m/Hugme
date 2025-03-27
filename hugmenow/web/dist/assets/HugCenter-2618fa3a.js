import{r as n,d as i,e as Ye,j as e,u as Be,a as Ke,c as A,L as We,S as Ve,M as Je,f as Xe,g as Ze,h as er}from"./main-cf2c803f.js";import{u as N,E as rr,c as tr,d as sr,e as nr,f as ir,g as ar,h as or}from"./ErrorMessage-912258b5.js";import{u as ke,f as cr,a as dr,P as lr,L as ur,m as _}from"./motion-da5b97b2.js";function Se(){const t=n.useRef(!1);return ke(()=>(t.current=!0,()=>{t.current=!1}),[]),t}function mr(){const t=Se(),[o,s]=n.useState(0),a=n.useCallback(()=>{t.current&&s(o+1)},[o]);return[n.useCallback(()=>cr.postRender(a),[a]),o]}class hr extends n.Component{getSnapshotBeforeUpdate(o){const s=this.props.childRef.current;if(s&&o.isPresent&&!this.props.isPresent){const a=this.props.sizeRef.current;a.height=s.offsetHeight||0,a.width=s.offsetWidth||0,a.top=s.offsetTop,a.left=s.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function gr({children:t,isPresent:o}){const s=n.useId(),a=n.useRef(null),h=n.useRef({width:0,height:0,top:0,left:0});return n.useInsertionEffect(()=>{const{width:g,height:p,top:m,left:v}=h.current;if(o||!a.current||!g||!p)return;a.current.dataset.motionPopId=s;const c=document.createElement("style");return document.head.appendChild(c),c.sheet&&c.sheet.insertRule(`
          [data-motion-pop-id="${s}"] {
            position: absolute !important;
            width: ${g}px !important;
            height: ${p}px !important;
            top: ${m}px !important;
            left: ${v}px !important;
          }
        `),()=>{document.head.removeChild(c)}},[o]),n.createElement(hr,{isPresent:o,childRef:a,sizeRef:h},n.cloneElement(t,{ref:a}))}const X=({children:t,initial:o,isPresent:s,onExitComplete:a,custom:h,presenceAffectsLayout:g,mode:p})=>{const m=dr(pr),v=n.useId(),c=n.useMemo(()=>({id:v,initial:o,isPresent:s,custom:h,onExitComplete:d=>{m.set(d,!0);for(const u of m.values())if(!u)return;a&&a()},register:d=>(m.set(d,!1),()=>m.delete(d))}),g?void 0:[s]);return n.useMemo(()=>{m.forEach((d,u)=>m.set(u,!1))},[s]),n.useEffect(()=>{!s&&!m.size&&a&&a()},[s]),p==="popLayout"&&(t=n.createElement(gr,{isPresent:s},t)),n.createElement(lr.Provider,{value:c},t)};function pr(){return new Map}function xr(t){return n.useEffect(()=>()=>t(),[])}const w=t=>t.key||"";function fr(t,o){t.forEach(s=>{const a=w(s);o.set(a,s)})}function jr(t){const o=[];return n.Children.forEach(t,s=>{n.isValidElement(s)&&o.push(s)}),o}const vr=({children:t,custom:o,initial:s=!0,onExitComplete:a,exitBeforeEnter:h,presenceAffectsLayout:g=!0,mode:p="sync"})=>{const m=n.useContext(ur).forceRender||mr()[0],v=Se(),c=jr(t);let d=c;const u=n.useRef(new Map).current,j=n.useRef(d),b=n.useRef(new Map).current,k=n.useRef(!0);if(ke(()=>{k.current=!1,fr(c,b),j.current=d}),xr(()=>{k.current=!0,b.clear(),u.clear()}),k.current)return n.createElement(n.Fragment,null,d.map(l=>n.createElement(X,{key:w(l),isPresent:!0,initial:s?void 0:!1,presenceAffectsLayout:g,mode:p},l)));d=[...d];const S=j.current.map(w),H=c.map(w),f=S.length;for(let l=0;l<f;l++){const x=S[l];H.indexOf(x)===-1&&!u.has(x)&&u.set(x,void 0)}return p==="wait"&&u.size&&(d=[]),u.forEach((l,x)=>{if(H.indexOf(x)!==-1)return;const E=b.get(x);if(!E)return;const T=S.indexOf(x);let R=l;if(!R){const M=()=>{u.delete(x);const F=Array.from(b.keys()).filter(y=>!H.includes(y));if(F.forEach(y=>b.delete(y)),j.current=c.filter(y=>{const q=w(y);return q===x||F.includes(q)}),!u.size){if(v.current===!1)return;m(),a&&a()}};R=n.createElement(X,{key:w(E),isPresent:!1,onExitComplete:M,custom:o,presenceAffectsLayout:g,mode:p},E),u.set(x,R)}d.splice(T,0,R)}),d=d.map(l=>{const x=l.key;return u.has(x)?l:n.createElement(X,{key:w(l),isPresent:!0,presenceAffectsLayout:g,mode:p},l)}),n.createElement(n.Fragment,null,u.size?d:d.map(l=>n.cloneElement(l)))},yr=i.div`
  margin: 2rem 0;
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  overflow: hidden;
`,br=i.h2`
  color: var(--primary-color);
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  .emoji {
    font-size: 2rem;
  }
`,Cr=i.p`
  text-align: center;
  color: var(--gray-600);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`,Er=i.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
`,Rr=i(_.div)`
  background: ${t=>t.bgColor||"var(--background-color, #f8f9fa)"};
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-lg);
  }
`,wr=i.div`
  height: 180px;
  width: 100%;
  background: ${t=>t.bgColor||"var(--primary-light)"};
  display: flex;
  justify-content: center;
  align-items: center;
  
  .hug-emoji {
    font-size: 5rem;
    margin-bottom: 0.5rem;
  }
  
  .hug-animation {
    position: relative;
    
    .emoji-left, .emoji-right {
      font-size: 3rem;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    
    .emoji-left {
      right: 115%;
    }
    
    .emoji-right {
      left: 115%;
    }
  }
`,Hr=i.div`
  padding: 1.25rem;
  background: white;
`,Nr=i.h3`
  font-size: 1.1rem;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
  font-weight: 600;
`,kr=i.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
  line-height: 1.5;
`,Sr=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--gray-500);
`,je=i.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`,Tr=i(_.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 2rem;
`,Mr=i(_.div)`
  background: white;
  border-radius: var(--border-radius-lg);
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
`,qr=i.div`
  background: var(--primary-color);
  color: white;
  padding: 1.5rem;
  text-align: center;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
`,Ar=i.div`
  padding: 2rem;
  
  .hug-large-emoji {
    font-size: 6rem;
    text-align: center;
    margin: 1rem 0;
    display: block;
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
    color: var(--gray-700);
  }
`,Gr=i.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: center;
`,Ir=i.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background: var(--primary-dark);
  }
`,Lr=[{id:1,title:"Warm Embrace",emoji:"🤗",leftEmoji:"💫",rightEmoji:"✨",description:"A heartfelt hug that brings warmth and comfort",message:"Sending you warm thoughts and a gentle embrace to make your day brighter!",color:"#FFE9C8"},{id:2,title:"Supportive Squeeze",emoji:"🫂",leftEmoji:"💪",rightEmoji:"🌈",description:"A supportive hug to help you through tough times",message:"You're not alone! This supportive hug comes with the strength you need to keep going.",color:"#D4F5FF"},{id:3,title:"Bear Hug",emoji:"🧸",leftEmoji:"🌟",rightEmoji:"✨",description:"A big, strong hug that surrounds you completely",message:"Wrapping you in a big bear hug! Feel the comfort and know that you're cherished.",color:"#FFD1DC"},{id:4,title:"Butterfly Hug",emoji:"🦋",leftEmoji:"🌼",rightEmoji:"🌸",description:"A gentle, light hug like butterfly wings",message:"Like the gentle flutter of butterfly wings, this soft hug brings peace and calm to your heart.",color:"#E0F4FF"},{id:5,title:"Healing Hug",emoji:"💖",leftEmoji:"✨",rightEmoji:"🌟",description:"A restorative hug with healing energy",message:"This healing hug carries positive energy to help restore your spirit and soothe your soul.",color:"#D9F2D9"},{id:6,title:"Celebration Hug",emoji:"🎉",leftEmoji:"🥳",rightEmoji:"🎊",description:"A joyful hug to celebrate your achievements",message:"Congratulations! This hug celebrates you and all your wonderful accomplishments!",color:"#FFE8D6"}],Dr=()=>{const{colorPalette:t}=Ye(),[o,s]=n.useState(null),[a,h]=n.useState([]);n.useEffect(()=>{const c=[...Lr].sort(()=>Math.random()-.5);h(c)},[t.id]);const g=c=>{s(c)},p=()=>{s(null)},m={hidden:{opacity:0},visible:{opacity:1,transition:{when:"beforeChildren",staggerChildren:.1}}},v={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{type:"spring",stiffness:100}}};return e.jsxs(yr,{children:[e.jsxs(br,{children:[e.jsx("span",{className:"emoji",children:"🤗"}),"Cute Hugs Gallery",e.jsx("span",{className:"emoji",children:"💕"})]}),e.jsx(Cr,{children:"Express your feelings with these adorable themed hugs. Each hug carries a special meaning and energy to brighten someone's day or provide comfort when needed."}),e.jsx(_.div,{variants:m,initial:"hidden",animate:"visible",children:e.jsx(Er,{children:a.map(c=>e.jsxs(Rr,{bgColor:c.color,onClick:()=>g(c),variants:v,children:[e.jsx(wr,{bgColor:c.color,children:e.jsxs("div",{className:"hug-animation",children:[e.jsx("span",{className:"emoji-left",children:c.leftEmoji}),e.jsx("span",{className:"hug-emoji",children:c.emoji}),e.jsx("span",{className:"emoji-right",children:c.rightEmoji})]})}),e.jsxs(Hr,{children:[e.jsx(Nr,{children:c.title}),e.jsx(kr,{children:c.description}),e.jsxs(Sr,{children:[e.jsxs(je,{children:[e.jsx("span",{children:"💌"})," Send this hug"]}),e.jsxs(je,{children:[e.jsx("span",{children:"💝"})," Perfect match"]})]})]})]},c.id))})}),e.jsx(vr,{children:o&&e.jsx(Tr,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:p,children:e.jsxs(Mr,{initial:{y:50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},onClick:c=>c.stopPropagation(),children:[e.jsx(qr,{children:e.jsx("h3",{children:o.title})}),e.jsxs(Ar,{children:[e.jsx("span",{className:"hug-large-emoji",children:o.emoji}),e.jsx("p",{children:o.message}),e.jsxs("p",{children:["Perfect for: moments when you want to share ",o.title.toLowerCase()," with someone who needs it. This style of hug is especially helpful for expressing your care and support in a gentle, meaningful way."]})]}),e.jsx(Gr,{children:e.jsx(Ir,{onClick:p,children:"Send This Hug"})})]})})})]})},Pr=i.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,Ur=i.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,Fr=i.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`,zr=i.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,_r=i.h1`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
`,Or=i.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--gray-300);
`,C=i.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${t=>t.active?"var(--primary-color)":"transparent"};
  font-weight: ${t=>t.active?"500":"normal"};
  color: ${t=>t.active?"var(--primary-color)":"var(--gray-600)"};
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--primary-color);
  }
`,ve=i.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,G=i.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--gray-700);
  }
`,ye=i.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`,be=i.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`,$r=i.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`,Qr=i.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid ${t=>t.selected?"var(--primary-color)":"var(--gray-200)"};
  border-radius: var(--border-radius);
  background-color: ${t=>t.selected?"var(--primary-light)":"white"};
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    border-color: var(--primary-color);
  }
  
  .emoji {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .label {
    font-weight: ${t=>t.selected?"500":"normal"};
    color: ${t=>t.selected?"var(--primary-color)":"var(--gray-700)"};
  }
`,Ce=i.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    background-color: var(--primary-dark);
  }
  
  &:disabled {
    background-color: var(--gray-400);
    cursor: not-allowed;
  }
`,Ee=i.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`,Re=i.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${t=>t.unread?"var(--primary-color)":"transparent"};
`,we=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,I=i.div`
  display: flex;
  align-items: center;
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 0.75rem;
  }
  
  .name {
    font-weight: 500;
    color: var(--gray-800);
  }
  
  .username {
    font-size: 0.8rem;
    color: var(--gray-500);
  }
`,L=i.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,He=i.div`
  margin-bottom: 1rem;
  
  .hug-type {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    
    .emoji {
      font-size: 1.5rem;
      margin-right: 0.5rem;
    }
    
    .type {
      font-weight: 500;
      color: var(--primary-color);
    }
  }
  
  .message {
    color: var(--gray-700);
    line-height: 1.5;
  }
`,Ne=i.div`
  display: flex;
  justify-content: flex-end;
  
  button {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 0.9rem;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
`,Z=i.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`,ee=i.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${t=>t.status==="PENDING"?"var(--warning-color)":t.status==="ACCEPTED"?"var(--success-color)":t.status==="REJECTED"?"var(--danger-color)":t.status==="CANCELLED"?"var(--gray-500)":"transparent"};
`,re=i.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,te=i.div`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  
  background-color: ${t=>t.status==="PENDING"?"var(--warning-light)":t.status==="ACCEPTED"?"var(--success-light)":t.status==="REJECTED"?"var(--danger-light)":t.status==="CANCELLED"?"var(--gray-200)":"transparent"};
  
  color: ${t=>t.status==="PENDING"?"var(--warning-color)":t.status==="ACCEPTED"?"var(--success-color)":t.status==="REJECTED"?"var(--danger-color)":(t.status==="CANCELLED","var(--gray-700)")};
`,se=i.div`
  margin-bottom: 1rem;
  
  .message {
    color: var(--gray-700);
    line-height: 1.5;
  }
  
  .community-tag {
    display: inline-block;
    background-color: var(--primary-light);
    color: var(--primary-color);
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    margin-top: 0.5rem;
  }
`,z=i.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  
  button {
    padding: 0.5rem 1rem;
    border-radius: var(--border-radius);
    font-size: 0.9rem;
    cursor: pointer;
    transition: var(--transition-base);
  }
  
  .accept-btn {
    background-color: var(--success-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--success-dark);
    }
  }
  
  .reject-btn {
    background-color: var(--danger-color);
    color: white;
    border: none;
    
    &:hover {
      background-color: var(--danger-dark);
    }
  }
  
  .cancel-btn {
    background: none;
    border: 1px solid var(--gray-400);
    color: var(--gray-700);
    
    &:hover {
      background-color: var(--gray-100);
    }
  }
`,D=i.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,ne=t=>({QUICK:"🤗",WARM:"💗",SUPPORTIVE:"💪",COMFORTING:"🌈",ENCOURAGING:"✨",CELEBRATORY:"🎉"})[t]||"🤗",ie=t=>({QUICK:"Quick",WARM:"Warm",SUPPORTIVE:"Supportive",COMFORTING:"Comforting",ENCOURAGING:"Encouraging",CELEBRATORY:"Celebratory"})[t]||"Quick",ae=t=>({PENDING:"Pending",ACCEPTED:"Accepted",REJECTED:"Rejected",CANCELLED:"Cancelled"})[t]||"Unknown",P=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),U=t=>t?t.split(" ").map(o=>o[0]).join("").toUpperCase().substring(0,2):"?",Vr=()=>{const{currentUser:t}=Be(),o=Ke(),[s,a]=n.useState("send"),[h,g]=n.useState(""),[p,m]=n.useState("QUICK"),[v,c]=n.useState(""),[d,u]=n.useState(""),[j,b]=n.useState(!1),[k,S]=n.useState(!0),[H,f]=n.useState(null),{data:l,loading:x,error:E}=N(tr),{data:T,loading:R,error:M,refetch:F}=N(sr),{data:y,loading:q,error:O,refetch:Te}=N(nr),{data:$,loading:oe,error:Q,refetch:ce}=N(ir),{data:Y,loading:de,error:B,refetch:Me}=N(ar),{data:K,loading:le,error:W,refetch:V}=N(or),[qe,{loading:Ae}]=A(Ve,{onCompleted:()=>{F(),Ue()},onError:r=>{f(r.message)}}),[Ge]=A(Je,{onCompleted:()=>{Te()},onError:r=>{f(r.message)}}),[Ie,{loading:Le}]=A(Xe,{onCompleted:()=>{ce(),V(),Fe()},onError:r=>{f(r.message)}}),[De]=A(Ze,{onCompleted:()=>{Me(),V()},onError:r=>{f(r.message)}}),[Pe]=A(er,{onCompleted:()=>{ce(),V()},onError:r=>{f(r.message)}});n.useEffect(()=>{S(x||R||q||oe||de||le),E&&f(E.message),M&&f(M.message),O&&f(O.message),Q&&f(Q.message),B&&f(B.message),W&&f(W.message)},[x,R,q,oe,de,le,E,M,O,Q,B,W]);const Ue=()=>{g(""),m("QUICK"),c("")},Fe=()=>{g(""),u(""),b(!1)},ze=async r=>{r.preventDefault(),await qe({variables:{sendHugInput:{recipientId:h,type:p,message:v}}})},_e=async r=>{r.preventDefault(),await Ie({variables:{createHugRequestInput:{recipientId:j?null:h,message:d,isCommunityRequest:j}}})},Oe=async r=>{await Ge({variables:{id:r}})},J=async(r,Qe)=>{await De({variables:{respondToRequestInput:{requestId:r,accepted:Qe}}})},ue=async r=>{window.confirm("Are you sure you want to cancel this request?")&&await Pe({variables:{id:r}})},$e=()=>{o("/dashboard")};if(k)return e.jsx(We,{text:"Loading hug center..."});const me=((l==null?void 0:l.users)||[]).filter(r=>r.id!==(t==null?void 0:t.id)),he=(T==null?void 0:T.sentHugs)||[],ge=(y==null?void 0:y.receivedHugs)||[],pe=($==null?void 0:$.myHugRequests)||[],xe=(Y==null?void 0:Y.pendingHugRequests)||[],fe=(K==null?void 0:K.communityHugRequests)||[];return e.jsxs(Pr,{children:[e.jsx(Ur,{children:e.jsx(Fr,{onClick:$e,children:"HugMeNow"})}),e.jsxs(zr,{children:[e.jsx(_r,{children:"Hug Center"}),H&&e.jsx(rr,{error:H}),e.jsxs(Or,{children:[e.jsx(C,{active:s==="send",onClick:()=>a("send"),children:"Send a Hug"}),e.jsx(C,{active:s==="received",onClick:()=>a("received"),children:"Received Hugs"}),e.jsx(C,{active:s==="sent",onClick:()=>a("sent"),children:"Sent Hugs"}),e.jsx(C,{active:s==="request",onClick:()=>a("request"),children:"Request a Hug"}),e.jsx(C,{active:s==="myRequests",onClick:()=>a("myRequests"),children:"My Requests"}),e.jsx(C,{active:s==="pendingRequests",onClick:()=>a("pendingRequests"),children:"Pending Requests"}),e.jsx(C,{active:s==="communityRequests",onClick:()=>a("communityRequests"),children:"Community"}),e.jsx(C,{active:s==="hugsGallery",onClick:()=>a("hugsGallery"),children:"Cute Hugs Gallery"})]}),s==="send"&&e.jsxs(ve,{children:[e.jsx("h2",{children:"Send a Virtual Hug"}),e.jsx("p",{children:"Brighten someone's day with a virtual hug!"}),e.jsxs("form",{onSubmit:ze,children:[e.jsxs(G,{children:[e.jsx("label",{htmlFor:"recipient",children:"Select Recipient"}),e.jsxs(ye,{id:"recipient",value:h,onChange:r=>g(r.target.value),required:!0,children:[e.jsx("option",{value:"",children:"Select a user..."}),me.map(r=>e.jsxs("option",{value:r.id,children:[r.name," (",r.username,")"]},r.id))]})]}),e.jsxs(G,{children:[e.jsx("label",{children:"Hug Type"}),e.jsx($r,{children:["QUICK","WARM","SUPPORTIVE","COMFORTING","ENCOURAGING","CELEBRATORY"].map(r=>e.jsxs(Qr,{type:"button",selected:p===r,onClick:()=>m(r),children:[e.jsx("span",{className:"emoji",children:ne(r)}),e.jsx("span",{className:"label",children:ie(r)})]},r))})]}),e.jsxs(G,{children:[e.jsx("label",{htmlFor:"message",children:"Message (Optional)"}),e.jsx(be,{id:"message",value:v,onChange:r=>c(r.target.value),placeholder:"Add a personal message...",maxLength:500})]}),e.jsx(Ce,{type:"submit",disabled:!h||Ae,children:"Send Hug"})]})]}),s==="received"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Received Hugs"}),ge.length===0?e.jsxs(D,{children:[e.jsx("p",{children:"You haven't received any hugs yet."}),e.jsx("p",{children:"Hugs you receive will appear here."})]}):e.jsx(Ee,{children:ge.map(r=>e.jsxs(Re,{unread:!r.isRead,children:[e.jsxs(we,{children:[e.jsxs(I,{children:[e.jsx("div",{className:"avatar",children:U(r.sender.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.sender.name}),e.jsxs("div",{className:"username",children:["@",r.sender.username]})]})]}),e.jsx(L,{children:P(r.createdAt)})]}),e.jsxs(He,{children:[e.jsxs("div",{className:"hug-type",children:[e.jsx("span",{className:"emoji",children:ne(r.type)}),e.jsxs("span",{className:"type",children:[ie(r.type)," Hug"]})]}),r.message&&e.jsx("div",{className:"message",children:r.message})]}),!r.isRead&&e.jsx(Ne,{children:e.jsx("button",{onClick:()=>Oe(r.id),children:"Mark as Read"})})]},r.id))})]}),s==="sent"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Sent Hugs"}),he.length===0?e.jsxs(D,{children:[e.jsx("p",{children:"You haven't sent any hugs yet."}),e.jsx("p",{children:'Use the "Send a Hug" tab to send your first hug!'})]}):e.jsx(Ee,{children:he.map(r=>e.jsxs(Re,{children:[e.jsxs(we,{children:[e.jsxs(I,{children:[e.jsx("div",{className:"avatar",children:U(r.recipient.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.recipient.name}),e.jsxs("div",{className:"username",children:["@",r.recipient.username]})]})]}),e.jsx(L,{children:P(r.createdAt)})]}),e.jsxs(He,{children:[e.jsxs("div",{className:"hug-type",children:[e.jsx("span",{className:"emoji",children:ne(r.type)}),e.jsxs("span",{className:"type",children:[ie(r.type)," Hug"]})]}),r.message&&e.jsx("div",{className:"message",children:r.message})]}),e.jsx(Ne,{children:e.jsx("span",{children:r.isRead?"Read":"Unread"})})]},r.id))})]}),s==="request"&&e.jsxs(ve,{children:[e.jsx("h2",{children:"Request a Hug"}),e.jsx("p",{children:"Need a virtual hug? Request one here!"}),e.jsxs("form",{onSubmit:_e,children:[e.jsxs(G,{children:[e.jsx("label",{children:"Request Type"}),e.jsx("div",{style:{marginBottom:"1rem"},children:e.jsxs("label",{style:{display:"flex",alignItems:"center"},children:[e.jsx("input",{type:"checkbox",checked:j,onChange:()=>b(!j),style:{marginRight:"0.5rem"}}),"Request from the community"]})}),!j&&e.jsxs(ye,{value:h,onChange:r=>g(r.target.value),required:!j,children:[e.jsx("option",{value:"",children:"Select a specific user..."}),me.map(r=>e.jsxs("option",{value:r.id,children:[r.name," (",r.username,")"]},r.id))]})]}),e.jsxs(G,{children:[e.jsx("label",{htmlFor:"requestMessage",children:"Your Message"}),e.jsx(be,{id:"requestMessage",value:d,onChange:r=>u(r.target.value),placeholder:"Why do you need a hug today?",maxLength:500,required:!0})]}),e.jsx(Ce,{type:"submit",disabled:!j&&!h||!d||Le,children:"Request Hug"})]})]}),s==="myRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"My Hug Requests"}),pe.length===0?e.jsxs(D,{children:[e.jsx("p",{children:"You haven't created any hug requests yet."}),e.jsx("p",{children:'Use the "Request a Hug" tab to create your first request!'})]}):e.jsx(Z,{children:pe.map(r=>e.jsxs(ee,{status:r.status,children:[e.jsxs(re,{children:[e.jsx("div",{children:r.recipient?e.jsxs(I,{children:[e.jsx("div",{className:"avatar",children:U(r.recipient.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.recipient.name}),e.jsxs("div",{className:"username",children:["@",r.recipient.username]})]})]}):e.jsx("div",{children:"Community Request"})}),e.jsx(te,{status:r.status,children:ae(r.status)})]}),e.jsxs(se,{children:[e.jsx("div",{className:"message",children:r.message}),r.isCommunityRequest&&e.jsx("div",{className:"community-tag",children:"Community Request"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(L,{children:P(r.createdAt)}),r.status==="PENDING"&&e.jsx(z,{children:e.jsx("button",{className:"cancel-btn",onClick:()=>ue(r.id),children:"Cancel Request"})})]})]},r.id))})]}),s==="pendingRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Pending Requests For You"}),xe.length===0?e.jsxs(D,{children:[e.jsx("p",{children:"You don't have any pending hug requests."}),e.jsx("p",{children:"When someone requests a hug from you, it will appear here."})]}):e.jsx(Z,{children:xe.map(r=>e.jsxs(ee,{status:r.status,children:[e.jsxs(re,{children:[e.jsxs(I,{children:[e.jsx("div",{className:"avatar",children:U(r.requester.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.requester.name}),e.jsxs("div",{className:"username",children:["@",r.requester.username]})]})]}),e.jsx(te,{status:r.status,children:ae(r.status)})]}),e.jsx(se,{children:e.jsx("div",{className:"message",children:r.message})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(L,{children:P(r.createdAt)}),e.jsxs(z,{children:[e.jsx("button",{className:"accept-btn",onClick:()=>J(r.id,!0),children:"Accept"}),e.jsx("button",{className:"reject-btn",onClick:()=>J(r.id,!1),children:"Decline"})]})]})]},r.id))})]}),s==="communityRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Community Hug Requests"}),fe.length===0?e.jsxs(D,{children:[e.jsx("p",{children:"There are no active community hug requests."}),e.jsx("p",{children:"When someone requests a hug from the community, it will appear here."})]}):e.jsx(Z,{children:fe.map(r=>e.jsxs(ee,{status:r.status,children:[e.jsxs(re,{children:[e.jsxs(I,{children:[e.jsx("div",{className:"avatar",children:U(r.requester.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.requester.name}),e.jsxs("div",{className:"username",children:["@",r.requester.username]})]})]}),e.jsx(te,{status:r.status,children:ae(r.status)})]}),e.jsxs(se,{children:[e.jsx("div",{className:"message",children:r.message}),e.jsx("div",{className:"community-tag",children:"Community Request"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(L,{children:P(r.createdAt)}),r.status==="PENDING"&&r.requester.id!==(t==null?void 0:t.id)&&e.jsx(z,{children:e.jsx("button",{className:"accept-btn",onClick:()=>J(r.id,!0),children:"Send a Hug"})}),r.status==="PENDING"&&r.requester.id===(t==null?void 0:t.id)&&e.jsx(z,{children:e.jsx("button",{className:"cancel-btn",onClick:()=>ue(r.id),children:"Cancel Request"})})]})]},r.id))})]}),s==="hugsGallery"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Cute Hugs Gallery"}),e.jsx("p",{children:"Express your feelings with these adorable themed hugs!"}),e.jsx(Dr,{})]})]})]})};export{Vr as default};
//# sourceMappingURL=HugCenter-2618fa3a.js.map
