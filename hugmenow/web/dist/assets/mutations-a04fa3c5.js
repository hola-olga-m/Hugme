import{T as ge,i as G,e as ye,f as $e,g as Be,h as Ie,k as z,K as d,O as $,l as qe,_ as k,n as x,o as xe,p as C,q as Ve,R as Ge,s as Qe,A as je,t as He,v as Ke,w as F,x as Ne,y as Ye,z as Te,B as ke,N as M,C as _e,D as re,d as j,j as A}from"./main-0012ce0c.js";function ze(e){return typeof e=="object"&&e!==null}function We(e,t){if(!!!e)throw new Error(t??"Unexpected invariant triggered.")}const Je=/\r\n|[\n\r]/g;function Z(e,t){let n=0,i=1;for(const r of e.body.matchAll(Je)){if(typeof r.index=="number"||We(!1),r.index>=t)break;n=r.index+r[0].length,i+=1}return{line:i,column:t+1-n}}function Xe(e){return Ae(e.source,Z(e.source,e.start))}function Ae(e,t){const n=e.locationOffset.column-1,i="".padStart(n)+e.body,r=t.line-1,s=e.locationOffset.line-1,o=t.line+s,c=t.line===1?n:0,u=t.column+c,l=`${e.name}:${o}:${u}
`,p=i.split(/\r\n|[\n\r]/g),h=p[r];if(h.length>120){const f=Math.floor(u/80),v=u%80,m=[];for(let T=0;T<h.length;T+=80)m.push(h.slice(T,T+80));return l+ce([[`${o} |`,m[0]],...m.slice(1,f+1).map(T=>["|",T]),["|","^".padStart(v)],["|",m[f+1]]])}return l+ce([[`${o-1} |`,p[r-1]],[`${o} |`,h],["|","^".padStart(u)],[`${o+1} |`,p[r+1]]])}function ce(e){const t=e.filter(([i,r])=>r!==void 0),n=Math.max(...t.map(([i])=>i.length));return t.map(([i,r])=>i.padStart(n)+(r?" "+r:"")).join(`
`)}function Ze(e){const t=e[0];return t==null||"kind"in t||"length"in t?{nodes:t,source:e[1],positions:e[2],path:e[3],originalError:e[4],extensions:e[5]}:t}class ie extends Error{constructor(t,...n){var i,r,s;const{nodes:o,source:c,positions:u,path:l,originalError:p,extensions:h}=Ze(n);super(t),this.name="GraphQLError",this.path=l??void 0,this.originalError=p??void 0,this.nodes=ue(Array.isArray(o)?o:o?[o]:void 0);const f=ue((i=this.nodes)===null||i===void 0?void 0:i.map(m=>m.loc).filter(m=>m!=null));this.source=c??(f==null||(r=f[0])===null||r===void 0?void 0:r.source),this.positions=u??(f==null?void 0:f.map(m=>m.start)),this.locations=u&&c?u.map(m=>Z(c,m)):f==null?void 0:f.map(m=>Z(m.source,m.start));const v=ze(p==null?void 0:p.extensions)?p==null?void 0:p.extensions:void 0;this.extensions=(s=h??v)!==null&&s!==void 0?s:Object.create(null),Object.defineProperties(this,{message:{writable:!0,enumerable:!0},name:{enumerable:!1},nodes:{enumerable:!1},source:{enumerable:!1},positions:{enumerable:!1},originalError:{enumerable:!1}}),p!=null&&p.stack?Object.defineProperty(this,"stack",{value:p.stack,writable:!0,configurable:!0}):Error.captureStackTrace?Error.captureStackTrace(this,ie):Object.defineProperty(this,"stack",{value:Error().stack,writable:!0,configurable:!0})}get[Symbol.toStringTag](){return"GraphQLError"}toString(){let t=this.message;if(this.nodes)for(const n of this.nodes)n.loc&&(t+=`

`+Xe(n.loc));else if(this.source&&this.locations)for(const n of this.locations)t+=`

`+Ae(this.source,n);return t}toJSON(){const t={message:this.message};return this.locations!=null&&(t.locations=this.locations),this.path!=null&&(t.path=this.path),this.extensions!=null&&Object.keys(this.extensions).length>0&&(t.extensions=this.extensions),t}}function ue(e){return e===void 0||e.length===0?void 0:e}function N(e,t,n){return new ie(`Syntax Error: ${n}`,{source:e,positions:[t]})}var ee;(function(e){e.QUERY="QUERY",e.MUTATION="MUTATION",e.SUBSCRIPTION="SUBSCRIPTION",e.FIELD="FIELD",e.FRAGMENT_DEFINITION="FRAGMENT_DEFINITION",e.FRAGMENT_SPREAD="FRAGMENT_SPREAD",e.INLINE_FRAGMENT="INLINE_FRAGMENT",e.VARIABLE_DEFINITION="VARIABLE_DEFINITION",e.SCHEMA="SCHEMA",e.SCALAR="SCALAR",e.OBJECT="OBJECT",e.FIELD_DEFINITION="FIELD_DEFINITION",e.ARGUMENT_DEFINITION="ARGUMENT_DEFINITION",e.INTERFACE="INTERFACE",e.UNION="UNION",e.ENUM="ENUM",e.ENUM_VALUE="ENUM_VALUE",e.INPUT_OBJECT="INPUT_OBJECT",e.INPUT_FIELD_DEFINITION="INPUT_FIELD_DEFINITION"})(ee||(ee={}));var a;(function(e){e.SOF="<SOF>",e.EOF="<EOF>",e.BANG="!",e.DOLLAR="$",e.AMP="&",e.PAREN_L="(",e.PAREN_R=")",e.SPREAD="...",e.COLON=":",e.EQUALS="=",e.AT="@",e.BRACKET_L="[",e.BRACKET_R="]",e.BRACE_L="{",e.PIPE="|",e.BRACE_R="}",e.NAME="Name",e.INT="Int",e.FLOAT="Float",e.STRING="String",e.BLOCK_STRING="BlockString",e.COMMENT="Comment"})(a||(a={}));class et{constructor(t){const n=new ge(a.SOF,0,0,0,0);this.source=t,this.lastToken=n,this.token=n,this.line=1,this.lineStart=0}get[Symbol.toStringTag](){return"Lexer"}advance(){return this.lastToken=this.token,this.token=this.lookahead()}lookahead(){let t=this.token;if(t.kind!==a.EOF)do if(t.next)t=t.next;else{const n=nt(this,t.end);t.next=n,n.prev=t,t=n}while(t.kind===a.COMMENT);return t}}function tt(e){return e===a.BANG||e===a.DOLLAR||e===a.AMP||e===a.PAREN_L||e===a.PAREN_R||e===a.SPREAD||e===a.COLON||e===a.EQUALS||e===a.AT||e===a.BRACKET_L||e===a.BRACKET_R||e===a.BRACE_L||e===a.PIPE||e===a.BRACE_R}function D(e){return e>=0&&e<=55295||e>=57344&&e<=1114111}function H(e,t){return Oe(e.charCodeAt(t))&&Ce(e.charCodeAt(t+1))}function Oe(e){return e>=55296&&e<=56319}function Ce(e){return e>=56320&&e<=57343}function R(e,t){const n=e.source.body.codePointAt(t);if(n===void 0)return a.EOF;if(n>=32&&n<=126){const i=String.fromCodePoint(n);return i==='"'?`'"'`:`"${i}"`}return"U+"+n.toString(16).toUpperCase().padStart(4,"0")}function g(e,t,n,i,r){const s=e.line,o=1+n-e.lineStart;return new ge(t,n,i,s,o,r)}function nt(e,t){const n=e.source.body,i=n.length;let r=t;for(;r<i;){const s=n.charCodeAt(r);switch(s){case 65279:case 9:case 32:case 44:++r;continue;case 10:++r,++e.line,e.lineStart=r;continue;case 13:n.charCodeAt(r+1)===10?r+=2:++r,++e.line,e.lineStart=r;continue;case 35:return rt(e,r);case 33:return g(e,a.BANG,r,r+1);case 36:return g(e,a.DOLLAR,r,r+1);case 38:return g(e,a.AMP,r,r+1);case 40:return g(e,a.PAREN_L,r,r+1);case 41:return g(e,a.PAREN_R,r,r+1);case 46:if(n.charCodeAt(r+1)===46&&n.charCodeAt(r+2)===46)return g(e,a.SPREAD,r,r+3);break;case 58:return g(e,a.COLON,r,r+1);case 61:return g(e,a.EQUALS,r,r+1);case 64:return g(e,a.AT,r,r+1);case 91:return g(e,a.BRACKET_L,r,r+1);case 93:return g(e,a.BRACKET_R,r,r+1);case 123:return g(e,a.BRACE_L,r,r+1);case 124:return g(e,a.PIPE,r,r+1);case 125:return g(e,a.BRACE_R,r,r+1);case 34:return n.charCodeAt(r+1)===34&&n.charCodeAt(r+2)===34?ut(e,r):st(e,r)}if(G(s)||s===45)return it(e,r,s);if(ye(s))return dt(e,r);throw N(e.source,r,s===39?`Unexpected single quote character ('), did you mean to use a double quote (")?`:D(s)||H(n,r)?`Unexpected character: ${R(e,r)}.`:`Invalid character: ${R(e,r)}.`)}return g(e,a.EOF,i,i)}function rt(e,t){const n=e.source.body,i=n.length;let r=t+1;for(;r<i;){const s=n.charCodeAt(r);if(s===10||s===13)break;if(D(s))++r;else if(H(n,r))r+=2;else break}return g(e,a.COMMENT,t,r,n.slice(t+1,r))}function it(e,t,n){const i=e.source.body;let r=t,s=n,o=!1;if(s===45&&(s=i.charCodeAt(++r)),s===48){if(s=i.charCodeAt(++r),G(s))throw N(e.source,r,`Invalid number, unexpected digit after 0: ${R(e,r)}.`)}else r=W(e,r,s),s=i.charCodeAt(r);if(s===46&&(o=!0,s=i.charCodeAt(++r),r=W(e,r,s),s=i.charCodeAt(r)),(s===69||s===101)&&(o=!0,s=i.charCodeAt(++r),(s===43||s===45)&&(s=i.charCodeAt(++r)),r=W(e,r,s),s=i.charCodeAt(r)),s===46||ye(s))throw N(e.source,r,`Invalid number, expected digit but got: ${R(e,r)}.`);return g(e,o?a.FLOAT:a.INT,t,r,i.slice(t,r))}function W(e,t,n){if(!G(n))throw N(e.source,t,`Invalid number, expected digit but got: ${R(e,t)}.`);const i=e.source.body;let r=t+1;for(;G(i.charCodeAt(r));)++r;return r}function st(e,t){const n=e.source.body,i=n.length;let r=t+1,s=r,o="";for(;r<i;){const c=n.charCodeAt(r);if(c===34)return o+=n.slice(s,r),g(e,a.STRING,t,r+1,o);if(c===92){o+=n.slice(s,r);const u=n.charCodeAt(r+1)===117?n.charCodeAt(r+2)===123?at(e,r):ot(e,r):ct(e,r);o+=u.value,r+=u.size,s=r;continue}if(c===10||c===13)break;if(D(c))++r;else if(H(n,r))r+=2;else throw N(e.source,r,`Invalid character within String: ${R(e,r)}.`)}throw N(e.source,r,"Unterminated string.")}function at(e,t){const n=e.source.body;let i=0,r=3;for(;r<12;){const s=n.charCodeAt(t+r++);if(s===125){if(r<5||!D(i))break;return{value:String.fromCodePoint(i),size:r}}if(i=i<<4|L(s),i<0)break}throw N(e.source,t,`Invalid Unicode escape sequence: "${n.slice(t,t+r)}".`)}function ot(e,t){const n=e.source.body,i=de(n,t+2);if(D(i))return{value:String.fromCodePoint(i),size:6};if(Oe(i)&&n.charCodeAt(t+6)===92&&n.charCodeAt(t+7)===117){const r=de(n,t+8);if(Ce(r))return{value:String.fromCodePoint(i,r),size:12}}throw N(e.source,t,`Invalid Unicode escape sequence: "${n.slice(t,t+6)}".`)}function de(e,t){return L(e.charCodeAt(t))<<12|L(e.charCodeAt(t+1))<<8|L(e.charCodeAt(t+2))<<4|L(e.charCodeAt(t+3))}function L(e){return e>=48&&e<=57?e-48:e>=65&&e<=70?e-55:e>=97&&e<=102?e-87:-1}function ct(e,t){const n=e.source.body;switch(n.charCodeAt(t+1)){case 34:return{value:'"',size:2};case 92:return{value:"\\",size:2};case 47:return{value:"/",size:2};case 98:return{value:"\b",size:2};case 102:return{value:"\f",size:2};case 110:return{value:`
`,size:2};case 114:return{value:"\r",size:2};case 116:return{value:"	",size:2}}throw N(e.source,t,`Invalid character escape sequence: "${n.slice(t,t+2)}".`)}function ut(e,t){const n=e.source.body,i=n.length;let r=e.lineStart,s=t+3,o=s,c="";const u=[];for(;s<i;){const l=n.charCodeAt(s);if(l===34&&n.charCodeAt(s+1)===34&&n.charCodeAt(s+2)===34){c+=n.slice(o,s),u.push(c);const p=g(e,a.BLOCK_STRING,t,s+3,$e(u).join(`
`));return e.line+=u.length-1,e.lineStart=r,p}if(l===92&&n.charCodeAt(s+1)===34&&n.charCodeAt(s+2)===34&&n.charCodeAt(s+3)===34){c+=n.slice(o,s),o=s+1,s+=4;continue}if(l===10||l===13){c+=n.slice(o,s),u.push(c),l===13&&n.charCodeAt(s+1)===10?s+=2:++s,c="",o=s,r=s;continue}if(D(l))++s;else if(H(n,s))s+=2;else throw N(e.source,s,`Invalid character within String: ${R(e,s)}.`)}throw N(e.source,s,"Unterminated string.")}function dt(e,t){const n=e.source.body,i=n.length;let r=t+1;for(;r<i;){const s=n.charCodeAt(r);if(Be(s))++r;else break}return g(e,a.NAME,t,r,n.slice(t,r))}const lt=globalThis.process&&!0,ht=lt?function(t,n){return t instanceof n}:function(t,n){if(t instanceof n)return!0;if(typeof t=="object"&&t!==null){var i;const r=n.prototype[Symbol.toStringTag],s=Symbol.toStringTag in t?t[Symbol.toStringTag]:(i=t.constructor)===null||i===void 0?void 0:i.name;if(r===s){const o=Ie(t);throw new Error(`Cannot use ${r} "${o}" from another module or realm.

Ensure that there is only one instance of "graphql" in the node_modules
directory. If different versions of "graphql" are the dependencies of other
relied on modules, use "resolutions" to ensure only one version is installed.

https://yarnpkg.com/en/docs/selective-version-resolutions

Duplicate "graphql" modules cannot be used at the same time since different
versions may have different capabilities and behavior. The data from one
version used in the function from another could produce confusing and
spurious results.`)}}return!1};class Se{constructor(t,n="GraphQL request",i={line:1,column:1}){typeof t=="string"||z(!1,`Body must be a string. Received: ${Ie(t)}.`),this.body=t,this.name=n,this.locationOffset=i,this.locationOffset.line>0||z(!1,"line in locationOffset is 1-indexed and must be positive."),this.locationOffset.column>0||z(!1,"column in locationOffset is 1-indexed and must be positive.")}get[Symbol.toStringTag](){return"Source"}}function pt(e){return ht(e,Se)}function ft(e,t){const n=new mt(e,t),i=n.parseDocument();return Object.defineProperty(i,"tokenCount",{enumerable:!1,value:n.tokenCount}),i}class mt{constructor(t,n={}){const i=pt(t)?t:new Se(t);this._lexer=new et(i),this._options=n,this._tokenCounter=0}get tokenCount(){return this._tokenCounter}parseName(){const t=this.expectToken(a.NAME);return this.node(t,{kind:d.NAME,value:t.value})}parseDocument(){return this.node(this._lexer.token,{kind:d.DOCUMENT,definitions:this.many(a.SOF,this.parseDefinition,a.EOF)})}parseDefinition(){if(this.peek(a.BRACE_L))return this.parseOperationDefinition();const t=this.peekDescription(),n=t?this._lexer.lookahead():this._lexer.token;if(n.kind===a.NAME){switch(n.value){case"schema":return this.parseSchemaDefinition();case"scalar":return this.parseScalarTypeDefinition();case"type":return this.parseObjectTypeDefinition();case"interface":return this.parseInterfaceTypeDefinition();case"union":return this.parseUnionTypeDefinition();case"enum":return this.parseEnumTypeDefinition();case"input":return this.parseInputObjectTypeDefinition();case"directive":return this.parseDirectiveDefinition()}if(t)throw N(this._lexer.source,this._lexer.token.start,"Unexpected description, descriptions are supported only on type definitions.");switch(n.value){case"query":case"mutation":case"subscription":return this.parseOperationDefinition();case"fragment":return this.parseFragmentDefinition();case"extend":return this.parseTypeSystemExtension()}}throw this.unexpected(n)}parseOperationDefinition(){const t=this._lexer.token;if(this.peek(a.BRACE_L))return this.node(t,{kind:d.OPERATION_DEFINITION,operation:$.QUERY,name:void 0,variableDefinitions:[],directives:[],selectionSet:this.parseSelectionSet()});const n=this.parseOperationType();let i;return this.peek(a.NAME)&&(i=this.parseName()),this.node(t,{kind:d.OPERATION_DEFINITION,operation:n,name:i,variableDefinitions:this.parseVariableDefinitions(),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseOperationType(){const t=this.expectToken(a.NAME);switch(t.value){case"query":return $.QUERY;case"mutation":return $.MUTATION;case"subscription":return $.SUBSCRIPTION}throw this.unexpected(t)}parseVariableDefinitions(){return this.optionalMany(a.PAREN_L,this.parseVariableDefinition,a.PAREN_R)}parseVariableDefinition(){return this.node(this._lexer.token,{kind:d.VARIABLE_DEFINITION,variable:this.parseVariable(),type:(this.expectToken(a.COLON),this.parseTypeReference()),defaultValue:this.expectOptionalToken(a.EQUALS)?this.parseConstValueLiteral():void 0,directives:this.parseConstDirectives()})}parseVariable(){const t=this._lexer.token;return this.expectToken(a.DOLLAR),this.node(t,{kind:d.VARIABLE,name:this.parseName()})}parseSelectionSet(){return this.node(this._lexer.token,{kind:d.SELECTION_SET,selections:this.many(a.BRACE_L,this.parseSelection,a.BRACE_R)})}parseSelection(){return this.peek(a.SPREAD)?this.parseFragment():this.parseField()}parseField(){const t=this._lexer.token,n=this.parseName();let i,r;return this.expectOptionalToken(a.COLON)?(i=n,r=this.parseName()):r=n,this.node(t,{kind:d.FIELD,alias:i,name:r,arguments:this.parseArguments(!1),directives:this.parseDirectives(!1),selectionSet:this.peek(a.BRACE_L)?this.parseSelectionSet():void 0})}parseArguments(t){const n=t?this.parseConstArgument:this.parseArgument;return this.optionalMany(a.PAREN_L,n,a.PAREN_R)}parseArgument(t=!1){const n=this._lexer.token,i=this.parseName();return this.expectToken(a.COLON),this.node(n,{kind:d.ARGUMENT,name:i,value:this.parseValueLiteral(t)})}parseConstArgument(){return this.parseArgument(!0)}parseFragment(){const t=this._lexer.token;this.expectToken(a.SPREAD);const n=this.expectOptionalKeyword("on");return!n&&this.peek(a.NAME)?this.node(t,{kind:d.FRAGMENT_SPREAD,name:this.parseFragmentName(),directives:this.parseDirectives(!1)}):this.node(t,{kind:d.INLINE_FRAGMENT,typeCondition:n?this.parseNamedType():void 0,directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentDefinition(){const t=this._lexer.token;return this.expectKeyword("fragment"),this._options.allowLegacyFragmentVariables===!0?this.node(t,{kind:d.FRAGMENT_DEFINITION,name:this.parseFragmentName(),variableDefinitions:this.parseVariableDefinitions(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()}):this.node(t,{kind:d.FRAGMENT_DEFINITION,name:this.parseFragmentName(),typeCondition:(this.expectKeyword("on"),this.parseNamedType()),directives:this.parseDirectives(!1),selectionSet:this.parseSelectionSet()})}parseFragmentName(){if(this._lexer.token.value==="on")throw this.unexpected();return this.parseName()}parseValueLiteral(t){const n=this._lexer.token;switch(n.kind){case a.BRACKET_L:return this.parseList(t);case a.BRACE_L:return this.parseObject(t);case a.INT:return this.advanceLexer(),this.node(n,{kind:d.INT,value:n.value});case a.FLOAT:return this.advanceLexer(),this.node(n,{kind:d.FLOAT,value:n.value});case a.STRING:case a.BLOCK_STRING:return this.parseStringLiteral();case a.NAME:switch(this.advanceLexer(),n.value){case"true":return this.node(n,{kind:d.BOOLEAN,value:!0});case"false":return this.node(n,{kind:d.BOOLEAN,value:!1});case"null":return this.node(n,{kind:d.NULL});default:return this.node(n,{kind:d.ENUM,value:n.value})}case a.DOLLAR:if(t)if(this.expectToken(a.DOLLAR),this._lexer.token.kind===a.NAME){const i=this._lexer.token.value;throw N(this._lexer.source,n.start,`Unexpected variable "$${i}" in constant value.`)}else throw this.unexpected(n);return this.parseVariable();default:throw this.unexpected()}}parseConstValueLiteral(){return this.parseValueLiteral(!0)}parseStringLiteral(){const t=this._lexer.token;return this.advanceLexer(),this.node(t,{kind:d.STRING,value:t.value,block:t.kind===a.BLOCK_STRING})}parseList(t){const n=()=>this.parseValueLiteral(t);return this.node(this._lexer.token,{kind:d.LIST,values:this.any(a.BRACKET_L,n,a.BRACKET_R)})}parseObject(t){const n=()=>this.parseObjectField(t);return this.node(this._lexer.token,{kind:d.OBJECT,fields:this.any(a.BRACE_L,n,a.BRACE_R)})}parseObjectField(t){const n=this._lexer.token,i=this.parseName();return this.expectToken(a.COLON),this.node(n,{kind:d.OBJECT_FIELD,name:i,value:this.parseValueLiteral(t)})}parseDirectives(t){const n=[];for(;this.peek(a.AT);)n.push(this.parseDirective(t));return n}parseConstDirectives(){return this.parseDirectives(!0)}parseDirective(t){const n=this._lexer.token;return this.expectToken(a.AT),this.node(n,{kind:d.DIRECTIVE,name:this.parseName(),arguments:this.parseArguments(t)})}parseTypeReference(){const t=this._lexer.token;let n;if(this.expectOptionalToken(a.BRACKET_L)){const i=this.parseTypeReference();this.expectToken(a.BRACKET_R),n=this.node(t,{kind:d.LIST_TYPE,type:i})}else n=this.parseNamedType();return this.expectOptionalToken(a.BANG)?this.node(t,{kind:d.NON_NULL_TYPE,type:n}):n}parseNamedType(){return this.node(this._lexer.token,{kind:d.NAMED_TYPE,name:this.parseName()})}peekDescription(){return this.peek(a.STRING)||this.peek(a.BLOCK_STRING)}parseDescription(){if(this.peekDescription())return this.parseStringLiteral()}parseSchemaDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("schema");const i=this.parseConstDirectives(),r=this.many(a.BRACE_L,this.parseOperationTypeDefinition,a.BRACE_R);return this.node(t,{kind:d.SCHEMA_DEFINITION,description:n,directives:i,operationTypes:r})}parseOperationTypeDefinition(){const t=this._lexer.token,n=this.parseOperationType();this.expectToken(a.COLON);const i=this.parseNamedType();return this.node(t,{kind:d.OPERATION_TYPE_DEFINITION,operation:n,type:i})}parseScalarTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("scalar");const i=this.parseName(),r=this.parseConstDirectives();return this.node(t,{kind:d.SCALAR_TYPE_DEFINITION,description:n,name:i,directives:r})}parseObjectTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("type");const i=this.parseName(),r=this.parseImplementsInterfaces(),s=this.parseConstDirectives(),o=this.parseFieldsDefinition();return this.node(t,{kind:d.OBJECT_TYPE_DEFINITION,description:n,name:i,interfaces:r,directives:s,fields:o})}parseImplementsInterfaces(){return this.expectOptionalKeyword("implements")?this.delimitedMany(a.AMP,this.parseNamedType):[]}parseFieldsDefinition(){return this.optionalMany(a.BRACE_L,this.parseFieldDefinition,a.BRACE_R)}parseFieldDefinition(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseName(),r=this.parseArgumentDefs();this.expectToken(a.COLON);const s=this.parseTypeReference(),o=this.parseConstDirectives();return this.node(t,{kind:d.FIELD_DEFINITION,description:n,name:i,arguments:r,type:s,directives:o})}parseArgumentDefs(){return this.optionalMany(a.PAREN_L,this.parseInputValueDef,a.PAREN_R)}parseInputValueDef(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseName();this.expectToken(a.COLON);const r=this.parseTypeReference();let s;this.expectOptionalToken(a.EQUALS)&&(s=this.parseConstValueLiteral());const o=this.parseConstDirectives();return this.node(t,{kind:d.INPUT_VALUE_DEFINITION,description:n,name:i,type:r,defaultValue:s,directives:o})}parseInterfaceTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("interface");const i=this.parseName(),r=this.parseImplementsInterfaces(),s=this.parseConstDirectives(),o=this.parseFieldsDefinition();return this.node(t,{kind:d.INTERFACE_TYPE_DEFINITION,description:n,name:i,interfaces:r,directives:s,fields:o})}parseUnionTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("union");const i=this.parseName(),r=this.parseConstDirectives(),s=this.parseUnionMemberTypes();return this.node(t,{kind:d.UNION_TYPE_DEFINITION,description:n,name:i,directives:r,types:s})}parseUnionMemberTypes(){return this.expectOptionalToken(a.EQUALS)?this.delimitedMany(a.PIPE,this.parseNamedType):[]}parseEnumTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("enum");const i=this.parseName(),r=this.parseConstDirectives(),s=this.parseEnumValuesDefinition();return this.node(t,{kind:d.ENUM_TYPE_DEFINITION,description:n,name:i,directives:r,values:s})}parseEnumValuesDefinition(){return this.optionalMany(a.BRACE_L,this.parseEnumValueDefinition,a.BRACE_R)}parseEnumValueDefinition(){const t=this._lexer.token,n=this.parseDescription(),i=this.parseEnumValueName(),r=this.parseConstDirectives();return this.node(t,{kind:d.ENUM_VALUE_DEFINITION,description:n,name:i,directives:r})}parseEnumValueName(){if(this._lexer.token.value==="true"||this._lexer.token.value==="false"||this._lexer.token.value==="null")throw N(this._lexer.source,this._lexer.token.start,`${B(this._lexer.token)} is reserved and cannot be used for an enum value.`);return this.parseName()}parseInputObjectTypeDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("input");const i=this.parseName(),r=this.parseConstDirectives(),s=this.parseInputFieldsDefinition();return this.node(t,{kind:d.INPUT_OBJECT_TYPE_DEFINITION,description:n,name:i,directives:r,fields:s})}parseInputFieldsDefinition(){return this.optionalMany(a.BRACE_L,this.parseInputValueDef,a.BRACE_R)}parseTypeSystemExtension(){const t=this._lexer.lookahead();if(t.kind===a.NAME)switch(t.value){case"schema":return this.parseSchemaExtension();case"scalar":return this.parseScalarTypeExtension();case"type":return this.parseObjectTypeExtension();case"interface":return this.parseInterfaceTypeExtension();case"union":return this.parseUnionTypeExtension();case"enum":return this.parseEnumTypeExtension();case"input":return this.parseInputObjectTypeExtension()}throw this.unexpected(t)}parseSchemaExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("schema");const n=this.parseConstDirectives(),i=this.optionalMany(a.BRACE_L,this.parseOperationTypeDefinition,a.BRACE_R);if(n.length===0&&i.length===0)throw this.unexpected();return this.node(t,{kind:d.SCHEMA_EXTENSION,directives:n,operationTypes:i})}parseScalarTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("scalar");const n=this.parseName(),i=this.parseConstDirectives();if(i.length===0)throw this.unexpected();return this.node(t,{kind:d.SCALAR_TYPE_EXTENSION,name:n,directives:i})}parseObjectTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("type");const n=this.parseName(),i=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),s=this.parseFieldsDefinition();if(i.length===0&&r.length===0&&s.length===0)throw this.unexpected();return this.node(t,{kind:d.OBJECT_TYPE_EXTENSION,name:n,interfaces:i,directives:r,fields:s})}parseInterfaceTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("interface");const n=this.parseName(),i=this.parseImplementsInterfaces(),r=this.parseConstDirectives(),s=this.parseFieldsDefinition();if(i.length===0&&r.length===0&&s.length===0)throw this.unexpected();return this.node(t,{kind:d.INTERFACE_TYPE_EXTENSION,name:n,interfaces:i,directives:r,fields:s})}parseUnionTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("union");const n=this.parseName(),i=this.parseConstDirectives(),r=this.parseUnionMemberTypes();if(i.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:d.UNION_TYPE_EXTENSION,name:n,directives:i,types:r})}parseEnumTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("enum");const n=this.parseName(),i=this.parseConstDirectives(),r=this.parseEnumValuesDefinition();if(i.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:d.ENUM_TYPE_EXTENSION,name:n,directives:i,values:r})}parseInputObjectTypeExtension(){const t=this._lexer.token;this.expectKeyword("extend"),this.expectKeyword("input");const n=this.parseName(),i=this.parseConstDirectives(),r=this.parseInputFieldsDefinition();if(i.length===0&&r.length===0)throw this.unexpected();return this.node(t,{kind:d.INPUT_OBJECT_TYPE_EXTENSION,name:n,directives:i,fields:r})}parseDirectiveDefinition(){const t=this._lexer.token,n=this.parseDescription();this.expectKeyword("directive"),this.expectToken(a.AT);const i=this.parseName(),r=this.parseArgumentDefs(),s=this.expectOptionalKeyword("repeatable");this.expectKeyword("on");const o=this.parseDirectiveLocations();return this.node(t,{kind:d.DIRECTIVE_DEFINITION,description:n,name:i,arguments:r,repeatable:s,locations:o})}parseDirectiveLocations(){return this.delimitedMany(a.PIPE,this.parseDirectiveLocation)}parseDirectiveLocation(){const t=this._lexer.token,n=this.parseName();if(Object.prototype.hasOwnProperty.call(ee,n.value))return n;throw this.unexpected(t)}node(t,n){return this._options.noLocation!==!0&&(n.loc=new qe(t,this._lexer.lastToken,this._lexer.source)),n}peek(t){return this._lexer.token.kind===t}expectToken(t){const n=this._lexer.token;if(n.kind===t)return this.advanceLexer(),n;throw N(this._lexer.source,n.start,`Expected ${Re(t)}, found ${B(n)}.`)}expectOptionalToken(t){return this._lexer.token.kind===t?(this.advanceLexer(),!0):!1}expectKeyword(t){const n=this._lexer.token;if(n.kind===a.NAME&&n.value===t)this.advanceLexer();else throw N(this._lexer.source,n.start,`Expected "${t}", found ${B(n)}.`)}expectOptionalKeyword(t){const n=this._lexer.token;return n.kind===a.NAME&&n.value===t?(this.advanceLexer(),!0):!1}unexpected(t){const n=t??this._lexer.token;return N(this._lexer.source,n.start,`Unexpected ${B(n)}.`)}any(t,n,i){this.expectToken(t);const r=[];for(;!this.expectOptionalToken(i);)r.push(n.call(this));return r}optionalMany(t,n,i){if(this.expectOptionalToken(t)){const r=[];do r.push(n.call(this));while(!this.expectOptionalToken(i));return r}return[]}many(t,n,i){this.expectToken(t);const r=[];do r.push(n.call(this));while(!this.expectOptionalToken(i));return r}delimitedMany(t,n){this.expectOptionalToken(t);const i=[];do i.push(n.call(this));while(this.expectOptionalToken(t));return i}advanceLexer(){const{maxTokens:t}=this._options,n=this._lexer.advance();if(n.kind!==a.EOF&&(++this._tokenCounter,t!==void 0&&this._tokenCounter>t))throw N(this._lexer.source,n.start,`Document contains more that ${t} tokens. Parsing aborted.`)}}function B(e){const t=e.value;return Re(e.kind)+(t!=null?` "${t}"`:"")}function Re(e){return tt(e)?`"${e}"`:e}var q=new Map,te=new Map,be=!0,Q=!1;function De(e){return e.replace(/[\s,]+/g," ").trim()}function Et(e){return De(e.source.body.substring(e.start,e.end))}function vt(e){var t=new Set,n=[];return e.definitions.forEach(function(i){if(i.kind==="FragmentDefinition"){var r=i.name.value,s=Et(i.loc),o=te.get(r);o&&!o.has(s)?be&&console.warn("Warning: fragment with name "+r+` already exists.
graphql-tag enforces all fragment names across your application to be unique; read more about
this in the docs: http://dev.apollodata.com/core/fragments.html#unique-names`):o||te.set(r,o=new Set),o.add(s),t.has(s)||(t.add(s),n.push(i))}else n.push(i)}),k(k({},e),{definitions:n})}function gt(e){var t=new Set(e.definitions);t.forEach(function(i){i.loc&&delete i.loc,Object.keys(i).forEach(function(r){var s=i[r];s&&typeof s=="object"&&t.add(s)})});var n=e.loc;return n&&(delete n.startToken,delete n.endToken),e}function yt(e){var t=De(e);if(!q.has(t)){var n=ft(e,{experimentalFragmentVariables:Q,allowLegacyFragmentVariables:Q});if(!n||n.kind!=="Document")throw new Error("Not a valid GraphQL document.");q.set(t,gt(vt(n)))}return q.get(t)}function E(e){for(var t=[],n=1;n<arguments.length;n++)t[n-1]=arguments[n];typeof e=="string"&&(e=[e]);var i=e[0];return t.forEach(function(r,s){r&&r.kind==="Document"?i+=r.loc.source.body:i+=r,i+=e[s+1]}),yt(i)}function It(){q.clear(),te.clear()}function xt(){be=!1}function Nt(){Q=!0}function Tt(){Q=!1}var w={gql:E,resetCaches:It,disableFragmentWarnings:xt,enableExperimentalFragmentVariables:Nt,disableExperimentalFragmentVariables:Tt};(function(e){e.gql=w.gql,e.resetCaches=w.resetCaches,e.disableFragmentWarnings=w.disableFragmentWarnings,e.enableExperimentalFragmentVariables=w.enableExperimentalFragmentVariables,e.disableExperimentalFragmentVariables=w.disableExperimentalFragmentVariables})(E||(E={}));E.default=E;function se(e){var t=x.useContext(xe()),n=e||t.client;return C(!!n,58),n}var le=!1,kt="useSyncExternalStore",_t=Ge[kt],At=_t||function(e,t,n){var i=t();globalThis.__DEV__!==!1&&!le&&i!==t()&&(le=!0,globalThis.__DEV__!==!1&&C.error(68));var r=x.useState({inst:{value:i,getSnapshot:t}}),s=r[0].inst,o=r[1];return Ve?x.useLayoutEffect(function(){Object.assign(s,{value:i,getSnapshot:t}),J(s)&&o({inst:s})},[e,i,t]):Object.assign(s,{value:i,getSnapshot:t}),x.useEffect(function(){return J(s)&&o({inst:s}),e(function(){J(s)&&o({inst:s})})},[e]),i};function J(e){var t=e.value,n=e.getSnapshot;try{return t!==n()}catch{return!0}}var O;(function(e){e[e.Query=0]="Query",e[e.Mutation=1]="Mutation",e[e.Subscription=2]="Subscription"})(O||(O={}));var S;function he(e){var t;switch(e){case O.Query:t="Query";break;case O.Mutation:t="Mutation";break;case O.Subscription:t="Subscription";break}return t}function we(e){S||(S=new je(He.parser||1e3));var t=S.get(e);if(t)return t;var n,i,r;C(!!e&&!!e.kind,70,e);for(var s=[],o=[],c=[],u=[],l=0,p=e.definitions;l<p.length;l++){var h=p[l];if(h.kind==="FragmentDefinition"){s.push(h);continue}if(h.kind==="OperationDefinition")switch(h.operation){case"query":o.push(h);break;case"mutation":c.push(h);break;case"subscription":u.push(h);break}}C(!s.length||o.length||c.length||u.length,71),C(o.length+c.length+u.length<=1,72,e,o.length,u.length,c.length),i=o.length?O.Query:O.Mutation,!o.length&&!c.length&&(i=O.Subscription);var f=o.length?o:c.length?c:u;C(f.length===1,73,e,f.length);var v=f[0];n=v.variableDefinitions||[],v.name&&v.name.kind==="Name"?r=v.name.value:r="data";var m={name:r,type:i,variables:n};return S.set(e,m),m}we.resetCache=function(){S=void 0};globalThis.__DEV__!==!1&&Qe("parser",function(){return S?S.size:0});function Le(e,t){var n=we(e),i=he(t),r=he(n.type);C(n.type===t,74,i,i,r)}var Ot=Ke?x.useLayoutEffect:x.useEffect,Ct=Symbol.for("apollo.hook.wrappers");function St(e,t,n){var i=n.queryManager,r=i&&i[Ct],s=r&&r[e];return s?s(t):t}var Rt=Object.prototype.hasOwnProperty;function pe(){}var V=Symbol();function Ht(e,t){return t===void 0&&(t=Object.create(null)),St("useQuery",bt,se(t&&t.client))(e,t)}function bt(e,t){var n=wt(e,t),i=n.result,r=n.obsQueryFields;return x.useMemo(function(){return k(k({},i),r)},[i,r])}function Dt(e,t,n,i,r){function s(h){var f;Le(t,O.Query);var v={client:e,query:t,observable:i&&i.getSSRObservable(r())||e.watchQuery(Fe(void 0,e,n,r())),resultData:{previousData:(f=h==null?void 0:h.resultData.current)===null||f===void 0?void 0:f.data}};return v}var o=x.useState(s),c=o[0],u=o[1];function l(h){var f,v;Object.assign(c.observable,(f={},f[V]=h,f));var m=c.resultData;u(k(k({},c),{query:h.query,resultData:Object.assign(m,{previousData:((v=m.current)===null||v===void 0?void 0:v.data)||m.previousData,current:void 0})}))}if(e!==c.client||t!==c.query){var p=s(c);return u(p),[p,l]}return[c,l]}function wt(e,t){var n=se(t.client),i=x.useContext(xe()).renderPromises,r=!!i,s=n.disableNetworkFetches,o=t.ssr!==!1&&!t.skip,c=t.partialRefetch,u=Ut(n,e,t,r),l=Dt(n,e,t,i,u),p=l[0],h=p.observable,f=p.resultData,v=l[1],m=u(h);Mt(f,h,n,t,m);var T=x.useMemo(function(){return qt(h)},[h]);Ft(h,i,o);var _=Lt(f,h,n,t,m,s,c,r,{onCompleted:t.onCompleted||pe,onError:t.onError||pe});return{result:_,obsQueryFields:T,observable:h,resultData:f,client:n,onQueryExecuted:v}}function Lt(e,t,n,i,r,s,o,c,u){var l=x.useRef(u);x.useEffect(function(){l.current=u});var p=(c||s)&&i.ssr===!1&&!i.skip?Ue:i.skip||r.fetchPolicy==="standby"?Pe:void 0,h=e.previousData,f=x.useMemo(function(){return p&&Me(p,h,t,n)},[n,t,p,h]);return At(x.useCallback(function(v){if(c)return function(){};var m=function(){var y=e.current,I=t.getCurrentResult();y&&y.loading===I.loading&&y.networkStatus===I.networkStatus&&F(y.data,I.data)||ne(I,e,t,n,o,v,l.current)},T=function(y){if(_.current.unsubscribe(),_.current=t.resubscribeAfterError(m,T),!Rt.call(y,"graphQLErrors"))throw y;var I=e.current;(!I||I&&I.loading||!F(y,I.error))&&ne({data:I&&I.data,error:y,loading:!1,networkStatus:M.error},e,t,n,o,v,l.current)},_={current:t.subscribe(m,T)};return function(){setTimeout(function(){return _.current.unsubscribe()})}},[s,c,t,e,o,n]),function(){return f||fe(e,t,l.current,o,n)},function(){return f||fe(e,t,l.current,o,n)})}function Ft(e,t,n){t&&n&&(t.registerSSRObservable(e),e.getCurrentResult().loading&&t.addObservableQueryPromise(e))}function Mt(e,t,n,i,r){var s;t[V]&&!F(t[V],r)&&(t.reobserve(Fe(t,n,i,r)),e.previousData=((s=e.current)===null||s===void 0?void 0:s.data)||e.previousData,e.current=void 0),t[V]=r}function Ut(e,t,n,i){n===void 0&&(n={});var r=n.skip;n.ssr,n.onCompleted,n.onError;var s=n.defaultOptions,o=Ne(n,["skip","ssr","onCompleted","onError","defaultOptions"]);return function(c){var u=Object.assign(o,{query:t});return i&&(u.fetchPolicy==="network-only"||u.fetchPolicy==="cache-and-network")&&(u.fetchPolicy="cache-first"),u.variables||(u.variables={}),r?(u.initialFetchPolicy=u.initialFetchPolicy||u.fetchPolicy||me(s,e.defaultOptions),u.fetchPolicy="standby"):u.fetchPolicy||(u.fetchPolicy=(c==null?void 0:c.options.initialFetchPolicy)||me(s,e.defaultOptions)),u}}function Fe(e,t,n,i){var r=[],s=t.defaultOptions.watchQuery;return s&&r.push(s),n.defaultOptions&&r.push(n.defaultOptions),r.push(Ye(e&&e.options,i)),r.reduce(Te)}function ne(e,t,n,i,r,s,o){var c=t.current;c&&c.data&&(t.previousData=c.data),!e.error&&_e(e.errors)&&(e.error=new re({graphQLErrors:e.errors})),t.current=Me(Bt(e,n,r),t.previousData,n,i),s(),Pt(e,c==null?void 0:c.networkStatus,o)}function Pt(e,t,n){if(!e.loading){var i=$t(e);Promise.resolve().then(function(){i?n.onError(i):e.data&&t!==e.networkStatus&&e.networkStatus===M.ready&&n.onCompleted(e.data)}).catch(function(r){globalThis.__DEV__!==!1&&C.warn(r)})}}function fe(e,t,n,i,r){return e.current||ne(t.getCurrentResult(),e,t,r,i,function(){},n),e.current}function me(e,t){var n;return(e==null?void 0:e.fetchPolicy)||((n=t==null?void 0:t.watchQuery)===null||n===void 0?void 0:n.fetchPolicy)||"cache-first"}function $t(e){return _e(e.errors)?new re({graphQLErrors:e.errors}):e.error}function Me(e,t,n,i){var r=e.data;e.partial;var s=Ne(e,["data","partial"]),o=k(k({data:r},s),{client:i,observable:n,variables:n.variables,called:e!==Ue&&e!==Pe,previousData:t});return o}function Bt(e,t,n){return e.partial&&n&&!e.loading&&(!e.data||Object.keys(e.data).length===0)&&t.options.fetchPolicy!=="cache-only"?(t.refetch(),k(k({},e),{loading:!0,networkStatus:M.refetch})):e}var Ue=ke({loading:!0,data:void 0,error:void 0,networkStatus:M.loading}),Pe=ke({loading:!1,data:void 0,error:void 0,networkStatus:M.ready});function qt(e){return{refetch:e.refetch.bind(e),reobserve:e.reobserve.bind(e),fetchMore:e.fetchMore.bind(e),updateQuery:e.updateQuery.bind(e),startPolling:e.startPolling.bind(e),stopPolling:e.stopPolling.bind(e),subscribeToMore:e.subscribeToMore.bind(e)}}function Kt(e,t){var n=se(t==null?void 0:t.client);Le(e,O.Mutation);var i=x.useState({called:!1,loading:!1,client:n}),r=i[0],s=i[1],o=x.useRef({result:r,mutationId:0,isMounted:!0,client:n,mutation:e,options:t});Ot(function(){Object.assign(o.current,{client:n,options:t,mutation:e})});var c=x.useCallback(function(l){l===void 0&&(l={});var p=o.current,h=p.options,f=p.mutation,v=k(k({},h),{mutation:f}),m=l.client||o.current.client;!o.current.result.loading&&!v.ignoreResults&&o.current.isMounted&&s(o.current.result={loading:!0,error:void 0,data:void 0,called:!0,client:m});var T=++o.current.mutationId,_=Te(v,l);return m.mutate(_).then(function(y){var I,b,U=y.data,K=y.errors,P=K&&K.length>0?new re({graphQLErrors:K}):void 0,ae=l.onError||((I=o.current.options)===null||I===void 0?void 0:I.onError);if(P&&ae&&ae(P,_),T===o.current.mutationId&&!_.ignoreResults){var oe={called:!0,loading:!1,data:U,error:P,client:m};o.current.isMounted&&!F(o.current.result,oe)&&s(o.current.result=oe)}var Y=l.onCompleted||((b=o.current.options)===null||b===void 0?void 0:b.onCompleted);return P||Y==null||Y(y.data,_),y},function(y){var I;if(T===o.current.mutationId&&o.current.isMounted){var b={loading:!1,error:y,data:void 0,called:!0,client:m};F(o.current.result,b)||s(o.current.result=b)}var U=l.onError||((I=o.current.options)===null||I===void 0?void 0:I.onError);if(U)return U(y,_),{data:void 0,errors:y};throw y})},[]),u=x.useCallback(function(){if(o.current.isMounted){var l={called:!1,loading:!1,client:o.current.client};Object.assign(o.current,{mutationId:0,result:l}),s(l)}},[]);return x.useEffect(function(){var l=o.current;return l.isMounted=!0,function(){l.isMounted=!1}},[]),[c,k({reset:u},r)]}const Yt=E`
  query getUsers {
    allUsers {
      nodes {
        id
        name
        username
        avatarUrl
      }
    }
  }
`,zt=E`
  query friendsMoods($limit: Int, $offset: Int) {
    friendsMoods(limit: $limit, offset: $offset) {
      id
      intensity
      note
      createdAt
      user {
        id
        name
        username
        avatarUrl
      }
    }
  }
`,Wt=E`
  query userMoods($userId: UUID, $first: Int, $offset: Int) {
    allMoods(
      first: $first, 
      offset: $offset, 
      condition: { userId: $userId }
    ) {
      nodes {
        id
        intensity
        note
        createdAt
        isPublic
      }
    }
  }
`,Jt=E`
  query moodStreak($userId: UUID!) {
    userById(id: $userId) {
      id
      moodsByUserId {
        totalCount
      }
    }
  }
`,Xt=E`
  query communityHugRequests($first: Int, $offset: Int) {
    allHugRequests(first: $first, offset: $offset) {
      nodes {
        id
        message
        createdAt
        userByRequesterId {
          id
          name
          username
          avatarUrl
        }
      }
    }
  }
`,Zt=E`
  query receivedHugs($userId: UUID!, $first: Int, $offset: Int) {
    allHugs(
      first: $first, 
      offset: $offset, 
      condition: { recipientId: $userId }
    ) {
      nodes {
        id
        message
        createdAt
        isRead
        userBySenderId {
          id
          name
          username
          avatarUrl
        }
      }
    }
  }
`,en=E`
  query sentHugs($userId: UUID!, $first: Int, $offset: Int) {
    allHugs(
      first: $first, 
      offset: $offset, 
      condition: { senderId: $userId }
    ) {
      nodes {
        id
        message
        createdAt
        userByRecipientId {
          id
          name
          username
          avatarUrl
        }
      }
    }
  }
`,tn=E`
  query myHugRequests($userId: UUID!) {
    allHugRequests(
      condition: { 
        requesterId: $userId
      }
    ) {
      nodes {
        id
        message
        status
        createdAt
        userByRequesterId {
          id
          name
          username
        }
      }
    }
  }
`,nn=E`
  query pendingHugRequests($userId: UUID!) {
    allHugRequests(
      condition: { 
        requesterId: $userId,
        status: "PENDING"
      }
    ) {
      nodes {
        id
        message
        createdAt
        userByRequesterId {
          id
          name
          username
        }
      }
    }
  }
`,Vt=(e,t={})=>{var i;const n=((i=e==null?void 0:e.message)==null?void 0:i.toLowerCase())||"";return n.includes("unauthorized")||n.includes("unauthenticated")||n.includes("auth")||n.includes("login")||n.includes("token")||(e==null?void 0:e.status)===401||(e==null?void 0:e.statusCode)===401?"auth":n.includes("network")||n.includes("connection")||n.includes("offline")||n.includes("failed to fetch")||e.name==="NetworkError"||t.isNetworkError?"network":n.includes("not found")||n.includes("404")||n.includes("route")||(e==null?void 0:e.status)===404||(e==null?void 0:e.statusCode)===404||t.isRouteError?"route":n.includes("validation")||n.includes("invalid")||n.includes("data")||n.includes("database")||n.includes("constraint")||t.isDataError?"data":"general"},Gt=e=>{switch(e){case"auth":return{title:"Authentication Error",description:"Your session may have expired. Please log in again."};case"network":return{title:"Network Error",description:"Unable to connect to the server. Please check your internet connection."};case"route":return{title:"Page Not Found",description:"The page you are looking for does not exist or has been moved."};case"data":return{title:"Data Error",description:"There was a problem with the data. Please try again with valid information."};default:return{title:"Something Went Wrong",description:"An unexpected error occurred. Please try again later."}}},Ee=j.div`
  background-color: var(--danger-light);
  border-left: 4px solid var(--danger-color);
  color: var(--danger-dark);
  padding: 1rem;
  margin-bottom: 1.5rem;
  border-radius: var(--border-radius);
`,ve=j.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`,X=j.p`
  margin: 0;
  font-size: 0.9rem;
