import{d as o,u as V,a as G,r as a,j as e,L as K}from"./main-0012ce0c.js";import{u as C,b as j,E as B,c as Q,d as W,C as X,U as q,R as J}from"./mutations-a04fa3c5.js";const Z=o.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,$=o.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,ee=o.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  cursor: pointer;
`,re=o.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,oe=o.h1`
  margin-bottom: 1.5rem;
  color: var(--gray-800);
`,te=o.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,ae=o.div`
  margin: 2rem 0;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--gray-700);
  }
  
  .slider-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .emoji-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.5rem;
    font-size: 1.5rem;
  }
  
  input[type="range"] {
    width: 100%;
    margin: 1rem 0;
  }
  
  .mood-label {
    font-weight: 500;
    margin-top: 0.5rem;
    color: var(--primary-color);
  }
`,ie=o.div`
  margin: 1.5rem 0;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--gray-700);
  }
  
  textarea {
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
  }
`,ne=o.div`
  margin: 1.5rem 0;
  
  h3 {
    margin-bottom: 1rem;
    color: var(--gray-700);
  }
  
  .toggle-container {
    display: flex;
    align-items: center;
  }
  
  .toggle {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;
    margin-right: 1rem;
    
    input {
      opacity: 0;
      width: 0;
      height: 0;
      
      &:checked + .slider {
        background-color: var(--primary-color);
      }
      
      &:checked + .slider:before {
        transform: translateX(24px);
      }
    }
    
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--gray-300);
      transition: .4s;
      border-radius: 34px;
      
      &:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
    }
  }
  
  .toggle-label {
    color: var(--gray-700);
  }
`,L=o.button`
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
`,se=o.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
`,de=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
  
  .streak {
    display: flex;
    align-items: center;
    color: var(--primary-color);
    font-weight: 500;
    
    span {
      margin-left: 0.5rem;
    }
  }
`,le=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`,ce=o.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
  }
`,me=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,ge=o.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,he=o.div`
  display: flex;
  align-items: flex-start;
  
  .emoji {
    font-size: 2rem;
    margin-right: 1rem;
  }
  
  .mood-details {
    flex: 1;
  }
  
  .mood-score {
    font-weight: 500;
    color: var(--gray-800);
    margin-bottom: 0.25rem;
  }
  
  .mood-note {
    font-size: 0.9rem;
    color: var(--gray-700);
    margin-bottom: 0.5rem;
  }
  
  .is-public {
    font-size: 0.8rem;
    color: var(--primary-color);
  }
