(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[19],{b433:function(e,t,i){"use strict";i("d6bb")},c34e:function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e._self._c;return t("q-page",[t("q-resize-observer",{on:{resize:e.onResizePage}}),t("entities-toolbar",{attrs:{item:e.selectedItem,actions:e.actions}},[t("div",{class:{"middle-modificator":!e.active},staticStyle:{"max-width":"50%"},attrs:{slot:"selects"},slot:"selects"},[t("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,"hide-dropdown-icon":!e.isNeedSelect,label:e.active?"Account":"SELECT ACCOUNT","hide-bottom-space":"",dense:"",color:"white",dark:"",disable:!e.isNeedSelect,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+48+(e.filteredItems.length?0:33)+"px"}},on:{filter:(t,i)=>e.filterItems("subaccounts",t,i)},scopedSlots:e._u([{key:"no-option",fn:function(){return[t("div",{staticStyle:{"min-height":"77px"}},[t("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:t=>e.$refs.itemSelect.filter(t)},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[t("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),t("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(i){return[e.selectedItem?t("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",i.itemProps,!1),i.itemEvents),[t("q-item-section",[t("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))])],1),t("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?t("q-item-label",{staticClass:"cheap-modifier q-pa-none"},[t("small",[e._v("DELETED")])]):e._e(),t("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[t("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},{key:"option",fn:function(i){return[t("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":i.opt.deleted},attrs:{clickable:""},on:{click:function(t){return e.updateActive(i.opt.id)}}},"q-item",i.itemProps,!1),i.itemEvents),[t("q-item-section",[t("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(i.opt.name||"<noname>"))])],1),t("q-item-section",{attrs:{side:""}},[i.opt.deleted?t("q-item-label",{staticClass:"q-pa-xs text-right"},[t("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),t("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[t("small",[e._v("#"+e._s(i.opt.id))])])],1)],1)]}}])},[t("div",{staticClass:"q-pa-xs select__filter bg-dark",attrs:{slot:"before-options"},slot:"before-options"},[t("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",dark:"",color:"white",placeholder:"Filter",autofocus:""},on:{input:t=>e.$refs.itemSelect.filter(t)},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[t("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1)])],1)]),e.isInit&&e.selectedItem?t("logs",{ref:"logs",style:{height:`calc(100vh - ${e.isVisibleToolbar?"100px":"50px"})`,position:"relative",...e.panelsWidgetsStyle},attrs:{item:e.selectedItem,cid:e.selectedItem.id,limit:e.limit,originPattern:"platform/customer/*","entity-name":e.entityName,isEnabled:!0,config:e.config.logs},on:{"view-log-message":e.viewWidgetsLogHandler,"action-select":t=>e.widgetsViewedLog=t.content}}):e._e(),!e.items.length&&e.isItemsInit?t("div",{staticClass:"text-center text-grey-3 q-mt-lg"},[t("div",{staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Subacounts not found"))])]):e._e(),t("widgets",{ref:"logsView",attrs:{active:"logsView"===e.activeWidgetWindow,config:e.logsWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.logs},on:{"change-view-model":t=>e.widgetsChangeViewModelHandler(e.entityName,"logs",t),active:function(t){return e.activateWidgetWindow("logsView")},close:e.closeLogsWidgetsHandler,next:e.nextWidgetLog,prev:e.prevWidgetLog},model:{value:e.isWidgetsLogsActive,callback:function(t){e.isWidgetsLogsActive=t},expression:"isWidgetsLogsActive"}})],1)},o=[],a=i("2ce0"),l=i("df1d"),n=i("4596"),c=i("5c16"),r=i("2f62"),d=i("a99a"),m=i("286e"),g=i("6126"),p=i("9b02"),h=i.n(p),u={props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[m["a"],l["a"],n["a"],g["a"]],data(){return{entityName:"platform",active:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,filter:""}},computed:{...Object(r["d"])({isEmptyMessages(e){return!!e[this.config.logs.vuexModuleName]&&!e[this.config.logs.vuexModuleName].messages.length},myAccount(e){return{id:e.tokenInfo?e.tokenInfo.cid:0,name:"*Current*"}},tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},itemsCollection(e){const t=this.myAccount,i={[t.id]:t,...e.subaccounts};return i}}),items(){return Object.values(this.itemsCollection||{})},filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const i=e.name.toLowerCase(),s=t.name.toLowerCase();return i<s?-1:1})),t},selectedItem(){const e=this.itemsCollection[this.active]||null;return e},actions(){return[{label:"Clear",icon:"mdi-playlist-remove",handler:this.clearHandler,condition:!this.isEmptyMessages}]},panelsWidgetsStyle(){const e={},t=this.widgetStyle.left&&(this.isWidgetsMessageActive||this.isWidgetsLogsActive||this.isWidgetsTrackActive),i=this.widgetStyle.right&&(this.isWidgetsMessageActive||this.isWidgetsLogsActive||this.isWidgetsTrackActive);return(t||i)&&(e.maxWidth="calc(100% - 400px)",i&&(e.left="400px")),e}},methods:{clearHandler(){this.$q.dialog({title:"Confirm",message:"Do you really want to clear all data from the panes?",ok:!0,cancel:!0,noRouteDismiss:!0}).onOk((()=>{this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`),this.isWidgetsLogsActive&&(this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler())})).onCancel((()=>{}))},clearActive(){this.updateActive(null)},updateActive(e){this.updateRoute({name:this.entityName,params:{id:e}},!this.active)},init(){const e="platform",t=h()(this.settings,`entities[${e}]`,void 0),i=this.$route.params&&this.$route.params.id?Number(this.$route.params.id):null;this.isInit=!0;let s=null;i&&this.itemsCollection[i]?s=i:t&&this.itemsCollection[t]?s=t:(i&&!this.itemsCollection[i]||t&&!this.itemsCollection[t])&&this.clearActive(),s&&(this.active=s,this.updateRoute({name:this.entityName,params:{id:s}},!0)),this.$emit("inited")},clearWidgetsState(){this.isWidgetsLogsActive=!1,this.activeWidgetWindow=void 0,this.widgetsViewedLog=null},onResizePage(e){this.$refs.logsView.resize(e)},beforeEnableWidgetByPane(e){this.widgetStyle.left||this.isWidgetsLogsActive||this.widgetsViewModel.logs||this.$nextTick((()=>this.widgetsChangeViewModelHandler(this.entityName,"logs",{type:"minimized",to:"left"})))}},watch:{$route(e){if(e.params&&e.params.id){const t=Number(e.params.id);this.itemsCollection[t]?this.active=t:this.isInit&&(this.active=null)}else e.params&&!e.params.id&&(this.active=null)},active(e){const t=this.itemsCollection[e]||{};e&&this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:"platform"},value:t.id})}},components:{logs:a["a"],EntitiesToolbar:d["a"],Widgets:c["a"]}},f=u,v=(i("b433"),i("2877")),w=i("9989"),b=i("3980"),y=i("ddd8"),x=i("27f9"),C=i("0016"),I=i("66e5"),q=i("4074"),_=i("0170"),W=i("8572"),L=i("eebe"),k=i.n(L),A=Object(v["a"])(f,s,o,!1,null,"71a7440a",null);t["default"]=A.exports;k()(A,"components",{QPage:w["a"],QResizeObserver:b["a"],QSelect:y["a"],QInput:x["a"],QIcon:C["a"],QItem:I["a"],QItemSection:q["a"],QItemLabel:_["a"],QField:W["a"]})},d6bb:function(e,t,i){}}]);