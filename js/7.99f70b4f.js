(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{2985:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",[s("q-resize-observer",{on:{resize:e.onResizePage}}),s("entities-toolbar",{attrs:{item:e.selectedItem,ratio:e.ratio,actions:e.actions},on:{"change-ratio":e.changeRatioHandler}},[s("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[s("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,"hide-dropdown-icon":!e.isNeedSelect,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,label:e.active?"Channel":"SELECT CHANNEL",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect,"popup-content-class":"items__popup","popup-content-style":{height:60*(e.filteredItems.length>6?6:e.filteredItems.length)+(e.needShowGetDeletedAction&&1===e.tokenType?77:48)+"px"}},on:{filter:function(t,s){return e.filterItems(e.entityName,t,s)}},scopedSlots:e._u([{key:"no-option",fn:function(){return[s("div",[s("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),s("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(t){return[e.selectedItem?s("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",staticStyle:{"max-width":"170px"},attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(e.selectedItem.uri||"<no uri>"))])])],1),s("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?s("q-item-label",{staticClass:"q-pa-none text-right"},[s("small",{staticClass:"cheap-modifier"},[e._v("DELETED")])]):e._e(),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[s("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},e.filteredItems.length?{key:"option",fn:function(t){return[s("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":t.opt.deleted},attrs:{clickable:""},on:{click:function(s){e.active=t.opt.id}}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(t.opt.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(e.protocols&&e.protocols[t.opt.protocol_id]&&e.protocols[t.opt.protocol_id].name||"<no protocol>"))])]),s("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(t.opt.uri||"<no uri>"))])])],1),s("q-item-section",{attrs:{side:""}},[t.opt.deleted?s("q-item-label",{staticClass:"q-pa-xs text-right"},[s("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[s("small",[e._v("#"+e._s(t.opt.id))])])],1)],1)]}}:null],null,!0)},[s("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[s("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1),e.needShowGetDeletedAction&&1===e.tokenType?s("div",{staticClass:"select__get-deleted",attrs:{slot:"after-options"},slot:"after-options"},[s("q-btn",{staticClass:"deleted-action",attrs:{icon:"mdi-download"},on:{click:function(t){return t.preventDefault(),t.stopPropagation(),e.getDeletedHandler.apply(null,arguments)}}},[e._v("see deleted")])],1):e._e()]),e.$q.platform.is.desktop&&e.selectedItem&&!e.selectedItem.deleted?s("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[e.selectedItem.protocol_id===e.proxyProtocolId?s("q-btn",{staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"50px"},attrs:{title:"View hex payload",flat:"",dense:""},on:{click:e.hexViewHandler}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-matrix"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("HEX")])],1):e.isTrafficViewerSupported?s("q-btn",{staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"50px"},attrs:{title:"Traffic hex payload",flat:"",dense:""},on:{click:e.trafficViewHandler}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-download-network-outline"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Traffic")])],1):e._e()],1):e._e()],1)]),e.isInit&&e.active?s("div",[+e.size[0]?s("logs",{ref:"logs",style:Object.assign({},{height:"calc("+e.size[0]+"vh - "+(+e.size[1]?e.isVisibleToolbar?"50px":"25px":e.isVisibleToolbar?"100px":"50px")+")",position:"relative"},e.panelsWidgetsStyle),attrs:{item:e.selectedItem,limit:e.limit,isEnabled:!!+e.size[0],originPattern:"gw/channels/:id","entity-name":e.entityName,config:e.logsConfig},on:{"view-log-message":e.viewWidgetsLogHandler,"action-select":function(t){return e.widgetsViewedLog=t.content},"to-traffic":e.toTrafficHandler}}):e._e(),+e.size[1]?s("messages",{ref:"messages",style:Object.assign({},{height:"calc("+e.size[1]+"vh - "+(+e.size[0]?e.isVisibleToolbar?"50px":"25px":e.isVisibleToolbar?"100px":"50px")+")",position:"relative"},e.panelsWidgetsStyle),attrs:{item:e.selectedItem,activeId:e.active,needRestoreSettings:e.needRestoreSettings,isEnabled:!!+e.size[1],limit:e.limit,config:e.messagesConfig},on:{"action-view-data":function(t){return e.messageWidgetsActions("object",t)},"action-map":function(t){return e.messageWidgetsActions("position",t)},"action-traffic":function(t){return e.messageWidgetsActions("traffic",t)},"action-hex":function(t){return e.messageWidgetsActions("hex",t)},"action-show":function(t){return e.messageWidgetsActions("show",t)},"action-image":function(t){return e.messageWidgetsActions("image",t)},"action-select":function(t){return e.messageWidgetsActions("select",t)}}}):e._e()],1):e._e(),!e.items.length&&e.isItemsInit?s("div",{staticClass:"text-center text-grey-3 q-mt-lg"},[s("div",{staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Channels not found"))]),!e.isLoading&&e.needShowGetDeletedAction&&1===e.tokenType?s("q-btn",{staticClass:"q-mt-sm",attrs:{icon:"mdi-download",label:"see deleted"},on:{click:e.getDeletedHandler}}):e._e()],1):e._e(),s("widgets",{ref:"messagesView",attrs:{active:"messagesView"===e.activeWidgetWindow,config:e.messageWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.data},on:{"change-view-model":function(t){return e.widgetsChangeViewModelHandler(e.entityName,"data",t)},active:function(t){return e.activateWidgetWindow("messagesView")},close:e.closeMessageWidgetsHandler,next:e.nextWidgetsMessage,prev:e.prevWidgetsMessage},model:{value:e.isWidgetsMessageActive,callback:function(t){e.isWidgetsMessageActive=t},expression:"isWidgetsMessageActive"}}),s("widgets",{ref:"logsView",attrs:{active:"logsView"===e.activeWidgetWindow,config:e.logsWidgetsViewConfig,actions:e.widgetsHandleActions,controls:e.widgetWindowControls,"view-model":e.widgetsViewModel.data},on:{"change-view-model":function(t){return e.widgetsChangeViewModelHandler(e.entityName,"data",t)},active:function(t){return e.activateWidgetWindow("logsView")},close:e.closeLogsWidgetsHandler,next:e.nextWidgetLog,prev:e.prevWidgetLog},model:{value:e.isWidgetsLogsActive,callback:function(t){e.isWidgetsLogsActive=t},expression:"isWidgetsLogsActive"}})],1)},o=[],a=s("ded3"),n=s.n(a),l=(s("13d5"),s("4e82"),s("2ce0")),r=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("virtual-scroll-list",{ref:"scrollList",attrs:{cols:e.cols,actions:e.config.actions,panelActions:e.panelActions,items:e.messages,dateRange:e.dateRange,viewConfig:e.config.viewConfig,filter:e.filter,theme:e.config.theme,title:"Messages",loading:e.loadingFlag,autoscroll:e.needAutoscroll,scrollOffset:"10%",i18n:e.i18n,item:e.listItem,itemprops:e.getItemsProps,"has-new-messages":e.hasNewMessages},on:{action:e.actionHandler,"change-filter":e.filterChangeHandler,"scroll-top":e.paginationPrevChangeHandler,"scroll-bottom":e.paginationNextChangeHandler,"change-date-range":e.dateRangeChangeHandler,"update-cols":e.updateColsHandler,"action-to-bottom":e.actionToBottomHandler,"action-to-new-messages":e.actionToNewMessages,"action-to-new-messages-hide":e.actionToNewMessagesHide}},[s("empty-pane",{attrs:{slot:"empty",config:e.config.emptyState},slot:"empty"})],1)],1)},c=[],d=(s("26e9"),s("ddb0"),s("de45")),m=s("2b0e"),h=s("cdde"),g=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{style:{height:e.itemHeight+"px",width:e.rowWidth+"px"},on:{click:function(t){return e.itemClickHandler(e.index,e.clearItem,t)}}},[s("div",{staticClass:"cursor-pointer",class:[e.item["x-flespi-status"]?"missed-items":"",e.selected?"bg-white-opasity":e.highlightLevel?"text-"+e.highlightType+"-"+e.highlightLevel:""],style:{height:e.itemHeight+"px",width:e.rowWidth+"px",color:e.selected?"#333":""}},[e._l(e.cols,(function(t,i){var o,a;return["etc"===t.__dest?s("span",{key:t.name+i,staticClass:"list__item item_etc",class:(o={},o["item_"+i]=!0,o["item--active"]=e.menuCellActive&&e.menuCellActive.row===e.index&&e.menuCellActive.col===i,o)},[e._v(e._s(e.values.etc.value||"*Empty*"))]):s("span",{key:t.name+i,staticClass:"list__item",class:(a={},a["item_"+i]=!0,a["item--active"]=e.menuCellActive&&e.menuCellActive.row===e.index&&e.menuCellActive.col===i,a),attrs:{title:e.values[t.name].value}},[e._v("\n        "+e._s(e.values[t.name].value)+"\n      ")])]}))],2)])},u=[],p=s("bd4c"),f={props:["item","index","actions","cols","itemHeight","etcVisible","rowWidth","actionsVisible","selected","menuCellActive"],data(){let e=0,t="";return this.item.timestamp<this.item["server.timestamp"]-1800?(t="grey",e=7):this.item.timestamp<this.item["server.timestamp"]-600?(t="grey",e=6):this.item.timestamp<this.item["server.timestamp"]-120?(t="grey",e=5):this.item.timestamp-1800>this.item["server.timestamp"]?(t="orange",e=10):this.item.timestamp-60>this.item["server.timestamp"]?(t="orange",e=7):this.item.timestamp-1>this.item["server.timestamp"]&&(t="orange",e=4),{highlightType:t,highlightLevel:e,date:p["a"]}},computed:{values(){let e={};return e=this.cols.length?this.cols.reduce(((e,t,s,i)=>(e[t.name]={value:this.getValueOfProp(t,this.item)},s===i.length-1&&(e.etc={value:""}),e)),{}):{etc:{value:""}},Object.keys(this.item).forEach((t=>{if(!e[t]){if(-1!==t.indexOf("x-flespi"))return!1;-1!==t.indexOf("image.bin.")?e.etc.value+=`${t}: <binary image>`:e.etc.value+=`${t}: ${JSON.stringify(this.item[t])}; `}})),e},clearItem(){return Object.keys(this.item).reduce(((e,t)=>(-1!==t.indexOf("x-flespi")||(e[t]=this.item[t]),e)),{})}},methods:{clickHandler(e,t,s){this.$emit("action",{index:e,type:t,content:s})},itemClickHandler(e,t,s){this.$emit("item-click",{index:e,content:t,event:s})},getValueOfProp(e,t){const s=e.name;let i=t[s];return-1!==s.indexOf("image.bin.")?i="<binary image>":-1!==s.indexOf("proxy.event")?i=0===i?"data received":1===i?"connected":"disconnect":-1!==s.indexOf("proxy.source")?i=0===i?"channel incoming connection":`target ${i}`:s.match(/timestamp$/)&&(i=p["a"].formatDate(1e3*i,"DD/MM/YYYY HH:mm:ss")),"string"!==typeof i&&(i=JSON.stringify(i)),i}}},v=f,w=(s("5e23"),s("2877")),$=Object(w["a"])(v,g,u,!1,null,"281f821c",null),x=$.exports,y=s("121a"),b=s("9b02"),N=s.n(b),C=s("0463"),_={props:["item","activeId","limit","config","needRestoreSettings"],data(){return{listItem:x,moduleName:this.config.vuexModuleName,autoscroll:!0,i18n:{"Columns by schema":"Columns by protocol"}}},computed:{messages:{get(){const e=this.$store.state[this.moduleName].messages;return this.scrollControlling(e.length),e},set(e){this.$store.commit(`${this.moduleName}/setMessages`,e)}},panelActions(){return[{label:"Export CSV",icon:"mdi-file-document-outline",handler:()=>this.exportCsv({filter:`${this.filter}`,from:this.from/1e3,to:this.to/1e3},{from:this.from,to:this.to}),condition:this.messages.length,tooltip:"Save messages to CSV",async:this.isFileCsvLoading}]},active:{get(){return this.$store.state[this.moduleName].active},async set(e){await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.$store.commit(`${this.moduleName}/setActive`,e);const t=this.$store.state.channels[e]||{};this.$set(this.config.viewConfig,"needShowEtc",t.protocol_name&&("http"===t.protocol_name||"mqtt"===t.protocol_name)),this.$store.commit(`${this.moduleName}/clearMessages`),await this.$store.dispatch(`${this.moduleName}/getCols`,{etc:!1}),await this.$store.dispatch(`${this.moduleName}/initTime`),await this.getMessages()}},cols:{get(){return this.$store.state[this.moduleName].cols},set(e){this.$store.commit(`${this.moduleName}/updateCols`,e)}},filter:{get(){return this.$store.state[this.moduleName].filter},set(e){e=e||"",this.$store.commit(`${this.moduleName}/setFilter`,e)}},from:{get(){return this.$store.state[this.moduleName].from},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setFrom`,e)}},to:{get(){return this.$store.state[this.moduleName].to},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setTo`,e)}},dateRange(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},reverse:{get(){return this.$store.state[this.moduleName].reverse||!1},set(e){this.$store.commit(`${this.moduleName}/setReverse`,e)}},realtimeEnabled(){return this.$store.state[this.moduleName].realtimeEnabled},hasNewMessages:{get(){return this.$store.state[this.moduleName].hasNewMessages},set(e){this.$store.state[this.moduleName].hasNewMessages=e}},currentLimit:{get(){return this.$store.state[this.moduleName].limit},set(e){e=e||1e3,this.$store.commit(`${this.moduleName}/setLimit`,e)}},selected:{get(){return this.$store.state[this.moduleName].selected},set(e){e&&e.length&&(this.autoscroll=!1),this.$store.commit(`${this.moduleName}/setSelected`,e)}},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)},needAutoscroll(){return this.realtimeEnabled&&!this.selected.length&&this.autoscroll}},methods:{getItemsProps(e,t){const s=this.messages[e];t.key=s["x-flespi-message-key"],t.props.etcVisible=this.etcVisible,t.props.actionsVisible=this.actionsVisible,t.props.selected=this.selected.includes(e),s["position.latitude"]&&s["position.longitude"]&&(t.props.actions=[...t.props.actions,{icon:"mdi-map",label:"Show on map",classes:"",type:"map"}]),Object.keys(s).some((e=>{const i=s[e]&&(s[e].toString().match(/^data:image\/(?:gif|png|jpeg|bmp|webp)(?:;charset=utf-8)?;base64,(?:[A-Za-z0-9]|[+/])+={0,2}/)||0===e.indexOf("image.bin."));return i&&(t.props.actions=[...t.props.actions,{icon:"mdi-image-outline",label:"Show image",classes:"",type:"image"}]),i})),t.on||(t.on={}),t.on.action=this.actionHandler,t.on["item-click"]=this.viewMessagesHandler,t.dataHandler=(e,t,s)=>(this.autoscroll=!1,this.listItem.methods.getValueOfProp(e.data,t.data))},async getMessages(){this.to<=Date.now()?await this.$store.dispatch(`${this.moduleName}/get`):(await this.$store.dispatch(`${this.moduleName}/getHistory`,1e3),this.scrollTo(this.messages.length-1))},scrollTo(e){this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollTo(e)))},scrollToWithSavePadding(e){this.$nextTick((()=>this.$refs.scrollList&&this.$refs.scrollList.scrollToWithSavePadding(e)))},resetParams(){this.$refs.scrollList.resetParams()},filterChangeHandler(e){this.filter!==e&&(this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.filter=e,this.$store.commit(`${this.moduleName}/clearMessages`),this.getMessages())},updateColsHandler(e){this.cols=e},dateRangeChangeHandler(e){const t=e[0],s=e[1];if(this.from===t&&this.to===s)return!1;this.from=t,this.to=s,this.$store.commit(`${this.moduleName}/clearMessages`),this.$store.dispatch(`${this.moduleName}/get`).then((()=>this.scrollTo(0)))},paginationPrevChangeHandler(){this.$store.dispatch(`${this.moduleName}/getPrevPage`).then((e=>{e&&"number"===typeof e&&this.scrollToWithSavePadding(e)}))},paginationNextChangeHandler(){this.$store.dispatch(`${this.moduleName}/getNextPage`).then((e=>{this.autoscroll=!0,e&&"number"===typeof e&&this.scrollTo(this.messages.length-e)}))},actionHandler({index:e,type:t,content:s}){switch(this.selected=[e],t){case"view":this.viewMessagesHandler({index:e,content:s});break;case"copy":this.copyMessageHandler({index:e,content:s});break;default:this.$emit(`action-${t}`,{index:e,content:s});break}},actionToBottomHandler(){this.realtimeEnabled?(this.autoscroll=!0,this.scrollTo(this.messages.length-1)):this.$store.dispatch(`${this.moduleName}/getHistory`,1e3).then((()=>{this.scrollTo(this.messages.length-1)}))},async actionToNewMessages(){this.hasNewMessages=null;const e=Date.now(),t=new Date(e).setHours(0,0,0,0),s=t+86399999;this.from=t,this.to=s,this.$store.commit(`${this.moduleName}/clearMessages`),this.getMessages()},actionToNewMessagesHide(){this.hasNewMessages=null},viewMessagesHandler({index:e,content:t}){this.selected=[e],this.$emit("action-view-data",{index:e,content:t})},copyMessageHandler({index:e,content:t}){Object(h["a"])(JSON.stringify(t)).then((e=>{this.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(e=>{this.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},clearMessage(e){return Object.keys(e).reduce(((t,s)=>(-1!==s.indexOf("x-flespi")||(t[s]=e[s]),t)),{})},unselect(){this.selected.length&&(this.selected=[])},nextSelect(){if(this.selected.length){const e=this.selected.slice(-1)[0],t=e+1,s=this.messages[t];s&&(this.selected=[t],this.$emit("action-select",{index:t,content:this.clearMessage(s)}),this.scrollTo(t))}},prevSelect(){if(this.selected.length){const e=this.selected[0],t=e-1,s=this.messages[t];s&&(this.selected=[t],this.$emit("action-select",{index:t,content:this.clearMessage(s)}),this.scrollTo(t))}},scrollControlling(e){this.selected.length&&this.selected[0]+1e3<=e&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`)},async init(){this.$store.state[this.moduleName]?this.$store.commit(`${this.moduleName}/clear`):this.$store.registerModule(this.moduleName,Object(d["c"])({Vue:m["default"],LocalStorage:this.$q.localStorage,name:{name:this.moduleName,lsNamespace:"flespi-toolbox-settings.cols"},errorHandler:e=>{this.$store.commit("reqFailed",e)}})),this.currentLimit=this.limit;let e=N()(this.$store.state.sessionSettings,"savedFilter","");if(e&&(this.needRestoreSettings&&(e=N()(e,`channels.${this.activeId}`,""),this.filter=e),this.$store.commit("setToolboxSessionSettings",{savedFilter:void 0})),this.activeId){let e=Math.floor(1e3*this.$route.query.from),s=Math.floor(1e3*this.$route.query.to),i=this.$route.query.messages;if(i)try{i=JSON.parse(i),i.filter&&(this.filter=i.filter),i.from&&i.to&&(e=Math.floor(1e3*i.from),s=Math.floor(1e3*i.to))}catch(t){}this.$store.commit(`${this.moduleName}/setActive`,this.activeId);const o=this.$store.state.channels[this.activeId]||{};this.$set(this.config.viewConfig,"needShowEtc",o.protocol_name&&("http"===o.protocol_name||"mqtt"===o.protocol_name)),await this.$store.dispatch(`${this.moduleName}/getCols`,{etc:!0}),e&&s?(this.from=e,this.to=s,await this.getMessages()):(await this.$store.dispatch(`${this.moduleName}/initTime`),await this.getMessages())}}},watch:{activeId(e){this.active=e},limit(e){this.currentLimit=e}},created(){this.init(),this.offlineHandler=m["default"].connector.socket.on("offline",(()=>{this.$store.commit(`${this.moduleName}/setOffline`)})),this.connectHandler=m["default"].connector.socket.on("connect",(()=>{this.$store.state[this.moduleName].offline&&(this.$store.commit(`${this.moduleName}/setReconnected`),this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/getMissedMessages`),this.$store.commit(`${this.moduleName}/clearOfflineState`))}))},beforeDestroy(){this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),void 0!==this.offlineHandler&&m["default"].connector.socket.off("offline",this.offlineHandler),void 0!==this.connectHandler&&m["default"].connector.socket.off("connect",this.connectHandler),this.$store.commit(`${this.moduleName}/clear`)},mixins:[C["a"]],components:{VirtualScrollList:d["b"],EmptyPane:y["a"]}},S=_,M=Object(w["a"])(S,r,c,!1,null,null,null),H=M.exports,I=s("df1d"),q=s("4596"),W=s("6512"),T=s("5c16"),k=s("2f62"),V=s("a99a"),A=s("286e"),E=s("0644"),L=s.n(E),O={props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[A["a"],I["a"],q["a"],W["a"]],data(){return{entityName:"channels",filter:"",active:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,needShowGetDeletedAction:!0,needRestoreSettings:!1}},computed:n()(n()({},Object(k["d"])({isEmptyMessages(e){return this.config.messages&&e[this.config.messages.vuexModuleName]&&!e[this.config.messages.vuexModuleName].messages.length&&100!==this.ratio},isEmptyData(e){const t=this.isEmptyMessages,s=this.config.logs&&e[this.config.logs.vuexModuleName]&&e[this.config.logs.vuexModuleName].messages&&!e[this.config.logs.vuexModuleName].messages.length&&0!==this.ratio;return t&&s},tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},protocols(e){return e.channelsProtocols},itemsCollection(e){return e.channels||{}},proxyProtocolId(e){const t=e.channelsProtocols;return Object.keys(t).reduce(((e,s)=>("proxy"===t[s].name&&(e=parseInt(s)),e)),0)},protocolFeatures(){const e=this.protocols;if(!this.selectedItem)return{};const t=this.selectedItem.protocol_id,s=e[t];return s.features},isTrafficViewerSupported(e){const t=N()(e.config,"trafficViewer.isDrawable",!1);return this.protocolFeatures.raw_packets&&t}})),{},{logsConfig(){const e=this.config.logs;return this.isTrafficViewerSupported?e.itemSettings.needTrafficRoute=!0:e.itemSettings.needTrafficRoute=!1,e},messagesConfig(){const e=L()(this.config.messages);return this.selectedItem&&this.selectedItem.protocol_id===this.proxyProtocolId?e.actions.push({icon:"mdi-matrix",label:"View in hex",classes:"",type:"hex"}):this.isTrafficViewerSupported&&e.actions.push({icon:"mdi-download-network-outline",label:"View traffic",classes:"",type:"traffic"}),e},items(){return Object.values(this.itemsCollection)},filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const s=e.name.toLowerCase(),i=t.name.toLowerCase();return s<i?-1:1})),t},size(){return[this.ratio,100-this.ratio]},selectedItem(){const e=this.itemsCollection[this.active]||null;return e&&e.deleted&&this.deletedHandler(),e},actions(){return[{label:"Hex",icon:"mdi-matrix",handler:this.hexViewHandler,condition:this.selectedItem&&this.selectedItem.protocol_id===this.proxyProtocolId&&this.$q.platform.is.mobile},{label:"Traffic",icon:"mdi-download-network-outline",handler:this.trafficViewHandler,condition:this.isTrafficViewerSupported&&this.$q.platform.is.mobile},{label:"Clear",icon:"mdi-playlist-remove",handler:this.clearHandler,condition:!this.isEmptyData}]},panelsWidgetsStyle(){const e={},t=this.isWidgetsMessageActive||this.isWidgetsLogsActive,s=this.widgetStyle.left&&this.widgetStyle.right&&t,i=this.widgetStyle.left&&t,o=this.widgetStyle.right&&t;return s?(e.maxWidth="calc(100% - 600px)",e.left="300px"):(i||o)&&(e.maxWidth="calc(100% - 300px)",o&&(e.left="300px")),e},ratio(){return N()(this.settings.viewSettings,`${this.entityName}.ratio`,50)}}),methods:n()(n()({},Object(k["b"])(["getDeleted"])),{},{hexViewHandler(){this.$router.push(`/tools/hex/${this.active}`).catch((e=>e)),this.saveSessionMessageFilter()},trafficViewHandler(){this.$router.push(`/tools/traffic/${this.active}`).catch((e=>e)),this.saveSessionMessageFilter()},toHexHandler({content:e}){const t=e.ident,s=e.timestamp,i=s+1,o=i-10;t&&this.$router.push({path:`/tools/hex/${this.active}/ident/${t}`,query:{from:o,to:i,highlight:s}}).catch((e=>e)),this.saveSessionMessageFilter()},toTrafficHandler({content:e}){const t=this.protocolFeatures.shared_connection||!e.ident?"unidentified":e.ident,s=e["server.timestamp"]||e.timestamp,i=s+1,o=i-10;t&&this.$router.push({path:`/tools/traffic/${this.active}/ident/${t}`,query:{from:o,to:i,highlight:s}}).catch((e=>e)),this.saveSessionMessageFilter()},saveSessionMessageFilter(){const e=N()(this.$store.state,`${this.config.messages.vuexModuleName}.filter`,"");e&&this.$store.commit("setToolboxSessionSettings",{savedFilter:{[this.entityName]:{[this.active]:e}}})},clearHandler(){this.$q.dialog({title:"Confirm",message:"Do you really want to clear all data from the panes?",ok:!0,cancel:!0}).onOk((()=>{this.$store.commit(`${this.config.messages.vuexModuleName}/clearMessages`),this.$store.commit(`${this.config.logs.vuexModuleName}/clearMessages`),this.isWidgetsLogsActive?(this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler()):this.isWidgetsMessageActive&&(this.isWidgetsMessageActive=!1,this.closeMessageWidgetsHandler())})).onCancel((()=>{}))},selectReset(){this.$refs.itemSelect&&this.$refs.itemSelect.reset()},async getDeletedHandler(){await this.getDeleted(this.entityName),this.needShowGetDeletedAction=!1,this.selectReset()},clearActive(){this.active=null},deletedHandler(){this.changeRatioHandler(100)},init(){const e=this.entityName,t=N()(this.settings,`entities[${e}]`,void 0),s=this.$route.params&&this.$route.params.id?Number(this.$route.params.id):null,i=this.$route.query.view_mode;if(i){let e=50;"messages"===i?e=0:"logs"===i&&(e=100),this.$emit("update:settings",{type:"ENTITY_VIEW_SETTINGS_CHANGE",opt:{entity:this.entityName},value:{ratio:e}})}this.isInit=!0,s?this.itemsCollection[s]?this.active=s:this.active=null:t&&this.itemsCollection[t]&&(this.active=t),this.selectedItem&&this.selectedItem.deleted&&this.deletedHandler(),this.$emit("inited")},clearWidgetsState(){this.isWidgetsMessageActive=!1,this.isWidgetsLogsActive=!1,this.activeWidgetWindow=void 0,this.widgetsViewedMessage=null,this.widgetsViewedLog=null},beforeEnableWidgetByPane(e){switch(this.widgetStyle.left||this.isWidgetsMessageActive||this.isWidgetsLogsActive||this.widgetsViewModel.data||this.$nextTick((()=>this.widgetsChangeViewModelHandler(this.entityName,"data",{type:"minimized",to:"left"}))),e){case"messages":this.isWidgetsLogsActive=!1,this.closeLogsWidgetsHandler();break;case"logs":this.isWidgetsMessageActive=!1,this.closeMessageWidgetsHandler();break}},onResizePage(e){this.$refs.messagesView.resize(e),this.$refs.logsView.resize(e)},changeRatioHandler(e){this.ratioWidgetsModify(e),this.$emit("update:settings",{type:"ENTITY_VIEW_SETTINGS_CHANGE",opt:{entity:this.entityName},value:{ratio:e}}),this.$nextTick((()=>{+this.size[0]&&this.active&&this.$refs.logs.resetParams(),+this.size[1]&&this.active&&this.$refs.messages.resetParams()}))}}),beforeRouteEnter(e,t,s){s((e=>{"trafficViewer"!==t.meta.moduleName&&"hexViewer"!==t.meta.moduleName||(e.needRestoreSettings=!0)}))},watch:{$route(e){if(e.params&&e.params.id){const t=Number(e.params.id);this.itemsCollection[t]?this.active=Number(e.params.id):this.isInit&&(this.active=null)}else e.params&&!e.params.id&&(this.active=null);this.clearWidgetsState()},active(e){const t=this.itemsCollection[e]||{};e?(this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:this.entityName},value:t.id}),this.$router.push(`/channels/${e}`).catch((e=>e))):this.$router.push("/channels").catch((e=>e)),t.deleted&&this.deletedHandler()}},components:{logs:l["a"],messages:H,EntitiesToolbar:V["a"],Widgets:T["a"]}},P=O,D=(s("9cb2"),s("9989")),z=s("3980"),R=s("ddd8"),F=s("27f9"),j=s("0016"),G=s("9c40"),Q=s("66e5"),Y=s("4074"),J=s("0170"),B=s("8572"),U=s("eebe"),X=s.n(U),Z=Object(w["a"])(P,i,o,!1,null,"4df64753",null);t["default"]=Z.exports;X()(Z,"components",{QPage:D["a"],QResizeObserver:z["a"],QSelect:R["a"],QInput:F["a"],QIcon:j["a"],QBtn:G["a"],QItem:Q["a"],QItemSection:Y["a"],QItemLabel:J["a"],QField:B["a"]})},"5e23":function(e,t,s){"use strict";s("7e51")},"7e51":function(e,t,s){},"9cb2":function(e,t,s){"use strict";s("ef8c")},ef8c:function(e,t,s){}}]);