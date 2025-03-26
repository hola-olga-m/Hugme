import{T as he,i as V,c as pe,e as Re,f as Le,g as fe,h as Q,K as l,O as M,k as Fe,_ as A,l as k,m as me,n as I,o as Me,R as je,p as Pe,A as Ue,q as Be,s as Y,t as ge,v as Ve,w as qe,x as ve,N as F,y as xe,z as ye,B as $e,d as g,j as c,u as Qe,r as G,a as Ge,L as ze}from"./main-1b1c44e2.js";function Ke(e){return typeof e=="object"&&e!==null}function He(e,t){if(!!!e)throw new Error(t??"Unexpected invariant triggered.")}const Ye=/\r\n|[\n\r]/g;function W(e,t){let n=0,i=1;for(const r of e.body.matchAll(Ye)){if(typeof r.index=="number"||He(!1),r.index>=t)break;n=r.index+r[0].length,i+=1}return{line:i,column:t+1-n}}function We(e){return Ee(e.source,W(e.source,e.start))}function Ee(e,t){const n=e.locationOffset.column-1,i="".padStart(n)+e.body,r=t.line-1,s=e.locationOffset.line-1,o=t.line+s,u=t.line===1?n:0,d=t.column+u,f=`${e.name}:${o}:${d}
`,h=i.split(/\r\n|[\n\r]/g),p=h[r];if(p.length>120){const m=Math.floor(d/80),E=d%80,v=[];for(let N=0;N<p.length;N+=80)v.push(p.slice(N,N+80));return f+te([[`${o} |`,v[0]],...v.slice(1,m+1).map(N=>["|",N]),["|","^".padStart(E)],["|",v[m+1]]])}return f+te([[`${o-1} |`,h[r-1]],[`${o} |`,p],["|","^".padStart(d)],[`${o+1} |`,h[r+1]]])}function te(e){const t=e.filter(([i,r])=>r!==void 0),n=Math.max(...t.map(([i])=>i.length));return t.map(([i,r])=>i.padStart(n)+(r?" "+r:"")).join(`
`)}function Je(e){const t=e[0];return t==null||"kind"in t||"length"in t?{nodes:t,source:e[1],positions:e[2],path:e[3],originalError:e[4],extensions:e[5]}:t}class ee extends Error{constructor(t,...n){var i,r,s;const{nodes:o,source:u,positions:d,path:f,originalError:h,extensions:p}=Je(n);super(t),this.name="GraphQLError",this.path=f??void 0,this.originalError=h??void 0,this.nodes=ne(Array.isArray(o)?o:o?[o]:void 0);const m=ne((i=this.nodes)===null||i===void 0?void 0:i.map(v=>v.loc).filter(v=>v!=null));this.source=u??(m==null||(r=m[0])===null||r===void 0?void 0:r.source),this.positions=d??(m==null?void 0:m.map(v=>v.start)),this.locations=d&&u?d.map(v=>W(u,v)):m==null?void 0:m.map(v=>W(v.source,v.start));const E=Ke(h==null?void 0:h.extensions)?h==null?void 0:h.extensions:void 0;this.extensions=(s=p??E)!==null&&s!==void 0?s:Object.create(null),Object.defineProperties(this,{message:{writable:!0,enumerable:!0},name:{enumerable:!1},nodes:{enumerable:!1},source:{enumerable:!1},positions:{enumerable:!1},originalError:{enumerable:!1}}),h!=null&&h.stack?Object.defineProperty(this,"stack",{value:h.stack,writable:!0,configurable:!0}):Error.captureStackTrace?Error.captureStackTrace(this,ee):Object.defineProperty(this,"stack",{value:Error().stack,writable:!0,configurable:!0})}get[Symbol.toStringTag](){return"GraphQLError"}toString(){let t=this.message;if(this.nodes)for(const n of this.nodes)n.loc&&(t+=`

`+We(n.loc));else if(this.source&&this.locations)for(const n of this.locations)t+=`

`+Ee(this.source,n);return t}toJSON(){const t={message:this.message};return this.locations!=null&&(t.locations=this.locations),this.path!=null&&(t.path=this.path),this.extensions!=null&&Object.keys(this.extensions).length>0&&(t.extensions=this.extensions),t}}function ne(e){return e===void 0||e.length===0?void 0:e}function b(e,t,n){return new ee(`Syntax Error: ${n}`,{source:e,positions:[t]})}var J;(function(e){e.QUERY="QUERY",e.MUTATION="MUTATION",e.SUBSCRIPTION="SUBSCRIPTION",e.FIELD="FIELD",e.FRAGMENT_DEFINITION="FRAGMENT_DEFINITION",e.FRAGMENT_SPREAD="FRAGMENT_SPREAD",e.INLINE_FRAGMENT="INLINE_FRAGMENT",e.VARIABLE_DEFINITION="VARIABLE_DEFINITION",e.SCHEMA="SCHEMA",e.SCALAR="SCALAR",e.OBJECT="OBJECT",e.FIELD_DEFINITION="FIELD_DEFINITION",e.ARGUMENT_DEFINITION="ARGUMENT_DEFINITION",e.INTERFACE="INTERFACE",e.UNION="UNION",e.ENUM="ENUM",e.ENUM_VALUE="ENUM_VALUE",e.INPUT_OBJECT="INPUT_OBJECT",e.INPUT_FIELD_DEFINITION="INPUT_FIELD_DEFINITION"})(J||(J={}));var a;(function(e){e.SOF="<SOF>",e.EOF="<EOF>",e.BANG="!",e.DOLLAR="$",e.AMP="&",e.PAREN_L="(",e.PAREN_R=")",e.SPREAD="...",e.COLON=":",e.EQUALS="=",e.AT="@",e.BRACKET_L="[",e.BRACKET_R="]",e.BRACE_L="{",e.PIPE="|",e.BRACE_R="}",e.NAME="Name",e.INT="Int",e.FLOAT="Float",e.STRING="String",e.BLOCK_STRING="BlockString",e.COMMENT="Comment"})(a||(a={}));class Xe{constructor(t){const n=new he(a.SOF,0,0,0,0);this.source=t,this.lastToken=n,this.token=n,this.line=1,this.lineStart=0}get[Symbol.toStringTag](){return"Lexer"}advance(){return this.lastToken=this.token,this.token=this.lookahead()}lookahead(){let t=this.token;if(t.kind!==a.EOF)do if(t.next)t=t.next;else{const n=et(this,t.end);t.next=n,n.prev=t,t=n}while(t.kind===a.COMMENT);return t}}function Ze(e){return e===a.BANG||e===a.DOLLAR||e===a.AMP||e===a.PAREN_L||e===a.PAREN_R||e===a.SPREAD||e===a.COLON||e===a.EQUALS||e===a.AT||e===a.BRACKET_L||e===a.BRACKET_R||e===a.BRACE_L||e===a.PIPE||e===a.BRACE_R}function w(e){return e>=0&&e<=55295||e>=57344&&e<=1114111}function $(e,t){return be(e.charCodeAt(t))&&ke(e.charCodeAt(t+1))}function be(e){return e>=55296&&e<=56319}function ke(e){return e>=56320&&e<=57343}function _(e,t){const n=e.source.body.codePointAt(t);if(n===void 0)return a.EOF;if(n>=32&&n<=126){const i=String.fromCodePoint(n);return i==='"'?`'"'`:`"${i}"`}return"U+"+n.toString(16).toUpperCase().padStart(4,"0")}function x(e,t,n,i,r){const s=e.line,o=1+n-e.lineStart;return new he(t,n,i,s,o,r)}function et(e,t){const n=e.source.body,i=n.length;let r=t;for(;r<i;){const s=n.charCodeAt(r);switch(s){case 65279:case 9:case 32:case 44:++r;continue;case 10:++r,++e.line,e.lineStart=r;continue;case 13:n.charCodeAt(r+1)===10?r+=2:++r,++e.line,e.lineStart=r;continue;case 35:return tt(e,r);case 33:return x(e,a.BANG,r,r+1);case 36:return x(e,a.DOLLAR,r,r+1);case 38:return x(e,a.AMP,r,r+1);case 40:return x(e,a.PAREN_L,r,r+1);case 41:return x(e,a.PAREN_R,r,r+1);case 46:if(n.charCodeAt(r+1)===46&&n.charCodeAt(r+2)===46)return x(e,a.SPREAD,r,r+3);break;case 58:return x(e,a.COLON,r,r+1);case 61:return x(e,a.EQUALS,r,r+1);case 64:return x(e,a.AT,r,r+1);case 91:return x(e,a.BRACKET_L,r,r+1);case 93:return x(e,a.BRACKET_R,r,r+1);case 123:return x(e,a.BRACE_L,r,r+1);case 124:return x(e,a.PIPE,r,r+1);case 125:return x(e,a.BRACE_R,r,r+1);case 34:return n.charCodeAt(r+1)===34&&n.charCodeAt(r+2)===34?ot(e,r):rt(e,r)}if(V(s)||s===45)return nt(e,r,s);if(pe(s))return ct(e,r);throw b(e.source,r,s===39?`Unexpected single quote character ('), did you mean to use a double quote (")?`:w(s)||$(n,r)?`Unexpected character: ${_(e,r)}.`:`Invalid character: ${_(e,r)}.`)}return x(e,a.EOF,i,i)}function tt(e,t){const n=e.source.body,i=n.length;let r=t+1;for(;r<i;){const s=n.charCodeAt(r);if(s===10||s===13)break;if(w(s))++r;else if($(n,r))r+=2;else break}return x(e,a.COMMENT,t,r,n.slice(t+1,r))}function nt(e,t,n){const i=e.source.body;let r=t,s=n,o=!1;if(s===45&&(s=i.charCodeAt(++r)),s===48){if(s=i.charCodeAt(++r),V(s))throw b(e.source,r,`Invalid number, unexpected digit after 0: ${_(e,r)}.`)}else r=z(e,r,s),s=i.charCodeAt(r);if(s===46&&(o=!0,s=i.charCodeAt(++r),r=z(e,r,s),s=i.charCodeAt(r)),(s===69||s===101)&&(o=!0,s=i.charCodeAt(++r),(s===43||s===45)&&(s=i.charCodeAt(++r)),r=z(e,r,s),s=i.charCodeAt(r)),s===46||pe(s))throw b(e.source,r,`Invalid number, expected digit but got: ${_(e,r)}.`);return x(e,o?a.FLOAT:a.INT,t,r,i.slice(t,r))}function z(e,t,n){if(!V(n))throw b(e.source,t,`Invalid number, expected digit but got: ${_(e,t)}.`);const i=e.source.body;let r=t+1;for(;V(i.charCodeAt(r));)++r;return r}function rt(e,t){const n=e.source.body,i=n.length;let r=t+1,s=r,o="";for(;r<i;){const u=n.charCodeAt(r);if(u===34)return o+=n.slice(s,r),x(e,a.STRING,t,r+1,o);if(u===92){o+=n.slice(s,r);const d=n.charCodeAt(r+1)===117?n.charCodeAt(r+2)===123?it(e,r):st(e,r):at(e,r);o+=d.value,r+=d.size,s=r;continue}if(u===10||u===13)break;if(w(u))++r;else if($(n,r))r+=2;else throw b(e.source,r,`Invalid character within String: ${_(e,r)}.`)}throw b(e.source,r,"Unterminated string.")}function it(e,t){const n=e.source.body;let i=0,r=3;for(;r<12;){const s=n.charCodeAt(t+r++);if(s===125){if(r<5||!w(i))break;return{value:String.fromCodePoint(i),size:r}}if(i=i<<4|L(s),i<0)break}throw b(e.source,t,`Invalid Unicode escape sequence: "${n.slice(t,t+r)}".`)}function st(e,t){const n=e.source.body,i=re(n,t+2);if(w(i))return{value:String.fromCodePoint(i),size:6};if(be(i)&&n.charCodeAt(t+6)===92&&n.charCodeAt(t+7)===117){const r=re(n,t+8);if(ke(r))return{value:String.fromCodePoint(i,r),size:12}}throw b(e.source,t,`Invalid Unicode escape sequence: "${n.slice(t,t+6)}".`)}function re(e,t){return L(e.charCodeAt(t))<<12|L(e.charCodeAt(t+1))<<8|L(e.charCodeAt(t+2))<<4|L(e.charCodeAt(t+3))}function L(e){return e>=48&&e<=57?e-48:e>=65&&e<=70?e-55:e>=97&&e<=102?e-87:-1}function at(e,t){const n=e.source.body;switch(n.charCodeAt(t+1)){case 34:return{value:'"',size:2};case 92:return{value:"\\",size:2};case 47:return{value:"/",size:2};case 98:return{value:"\b",size:2};case 102:return{value:"\f",size:2};case 110:return{value:`
`,size:2};case 114:return{value:"\r",size:2};case 116:return{value:"	",size:2}}throw b(e.source,t,`Invalid character escape sequence: "${n.slice(t,t+2)}".`)}function ot(e,t){const n=e.source.body,i=n.length;let r=e.lineStart,s=t+3,o=s,u="";const d=[];for(;s<i;){const f=n.charCodeAt(s);if(f===34&&n.charCodeAt(s+1)===34&&n.charCodeAt(s+2)===34){u+=n.slice(o,s),d.push(u);const h=x(e,a.BLOCK_STRING,t,s+3,Re(d).join(`
`));return e.line+=d.length-1,e.lineStart=r,h}if(f===92&&n.charCodeAt(s+1)===34&&n.charCodeAt(s+2)===34&&n.charCodeAt(s+3)===34){u+=n.slice(o,s),o=s+1,s+=4;continue}if(f===10||f===13){u+=n.slice(o,s),d.push(u),f===13&&n.charCodeAt(s+1)===10?s+=2:++s,u="",o=s,r=s;continue}if(w(f))++s;else if($(n,s))s+=2;else throw b(e.source,s,`Invalid character within String: ${_(e,s)}.`)}throw b(e.source,s,"Unterminated string.")}function ct(e,t){const n=e.source.body,i=n.length;let r=t+1;for(;r<i;){const s=n.charCodeAt(r);if(Le(s))++r;else break}return x(e,a.NAME,t,r,n.slice(t,r))}const ut=globalThis.process&&!0,dt=ut?function(t,n){return t instanceof n}:function(t,n){if(t instanceof n)return!0;if(typeof t=="object"&&t!==null){var i;const r=n.prototype[Symbol.toStringTag],s=Symbol.toStringTag in t?t[Symbol.toStringTag]:(i=t.constructor)===null||i===void 0?void 0:i.name;if(r===s){const o=fe(t);throw new Error(`Cannot use ${r} "${o}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`)}}return!1};class Ne{constructor(t,n="GraphQL request",i={line:1,column:1}){typeof t=="string"||Q(!1,`Body must be a string. Received: ${fe(t)}.`),this.body=t,this.name=n,this.locationOffset=i,this.locationOffset.line>0||Q(!1,"line in locationOffset is 1-indexed and must be positive."),this.locationOffset.column>0||Q(!1,"column in locationOffset is 1-indexed and must be positive.")}get[Symbol.toStringTag](){return"Source"}}function lt(e){return dt(e,Ne)}function ht(e,t){const n=new pt(e,t),i=n.parseDocument();return Object.defineProperty(i,"tokenCount",{enumerable:!1,value:n.tokenCount}),i}class pt{constructor(t,n={}){const i=lt(t)?t:new Ne(t);this._lexer=new Xe(i),this._options=n,this._tokenCounter=0}get tokenCount(){return this._tokenCounter}parseName(){const t=this.expectToken(a.NAME);return this.node(t,{kind:l.NAME,value:t.value})}parseDocument(){return this.node(this._lexer.token,{kind:l.DOCUMENT,definitions:this.many(a.SOF,this.parseDefinition,a.EOF)})}parseDefinition(){if(this.peek(a.BRACE_L))return this.parseOperationDefinition();const t=this.peekDescription(),n=t?this._lexer.lookahead():this._lexer.token;if(n.kind===a.NAME){switch(n.value){case"schema":return this.parseSchemaDefinition();case"scalar":return this.parseScalarTypeDefinition();case"type":return this.parseObjectTypeDefinition();case"interface":return this.parseInterfaceTypeDefinition();case"union":return this.parseUnionTypeDefinition();case"enum":return this.parseEnumTypeDefinition();case"input":return this.parseInputObjectTypeDefinition();case"directive":return this.parseDirectiveDefinition()}if(t)throw b(this._lexer.source,this._lexer.token.start,"Unexpected description, descriptions are supported only on type definitions.");switch(n.value){case"query":case"mutation":case"subscription":return this.parseOperationDefinition();case"fragment":return this.parseFragmentDefinition();case"extend":return this.parseTypeSystemExtension()}}throw this.unexpected(n)}parseOperationDefinition(){const t=this._lexer.token;if(this.peek(a.BRACE_L))return this.node(t,{kind:l.OPERATION_DEFINITION,operation:M.QUERY,name:void 0,variableDefinitions:[],directives:[],selectionSet:this.parseSelectionSet()});const n=this.parseOperationType();let i;return this.peek(a.NAME)&&(i=this.parseName()),this.node(t,{kind:l.OPERATION_DEFINITION,operation:n,name:i,variableDefinitions:this.parseVariableDefinitions(),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseOperationType(){const t=this.expectToken(a.NAME);switch(t.value){case"query":return M.QUERY;case"mutation":return M.MUTATION;case"subscription":return M.SUBSCRIPTION}throw this.unexpected(t)}parseVariableDefinitions(){return this.optionalMany(a.PAREN_L,this.parseVariableDefinition,a.PAREN_R)}parseVariableDefinition(){return this.node(this._lexer.token,{kind:l.VARIABLE_DEFINITION,variable:this.parseVariable(),type:(this.expectToken(a.COLON),this.parseTypeReference()),defaultValue:this.expectOptionalToken(a.EQUALS)?this.parseConstValueLiteral():void 0,directives:this.parseConstDirectives()})}parseVariable(){const t=this._lexer.token;return this.expectToken(a.DOLLAR),this.node(t,{kind:l.VARIABLE,name:this.parseName()})}parseSelectionSet(){return this.node(this._lexer.token,{kind:l.SELECTION_SET,selections:this.many(a.BRACE_L,this.parseSelection,a.BRACE_R)})}parseSelection(){return this.peek(a.SPREAD)?this.parseFragment():this.parseField()}parseField(){const t=this._lexer.token,n=this.parseName();let i,r;return this.expectOptionalToken(a.COLON)?(i=n,r=this.parseName()):r=n,this.node(t,{kind:l.FIELD,alias:i,name:r,arguments:this.parseArguments(!1),directives:this.parseDirectives(!1),selectionSet:this.peek(a.BRACE_L)?this.parseSelectionSet():void 0})}parseArguments(t){const n=t?this.parseConstArgument:this.parseArgument;return this.optionalMany(a.PAREN_L,n,a.PAREN_R)}parseArgument(t=!1){const n=this._lexer.token,i=this.parseName();return this.expectToken(a.COLON),this.node(n,{kind:l.ARGUMENT,name:i,value:this.parseValueLiteral(t)})}parseConstArgument(){return this.parseArgument(!0)}parseFragment(){const t=this._lexer.token;this.expectToken(a.SPREAD);const n=this.expectOptionalKeyword("on");return!n&&this.peek(a.NAME)?this.node(t,{kind:l.FRAGMENT_SPREAD,name:this.parseFragmentName(),directives:this.parseDirectives(!1)}):this.node(t,{kind:l.INLINE_FRAGMENT,typeCondition:n?this.parseNamedType():void 0,directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentDefinition(){const t=this._lexer.token;return this.expectKeyword("fragment"),this._options.allowLegacyFragmentVariables===!0?this.node(t,{kind:l.FRAGMENT_DEFINITION,name:this.parseFragmentName(),variableDefinitions:this.parseVariableDefinitions(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()}):this.node(t,{kind:l.FRAGMENT_DEFINITION,name:this.parseFragmentName(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentName(){if(this._lexer.token.value==="on")throw this.unexpected();return this.parseName()}parseValueLiteral(t){const n=this._lexer.token;switch(n.kind){case a.BRACKET_L:return this.parseList(t);case a.BRACE_L:return this.parseObject(t);case a.INT:return this.advanceLexer(),this.node(n,{kind:l.INT,value:n.value});case a.FLOAT:return this.advanceLexer(),this.node(n,{kind:l.FLOAT,value:n.value});case a.STRING:case a.BLOCK_STRING:return this.parseStringLiteral();case a.NAME:switch(this.advanceLexer(),n.value){case"true":return this.node(n,{kind:l.BOOLEAN,value:!0});case"false":return this.node(n,{kind:l.BOOLEAN,value:!1});case"null":return this.node(n,{kind:l.NULL});default:return this.node(n,{kind:l.ENUM,value:n.value})}case a.DOLLAR:if(t)if(this.expectToken(a.DOLLAR),this._lexer.token.kind===a.NAME){const i=this._lexer.token.value;throw b(this._lexer.source,n.start,`Unexpected variable "$${i}" in constant value.`)}else throw this.unexpected(n);return this.parseVariable();default:throw this.unexpected()}}parseConstValueLiteral(){return this.parseValueLiteral(!0)}parseStringLiteral(){const t=this._lexer.token;return this.advanceLexer(),this.node(t,{kind:l.STRING,value:t.value,block:t.kind===a.BLOCK_STRING})}parseList(t){const n=()=>this.parseValueLiteral(t);return this.node(this._lexer.token,{kind:l.LIST,values:this.any(a.BRACKET_L,n,a.BRACKET_R)})}parseObject(t){const n=()=>this.parseObjectField(t);return this.node(this._lexer.token,{kind:l.OBJECT,fields:this.any(a.BRACE_L,n,a.BRACE_R)})}parseObjectField(t){const n=this._lexer.token,i=this.parseName();return this.expectToken(a.COLON),this.node(n,{kind:l.OBJECT_FIELD,name:i,value:this.parseValueLiteral(t)})}parseDirectives(t){const n=[];for(;this.peek(a.AT);)n.push(this.parseDirective(t));return n}parseConstDirectives(){return this.parseDirectives(!0)}parseDirective(t){const n=this._lexer.token;return this.expectToken(a.AT),this.node(n,{kind:l.DIRECTIVE,name:this.parseName(),arguments:this.parseArguments(t)})}parseTypeReference(){const t=this._lexer.token;let n;if(this.expectOptionalToken(a.BRACKET_L)){const i=this.parseTypeReference();this.expectToken(a.BRACKET_R),n=this.node(t,{kind:l.LIST_TYPE,type:i})}else n=this.parseNamedType();return this.expectOptionalToken(a.BANG)?this.node(t,{kind:l.NON_NULL_TYPE,type:n}):n}parseNamedType(){return this.node(this._lexer.token,{kind:l.NAMED_TYPE,name:this.parseName()})}peekDescription(){return this.peek(a.STRING)||this.peek(a.BLOCK_STRING)}parseDescription(){if(this.peekDescription())return this.parseStringLiteral()}parseSchemaDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("schema");const i=this.parseConstDirectives(),r=this.many(a.BRACE_L,this.parseOperationTypeDefinition,a.BRACE_R);return this.node(t,{kind:l.SCHEMA_DEFINITION,description:n,directives:i,operationTypes:r})}parseOperationTypeDefinition(){const t=this._lexer.token,n=this.parseOperationType();this.expectToken(a.COLON);const i=this.parseNamedType();return this.node(t,{kind:l.OPERATION_TYPE_DEFINITION,operation:n,type:i})}parseScalarTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("scalar");const i=this.parseName(),r=this.parseConstDirectives();return this.node(t,{kind:l.SCALAR_TYPE_DEFINITION,description:n,name:i,directives:r})}parseObjectTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("type");const i=this.parseName(),r=this.parseImplementsInterfaces(),s=this.parseConstDirectives(),o=this.parseFieldsDefinition();return this.node(t,{kind:l.OBJECT_TYPE_DEFINITION,description:n,name:i,interfaces:r,directives:s,fields:o})}parseImplementsInterfaces(){return this.expectOptionalKeyword("implements")?this.delimitedMany(a.AMP,this.parseNamedType):[]}parseFieldsDefinition(){return this.optionalMany(a.BRACE_L,this.parseFieldDefinition,a.BRACE_R)}parseFieldDefinition(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseName(),r=this.parseArgumentDefs();this.expectToken(a.COLON);const s=this.parseTypeReference(),o=this.parseConstDirectives();return this.node(t,{kind:l.FIELD_DEFINITION,description:n,name:i,arguments:r,type:s,directives:o})}parseArgumentDefs(){return this.optionalMany(a.PAREN_L,this.parseInputValueDef,a.PAREN_R)}parseInputValueDef(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseName();this.expectToken(a.COLON);const r=this.parseTypeReference();let s;this.expectOptionalToken(a.EQUALS)&&(s=this.parseConstValueLiteral());const o=this.parseConstDirectives();return this.node(t,{kind:l.INPUT_VALUE_DEFINITION,description:n,name:i,type:r,defaultValue:s,directives:o})}parseInterfaceTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("interface");const i=this.parseName(),r=this.parseImplementsInterfaces(),s=this.parseConstDirectives(),o=this.parseFieldsDefinition();return this.node(t,{kind:l.INTERFACE_TYPE_DEFINITION,description:n,name:i,interfaces:r,directives:s,fields:o})}parseUnionTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("union");const i=this.parseName(),r=this.parseConstDirectives(),s=this.parseUnionMemberTypes();return this.node(t,{kind:l.UNION_TYPE_DEFINITION,description:n,name:i,directives:r,types:s})}parseUnionMemberTypes(){return this.expectOptionalToken(a.EQUALS)?this.delimitedMany(a.PIPE,this.parseNamedType):[]}parseEnumTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("enum");const i=this.parseName(),r=this.parseConstDirectives(),s=this.parseEnumValuesDefinition();return this.node(t,{kind:l.ENUM_TYPE_DEFINITION,description:n,name:i,directives:r,values:s})}parseEnumValuesDefinition(){return this.optionalMany(a.BRACE_L,this.parseEnumValueDefinition,a.BRACE_R)}parseEnumValueDefinition(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseEnumValueName(),r=this.parseConstDirectives();return this.node(t,{kind:l.ENUM_VALUE_DEFINITION,description:n,name:i,directives:r})}parseEnumValueName(){if(this._lexer.token.value==="true"||this._lexer.token.value==="false"||this._lexer.token.value==="null")throw b(this._lexer.source,this._lexer.token.start,`${j(this._lexer.token)} is reserved and cannot be used for an enum value.`);return this.parseName()}parseInputObjectTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("input");const i=this.parseName(),r=this.parseConstDirectives(),s=this.parseInputFieldsDefinition();return this.node(t,{kind:l.INPUT_OBJECT_TYPE_DEFINITION,description:n,name:i,directives:r,fields:s})}parseInputFieldsDefinition(){return this.optionalMany(a.BRACE_L,this.parseInputValueDef,a.BRACE_R)}parseTypeSystemExtension(){const t=this._lexer.lookahead();if(t.kind===a.NAME)switch(t.value){case"schema":return this.parseSchemaExtension();case"scalar":return this.parseScalarTypeExtension();case"type":return this.parseObjectTypeExtension();case"interface":return this.parseInterfaceTypeExtension();case"union":return this.parseUnionTypeExtension();case"enum":return this.parseEnumTypeExtension();case"input":return this.parseInputObjectTypeExtension()}throw this.unexpected(t)}parseSchemaExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("schema");const n=this.parseConstDirectives(),i=this.optionalMany(a.BRACE_L,this.parseOperationTypeDefinition,a.BRACE_R);if(n.length===0&&i.length===0)throw this.unexpected();return this.node(t,{kind:l.SCHEMA_EXTENSION,directives:n,operationTypes:i})}parseScalarTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("scalar");const n=this.parseName(),i=this.parseConstDirectives();if(i.length===0)throw this.unexpected();return this.node(t,{kind:l.SCALAR_TYPE_EXTENSION,name:n,directives:i})}parseObjectTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("type");const n=this.parseName(),i=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),s=this.parseFieldsDefinition();if(i.length===0&&r.length===0&&s.length===0)throw this.unexpected();return this.node(t,{kind:l.OBJECT_TYPE_EXTENSION,name:n,interfaces:i,directives:r,fields:s})}parseInterfaceTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("interface");const n=this.parseName(),i=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),s=this.parseFieldsDefinition();if(i.length===0&&r.length===0&&s.length===0)throw this.unexpected();return this.node(t,{kind:l.INTERFACE_TYPE_EXTENSION,name:n,interfaces:i,directives:r,fields:s})}parseUnionTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("union");const n=this.parseName(),i=this.parseConstDirectives(),r=this.parseUnionMemberTypes();if(i.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:l.UNION_TYPE_EXTENSION,name:n,directives:i,types:r})}parseEnumTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("enum");const n=this.parseName(),i=this.parseConstDirectives(),r=this.parseEnumValuesDefinition();if(i.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:l.ENUM_TYPE_EXTENSION,name:n,directives:i,values:r})}parseInputObjectTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("input");const n=this.parseName(),i=this.parseConstDirectives(),r=this.parseInputFieldsDefinition();if(i.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:l.INPUT_OBJECT_TYPE_EXTENSION,name:n,directives:i,fields:r})}parseDirectiveDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("directive"),this.expectToken(a.AT);const i=this.parseName(),r=this.parseArgumentDefs(),s=this.expectOptionalKeyword("repeatable");this.expectKeyword("on");const o=this.parseDirectiveLocations();return this.node(t,{kind:l.DIRECTIVE_DEFINITION,description:n,name:i,arguments:r,repeatable:s,locations:o})}parseDirectiveLocations(){return this.delimitedMany(a.PIPE,this.parseDirectiveLocation)}parseDirectiveLocation(){const t=this._lexer.token,n=this.parseName();if(Object.prototype.hasOwnProperty.call(J,n.value))return n;throw this.unexpected(t)}node(t,n){return this._options.noLocation!==!0&&(n.loc=new Fe(t,this._lexer.lastToken,this._lexer.source)),n}peek(t){return this._lexer.token.kind===t}expectToken(t){const n=this._lexer.token;if(n.kind===t)return this.advanceLexer(),n;throw b(this._lexer.source,n.start,`Expected ${Te(t)}, found ${j(n)}.`)}expectOptionalToken(t){return this._lexer.token.kind===t?(this.advanceLexer(),!0):!1}expectKeyword(t){const n=this._lexer.token;if(n.kind===a.NAME&&n.value===t)this.advanceLexer();else throw b(this._lexer.source,n.start,`Expected "${t}", found ${j(n)}.`)}expectOptionalKeyword(t){const n=this._lexer.token;return n.kind===a.NAME&&n.value===t?(this.advanceLexer(),!0):!1}unexpected(t){const n=t??this._lexer.token;return b(this._lexer.source,n.start,`Unexpected ${j(n)}.`)}any(t,n,i){this.expectToken(t);const r=[];for(;!this.expectOptionalToken(i);)r.push(n.call(this));return r}optionalMany(t,n,i){if(this.expectOptionalToken(t)){const r=[];do r.push(n.call(this));while(!this.expectOptionalToken(i));return r}return[]}many(t,n,i){this.expectToken(t);const r=[];do r.push(n.call(this));while(!this.expectOptionalToken(i));return r}delimitedMany(t,n){this.expectOptionalToken(t);const i=[];do i.push(n.call(this));while(this.expectOptionalToken(t));return i}advanceLexer(){const{maxTokens:t}=this._options,n=this._lexer.advance();if(n.kind!==a.EOF&&(++this._tokenCounter,t!==void 0&&this._tokenCounter>t))throw b(this._lexer.source,n.start,`Document contains more that ${t} tokens. Parsing aborted.`)}}function j(e){const t=e.value;return Te(e.kind)+(t!=null?` "${t}"`:"")}function Te(e){return Ze(e)?`"${e}"`:e}var U=new Map,X=new Map,Ae=!0,q=!1;function Ce(e){return e.replace(/[\s,]+/g," ").trim()}function ft(e){return Ce(e.source.body.substring(e.start,e.end))}function mt(e){var t=new Set,n=[];return e.definitions.forEach(function(i){if(i.kind==="FragmentDefinition"){var r=i.name.value,s=ft(i.loc),o=X.get(r);o&&!o.has(s)?Ae&&console.warn("Warning: fragment with name "+r+` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`):o||X.set(r,o=new Set),o.add(s),t.has(s)||(t.add(s),n.push(i))}else n.push(i)}),A(A({},e),{definitions:n})}function gt(e){var t=new Set(e.definitions);t.forEach(function(i){i.loc&&delete i.loc,Object.keys(i).forEach(function(r){var s=i[r];s&&typeof s=="object"&&t.add(s)})});var n=e.loc;return n&&(delete n.startToken,delete n.endToken),e}function vt(e){var t=Ce(e);if(!U.has(t)){var n=ht(e,{experimentalFragmentVariables:q,allowLegacyFragmentVariables:q});if(!n||n.kind!=="Document")throw new Error("Not a valid GraphQL document.");U.set(t,gt(mt(n)))}return U.get(t)}function y(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];typeof e=="string"&&(e=[e]);var i=e[0];return t.forEach(function(r,s){r&&r.kind==="Document"?i+=r.loc.source.body:i+=r,i+=e[s+1]}),vt(i)}function xt(){U.clear(),X.clear()}function yt(){Ae=!1}function Et(){q=!0}function bt(){q=!1}var R={gql:y,resetCaches:xt,disableFragmentWarnings:yt,enableExperimentalFragmentVariables:Et,disableExperimentalFragmentVariables:bt};(function(e){e.gql=R.gql,e.resetCaches=R.resetCaches,e.disableFragmentWarnings=R.disableFragmentWarnings,e.enableExperimentalFragmentVariables=R.enableExperimentalFragmentVariables,e.disableExperimentalFragmentVariables=R.disableExperimentalFragmentVariables})(y||(y={}));y.default=y;function Oe(e){var t=k.useContext(me()),n=e||t.client;return I(!!n,58),n}var ie=!1,kt="useSyncExternalStore",Nt=je[kt],Tt=Nt||function(e,t,n){var i=t();globalThis.__DEV__!==!1&&!ie&&i!==t()&&(ie=!0,globalThis.__DEV__!==!1&&I.error(68));var r=k.useState({inst:{value:i,getSnapshot:t}}),s=r[0].inst,o=r[1];return Me?k.useLayoutEffect(function(){Object.assign(s,{value:i,getSnapshot:t}),K(s)&&o({inst:s})},[e,i,t]):Object.assign(s,{value:i,getSnapshot:t}),k.useEffect(function(){return K(s)&&o({inst:s}),e(function(){K(s)&&o({inst:s})})},[e]),i};function K(e){var t=e.value,n=e.getSnapshot;try{return t!==n()}catch{return!0}}var O;(function(e){e[e.Query=0]="Query",e[e.Mutation=1]="Mutation",e[e.Subscription=2]="Subscription"})(O||(O={}));var S;function se(e){var t;switch(e){case O.Query:t="Query";break;case O.Mutation:t="Mutation";break;case O.Subscription:t="Subscription";break}return t}function Ie(e){S||(S=new Ue(Be.parser||1e3));var t=S.get(e);if(t)return t;var n,i,r;I(!!e&&!!e.kind,70,e);for(var s=[],o=[],u=[],d=[],f=0,h=e.definitions;f<h.length;f++){var p=h[f];if(p.kind==="FragmentDefinition"){s.push(p);continue}if(p.kind==="OperationDefinition")switch(p.operation){case"query":o.push(p);break;case"mutation":u.push(p);break;case"subscription":d.push(p);break}}I(!s.length||o.length||u.length||d.length,71),I(o.length+u.length+d.length<=1,72,e,o.length,d.length,u.length),i=o.length?O.Query:O.Mutation,!o.length&&!u.length&&(i=O.Subscription);var m=o.length?o:u.length?u:d;I(m.length===1,73,e,m.length);var E=m[0];n=E.variableDefinitions||[],E.name&&E.name.kind==="Name"?r=E.name.value:r="data";var v={name:r,type:i,variables:n};return S.set(e,v),v}Ie.resetCache=function(){S=void 0};globalThis.__DEV__!==!1&&Pe("parser",function(){return S?S.size:0});function At(e,t){var n=Ie(e),i=se(t),r=se(n.type);I(n.type===t,74,i,i,r)}var Ct=Symbol.for("apollo.hook.wrappers");function Ot(e,t,n){var i=n.queryManager,r=i&&i[Ct],s=r&&r[e];return s?s(t):t}var It=Object.prototype.hasOwnProperty;function ae(){}var B=Symbol();function St(e,t){return t===void 0&&(t=Object.create(null)),Ot("useQuery",_t,Oe(t&&t.client))(e,t)}function _t(e,t){var n=Dt(e,t),i=n.result,r=n.obsQueryFields;return k.useMemo(function(){return A(A({},i),r)},[i,r])}function wt(e,t,n,i,r){function s(p){var m;At(t,O.Query);var E={client:e,query:t,observable:i&&i.getSSRObservable(r())||e.watchQuery(Se(void 0,e,n,r())),resultData:{previousData:(m=p==null?void 0:p.resultData.current)===null||m===void 0?void 0:m.data}};return E}var o=k.useState(s),u=o[0],d=o[1];function f(p){var m,E;Object.assign(u.observable,(m={},m[B]=p,m));var v=u.resultData;d(A(A({},u),{query:p.query,resultData:Object.assign(v,{previousData:((E=v.current)===null||E===void 0?void 0:E.data)||v.previousData,current:void 0})}))}if(e!==u.client||t!==u.query){var h=s(u);return d(h),[h,f]}return[u,f]}function Dt(e,t){var n=Oe(t.client),i=k.useContext(me()).renderPromises,r=!!i,s=n.disableNetworkFetches,o=t.ssr!==!1&&!t.skip,u=t.partialRefetch,d=Mt(n,e,t,r),f=wt(n,e,t,i,d),h=f[0],p=h.observable,m=h.resultData,E=f[1],v=d(p);Ft(m,p,n,t,v);var N=k.useMemo(function(){return Bt(p)},[p]);Lt(p,i,o);var D=Rt(m,p,n,t,v,s,u,r,{onCompleted:t.onCompleted||ae,onError:t.onError||ae});return{result:D,obsQueryFields:N,observable:p,resultData:m,client:n,onQueryExecuted:E}}function Rt(e,t,n,i,r,s,o,u,d){var f=k.useRef(d);k.useEffect(function(){f.current=d});var h=(u||s)&&i.ssr===!1&&!i.skip?we:i.skip||r.fetchPolicy==="standby"?De:void 0,p=e.previousData,m=k.useMemo(function(){return h&&_e(h,p,t,n)},[n,t,h,p]);return Tt(k.useCallback(function(E){if(u)return function(){};var v=function(){var C=e.current,T=t.getCurrentResult();C&&C.loading===T.loading&&C.networkStatus===T.networkStatus&&Y(C.data,T.data)||Z(T,e,t,n,o,E,f.current)},N=function(C){if(D.current.unsubscribe(),D.current=t.resubscribeAfterError(v,N),!It.call(C,"graphQLErrors"))throw C;var T=e.current;(!T||T&&T.loading||!Y(C,T.error))&&Z({data:T&&T.data,error:C,loading:!1,networkStatus:F.error},e,t,n,o,E,f.current)},D={current:t.subscribe(v,N)};return function(){setTimeout(function(){return D.current.unsubscribe()})}},[s,u,t,e,o,n]),function(){return m||oe(e,t,f.current,o,n)},function(){return m||oe(e,t,f.current,o,n)})}function Lt(e,t,n){t&&n&&(t.registerSSRObservable(e),e.getCurrentResult().loading&&t.addObservableQueryPromise(e))}function Ft(e,t,n,i,r){var s;t[B]&&!Y(t[B],r)&&(t.reobserve(Se(t,n,i,r)),e.previousData=((s=e.current)===null||s===void 0?void 0:s.data)||e.previousData,e.current=void 0),t[B]=r}function Mt(e,t,n,i){n===void 0&&(n={});var r=n.skip;n.ssr,n.onCompleted,n.onError;var s=n.defaultOptions,o=ge(n,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(u){var d=Object.assign(o,{query:t});return i&&(d.fetchPolicy==="network-only"||d.fetchPolicy==="cache-and-network")&&(d.fetchPolicy="cache-first"),d.variables||(d.variables={}),r?(d.initialFetchPolicy=d.initialFetchPolicy||d.fetchPolicy||ce(s,e.defaultOptions),d.fetchPolicy="standby"):d.fetchPolicy||(d.fetchPolicy=(u==null?void 0:u.options.initialFetchPolicy)||ce(s,e.defaultOptions)),d}}function Se(e,t,n,i){var r=[],s=t.defaultOptions.watchQuery;return s&&r.push(s),n.defaultOptions&&r.push(n.defaultOptions),r.push(Ve(e&&e.options,i)),r.reduce(qe)}function Z(e,t,n,i,r,s,o){var u=t.current;u&&u.data&&(t.previousData=u.data),!e.error&&xe(e.errors)&&(e.error=new ye({graphQLErrors:e.errors})),t.current=_e(Ut(e,n,r),t.previousData,n,i),s(),jt(e,u==null?void 0:u.networkStatus,o)}function jt(e,t,n){if(!e.loading){var i=Pt(e);Promise.resolve().then(function(){i?n.onError(i):e.data&&t!==e.networkStatus&&e.networkStatus===F.ready&&n.onCompleted(e.data)}).catch(function(r){globalThis.__DEV__!==!1&&I.warn(r)})}}function oe(e,t,n,i,r){return e.current||Z(t.getCurrentResult(),e,t,r,i,function(){},n),e.current}function ce(e,t){var n;return(e==null?void 0:e.fetchPolicy)||((n=t==null?void 0:t.watchQuery)===null||n===void 0?void 0:n.fetchPolicy)||"cache-first"}function Pt(e){return xe(e.errors)?new ye({graphQLErrors:e.errors}):e.error}function _e(e,t,n,i){var r=e.data;e.partial;var s=ge(e,["data","partial"]),o=A(A({data:r},s),{client:i,observable:n,variables:n.variables,called:e!==we&&e!==De,previousData:t});return o}function Ut(e,t,n){return e.partial&&n&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&t.options.fetchPolicy!=="cache-only"?(t.refetch(),A(A({},e),{loading:!0,networkStatus:F.refetch})):e}var we=ve({loading:!0,data:void 0,error:void 0,networkStatus:F.loading}),De=ve({loading:!1,data:void 0,error:void 0,networkStatus:F.ready});function Bt(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}y`
  query me {
    me {
      id
      username
      email
      name
      avatarUrl
      isAnonymous
      createdAt
      updatedAt
    }
  }
`;y`
  query user($id: ID!) {
    user(id: $id) {
      id
      username
      email
      name
      avatarUrl
      isAnonymous
      createdAt
      updatedAt
    }
  }
`;y`
  query users {
    users {
      id
      username
      name
      avatarUrl
      isAnonymous
    }
  }
`;y`
  query userMoods {
    userMoods {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;const Vt=y`
  query publicMoods {
    publicMoods {
      id
      score
      note
      createdAt
      user {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;y`
  query mood($id: ID!) {
    mood(id: $id) {
      id
      score
      note
      isPublic
      createdAt
      userId
    }
  }
`;y`
  query moodStreak {
    moodStreak
  }
`;y`
  query sentHugs {
    sentHugs {
      id
      type
      message
      isRead
      createdAt
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;y`
  query receivedHugs {
    receivedHugs {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;y`
  query hug($id: ID!) {
    hug(id: $id) {
      id
      type
      message
      isRead
      createdAt
      sender {
        id
        username
        name
      }
      recipient {
        id
        username
        name
      }
    }
  }
`;y`
  query myHugRequests {
    myHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      respondedAt
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;y`
  query pendingHugRequests {
    pendingHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      requester {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;y`
  query communityHugRequests {
    communityHugRequests {
      id
      message
      isCommunityRequest
      status
      createdAt
      requester {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;y`
  query hugRequest($id: ID!) {
    hugRequest(id: $id) {
      id
      message
      isCommunityRequest
      status
      createdAt
      respondedAt
      requester {
        id
        username
        name
        avatarUrl
      }
      recipient {
        id
        username
        name
        avatarUrl
      }
    }
  }
`;y`
  query userStats {
    me {
      id
      receivedHugs {
        id
      }
      sentHugs {
        id
      }
    }
    moodStreak
  }
`;const qt=$e`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`,$t=g.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`,Qt=g.div`
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: ${qt} 1s linear infinite;
  margin-bottom: 1rem;
`,Gt=g.p`
  color: var(--gray-600);
  font-size: 0.9rem;
`,zt=({text:e="Loading..."})=>c.jsxs($t,{children:[c.jsx(Qt,{}),c.jsx(Gt,{children:e})]}),Kt=(e,t={})=>{var i;const n=((i=e==null?void 0:e.message)==null?void 0:i.toLowerCase())||"";return n.includes("unauthorized")||n.includes("unauthenticated")||n.includes("auth")||n.includes("login")||n.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":n.includes("network")||n.includes("connection")||n.includes("offline")||n.includes("failed to fetch")||e.name==="NetworkError"||t.isNetworkError?"network":n.includes("not found")||n.includes("404")||n.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||t.isRouteError?"route":n.includes("validation")||n.includes("invalid")||n.includes("data")||n.includes("database")||n.includes("constraint")||t.isDataError?"data":"general"},Ht=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},Yt=g.div`
  background-color: var(--danger-light);
  border: 1px solid var(--danger-color);
  border-radius: var(--border-radius);
  padding: 1rem;
  margin: 1rem 0;
  color: var(--danger-dark);
`,Wt=g.h3`
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
`,Jt=g.p`
  margin: 0;
  font-size: 0.9rem;
`,Xt=g.button`
  background-color: var(--danger-color);
  color: white;
  border: none;
  border-radius: var(--border-radius);
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  cursor: pointer;
  font-size: 0.85rem;
  
  &:hover {
    background-color: var(--danger-dark);
  }
`,Zt=({error:e,onRetry:t})=>{const n=Kt(e),{title:i,description:r}=Ht(n);return c.jsxs(Yt,{children:[c.jsx(Wt,{children:i}),c.jsx(Jt,{children:r}),t&&c.jsx(Xt,{onClick:t,children:"Try Again"})]})},ue=g.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
`,de=g.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h2 {
    color: var(--gray-800);
    margin: 0;
  }
`,le=g.button`
  background: none;
  border: none;
  color: var(--primary-color);
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`,en=g.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`,tn=g.div`
  border: 1px solid var(--gray-200);
  border-radius: var(--border-radius);
  padding: 1rem;
  transition: var(--transition-base);
  
  &:hover {
    box-shadow: var(--shadow-sm);
    transform: translateY(-2px);
  }
`,nn=g.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`,rn=g.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  .emoji {
    font-size: 1.5rem;
  }
  
  .label {
    font-weight: 500;
    color: var(--gray-800);
  }
`,sn=g.div`
  font-size: 0.8rem;
  color: var(--gray-500);
`,an=g.p`
  color: var(--gray-700);
  font-size: 0.9rem;
  margin: 0.5rem 0;
  line-height: 1.4;
`,on=g.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--gray-600);
  
  .avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--primary-light);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.7rem;
    margin-right: 0.5rem;
  }
`,cn=g.div`
  text-align: center;
  padding: 2rem;
  color: var(--gray-600);
  
  p {
    margin-bottom: 1rem;
  }
`,un=e=>["😢","😟","😐","🙂","😄"][Math.min(Math.floor(e)-1,4)],dn=e=>["Very Sad","Sad","Neutral","Happy","Very Happy"][Math.min(Math.floor(e)-1,4)],ln=e=>new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}),hn=e=>e?e.split(" ").map(t=>t[0]).join("").toUpperCase().substring(0,2):"?",pn=()=>{const{loading:e,error:t,data:n,refetch:i}=St(Vt);if(e)return c.jsx(zt,{text:"Loading public moods..."});if(t)return c.jsx(Zt,{error:t});const r=(n==null?void 0:n.publicMoods)||[];return r.length===0?c.jsxs(ue,{children:[c.jsxs(de,{children:[c.jsx("h2",{children:"Community Moods"}),c.jsx(le,{onClick:()=>i(),children:c.jsx("span",{children:"Refresh"})})]}),c.jsxs(cn,{children:[c.jsx("p",{children:"No public moods have been shared yet."}),c.jsx("p",{children:"The community mood board will populate as users share their feelings."})]})]}):c.jsxs(ue,{children:[c.jsxs(de,{children:[c.jsx("h2",{children:"Community Moods"}),c.jsx(le,{onClick:()=>i(),children:c.jsx("span",{children:"Refresh"})})]}),c.jsx(en,{children:r.map(s=>{var o,u;return c.jsxs(tn,{children:[c.jsxs(nn,{children:[c.jsxs(rn,{children:[c.jsx("span",{className:"emoji",children:un(s.score)}),c.jsx("span",{className:"label",children:dn(s.score)})]}),c.jsx(sn,{children:ln(s.createdAt)})]}),s.note&&c.jsx(an,{children:s.note}),c.jsxs(on,{children:[c.jsx("div",{className:"avatar",children:hn((o=s.user)==null?void 0:o.name)}),c.jsx("span",{children:((u=s.user)==null?void 0:u.name)||"Anonymous User"})]})]},s.id)})})]})},fn=g.div`
  min-height: 100vh;
  background-color: var(--gray-100);
`,mn=g.header`
  background-color: white;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  justify-content: space-between;
  align-items: center;
`,gn=g.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
`,vn=g.div`
  display: flex;
  align-items: center;
`,xn=g.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--primary-light);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 0.5rem;
`,yn=g.span`
  font-weight: 500;
  margin-right: 1rem;
`,En=g.button`
  background: none;
  border: none;
  color: var(--gray-600);
  cursor: pointer;
  
  &:hover {
    color: var(--danger-color);
  }
`,bn=g.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`,kn=g.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  margin-bottom: 2rem;
  
  h1 {
    margin-bottom: 1rem;
    color: var(--gray-800);
  }
  
  p {
    color: var(--gray-600);
    margin-bottom: 1.5rem;
  }
`,Nn=g.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`,H=g.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
  
  h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
  }
  
  p {
    color: var(--gray-600);
  }
`,Tn=g.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`,P=g.div`
  background-color: white;
  border-radius: var(--border-radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  text-align: center;
  
  h3 {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--gray-600);
    font-size: 0.9rem;
  }
`,Cn=()=>{const{currentUser:e,logout:t}=Qe(),[n,i]=G.useState(!0),[r,s]=G.useState({moodStreak:0,totalMoods:0,hugsSent:0,hugsReceived:0}),o=Ge();G.useEffect(()=>{const h=setTimeout(()=>{s({moodStreak:3,totalMoods:15,hugsSent:7,hugsReceived:12}),i(!1)},1e3);return()=>clearTimeout(h)},[]);const u=async()=>{await t(),o("/login")},d=h=>{o(h)},f=h=>h?h.split(" ").map(p=>p[0]).join("").toUpperCase().substring(0,2):"?";return n?c.jsx(ze,{text:"Loading dashboard..."}):c.jsxs(fn,{children:[c.jsxs(mn,{children:[c.jsx(gn,{children:"HugMeNow"}),c.jsxs(vn,{children:[c.jsx(xn,{children:f(e==null?void 0:e.name)}),c.jsx(yn,{children:(e==null?void 0:e.name)||"Guest"}),c.jsx(En,{onClick:u,children:"Logout"})]})]}),c.jsxs(bn,{children:[c.jsxs(kn,{children:[c.jsxs("h1",{children:["Welcome, ",(e==null?void 0:e.name)||"Friend","!"]}),c.jsx("p",{children:"This is your personal dashboard where you can track your mood, send and receive virtual hugs, and connect with others."})]}),c.jsxs(Tn,{children:[c.jsxs(P,{children:[c.jsx("h3",{children:r.moodStreak}),c.jsx("p",{children:"Day Streak"})]}),c.jsxs(P,{children:[c.jsx("h3",{children:r.totalMoods}),c.jsx("p",{children:"Moods Tracked"})]}),c.jsxs(P,{children:[c.jsx("h3",{children:r.hugsSent}),c.jsx("p",{children:"Hugs Sent"})]}),c.jsxs(P,{children:[c.jsx("h3",{children:r.hugsReceived}),c.jsx("p",{children:"Hugs Received"})]})]}),c.jsxs(Nn,{children:[c.jsxs(H,{onClick:()=>d("/mood-tracker"),children:[c.jsx("h2",{children:"Mood Tracker"}),c.jsx("p",{children:"Track your daily mood and see patterns in your emotional wellbeing over time."})]}),c.jsxs(H,{onClick:()=>d("/hug-center"),children:[c.jsx("h2",{children:"Hug Center"}),c.jsx("p",{children:"Send virtual hugs to friends or request hugs from the community when you need support."})]}),c.jsxs(H,{onClick:()=>d("/profile"),children:[c.jsx("h2",{children:"Profile"}),c.jsx("p",{children:"Manage your personal information, preferences, and privacy settings."})]})]}),c.jsx("div",{style:{marginTop:"2rem"},children:c.jsx(pn,{})})]})]})};export{Cn as default};
//# sourceMappingURL=Dashboard-4d905a38.js.map