`,Qt=j.div`
  margin-top: 0.75rem;
  
  button {
    background: none;
    border: none;
    color: var(--danger-dark);
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: 0.9rem;
  }
`,rn=({error:e,context:t={}})=>{var o;if(!e)return A.jsxs(Ee,{children:[A.jsx(ve,{children:"An unknown error occurred"}),A.jsx(X,{children:"Please try again later or contact support if the problem persists."})]});const n=Vt(e,t),i=Gt(n),r=e.message||e.graphQLErrors&&((o=e.graphQLErrors[0])==null?void 0:o.message)||"An unknown error occurred",s=()=>{window.location.reload()};return A.jsxs(Ee,{children:[A.jsx(ve,{children:i.title}),A.jsx(X,{children:i.description}),A.jsxs(X,{children:[A.jsx("strong",{children:"Details:"})," ",r]}),A.jsx(Qt,{children:A.jsx("button",{onClick:s,children:"Refresh the page"})})]})},sn=E`
  mutation createMood($input: CreateMoodInput!) {
    createMood(input: $input) {
      mood {
        id
        intensity
        note
        createdAt
        isPublic
      }
    }
  }
`,an=E`
  mutation updateMood($updateMoodInput: UpdateMoodInput!) {
    updateMood(input: $updateMoodInput) {
      mood {
        id
        intensity
        note
        createdAt
        isPublic
      }
    }
  }
