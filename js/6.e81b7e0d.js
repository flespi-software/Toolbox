(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[6],{2985:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",[s("q-resize-observer",{on:{resize:e.onResizePage}}),s("entities-toolbar",{attrs:{item:e.selectedItem,ratio:e.ratio,actions:e.actions},on:{"change-ratio":e.updateRatio}},[s("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[s("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,"hide-dropdown-icon":!e.isNeedSelect,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,label:e.active?"Channel":"SELECT CHANNEL",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect,"popup-content-class":"items__popup","popup-content-style":{height:60*(e.filteredItems.length>6?6:e.filteredItems.length)+(e.needShowGetDeletedAction&&1===e.tokenType?77:48)+"px"}},on:{filter:function(t,s){return e.filterItems(e.entityName,t,s)}},scopedSlots:e._u([{key:"no-option",fn:function(){return[s("div",[s("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),s("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(t){return[e.selectedItem?s("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",staticStyle:{"max-width":"170px"},attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(e.selectedItem.uri||"<no uri>"))])])],1),s("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?s("q-item-label",{staticClass:"q-pa-none text-right"},[s("small",{staticClass:"cheap-modifier"},[e._v("DELETED")])]):e._e(),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[s("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},e.filteredItems.length?{key:"option",fn:function(t){return[s("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":t.opt.deleted},attrs:{clickable:""},on:{click:function(s){return e.updateActive(t.opt.id)}}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(t.opt.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(e.protocols&&e.protocols[t.opt.protocol_id]&&e.protocols[t.opt.protocol_id].name||"<no protocol>"))])]),s("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(t.opt.uri||"<no uri>"))])])],1),s("q-item-section",{attrs:{side:""}},[t.opt.deleted?s("q-item-label",{staticClass:"q-pa-xs text-right"},[s("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[s("small",[e._v("#"+e._s(t.opt.id))])])],1)],1)]}}:null],null,!0)},[s("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[s("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1),e.needShowGetDeletedAction&&1===e.tokenType?s("div",{staticClass:"select__get-deleted",attrs:{slot:"after-options"},slot:"after-options"},[s("q-btn",{staticClass:"deleted-action",attrs:{icon:"mdi-download"},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.getDeletedHandler.apply(null,arguments)}}},[e._v("see deleted")])],1):e._e()]),e.$q.platform.is.desktop&&e.selectedItem&&!e.selectedItem.deleted?s("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[e.selectedItem.protocol_id===e.proxyProtocolId?s("q-btn",{staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"50px"},attrs:{title:"View hex payload",flat:"",dense:""},on:{click:e.hexViewHandler}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-matrix"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("HEX")])],1):e.isTrafficViewerSupported?s("q-btn",{staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"50px"},attrs:{title:"Traffic hex payload",flat:"",dense:""},on:{click:e.trafficViewHandler}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-download-network-outline"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Traffic")])],1):e._e()],1):e._e()],1)]),e.isInit&&e.active?s("div",[+e.size[0]?s("logs",{ref:"logs",style:Object.assign({},{height:"calc("+e.size[0]+"vh - "+(+e.size[1]?e.isVisibleToolbar?"50px":"25px":e.isVisibleToolbar?"100px":"50px")+")",position:"relative"},e.panelsWidgetsStyle),attrs:{item:e.selectedItem,limit:e.limit,isEnabled:!!+e.size[0],originPattern:"gw/channels/:id","entity-name":e.entityName,config:e.logsConfig},on:{"view-log-message":e.viewWidgetsLogHandler,"action-select":function(t){return e.widgetsViewedLog=t.content},"to-traffic":e.toTrafficHandler,"to-error-traffic":e.toErrorTrafficHandler,"action-timeSync":e.timeLogsSyncHandler}}):e._e(),+e.size[1]?s("messages",{ref:"messages",style:Object.assign({},{height:"calc("+e.size[1]+"vh - "+(+e.size[0]?e.isVisibleToolbar?"50px":"25px":e.isVisibleToolbar?"100px":"50px")+")",position:"relative"},e.panelsWidgetsStyle),attrs:{item:e.selectedItem,activeId:e.active,isEnabled:!!+e.size[1],limit:e.limit,config:e.messagesConfig},on:{"action-view-data":function(t){return e.messageWidgetsActions("object",t)},"action-map":function(t){return e.messageWidgetsActions("position",t)},"action-traffic":function(t){return e.messageWidgetsActions("traffic",t)},"action-hex":function(t){return e.messageWidgetsActions("hex",t)},"action-show":function(t){return e.messageWidgetsActions("show",t)},"action-image":function(t){return e.messageWidgetsActions("image",t)},"action-select":function(t){return e.messageWidgetsActions("select",t)},"action-timeSync":e.timeMessagesSyncHandler}}):e._e()],1):e._e(),!e.items.length&&e.isItemsInit?s("div",{staticClass:"text-center text-grey-3 q-mt-lg"},[s("div",{staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Channels not found"))]),!e.isLoading&&e.needShowGetDeletedAction&&1===e.tokenType?s("q-btn",{staticClass:"q-mt-sm",attrs:{icon:"mdi-download",label:"see deleted"},on:{click:e.getDeletedHandler}}):e._e()],1):e._e(),s("widgets",{ref:"messagesView",attrs:{active:"messagesView"===e.activeWidgetWindow,config:e.messageWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.data},on:{"change-view-model":function(t){return e.widgetsChangeViewModelHandler(e.entityName,"data",t)},active:function(t){return e.activateWidgetWindow("messagesView")},close:e.closeMessageWidgetsHandler,next:e.nextWidgetsMessage,prev:e.prevWidgetsMessage},model:{value:e.isWidgetsMessageActive,callback:function(t){e.isWidgetsMessageActive=t},expression:"isWidgetsMessageActive"}}),s("widgets",{ref:"logsView",attrs:{active:"logsView"===e.activeWidgetWindow,config:e.logsWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.data},on:{"change-view-model":function(t){return e.widgetsChangeViewModelHandler(e.entityName,"data",t)},active:function(t){return e.activateWidgetWindow("logsView")},close:e.closeLogsWidgetsHandler,next:e.nextWidgetLog,prev:e.prevWidgetLog},model:{value:e.isWidgetsLogsActive,callback:function(t){e.isWidgetsLogsActive=t},expression:"isWidgetsLogsActive"}})],1)},o=[],a=s("2ce0"),n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("virtual-scroll-list",{ref:"scrollList",class:{"non-selectable":e.selectionMode},attrs:{name:"MessagesVirtualScroll",cols:e.cols,actions:e.config.actions,panelActions:e.panelActions,items:e.messages,dateRange:e.dateRange,viewConfig:e.config.viewConfig,filter:e.filter,theme:e.config.theme,title:"Messages",loading:e.loadingFlag,autoscroll:e.needAutoscroll,scrollOffset:"10%",i18n:e.i18n,item:e.listItem,itemprops:e.getItemsProps,"has-new-messages":e.hasNewMessages},on:{scroll:e.scrollHandler,action:e.actionHandler,"change-filter":e.filterChangeHandler,"scroll-top":e.paginationPrevChangeHandler,"scroll-bottom":e.paginationNextChangeHandler,"change-date-range":e.dateRangeChangeHandler,"update-cols":e.updateColsHandler,"action-to-bottom":e.actionToBottomHandler,"action-to-new-messages":e.actionToNewMessages,"action-to-new-messages-hide":e.actionToNewMessagesHide},nativeOn:{click:function(t){return e.tableClickHandler.apply(null,arguments)}}},[s("empty-pane",{attrs:{slot:"empty",config:e.config.emptyState},slot:"empty"})],1)],1)},l=[],r=(s("26e9"),s("ddb0"),s("e9c4"),s("de45")),c=s("2b0e"),m=s("cdde"),d=s("b047c"),h=s.n(d),g=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{style:{height:e.itemHeight+"px",width:e.rowWidth+"px"},on:{click:function(t){return e.itemClickHandler(e.index,e.item,t)}}},[s("div",{staticClass:"cursor-pointer",class:[e.item["x-flespi-status"]?"missed-items":"",e.selected?"bg-white-opasity":e.highlightLevel?"text-"+e.highlightType+"-"+e.highlightLevel:""],style:{height:e.itemHeight+"px",width:e.rowWidth+"px",color:e.selected?"#333":""}},[e._l(e.cols,(function(t,i){var o,a;return["etc"===t.__dest?s("span",{key:t.name+i,staticClass:"list__item item_etc",class:(o={},o["item_"+i]=!0,o["item--active"]=e.menuCellActive&&e.menuCellActive.row===e.index&&e.menuCellActive.col===i,o)},[e._v(e._s(e.values.etc.value||"*Empty*"))]):s("span",{key:t.name+i,staticClass:"list__item",class:(a={},a["item_"+i]=!0,a["item--active"]=e.menuCellActive&&e.menuCellActive.row===e.index&&e.menuCellActive.col===i,a),attrs:{title:e.values[t.name].value}},[e._v("\n        "+e._s(e.values[t.name].value)+"\n      ")])]}))],2)])},u=[],p=s("bd4c"),f={props:["item","index","actions","cols","itemHeight","etcVisible","rowWidth","actionsVisible","selected","menuCellActive"],data(){let e=0,t="";return this.item.timestamp<this.item["server.timestamp"]-1800?(t="grey",e=7):this.item.timestamp<this.item["server.timestamp"]-600?(t="grey",e=6):this.item.timestamp<this.item["server.timestamp"]-120?(t="grey",e=5):this.item.timestamp-1800>this.item["server.timestamp"]?(t="orange",e=10):this.item.timestamp-60>this.item["server.timestamp"]?(t="orange",e=7):this.item.timestamp-1>this.item["server.timestamp"]&&(t="orange",e=4),{highlightType:t,highlightLevel:e,date:p["a"]}},computed:{values(){let e={};return e=this.cols.length?this.cols.reduce(((e,t,s,i)=>(e[t.name]={value:this.getValueOfProp(t,this.item)},s===i.length-1&&(e.etc={value:""}),e)),{}):{etc:{value:""}},Object.keys(this.item).forEach((t=>{if(!e[t]){if(-1!==t.indexOf("x-flespi"))return!1;-1!==t.indexOf("image.bin.")?e.etc.value+=`${t}: <binary image>`:e.etc.value+=`${t}: ${JSON.stringify(this.item[t])}; `}})),e}},methods:{clickHandler(e,t,s){this.$emit("action",{index:e,type:t,content:s})},itemClickHandler(e,t,s){this.$emit("item-click",{index:e,content:t,event:s})},getValueOfProp(e,t){const s=e.name;let i=t[s];return-1!==s.indexOf("image.bin.")&&i?i="<binary image>":-1!==s.indexOf("proxy.event")?i=0===i?"data received":1===i?"connected":"disconnect":-1!==s.indexOf("proxy.source")?i=0===i?"channel incoming connection":`target ${i}`:s.match(/timestamp$/)&&(i=p["a"].formatDate(1e3*i,"DD/MM/YYYY HH:mm:ss")),"string"!==typeof i&&(i=JSON.stringify(i)),i}}},v=f,w=(s("e6d4"),s("2877")),$=Object(w["a"])(v,g,u,!1,null,"1230044c",null),y=$.exports,b=s("121a"),x=s("0463"),N=s("6126"),C=s("db49"),_=s("b609"),S=s("c9ad"),H={props:["item","activeId","limit","config"],data(){return{listItem:y,moduleName:this.config.vuexModuleName,autoscroll:!0,isInit:!1,i18n:{"Columns by schema":"Columns by protocol"},scrollTimestamp:void 0}},computed:{messages:{get(){const e=this.$store.state[this.moduleName].messages;return this.scrollControlling(e.length),e},set(e){this.$store.commit(`${this.moduleName}/setMessages`,e)}},panelActions(){return[{label:"Export CSV",icon:"mdi-file-document-outline",handler:()=>this.exportCsv({filter:`${this.filter}`,from:this.from/1e3,to:this.to/1e3},{from:this.from,to:this.to},"channels"),condition:this.messages.length,tooltip:"Save messages to CSV",async:this.isFileCsvLoading}]},active:{get(){return this.$store.state[this.moduleName].active},async set(e){await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.$store.commit(`${this.moduleName}/setActive`,e);const t=this.$store.state.channels[e]||{};this.$set(this.config.viewConfig,"needShowEtc",t.protocol_name&&("http"===t.protocol_name||"mqtt"===t.protocol_name)),this.$store.commit(`${this.moduleName}/clearMessages`),await this.$store.dispatch(`${this.moduleName}/getCols`,{etc:!1}),await this.$store.dispatch(`${this.moduleName}/initTime`),await this.getMessages()}},cols:{get(){return this.$store.state[this.moduleName].cols},set(e){this.$store.commit(`${this.moduleName}/updateCols`,e)}},filter:{get(){return this.$store.state[this.moduleName].filter},set(e){e=e||"",this.$store.commit(`${this.moduleName}/setFilter`,e)}},from:{get(){return this.$store.state[this.moduleName].from},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setFrom`,e)}},to:{get(){return this.$store.state[this.moduleName].to},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setTo`,e)}},dateRange(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},reverse:{get(){return this.$store.state[this.moduleName].reverse||!1},set(e){this.$store.commit(`${this.moduleName}/setReverse`,e)}},realtimeEnabled(){return this.$store.state[this.moduleName].realtimeEnabled},hasNewMessages:{get(){return this.$store.state[this.moduleName].hasNewMessages},set(e){this.$store.state[this.moduleName].hasNewMessages=e}},currentLimit:{get(){return this.$store.state[this.moduleName].limit},set(e){e=e||1e3,this.$store.commit(`${this.moduleName}/setLimit`,e)}},selected:{get(){return this.$store.state[this.moduleName].selected},set(e){e&&e.length&&(this.autoscroll=!1),this.$store.commit(`${this.moduleName}/setSelected`,e),this.updateSelectedRoute(this.selectedMessagesTimestamps)}},selectedMessagesTimestamps(){let e;return this.selected.length&&(e=this.selected.map((e=>this.messages[e]["server.timestamp"]))),e},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)},needAutoscroll(){return this.realtimeEnabled&&!this.selected.length&&this.autoscroll}},methods:{tableClickHandler(e){e.target.closest(".list-item--click-control")||(this.selected=[],this.$emit("action-view-data",{index:-1,content:[]}))},getItemsProps(e,t){const s=this.messages[e];t.key=s["x-flespi-message-key"],t.class="list-item list-item--click-control",t.props.etcVisible=this.etcVisible,t.props.actionsVisible=this.actionsVisible,t.props.selected=this.selected.includes(e),t.props.actions=()=>this.getItemPropsActions(s,t),t.on||(t.on={}),t.on.action=this.actionHandler,t.on["item-click"]=this.itemClickHandler,t.dataHandler=(e,t,s)=>(this.autoscroll=!1,this.listItem.methods.getValueOfProp(e.data,t.data))},getItemPropsActions(e,t){const s=this.selected.length>1?C["a"]:C["b"],i=[...this.config.actions.filter((e=>e.mode===s))];return s===C["b"]&&(e["position.latitude"]&&e["position.longitude"]&&i.push({icon:"mdi-map",label:"Show on map",classes:"",type:"map"}),Object.keys(e).some((t=>{const s=e[t]&&(e[t].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/)||0===t.indexOf("image.bin."));return s&&i.push({icon:"mdi-image-outline",label:"Show image",classes:"",type:"image"}),s}))),i.push({icon:"mdi-function",label:"Test expression",classes:"",type:"expression"}),i},scrollHandler({event:e,data:t}){const s=Math.floor(t.start+(t.end-t.start)/4),i=this.messages[s];if(i){const e=i["server.timestamp"];this.scrollTimestamp=e,this.debouncedUpdateMessagesRoute({},!0)}},updateSelectedRoute(e){this.updateMessagesRoute({selected:e})},async getMessages(e){this.to<=Date.now()||e?(await this.$store.dispatch(`${this.moduleName}/get`,e),e&&this.scrollToTimestamp(e)):(await this.$store.dispatch(`${this.moduleName}/getHistory`,1e3),this.scrollTo(this.messages.length-1))},scrollTo(e){this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollTo(e)))},scrollToWithSavePadding(e){this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollToWithSavePadding(e)))},scrollToTimestamp(e){const t=this.messages.findIndex((t=>e<=t["server.timestamp"]));this.scrollTo(t)},resetParams(){this.$refs.scrollList.resetParams()},processQuery(e){if(!this.isInit)return!1;if(e)try{e=JSON.parse(e);let t=!1;(!this.filter&&e.filter||this.filter&&!e.filter||this.filter&&e.filter&&this.filter!==e.filter)&&(this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.filter=e.filter||null,t=!0),this.from===1e3*e.from&&this.to===1e3*e.to||(this.from=1e3*e.from,this.to=1e3*e.to,t=!0),t&&(this.$store.commit(`${this.moduleName}/clearMessages`),this.$store.dispatch(`${this.moduleName}/get`).then((()=>this.scrollTo(0))))}catch(t){}},filterChangeHandler(e){this.filter!==e&&this.updateMessagesRoute({filter:e||void 0})},updateColsHandler(e){this.cols=e},dateRangeChangeHandler(e){const t=e[0],s=e[1];if(this.from===t&&this.to===s)return!1;this.updateMessagesRoute({from:t/1e3,to:s/1e3})},paginationPrevChangeHandler(){this.$store.dispatch(`${this.moduleName}/getPrevPage`).then((e=>{e&&"number"===typeof e&&this.scrollToWithSavePadding(e)}))},paginationNextChangeHandler(){this.$store.dispatch(`${this.moduleName}/getNextPage`).then((e=>{this.autoscroll=!0,e&&"number"===typeof e&&this.scrollTo(this.messages.length-e)}))},actionHandler({index:e,type:t,content:s}){switch(this.selected.length>1&&(s=this.selected.map((e=>this.messages[e]))),t){case"view":this.itemClickHandler({index:e,content:s});break;case"copy":this.copyMessageHandler({index:e,content:s});break;case"expression":this.showExprTest(this.$store.state.token,this.cols.schemas[this.cols.activeSchema].cols,this.selected.map((e=>this.messages[e])));break;case"timeSync":this.$emit(`action-${t}`,{index:e,content:s,from:this.from,to:this.to});break;default:this.$emit(`action-${t}`,{index:e,content:[s]});break}},actionToBottomHandler(){this.realtimeEnabled?(this.autoscroll=!0,this.scrollTo(this.messages.length-1)):this.$store.dispatch(`${this.moduleName}/getHistory`,1e3).then((()=>{this.scrollTo(this.messages.length-1)}))},async actionToNewMessages(){this.hasNewMessages=null;const e=Date.now(),t=new Date(e).setHours(0,0,0,0),s=t+86399999.999;this.from=t,this.to=s,this.$store.commit(`${this.moduleName}/clearMessages`),this.getMessages()},actionToNewMessagesHide(){this.hasNewMessages=null},itemClickHandler({index:e,content:t,event:s}){this.selected=this.multiselectProcess({index:e,event:s,selected:this.selected});const i=this.selected.map((e=>this.messages[e]));this.$emit("action-view-data",{index:e,content:i})},copyMessageHandler({index:e,content:t}){Object(m["a"])(JSON.stringify(t)).then((e=>{this.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(e=>{this.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},unselect(){this.selected.length&&(this.selected=[])},nextSelect(){if(this.selected.length){const e=this.selected.slice(-1)[0],t=e+1,s=this.messages[t];s&&(this.selected=[t],this.$emit("action-select",{index:t,content:[s]}),this.scrollTo(t))}},prevSelect(){if(this.selected.length){const e=this.selected[0],t=e-1,s=this.messages[t];s&&(this.selected=[t],this.$emit("action-select",{index:t,content:[s]}),this.scrollTo(t))}},scrollControlling(e){this.selected.length&&this.selected[0]+1e3<=e&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)},timeSync(e){const t=e.content.timestamp,s=e.from,i=e.to;this.from=s,this.to=i,this.getMessages(t)},routeConfigProcess(e={}){const t={};try{e=JSON.parse(e)}catch(s){}return e.filter&&(t.filter=e.filter),e.from&&e.to?(t.from=1e3*e.from,t.to=1e3*e.to):this.$route.query.from&&this.$route.query.to&&(t.from=1e3*this.$route.query.from,t.to=1e3*this.$route.query.to),e.scroll&&(this.scrollTimestamp=e.scroll,t.initTimestamp=e.scroll),e.selected&&(t.selected=e.selected,t.initTimestamp=e.selected[0]),t},async init(){if(this.$store.state[this.moduleName]?this.$store.commit(`${this.moduleName}/clear`):this.$store.registerModule(this.moduleName,Object(r["c"])({Vue:c["default"],LocalStorage:this.$q.localStorage,name:{name:this.moduleName,lsNamespace:"flespi-toolbox-settings.cols"},errorHandler:e=>{this.$store.commit("reqFailed",e)}})),this.currentLimit=this.limit,this.activeId){let{from:e,to:t,filter:s,initTimestamp:i,selected:o}=this.routeConfigProcess(this.$route.query.messages);this.filter=s,this.$store.commit(`${this.moduleName}/setActive`,this.activeId);const a=this.$store.state.channels[this.activeId]||{};this.$set(this.config.viewConfig,"needShowEtc",a.protocol_name&&("http"===a.protocol_name||"mqtt"===a.protocol_name)),await this.$store.dispatch(`${this.moduleName}/getCols`,{etc:!0}),e&&t?(this.from=e,this.to=t,await this.getMessages(i)):(await this.$store.dispatch(`${this.moduleName}/initTime`),await this.getMessages()),this.initSelectedByTimestamps(o)}this.updateMessagesRoute({},!0),this.isInit=!0},initSelectedByTimestamps(e){if(e){const{indexes:t,messages:s}=this.messages.reduce(((t,s,i)=>(e.includes(s["server.timestamp"])&&(t.messages.push(s),t.indexes.push(i)),t)),{indexes:[],messages:[]});this.selected=t,this.$emit("action-view-data",{index:t[t.length-1],content:s})}},updateMessagesRoute(e={},t=!1){const s={filter:this.filter||void 0,from:this.from/1e3,to:this.to/1e3,scroll:this.scrollTimestamp,selected:this.selectedMessagesTimestamps,...e};this.updateRoute({query:{messages:JSON.stringify(s)}},t)}},watch:{activeId(e){this.active=e},limit(e){this.currentLimit=e},$route(e){this.processRoute({messages:this.processQuery},e)}},created(){this.debouncedUpdateMessagesRoute=h()(this.updateMessagesRoute,500,{trailing:!0,maxWait:1e3}),this.init(),this.offlineHandler=c["default"].connector.socket.on("offline",(()=>{this.$store.commit(`${this.moduleName}/setOffline`)})),this.connectHandler=c["default"].connector.socket.on("connect",(()=>{this.$store.state[this.moduleName].offline&&(this.$store.commit(`${this.moduleName}/setReconnected`),this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/getMissedMessages`),this.$store.commit(`${this.moduleName}/clearOfflineState`))}))},beforeDestroy(){this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),void 0!==this.offlineHandler&&c["default"].connector.socket.off("offline",this.offlineHandler),void 0!==this.connectHandler&&c["default"].connector.socket.off("connect",this.connectHandler),this.$store.commit(`${this.moduleName}/clear`)},mixins:[x["a"],N["a"],_["a"],S["a"]],components:{VirtualScrollList:r["b"],EmptyPane:b["a"]}},T=H,M=Object(w["a"])(T,n,l,!1,null,null,null),q=M.exports,I=s("df1d"),k=s("4596"),W=s("6512"),A=s("5c16"),V=s("2f62"),L=s("a99a"),E=s("9b02"),P=s.n(E),O=s("286e"),R=s("0644"),D=s.n(R),z=s("8ed9");const j={100:"logs",50:"both",0:"messages"},F={logs:100,both:50,messages:0};var Q={props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[O["a"],I["a"],k["a"],W["a"],N["a"]],data(){return{entityName:"channels",filter:"",active:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,needShowGetDeletedAction:!0}},computed:{...Object(V["d"])({hasMessages(e){return this.config.messages&&!!e[this.config.messages.vuexModuleName]&&!!e[this.config.messages.vuexModuleName].messages.length&&100!==this.ratio},hasLogs(e){return this.config.logs&&!!e[this.config.logs.vuexModuleName]&&e[this.config.logs.vuexModuleName].messages&&!!e[this.config.logs.vuexModuleName].messages.length&&0!==this.ratio},tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},protocols(e){return e.channelsProtocols},itemsCollection(e){return e.channels||{}},proxyProtocolId(e){const t=e.channelsProtocols;return Object.keys(t).reduce(((e,s)=>("proxy"===t[s].name&&(e=parseInt(s)),e)),0)},protocolFeatures(){const e=this.protocols;if(!this.selectedItem)return{};const t=this.selectedItem.protocol_id,s=e[t];return s.features},isTrafficViewerSupported(e){const t=P()(e.config,"trafficViewer.isDrawable",!1);return this.protocolFeatures.raw_packets&&t}}),logsConfig(){const e=D()(this.config.logs);return this.isTrafficViewerSupported&&e.actions.push({icon:"mdi-download-network-outline",label:"View traffic",mode:C["b"],classes:"",type:"traffic"}),50===this.ratio&&e.actions.push({icon:"mdi-swap-vertical",label:"Show on messages",classes:"",mode:C["b"],type:"timeSync"}),e},messagesConfig(){const e=D()(this.config.messages);return this.selectedItem&&this.selectedItem.protocol_id===this.proxyProtocolId?e.actions.push({icon:"mdi-matrix",label:"View in hex",classes:"",mode:C["b"],type:"hex"}):this.isTrafficViewerSupported&&e.actions.push({icon:"mdi-download-network-outline",label:"View traffic",classes:"",mode:C["b"],type:"traffic"}),50===this.ratio&&e.actions.push({icon:"mdi-swap-vertical",label:"Show on logs",classes:"",mode:C["b"],type:"timeSync"}),e},items(){return Object.values(this.itemsCollection)},filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const s=e.name.toLowerCase(),i=t.name.toLowerCase();return s<i?-1:1})),t},size(){return[this.ratio,100-this.ratio]},selectedItem(){const e=this.itemsCollection[this.active]||null;return e&&e.deleted&&this.deletedHandler(),e},actions(){return[{label:"Hex",icon:"mdi-matrix",handler:this.hexViewHandler,condition:this.selectedItem&&this.selectedItem.protocol_id===this.proxyProtocolId&&this.$q.platform.is.mobile},{label:"Traffic",icon:"mdi-download-network-outline",handler:this.trafficViewHandler,condition:this.isTrafficViewerSupported&&this.$q.platform.is.mobile},{label:"Clear",icon:"mdi-playlist-remove",handler:this.clearHandler,condition:this.hasMessages||this.hasLogs}]},panelsWidgetsStyle(){const e={},t=this.isWidgetsMessageActive||this.isWidgetsLogsActive,s=this.widgetStyle.left&&this.widgetStyle.right&&t,i=this.widgetStyle.left&&t,o=this.widgetStyle.right&&t;return s?(e.maxWidth="calc(100% - 600px)",e.left="300px"):(i||o)&&(e.maxWidth="calc(100% - 300px)",o&&(e.left="300px")),e},ratio(){return P()(this.settings.viewSettings,`${this.entityName}.ratio`,50)}},methods:{...Object(V["b"])(["getDeleted"]),hexViewHandler(){this.$router.push(`/tools/hex/${this.active}`).catch((e=>e))},trafficViewHandler(){this.$router.push(`/tools/traffic/${this.active}`).catch((e=>e))},toHexHandler({content:e}){const t=e.ident,s=e.timestamp,i=s+1,o=i-10;t&&this.$router.push({path:`/tools/hex/${this.active}/ident/${t}`,query:{from:o,to:i,highlight:s}}).catch((e=>e))},timeMessagesSyncHandler(e){50!==this.ratio&&this.updateRatio(50),this.$nextTick((()=>{this.$refs.logs.timeSync(e)}))},timeLogsSyncHandler(e){50!==this.ratio&&this.updateRatio(50),this.$nextTick((()=>{this.$refs.messages.timeSync(e)}))},toErrorTrafficHandler({content:e}){if(!this.isTrafficViewerSupported)return;const t={tcp:2,udp:130},s=this.protocolFeatures.shared_connection||!e.ident?"unidentified":e.ident;let i,o=e["server.timestamp"]||e.timestamp,a=o+1,n=a-10;e.error_text&&e.traffic&&(o=e.traffic.timestamp,n=o,a=e.timestamp,i={...e.traffic,text:e.error_text}),this.$connector.gw.getChannelsIdentsPackets(this.active,s,{data:{from:n,to:a,filter:`type=${t[e.transport]}`}}).then((t=>{const s=P()(t,"data.result",[]),o=s.map((e=>e.data));o?this.$q.dialog({component:z["a"],parent:this,data:o,error:i,noRouteDismiss:!0}).onOk((()=>{this.toTrafficHandler({content:e})})).onCancel((()=>{})):this.$q.notify({message:"Traffic is empty",type:"negative"})}))},toTrafficHandler({content:e}){const t=this.protocolFeatures.shared_connection||!e.ident?"unidentified":e.ident,s=e["server.timestamp"]||e.timestamp,i=s+1,o=i-10,a=s,n={from:o,to:i,highlight:a};t&&this.$router.push({path:`/tools/traffic/${this.active}/ident/${t}`,query:n}).catch((e=>e))},clearHandler(){this.$q.dialog({title:"Confirm",message:"Do you really want to clear all data from the panes?",ok:!0,cancel:!0,noRouteDismiss:!0}).onOk((()=>{this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`),this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`),this.isWidgetsLogsActive?(this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler()):this.isWidgetsMessageActive&&(this.isWidgetsMessageActive=!1,this.closeMessageWidgetsHandler())})).onCancel((()=>{}))},selectReset(){this.$refs.itemSelect&&this.$refs.itemSelect.reset()},async getDeletedHandler(){await this.getDeleted(this.entityName),this.needShowGetDeletedAction=!1,this.selectReset()},clearActive(){this.updateActive(null)},updateActive(e){this.updateRoute({name:this.entityName,params:{id:e}},!this.active)},deletedHandler(){this.changeRatioHandler(100)},init(){const e=this.entityName,t=P()(this.settings,`entities[${e}]`,void 0),s=this.$route.params&&this.$route.params.id?Number(this.$route.params.id):null,i=this.$route.query.view_mode;let o=50;i&&(o=F[i],this.$emit("update:settings",{type:"ENTITY_VIEW_SETTINGS_CHANGE",opt:{entity:this.entityName},value:{ratio:o}})),this.isInit=!0;let a=null;s&&this.itemsCollection[s]?a=s:t&&this.itemsCollection[t]?a=t:(s&&!this.itemsCollection[s]||t&&!this.itemsCollection[t])&&this.clearActive(),this.selectedItem&&this.selectedItem.deleted&&this.deletedHandler(),a&&(this.active=a,this.updateRoute({name:this.entityName,params:{id:a},query:{view_mode:j[o]}},!0)),this.$emit("inited")},clearWidgetsState(){this.isWidgetsMessageActive=!1,this.isWidgetsLogsActive=!1,this.activeWidgetWindow=void 0,this.widgetsViewedMessage=null,this.widgetsViewedLog=null},beforeEnableWidgetByPane(e){switch(this.widgetStyle.left||this.isWidgetsMessageActive||this.isWidgetsLogsActive||this.widgetsViewModel.data||this.$nextTick((()=>this.widgetsChangeViewModelHandler(this.entityName,"data",{type:"minimized",to:"left"}))),e){case"messages":this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler();break;case"logs":this.isWidgetsMessageActive=!1,this.closeMessageWidgetsHandler();break}},onResizePage(e){this.$refs.messagesView.resize(e),this.$refs.logsView.resize(e)},updateRatio(e){this.updateRoute({query:{view_mode:j[e]}})},changeRatioHandler(e){this.ratio!==e&&(this.ratioWidgetsModify(e),this.$emit("update:settings",{type:"ENTITY_VIEW_SETTINGS_CHANGE",opt:{entity:this.entityName},value:{ratio:e}}),this.$nextTick((()=>{+this.size[0]&&this.active&&this.$refs.logs.resetParams(),+this.size[1]&&this.active&&this.$refs.messages.resetParams()})))}},watch:{$route(e){if(e.params&&e.params.id){const t=Number(e.params.id);this.itemsCollection[t]?this.active=Number(e.params.id):this.isInit&&(this.active=null)}else e.params&&!e.params.id&&(this.active=null);this.processRoute({view_mode:e=>this.changeRatioHandler(F[e])},e)},active(e){const t=this.itemsCollection[e]||{};e&&this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:this.entityName},value:t.id}),t.deleted&&this.deletedHandler()}},components:{logs:a["a"],messages:q,EntitiesToolbar:L["a"],Widgets:A["a"]}},G=Q,J=(s("a037"),s("9989")),Y=s("3980"),B=s("ddd8"),U=s("27f9"),X=s("0016"),Z=s("9c40"),K=s("66e5"),ee=s("4074"),te=s("0170"),se=s("8572"),ie=s("eebe"),oe=s.n(ie),ae=Object(w["a"])(G,i,o,!1,null,"0a1e3a73",null);t["default"]=ae.exports;oe()(ae,"components",{QPage:J["a"],QResizeObserver:Y["a"],QSelect:B["a"],QInput:U["a"],QIcon:X["a"],QBtn:Z["a"],QItem:K["a"],QItemSection:ee["a"],QItemLabel:te["a"],QField:se["a"]})},8867:function(e,t,s){},a037:function(e,t,s){"use strict";s("8867")},cb13:function(e,t,s){},e6d4:function(e,t,s){"use strict";s("cb13")}}]);