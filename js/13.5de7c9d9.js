(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{7792:function(t,e,i){},"787d":function(t,e,i){"use strict";var s=i("7792"),n=i.n(s);n.a},"7d52":function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-page",[i("entities-toolbar",{attrs:{item:t.selectedItem,actions:t.actions}},[i("div",{class:{"middle-modificator":!t.active},staticStyle:{"max-width":"50%"},attrs:{slot:"selects"},slot:"selects"},[i("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!t.active},attrs:{value:t.active,options:t.filteredItems,filled:"","hide-dropdown-icon":!t.isNeedSelect,label:t.active?"Account":"SELECT ACCOUNT","hide-bottom-space":"",dense:"",color:"white",dark:"",disable:!t.isNeedSelect,"virtual-scroll-item-size":48,"virtual-scroll-slice-size":6,"virtual-scroll-sticky-start":48,"popup-content-class":"items__popup","popup-content-style":{height:48*(t.filteredItems.length>6?6:t.filteredItems.length)+48+(t.filteredItems.length?0:33)+"px"}},on:{filter:t.filterItems},scopedSlots:t._u([{key:"no-option",fn:function(){return[i("div",{staticStyle:{"min-height":"77px"}},[i("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(e){return t.$refs.itemSelect.filter(e)}},model:{value:t.filter,callback:function(e){t.filter=e},expression:"filter"}},[i("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),i("div",{staticClass:"text-center"},[t._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(e){return[t.selectedItem?i("q-item",t._g(t._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",e.itemProps,!1),e.itemEvents),[i("q-item-section",[i("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[t._v(t._s(t.selectedItem.name||"<noname>"))])],1),i("q-item-section",{staticClass:"text-white",attrs:{side:""}},[t.selectedItem.deleted?i("q-item-label",{staticClass:"cheap-modifier q-pa-none"},[i("small",[t._v("DELETED")])]):t._e(),i("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[i("small",[t._v("#"+t._s(t.selectedItem.id))])])],1)],1):t._e()]}},{key:"option",fn:function(e){return[i("q-item",t._g(t._b({staticClass:"q-pa-xs",class:{"text-grey-8":e.opt.deleted},attrs:{clickable:""},on:{click:function(i){t.active=e.opt.id}}},"q-item",e.itemProps,!1),e.itemEvents),[i("q-item-section",[i("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[t._v(t._s(e.opt.name||"<noname>"))])],1),i("q-item-section",{attrs:{side:""}},[e.opt.deleted?i("q-item-label",{staticClass:"q-pa-xs text-right"},[i("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":t.$q.platform.is.mobile}},[t._v("DELETED")])]):t._e(),i("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":t.$q.platform.is.mobile}},[i("small",[t._v("#"+t._s(e.opt.id))])])],1)],1)]}}])},[i("div",{staticClass:"q-pa-xs select__filter bg-dark",attrs:{slot:"before-options"},slot:"before-options"},[i("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",dark:"",color:"white",placeholder:"Filter",autofocus:""},on:{input:function(e){return t.$refs.itemSelect.filter(e)}},model:{value:t.filter,callback:function(e){t.filter=e},expression:"filter"}},[i("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1)])],1)]),t.isInit&&t.selectedItem?i("logs",{ref:"logs",style:{height:"calc(100vh - "+(t.isVisibleToolbar?"100px":"50px")+")",position:"relative"},attrs:{item:t.selectedItem,cid:t.selectedItem.id,limit:t.limit,originPattern:"mqtt/*",isEnabled:!0,config:t.config.logs},on:{"view-log-message":t.viewLogMessagesHandler}}):t._e(),!t.items.length&&t.isItemsInit?i("div",{staticClass:"text-center text-grey-3 q-mt-lg"},[i("div",{staticStyle:{"font-size":"2rem"}},[t._v(t._s(t.isLoading?"Fetching data..":"Subacounts not found"))])]):t._e()],1)},n=[],o=(i("8e6e"),i("8a81"),i("456d"),i("c5f6"),i("7f7f"),i("ac6a"),i("cadf"),i("06db"),i("8615"),i("c47a")),a=i.n(o),l=i("2ce0"),r=i("2f62"),c=i("286e"),m=i("a99a"),d=i("9b02"),u=i.n(d);function f(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,s)}return i}function p(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?f(Object(i),!0).forEach((function(e){a()(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):f(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var h={props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[c["a"]],data:function(){return{active:null,isInit:!1,isItemsInit:!1,filter:""}},computed:p(p({},Object(r["d"])({isEmptyMessages:function(t){return!!t[this.config.logs.vuexModuleName]&&!t[this.config.logs.vuexModuleName].messages.length},myAccount:function(t){return{id:t.tokenInfo?t.tokenInfo.cid:0,name:"*Current*"}},tokenType:function(t){return t.tokenInfo&&t.tokenInfo.access?t.tokenInfo.access.type:-1},itemsCollection:function(t){var e=this.myAccount,i=p(a()({},e.id,e),t.subaccounts);return i}})),{},{items:function(){return Object.values(this.itemsCollection||{})},filteredItems:function(){var t=this.filter.toLowerCase(),e=this.filter?this.items.filter((function(e){return e&&"undefined"!==typeof e.name&&null!==e.name&&e.name.toLowerCase().indexOf(t)>=0||e&&"undefined"!==typeof e.id&&null!==e.id&&(e.id+"").indexOf(t)>=0})):this.items;return e.sort((function(t,e){if(!t.name)return-1;if(!e.name)return 1;var i=t.name.toLowerCase(),s=e.name.toLowerCase();return i<s?-1:1})),e},selectedItem:function(){var t=this.itemsCollection[this.active]||null;return t},actions:function(){return[{label:"Clear",icon:"mdi-playlist-remove",handler:this.clearHandler,condition:!this.isEmptyMessages}]}}),methods:{filterItems:function(t,e){var i=this;if(this.isItemsInit)e();else{var s="subaccounts";this.itemsLoad(s,e,this.active,(function(){i.isItemsInit=!0}))}},viewLogMessagesHandler:function(t){this.$emit("view-log-message",t)},clearHandler:function(){var t=this;this.$q.dialog({title:"Confirm",message:"Do you really want to clear all data from the panes?",ok:!0,cancel:!0}).onOk((function(){t.$store.commit("".concat(t.config.logs.vuexModuleName,"/clearMessages"))})).onCancel((function(){}))},clearActive:function(){this.active=null},init:function(){var t="mqtt",e=u()(this.settings,"entities[".concat(t,"]"),void 0),i=this.$route.params&&this.$route.params.id?Number(this.$route.params.id):null;this.isInit=!0,i?this.itemsCollection[i]?this.active=i:this.active=null:e&&this.itemsCollection[e]?this.active=e:this.active=this.myAccount.id,this.$emit("inited")}},watch:{$route:function(t){if(t.params&&t.params.id){var e=Number(t.params.id);this.itemsCollection[e]?this.active=e:this.isInit&&(this.active=this.myAccount.id)}else t.params&&!t.params.id&&(this.active=null)},active:function(t){var e=this.itemsCollection[t]||{};t?(this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:"mqtt"},value:e.id}),this.$router.push("/mqtt/".concat(t)).catch((function(t){return t}))):this.$router.push("/mqtt").catch((function(t){return t}))}},components:{logs:l["a"],EntitiesToolbar:m["a"]}},v=h,g=(i("787d"),i("2877")),b=Object(g["a"])(v,s,n,!1,null,null,null);e["default"]=b.exports}}]);