`,on=E`
  mutation removeMood($id: ID!) {
    deleteMood(input: { id: $id }) {
      mood {
        id
      }
    }
  }
`,cn=E`
  mutation sendHug($input: CreateHugInput!) {
    createHug(input: $input) {
      hug {
        id
        message
        createdAt
        userBySenderId {
          id
          name
        }
        userByRecipientId {
          id
          name
        }
      }
    }
  }
`,un=E`
  mutation createHugRequest($input: CreateHugRequestInput!) {
    createHugRequest(input: $input) {
      hugRequest {
        id
        message
        createdAt
        userByRequesterId {
          id
          name
        }
      }
    }
  }
`;E`
  mutation updateHugRequest($input: UpdateHugRequestInput!) {
    updateHugRequest(input: $input) {
      hugRequest {
        id
        status
        createdAt
      }
    }
  }
`;const dn=E`
  mutation respondToHugRequest($input: UpdateHugRequestInput!) {
    updateHugRequest(input: $input) {
      hugRequest {
        id
        status
        createdAt
      }
    }
  }
`;E`
  mutation updateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        name
        username
        email
        avatarUrl
      }
    }
  }
`;E`
  mutation createFriendship($input: CreateFriendshipInput!) {
    createFriendship(input: $input) {
      friendship {
        id
        requesterId
        recipientId
        status
        createdAt
      }
    }
  }
`;E`
  mutation updateFriendship($input: UpdateFriendshipInput!) {
    updateFriendship(input: $input) {
      friendship {
        id
        requesterId
        recipientId
        status
        updatedAt
      }
    }
  }
`;const ln=E`
  mutation updateHug($input: UpdateHugInput!) {
    updateHug(input: $input) {
      hug {
        id
        isRead
      }
    }
  }
`,hn=E`
  mutation cancelHugRequest($id: ID!) {
    deleteHugRequest(input: { id: $id }) {
      hugRequest {
        id
      }
    }
  }
`;export{sn as C,rn as E,zt as G,ln as M,on as R,cn as S,an as U,Yt as a,Kt as b,Wt as c,Jt as d,en as e,Zt as f,tn as g,nn as h,Xt as i,un as j,dn as k,hn as l,Ht as u};
//# sourceMappingURL=mutations-a04fa3c5.js.map
