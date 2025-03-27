import{d as t,m as H,r as o,j as e,k as ze}from"./animal-hug-gallery-c3231598.js";import{d as Oe,u as Qe,a as Ye,c as x,L as $e,S as Be,M as We,e as Ve,f as Ke,g as Je}from"./main-3b4fc238.js";import{u as h,E as Xe,c as Ze,d as er,e as rr,f as sr,g as tr,h as ir}from"./ErrorMessage-31bb56d7.js";import"./hug-icons-606bad4c.js";const nr=t.div`
  margin: 2rem 0;
  background: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  overflow: hidden;
`,ar=t.h2`
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
`,or=t.p`
  text-align: center;
  color: var(--gray-600);
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`,dr=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
`,lr=t(H.div)`
  background: ${s=>s.bgColor||"var(--background-color, #f8f9fa)"};
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
`,cr=t.div`
  height: 180px;
  width: 100%;
  background: ${s=>s.bgColor||"var(--primary-light)"};
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
`,mr=t.div`
  padding: 1.25rem;
  background: white;
`,ur=t.h3`
  font-size: 1.1rem;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
  font-weight: 600;
`,gr=t.p`
  font-size: 0.9rem;
  color: var(--gray-600);
  margin-bottom: 1rem;
  line-height: 1.5;
`,hr=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--gray-500);
`,ge=t.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`,pr=t(H.div)`
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
`,xr=t(H.div)`
  background: white;
  border-radius: var(--border-radius-lg);
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
`,jr=t.div`
  background: var(--primary-color);
  color: white;
  padding: 1.5rem;
  text-align: center;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
`,vr=t.div`
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
`,yr=t.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--gray-200);
  display: flex;
  justify-content: center;
`,br=t.button`
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
`,fr=[{id:1,title:"Warm Embrace",emoji:"🤗",leftEmoji:"💫",rightEmoji:"✨",description:"A heartfelt hug that brings warmth and comfort",message:"Sending you warm thoughts and a gentle embrace to make your day brighter!",color:"#FFE9C8"},{id:2,title:"Supportive Squeeze",emoji:"🫂",leftEmoji:"💪",rightEmoji:"🌈",description:"A supportive hug to help you through tough times",message:"You're not alone! This supportive hug comes with the strength you need to keep going.",color:"#D4F5FF"},{id:3,title:"Bear Hug",emoji:"🧸",leftEmoji:"🌟",rightEmoji:"✨",description:"A big, strong hug that surrounds you completely",message:"Wrapping you in a big bear hug! Feel the comfort and know that you're cherished.",color:"#FFD1DC"},{id:4,title:"Butterfly Hug",emoji:"🦋",leftEmoji:"🌼",rightEmoji:"🌸",description:"A gentle, light hug like butterfly wings",message:"Like the gentle flutter of butterfly wings, this soft hug brings peace and calm to your heart.",color:"#E0F4FF"},{id:5,title:"Healing Hug",emoji:"💖",leftEmoji:"✨",rightEmoji:"🌟",description:"A restorative hug with healing energy",message:"This healing hug carries positive energy to help restore your spirit and soothe your soul.",color:"#D9F2D9"},{id:6,title:"Celebration Hug",emoji:"🎉",leftEmoji:"🥳",rightEmoji:"🎊",description:"A joyful hug to celebrate your achievements",message:"Congratulations! This hug celebrates you and all your wonderful accomplishments!",color:"#FFE8D6"}],Cr=()=>{const{colorPalette:s}=Oe(),[a,i]=o.useState(null),[l,c]=o.useState([]);o.useEffect(()=>{const n=[...fr].sort(()=>Math.random()-.5);c(n)},[s.id]);const g=n=>{i(n)},p=()=>{i(null)},E={hidden:{opacity:0},visible:{opacity:1,transition:{when:"beforeChildren",staggerChildren:.1}}},R={hidden:{y:20,opacity:0},visible:{y:0,opacity:1,transition:{type:"spring",stiffness:100}}};return e.jsxs(nr,{children:[e.jsxs(ar,{children:[e.jsx("span",{className:"emoji",children:"🤗"}),"Cute Hugs Gallery",e.jsx("span",{className:"emoji",children:"💕"})]}),e.jsx(or,{children:"Express your feelings with these adorable themed hugs. Each hug carries a special meaning and energy to brighten someone's day or provide comfort when needed."}),e.jsx(H.div,{variants:E,initial:"hidden",animate:"visible",children:e.jsx(dr,{children:l.map(n=>e.jsxs(lr,{bgColor:n.color,onClick:()=>g(n),variants:R,children:[e.jsx(cr,{bgColor:n.color,children:e.jsxs("div",{className:"hug-animation",children:[e.jsx("span",{className:"emoji-left",children:n.leftEmoji}),e.jsx("span",{className:"hug-emoji",children:n.emoji}),e.jsx("span",{className:"emoji-right",children:n.rightEmoji})]})}),e.jsxs(mr,{children:[e.jsx(ur,{children:n.title}),e.jsx(gr,{children:n.description}),e.jsxs(hr,{children:[e.jsxs(ge,{children:[e.jsx("span",{children:"💌"})," Send this hug"]}),e.jsxs(ge,{children:[e.jsx("span",{children:"💝"})," Perfect match"]})]})]})]},n.id))})}),e.jsx(ze,{children:a&&e.jsx(pr,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:p,children:e.jsxs(xr,{initial:{y:50,opacity:0},animate:{y:0,opacity:1},exit:{y:50,opacity:0},onClick:n=>n.stopPropagation(),children:[e.jsx(jr,{children:e.jsx("h3",{children:a.title})}),e.jsxs(vr,{children:[e.jsx("span",{className:"hug-large-emoji",children:a.emoji}),e.jsx("p",{children:a.message}),e.jsxs("p",{children:["Perfect for: moments when you want to share ",a.title.toLowerCase()," with someone who needs it. This style of hug is especially helpful for expressing your care and support in a gentle, meaningful way."]})]}),e.jsx(yr,{children:e.jsx(br,{onClick:p,children:"Send This Hug"})})]})})})]})},Er=t.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,Rr=t.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,wr=t.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`,Hr=t.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,Nr=t.h1`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
`,kr=t.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--gray-300);
`,m=t.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${s=>s.active?"var(--primary-color)":"transparent"};
  font-weight: ${s=>s.active?"500":"normal"};
  color: ${s=>s.active?"var(--primary-color)":"var(--gray-600)"};
  cursor: pointer;
  transition: var(--transition-base);
  
  &:hover {
    color: var(--primary-color);
  }