`,ue=o.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  
  button {
    background: none;
    border: none;
    font-size: 0.9rem;
    cursor: pointer;
  }
  
  .edit-btn {
    color: var(--primary-color);
  }
  
  .delete-btn {
    color: var(--danger-color);
  }
`,pe=o.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,T=t=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(t)-1,4)],D=t=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(t)-1,4)],xe=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),ye=()=>{V();const t=G(),[l,H]=a.useState(!0),[f,i]=a.useState(null),[n,c]=a.useState(3),[m,g]=a.useState(""),[s,h]=a.useState(!0),[d,M]=a.useState(null),{data:u,loading:w,error:p,refetch:x}=C(Q),{data:b,loading:k,error:v,refetch:E}=C(W),[O,{loading:I}]=j(X,{onCompleted:()=>{y(),x(),E()},onError:r=>{i(r.message)}}),[A,{loading:P}]=j(q,{onCompleted:()=>{y(),x()},onError:r=>{i(r.message)}}),[z,{loading:S}]=j(J,{onCompleted:()=>{x(),E()},onError:r=>{i(r.message)}});a.useEffect(()=>{H(w||k),p&&i(p.message),v&&i(v.message)},[w,k,p,v]);const y=()=>{c(3),g(""),h(!0),M(null)},_=async r=>{r.preventDefault(),d?await A({variables:{updateMoodInput:{id:d.id,intensity:n,note:m,isPublic:s}}}):await O({variables:{createMoodInput:{intensity:n,note:m,isPublic:s}}})},R=r=>{M(r),c(r.intensity),g(r.note||""),h(r.isPublic),window.scrollTo({top:0,behavior:"smooth"})},U=async r=>{window.confirm("Are you sure you want to delete this mood entry?")&&await z({variables:{id:r}})},Y=()=>{t("/dashboard")};if(l)return e.jsx(K,{text:"Loading mood tracker..."});const N=(u==null?void 0:u.userMoods)||[],F=(b==null?void 0:b.moodStreak)||0;return e.jsxs(Z,{children:[e.jsx($,{children:e.jsx(ee,{onClick:Y,children:"HugMeNow"})}),e.jsxs(re,{children:[e.jsx(oe,{children:"Mood Tracker"}),f&&e.jsx(B,{error:f}),e.jsxs(te,{children:[e.jsx("h2",{children:d?"Edit Mood Entry":"How Are You Feeling Today?"}),e.jsxs("form",{onSubmit:_,children:[e.jsxs(ae,{children:[e.jsx("h3",{children:"Your Mood"}),e.jsxs("div",{className:"slider-container",children:[e.jsxs("div",{className:"emoji-container",children:[e.jsx("span",{children:"😢"}),e.jsx("span",{children:"😟"}),e.jsx("span",{children:"😐"}),e.jsx("span",{children:"🙂"}),e.jsx("span",{children:"😄"})]}),e.jsx("input",{type:"range",min:"1",max:"5",step:"1",value:n,onChange:r=>c(parseInt(r.target.value))}),e.jsxs("div",{className:"mood-label",children:[T(n)," ",D(n)]})]})]}),e.jsxs(ie,{children:[e.jsx("h3",{children:"Add a Note (Optional)"}),e.jsx("textarea",{value:m,onChange:r=>g(r.target.value),placeholder:"What's making you feel this way?",maxLength:500})]}),e.jsxs(ne,{children:[e.jsx("h3",{children:"Privacy"}),e.jsxs("div",{className:"toggle-container",children:[e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:s,onChange:()=>h(!s)}),e.jsx("span",{className:"slider"})]}),e.jsx("span",{className:"toggle-label",children:s?"Share with community":"Keep private"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsxs(L,{type:"submit",disabled:I||P,children:[d?"Update":"Save"," Mood"]}),d&&e.jsx(L,{type:"button",onClick:y,style:{backgroundColor:"var(--gray-500)"},children:"Cancel"})]})]})]}),e.jsxs(se,{children:[e.jsxs(de,{children:[e.jsx("h2",{children:"Your Mood History"}),e.jsx("div",{className:"streak",children:e.jsxs("span",{children:["🔥 ",F," Day Streak"]})})]}),N.length===0?e.jsxs(pe,{children:[e.jsx("p",{children:"You haven't tracked any moods yet."}),e.jsx("p",{children:"Use the form above to record your first mood entry!"})]}):e.jsx(le,{children:N.map(r=>e.jsxs(ce,{children:[e.jsx(me,{children:e.jsx(ge,{children:xe(r.createdAt)})}),e.jsxs(he,{children:[e.jsx("div",{className:"emoji",children:T(r.intensity)}),e.jsxs("div",{className:"mood-details",children:[e.jsx("div",{className:"mood-score",children:D(r.intensity)}),r.note&&e.jsx("div",{className:"mood-note",children:r.note}),e.jsx("div",{className:"is-public",children:r.isPublic?"Shared with community":"Private"})]})]}),e.jsxs(ue,{children:[e.jsx("button",{className:"edit-btn",onClick:()=>R(r),disabled:S,children:"Edit"}),e.jsx("button",{className:"delete-btn",onClick:()=>U(r.id),disabled:S,children:"Delete"})]})]},r.id))})]})]})]})};export{ye as default};
//# sourceMappingURL=MoodTracker-3654e5dd.js.map
