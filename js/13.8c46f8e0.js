(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[13],{"192b":function(e,t,i){},"787d":function(e,t,i){"use strict";i("192b")},"7d52":function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-page",[i("q-resize-observer",{on:{resize:e.onResizePage}}),i("entities-toolbar",{attrs:{item:e.selectedItem,actions:e.actions}},[i("div",{class:{"middle-modificator":!e.active},staticStyle:{"max-width":"50%"},attrs:{slot:"selects"},slot:"selects"},[i("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,"hide-dropdown-icon":!e.isNeedSelect,label:e.active?"Account":"SELECT ACCOUNT","hide-bottom-space":"",dense:"",color:"white",dark:"",disable:!e.isNeedSelect,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+48+(e.filteredItems.length?0:33)+"px"}},on:{filter:function(t,i){return e.filterItems("subaccounts",t,i)}},scopedSlots:e._u([{key:"no-option",fn:function(){return[i("div",{staticStyle:{"min-height":"77px"}},[i("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[i("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),i("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(t){return[e.selectedItem?i("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",t.itemProps,!1),t.itemEvents),[i("q-item-section",[i("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))])],1),i("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?i("q-item-label",{staticClass:"cheap-modifier q-pa-none"},[i("small",[e._v("DELETED")])]):e._e(),i("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[i("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},{key:"option",fn:function(t){return[i("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":t.opt.deleted},attrs:{clickable:""},on:{click:function(i){e.active=t.opt.id}}},"q-item",t.itemProps,!1),t.itemEvents),[i("q-item-section",[i("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(t.opt.name||"<noname>"))])],1),i("q-item-section",{attrs:{side:""}},[t.opt.deleted?i("q-item-label",{staticClass:"q-pa-xs text-right"},[i("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),i("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[i("small",[e._v("#"+e._s(t.opt.id))])])],1)],1)]}}])},[i("div",{staticClass:"q-pa-xs select__filter bg-dark",attrs:{slot:"before-options"},slot:"before-options"},[i("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",dark:"",color:"white",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[i("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1)])],1)]),e.isInit&&e.selectedItem?i("logs",{ref:"logs",style:Object.assign({},{height:"calc(100vh - "+(e.isVisibleToolbar?"100px":"50px")+")",position:"relative"},e.panelsWidgetsStyle),attrs:{item:e.selectedItem,cid:e.selectedItem.id,limit:e.limit,originPattern:"mqtt/*","enitity-name":e.entityName,isEnabled:!0,config:e.config.logs},on:{"view-log-message":e.viewWidgetsLogHandler,"action-select":function(t){return e.widgetsViewedLog=t.content}}}):e._e(),!e.items.length&&e.isItemsInit?i("div",{staticClass:"text-center text-grey-3 q-mt-lg"},[i("div",{staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Subacounts not found"))])]):e._e(),i("widgets",{ref:"logsView",attrs:{active:"logsView"===e.activeWidgetWindow,config:e.logsWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.logs},on:{"change-view-model":function(t){return e.widgetsChangeViewModelHandler(e.entityName,"logs",t)},active:function(t){return e.activateWidgetWindow("logsView")},close:e.closeLogsWidgetsHandler,next:e.nextWidgetLog,prev:e.prevWidgetLog},model:{value:e.isWidgetsLogsActive,callback:function(t){e.isWidgetsLogsActive=t},expression:"isWidgetsLogsActive"}})],1)},n=[],o=i("ded3"),l=i.n(o),a=(i("4e82"),i("2ce0")),c=i("df1d"),r=i("4596"),d=i("5c16"),m=i("2f62"),g=i("286e"),h=i("a99a"),u=i("9b02"),p=i.n(u),f={props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[g["a"],c["a"],r["a"]],data(){return{entityName:"mqtt",active:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,filter:""}},computed:l()(l()({},Object(m["d"])({isEmptyMessages(e){return!!e[this.config.logs.vuexModuleName]&&!e[this.config.logs.vuexModuleName].messages.length},myAccount(e){return{id:e.tokenInfo?e.tokenInfo.cid:0,name:"*Current*"}},tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},itemsCollection(e){const t=this.myAccount,i=l()({[t.id]:t},e.subaccounts);return i}})),{},{items(){return Object.values(this.itemsCollection||{})},filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const i=e.name.toLowerCase(),s=t.name.toLowerCase();return i<s?-1:1})),t},selectedItem(){const e=this.itemsCollection[this.active]||null;return e},actions(){return[{label:"Clear",icon:"mdi-playlist-remove",handler:this.clearHandler,condition:!this.isEmptyMessages}]},panelsWidgetsStyle(){const e={},t=this.widgetStyle.left&&(this.isWidgetsMessageActive||this.isWidgetsLogsActive||this.isWidgetsTrackActive),i=this.widgetStyle.right&&(this.isWidgetsMessageActive||this.isWidgetsLogsActive||this.isWidgetsTrackActive);return(t||i)&&(e.maxWidth="calc(100% - 300px)",i&&(e.left="300px")),e}}),methods:{clearHandler(){this.$q.dialog({title:"Confirm",message:"Do you really want to clear all data from the panes?",ok:!0,cancel:!0}).onOk((()=>{this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`),this.isWidgetsLogsActive&&(this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler())})).onCancel((()=>{}))},clearActive(){this.active=null},init(){const e="mqtt",t=p()(this.settings,`entities[${e}]`,void 0),i=this.$route.params&&this.$route.params.id?Number(this.$route.params.id):null;this.isInit=!0,i?this.itemsCollection[i]?this.active=i:this.active=null:t&&this.itemsCollection[t]?this.active=t:this.active=this.myAccount.id,this.$emit("inited")},clearWidgetsState(){this.isWidgetsLogsActive=!1,this.activeWidgetWindow=void 0,this.widgetsViewedLog=null},onResizePage(e){this.$refs.logsView.resize(e)},beforeEnableWidgetByPane(e){this.widgetStyle.left||this.isWidgetsLogsActive||this.widgetsViewModel.logs||this.$nextTick((()=>this.widgetsChangeViewModelHandler(this.entityName,"logs",{type:"minimized",to:"left"})))}},watch:{$route(e){if(e.params&&e.params.id){const t=Number(e.params.id);this.itemsCollection[t]?this.active=t:this.isInit&&(this.active=this.myAccount.id)}else e.params&&!e.params.id&&(this.active=null)},active(e){const t=this.itemsCollection[e]||{};e?(this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:"mqtt"},value:t.id}),this.$router.push(`/mqtt/${e}`).catch((e=>e))):this.$router.push("/mqtt").catch((e=>e))}},components:{logs:a["a"],EntitiesToolbar:h["a"],Widgets:d["a"]}},v=f,w=(i("787d"),i("2877")),b=i("9989"),q=i("3980"),y=i("ddd8"),x=i("27f9"),I=i("0016"),C=i("66e5"),_=i("4074"),W=i("0170"),L=i("8572"),k=i("eebe"),S=i.n(k),A=Object(w["a"])(v,s,n,!1,null,null,null);t["default"]=A.exports;S()(A,"components",{QPage:b["a"],QResizeObserver:q["a"],QSelect:y["a"],QInput:x["a"],QIcon:I["a"],QItem:C["a"],QItemSection:_["a"],QItemLabel:W["a"],QField:L["a"]})}}]);