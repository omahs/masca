import{d as E,u as J,f as r,c as U,a as d,b as o,w as l,g as f,r as u,o as F,h,i as b,t as I,I as $,p as z,e as L,j as R,k as j,s as M,_ as q}from"./index.a013d411.js";const g=p=>(z("data-v-2c8c8e55"),p=p(),L(),p),G={class:"profile"},H=g(()=>d("h1",{id:"title"},"My Credentials",-1)),K={class:"table-header"},Q={class:"dtButtons"},W=g(()=>d("h3",null,"VC",-1)),X=g(()=>d("h3",null,"Metadata",-1)),Y=E({__name:"ProfileView",setup(p){const s=J(),c=r(""),v=r(!1),m=r(!1),_=r("Modal"),V=r(""),w=r(""),C=r([]),N=()=>{v.value=!0},y=()=>{c.value="",v.value=!1},k=(t,e,n)=>{_.value=t,V.value=e,w.value=n||"",m.value=!0},D=()=>{_.value="",V.value="",m.value=!1},O=async()=>{try{const t=await R(s.snapApi);return console.log(t),t&&(s.vcs=t),"Success getting VCs"}catch(t){throw console.error(t),t}},P=async()=>{try{if(!C.value)throw new Error("No VC selected");const t=await j(C.value,s.snapApi);if(k("Verifiable Presentation",JSON.stringify(t,null,2)),console.log(t),!t)throw new Error("Failed to create VP");return"VP created"}catch(t){throw new Error(t.message)}},T=async()=>{let t;try{t=JSON.parse(c.value)}catch(e){throw e}try{const e=await M(t,s.snapApi);if(!e)throw new Error("Failed to save VC");return s.vcs.push({data:t,metadata:{id:e[0].id}}),y(),"Success importing VC"}catch(e){throw console.error(e),e}},A=async()=>{let t;try{t=JSON.parse(c.value)}catch(e){throw e}try{const e=await M(t,s.snapApi,"ceramic");if(!e)throw new Error("Failed to save VC");return s.vcs.push({data:t,metadata:{store:["ceramic"],id:e[0].id}}),y(),"Success importing VC"}catch(e){throw console.error(e),e}};return(t,e)=>{const n=u("Button"),i=u("Column"),B=u("DataTable"),S=u("Textarea"),x=u("Dialog");return F(),U("div",G,[H,d("div",null,[o(B,{value:f(s).vcs,responsiveLayout:"scroll",removableSort:"",selection:C.value,"onUpdate:selection":e[0]||(e[0]=a=>C.value=a)},{header:l(()=>[d("div",K,[h(" Verifiable Credentials "),d("div",Q,[o(b,{label:"Load VCs",method:O,icon:"pi pi-refresh",class:"p-button-rounded"}),o(b,{label:"Create VP",method:P,icon:"pi pi-upload",class:"p-button-rounded"}),o(n,{onClick:N,label:"Import VC",icon:"pi pi-file-import",class:"p-button-outlined p-button-rounded"})])])]),footer:l(()=>[h(" In total there are "+I(f(s).vcs?f(s).vcs.length:0)+" VCs. ",1)]),default:l(()=>[o(i,{selectionMode:"multiple",headerStyle:"width: 3em"}),o(i,{field:"data.type[1]",header:"Type"},{body:l(a=>[h(I(a.data.data.type[1]),1)]),_:1}),o(i,{field:"data.issuanceDate",header:"Issuance Date",sortable:!0},{body:l(a=>[h(I(f($)(a.data.data.issuanceDate)),1)]),_:1}),o(i,{field:"data.issuer.id",header:"Issuer Id"}),o(i,{field:"metadata.store",header:"Store"}),o(i,{header:"View"},{body:l(a=>[o(n,{icon:"pi pi-search",class:"p-button-rounded p-button-outlined",onClick:Z=>k("Verifiable Credential",JSON.stringify(a.data.data,null,2),JSON.stringify(a.data.metadata,null,2))},null,8,["onClick"])]),_:1})]),_:1},8,["value","selection"])]),o(x,{header:"Import VC (JSON)",visible:v.value,"onUpdate:visible":e[3]||(e[3]=a=>v.value=a),breakpoints:{"960px":"75vw","640px":"90vw"},style:{width:"50vw"},modal:!0},{footer:l(()=>[o(n,{label:"Cancel",icon:"pi pi-times",onClick:e[2]||(e[2]=a=>y()),class:"p-button-text"}),o(b,{label:"Save",method:T,icon:"pi pi-check"}),o(b,{label:"Save on Ceramic",method:A,icon:"pi pi-check"})]),default:l(()=>[o(S,{id:"VCImportArea",modelValue:c.value,"onUpdate:modelValue":e[1]||(e[1]=a=>c.value=a),autofocus:"",autoResize:!0,class:"vcImport"},null,8,["modelValue"])]),_:1},8,["visible"]),o(x,{header:_.value,visible:m.value,"onUpdate:visible":e[7]||(e[7]=a=>m.value=a),breakpoints:{"960px":"75vw","640px":"90vw"},style:{width:"50vw"},modal:!0},{footer:l(()=>[o(n,{label:"Close",icon:"pi pi-times",onClick:e[6]||(e[6]=a=>D()),class:"p-button-text"})]),default:l(()=>[W,o(S,{id:"VCImportArea",modelValue:V.value,"onUpdate:modelValue":e[4]||(e[4]=a=>V.value=a),autoResize:!1,class:"vcImport",disabled:""},null,8,["modelValue"]),X,o(S,{id:"metadata",modelValue:w.value,"onUpdate:modelValue":e[5]||(e[5]=a=>w.value=a),disabled:"",autoResize:!1,class:"vcImport"},null,8,["modelValue"])]),_:1},8,["header","visible"])])}}});const te=q(Y,[["__scopeId","data-v-2c8c8e55"]]);export{te as default};
