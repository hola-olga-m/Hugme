import{j as e,u as b,r as m,G as y,a as w,b as i}from"./main-0012ce0c.js";import{u as f}from"./useTranslation-03a0810f.js";import{u as M}from"./useMeshSdk-3d4c1d79.js";const k=()=>{const{i18n:c}=f(),a=[{code:"en",name:"English"},{code:"ru",name:"Русский"}],s=c.language||"en",d=o=>{const t=o.target.value;c.changeLanguage(t),localStorage.setItem("preferredLanguage",t)};return e.jsx("div",{className:"language-switcher",children:e.jsx("select",{value:s,onChange:d,"aria-label":"Select language",children:a.map(o=>e.jsx("option",{value:o.code,children:o.name},o.code))})})};function C({children:c}){const{t:a}=f(),{currentUser:s,logout:d,isAuthenticated:o}=b(),[t,h]=m.useState(!1),[j,x]=m.useState(!1),r=y(),u=w();m.useEffect(()=>{h(!1),x(!1)},[r]);const n=()=>{h(!t)},l=()=>{x(!j)},g=()=>{d(),u("/")},N=p=>{if(!p)return"?";const v=p.split(" ");return v.length>1?`${v[0][0]}${v[1][0]}`.toUpperCase():p.substring(0,2).toUpperCase()};return e.jsxs("div",{className:"app-container",children:[e.jsx("header",{className:"app-header",children:e.jsxs("div",{className:"header-content",children:[e.jsx("div",{className:"header-left",children:e.jsxs(i,{to:"/",className:"logo",children:[e.jsx("span",{className:"logo-icon",children:"🤗"}),e.jsx("span",{className:"logo-text",children:"HugMeNow"})]})}),o()&&e.jsx("nav",{className:`main-nav ${t?"open":""}`,children:e.jsxs("ul",{className:"nav-list",children:[e.jsx("li",{className:"nav-item",children:e.jsx(i,{to:"/dashboard",className:r.pathname==="/dashboard"?"active":"",children:a("navigation.dashboard")})}),e.jsx("li",{className:"nav-item",children:e.jsx(i,{to:"/mood-tracker",className:r.pathname==="/mood-tracker"?"active":"",children:a("navigation.moodTracker")})}),e.jsx("li",{className:"nav-item",children:e.jsx(i,{to:"/hug-center",className:r.pathname==="/hug-center"?"active":"",children:a("navigation.hugCenter")})}),e.jsx("li",{className:"nav-item",children:e.jsx(i,{to:"/hug-gallery",className:r.pathname==="/hug-gallery"?"active":"",children:a("nav.hugGallery")})}),e.jsx("li",{className:"nav-item",children:e.jsx(i,{to:"/mood-history",className:r.pathname==="/mood-history"?"active":"",children:a("moodTracker.moodHistory")})}),e.jsx("li",{className:"nav-item",children:e.jsx(i,{to:"/mesh-sdk-demo",className:r.pathname==="/mesh-sdk-demo"?"active":"",children:"Mesh SDK Demo"})})]})}),e.jsxs("div",{className:"header-right",children:[o()?e.jsxs("div",{className:"user-menu",children:[e.jsx("button",{className:"user-avatar",onClick:l,"aria-label":"User menu",children:s!=null&&s.avatarUrl?e.jsx("img",{src:s.avatarUrl,alt:s.name||s.username}):e.jsx("div",{className:"avatar-initials",children:N((s==null?void 0:s.name)||(s==null?void 0:s.username))})}),j&&e.jsxs("div",{className:"dropdown-menu",children:[e.jsxs("div",{className:"dropdown-header",children:[e.jsx("p",{className:"user-name",children:(s==null?void 0:s.name)||(s==null?void 0:s.username)}),e.jsx("p",{className:"user-email",children:s==null?void 0:s.email})]}),e.jsxs("ul",{className:"dropdown-list",children:[e.jsx("li",{className:"dropdown-item",children:e.jsx(i,{to:"/profile",children:a("navigation.profile")})}),e.jsx("li",{className:"dropdown-item",children:e.jsx("button",{onClick:g,children:a("navigation.logout")})})]})]})]}):e.jsxs("div",{className:"auth-buttons",children:[e.jsx(i,{to:"/login",className:"btn btn-outline",children:a("navigation.login")}),e.jsx(i,{to:"/register",className:"btn btn-primary",children:a("auth.signUp")})]}),e.jsx(k,{}),e.jsxs("button",{className:`menu-toggle ${t?"open":""}`,onClick:n,"aria-label":"Mobile menu",children:[e.jsx("span",{className:"menu-toggle-bar"}),e.jsx("span",{className:"menu-toggle-bar"}),e.jsx("span",{className:"menu-toggle-bar"})]})]})]})}),e.jsx("main",{className:"app-main",children:c}),e.jsxs("footer",{className:"app-footer",children:[e.jsxs("div",{className:"footer-content",children:[e.jsxs("div",{className:"footer-left",children:[e.jsxs("div",{className:"footer-logo",children:[e.jsx("span",{className:"logo-icon",children:"🤗"}),e.jsx("span",{className:"logo-text",children:"HugMeNow"})]}),e.jsx("p",{className:"footer-tagline",children:"Supporting emotional wellness with virtual hugs and mood tracking"})]}),e.jsx("div",{className:"footer-right",children:e.jsxs("div",{className:"footer-links",children:[e.jsxs("div",{className:"footer-links-column",children:[e.jsx("h4",{children:"Platform"}),e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx(i,{to:"/",children:a("navigation.home")})}),e.jsx("li",{children:e.jsx(i,{to:"/dashboard",children:a("navigation.dashboard")})}),e.jsx("li",{children:e.jsx(i,{to:"/mood-tracker",children:a("navigation.moodTracker")})}),e.jsx("li",{children:e.jsx(i,{to:"/hug-center",children:a("navigation.hugCenter")})}),e.jsx("li",{children:e.jsx(i,{to:"/hug-gallery",children:a("nav.hugGallery")})}),e.jsx("li",{children:e.jsx(i,{to:"/mesh-sdk-demo",children:"Mesh SDK Demo"})})]})]}),e.jsxs("div",{className:"footer-links-column",children:[e.jsx("h4",{children:"Resources"}),e.jsxs("ul",{children:[e.jsx("li",{children:e.jsx("a",{href:"#",children:"Help Center"})}),e.jsx("li",{children:e.jsx("a",{href:"#",children:"Privacy Policy"})}),e.jsx("li",{children:e.jsx("a",{href:"#",children:"Terms of Service"})}),e.jsx("li",{children:e.jsx("a",{href:"#",children:"Contact Us"})})]})]})]})})]}),e.jsx("div",{className:"footer-bottom",children:e.jsxs("p",{children:["© ",new Date().getFullYear()," HugMeNow. All rights reserved."]})})]})]})}function S(){const[c,a]=m.useState([]),[s,d]=m.useState(!0),[o,t]=m.useState(null),[h,j]=m.useState({mood:"HAPPY",intensity:7,note:"",isPublic:!0}),x=M();m.useEffect(()=>{async function n(){try{d(!0);const l=await x.getPublicMoods();l&&a(l)}catch(l){console.error("Error fetching moods:",l),t(l.message||"Failed to load moods")}finally{d(!1)}}n()},[x]);const r=async n=>{n.preventDefault();try{if(d(!0),await x.createMoodEntry(h)){const g=await x.getPublicMoods();a(g),j({mood:"HAPPY",intensity:7,note:"",isPublic:!0})}}catch(l){console.error("Error creating mood:",l),t(l.message||"Failed to create mood")}finally{d(!1)}},u=n=>{const{name:l,value:g,type:N,checked:p}=n.target;j(v=>({...v,[l]:N==="checkbox"?p:g}))};return s&&c.length===0?e.jsx("div",{className:"loading",children:"Loading moods..."}):o?e.jsxs("div",{className:"error",children:["Error: ",o]}):e.jsxs("div",{className:"mesh-sdk-example",children:[e.jsx("h2",{children:"Mesh SDK Example"}),e.jsxs("form",{onSubmit:r,className:"create-mood-form",children:[e.jsx("h3",{children:"Create a New Mood"}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"mood",children:"Mood:"}),e.jsxs("select",{id:"mood",name:"mood",value:h.mood,onChange:u,children:[e.jsx("option",{value:"HAPPY",children:"Happy"}),e.jsx("option",{value:"EXCITED",children:"Excited"}),e.jsx("option",{value:"CALM",children:"Calm"}),e.jsx("option",{value:"GRATEFUL",children:"Grateful"}),e.jsx("option",{value:"PEACEFUL",children:"Peaceful"})]})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"intensity",children:"Intensity (1-10):"}),e.jsx("input",{type:"number",id:"intensity",name:"intensity",min:"1",max:"10",value:h.intensity,onChange:u})]}),e.jsxs("div",{className:"form-group",children:[e.jsx("label",{htmlFor:"note",children:"Note:"}),e.jsx("textarea",{id:"note",name:"note",value:h.note,onChange:u,placeholder:"What's making you feel this way?"})]}),e.jsx("div",{className:"form-group",children:e.jsxs("label",{htmlFor:"isPublic",children:[e.jsx("input",{type:"checkbox",id:"isPublic",name:"isPublic",checked:h.isPublic,onChange:u}),"Make this mood public"]})}),e.jsx("button",{type:"submit",disabled:s,children:s?"Creating...":"Create Mood"})]}),e.jsxs("div",{className:"moods-list",children:[e.jsx("h3",{children:"Public Moods"}),c.length===0?e.jsx("p",{children:"No public moods found."}):e.jsx("ul",{children:c.map(n=>e.jsxs("li",{className:`mood-item mood-${n.mood.toLowerCase()}`,children:[e.jsxs("div",{className:"mood-header",children:[e.jsx("strong",{children:n.userId?`User ${n.userId}`:"Anonymous"}),e.jsxs("span",{className:"mood-intensity",children:[n.intensity,"/10"]})]}),e.jsxs("div",{className:"mood-content",children:[e.jsx("span",{className:"mood-type",children:n.mood}),n.note&&e.jsx("p",{className:"mood-note",children:n.note})]}),e.jsx("div",{className:"mood-footer",children:e.jsx("span",{className:"mood-date",children:new Date(n.createdAt).toLocaleString()})})]},n.id))})]})]})}function A(){return e.jsx(C,{title:"Mesh SDK Demo",children:e.jsxs("div",{className:"mesh-sdk-demo",children:[e.jsxs("div",{className:"page-header",children:[e.jsx("h1",{children:"Mesh SDK Demo"}),e.jsx("p",{className:"description",children:"This page demonstrates how to use the GraphQL Mesh SDK to interact with the HugMeNow API directly, without using the Apollo client."})]}),e.jsx("div",{className:"content-section",children:e.jsx(S,{})}),e.jsxs("div",{className:"info-section",children:[e.jsx("h2",{children:"About Mesh SDK"}),e.jsx("p",{children:"GraphQL Mesh SDK provides a lightweight, type-safe way to interact with the GraphQL API. It supports all the operations available in the API without needing the full Apollo client infrastructure."}),e.jsx("h3",{children:"Benefits:"}),e.jsxs("ul",{children:[e.jsx("li",{children:"Lightweight - minimal dependencies"}),e.jsx("li",{children:"Type-safe - provides typed methods for all operations"}),e.jsx("li",{children:"Simple - straightforward promise-based API"}),e.jsx("li",{children:"Compatible - works with all modern JavaScript frameworks"})]})]})]})})}export{A as default};
//# sourceMappingURL=MeshSdkDemo-08cded48.js.map
