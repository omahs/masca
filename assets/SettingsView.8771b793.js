import{d as _,u as g,l as m,c as S,a as s,b as c,g as i,m as f,r as h,o as v,i as w,p as C,e as V,_ as y}from"./index.a70f18ae.js";const n=o=>(C("data-v-8e0d3af0"),o=o(),V(),o),I={class:"settings"},b=n(()=>s("h1",{id:"title"},"SSI Snap Configuration",-1)),k={class:"settingsContent"},x={class:"center"},E=n(()=>s("p",null,"Enable Ceramic Network:",-1)),B={class:"center"},N=n(()=>s("p",null,"Used for toggling the built-in Metamask popups:",-1)),P=_({__name:"SettingsView",setup(o){const t=g(),r=m().toast,p=async a=>{try{const e=await f("ceramic",a,t.snapApi);r.add({severity:"success",summary:"Success",detail:e,group:"br",life:3e3})}catch(e){t.currVCStore={snap:!0,ceramic:!1},t.useCeramic=!a,console.error(e),r.add({severity:"error",summary:"Error",detail:e.message,group:"br",life:3e3})}},l=async()=>{var e;if(!await((e=t.snapApi)==null?void 0:e.togglePopups()))throw new Error("Failed to toggle popups");return"Success toggling popups."};return(a,e)=>{const d=h("InputSwitch");return v(),S("div",I,[b,s("div",k,[s("div",x,[E,s("div",null,[c(d,{modelValue:i(t).useCeramic,"onUpdate:modelValue":e[0]||(e[0]=u=>i(t).useCeramic=u),onInput:p},null,8,["modelValue"])])]),s("div",B,[N,c(w,{id:"togglePopups",label:"Toggle popups",method:l,class:"p-button-rounded"})])])])}}});const U=y(P,[["__scopeId","data-v-8e0d3af0"]]);export{U as default};
