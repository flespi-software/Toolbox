(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"691f":function(e,t,s){"use strict";s("cc5e")},c4c9:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",[s("q-resize-observer",{on:{resize:e.onResizePage}}),s("entities-toolbar",{attrs:{item:e.selectedItem,ratio:e.ratio,actions:e.actions},on:{"change-ratio":e.updateRatio}},[s("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[s("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,"hide-dropdown-icon":!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("devices")>-1,label:e.active?"Device":"SELECT DEVICE",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("devices")>-1,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+(e.needShowGetDeletedAction&&1===e.tokenType?77:48)+(e.filteredItems.length?0:4)+"px"}},on:{filter:function(t,s){return e.filterItems(e.entityName,t,s)}},scopedSlots:e._u([{key:"no-option",fn:function(){return[s("div",{staticStyle:{"min-height":"77px"}},[s("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),s("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(t){return[e.selectedItem?s("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(e.selectedItem.configuration&&e.selectedItem.configuration.ident?e.selectedItem.configuration.ident:"<no ident>"))])])],1),s("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?s("q-item-label",{staticClass:"q-pa-none text-right"},[s("small",{staticClass:"cheap-modifier"},[e._v("DELETED")])]):e._e(),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[s("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},{key:"option",fn:function(t){return[s("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":t.opt.deleted},attrs:{clickable:""},on:{click:function(s){return e.updateActive(t.opt.id)}}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(t.opt.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(t.opt.configuration&&t.opt.configuration.ident?t.opt.configuration.ident:"<no ident>"))])])],1),s("q-item-section",{attrs:{side:""}},[t.opt.deleted?s("q-item-label",{staticClass:"q-pa-xs text-right"},[s("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[s("small",[e._v("#"+e._s(t.opt.id))])])],1)],1)]}}])},[s("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[s("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1),e.needShowGetDeletedAction&&1===e.tokenType?s("div",{staticClass:"select__get-deleted",attrs:{slot:"after-options"},slot:"after-options"},[s("q-btn",{staticClass:"deleted-action",attrs:{icon:"mdi-download"},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.getDeletedHandler.apply(null,arguments)}}},[e._v("see deleted")])],1):e._e()]),e.$q.platform.is.desktop&&e.selectedItem&&!e.selectedItem.deleted?s("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[e.needTrafficRoute?s("q-btn",{staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"50px"},attrs:{title:"Traffic hex payload",flat:"",dense:""},on:{click:e.trafficViewHandler}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-download-network-outline"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Traffic")])],1):e._e()],1):e._e()],1)]),e.isInit&&e.active?s("div",[+e.size[0]?s("logs",{ref:"logs",style:[{height:"calc("+e.size[0]+"vh - "+(+e.size[1]?e.isVisibleToolbar?"50px":"25px":e.isVisibleToolbar?"100px":"50px")+")",position:"relative"},e.panelsWidgetsStyle],attrs:{item:e.selectedItem,limit:e.limit,originPattern:"gw/devices/:id","entity-name":e.entityName,isEnabled:!!+e.size[0],config:e.logsConfig},on:{"view-log-message":e.viewWidgetsLogHandler,"action-select":function(t){return e.widgetsViewedLog=t.content},"to-traffic":e.toTrafficHandler,"to-error-traffic":e.toErrorTrafficHandler}}):e._e(),+e.size[1]?s("messages",{ref:"messages",style:[{height:"calc("+e.size[1]+"vh - "+(+e.size[0]?e.isVisibleToolbar?"50px":"25px":e.isVisibleToolbar?"100px":"50px")+")",position:"relative"},e.panelsWidgetsStyle],attrs:{item:e.selectedItem,activeId:e.active,isEnabled:!!+e.size[1],limit:e.limit,config:e.messagesConfig},on:{"action-view-data":function(t){e.messageWidgetsActions("object",t),e.addWidgetTrackMarker("track",t)},"action-map":function(t){return e.messageWidgetsActions("position",t)},"action-show":function(t){return e.messageWidgetsActions("show",t)},"action-image":function(t){return e.messageWidgetsActions("image",t)},"action-select":function(t){return e.messageWidgetsActions("select",t)},"action-traffic":function(t){return e.messageWidgetsActions("traffic",t)}}}):e._e()],1):e._e(),!e.items.length&&e.isItemsInit?s("div",{staticClass:"text-center text-grey-3 q-mt-lg"},[s("div",{staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Devices not found"))]),!e.isLoading&&e.needShowGetDeletedAction&&1===e.tokenType?s("q-btn",{staticClass:"q-mt-sm",attrs:{icon:"mdi-download",label:"see deleted"},on:{click:e.getDeletedHandler}}):e._e()],1):e._e(),s("widgets",{ref:"messagesView",attrs:{active:"messagesView"===e.activeWidgetWindow,config:e.messageWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.data},on:{"change-view-model":function(t){return e.widgetsChangeViewModelHandler(e.entityName,"data",t)},active:function(t){return e.activateWidgetWindow("messagesView")},close:e.closeMessageWidgetsHandler,next:e.nextWidgetsMessage,prev:e.prevWidgetsMessage},model:{value:e.isWidgetsMessageActive,callback:function(t){e.isWidgetsMessageActive=t},expression:"isWidgetsMessageActive"}}),s("widgets",{ref:"logsView",attrs:{active:"logsView"===e.activeWidgetWindow,config:e.logsWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.data},on:{"change-view-model":function(t){return e.widgetsChangeViewModelHandler(e.entityName,"data",t)},active:function(t){return e.activateWidgetWindow("logsView")},close:e.closeLogsWidgetsHandler,next:e.nextWidgetLog,prev:e.prevWidgetLog},model:{value:e.isWidgetsLogsActive,callback:function(t){e.isWidgetsLogsActive=t},expression:"isWidgetsLogsActive"}}),s("widgets",{ref:"track",attrs:{active:"track"===e.activeWidgetWindow,config:e.trackWidgetConfig,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.track},on:{"change-view-model":function(t){return e.widgetsChangeViewModelHandler(e.entityName,"track",t)},active:function(t){return e.activateWidgetWindow("track")},close:e.closeWidgetsHandler},model:{value:e.isWidgetsTrackActive,callback:function(t){e.isWidgetsTrackActive=t},expression:"isWidgetsTrackActive"}})],1)},a=[],o=s("2ce0"),n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("virtual-scroll-list",{ref:"scrollList",class:{"non-selectable":e.selectionMode},attrs:{cols:e.cols,actions:e.config.actions,panelActions:e.panelActions,items:e.messages,dateRange:e.dateRange,viewConfig:e.config.viewConfig,filter:e.filter,theme:e.config.theme,title:"Messages",loading:e.loadingFlag,autoscroll:e.needAutoscroll,scrollOffset:"10%",item:e.listItem,i18n:e.i18n,itemprops:e.getItemsProps,"has-new-messages":e.hasNewMessages},on:{scroll:e.scrollHandler,action:e.actionHandler,"change-filter":e.filterChangeHandler,"scroll-top":e.paginationPrevChangeHandler,"scroll-bottom":e.paginationNextChangeHandler,"change-date-range":e.dateRangeChangeHandler,"action-to-bottom":e.actionToBottomHandler,"update-cols":e.updateColsHandler,"action-to-new-messages":e.actionToNewMessages,"action-to-new-messages-hide":e.actionToNewMessagesHide},nativeOn:{click:function(t){return e.tableClickHandler.apply(null,arguments)}}},[s("empty-pane",{attrs:{slot:"empty",config:e.config.emptyState},slot:"empty"})],1)],1)},l=[],r=(s("26e9"),s("ddb0"),s("e9c4"),s("de45")),c=s("2b0e"),d=s("cdde"),m=s("121a"),h=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{style:{height:e.itemHeight+"px",width:e.rowWidth+"px"},on:{click:function(t){return e.itemClickHandler(e.index,e.item,t)}}},[s("div",{staticClass:"cursor-pointer",class:[e.item["x-flespi-status"]?"missed-items":"",e.selected?"bg-white-opasity":e.highlightLevel?"text-"+e.highlightType+"-"+e.highlightLevel:""],style:{height:e.itemHeight+"px",width:e.rowWidth+"px",color:e.selected?"#333":""}},[e._l(e.cols,(function(t,i){var a,o;return["etc"===t.__dest?s("span",{key:t.name+i,staticClass:"list__item item_etc",class:(a={},a["item_"+i]=!0,a["item--active"]=e.menuCellActive&&e.menuCellActive.row===e.index&&e.menuCellActive.col===i,a)},[e._v(e._s(e.values.etc.value||"*Empty*"))]):s("span",{key:t.name+i,staticClass:"list__item",class:(o={},o["item_"+i]=!0,o["item--active"]=e.menuCellActive&&e.menuCellActive.row===e.index&&e.menuCellActive.col===i,o),attrs:{title:e.values[t.name].value}},[e._v("\n        "+e._s(e.values[t.name].value)+"\n      ")])]}))],2)])},g=[],u=s("bd4c"),f={props:["item","index","actions","cols","itemHeight","rowWidth","selected","menuCellActive"],data(){let e=0,t="";return this.item.timestamp<this.item["server.timestamp"]-1800?(t="grey",e=7):this.item.timestamp<this.item["server.timestamp"]-600?(t="grey",e=6):this.item.timestamp<this.item["server.timestamp"]-120?(t="grey",e=5):this.item.timestamp-1800>this.item["server.timestamp"]?(t="orange",e=10):this.item.timestamp-60>this.item["server.timestamp"]?(t="orange",e=7):this.item.timestamp-1>this.item["server.timestamp"]&&(t="orange",e=4),{highlightType:t,highlightLevel:e,date:u["a"]}},computed:{values(){let e={};return e=this.cols.length?this.cols.reduce(((e,t,s,i)=>(e[t.name]={value:this.getValueOfProp(t,this.item)},s===i.length-1&&(e.etc={value:""}),e)),{}):{etc:{value:""}},Object.keys(this.item).forEach((t=>{e[t]||(-1!==t.indexOf("image.bin.")?e.etc.value+=`${t}: <binary image>`:e.etc.value+=`${t}: ${JSON.stringify(this.item[t])}; `)})),e}},methods:{clickHandler(e,t,s){this.$emit("action",{index:e,type:t,content:s})},itemClickHandler(e,t,s){this.$emit("item-click",{index:e,content:t,event:s})},getValueOfProp(e,t){const s=e.name;let i=t[s];return s.match(/timestamp$/)?i=u["a"].formatDate(1e3*i,"DD/MM/YYYY HH:mm:ss"):-1!==s.indexOf("image.bin.")&&i?i="<binary image>":"string"!==typeof i&&(i=JSON.stringify(i)),i}}},p=f,v=(s("691f"),s("2877")),w=Object(v["a"])(p,h,g,!1,null,"41e26430",null),$=w.exports,y=s("9b02"),b=s.n(y),k=s("0463"),x=s("6126"),N=s("db49"),M=s("b609"),T=s("c9ad"),C={props:["item","activeId","limit","config"],data(){return{listItem:$,moduleName:this.config.vuexModuleName,autoscroll:!0,isInit:!1,i18n:{"Columns by schema":"Columns by protocol"},scrollTimestamp:void 0}},computed:{messages:{get(){const e=this.$store.state[this.moduleName].messages;return this.scrollControlling(e.length),e},set(e){this.$store.commit(`${this.moduleName}/setMessages`,e)}},active:{get(){return this.$store.state[this.moduleName].active},async set(e){await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.$store.commit(`${this.moduleName}/setActive`,e),this.$store.commit(`${this.moduleName}/clearMessages`),await this.$store.dispatch(`${this.moduleName}/getCols`,{etc:!0}),await this.$store.dispatch(`${this.moduleName}/initTime`),await this.getMessages()}},panelActions(){return[{label:"Export CSV",icon:"mdi-file-document-outline",handler:()=>this.exportCsv({filter:`${this.filter}`,from:this.from/1e3,to:this.to/1e3},{from:this.from,to:this.to},"devices"),condition:this.messages.length,tooltip:"Save messages to CSV",async:this.isFileCsvLoading}]},cols:{get(){return this.$store.state[this.moduleName].cols},set(e){this.$store.commit(`${this.moduleName}/updateCols`,e)}},filter:{get(){return this.$store.state[this.moduleName].filter},set(e){e=e||"",this.$store.commit(`${this.moduleName}/setFilter`,e)}},from:{get(){return this.$store.state[this.moduleName].from},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setFrom`,e)}},to:{get(){return this.$store.state[this.moduleName].to},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setTo`,e)}},dateRange(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},realtimeEnabled(){return this.$store.state[this.moduleName].realtimeEnabled},reverse:{get(){return this.$store.state[this.moduleName].reverse||!1},set(e){this.$store.commit(`${this.moduleName}/setReverse`,e)}},currentLimit:{get(){return this.$store.state[this.moduleName].limit},set(e){e=e||1e3,this.$store.commit(`${this.moduleName}/setLimit`,e)}},selected:{get(){return this.$store.state[this.moduleName].selected},set(e){e&&e.length&&(this.autoscroll=!1),this.$store.commit(`${this.moduleName}/setSelected`,e),this.updateSelectedRoute(this.selectedMessagesTimestamps)}},selectedMessagesTimestamps(){let e;return this.selected.length&&(e=this.selected.map((e=>this.messages[e].timestamp))),e},hasNewMessages:{get(){return this.$store.state[this.moduleName].hasNewMessages},set(e){this.$store.state[this.moduleName].hasNewMessages=e}},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)},needAutoscroll(){return this.realtimeEnabled&&!this.selected.length&&this.autoscroll}},methods:{tableClickHandler(e){e.target.closest(".list-item--click-control")||(this.selected=[],this.$emit("action-view-data",{index:-1,content:[]}))},getItemsProps(e,t){const s=this.messages[e];t.key=s["x-flespi-message-key"],t.class="list-item list-item--click-control",t.props.etcVisible=this.etcVisible,t.props.actionsVisible=this.actionsVisible,t.props.selected=this.selected.includes(e),t.props.actions=()=>this.getItemPropsActions(s,t),t.on||(t.on={}),t.on.action=this.actionHandler,t.on["item-click"]=this.itemClickHandler,t.dataHandler=(e,t,s)=>(this.autoscroll=!1,this.listItem.methods.getValueOfProp(e.data,t.data))},getItemPropsActions(e,t){const s=this.selected.length>1?N["a"]:N["b"],i=[...this.config.actions.filter((e=>e.mode===s))];return s===N["b"]&&(e["position.latitude"]&&e["position.longitude"]&&i.push({icon:"mdi-map",label:"Show on map",classes:"",type:"map"}),Object.keys(e).some((t=>{const s=e[t]&&(e[t].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/)||0===t.indexOf("image.bin."));return s&&i.push({icon:"mdi-image-outline",label:"Show image",classes:"",type:"image"}),s}))),i.push({icon:"mdi-function",label:"Test expression",classes:"",type:"expression"}),i},scrollTo(e){this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollTo(e)))},scrollToWithSavePadding(e){this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollToWithSavePadding(e)))},scrollHandler({event:e,data:t}){const s=Math.floor(t.start+(t.end-t.start)/4),i=this.messages[s],a=i.timestamp;this.scrollTimestamp=a,this.updateMessagesRoute({},!0)},updateSelectedRoute(e){this.updateMessagesRoute({selected:e})},async getMessages(){this.to<=Date.now()?await this.$store.dispatch(`${this.moduleName}/get`):(await this.$store.dispatch(`${this.moduleName}/getHistory`,1e3),this.scrollTo(this.messages.length-1))},resetParams(){this.$refs.scrollList.resetParams()},processQuery(e){if(!this.isInit)return!1;if(e)try{e=JSON.parse(e);let t=!1;(!this.filter&&e.filter||this.filter&&!e.filter||this.filter&&e.filter&&this.filter!==e.filter)&&(this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.filter=e.filter||null,t=!0),this.from===1e3*e.from&&this.to===1e3*e.to||(this.from=1e3*e.from,this.to=1e3*e.to,t=!0),t&&(this.$store.commit(`${this.moduleName}/clearMessages`),this.$store.dispatch(`${this.moduleName}/get`))}catch(t){}},filterChangeHandler(e){this.filter!==e&&this.updateMessagesRoute({filter:e||void 0})},updateColsHandler(e){this.cols=e},dateRangeChangeHandler(e){const t=e[0],s=e[1];if(this.from===t&&this.to===s)return!1;this.updateMessagesRoute({from:t/1e3,to:s/1e3})},paginationPrevChangeHandler(){this.$store.dispatch(`${this.moduleName}/getPrevPage`).then((e=>{e&&"number"===typeof e&&this.scrollToWithSavePadding(e)}))},paginationNextChangeHandler(){this.$store.dispatch(`${this.moduleName}/getNextPage`).then((e=>{this.autoscroll=!0,e&&"number"===typeof e&&this.scrollTo(this.messages.length-e)}))},actionHandler({index:e,type:t,content:s}){switch(this.selected.length>1&&(s=this.selected.map((e=>this.messages[e]))),t){case"view":this.itemClickHandler({index:e,content:s});break;case"copy":this.copyMessageHandler({index:e,content:s});break;case"expression":this.showExprTest(this.$store.state.token,this.cols.schemas[this.cols.activeSchema].cols,this.selected.map((e=>this.messages[e])));break;default:this.$emit(`action-${t}`,{index:e,content:[s]});break}},itemClickHandler({index:e,content:t,event:s}){this.selected=this.multiselectProcess({index:e,event:s,selected:this.selected});const i=this.selected.map((e=>this.messages[e]));this.$emit("action-view-data",{index:e,content:i})},copyMessageHandler({index:e,content:t}){Object(d["a"])(JSON.stringify(t)).then((e=>{this.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(e=>{this.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},actionToBottomHandler(){this.realtimeEnabled?(this.autoscroll=!0,this.scrollTo(this.messages.length-1)):this.$store.dispatch(`${this.moduleName}/getHistory`,1e3).then((()=>{this.scrollTo(this.messages.length-1)}))},async actionToNewMessages(){this.hasNewMessages=null;const e=Date.now(),t=new Date(e).setHours(0,0,0,0),s=t+86399999.999;this.from=t,this.to=s,this.$store.commit(`${this.moduleName}/clearMessages`),this.getMessages()},actionToNewMessagesHide(){this.hasNewMessages=null},unselect(){this.selected.length&&(this.selected=[])},nextSelect(){if(this.selected.length){const e=this.selected.slice(-1)[0],t=e+1,s=this.messages[t];s&&(this.selected=[t],this.$emit("action-select",{index:t,content:[s]}),this.scrollTo(t))}},prevSelect(){if(this.selected.length){const e=this.selected[0],t=e-1,s=this.messages[t];s&&(this.selected=[t],this.$emit("action-select",{index:t,content:[s]}),this.scrollTo(t))}},scrollControlling(e){this.selected.length&&this.selected[0]+1e3<=e&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)},async getMessagesStartedBy(e){e*=1e3;const t={from:e/1e3,to:e/1e3,filter:this.filter||void 0,count:this.currentLimit},s=await this.$store.dispatch(`${this.moduleName}/getMessages`,t),i={from:this.from/1e3,to:(e-.001)/1e3,reverse:!0,filter:this.filter||void 0,count:this.currentLimit/2-s.length},a={from:(e+.001)/1e3,to:this.to/1e3,filter:this.filter||void 0,count:this.currentLimit/2-s.length},o=await this.$store.dispatch(`${this.moduleName}/getMessages`,i),n=await this.$store.dispatch(`${this.moduleName}/getMessages`,a),l=[...o.reverse(),...s,...n];this.$store.commit(`${this.moduleName}/limiting`,{type:"init",count:l.length}),this.$store.commit(`${this.moduleName}/setHistoryMessages`,l);const r=o.length;this.scrollTo(r)},routeConfigProcess(e={}){const t={};try{e=JSON.parse(e)}catch(s){}return e.filter&&(t.filter=e.filter),e.from&&e.to?(t.from=1e3*e.from,t.to=1e3*e.to):this.$route.query.from&&this.$route.query.to&&(t.from=1e3*this.$route.query.from,t.to=1e3*this.$route.query.to),e.scroll&&(this.scrollTimestamp=e.scroll,t.initTimestamp=e.scroll),e.selected&&(t.selected=e.selected,t.initTimestamp=e.selected[0]),t},async init(){if(this.$store.state[this.moduleName]?this.$store.commit(`${this.moduleName}/clear`):this.$store.registerModule(this.moduleName,Object(r["d"])({Vue:c["default"],LocalStorage:this.$q.localStorage,name:{name:this.moduleName,lsNamespace:"flespi-toolbox-settings.cols"},errorHandler:e=>{this.$store.commit("reqFailed",e)}})),this.currentLimit=this.limit,this.activeId){let{from:e,to:t,filter:s,initTimestamp:i,selected:a}=this.routeConfigProcess(this.$route.query.messages);this.filter=s,this.$store.commit(`${this.moduleName}/setActive`,this.activeId),await this.$store.dispatch(`${this.moduleName}/getCols`,{etc:!0}),e&&t?(this.from=e,this.to=t,i?await this.getMessagesStartedBy(i):await this.getMessages()):(await this.$store.dispatch(`${this.moduleName}/initTime`),await this.getMessages()),this.initSelectedByTimestamps(a)}this.updateMessagesRoute({},!0),this.isInit=!0},initSelectedByTimestamps(e){if(e){const{indexes:t,messages:s}=this.messages.reduce(((t,s,i)=>(e.includes(s.timestamp)&&(t.messages.push(s),t.indexes.push(i)),t)),{indexes:[],messages:[]});this.selected=t,this.$emit("action-view-data",{index:t[t.length-1],content:s})}},updateMessagesRoute(e={},t=!1){const s={filter:this.filter||void 0,from:this.from/1e3,to:this.to/1e3,scroll:this.scrollTimestamp,selected:this.selectedMessagesTimestamps,...e};this.updateRoute({query:{messages:JSON.stringify(s)}},t)}},watch:{activeId(e){this.active=e},limit(e){this.currentLimit=e},$route(e){this.processRoute({messages:this.processQuery},e)}},created(){this.init(),this.offlineHandler=c["default"].connector.socket.on("offline",(()=>{this.$store.commit(`${this.moduleName}/setOffline`)})),this.connectHandler=c["default"].connector.socket.on("connect",(()=>{this.$store.state[this.moduleName].offline&&(this.$store.commit(`${this.moduleName}/setReconnected`),this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/getMissedMessages`),this.$store.commit(`${this.moduleName}/clearOfflineState`))}))},beforeDestroy(){this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),void 0!==this.offlineHandler&&c["default"].connector.socket.off("offline",this.offlineHandler),void 0!==this.connectHandler&&c["default"].connector.socket.off("connect",this.connectHandler),this.$store.commit(`${this.moduleName}/clear`)},mixins:[k["a"],x["a"],M["a"],T["a"]],components:{VirtualScrollList:r["b"],EmptyPane:m["a"]}},W=C,H=Object(v["a"])(W,n,l,!1,null,null,null),_=H.exports,S=s("df1d"),I=s("4596"),q=s("6512"),A=s("0860"),L={data(){return{isWidgetsTrackActive:!1,trackWidgetMessageMarker:void 0,trackWidgetConfig:{track:{title:"Track",wrapper:A["a"]}}}},methods:{showWidgetTrack(e){!this.isWidgetsTrackActive&&e.length&&(this.isWidgetsTrackActive=!0),this.$nextTick((()=>this.setWidgetTrackView("track",e)))},setWidgetTrackView(e,t){const s=this.$refs.track.ref(e);if(!s||!t)return;let i=t;const a=i[i.length-1];let o;a&&(o={latlng:[a.lat,a.lon],direction:a.dir,label:"Last position"}),i=i.map((e=>[e.lat,e.lon])),s.clear(),i.length&&s.addPoints(i),o&&s.addNamedMarkers({position:o,...this.trackWidgetMessageMarker}),s.send(),this.activateWidgetWindow("track")},addWidgetTrackMarker(e,t){if(!this.isWidgetsTrackActive)return;const s=this.$refs.track.ref(e);if(s){if(t){const{content:e}=t,i={message:{latlng:[e["position.latitude"],e["position.longitude"]],direction:e["position.direction"],color:"#f0f",label:"Message"}};this.trackWidgetMessageMarker=i,s.addNamedMarker(i)}else this.trackWidgetMessageMarker=void 0;s.send()}},closeWidgetsHandler(){}}},V=s("5c16"),E=s("a99a"),O=s("b06b"),P=s("2f62"),R=s("286e"),D=s("0644"),z=s.n(D),j=s("8ed9");const B={100:"logs",50:"both",0:"messages"},Q={logs:100,both:50,messages:0};var F={props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[R["a"],S["a"],I["a"],q["a"],L,x["a"]],data(){return{entityName:"devices",filter:"",active:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,needShowGetDeletedAction:!0}},computed:{...Object(P["d"])({hasMessages(e){return this.config.messages&&!!e[this.config.messages.vuexModuleName]&&!!e[this.config.messages.vuexModuleName].messages.length&&100!==this.ratio},hasLogs(e){return this.config.logs&&!!e[this.config.logs.vuexModuleName]&&e[this.config.logs.vuexModuleName].messages&&!!e[this.config.logs.vuexModuleName].messages.length&&0!==this.ratio},tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},itemsCollection(e){return e.devices||{}},tasksByDevice(e){return Object.values(e.tasks||{})},trackByMessages(e){const t=this.config&&this.config.messages&&e[this.config.messages.vuexModuleName]?e[this.config.messages.vuexModuleName].messages:[],s=[];for(let i=0;i<t.length;i++){const e=t[i];e["position.latitude"]&&e["position.longitude"]&&s.push({lat:e["position.latitude"],lon:e["position.longitude"],dir:e["position.direction"]})}return this.isWidgetsTrackActive&&this.setWidgetTrackView("track",s),s},needTrafficRoute(e){return b()(e.config,"deviceTraffic.isDrawable",!1)}}),items(){return Object.values(this.itemsCollection)},selectedItem(){const e=this.itemsCollection&&this.itemsCollection[this.active]||null;return e&&e.deleted&&this.deletedHandler(),e},logsConfig(){const e=z()(this.config.logs);return this.needTrafficRoute&&e.actions.push({icon:"mdi-download-network-outline",label:"View traffic",classes:"",mode:N["b"],type:"traffic"}),e},filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0||t&&t.configuration&&"undefined"!==typeof t.configuration.ident&&null!==t.configuration.ident&&t.configuration.ident.toLowerCase().indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const s=e.name.toLowerCase(),i=t.name.toLowerCase();return s<i?-1:1})),t},size(){return[this.ratio,100-this.ratio]},messagesConfig(){const e=z()(this.config.messages);return this.needTrafficRoute&&e.actions.push({icon:"mdi-download-network-outline",label:"View traffic",classes:"",mode:N["b"],type:"traffic"}),e},actions(){return[{label:"Intervals",icon:"mdi-set-center",handler:()=>this.moveToIntervals(this.active,null),condition:!!this.tasksByDevice.length},{label:"Traffic",icon:"mdi-download-network-outline",handler:this.trafficViewHandler,condition:this.needTrafficRoute&&this.$q.platform.is.mobile},{label:"Map",icon:"mdi-map",handler:()=>this.showWidgetTrack(this.trackByMessages),condition:!!this.trackByMessages.length},{label:"TrackIt",icon:"mdi-map-marker-path",handler:()=>this.goToTrackit(),condition:!!this.trackByMessages.length},{label:"Clear",icon:"mdi-playlist-remove",handler:this.clearHandler,condition:this.hasMessages||this.hasLogs}]},panelsWidgetsStyle(){const e={},t={track:this.isWidgetsTrackActive,data:this.isWidgetsMessageActive||this.isWidgetsLogsActive},s=this.widgetStyle.left&&this.widgetStyle.right&&t.track&&t.data,i=this.widgetStyle.left&&t[this.widgetStyle.left],a=this.widgetStyle.right&&t[this.widgetStyle.right];return s?(e.maxWidth="calc(100% - 600px)",e.left="300px"):(i||a)&&(e.maxWidth="calc(100% - 300px)",a&&(e.left="300px")),e},ratio(){return b()(this.settings.viewSettings,`${this.entityName}.ratio`,50)}},methods:{...Object(P["b"])(["getDeleted"]),clearHandler(){this.$q.dialog({title:"Confirm",message:"Do you really want to clear all data from the panes?",ok:!0,cancel:!0,noRouteDismiss:!0}).onOk((()=>{this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`),this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`),this.isWidgetsLogsActive?(this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler()):this.isWidgetsMessageActive&&(this.isWidgetsMessageActive=!1,this.closeMessageWidgetsHandler())})).onCancel((()=>{}))},async getDeletedHandler(){await this.getDeleted(this.entityName),this.needShowGetDeletedAction=!1,this.$refs.itemSelect.reset()},clearActive(){this.updateActive(null)},updateActive(e){this.updateRoute({name:this.entityName,params:{id:e}},!this.active)},deletedHandler(){this.changeRatioHandler(100)},trafficViewHandler(){this.$router.push(`/tools/device-traffic/${this.active}`).catch((e=>e))},toErrorTrafficHandler({content:e}){const t={tcp:2,udp:130};let s,i=e["server.timestamp"]||e.timestamp,a=i+1,o=a-10;e.error_text&&e.traffic&&(i=e.traffic.timestamp,o=i,a=e.timestamp,s={...e.traffic,text:e.error_text}),this.$connector.gw.getDevicesPackets(this.active,{data:{from:o,to:a,filter:`type=${t[e.transport]}`}}).then((t=>{const i=b()(t,"data.result",[]),a=i.map((e=>e.data));a?this.$q.dialog({component:j["a"],parent:this,data:a,error:s,noRouteDismiss:!0}).onOk((()=>{this.toTrafficHandler({content:e})})).onCancel((()=>{})):this.$q.notify({message:"Traffic is empty",type:"negative"})}))},toTrafficHandler({content:e}){const t=e["server.timestamp"]||e.timestamp,s=t+1,i=s-10,a=t,o={to:s,from:i,highlight:a};this.$router.push({path:`/tools/device-traffic/${this.active}`,query:o}).catch((e=>e))},init(){const e=this.entityName,t=b()(this.settings,`entities[${e}]`,void 0);let s=this.$route.params&&this.$route.params.id?Number(this.$route.params.id):null;const i=this.$route.query.view_mode;let a=50;i&&(a=Q[i],this.$emit("update:settings",{type:"ENTITY_VIEW_SETTINGS_CHANGE",opt:{entity:this.entityName},value:{ratio:a}})),this.isInit=!0;let o=null;s&&this.itemsCollection[s]?o=s:t&&this.itemsCollection[t]?o=t:(s&&!this.itemsCollection[s]||t&&!this.itemsCollection[t])&&this.clearActive(),this.selectedItem&&this.selectedItem.deleted&&this.deletedHandler(),o&&(this.active=o,this.updateRoute({name:this.entityName,params:{id:o},query:{view_mode:B[a]}},!0)),this.$emit("inited")},moveToIntervals(e,t){this.$nextTick((()=>{this.$router.push({name:"intervals",params:{deviceId:e,calcId:t},query:{noselect:"devices"}}).catch((e=>e))}))},clearWidgetsState(){this.isWidgetsMessageActive=!1,this.isWidgetsLogsActive=!1,this.isWidgetsTrackActive=!1,this.activeWidgetWindow=void 0,this.widgetsViewedMessage=null,this.widgetsViewedLog=null},beforeEnableWidgetByPane(e){switch(this.widgetStyle.left||this.isWidgetsMessageActive||this.isWidgetsLogsActive||this.widgetsViewModel.data||this.$nextTick((()=>this.widgetsChangeViewModelHandler(this.entityName,"data",{type:"minimized",to:"left"}))),e){case"messages":this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler();break;case"logs":this.isWidgetsMessageActive=!1,this.closeMessageWidgetsHandler();break}},onResizePage(e){this.$refs.track.resize(e),this.$refs.messagesView.resize(e),this.$refs.logsView.resize(e)},updateRatio(e){this.updateRoute({query:{view_mode:B[e]}})},changeRatioHandler(e){this.ratioWidgetsModify(e),this.$emit("update:settings",{type:"ENTITY_VIEW_SETTINGS_CHANGE",opt:{entity:this.entityName},value:{ratio:e}}),this.$nextTick((()=>{+this.size[0]&&this.active&&this.$refs.logs.resetParams(),+this.size[1]&&this.active&&this.$refs.messages.resetParams()}))},goToTrackit(){const e=this.config&&this.config.messages&&this.$store.state[this.config.messages.vuexModuleName],t=Math.floor(e.from/1e3),s=Math.floor(e.to/1e3);Object(O["a"])(`${this.$flespiServer}/trackit/#/login/${this.$store.state.token}/devices/${this.active}?from=${t}&to=${s}`)}},watch:{$route(e){e.params&&e.params.id?this.itemsCollection[Number(e.params.id)]?this.active=Number(e.params.id):this.isInit&&(this.active=null):e.params&&!e.params.id&&(this.active=null),this.processRoute({view_mode:e=>this.changeRatioHandler(Q[e])},e)},active(e,t){const s=this.itemsCollection[e]||{};e&&this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:this.entityName},value:s.id}),s.deleted&&this.deletedHandler()}},components:{logs:o["a"],messages:_,Widgets:V["a"],EntitiesToolbar:E["a"]}},G=F,J=(s("e950"),s("9989")),Y=s("3980"),U=s("ddd8"),Z=s("27f9"),K=s("0016"),X=s("9c40"),ee=s("66e5"),te=s("4074"),se=s("0170"),ie=s("8572"),ae=s("eebe"),oe=s.n(ae),ne=Object(v["a"])(G,i,a,!1,null,"1daf731e",null);t["default"]=ne.exports;oe()(ne,"components",{QPage:J["a"],QResizeObserver:Y["a"],QSelect:U["a"],QInput:Z["a"],QIcon:K["a"],QBtn:X["a"],QItem:ee["a"],QItemSection:te["a"],QItemLabel:se["a"],QField:ie["a"]})},cc5e:function(e,t,s){},e950:function(e,t,s){"use strict";s("ed2f")},ed2f:function(e,t,s){}}]);