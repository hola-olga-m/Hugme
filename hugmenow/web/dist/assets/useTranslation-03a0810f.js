import{r as f}from"./main-0012ce0c.js";const k=(e,s,n,a)=>{var t,d,h,N;const r=[n,{code:s,...a||{}}];if((d=(t=e==null?void 0:e.services)==null?void 0:t.logger)!=null&&d.forward)return e.services.logger.forward(r,"warn","react-i18next::",!0);m(r[0])&&(r[0]=`react-i18next:: ${r[0]}`),(N=(h=e==null?void 0:e.services)==null?void 0:h.logger)!=null&&N.warn?e.services.logger.warn(...r):console!=null&&console.warn&&console.warn(...r)},F={},E=(e,s,n,a)=>{m(n)&&F[n]||(m(n)&&(F[n]=new Date),k(e,s,n,a))},A=(e,s)=>()=>{if(e.isInitialized)s();else{const n=()=>{setTimeout(()=>{e.off("initialized",n)},0),s()};e.on("initialized",n)}},S=(e,s,n)=>{e.loadNamespaces(s,A(e,n))},L=(e,s,n,a)=>{if(m(n)&&(n=[n]),e.options.preload&&e.options.preload.indexOf(s)>-1)return S(e,n,a);n.forEach(r=>{e.options.ns.indexOf(r)<0&&e.options.ns.push(r)}),e.loadLanguages(s,A(e,a))},H=(e,s,n={})=>!s.languages||!s.languages.length?(E(s,"NO_LANGUAGES","i18n.languages were undefined or empty",{languages:s.languages}),!0):s.hasLoadedNamespace(e,{lng:n.lng,precheck:(a,r)=>{var t;if(((t=n.bindI18n)==null?void 0:t.indexOf("languageChanging"))>-1&&a.services.backendConnector.backend&&a.isLanguageChangingTo&&!r(a.isLanguageChangingTo,e))return!1}}),m=e=>typeof e=="string",M=e=>typeof e=="object"&&e!==null,U=/&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,_={"&amp;":"&","&#38;":"&","&lt;":"<","&#60;":"<","&gt;":">","&#62;":">","&apos;":"'","&#39;":"'","&quot;":'"',"&#34;":'"',"&nbsp;":" ","&#160;":" ","&copy;":"©","&#169;":"©","&reg;":"®","&#174;":"®","&hellip;":"…","&#8230;":"…","&#x2F;":"/","&#47;":"/"},G=e=>_[e],$=e=>e.replace(U,G);let q={bindI18n:"languageChanged",bindI18nStore:"",transEmptyNodeValue:"",transSupportBasicHtmlNodes:!0,transWrapTextNodes:"",transKeepBasicHtmlNodesFor:["br","strong","i","p"],useSuspense:!0,unescape:$};const B=()=>q;let W;const J=()=>W,K=f.createContext();class X{constructor(){this.usedNamespaces={}}addUsedNamespaces(s){s.forEach(n=>{this.usedNamespaces[n]||(this.usedNamespaces[n]=!0)})}getUsedNamespaces(){return Object.keys(this.usedNamespaces)}}const Y=(e,s)=>{const n=f.useRef();return f.useEffect(()=>{n.current=s?n.current:e},[e,s]),n.current},P=(e,s,n,a)=>e.getFixedT(s,n,a),D=(e,s,n,a)=>f.useCallback(P(e,s,n,a),[e,s,n,a]),Z=(e,s={})=>{var O,R,v,z;const{i18n:n}=s,{i18n:a,defaultNS:r}=f.useContext(K)||{},t=n||a||J();if(t&&!t.reportNamespaces&&(t.reportNamespaces=new X),!t){E(t,"NO_I18NEXT_INSTANCE","useTranslation: You will need to pass in an i18next instance by using initReactI18next");const i=(u,l)=>m(l)?l:M(l)&&m(l.defaultValue)?l.defaultValue:Array.isArray(u)?u[u.length-1]:u,c=[i,{},!1];return c.t=i,c.i18n={},c.ready=!1,c}(O=t.options.react)!=null&&O.wait&&E(t,"DEPRECATED_OPTION","useTranslation: It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.");const d={...B(),...t.options.react,...s},{useSuspense:h,keyPrefix:N}=d;let o=e||r||((R=t.options)==null?void 0:R.defaultNS);o=m(o)?[o]:o||["translation"],(z=(v=t.reportNamespaces).addUsedNamespaces)==null||z.call(v,o);const g=(t.isInitialized||t.initializedStoreOnce)&&o.every(i=>H(i,t,d)),j=D(t,s.lng||null,d.nsMode==="fallback"?o:o[0],N),b=()=>j,x=()=>P(t,s.lng||null,d.nsMode==="fallback"?o:o[0],N),[C,y]=f.useState(b);let w=o.join();s.lng&&(w=`${s.lng}${w}`);const I=Y(w),p=f.useRef(!0);f.useEffect(()=>{const{bindI18n:i,bindI18nStore:c}=d;p.current=!0,!g&&!h&&(s.lng?L(t,s.lng,o,()=>{p.current&&y(x)}):S(t,o,()=>{p.current&&y(x)})),g&&I&&I!==w&&p.current&&y(x);const u=()=>{p.current&&y(x)};return i&&(t==null||t.on(i,u)),c&&(t==null||t.store.on(c,u)),()=>{p.current=!1,t&&(i==null||i.split(" ").forEach(l=>t.off(l,u))),c&&t&&c.split(" ").forEach(l=>t.store.off(l,u))}},[t,w]),f.useEffect(()=>{p.current&&g&&y(b)},[t,N,g]);const T=[C,t,g];if(T.t=C,T.i18n=t,T.ready=g,g||!g&&!h)return T;throw new Promise(i=>{s.lng?L(t,s.lng,o,()=>i()):S(t,o,()=>i())})};export{Z as u};
//# sourceMappingURL=useTranslation-03a0810f.js.map