`,he=t.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,j=t.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: var(--gray-700);
  }
`,pe=t.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--gray-300);
  border-radius: var(--border-radius);
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
`,xe=t.textarea`
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
`,Sr=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`,Tr=t.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 2px solid ${s=>s.selected?"var(--primary-color)":"var(--gray-200)"};
  border-radius: var(--border-radius);
  background-color: ${s=>s.selected?"var(--primary-light)":"white"};
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
    font-weight: ${s=>s.selected?"500":"normal"};
    color: ${s=>s.selected?"var(--primary-color)":"var(--gray-700)"};
  }
`,je=t.button`
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
`,ve=t.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`,ye=t.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${s=>s.unread?"var(--primary-color)":"transparent"};
`,be=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,v=t.div`
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
`,y=t.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,fe=t.div`
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
`,Ce=t.div`
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
`,z=t.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`,O=t.div`
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  border-left: 4px solid ${s=>s.status==="PENDING"?"var(--warning-color)":s.status==="ACCEPTED"?"var(--success-color)":s.status==="REJECTED"?"var(--danger-color)":s.status==="CANCELLED"?"var(--gray-500)":"transparent"};
`,Q=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,Y=t.div`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  
  background-color: ${s=>s.status==="PENDING"?"var(--warning-light)":s.status==="ACCEPTED"?"var(--success-light)":s.status==="REJECTED"?"var(--danger-light)":s.status==="CANCELLED"?"var(--gray-200)":"transparent"};
  
  color: ${s=>s.status==="PENDING"?"var(--warning-color)":s.status==="ACCEPTED"?"var(--success-color)":s.status==="REJECTED"?"var(--danger-color)":(s.status==="CANCELLED","var(--gray-700)")};
`,$=t.div`
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
`,w=t.div`
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
`,b=t.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,B=s=>({QUICK:"🤗",WARM:"💗",SUPPORTIVE:"💪",COMFORTING:"🌈",ENCOURAGING:"✨",CELEBRATORY:"🎉"})[s]||"🤗",W=s=>({QUICK:"Quick",WARM:"Warm",SUPPORTIVE:"Supportive",COMFORTING:"Comforting",ENCOURAGING:"Encouraging",CELEBRATORY:"Celebratory"})[s]||"Quick",V=s=>({PENDING:"Pending",ACCEPTED:"Accepted",REJECTED:"Rejected",CANCELLED:"Cancelled"})[s]||"Unknown",f=s=>new Date(s).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),C=s=>s?s.split(" ").map(a=>a[0]).join("").toUpperCase().substring(0,2):"?",Dr=()=>{const{currentUser:s}=Qe(),a=Ye(),[i,l]=o.useState("send"),[c,g]=o.useState(""),[p,E]=o.useState("QUICK"),[R,n]=o.useState(""),[N,K]=o.useState(""),[u,J]=o.useState(!1),[Ee,Re]=o.useState(!0),[X,d]=o.useState(null),{data:k,loading:Z,error:S}=h(Ze),{data:T,loading:ee,error:q,refetch:we}=h(er),{data:A,loading:re,error:G,refetch:He}=h(rr),{data:I,loading:se,error:M,refetch:te}=h(sr),{data:D,loading:ie,error:L,refetch:Ne}=h(tr),{data:U,loading:ne,error:P,refetch:F}=h(ir),[ke,{loading:Se}]=x(Be,{onCompleted:()=>{we(),Me()},onError:r=>{d(r.message)}}),[Te]=x(We,{onCompleted:()=>{He()},onError:r=>{d(r.message)}}),[qe,{loading:Ae}]=x(Ve,{onCompleted:()=>{te(),F(),De()},onError:r=>{d(r.message)}}),[Ge]=x(Ke,{onCompleted:()=>{Ne(),F()},onError:r=>{d(r.message)}}),[Ie]=x(Je,{onCompleted:()=>{te(),F()},onError:r=>{d(r.message)}});o.useEffect(()=>{Re(Z||ee||re||se||ie||ne),S&&d(S.message),q&&d(q.message),G&&d(G.message),M&&d(M.message),L&&d(L.message),P&&d(P.message)},[Z,ee,re,se,ie,ne,S,q,G,M,L,P]);const Me=()=>{g(""),E("QUICK"),n("")},De=()=>{g(""),K(""),J(!1)},Le=async r=>{r.preventDefault(),await ke({variables:{sendHugInput:{recipientId:c,type:p,message:R}}})},Ue=async r=>{r.preventDefault(),await qe({variables:{createHugRequestInput:{recipientId:u?null:c,message:N,isCommunityRequest:u}}})},Pe=async r=>{await Te({variables:{id:r}})},_=async(r,_e)=>{await Ge({variables:{respondToRequestInput:{requestId:r,accepted:_e}}})},ae=async r=>{window.confirm("Are you sure you want to cancel this request?")&&await Ie({variables:{id:r}})},Fe=()=>{a("/dashboard")};if(Ee)return e.jsx($e,{text:"Loading hug center..."});const oe=((k==null?void 0:k.users)||[]).filter(r=>r.id!==(s==null?void 0:s.id)),de=(T==null?void 0:T.sentHugs)||[],le=(A==null?void 0:A.receivedHugs)||[],ce=(I==null?void 0:I.myHugRequests)||[],me=(D==null?void 0:D.pendingHugRequests)||[],ue=(U==null?void 0:U.communityHugRequests)||[];return e.jsxs(Er,{children:[e.jsx(Rr,{children:e.jsx(wr,{onClick:Fe,children:"HugMeNow"})}),e.jsxs(Hr,{children:[e.jsx(Nr,{children:"Hug Center"}),X&&e.jsx(Xe,{error:X}),e.jsxs(kr,{children:[e.jsx(m,{active:i==="send",onClick:()=>l("send"),children:"Send a Hug"}),e.jsx(m,{active:i==="received",onClick:()=>l("received"),children:"Received Hugs"}),e.jsx(m,{active:i==="sent",onClick:()=>l("sent"),children:"Sent Hugs"}),e.jsx(m,{active:i==="request",onClick:()=>l("request"),children:"Request a Hug"}),e.jsx(m,{active:i==="myRequests",onClick:()=>l("myRequests"),children:"My Requests"}),e.jsx(m,{active:i==="pendingRequests",onClick:()=>l("pendingRequests"),children:"Pending Requests"}),e.jsx(m,{active:i==="communityRequests",onClick:()=>l("communityRequests"),children:"Community"}),e.jsx(m,{active:i==="hugsGallery",onClick:()=>l("hugsGallery"),children:"Cute Hugs Gallery"})]}),i==="send"&&e.jsxs(he,{children:[e.jsx("h2",{children:"Send a Virtual Hug"}),e.jsx("p",{children:"Brighten someone's day with a virtual hug!"}),e.jsxs("form",{onSubmit:Le,children:[e.jsxs(j,{children:[e.jsx("label",{htmlFor:"recipient",children:"Select Recipient"}),e.jsxs(pe,{id:"recipient",value:c,onChange:r=>g(r.target.value),required:!0,children:[e.jsx("option",{value:"",children:"Select a user..."}),oe.map(r=>e.jsxs("option",{value:r.id,children:[r.name," (",r.username,")"]},r.id))]})]}),e.jsxs(j,{children:[e.jsx("label",{children:"Hug Type"}),e.jsx(Sr,{children:["QUICK","WARM","SUPPORTIVE","COMFORTING","ENCOURAGING","CELEBRATORY"].map(r=>e.jsxs(Tr,{type:"button",selected:p===r,onClick:()=>E(r),children:[e.jsx("span",{className:"emoji",children:B(r)}),e.jsx("span",{className:"label",children:W(r)})]},r))})]}),e.jsxs(j,{children:[e.jsx("label",{htmlFor:"message",children:"Message (Optional)"}),e.jsx(xe,{id:"message",value:R,onChange:r=>n(r.target.value),placeholder:"Add a personal message...",maxLength:500})]}),e.jsx(je,{type:"submit",disabled:!c||Se,children:"Send Hug"})]})]}),i==="received"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Received Hugs"}),le.length===0?e.jsxs(b,{children:[e.jsx("p",{children:"You haven't received any hugs yet."}),e.jsx("p",{children:"Hugs you receive will appear here."})]}):e.jsx(ve,{children:le.map(r=>e.jsxs(ye,{unread:!r.isRead,children:[e.jsxs(be,{children:[e.jsxs(v,{children:[e.jsx("div",{className:"avatar",children:C(r.sender.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.sender.name}),e.jsxs("div",{className:"username",children:["@",r.sender.username]})]})]}),e.jsx(y,{children:f(r.createdAt)})]}),e.jsxs(fe,{children:[e.jsxs("div",{className:"hug-type",children:[e.jsx("span",{className:"emoji",children:B(r.type)}),e.jsxs("span",{className:"type",children:[W(r.type)," Hug"]})]}),r.message&&e.jsx("div",{className:"message",children:r.message})]}),!r.isRead&&e.jsx(Ce,{children:e.jsx("button",{onClick:()=>Pe(r.id),children:"Mark as Read"})})]},r.id))})]}),i==="sent"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Sent Hugs"}),de.length===0?e.jsxs(b,{children:[e.jsx("p",{children:"You haven't sent any hugs yet."}),e.jsx("p",{children:'Use the "Send a Hug" tab to send your first hug!'})]}):e.jsx(ve,{children:de.map(r=>e.jsxs(ye,{children:[e.jsxs(be,{children:[e.jsxs(v,{children:[e.jsx("div",{className:"avatar",children:C(r.recipient.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.recipient.name}),e.jsxs("div",{className:"username",children:["@",r.recipient.username]})]})]}),e.jsx(y,{children:f(r.createdAt)})]}),e.jsxs(fe,{children:[e.jsxs("div",{className:"hug-type",children:[e.jsx("span",{className:"emoji",children:B(r.type)}),e.jsxs("span",{className:"type",children:[W(r.type)," Hug"]})]}),r.message&&e.jsx("div",{className:"message",children:r.message})]}),e.jsx(Ce,{children:e.jsx("span",{children:r.isRead?"Read":"Unread"})})]},r.id))})]}),i==="request"&&e.jsxs(he,{children:[e.jsx("h2",{children:"Request a Hug"}),e.jsx("p",{children:"Need a virtual hug? Request one here!"}),e.jsxs("form",{onSubmit:Ue,children:[e.jsxs(j,{children:[e.jsx("label",{children:"Request Type"}),e.jsx("div",{style:{marginBottom:"1rem"},children:e.jsxs("label",{style:{display:"flex",alignItems:"center"},children:[e.jsx("input",{type:"checkbox",checked:u,onChange:()=>J(!u),style:{marginRight:"0.5rem"}}),"Request from the community"]})}),!u&&e.jsxs(pe,{value:c,onChange:r=>g(r.target.value),required:!u,children:[e.jsx("option",{value:"",children:"Select a specific user..."}),oe.map(r=>e.jsxs("option",{value:r.id,children:[r.name," (",r.username,")"]},r.id))]})]}),e.jsxs(j,{children:[e.jsx("label",{htmlFor:"requestMessage",children:"Your Message"}),e.jsx(xe,{id:"requestMessage",value:N,onChange:r=>K(r.target.value),placeholder:"Why do you need a hug today?",maxLength:500,required:!0})]}),e.jsx(je,{type:"submit",disabled:!u&&!c||!N||Ae,children:"Request Hug"})]})]}),i==="myRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"My Hug Requests"}),ce.length===0?e.jsxs(b,{children:[e.jsx("p",{children:"You haven't created any hug requests yet."}),e.jsx("p",{children:'Use the "Request a Hug" tab to create your first request!'})]}):e.jsx(z,{children:ce.map(r=>e.jsxs(O,{status:r.status,children:[e.jsxs(Q,{children:[e.jsx("div",{children:r.recipient?e.jsxs(v,{children:[e.jsx("div",{className:"avatar",children:C(r.recipient.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.recipient.name}),e.jsxs("div",{className:"username",children:["@",r.recipient.username]})]})]}):e.jsx("div",{children:"Community Request"})}),e.jsx(Y,{status:r.status,children:V(r.status)})]}),e.jsxs($,{children:[e.jsx("div",{className:"message",children:r.message}),r.isCommunityRequest&&e.jsx("div",{className:"community-tag",children:"Community Request"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(y,{children:f(r.createdAt)}),r.status==="PENDING"&&e.jsx(w,{children:e.jsx("button",{className:"cancel-btn",onClick:()=>ae(r.id),children:"Cancel Request"})})]})]},r.id))})]}),i==="pendingRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Pending Requests For You"}),me.length===0?e.jsxs(b,{children:[e.jsx("p",{children:"You don't have any pending hug requests."}),e.jsx("p",{children:"When someone requests a hug from you, it will appear here."})]}):e.jsx(z,{children:me.map(r=>e.jsxs(O,{status:r.status,children:[e.jsxs(Q,{children:[e.jsxs(v,{children:[e.jsx("div",{className:"avatar",children:C(r.requester.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.requester.name}),e.jsxs("div",{className:"username",children:["@",r.requester.username]})]})]}),e.jsx(Y,{status:r.status,children:V(r.status)})]}),e.jsx($,{children:e.jsx("div",{className:"message",children:r.message})}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(y,{children:f(r.createdAt)}),e.jsxs(w,{children:[e.jsx("button",{className:"accept-btn",onClick:()=>_(r.id,!0),children:"Accept"}),e.jsx("button",{className:"reject-btn",onClick:()=>_(r.id,!1),children:"Decline"})]})]})]},r.id))})]}),i==="communityRequests"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Community Hug Requests"}),ue.length===0?e.jsxs(b,{children:[e.jsx("p",{children:"There are no active community hug requests."}),e.jsx("p",{children:"When someone requests a hug from the community, it will appear here."})]}):e.jsx(z,{children:ue.map(r=>e.jsxs(O,{status:r.status,children:[e.jsxs(Q,{children:[e.jsxs(v,{children:[e.jsx("div",{className:"avatar",children:C(r.requester.name)}),e.jsxs("div",{children:[e.jsx("div",{className:"name",children:r.requester.name}),e.jsxs("div",{className:"username",children:["@",r.requester.username]})]})]}),e.jsx(Y,{status:r.status,children:V(r.status)})]}),e.jsxs($,{children:[e.jsx("div",{className:"message",children:r.message}),e.jsx("div",{className:"community-tag",children:"Community Request"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx(y,{children:f(r.createdAt)}),r.status==="PENDING"&&r.requester.id!==(s==null?void 0:s.id)&&e.jsx(w,{children:e.jsx("button",{className:"accept-btn",onClick:()=>_(r.id,!0),children:"Send a Hug"})}),r.status==="PENDING"&&r.requester.id===(s==null?void 0:s.id)&&e.jsx(w,{children:e.jsx("button",{className:"cancel-btn",onClick:()=>ae(r.id),children:"Cancel Request"})})]})]},r.id))})]}),i==="hugsGallery"&&e.jsxs("div",{children:[e.jsx("h2",{children:"Cute Hugs Gallery"}),e.jsx("p",{children:"Express your feelings with these adorable themed hugs!"}),e.jsx(Cr,{})]})]})]})};export{Dr as default};
//# sourceMappingURL=HugCenter-da4c07c6.js.map
