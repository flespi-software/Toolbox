(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[3],{"027e":function(e,t,s){"use strict";s("38e6")},"0472":function(e,t,s){"use strict";s("f93b")},"1a0c":function(e,t,s){},"1ce6":function(e,t,s){},"38e6":function(e,t,s){},"3af2":function(e,t,s){"use strict";s("1ce6")},"56bd":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",[s("entities-toolbar",{attrs:{item:e.selectedItem}},[s("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[s("div",{staticStyle:{display:"inline-flex"}},[s("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,label:e.active?"Channel":"SELECT CHANNEL",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect,"hide-dropdown-icon":!e.isNeedSelect,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+48+"px"}},on:{filter:function(t,s){return e.filterItems("channels",t,s)}},scopedSlots:e._u([{key:"no-option",fn:function(){return[s("div",[s("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),s("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(t){return[e.selectedItem?s("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(e.selectedItem.uri||"<no uri>"))])])],1),s("q-item-section",{staticClass:"text-white",attrs:{side:""}},[s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[s("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},e.filteredItems.length?{key:"option",fn:function(t){return[s("q-item",e._g(e._b({staticClass:"q-pa-xs",attrs:{clickable:""},on:{click:function(s){e.active=t.opt.id}}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(t.opt.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(t.opt.uri||"<no uri>"))])])],1),s("q-item-section",{attrs:{side:""}},[s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[s("small",[e._v("#"+e._s(t.opt.id))])])],1)],1)]}}:null],null,!0)},[s("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[s("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1)])],1),s("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[e.active?s("q-btn",{staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"60px"},attrs:{title:"View channels",flat:"",dense:""},on:{click:e.viewLogsHandler}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"merge_type"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Channels")])],1):e._e()],1)],1)]),e.active?s("hex-viewer",{staticClass:"flex",attrs:{active:e.active,"active-device":e.activeDevice,isVisibleToolbar:e.isVisibleToolbar,config:e.config},on:{"change-active-device":e.changeActiveDeviceHandler}}):e._e(),!e.items.length&&e.isItemsInit?s("div",{staticClass:"text-center text-grey-3 q-mt-lg",staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Proxy channels not found"))]):e._e()],1)},n=[],o=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("messages",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&!e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"}],ref:"messages",style:{height:"calc(100vh - "+(e.isVisibleToolbar?"100px":"50px")+")",position:"relative",width:e.$q.platform.is.desktop?"25%":"100%",minWidth:"180px"},attrs:{activeId:e.active,limit:0,config:e.config.messages,connection:e.activeConnection,type:e.activeConnection?"messages":"connections",view:e.typeOfHexView},on:{"view-data":function(t){e.selectedMessages=t},"change:connection":e.changeConnectionHandler,close:e.closeHandler,"connection:preview":function(t){return e.connectionPreview=t},"connection:preview-hide":function(t){return e.connectionPreview=null},"connection:add":function(t){return e.activeConnection.messages.push(t)}}}),s("div",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)"}],style:{width:e.$q.platform.is.desktop?"75%":"100%"}},[e.activeConnection?s("q-toolbar",{staticClass:"bg-grey-9"},[e.$q.platform.is.mobile?s("q-icon",{staticClass:"cursor-pointer",attrs:{size:"1.5rem",name:"mdi-close"},nativeOn:{click:function(t){return function(){e.selectedMessages=""}.apply(null,arguments)}}}):e._e(),s("q-toolbar-title",[s("div",{staticClass:"text-white"},[e._v(e._s(e.activeConnection.peer))]),s("div",{staticClass:"text-white",staticStyle:{"font-size":".7rem"}},[e._v(e._s(e.activeConnection.ident))])]),s("q-btn",{attrs:{color:"white",flat:"",dense:"",icon:"hex"===e.typeOfHexView?"mdi-matrix":"mdi-format-text"},on:{click:function(t){e.typeOfHexView="hex"===e.typeOfHexView?"text":"hex"}}},[s("q-tooltip",[e._v("Change view mode (hex/text)")])],1),s("q-btn",{attrs:{color:"white",flat:"",dense:"",icon:"mdi-export-variant"}},[s("q-tooltip",[e._v("Export packets")]),s("q-menu",{attrs:{"no-route-dismiss":""}},[s("q-list",{staticClass:"bg-grey-8 text-white",staticStyle:{"min-width":"150px"}},[s("div",{staticClass:"q-pa-sm"},[s("div",{staticStyle:{"font-size":".8rem"}},[e._v("Copy selected packets as")]),s("div",[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"shown"},on:{click:function(t){return e.copySelected()}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"hex"},on:{click:function(t){return e.copySelected("hex")}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"raw"},on:{click:function(t){return e.copySelected("text")}}})],1)]),s("q-separator"),s("div",{staticClass:"q-pa-sm"},[s("div",{staticStyle:{"font-size":".8rem"}},[e._v("Export selected packets as")]),s("div",[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"shown"},on:{click:function(t){return e.exportSelected()}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"hex"},on:{click:function(t){return e.exportSelected("hex")}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"raw"},on:{click:function(t){return e.exportSelected("text")}}})],1)])],1)],1)],1)],1):e._e(),e.activeConnection&&!e.loadingFlag?s("hex-viewer",{style:{height:"calc(100vh - "+(e.isVisibleToolbar&&e.activeConnection?"150px":"100px")+")",position:"relative",overflow:"auto"},attrs:{hex:e.hex,view:e.typeOfHexView}}):e.$q.platform.is.desktop&&e.connectionPreview?s("div",{staticClass:"q-pa-md",staticStyle:{overflow:"hidden","max-height":"calc(100vh - 100px)"}},[s("q-timeline",{attrs:{layout:"loose",color:"white",dark:""}},e._l(e.connectionPreview.messages.slice(0,20),(function(t,i){return s("message-preview-item",{key:i,attrs:{message:t,view:e.typeOfHexView}})})),1)],1):s("div",{staticStyle:{"text-align":"center",color:"#9e9e9e","font-size":"3rem","padding-top":"40px"}},[s("div",[e._v("Select connection")]),s("q-icon",{attrs:{name:"mdi-arrow-down-bold-outline",size:"3rem"}}),s("div",[e._v("Find message")]),s("q-icon",{attrs:{name:"mdi-arrow-down-bold-outline",size:"3rem"}}),s("div",[e._v("Analyze data")])],1)],1)],1)},a=[],l=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{ref:"wrapper"},[s("q-resize-observer",{on:{resize:e.wrapperResizeHandler}}),s("div",[e.loadingFlag||!Object.keys(e.connections).length&&"messages"!==e.type?e._e():s("q-toolbar",{staticClass:"bg-grey-9"},[s("q-input",{style:{width:e.connection?"calc(100% - 50px)":"100%"},attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:e.connection?"incoming or target *":"host:port",debounce:0},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),e.connection?e._e():s("q-btn",{staticClass:"pull-right text-center text-white",attrs:{title:"Clear all connections",flat:"",dense:""},on:{click:e.clearHandler}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-playlist-remove"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Clear")])],1),"messages"===e.type?s("q-btn",{staticClass:"text-white",staticStyle:{position:"absolute",right:"5px"},attrs:{flat:"",round:"",icon:"mdi-close"},on:{click:e.closeCurrentConnection}},[s("q-tooltip",[e._v("Close current connection")])],1):e._e()],1),e.connection?e._e():s("date-range-modal",{staticClass:"flex flex-center",attrs:{date:e.dateRange,theme:e.theme},on:{save:e.dateRangeChange}}),e.loadingFlag&&e.itemsCount>0?s("div",{staticClass:"absolute-bottom-right absolute-top-left",staticStyle:{overflow:"hidden"}},e._l(new Array(e.itemsCount).fill(""),(function(e,t){return s("connection-skeleton",{key:t})})),1):!e.loadingFlag&&e.messages.length?["connections"===e.type?[e.connectionsByIndex.length?s("virtual-list",{ref:"scroller",staticClass:"absolute-top-left absolute-bottom-right bg-grey-9 text-white cursor-pointer",style:{top:"100px",height:"auto"},attrs:{wclass:"q-w-list",onscroll:e.listScroll,size:e.itemHeight,remain:e.itemsCount,item:e.ConnectionsListItem,itemcount:e.connectionsByIndex.length,itemprops:e.getConnectionItem}}):s("div",{staticClass:"absolute-top-left absolute-bottom-right bg-grey-9 text-white text-center",staticStyle:{top:"50px",height:"auto","font-size":"1.2rem"}},[e._v("\n          Nothing to show by filter "),s("span",{staticClass:"text-bold"},[e._v("«"+e._s(e.filter)+"»")])])]:[e.currentMessages.length?s("virtual-list",{key:e.connection.ident,ref:"scroller",staticClass:"absolute-top-left absolute-bottom-right bg-grey-9 text-white cursor-pointer",style:{top:"50px",height:"auto"},attrs:{wclass:"q-w-list",onscroll:e.listScroll,size:e.itemHeight,remain:e.itemsCount,item:e.MessagesListItem,itemcount:e.currentMessages.length,itemprops:e.getMessageItem}}):s("div",{staticClass:"absolute-top-left absolute-bottom-right bg-grey-9 text-white text-center",staticStyle:{top:"50px",height:"auto","font-size":"1.2rem"}},[e._v("\n          Nothing to show by filter "),s("span",{staticClass:"text-bold"},[e._v("«"+e._s(e.filter)+"»")])])]]:s("empty-pane",{attrs:{config:e.config.emptyState}})],2)],1)},c=[],r=(s("ddb0"),s("e9c4"),s("de45")),h=s("89c1"),m=s.n(h),d=s("2b0e"),p=s("cdde"),u=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-item",{class:[e.selected?"bg-grey-8":""],staticStyle:{"user-select":"none"},attrs:{clickable:""},on:{click:function(t){e.itemClickHandler(e.index,e.item,t)}}},[s("q-tooltip",[e._v(e._s(e.eventsDesc[e.item["proxy.event"]]))]),e.actions?s("q-item-section",{staticClass:"q-pr-none",attrs:{side:""}},e._l(e.actions,(function(t,i){return s("q-icon",{key:i,staticClass:"cursor-pointer on-left",class:t.classes,attrs:{name:t.icon,color:e.selected?"grey-5":""},nativeOn:{click:function(s){return s.stopPropagation(),e.clickHandler(e.index,t.type,e.item)}}},[s("q-tooltip",[e._v(e._s(t.label))])],1)})),1):e._e(),s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none",class:["text-"+e.eventsColors[e.item["proxy.event"]]+"-"+(e.selected?3:4)],attrs:{header:""}},[e._v(e._s(e.date.formatDate(1e3*e.item.timestamp,"DD/MM/YYYY HH:mm:ss.SSS")))]),e.item["proxy.payload.size"]?s("q-item-label",{staticClass:"ellipsis overflow-hidden text-grey-5",attrs:{caption:""}},[e._v(e._s(e.item["proxy.payload.size"]+" B : ")),s("small",[e._v(e._s(e.dataPreview))])]):e._e()],1),s("q-item-section",{attrs:{side:""}},[s("small",{class:["text-grey-"+(e.selected?5:7)]},[e._v(e._s(0===e.item["proxy.source"]?"incoming":"target "+e.item["proxy.source"]))]),s("q-icon",{staticClass:"q-ml-xs",attrs:{color:0===e.item["proxy.source"]?"green":"yellow",name:0===e.item["proxy.source"]||1===e.item["proxy.event"]?"mdi-arrow-right-thick":"mdi-arrow-left-thick"}})],1)],1)},f=[],g=s("bd4c"),v=s("c423"),x={props:["item","index","actions","itemHeight","selected","view"],mixins:[v["a"]],data(){return{date:g["a"],eventsColors:{0:"purple",1:"green",2:"red"},eventsDesc:{0:"Data received",1:"Connect",2:"Disconnect"}}},computed:{dataPreview(){let e=this.item["proxy.payload.hex"];if("text"===this.view){const t=e.match(/.{1,2}/g);e=t.map((e=>this.replaceByteWithMnemo(e))).join("")}return e}},methods:{clickHandler(e,t,s){this.$emit("action",{index:e,type:t,content:s})},itemClickHandler(e,t,s){this.$emit("item-click",{index:e,content:t,event:s})}}},y=x,w=s("2877"),b=s("66e5"),$=s("05c0"),C=s("4074"),q=s("0016"),_=s("0170"),S=s("eebe"),k=s.n(S),H=Object(w["a"])(y,u,f,!1,null,null,null),I=H.exports;k()(H,"components",{QItem:b["a"],QTooltip:$["a"],QItemSection:C["a"],QIcon:q["a"],QItemLabel:_["a"]});var M=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-item",{attrs:{clickable:""},on:{click:function(t){e.itemClickHandler(e.index,e.item,t)}}},[s("q-item-section",[s("q-item-label",{staticClass:"q-pa-none text-white connection__peer",attrs:{header:""}},[e._v(e._s(e.peer))]),s("q-item-label",{staticClass:"ellipsis text-grey-6",staticStyle:{"font-size":"0.7rem"},attrs:{caption:""}},[e._v(e._s(e.ident))]),s("q-item-label",{staticClass:"ellipsis text-grey-6",attrs:{caption:""}},[e._v(e._s(e.date.formatDate(1e3*e.timestamp,"DD/MM/YYYY HH:mm:ss")))])],1),s("q-item-section",{attrs:{side:""}},[e._v("\n    "+e._s(e.count+" events")+"\n  ")])],1)},N=[],O={props:["item","index","itemHeight","count"],data(){return{date:g["a"],timestamp:this.item.messages[0].timestamp,ident:this.item.messages[0].ident,peer:this.item.peer}},methods:{itemClickHandler(e,t,s){this.$emit("item-click",{index:e,content:t,event:s})}}},D=O,T=Object(w["a"])(D,M,N,!1,null,null,null),Q=T.exports;k()(T,"components",{QItem:b["a"],QItemSection:C["a"],QItemLabel:_["a"]});var E=s("121a"),P=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-item",{staticClass:"bg-grey-9"},[s("q-item-section",[s("q-item-label",{staticClass:"q-pa-none bg-white full-width skeleton--modificator",staticStyle:{height:"16px"},attrs:{header:""}}),s("q-item-label",{staticClass:"bg-grey-6  full-width skeleton--modificator",staticStyle:{height:"13px"},attrs:{caption:""}}),s("q-item-label",{staticClass:"bg-grey-6 full-width skeleton--modificator",staticStyle:{height:"14px"},attrs:{caption:""}})],1),s("q-item-section",{staticStyle:{width:"30%"},attrs:{side:""}},[s("div",{staticClass:"bg-white full-width skeleton--modificator",staticStyle:{height:"16px"}})])],1)},R=[],z=(s("3af2"),{}),L=Object(w["a"])(z,P,R,!1,null,null,null),V=L.exports;k()(L,"components",{QItem:b["a"],QItemSection:C["a"],QItemLabel:_["a"]});var Y=s("5a3a"),j=s.n(Y),A=s("9b02"),F=s.n(A),B=s("6126"),G={props:["activeId","connection","limit","config","type","view"],data(){return{theme:this.config.theme,viewConfig:this.config.viewConfig,actions:this.config.actions,moduleName:this.config.vuexModuleName,itemHeight:56,itemsCount:0,wrapperHeight:0,needAutoScroll:!0,connections:{},selected:[],filter:"",connectionsFilter:"",scrollerScrollTop:0,visitedConnections:[],inited:!1,MessagesListItem:I,ConnectionsListItem:Q}},computed:{connectionsByIndex(){return Object.keys(this.currentConnections)},currentConnections(){let e=this.connections;if(this.filter){e={};for(const t in this.connections)-1!==this.connections[t].peer.indexOf(this.filter)&&(e[t]=this.connections[t])}return e},currentMessages(){return(this.filter&&this.connection.messages?this.connection.messages.filter(this.filterMessages):this.connection.messages)||[]},messages:{get(){return this.$store.state[this.moduleName].messages},set(e){this.$store.commit(`${this.moduleName}/setMessages`,e)}},active:{get(){return this.$store.state[this.moduleName].active},async set(e){this.realtimeEnabled&&await this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.$store.commit(`${this.moduleName}/setActive`,e);const t=this.$store.state.channels[e]||{};if(d["default"].set(this.config.viewConfig,"needShowEtc",t.protocol_name&&("http"===t.protocol_name||"mqtt"===t.protocol_name)),this.$store.commit(`${this.moduleName}/clearMessages`),await this.$store.dispatch(`${this.moduleName}/initTime`),this.clearSelected(),await this.$store.dispatch(`${this.moduleName}/get`),this.to>Date.now()){const e=await this.$store.dispatch(`${this.moduleName}/pollingGet`);e()}this.dateRangeChange(this.dateRange)}},dateRange(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},from:{get(){return this.$store.state[this.moduleName].from},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setFrom`,e)}},to:{get(){return this.$store.state[this.moduleName].to},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setTo`,e)}},realtimeEnabled(){return this.$store.state[this.moduleName].realtimeEnabled},currentLimit:{get(){return this.$store.state[this.moduleName].limit},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setLimit`,e)}},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)}},methods:{getConnectionItem(e){const t=this.currentConnections[this.connectionsByIndex[e]],s={key:t.peer+t.ident,props:{item:t,index:e,count:t.messages.length,itemHeight:this.itemHeight},class:{"connection--visited":this.visitedConnections.includes(t.peer),[`connection__${e}`]:!0},on:{"item-click":this.connectionClickHandler},nativeOn:{mouseenter:()=>this.previewConnectionHandler(t),mouseleave:()=>this.previewConnectionCloseHandler(t)}};return s},getMessageItem(e){const t=this.currentMessages[e],s={key:e,props:{item:t,index:e,actions:this.actions,itemHeight:this.itemHeight,selected:this.selected.includes(e),view:this.view},on:{action:this.actionHandler,"item-click":this.messageClickHandler}};return s},resetParams(){if(!this.$refs.wrapper)return!1;if(this.wrapperHeight=this.$refs.wrapper.offsetHeight-this.itemHeight,this.itemsCount=Math.ceil(this.wrapperHeight/this.itemHeight),this.$refs.scroller&&this.$refs.scroller.forceRender(),this.$refs.scroller&&this.$refs.scroller.$el){const e=this.$refs.scroller.$el;e.scrollTop+=1}},clearSelected(){this.selected=[]},wrapperResizeHandler(){this.resetParams()},listScroll:function(e,t){this.currentScrollTop||(this.currentScrollTop=t.offset),this.allScrollTop=this.$refs.scroller?this.$refs.scroller.$el.scrollHeight-this.$refs.scroller.$el.clientHeight:0,this.messages.length&&(t.offset<this.currentScrollTop&&this.needAutoScroll?this.needAutoScroll=!1:!this.needAutoScroll&&this.realtimeEnabled&&t.offset>=this.allScrollTop&&(this.needAutoScroll=!0),this.currentScrollTop=t.offset)},filterMessages(e){if(0==="incoming".indexOf(this.filter)&&0===e["proxy.source"])return!0;if(/^target(\s){0,1}(\d){0,1}$/.test(this.filter)||0==="target".indexOf(this.filter)){const t=parseInt(this.filter.split(" ")[1]||0);return t?e["proxy.source"]===t:!!e["proxy.source"]}return!1},newMessagesInterseptor(e){if(!e.length)return this.clearConnections(),!1;const t=this.inited&&this.connection?this.poolConnection:this.poolConnections;e.forEach(t)},poolConnections(e){const t=e.ident;this.connections[t]||(this.connections[t]={messages:[],peer:e.peer,ident:t}),this.connections[t].messages.push(e)},poolConnection(e){e.ident===this.connection.ident&&this.$emit("connection:add",e)},dateRangeChange(e){this.updateRoute({query:{from:e[0]/1e3,to:e[1]/1e3}})},dateRangeChangeHandler(e){const t=e[0],s=e[1];if(this.from===t&&this.to===s)return!1;this.from=t,this.to=s,this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),this.$store.commit(`${this.moduleName}/clearMessages`),this.$store.dispatch(`${this.moduleName}/get`).then((()=>{s>Date.now()&&this.$store.dispatch(`${this.moduleName}/pollingGet`).then((e=>e()))}))},actionHandler({index:e,type:t,content:s}){switch(t){case"view":this.viewMessagesHandler({index:e,content:s});break;case"copy":this.copyMessageHandler({index:e,content:s});break}},viewMessagesHandler({index:e,content:t}){this.selected=[e],this.$root.$emit("view-data",t)},connectionClickHandler({index:e,content:t,event:s}){this.$refs.scroller&&this.$refs.scroller.$el&&(this.scrollerScrollTop=this.$refs.scroller.$el.scrollTop),this.visitedConnections.push(t.peer),this.$emit("change:connection",t)},messageClickHandler({index:e,content:t,event:s}){if(s.shiftKey)this.selected[0]?this.selected[0]>e?this.selected=j()(e,this.selected[0]+1):this.selected=j()(this.selected[0],e+1):this.selected=[e];else if(s.ctrlKey||s.metaKey)if(this.selected.includes(e)){const t=this.selected;t.splice(this.selected.indexOf(e),1),this.selected=t}else this.selected=[...this.selected,e];else this.selected=[e];this.needAutoScroll&&(this.needAutoScroll=!1),this.selected.sort(((e,t)=>e-t)),this.$emit("view-data",this.selected.map((e=>this.connection.messages[e])))},previewConnectionHandler(e){this.$emit("connection:preview",e)},previewConnectionCloseHandler(e){this.$emit("connection:preview-hide",e)},copyMessageHandler({index:e,content:t}){Object(p["a"])(JSON.stringify(t)).then((e=>{this.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(e=>{this.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},unselect(){this.selected.length&&(this.selected=[])},clearConnections(){this.connections={}},closeCurrentConnection(){this.$emit("close"),this.$nextTick((()=>{this.$refs.scroller&&this.$refs.scroller.$el&&(this.$refs.scroller.$el.scrollTop=this.scrollerScrollTop)}))},clearHandler(){this.$q.dialog({title:"Confirm",message:"Do you really want to clear all connections?",ok:!0,cancel:!0,noRouteDismiss:!0}).onOk((()=>{this.$store.commit(`${this.moduleName}/clearMessages`)})).onCancel((()=>{}))},async init(){if(this.$store.state[this.moduleName]||this.$store.registerModule(this.moduleName,Object(r["c"])({Vue:d["default"],LocalStorage:this.$q.localStorage,name:{name:this.moduleName,lsNamespace:"flespi-toolbox-settings.cols"},errorHandler:e=>{this.$store.commit("reqFailed",e)},filterHandler:this.filterMessage,newMessagesInterseptor:this.newMessagesInterseptor})),this.activeId){this.$store.commit(`${this.moduleName}/setActive`,this.activeId);const e=this.$store.state.channels[this.activeId]||{};this.$set(this.config.viewConfig,"needShowEtc",e.protocol_name&&("http"===e.protocol_name||"mqtt"===e.protocol_name))}this.currentLimit=this.limit;const e=1e3*this.$route.query.from,t=1e3*this.$route.query.to,s=this.$route.query.highlight,i=this.$route.query.filter;i&&(this.filter=i),e&&t?(this.from=e,this.to=t,await this.$store.dispatch(`${this.moduleName}/get`)):(await this.$store.dispatch(`${this.moduleName}/initTime`),await this.$store.dispatch(`${this.moduleName}/get`));const n=F()(this.connection,"ident"),o=this.connections[n];if(o?(this.connectionClickHandler({content:o}),this.$nextTick((()=>{const e=this.currentMessages.findIndex((e=>0===e["proxy.source"]&&Math.floor(e.timestamp)===Math.floor(s)));e>-1&&this.messageClickHandler({index:e,event:{}})}))):this.closeCurrentConnection(),this.to>Date.now()){const e=await this.$store.dispatch(`${this.moduleName}/pollingGet`);e()}this.updateRoute({query:{from:this.from/1e3,to:this.to/1e3}},!0),this.inited=!0}},watch:{activeId(e){this.active=e},limit(e){this.currentLimit=e},type(e){this.clearSelected(),this.resetParams(),"connections"===e?(this.newMessagesInterseptor(this.messages),this.filter=this.connectionsFilter):(this.clearConnections(),this.connectionsFilter=this.filter,this.filter="")},$route(e){const t=1e3*e.query.from,s=1e3*e.query.to;t&&s&&(this.dateRange[0]!==t||this.dateRange[1]!==s)&&this.dateRangeChangeHandler([t,s])}},created(){this.init(),this.offlineHandler=d["default"].connector.socket.on("offline",(()=>{this.$store.commit(`${this.moduleName}/setOffline`)})),this.connectHandler=d["default"].connector.socket.on("connect",(()=>{this.$store.state[this.moduleName].offline&&this.$store.commit(`${this.moduleName}/setReconnected`)}))},mounted(){this.resetParams()},updated(){this.messages.length?this.needAutoScroll&&this.$refs.scroller&&this.$refs.scroller.$el&&(this.$refs.scroller.$el.scrollTop=this.$refs.scroller.$el.scrollHeight):this.currentScrollTop=0},destroyed(){this.$store.dispatch(`${this.moduleName}/unsubscribePooling`),void 0!==this.offlineHandler&&d["default"].connector.socket.off("offline",this.offlineHandler),void 0!==this.connectHandler&&d["default"].connector.socket.off("connect",this.connectHandler),this.$store.commit(`${this.moduleName}/clear`),this.$store.unregisterModule(this.moduleName)},mixins:[B["a"]],components:{VirtualList:m.a,EmptyPane:E["a"],DateRangeModal:r["a"],ConnectionSkeleton:V}},J=G,K=(s("027e"),s("3980")),W=s("65c6"),X=s("27f9"),U=s("9c40"),Z=Object(w["a"])(J,l,c,!1,null,null,null),ee=Z.exports;k()(Z,"components",{QResizeObserver:K["a"],QToolbar:W["a"],QInput:X["a"],QIcon:q["a"],QBtn:U["a"],QTooltip:$["a"]});var te=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-timeline-entry",{staticClass:"hex-viewer__timeline-element",attrs:{side:0===e.message["proxy.source"]?"left":"right",color:e.eventsColors[e.message["proxy.event"]]+"-6"}},[s("div",{attrs:{slot:"title"},slot:"title"},[s("div",{staticStyle:{"line-height":"18px"}},[s("span",[e._v(e._s(e.eventsDesc[e.message["proxy.event"]]))]),e.message["proxy.source"]?s("span",{staticClass:"q-ml-xs text-grey-5",staticStyle:{"font-size":".8rem"}},[e._v("[target "+e._s(e.message["proxy.source"])+"]")]):e._e()]),s("div",{staticClass:"text-grey-5",staticStyle:{"font-size":".7rem"}},[e._v(e._s(e.date.formatDate(1e3*e.message.timestamp,"DD/MM/YYYY HH:mm:ss.SSS")))])]),s("div",{staticClass:"ellipsis",staticStyle:{"word-break":"break-all","font-size":".8rem",height:"1rem"}},[e._v(e._s(e.dataPreview))])])},se=[],ie={props:["message","view"],mixins:[v["a"]],data(){return{date:g["a"],eventsColors:{0:"purple",1:"green",2:"red"},eventsDesc:{0:"Data received",1:"Connect",2:"Disconnect"}}},computed:{dataPreview(){let e=this.message["proxy.payload.hex"]||"";if("text"===this.view&&e){const t=e.match(/.{1,2}/g);e=t.map((e=>this.replaceByteWithMnemo(e))).join("")}return e}}},ne=ie,oe=(s("c954"),s("74af")),ae=s("05eb"),le=Object(w["a"])(ne,te,se,!1,null,null,null),ce=le.exports;k()(le,"components",{QTimelineEntry:oe["a"],QTimeline:ae["a"]});var re=s("d77f"),he=s("2f62"),me=s("798f"),de={props:["active","activeDevice","isVisibleToolbar","config"],data(){return{connectionPreview:null,typeOfHexView:"hex",selectedMessages:"",activeConnection:this.activeDevice||null}},computed:{...Object(he["d"])({isEmptyMessages(e){return this.config.messages&&e[this.config.messages.vuexModuleName]&&!e[this.config.messages.vuexModuleName].messages.length}}),loadingFlag(){const e=this.$store.state[this.config.messages.vuexModuleName];return!(!e||!e.isLoading)},hex(){return!(!this.selectedMessages||!this.activeConnection)&&this.selectedMessages.reduce(((e,t)=>(e+=t["proxy.payload.hex"]||"",e)),"")}},methods:{getHeader(e){const t={0:"Data received",1:"Connect",2:"Disconnect"},s=0===e["proxy.source"]?"incoming":`target ${e["proxy.source"]}`;let i="";return i+=t[e["proxy.event"]],i+=`[${s}]`,i+="(",i+=g["a"].formatDate(1e3*e.timestamp,"DD/MM/YYYY HH:mm:ss"),e["proxy.payload.hex"]&&(i+=` size: ${e["proxy.payload.size"]}B`),i+=")",i},getContentBySelected(e){return this.selectedMessages.reduce(((t,s)=>(t+=this.getHeader(s),s["proxy.payload.hex"]&&(t+=this.getContent(e,s["proxy.payload.hex"],this.typeOfHexView)),t+="\r\n",t)),"")},copySelected(e="view"){const t=this.getContentBySelected(e);this.copy(t,e)},exportSelected(e="view"){const t=this.getContentBySelected(e);this.exportData(t,e)},changeConnectionHandler(e){this.activeConnection=e,this.$emit("change-active-device",{ident:e.ident})},closeHandler(){this.activeConnection=null,this.selectedMessages="",this.$emit("change-active-device",null)}},watch:{active(){this.activeConnection=null,this.selectedMessages="",this.connectionPreview=null}},mixins:[me["a"]],components:{Messages:ee,MessagePreviewItem:ce,HexViewer:re["a"]}},pe=de,ue=s("6ac5"),fe=s("4e73"),ge=s("1c1c"),ve=s("eb85"),xe=s("7f67"),ye=Object(w["a"])(pe,o,a,!1,null,null,null),we=ye.exports;k()(ye,"components",{QToolbar:W["a"],QIcon:q["a"],QToolbarTitle:ue["a"],QBtn:U["a"],QTooltip:$["a"],QMenu:fe["a"],QList:ge["a"],QSeparator:ve["a"],QTimeline:ae["a"]}),k()(ye,"directives",{ClosePopup:xe["a"]});var be=s("a99a"),$e=s("286e"),Ce={name:"PageHexViewer",props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[$e["a"],B["a"]],data(){return{active:null,activeDevice:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,filter:"",prevEntity:null,prevRoute:null}},computed:{...Object(he["d"])({tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},PROXY_PROTOCOL_ID(e){const t=e.channelsProtocols||{};return Object.keys(t).reduce(((e,s)=>("proxy"===t[s].name&&(e=parseInt(s)),e)),0)},items(e){return Object.values(e.channels||{}).filter((e=>this.PROXY_PROTOCOL_ID&&e.protocol_id===this.PROXY_PROTOCOL_ID))}}),filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const s=e.name.toLowerCase(),i=t.name.toLowerCase();return s<i?-1:1})),t},selectedItem(){return this.items.filter((e=>e.id===this.active))[0]||null}},methods:{changeActiveDeviceHandler(e){this.activeDevice=e,this.active&&this.activeDevice?this.updateRoute({name:"hexViewer-nested",params:{id:this.active,ident:e.ident}}):this.updateRoute({name:"hexViewer",params:{id:this.active}})},unselect(){this.$refs.messages.unselect()},viewLogsHandler(){"channels"===this.prevEntity&&this.prevRoute&&this.prevRoute.params.id===this.active?this.$router.push(this.prevRoute).catch((e=>e)):this.$router.push(`/channels/${this.active}`).catch((e=>e))},init(){const e="tools/hex",t=F()(this.settings,`entities[${e}]`,void 0);if(this.isInit=!0,this.$route.params&&this.$route.params.id)if(this.items.filter((e=>e.id===Number(this.$route.params.id))).length){this.active=Number(this.$route.params.id);const e=this.$route.params.ident;e&&(this.activeDevice={ident:e})}else this.active=null;else t&&this.items.filter((e=>e.id===t)).length&&(this.active=t);this.$emit("inited")}},watch:{$route(e){if(e.params&&e.params.id)if(this.items.filter((t=>t.id===Number(e.params.id))).length){this.active=Number(e.params.id);const t=this.$route.params.ident;t&&(this.activeDevice={ident:t})}else this.isInit&&(this.active=null);else e.params&&!e.params.id&&(this.active=null)},active(e){const t=this.items.filter((t=>t.id===e))[0]||{};e&&this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:"tools/hex"},value:t.id})}},beforeRouteEnter(e,t,s){s((e=>{e.prevRoute=t,e.prevEntity=t.meta.moduleName}))},components:{HexViewer:we,EntitiesToolbar:be["a"]}},qe=Ce,_e=(s("0472"),s("9989")),Se=s("ddd8"),ke=s("8572"),He=Object(w["a"])(qe,i,n,!1,null,null,null);t["default"]=He.exports;k()(He,"components",{QPage:_e["a"],QSelect:Se["a"],QInput:X["a"],QIcon:q["a"],QItem:b["a"],QItemSection:C["a"],QItemLabel:_["a"],QBtn:U["a"],QField:ke["a"]})},c954:function(e,t,s){"use strict";s("1a0c")},f93b:function(e,t,s){}}]);