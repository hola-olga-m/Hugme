import{d as o,r as a,j as e}from"./animal-hug-gallery-c3231598.js";import{u as V,a as G,c as j,L as K,C as B,U as Q,R as W}from"./main-3b4fc238.js";import{u as C,E as X,a as q,b as J}from"./ErrorMessage-31bb56d7.js";import"./hug-icons-606bad4c.js";const Z=o.div`
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
`,se=o.div`
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
`,ne=o.div`
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
`,ce=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
`,le=o.div`
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
`,T=t=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(t)-1,4)],D=t=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(t)-1,4)],xe=t=>new Date(t).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"}),fe=()=>{V();const t=G(),[c,H]=a.useState(!0),[f,i]=a.useState(null),[s,l]=a.useState(3),[m,g]=a.useState(""),[n,h]=a.useState(!0),[d,M]=a.useState(null),{data:u,loading:w,error:p,refetch:x}=C(q),{data:b,loading:k,error:v,refetch:S}=C(J),[O,{loading:A}]=j(B,{onCompleted:()=>{y(),x(),S()},onError:r=>{i(r.message)}}),[I,{loading:P}]=j(Q,{onCompleted:()=>{y(),x()},onError:r=>{i(r.message)}}),[z,{loading:E}]=j(W,{onCompleted:()=>{x(),S()},onError:r=>{i(r.message)}});a.useEffect(()=>{H(w||k),p&&i(p.message),v&&i(v.message)},[w,k,p,v]);const y=()=>{l(3),g(""),h(!0),M(null)},_=async r=>{r.preventDefault(),d?await I({variables:{updateMoodInput:{id:d.id,score:s,note:m,isPublic:n}}}):await O({variables:{createMoodInput:{score:s,note:m,isPublic:n}}})},R=r=>{M(r),l(r.score),g(r.note||""),h(r.isPublic),window.scrollTo({top:0,behavior:"smooth"})},U=async r=>{window.confirm("Are you sure you want to delete this mood entry?")&&await z({variables:{id:r}})},Y=()=>{t("/dashboard")};if(c)return e.jsx(K,{text:"Loading mood tracker..."});const N=(u==null?void 0:u.userMoods)||[],F=(b==null?void 0:b.moodStreak)||0;return e.jsxs(Z,{children:[e.jsx($,{children:e.jsx(ee,{onClick:Y,children:"HugMeNow"})}),e.jsxs(re,{children:[e.jsx(oe,{children:"Mood Tracker"}),f&&e.jsx(X,{error:f}),e.jsxs(te,{children:[e.jsx("h2",{children:d?"Edit Mood Entry":"How Are You Feeling Today?"}),e.jsxs("form",{onSubmit:_,children:[e.jsxs(ae,{children:[e.jsx("h3",{children:"Your Mood"}),e.jsxs("div",{className:"slider-container",children:[e.jsxs("div",{className:"emoji-container",children:[e.jsx("span",{children:"😢"}),e.jsx("span",{children:"😟"}),e.jsx("span",{children:"😐"}),e.jsx("span",{children:"🙂"}),e.jsx("span",{children:"😄"})]}),e.jsx("input",{type:"range",min:"1",max:"5",step:"1",value:s,onChange:r=>l(parseInt(r.target.value))}),e.jsxs("div",{className:"mood-label",children:[T(s)," ",D(s)]})]})]}),e.jsxs(ie,{children:[e.jsx("h3",{children:"Add a Note (Optional)"}),e.jsx("textarea",{value:m,onChange:r=>g(r.target.value),placeholder:"What's making you feel this way?",maxLength:500})]}),e.jsxs(se,{children:[e.jsx("h3",{children:"Privacy"}),e.jsxs("div",{className:"toggle-container",children:[e.jsxs("label",{className:"toggle",children:[e.jsx("input",{type:"checkbox",checked:n,onChange:()=>h(!n)}),e.jsx("span",{className:"slider"})]}),e.jsx("span",{className:"toggle-label",children:n?"Share with community":"Keep private"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"1rem"},children:[e.jsxs(L,{type:"submit",disabled:A||P,children:[d?"Update":"Save"," Mood"]}),d&&e.jsx(L,{type:"button",onClick:y,style:{backgroundColor:"var(--gray-500)"},children:"Cancel"})]})]})]}),e.jsxs(ne,{children:[e.jsxs(de,{children:[e.jsx("h2",{children:"Your Mood History"}),e.jsx("div",{className:"streak",children:e.jsxs("span",{children:["🔥 ",F," Day Streak"]})})]}),N.length===0?e.jsxs(pe,{children:[e.jsx("p",{children:"You haven't tracked any moods yet."}),e.jsx("p",{children:"Use the form above to record your first mood entry!"})]}):e.jsx(ce,{children:N.map(r=>e.jsxs(le,{children:[e.jsx(me,{children:e.jsx(ge,{children:xe(r.createdAt)})}),e.jsxs(he,{children:[e.jsx("div",{className:"emoji",children:T(r.score)}),e.jsxs("div",{className:"mood-details",children:[e.jsx("div",{className:"mood-score",children:D(r.score)}),r.note&&e.jsx("div",{className:"mood-note",children:r.note}),e.jsx("div",{className:"is-public",children:r.isPublic?"Shared with community":"Private"})]})]}),e.jsxs(ue,{children:[e.jsx("button",{className:"edit-btn",onClick:()=>R(r),disabled:E,children:"Edit"}),e.jsx("button",{className:"delete-btn",onClick:()=>U(r.id),disabled:E,children:"Delete"})]})]},r.id))})]})]})]})};export{fe as default};
//# sourceMappingURL=MoodTracker-e3c3d8bb.js.map
