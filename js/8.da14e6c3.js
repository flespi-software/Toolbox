(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"2a5a":function(e,t,s){},5014:function(e,t,s){},"60f2":function(e,t,s){"use strict";s("5014")},c4c9:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e._self._c;return t("q-page",[t("q-resize-observer",{on:{resize:e.onResizePage}}),t("entities-toolbar",{attrs:{item:e.selectedItem,ratio:e.ratio,actions:e.actions},on:{"change-ratio":e.updateRatio}},[t("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[t("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,"hide-dropdown-icon":!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("devices")>-1,label:e.active?"Device":"SELECT DEVICE",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("devices")>-1,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+(e.needShowGetDeletedAction&&1===e.tokenType?77:48)+(e.filteredItems.length?0:4)+"px"}},on:{filter:(t,s)=>e.filterItems(e.entityName,t,s)},scopedSlots:e._u([{key:"no-option",fn:function(){return[t("div",{staticStyle:{"min-height":"77px"}},[t("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:t=>e.$refs.itemSelect.filter(t)},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[t("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),t("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(s){return[e.selectedItem?t("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",s.itemProps,!1),s.itemEvents),[t("q-item-section",[t("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),t("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[t("small",[e._v(e._s(e.selectedItem.configuration&&e.selectedItem.configuration.ident?e.selectedItem.configuration.ident:"<no ident>"))])])],1),t("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?t("q-item-label",{staticClass:"q-pa-none text-right"},[t("small",{staticClass:"cheap-modifier"},[e._v("DELETED")])]):e._e(),t("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[t("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},{key:"option",fn:function(s){return[t("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":s.opt.deleted},attrs:{clickable:""},on:{click:function(t){return e.updateActive(s.opt.id)}}},"q-item",s.itemProps,!1),s.itemEvents),[t("q-item-section",[t("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(s.opt.name||"<noname>"))]),t("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[t("small",[e._v(e._s(s.opt.configuration&&s.opt.configuration.ident?s.opt.configuration.ident:"<no ident>"))])])],1),t("q-item-section",{attrs:{side:""}},[s.opt.deleted?t("q-item-label",{staticClass:"q-pa-xs text-right"},[t("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),t("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[t("small",[e._v("#"+e._s(s.opt.id))])])],1)],1)]}}])},[t("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[t("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:t=>e.$refs.itemSelect.filter(t)},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[t("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1),e.needShowGetDeletedAction&&1===e.tokenType?t("div",{staticClass:"select__get-deleted",attrs:{slot:"after-options"},slot:"after-options"},[t("q-btn",{staticClass:"deleted-action",attrs:{icon:"mdi-download"},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.getDeletedHandler.apply(null,arguments)}}},[e._v("see deleted")])],1):e._e()]),e.$q.platform.is.desktop&&e.selectedItem&&!e.selectedItem.deleted?t("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[e.needTrafficRoute?t("q-btn",{staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"50px"},attrs:{title:"Traffic hex payload",flat:"",dense:""},on:{click:e.trafficViewHandler}},[t("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-download-network-outline"}}),t("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Traffic")])],1):e._e()],1):e._e()],1)]),e.isInit&&e.active?t("div",[+e.size[0]?t("logs",{ref:"logs",style:[{height:`calc(${e.size[0]}vh - ${+e.size[1]?e.isVisibleToolbar?"50px":"25px":e.isVisibleToolbar?"100px":"50px"})`,position:"relative"},e.panelsWidgetsStyle],attrs:{item:e.selectedItem,limit:e.limit,originPattern:"gw/devices/:id","entity-name":e.entityName,isEnabled:!!+e.size[0],config:e.logsConfig},on:{"view-log-message":e.viewWidgetsLogHandler,"action-select":t=>e.widgetsViewedLog=t.content,"to-traffic":e.toTrafficHandler,"to-error-traffic":e.toErrorTrafficHandler,"action-timeSync":e.timeLogsSyncHandler}}):e._e(),+e.size[1]?t("messages",{ref:"messages",style:[{height:`calc(${e.size[1]}vh - ${+e.size[0]?e.isVisibleToolbar?"50px":"25px":e.isVisibleToolbar?"100px":"50px"})`,position:"relative"},e.panelsWidgetsStyle],attrs:{item:e.selectedItem,activeId:e.active,isEnabled:!!+e.size[1],limit:e.limit,config:e.messagesConfig},on:{"action-view-data":t=>{e.messageWidgetsActions("object",t),e.addWidgetTrackMarker("track",t)},"action-map":t=>e.messageWidgetsActions("position",t),"action-show":t=>e.messageWidgetsActions("show",t),"action-image":t=>e.messageWidgetsActions("image",t),"action-select":t=>e.messageWidgetsActions("select",t),"action-traffic":t=>e.messageWidgetsActions("traffic",t),"action-timeSync":e.timeMessagesSyncHandler}}):e._e()],1):e._e(),!e.items.length&&e.isItemsInit?t("div",{staticClass:"text-center text-grey-3 q-mt-lg"},[t("div",{staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Devices not found"))]),!e.isLoading&&e.needShowGetDeletedAction&&1===e.tokenType?t("q-btn",{staticClass:"q-mt-sm",attrs:{icon:"mdi-download",label:"see deleted"},on:{click:e.getDeletedHandler}}):e._e()],1):e._e(),t("widgets",{ref:"messagesView",attrs:{active:"messagesView"===e.activeWidgetWindow,config:e.messageWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.data},on:{"change-view-model":t=>e.widgetsChangeViewModelHandler(e.entityName,"data",t),active:function(t){return e.activateWidgetWindow("messagesView")},close:e.closeMessageWidgetsHandler,next:e.nextWidgetsMessage,prev:e.prevWidgetsMessage},model:{value:e.isWidgetsMessageActive,callback:function(t){e.isWidgetsMessageActive=t},expression:"isWidgetsMessageActive"}}),t("widgets",{ref:"logsView",attrs:{active:"logsView"===e.activeWidgetWindow,config:e.logsWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.data},on:{"change-view-model":t=>e.widgetsChangeViewModelHandler(e.entityName,"data",t),active:function(t){return e.activateWidgetWindow("logsView")},close:e.closeLogsWidgetsHandler,next:e.nextWidgetLog,prev:e.prevWidgetLog},model:{value:e.isWidgetsLogsActive,callback:function(t){e.isWidgetsLogsActive=t},expression:"isWidgetsLogsActive"}}),t("widgets",{ref:"track",attrs:{active:"track"===e.activeWidgetWindow,config:e.trackWidgetConfig,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.track},on:{"change-view-model":t=>e.widgetsChangeViewModelHandler(e.entityName,"track",t),active:function(t){return e.activateWidgetWindow("track")},close:e.closeWidgetsHandler},model:{value:e.isWidgetsTrackActive,callback:function(t){e.isWidgetsTrackActive=t},expression:"isWidgetsTrackActive"}})],1)},a=[],o=(s("14d9"),s("2ce0")),n=function(){var e=this,t=e._self._c;return t("div",[t("virtual-scroll-list",{ref:"scrollList",class:{"non-selectable":e.selectionMode},attrs:{name:"MessagesVirtualScroll",cols:e.cols,actions:e.config.actions,panelActions:e.panelActions,items:e.messages,dateRange:e.dateRange,viewConfig:e.viewConfig,filter:e.filter,theme:e.config.theme,title:"Messages",loading:e.loadingFlag,autoscroll:e.needAutoscroll,scrollOffset:"10%",item:e.listItem,i18n:e.i18n,itemprops:e.getItemsProps,"has-new-messages":e.hasNewMessages},on:{scroll:e.scrollHandler,action:e.actionHandler,"change-filter":e.filterChangeHandler,"scroll-top":e.paginationPrevChangeHandler,"scroll-bottom":e.paginationNextChangeHandler,"change-date-range":e.dateRangeChangeHandler,"action-to-bottom":e.actionToBottomHandler,"update-cols":e.updateColsHandler,"action-to-new-messages":e.actionToNewMessages,"action-to-new-messages-hide":e.actionToNewMessagesHide,arrowup:e.arrowUpHandler,arrowdown:e.arrowDownHandler},nativeOn:{click:function(t){return e.tableClickHandler.apply(null,arguments)}}},[t("empty-pane",{attrs:{slot:"empty",config:e.config.emptyState},slot:"empty"})],1)],1)},l=[],r=s("de45"),c=s("2b0e"),d=s("cdde"),h=s("121a"),m=function(){var e=this,t=e._self._c;return t("div",{style:{height:`${e.itemHeight}px`,width:`${e.rowWidth}px`},on:{click:t=>e.itemClickHandler(e.index,e.item,t)}},[t("div",{staticClass:"cursor-pointer",class:[e.item["x-flespi-status"]?"missed-items":"",e.selected?"bg-white-opasity":e.highlightLevel?`text-${e.highlightType}-${e.highlightLevel}`:""],style:{height:`${e.itemHeight}px`,width:`${e.rowWidth}px`,color:e.selected?"#333":""}},[e._l(e.cols,(function(s,i){return["etc"===s.__dest?t("span",{key:s.name+i,staticClass:"list__item item_etc",class:{[`item_${i}`]:!0,"item--active":e.menuCellActive&&e.menuCellActive.row===e.index&&e.menuCellActive.col===i}},[e._v(e._s(e.values.etc.value||"*Empty*"))]):t("span",{key:s.name+i,staticClass:"list__item",class:{[`item_${i}`]:!0,"item--active":e.menuCellActive&&e.menuCellActive.row===e.index&&e.menuCellActive.col===i},attrs:{title:(e.values[s.name].value||"")+(e.highlightDescription?`\n${e.highlightDescription} ${e.highlightExplanation?"("+e.highlightExplanation+")":""}`:"")}},[e._v("\n        "+e._s(e.values[s.name].value)+"\n      ")])]}))],2)])},g=[],u=s("bd4c"),p=s("f8fe"),f={props:["item","index","actions","cols","itemHeight","rowWidth","selected","menuCellActive"],mixins:[p["a"]],data(){return{date:u["a"]}},computed:{values(){let e={};return e=this.cols.length?this.cols.reduce(((e,t,s,i)=>(e[t.name]={value:this.getValueOfProp(t,this.item)},s===i.length-1&&(e.etc={value:""}),e)),{}):{etc:{value:""}},Object.keys(this.item).forEach((t=>{e[t]||(-1!==t.indexOf("image.bin.")?e.etc.value+=`${t}: <binary image>`:e.etc.value+=`${t}: ${JSON.stringify(this.item[t])}; `)})),e}},methods:{clickHandler(e,t,s){this.$emit("action",{index:e,type:t,content:s})},itemClickHandler(e,t,s){this.$emit("item-click",{index:e,content:t,event:s})},getValueOfProp(e,t){const s=e.name;let i=t[s];return s.match(/timestamp$/)?i=u["a"].formatDate(1e3*i,"DD/MM/YYYY HH:mm:ss"):-1!==s.indexOf("image.bin.")&&i?i="<binary image>":"string"!==typeof i&&(i=JSON.stringify(i)),i}}},v=f,w=(s("60f2"),s("2877")),$=Object(w["a"])(v,m,g,!1,null,"c577b420",null),b=$.exports,y=s("b047c"),k=s.n(y),x=s("0463"),M=s("6126"),N=s("db49"),T=s("b609"),C=s("c9ad"),W={props:["item","activeId","limit","config"],data(){return{listItem:b,moduleName:this.config.vuexModuleName,autoscroll:!0,isInit:!1,i18n:{"Columns by schema":"Columns by protocol"},scrollTimestamp:void 0}},computed:{messages:{get(){const e=this.$store.state[this.moduleName].messages;return this.scrollControlling(e.length),e},set(e){this.$store.commit(`${this.moduleName}/setMessages`,e)}},active:{get(){return this.$store.state[this.moduleName].active},async set(e){await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.$store.commit(`${this.moduleName}/setActive`,e),this.$store.commit(`${this.moduleName}/clearMessages`),await this.$store.dispatch(`${this.moduleName}/getCols`,{etc:!0}),await this.$store.dispatch(`${this.moduleName}/initTime`),await this.getMessages()}},panelActions(){return[{label:"Export CSV",icon:"mdi-file-document-outline",handler:()=>this.exportCsv({filter:`${this.filter}`,from:this.from/1e3,to:this.to/1e3},{from:this.from,to:this.to},"devices"),condition:this.messages.length,tooltip:"Save messages to CSV",async:this.isFileCsvLoading}]},cols:{get(){return this.$store.state[this.moduleName].cols},set(e){this.$store.commit(`${this.moduleName}/updateCols`,e)}},filter:{get(){return this.$store.state[this.moduleName].filter},set(e){e=e||"",this.$store.commit(`${this.moduleName}/setFilter`,e)}},from:{get(){return this.$store.state[this.moduleName].from},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setFrom`,e)}},to:{get(){return this.$store.state[this.moduleName].to},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setTo`,e)}},dateRange(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},realtimeEnabled(){return this.$store.state[this.moduleName].realtimeEnabled},reverse:{get(){return this.$store.state[this.moduleName].reverse||!1},set(e){this.$store.commit(`${this.moduleName}/setReverse`,e)}},currentLimit:{get(){return this.$store.state[this.moduleName].limit},set(e){e=e||1e3,this.$store.commit(`${this.moduleName}/setLimit`,e)}},selected:{get(){return this.$store.state[this.moduleName].selected},set(e){e&&e.length&&(this.autoscroll=!1),this.$store.commit(`${this.moduleName}/setSelected`,e),this.updateSelectedRoute(this.selectedMessagesTimestamps)}},selectedMessagesTimestamps(){let e;return this.selected.length&&(e=this.selected.map((e=>this.messages[e].timestamp))),e},hasNewMessages:{get(){return this.$store.state[this.moduleName].hasNewMessages},set(e){this.$store.state[this.moduleName].hasNewMessages=e}},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)},needAutoscroll(){return this.realtimeEnabled&&!this.selected.length&&this.autoscroll},viewConfig(){return Object.assign(this.config.viewConfig,{needKeysProcess:!!this.selected.length})}},methods:{sliceToChunks(e,t){const s=[];for(let i=0;i<e.length;i+=t){const a=e.slice(i,i+t);s.push(a)}return s},registerMessages(e){this.$q.dialog({title:"Warning!",message:"Re-registering a message may cause subsequent changes in plugin fields (that may lead to data loss or corruption) and re-sending messages via assigned streams.",color:"white",class:"text-white bg-red",cancel:!0,ok:"Register",noRouteDismiss:!0}).onOk((()=>{e=this.sliceToChunks(e,1e3),e.forEach((async e=>{await c["default"].connector.http.post(`/gw/devices/${this.activeId}/messages`,e).then((e=>{}),(e=>{}))})),setTimeout((()=>this.refresh()),1e3)}))},tableClickHandler(e){e.target.closest(".list-item--click-control")||(this.selected=[],this.$emit("action-view-data",{index:-1,content:[]}))},getItemsProps(e,t){const s=this.messages[e];t.key=s["x-flespi-message-key"],t.class="list-item list-item--click-control",t.props.etcVisible=this.etcVisible,t.props.actionsVisible=this.actionsVisible,t.props.selected=this.selected.includes(e),t.props.actions=()=>this.getItemPropsActions(s,t),t.on||(t.on={}),t.on.action=this.actionHandler,t.on["item-click"]=this.itemClickHandler,t.dataHandler=(e,t,s)=>(this.autoscroll=!1,this.listItem.methods.getValueOfProp(e.data,t.data))},getItemPropsActions(e,t){const s=this.selected.length>1?N["a"]:N["b"],i=[...this.config.actions.filter((e=>e.mode===s))];return s===N["b"]&&(e["position.latitude"]&&e["position.longitude"]&&i.push({icon:"mdi-map",label:"Show on map",classes:"",type:"map"}),Object.keys(e).some((t=>{const s=e[t]&&(e[t].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/)||0===t.indexOf("image.bin."));return s&&i.push({icon:"mdi-image-outline",label:"Show image",classes:"",type:"image"}),s}))),i.push({icon:"mdi-function",label:"Test expression",classes:"",type:"expression"}),i.push({icon:"mdi-redo-variant",label:"Re-register messages",classes:"",type:"registermessages"}),i},scrollTo(e){this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollTo(e)))},scrollToWithSavePadding(e){this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollToWithSavePadding(e)))},scrollToTimestamp(e){const t=this.messages.findIndex((t=>e<=t["server.timestamp"]));this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollTo(t)))},scrollHandler({event:e,data:t}){const s=Math.floor(t.start+(t.end-t.start)/4),i=this.messages[s];if(i){const e=i["server.timestamp"];this.scrollTimestamp=e,this.debouncedUpdateMessagesRoute({},!0)}},updateSelectedRoute(e){this.updateMessagesRoute({selected:e})},async getMessages(e){this.to<=Date.now()||e?(await this.$store.dispatch(`${this.moduleName}/get`,e),e&&this.scrollToTimestamp(e)):(await this.$store.dispatch(`${this.moduleName}/getHistory`,1e3),this.scrollTo(this.messages.length-1))},resetParams(){this.$refs.scrollList.resetParams()},processQuery(e){if(!this.isInit)return!1;if(e)try{e=JSON.parse(e);let t=!1;(!this.filter&&e.filter||this.filter&&!e.filter||this.filter&&e.filter&&this.filter!==e.filter)&&(this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.filter=e.filter||null,t=!0),this.from===1e3*e.from&&this.to===1e3*e.to||(this.from=1e3*e.from,this.to=1e3*e.to,t=!0),t&&(this.$store.commit(`${this.moduleName}/clearMessages`),this.$store.dispatch(`${this.moduleName}/get`))}catch(t){}},filterChangeHandler(e){this.filter!==e&&this.updateMessagesRoute({filter:e||void 0})},updateColsHandler(e){this.cols=e},dateRangeChangeHandler(e){const t=e[0],s=e[1];if(this.from===t&&this.to===s)return!1;this.updateMessagesRoute({from:t/1e3,to:s/1e3})},paginationPrevChangeHandler(){this.$store.dispatch(`${this.moduleName}/getPrevPage`).then((e=>{e&&"number"===typeof e&&this.scrollToWithSavePadding(e)}))},paginationNextChangeHandler(){this.$store.dispatch(`${this.moduleName}/getNextPage`).then((e=>{this.autoscroll=!0,e&&"number"===typeof e&&this.scrollTo(this.messages.length-e)}))},actionHandler({index:e,type:t,content:s}){switch(this.selected.length>1&&(s=this.selected.map((e=>this.messages[e]))),t){case"view":this.itemClickHandler({index:e,content:s});break;case"copy":this.copyMessageHandler({index:e,content:s});break;case"expression":this.showExprTest(this.$store.state.token,this.cols.schemas[this.cols.activeSchema].cols,this.selected.map((e=>this.messages[e])));break;case"registermessages":this.registerMessages(this.selected.map((e=>this.messages[e])));break;case"timeSync":this.$emit(`action-${t}`,{index:e,content:s,from:this.from,to:this.to});break;default:this.$emit(`action-${t}`,{index:e,content:[s]});break}},itemClickHandler({index:e,content:t,event:s}){this.selected=this.multiselectProcess({index:e,event:s,selected:this.selected});const i=this.selected.map((e=>this.messages[e]));this.$emit("action-view-data",{index:e,content:i})},copyMessageHandler({index:e,content:t}){Object(d["a"])(JSON.stringify(t)).then((e=>{this.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(e=>{this.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},actionToBottomHandler(){this.realtimeEnabled?(this.autoscroll=!0,this.scrollTo(this.messages.length-1)):this.$store.dispatch(`${this.moduleName}/getHistory`,1e3).then((()=>{this.scrollTo(this.messages.length-1)}))},timeSync(e){const t=e.content.timestamp,s=e.from,i=e.to;this.from=s,this.to=i,this.getMessages(t)},async actionToNewMessages(){this.hasNewMessages=null;const e=Date.now(),t=new Date(e).setHours(0,0,0,0),s=t+86399999.999;this.from=t,this.to=s,this.$store.commit(`${this.moduleName}/clearMessages`),this.getMessages()},actionToNewMessagesHide(){this.hasNewMessages=null},unselect(){this.selected.length&&(this.selected=[])},nextSelect(){if(this.selected.length){const e=this.selected.slice(-1)[0],t=e+1,s=this.messages[t];s&&(this.selected=[t],this.$emit("action-select",{index:t,content:[s]}),this.scrollTo(t))}},prevSelect(){if(this.selected.length){const e=this.selected[0],t=e-1,s=this.messages[t];s&&(this.selected=[t],this.$emit("action-select",{index:t,content:[s]}),this.scrollTo(t))}},scrollControlling(e){this.selected.length&&this.selected[0]+1e3<=e&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)},routeConfigProcess(e={}){const t={};try{e=JSON.parse(e)}catch(s){}return e.filter&&(t.filter=e.filter),e.from&&e.to?(t.from=1e3*e.from,t.to=1e3*e.to):this.$route.query.from&&this.$route.query.to&&(t.from=1e3*this.$route.query.from,t.to=1e3*this.$route.query.to),e.scroll&&(this.scrollTimestamp=e.scroll,t.initTimestamp=e.scroll),e.selected&&(t.selected=e.selected,t.initTimestamp=e.selected[0]),t},async refresh(){if(this.activeId){let{initTimestamp:e}=this.routeConfigProcess(this.$route.query.messages);await this.getMessages(),this.scrollToTimestamp(this.scrollTimestamp)}},async init(){if(this.$store.state[this.moduleName]?this.$store.commit(`${this.moduleName}/clear`):this.$store.registerModule(this.moduleName,Object(r["e"])({Vue:c["default"],LocalStorage:this.$q.localStorage,name:{name:this.moduleName,lsNamespace:"flespi-toolbox-settings.cols"},errorHandler:e=>{this.$store.commit("reqFailed",e)}})),this.$store.commit(`${this.moduleName}/setSortBy`,"timestamp"),this.currentLimit=this.limit,this.activeId){let{from:e,to:t,filter:s,initTimestamp:i,selected:a}=this.routeConfigProcess(this.$route.query.messages);this.filter=s,this.$store.commit(`${this.moduleName}/setActive`,this.activeId),await this.$store.dispatch(`${this.moduleName}/getCols`,{etc:!0}),e&&t?(this.from=e,this.to=t,i?await this.getMessages(i):await this.getMessages()):(await this.$store.dispatch(`${this.moduleName}/initTime`),await this.getMessages()),this.initSelectedByTimestamps(a)}this.updateMessagesRoute({},!0),this.isInit=!0},initSelectedByTimestamps(e){if(e){const{indexes:t,messages:s}=this.messages.reduce(((t,s,i)=>(e.includes(s.timestamp)&&(t.messages.push(s),t.indexes.push(i)),t)),{indexes:[],messages:[]});this.selected=t,this.$emit("action-view-data",{index:t[t.length-1],content:s})}},updateMessagesRoute(e={},t=!1){const s={filter:this.filter||void 0,from:this.from/1e3,to:this.to/1e3,scroll:this.scrollTimestamp,selected:this.selectedMessagesTimestamps,...e};this.updateRoute({query:{messages:JSON.stringify(s)}},t)},arrowDownHandler(){const e=this.selected.slice(-1)[0]+1,t=this.messages[e];if(t){const s={type:"view",content:[t],index:e};this.actionHandler(s)}},arrowUpHandler(){const e=this.selected[0]-1,t=this.messages[e];if(t){const s={type:"view",content:[t],index:e};this.actionHandler(s)}}},watch:{activeId(e){this.active=e},limit(e){this.currentLimit=e},$route(e){this.processRoute({messages:this.processQuery},e)}},created(){this.debouncedUpdateMessagesRoute=k()(this.updateMessagesRoute,500,{trailing:!0,maxWait:1e3}),this.init(),this.offlineHandler=c["default"].connector.socket.on("offline",(()=>{this.$store.commit(`${this.moduleName}/setOffline`)})),this.connectHandler=c["default"].connector.socket.on("connect",(()=>{this.$store.state[this.moduleName].offline&&(this.$store.commit(`${this.moduleName}/setReconnected`),this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/getMissedMessages`),this.$store.commit(`${this.moduleName}/clearOfflineState`))}))},beforeDestroy(){this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),void 0!==this.offlineHandler&&c["default"].connector.socket.off("offline",this.offlineHandler),void 0!==this.connectHandler&&c["default"].connector.socket.off("connect",this.connectHandler),this.$store.commit(`${this.moduleName}/clear`)},mixins:[x["a"],M["a"],T["a"],C["a"]],components:{VirtualScrollList:r["b"],EmptyPane:h["a"]}},S=W,H=Object(w["a"])(S,n,l,!1,null,null,null),_=H.exports,I=s("df1d"),q=s("4596"),A=s("6512"),L=s("0860"),V={data(){return{isWidgetsTrackActive:!1,trackWidgetMessageMarker:void 0,trackWidgetLBSMessageMarker:void 0,trackWidgetConfig:{track:{title:"Track",wrapper:L["a"]}}}},methods:{showWidgetTrack(e){!this.isWidgetsTrackActive&&e.length&&(this.isWidgetsTrackActive=!0),this.$nextTick((()=>this.setWidgetTrackView("track",e)))},setWidgetTrackView(e,t){const s=this.$refs.track.ref(e);if(!s||!t)return;let i=t;const a=i[i.length-1];let o;a&&(o={latlng:[a.lat,a.lon],direction:a.dir,label:"Last position"}),i=i.map((e=>[e.lat,e.lon])),s.clear(),i.length&&s.addPoints(i),o&&s.addNamedMarkers({position:o,...this.trackWidgetMessageMarker,...this.trackWidgetLBSMessageMarker}),s.send(),this.activateWidgetWindow("track")},addWidgetTrackMarker(e,t){if(!this.isWidgetsTrackActive)return;const s=this.$refs.track.ref(e);if(s){if(t){const{content:e}=t,i={message:{latlng:[e["position.latitude"],e["position.longitude"]],direction:e["position.direction"],color:"#f0f",label:"Message",setpoints:[[e["position.latitude"],e["position.longitude"]]]}};if(this.trackWidgetMessageMarker=i,s.addNamedMarker(i),e["position.lbs.latitude"]&&e["position.lbs.longitude"]){const t={lbsmessage:{latlng:[e["position.lbs.latitude"],e["position.lbs.longitude"]],color:"#09f",label:"LBS Position",setpoints:[[e["position.lbs.latitude"],e["position.lbs.longitude"]]]}};this.trackWidgetLBSMessageMarker=t,s.addNamedMarker(t)}}else this.trackWidgetLBSMessageMarker=void 0,this.trackWidgetMessageMarker=void 0;s.send()}},closeWidgetsHandler(){},trackWidgetClear(){this.trackWidgetLBSMessageMarker=void 0,this.trackWidgetMessageMarker=void 0}}},R=s("5c16"),E=s("a99a"),P=s("b06b"),O=s("2f62"),D=s("286e"),z=s("9b02"),B=s.n(z),j=s("0644"),Q=s.n(j),F=s("8ed9");const G={100:"logs",50:"both",0:"messages"},J={logs:100,both:50,messages:0};var Y={props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[D["a"],I["a"],q["a"],A["a"],V,M["a"]],data(){return{entityName:"devices",filter:"",active:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,needShowGetDeletedAction:!0}},computed:{...Object(O["d"])({hasMessages(e){return this.config.messages&&!!e[this.config.messages.vuexModuleName]&&!!e[this.config.messages.vuexModuleName].messages.length&&100!==this.ratio},hasLogs(e){return this.config.logs&&!!e[this.config.logs.vuexModuleName]&&e[this.config.logs.vuexModuleName].messages&&!!e[this.config.logs.vuexModuleName].messages.length&&0!==this.ratio},tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},itemsCollection(e){return e.devices||{}},tasksByDevice(e){return Object.values(e.tasks||{})},trackByMessages(e){const t=this.config&&this.config.messages&&e[this.config.messages.vuexModuleName]?e[this.config.messages.vuexModuleName].messages:[],s=[],i=[];for(let a=0;a<t.length;a++){const e=t[a];e["position.latitude"]&&e["position.longitude"]&&s.push({lat:e["position.latitude"],lon:e["position.longitude"],dir:e["position.direction"]}),e["position.lbs.latitude"]&&e["position.lbs.longitude"]&&i.push({lat:e["position.lbs.latitude"],lon:e["position.lbs.longitude"]})}return this.isWidgetsTrackActive&&this.setWidgetTrackView("track",s),s},needTrafficRoute(e){return B()(e.config,"deviceTraffic.isDrawable",!1)}}),items(){return Object.values(this.itemsCollection)},selectedItem(){const e=this.itemsCollection&&this.itemsCollection[this.active]||null;return e&&e.deleted&&this.deletedHandler(),e},logsConfig(){const e=Q()(this.config.logs);return this.needTrafficRoute&&(e.actions.push({icon:"mdi-download-network-outline",label:"View traffic",classes:"",mode:N["b"],type:"traffic"}),50===this.ratio&&e.actions.push({icon:"mdi-swap-vertical",label:"Show on messages",classes:"",mode:N["b"],type:"timeSync"})),e},filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0||t&&t.configuration&&"undefined"!==typeof t.configuration.ident&&null!==t.configuration.ident&&t.configuration.ident.toLowerCase().indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const s=e.name.toLowerCase(),i=t.name.toLowerCase();return s<i?-1:1})),t},size(){return[this.ratio,100-this.ratio]},messagesConfig(){const e=Q()(this.config.messages);return this.needTrafficRoute&&e.actions.push({icon:"mdi-download-network-outline",label:"View traffic",classes:"",mode:N["b"],type:"traffic"}),50===this.ratio&&e.actions.push({icon:"mdi-swap-vertical",label:"Show on logs",classes:"",mode:N["b"],type:"timeSync"}),e},actions(){return[{label:"Intervals",icon:"mdi-set-center",handler:()=>this.moveToIntervals(this.active,null),condition:!!this.tasksByDevice.length},{label:"Traffic",icon:"mdi-download-network-outline",handler:this.trafficViewHandler,condition:this.needTrafficRoute&&this.$q.platform.is.mobile},{label:"Map",icon:"mdi-map",handler:()=>this.showWidgetTrack(this.trackByMessages),condition:!!this.trackByMessages.length},{label:"TrackIt",icon:"mdi-map-marker-path",handler:()=>this.goToTrackit(),condition:!!this.trackByMessages.length},{label:"Clear",icon:"mdi-playlist-remove",handler:this.clearHandler,condition:this.hasMessages||this.hasLogs}]},panelsWidgetsStyle(){const e={},t={track:this.isWidgetsTrackActive,data:this.isWidgetsMessageActive||this.isWidgetsLogsActive},s=this.widgetStyle.left&&this.widgetStyle.right&&t.track&&t.data,i=this.widgetStyle.left&&t[this.widgetStyle.left],a=this.widgetStyle.right&&t[this.widgetStyle.right];return s?(e.maxWidth="calc(100% - 600px)",e.left="400px"):(i||a)&&(e.maxWidth="calc(100% - 400px)",a&&(e.left="400px")),e},ratio(){return B()(this.settings.viewSettings,`${this.entityName}.ratio`,50)}},methods:{...Object(O["b"])(["getDeleted"]),clearHandler(){this.$q.dialog({title:"Confirm",message:"Do you really want to clear all data from the panes?",ok:!0,cancel:!0,noRouteDismiss:!0}).onOk((()=>{this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`),this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`),this.isWidgetsLogsActive?(this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler()):this.isWidgetsMessageActive&&(this.isWidgetsMessageActive=!1,this.closeMessageWidgetsHandler())})).onCancel((()=>{}))},async getDeletedHandler(){await this.getDeleted(this.entityName),this.needShowGetDeletedAction=!1,this.$refs.itemSelect.reset()},clearActive(){this.updateActive(null)},updateActive(e){this.updateRoute({name:this.entityName,params:{id:e}},!this.active)},deletedHandler(){this.changeRatioHandler(100)},trafficViewHandler(){this.$router.push(`/tools/device-traffic/${this.active}`).catch((e=>e))},toErrorTrafficHandler({content:e}){if(!this.needTrafficRoute)return;const t={tcp:2,udp:130};let s,i=e["server.timestamp"]||e.timestamp,a=i+1,o=a-10;e.error_text&&e.traffic&&(i=e.traffic.timestamp,o=i,a=e.timestamp,s={...e.traffic,text:e.error_text}),this.$connector.gw.getDevicesPackets(this.active,{data:{from:o,to:a,filter:`type=${t[e.transport]}`}}).then((t=>{const i=B()(t,"data.result",[]),a=i.map((e=>e.data));a?this.$q.dialog({component:F["a"],parent:this,data:a,error:s,noRouteDismiss:!0}).onOk((()=>{this.toTrafficHandler({content:e})})).onCancel((()=>{})):this.$q.notify({message:"Traffic is empty",type:"negative"})}))},timeMessagesSyncHandler(e){50!==this.ratio&&this.updateRatio(50),this.$nextTick((()=>{this.$refs.logs.timeSync(e)}))},timeLogsSyncHandler(e){50!==this.ratio&&this.updateRatio(50),this.$nextTick((()=>{this.$refs.messages.timeSync(e)}))},toTrafficHandler({content:e}){const t=e["server.timestamp"]||e.timestamp,s=t+1,i=s-10,a=t,o={to:s,from:i,highlight:a};this.$router.push({path:`/tools/device-traffic/${this.active}`,query:o}).catch((e=>e))},init(){const e=this.entityName,t=B()(this.settings,`entities[${e}]`,void 0);let s=this.$route.params&&this.$route.params.id?Number(this.$route.params.id):null;const i=this.$route.query.view_mode;let a=50;i&&(a=J[i],this.$emit("update:settings",{type:"ENTITY_VIEW_SETTINGS_CHANGE",opt:{entity:this.entityName},value:{ratio:a}})),this.isInit=!0;let o=null;s&&this.itemsCollection[s]?o=s:t&&this.itemsCollection[t]?o=t:(s&&!this.itemsCollection[s]||t&&!this.itemsCollection[t])&&this.clearActive(),this.selectedItem&&this.selectedItem.deleted&&this.deletedHandler(),o&&(this.active=o,this.updateRoute({name:this.entityName,params:{id:o},query:{view_mode:G[a]}},!0)),this.$emit("inited")},moveToIntervals(e,t){this.$nextTick((()=>{this.$router.push({name:"intervals",params:{deviceId:e,calcId:t},query:{noselect:"devices"}}).catch((e=>e))}))},clearWidgetsState(){this.isWidgetsMessageActive=!1,this.isWidgetsLogsActive=!1,this.isWidgetsTrackActive=!1,this.activeWidgetWindow=void 0,this.widgetsViewedMessage=null,this.widgetsViewedLog=null},beforeEnableWidgetByPane(e){switch(this.widgetStyle.left||this.isWidgetsMessageActive||this.isWidgetsLogsActive||this.widgetsViewModel.data||this.$nextTick((()=>this.widgetsChangeViewModelHandler(this.entityName,"data",{type:"minimized",to:"left"}))),e){case"messages":this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler();break;case"logs":this.isWidgetsMessageActive=!1,this.closeMessageWidgetsHandler();break}},onResizePage(e){this.$refs.track.resize(e),this.$refs.messagesView.resize(e),this.$refs.logsView.resize(e)},updateRatio(e){this.updateRoute({query:{view_mode:G[e]}})},changeRatioHandler(e){this.ratio!==e&&(this.ratioWidgetsModify(e),this.$emit("update:settings",{type:"ENTITY_VIEW_SETTINGS_CHANGE",opt:{entity:this.entityName},value:{ratio:e}}),this.$nextTick((()=>{+this.size[0]&&this.active&&this.$refs.logs&&this.$refs.logs.resetParams(),+this.size[1]&&this.active&&this.$refs.messages&&this.$refs.messages.resetParams()})))},goToTrackit(){const e=this.config&&this.config.messages&&this.$store.state[this.config.messages.vuexModuleName],t=Math.floor(e.from/1e3),s=Math.floor(e.to/1e3);Object(P["a"])(`${this.$flespiServer}/trackit/#/login/${this.$store.state.token}/devices/${this.active}?from=${t}&to=${s}`)}},watch:{$route(e){e.params&&e.params.id?this.itemsCollection[Number(e.params.id)]?this.active=Number(e.params.id):this.isInit&&(this.active=null):e.params&&!e.params.id&&(this.active=null),this.processRoute({view_mode:e=>this.changeRatioHandler(J[e])},e)},active(e,t){const s=this.itemsCollection[e]||{};e&&this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:this.entityName},value:s.id}),s.deleted&&this.deletedHandler(),this.trackWidgetClear()}},components:{logs:o["a"],messages:_,Widgets:R["a"],EntitiesToolbar:E["a"]}},U=Y,K=(s("f2c5"),s("9989")),Z=s("3980"),X=s("ddd8"),ee=s("27f9"),te=s("0016"),se=s("9c40"),ie=s("66e5"),ae=s("4074"),oe=s("0170"),ne=s("8572"),le=s("eebe"),re=s.n(le),ce=Object(w["a"])(U,i,a,!1,null,"d5ebadea",null);t["default"]=ce.exports;re()(ce,"components",{QPage:K["a"],QResizeObserver:Z["a"],QSelect:X["a"],QInput:ee["a"],QIcon:te["a"],QBtn:se["a"],QItem:ie["a"],QItemSection:ae["a"],QItemLabel:oe["a"],QField:ne["a"]})},f2c5:function(e,t,s){"use strict";s("2a5a")}}]);