(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[5],{"027e":function(e,t,i){"use strict";var s=i("0bb7"),n=i.n(s);n.a},"0472":function(e,t,i){"use strict";var s=i("2449"),n=i.n(s);n.a},"09b6":function(e,t,i){},"0bb7":function(e,t,i){},2449:function(e,t,i){},"282c":function(e,t,i){},"3af2":function(e,t,i){"use strict";var s=i("dd18"),n=i.n(s);n.a},"56bd":function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-page",[i("entities-toolbar",{attrs:{item:e.selectedItem}},[i("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[i("div",{staticStyle:{display:"inline-flex","max-width":"calc(100% - 80px)"}},[i("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",label:e.active?"Channel":"SELECT CHANNEL",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect,"hide-dropdown-icon":!e.isNeedSelect,"virtual-scroll-item-size":48,"virtual-scroll-slice-size":6,"virtual-scroll-sticky-size-start":48,"virtual-scroll-sticky-size-end":e.needShowGetDeletedAction&&1===e.tokenType?29:0,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+(e.needShowGetDeletedAction&&1===e.tokenType?77:48)+"px"}},on:{filter:e.filterItems},scopedSlots:e._u([{key:"no-option",fn:function(){return[i("div",[i("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[i("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),i("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(t){return[e.selectedItem?i("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",t.itemProps,!1),t.itemEvents),[i("q-item-section",[i("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),i("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[i("small",[e._v(e._s(e.selectedItem.uri||"<no uri>"))])])],1),i("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?i("q-item-label",{staticClass:"q-pa-none text-right"},[i("small",{staticClass:"cheap-modifier"},[e._v("DELETED")])]):e._e(),i("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[i("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},e.filteredItems.length?{key:"option",fn:function(t){return[i("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":t.opt.deleted},attrs:{clickable:""},on:{click:function(i){e.active=t.opt.id,e.$emit("view-data-hide")}}},"q-item",t.itemProps,!1),t.itemEvents),[i("q-item-section",[i("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(t.opt.name||"<noname>"))]),i("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[i("small",[e._v(e._s(t.opt.uri||"<no uri>"))])])],1),i("q-item-section",{attrs:{side:""}},[t.opt.deleted?i("q-item-label",{staticClass:"q-pa-xs text-right"},[i("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),i("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[i("small",[e._v("#"+e._s(t.opt.id))])])],1)],1)]}}:null],null,!0)},[i("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[i("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[i("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1),e.needShowGetDeletedAction&&1===e.tokenType?i("div",{staticClass:"select__get-deleted",attrs:{slot:"after-options"},slot:"after-options"},[i("q-btn",{staticClass:"deleted-action",attrs:{icon:"mdi-download"},on:{click:e.getDeletedHandler}},[e._v("see deleted")])],1):e._e()])],1),i("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[e.active?i("q-btn",{staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"60px"},attrs:{title:"View channels",flat:"",dense:""},on:{click:e.viewLogsHandler}},[i("q-icon",{attrs:{size:"1.5rem",color:"white",name:"merge_type"}}),i("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Channels")])],1):e._e()],1)],1)]),e.active?i("div",{staticStyle:{display:"flex"}},[i("messages",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&!e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"}],ref:"messages",style:{height:"calc(100vh - "+(e.isVisibleToolbar?"100px":"50px")+")",position:"relative",width:e.$q.platform.is.desktop?"25%":"100%",minWidth:"180px"},attrs:{activeId:e.active,limit:0,config:e.config.messages,connection:e.activeConnection,type:e.activeConnection?"messages":"connections",view:e.typeOfHexView},on:{"view-data":function(t){e.selectedMessages=t},"change:connection":function(t){e.activeConnection=t},close:function(){e.activeConnection=null,e.selectedMessages=""},"connection:preview":function(t){return e.connectionPreview=t},"connection:preview-hide":function(t){return e.connectionPreview=null}}}),i("div",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)"}],style:{width:e.$q.platform.is.desktop?"75%":"100%"}},[e.activeConnection?i("q-toolbar",{staticClass:"bg-grey-9"},[e.$q.platform.is.mobile?i("q-icon",{staticClass:"cursor-pointer",attrs:{size:"1.5rem",name:"mdi-close"},nativeOn:{click:function(t){return function(){e.selectedMessages=""}()}}}):e._e(),i("q-toolbar-title",[i("div",{staticClass:"text-white"},[e._v(e._s(e.activeConnection.peer))]),i("div",{staticClass:"text-white",staticStyle:{"font-size":".7rem"}},[e._v(e._s(e.activeConnection.ident))])]),i("q-btn",{attrs:{color:"white",flat:"",dense:"",icon:"hex"===e.typeOfHexView?"mdi-matrix":"mdi-format-text"},on:{click:function(t){e.typeOfHexView="hex"===e.typeOfHexView?"text":"hex"}}},[i("q-tooltip",[e._v("Change view mode (hex/text)")])],1)],1):e._e(),e.activeConnection?i("hex-viewer",{style:{height:"calc(100vh - "+(e.isVisibleToolbar&&e.activeConnection?"150px":"100px")+")",position:"relative",overflow:"auto"},attrs:{hex:e.hex,view:e.typeOfHexView}}):e.$q.platform.is.desktop&&e.connectionPreview?i("div",{staticClass:"q-pa-md",staticStyle:{overflow:"hidden","max-height":"calc(100vh - 100px)"}},[i("q-timeline",{attrs:{layout:"loose",color:"white",dark:""}},e._l(e.connectionPreview.messages.slice(0,20),(function(t,s){return i("message-preview-item",{key:s,attrs:{message:t,view:e.typeOfHexView}})})),1)],1):i("div",{staticStyle:{"text-align":"center",color:"#9e9e9e","font-size":"3rem","padding-top":"40px"}},[i("div",[e._v("Select connection")]),i("q-icon",{attrs:{name:"mdi-arrow-down-bold-outline",size:"3rem"}}),i("div",[e._v("Find message")]),i("q-icon",{attrs:{name:"mdi-arrow-down-bold-outline",size:"3rem"}}),i("div",[e._v("Analyze data")])],1)],1)],1):e._e(),!e.items.length&&e.isItemsInit?i("div",{staticClass:"text-center text-grey-3 q-mt-lg",staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Proxy channels not found"))]):e._e(),e.active&&e.selectedItem&&e.selectedItem.deleted?i("div",{staticClass:"text-center",staticStyle:{"font-size":"1.5rem","margin-top":"30px",color:"white"}},[e._v("Nothing to show by channel «"+e._s(e.selectedItem.name)+"» "),i("div",{staticStyle:{"font-size":"0.9rem"}},[e._v("or you haven`t access")])]):e._e()],1)},n=[],o=(i("8e6e"),i("8a81"),i("c5f6"),i("967e")),c=i.n(o),r=(i("96cf"),i("fa84")),a=i.n(r),l=(i("7f7f"),i("8615"),i("ac6a"),i("cadf"),i("06db"),i("456d"),i("c47a")),d=i.n(l),m=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{ref:"wrapper"},[i("q-resize-observer",{on:{resize:e.wrapperResizeHandler}}),i("div",[e.loadingFlag||!e.loadingFlag&&(Object.keys(e.connections).length||"messages"===e.type)?i("q-toolbar",{staticClass:"bg-grey-9"},[i("q-input",{style:{width:e.connection?"calc(100% - 50px)":"100%"},attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:e.connection?"incoming or target *":"host:port",debounce:0},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[i("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),e.connection?e._e():i("q-btn",{staticClass:"pull-right text-center text-white",attrs:{title:"Clear all connections",flat:"",dense:""},on:{click:e.clearHandler}},[i("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-playlist-remove"}}),i("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Clear")])],1),"messages"===e.type?i("q-btn",{staticClass:"text-white",staticStyle:{position:"absolute",right:"5px"},attrs:{flat:"",round:"",icon:"mdi-close"},on:{click:e.closeCurrentConnection}},[i("q-tooltip",[e._v("Close current connection")])],1):e._e()],1):e._e(),e.connection?e._e():i("date-range-modal",{staticClass:"flex flex-center",attrs:{date:e.dateRange,theme:e.theme},on:{save:e.dateRangeChangeHandler}}),e.loadingFlag&&!e.connection&&e.itemsCount>0?i("div",{staticClass:"absolute-bottom-right absolute-top-left",staticStyle:{overflow:"hidden"}},e._l(new Array(e.itemsCount).fill(""),(function(e,t){return i("connection-skeleton",{key:t})})),1):!e.loadingFlag&&e.messages.length?[i("VirtualList",{ref:"scroller",class:{"bg-grey-9":!0,"text-white":!0,"cursor-pointer":!0},style:{position:"absolute",top:e.connection?"50px":"100px",bottom:0,right:0,left:0,height:"auto"},attrs:{onscroll:e.listScroll,size:e.itemHeight,remain:e.itemsCount,wclass:"q-w-list"}},["connections"===e.type?e._l(e.currentConnections,(function(t,s){var n;return i("connections-list-item",{key:t.peer,class:(n={"connection--visited":e.visitedConnections.includes(t.peer)},n["connection__"+s]=!0,n),attrs:{item:t,index:s,count:t.messages.length,itemHeight:e.itemHeight},on:{"item-click":e.connectionClickHandler},nativeOn:{mouseenter:function(i){return e.previewConnectionHandler(t)},mouseleave:function(i){return e.previewConnectionCloseHandler(t)}}})})):e._l(e.currentMessages,(function(t,s){return i("messages-list-item",{key:s,attrs:{item:t,index:s,actions:e.actions,itemHeight:e.itemHeight,selected:e.selected.includes(s),view:e.view},on:{action:e.actionHandler,"item-click":e.messageClickHandler}})}))],2)]:i("empty-pane",{attrs:{config:e.config.emptyState}})],2)],1)},u=[],h=i("4db1"),p=i.n(h),f=(i("6762"),i("2fdb"),i("28a5"),i("de45")),v=i("e468"),g=i("89c1"),x=i.n(g),y=i("2b0e"),w=i("cdde"),b=i("ef95"),_=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-item",{class:[e.selected?"bg-grey-8":""],attrs:{clickable:""},on:{click:function(t){e.itemClickHandler(e.index,e.item,t)}}},[i("q-tooltip",[e._v(e._s(e.eventsDesc[e.item["proxy.event"]]))]),e.actions?i("q-item-section",{staticClass:"q-pr-none",attrs:{side:""}},e._l(e.actions,(function(t,s){return i("q-icon",{key:s,staticClass:"cursor-pointer on-left",class:t.classes,attrs:{name:t.icon,color:e.selected?"grey-5":""},nativeOn:{click:function(i){return i.stopPropagation(),e.clickHandler(e.index,t.type,e.item)}}},[i("q-tooltip",[e._v(e._s(t.label))])],1)})),1):e._e(),i("q-item-section",[i("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none",class:["text-"+e.eventsColors[e.item["proxy.event"]]+"-"+(e.selected?3:4)],attrs:{header:""}},[e._v(e._s(e.date.formatDate(1e3*e.item.timestamp,"DD/MM/YYYY HH:mm:ss")))]),e.item["proxy.payload.size"]?i("q-item-label",{staticClass:"ellipsis overflow-hidden text-grey-5",attrs:{caption:""}},[e._v(e._s(e.item["proxy.payload.size"]+" B : ")),i("small",[e._v(e._s(e.dataPreview))])]):e._e()],1),i("q-item-section",{attrs:{side:""}},[i("small",{class:["text-grey-"+(e.selected?5:7)]},[e._v(e._s(0===e.item["proxy.source"]?"incoming":"target "+e.item["proxy.source"]))]),i("q-icon",{staticClass:"q-ml-xs",attrs:{color:0===e.item["proxy.source"]?"green":"yellow",name:0===e.item["proxy.source"]||1===e.item["proxy.event"]?"mdi-arrow-right-thick":"mdi-arrow-left-thick"}})],1)],1)},C=[],q=(i("4917"),i("bd4c")),$={props:["item","index","actions","itemHeight","selected","view"],data:function(){return{date:q["b"],eventsColors:{0:"purple",1:"green",2:"red"},eventsDesc:{0:"Data recieved",1:"Connect",2:"Disconnect"}}},computed:{dataPreview:function(){var e=this.item["proxy.payload.hex"];if("text"===this.view){var t=e.match(/.{1,2}/g);e=t.map((function(e){return String.fromCharCode(parseInt(e,16))})).join("")}return e}},methods:{clickHandler:function(e,t,i){this.$emit("action",{index:e,type:t,content:i})},itemClickHandler:function(e,t,i){this.$emit("item-click",{index:e,content:t,event:i})}}},k=$,S=i("2877"),H=Object(S["a"])(k,_,C,!1,null,null,null),O=H.exports,N=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-item",{attrs:{clickable:""},on:{click:function(t){e.itemClickHandler(e.index,e.item,t)}}},[i("q-item-section",[i("q-item-label",{staticClass:"q-pa-none text-white connection__peer",attrs:{header:""}},[e._v(e._s(e.peer))]),i("q-item-label",{staticClass:"ellipsis text-grey-6",staticStyle:{"font-size":"0.7rem"},attrs:{caption:""}},[e._v(e._s(e.ident))]),i("q-item-label",{staticClass:"ellipsis text-grey-6",attrs:{caption:""}},[e._v(e._s(e.date.formatDate(1e3*e.timestamp,"DD/MM/YYYY HH:mm:ss")))])],1),i("q-item-section",{attrs:{side:""}},[e._v("\n    "+e._s(e.count+" events")+"\n  ")])],1)},I=[],M={props:["item","index","itemHeight","count"],data:function(){return{date:q["b"],timestamp:this.item.messages[0].timestamp,ident:this.item.messages[0].ident,peer:this.item.peer}},methods:{itemClickHandler:function(e,t,i){this.$emit("item-click",{index:e,content:t,event:i})}}},D=M,E=(i("a50c"),Object(S["a"])(D,N,I,!1,null,null,null)),P=E.exports,T=i("121a"),A=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-item",{staticClass:"bg-grey-9"},[i("q-item-section",[i("q-item-label",{staticClass:"q-pa-none bg-white full-width skeleton--modificator",staticStyle:{height:"16px"},attrs:{header:""}}),i("q-item-label",{staticClass:"bg-grey-6  full-width skeleton--modificator",staticStyle:{height:"13px"},attrs:{caption:""}}),i("q-item-label",{staticClass:"bg-grey-6 full-width skeleton--modificator",staticStyle:{height:"14px"},attrs:{caption:""}})],1),i("q-item-section",{staticStyle:{width:"30%"},attrs:{side:""}},[i("div",{staticClass:"bg-white full-width skeleton--modificator",staticStyle:{height:"16px"}})])],1)},j=[],L=(i("3af2"),{}),z=Object(S["a"])(L,A,j,!1,null,null,null),R=z.exports,V=i("5a3a"),Y=i.n(V),F={props:["activeId","connection","limit","config","type","view"],data:function(){return{theme:this.config.theme,viewConfig:this.config.viewConfig,actions:this.config.actions,moduleName:this.config.vuexModuleName,itemHeight:56,itemsCount:0,wrapperHeight:0,needAutoScroll:!0,connections:{},connectionsByIndex:[],selected:[],filter:"",connectionsFilter:"",scrollerScrollTop:0,visitedConnections:[]}},computed:{currentConnections:function(){var e=this;return this.filter?this.connectionsByIndex.reduce((function(t,i){return-1!==e.connections[i].peer.indexOf(e.filter)&&(t[i]=e.connections[i]),t}),{}):this.connections},currentMessages:function(){return this.filter?this.connection.messages.filter(this.filterMessages):this.connection.messages},messages:{get:function(){return this.$store.state[this.moduleName].messages},set:function(e){this.$store.commit("".concat(this.moduleName,"/setMessages"),e)}},active:{get:function(){return this.$store.state[this.moduleName].active},set:function(e){var t=this;return a()(c.a.mark((function i(){var s,n;return c.a.wrap((function(i){while(1)switch(i.prev=i.next){case 0:if(!t.realtimeEnabled){i.next=3;break}return i.next=3,t.$store.dispatch("".concat(t.moduleName,"/unsubscribePooling"));case 3:return t.$store.commit("".concat(t.moduleName,"/setActive"),e),s=t.$store.state.channels[e]||{},y["default"].set(t.config.viewConfig,"needShowEtc",s.protocol_name&&("http"===s.protocol_name||"mqtt"===s.protocol_name)),t.$store.commit("".concat(t.moduleName,"/clearMessages")),i.next=9,t.$store.dispatch("".concat(t.moduleName,"/initTime"));case 9:return t.clearSelected(),i.next=12,t.$store.dispatch("".concat(t.moduleName,"/get"));case 12:if(!(t.to>Date.now())){i.next=17;break}return i.next=15,t.$store.dispatch("".concat(t.moduleName,"/pollingGet"));case 15:n=i.sent,n();case 17:case"end":return i.stop()}}),i)})))()}},dateRange:function(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},from:{get:function(){return this.$store.state[this.moduleName].from},set:function(e){e?this.$store.commit("".concat(this.moduleName,"/setFrom"),e):this.$store.commit("".concat(this.moduleName,"/setFrom"),0)}},to:{get:function(){return this.$store.state[this.moduleName].to},set:function(e){e?this.$store.commit("".concat(this.moduleName,"/setTo"),e):this.$store.commit("".concat(this.moduleName,"/setTo"),0)}},realtimeEnabled:function(){return this.$store.state[this.moduleName].realtimeEnabled},currentLimit:{get:function(){return this.$store.state[this.moduleName].limit},set:function(e){e?this.$store.commit("".concat(this.moduleName,"/setLimit"),e):this.$store.commit("".concat(this.moduleName,"/setLimit"),0)}},loadingFlag:function(){var e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)}},methods:{resetParams:function(){if(!this.$refs.wrapper)return!1;if(this.wrapperHeight=this.$refs.wrapper.offsetHeight-this.itemHeight,this.itemsCount=Math.ceil(this.wrapperHeight/this.itemHeight),this.$refs.scroller&&this.$refs.scroller.forceRender(),this.$refs.scroller&&this.$refs.scroller.$el){var e=this.$refs.scroller.$el;e.scrollTop+=1}},clearSelected:function(){this.selected=[]},wrapperResizeHandler:function(){this.resetParams()},listScroll:function(e,t){this.currentScrollTop||(this.currentScrollTop=t.offset),this.allScrollTop=this.$refs.scroller?this.$refs.scroller.$el.scrollHeight-this.$refs.scroller.$el.clientHeight:0,this.messages.length&&(t.offset<this.currentScrollTop&&this.needAutoScroll?this.needAutoScroll=!1:!this.needAutoScroll&&this.realtimeEnabled&&t.offset>=this.allScrollTop&&(this.needAutoScroll=!0),this.currentScrollTop=t.offset)},filterMessages:function(e){if(0==="incoming".indexOf(this.filter)&&0===e["proxy.source"])return!0;if(/^target(\s){0,1}(\d){0,1}$/.test(this.filter)||0==="target".indexOf(this.filter)){var t=parseInt(this.filter.split(" ")[1]||0);return t?e["proxy.source"]===t:!!e["proxy.source"]}return!1},newMessagesInterseptor:function(e){if(!e.length)return this.clearConnections(),!1;var t=this.connection?this.poolConnection:this.poolConnections;e.forEach(t)},poolConnections:function(e){var t=e.ident;this.connections[t]||(this.connections[t]={messages:[],peer:e.peer,ident:t},this.connectionsByIndex.push(t)),this.connections[t].messages.push(e)},poolConnection:function(e){e.ident===this.connection.ident&&this.connection.messages.push(e)},dateRangeChangeHandler:function(e){var t=this,i=e[0],s=e[1];if(this.from===i&&this.to===s)return!1;this.from=i,this.to=s,this.realtimeEnabled&&this.$store.dispatch("".concat(this.moduleName,"/unsubscribePooling")),this.$store.commit("".concat(this.moduleName,"/clearMessages")),this.$store.dispatch("".concat(this.moduleName,"/get")).then((function(){s>Date.now()&&t.$store.dispatch("".concat(t.moduleName,"/pollingGet")).then((function(e){return e()}))}))},actionHandler:function(e){var t=e.index,i=e.type,s=e.content;switch(i){case"view":this.viewMessagesHandler({index:t,content:s});break;case"copy":this.copyMessageHandler({index:t,content:s});break}},viewMessagesHandler:function(e){var t=e.index,i=e.content;this.selected=[t],this.$eventBus.$emit("view-data",i)},connectionClickHandler:function(e){e.index;var t=e.content;e.event;this.$refs.scroller&&this.$refs.scroller.$el&&(this.scrollerScrollTop=this.$refs.scroller.$el.scrollTop),this.visitedConnections.push(t.peer),this.$emit("change:connection",t)},messageClickHandler:function(e){var t=this,i=e.index,s=(e.content,e.event);if(s.shiftKey)this.selected[0]?this.selected[0]>i?this.selected=Y()(i,this.selected[0]+1):this.selected=Y()(this.selected[0],i+1):this.selected=[i];else if(s.ctrlKey)if(this.selected.includes(i)){var n=this.selected;n.splice(this.selected.indexOf(i),1),this.selected=n}else this.selected=[].concat(p()(this.selected),[i]);else this.selected=[i];this.needAutoScroll&&(this.needAutoScroll=!1),this.$emit("view-data",this.connection.messages.filter((function(e,i){return t.selected.includes(i)})))},previewConnectionHandler:function(e){this.$emit("connection:preview",e)},previewConnectionCloseHandler:function(e){this.$emit("connection:preview-hide",e)},copyMessageHandler:function(e){var t=this,i=(e.index,e.content);Object(w["a"])(JSON.stringify(i)).then((function(e){t.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(function(e){t.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},unselect:function(){this.selected.length&&(this.selected=[])},clearConnections:function(){this.connections={},this.connectionsByIndex=[]},closeCurrentConnection:function(){var e=this;this.$emit("close"),this.$nextTick((function(){e.$refs.scroller&&e.$refs.scroller.$el&&(e.$refs.scroller.$el.scrollTop=e.scrollerScrollTop)}))},clearHandler:function(){var e=this;this.$q.dialog({title:"Confirm",message:"Do you really want to clear all connections?",ok:!0,cancel:!0}).onOk((function(){e.$store.commit("".concat(e.moduleName,"/clearMessages"))})).onCancel((function(){}))}},watch:{activeId:function(e){this.active=e},limit:function(e){this.currentLimit=e},type:function(e){this.clearSelected(),this.resetParams(),"connections"===e?(this.newMessagesInterseptor(this.messages),this.filter=this.connectionsFilter):(this.clearConnections(),this.connectionsFilter=this.filter,this.filter="")}},created:function(){var e=this;this.$store.state[this.moduleName]||this.$store.registerModule(this.moduleName,Object(v["a"])({Vue:y["default"],LocalStorage:this.$q.localStorage,name:this.moduleName,errorHandler:function(t){e.$store.commit("reqFailed",t)},filterHandler:this.filterMessage,newMessagesInterseptor:this.newMessagesInterseptor})),this.currentLimit=this.limit,this.activeId&&(this.active=this.activeId),this.offlineHandler=y["default"].connector.socket.on("offline",(function(){e.$store.commit("".concat(e.moduleName,"/setOffline"),e.realtimeEnabled)})),this.connectHandler=y["default"].connector.socket.on("connect",(function(){e.$store.state[e.moduleName].offline&&e.$store.commit("".concat(e.moduleName,"/setReconnected"),e.realtimeEnabled)}))},mounted:function(){this.resetParams()},updated:function(){this.messages.length?this.needAutoScroll&&this.$refs.scroller&&this.$refs.scroller.$el&&(this.$refs.scroller.$el.scrollTop=this.$refs.scroller.$el.scrollHeight):this.currentScrollTop=0},destroyed:function(){this.$store.dispatch("".concat(this.moduleName,"/unsubscribePooling")),void 0!==this.offlineHandler&&y["default"].connector.socket.off("offline",this.offlineHandler),void 0!==this.connectHandler&&y["default"].connector.socket.off("connect",this.connectHandler),this.$store.commit("".concat(this.moduleName,"/clear")),this.$store.unregisterModule(this.moduleName)},mixins:[b["a"]],components:{MessagesListItem:O,VirtualList:x.a,ConnectionsListItem:P,EmptyPane:T["a"],DateRangeModal:f["b"],ConnectionSkeleton:R}},B=F,G=(i("027e"),Object(S["a"])(B,m,u,!1,null,null,null)),W=G.exports,U=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-timeline-entry",{staticClass:"hex-viewer__timeline-element",attrs:{side:0===e.message["proxy.source"]?"left":"right",color:e.eventsColors[e.message["proxy.event"]]+"-6"}},[i("div",{attrs:{slot:"title"},slot:"title"},[i("div",{staticStyle:{"line-height":"18px"}},[i("span",[e._v(e._s(e.eventsDesc[e.message["proxy.event"]]))]),e.message["proxy.source"]?i("span",{staticClass:"q-ml-xs text-grey-5",staticStyle:{"font-size":".8rem"}},[e._v("[target "+e._s(e.message["proxy.source"])+"]")]):e._e()]),i("div",{staticClass:"text-grey-5",staticStyle:{"font-size":".7rem"}},[e._v(e._s(e.date.formatDate(1e3*e.message.timestamp,"DD/MM/YYYY HH:mm:ss")))])]),i("div",{staticClass:"ellipsis",staticStyle:{"word-break":"break-all","font-size":".8rem",height:"1rem"}},[e._v(e._s(e.dataPreview))])])},X=[],J={props:["message","view"],data:function(){return{date:q["b"],eventsColors:{0:"purple",1:"green",2:"red"},eventsDesc:{0:"Data recieved",1:"Connect",2:"Disconnect"}}},computed:{dataPreview:function(){var e=this.message["proxy.payload.hex"]||"";if("text"===this.view&&e){var t=e.match(/.{1,2}/g);e=t.map((function(e){return String.fromCharCode(parseInt(e,16))})).join("")}return e}}},K=J,Q=(i("c954"),Object(S["a"])(K,U,X,!1,null,null,null)),Z=Q.exports,ee=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{ref:"wrapper",on:{click:e.clearSelectedHandler}},[i("q-menu",{attrs:{"context-menu":""}},[e.hex?i("q-list",{staticStyle:{"min-width":"150px","max-height":"300px"},attrs:{separator:""}},[i("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){return e.copy("hex")}}},[i("q-item-section",[e._v("Copy as hex")])],1),i("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){return e.copy("text")}}},[i("q-item-section",[e._v("Copy as raw")])],1),i("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){return e.copy("view")}}},[i("q-item-section",[e._v("Copy as seen")])],1),i("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){return e.exportData("hex")}}},[i("q-item-section",[e._v("Export as hex")])],1),i("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){return e.exportData("text")}}},[i("q-item-section",[e._v("Export as raw")])],1),i("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){return e.exportData("view")}}},[i("q-item-section",[e._v("Export as seen")])],1)],1):e._e()],1),e.hex?i("div",{staticClass:"text-white hex-viewer",style:{wordBreak:"text"===e.view?"break-all":""},on:{click:e.selectAllHandler}},["hex"===e.view?[i("div",{staticClass:"hex-viewer__addresses"},e._l(e.addresses,(function(t){return i("div",{key:t},[e._v(e._s(t.toString(16).padStart(7,0).toUpperCase()))])})),0),i("div",{staticClass:"hex-viewer__value",on:{mouseleave:e.mouseLeaveHandler}},e._l(e.bytesArray,(function(t,s){return i("div",{key:s+t},e._l(t,(function(t,n){return i("span",{key:""+s+n+t,staticClass:"q-pr-xs q-pl-xs q-mt-sm q-mb-sm",class:{selected:e.selected.includes(16*s+n),"--active":e.active===16*s+n||e.start===e.end===16*s+n},on:{mouseover:function(t){return e.setActiveHandler(s,n)},mousedown:function(t){return e.startSelectionHandler(t,s,n)},mouseup:function(t){return e.endSelectionHandler(t,s,n)}}},[e._v(e._s(t))])})),0)})),0),i("div",{staticClass:"hex-viewer__text",on:{mouseleave:e.mouseLeaveHandler}},e._l(e.bytesArray,(function(t,s){return i("div",{key:s+t},e._l(t,(function(t,n){return i("span",{key:""+s+n+t,staticClass:"q-pr-xs q-pl-xs q-mt-sm q-mb-sm",class:{selected:e.selected.includes(16*s+n),"--active":e.active===16*s+n||e.start===e.end===16*s+n},on:{mouseover:function(t){return e.setActiveHandler(s,n)},mousedown:function(t){return e.startSelectionHandler(t,s,n)},mouseup:function(t){return e.endSelectionHandler(t,s,n)}}},[e._v(e._s(e.replaceByteWithDot(t)))])})),0)})),0)]:"text"===e.view?e._l(e.bytesArray,(function(t,s){return i("span",{key:""+s+t,staticClass:"q-mt-sm q-mb-sm",class:{selected:e.selected.includes(s),"--active":e.active===s||e.start===e.end===s,"raw-hex-data":e.isEmptySymbol(t)},on:{mouseover:function(t){return e.setActiveHandler(null,s)},mousedown:function(t){return e.startSelectionHandler(t,null,s)},mouseup:function(t){return e.endSelectionHandler(t,null,s)}}},[e._v(e._s(e.replaceByteWithMnemo(t))),"0A"===t?i("br"):e._e()])})):e._e()],2):i("div",{staticStyle:{"text-align":"center",color:"#9e9e9e","font-size":"3rem","padding-top":"40px"}},[e._v("No HEX data")])],1)},te=[],ie=(i("ed50"),i("6b54"),i("f576"),i("91c8")),se=i.n(ie),ne={name:"HexViewer",props:["hex","view"],data:function(){return{active:-1,start:-1,end:-1,selectionMode:!1,timer:0,clicks:0}},computed:{bytesArray:function(){var e;if("hex"===this.view){var t=this.hex.match(/.{1,32}/g);e=t.map((function(e){return e.match(/.{1,2}/g)}))}else"text"===this.view&&(e=this.hex.match(/.{1,2}/g));return e},addresses:function(){return Y()(0,16*this.hex.match(/.{1,32}/g).length,16)},selected:function(){return-1!==this.start&&-1!==this.end?this.start>this.end?Y()(this.end,this.start+1):Y()(this.start,this.end+1):[]}},watch:{hex:function(){this.start=-1,this.end=-1}},methods:{isEmptySymbol:function(e){var t=parseInt(e,16),i=String.fromCharCode(t);return!!(t<32||t>=127||i.match(/\s/g))},replaceByteWithDot:function(e){var t=parseInt(e,16),i=String.fromCharCode(t);return t<32||t>=127||i.match(/\s/g)?".":i},replaceByteWithMnemo:function(e){var t=parseInt(e,16),i=String.fromCharCode(t);return t<32||t>=127||i.match(/\s/g)&&" "!==i?"\\x".concat(e):i},clearSelectedHandler:function(e){e.target.isEqualNode(this.$refs.wrapper)&&!this.selectionMode&&(this.start=-1,this.end=-1),this.selectionMode&&(this.selectionMode=!1)},startSelectionHandler:function(e,t,i){if(3===e.which)return!1;-1!==this.end&&(this.end=-1),this.selectionMode=!0,this.start=t?16*t+i:i},endSelectionHandler:function(e,t,i){if(3===e.which)return!1;this.end=t?16*t+i:i,this.selectionMode=!1},setActiveHandler:function(e,t){this.selectionMode?this.end=e?16*e+t:t:this.active=e?16*e+t:t},selectAllHandler:function(){var e=this;this.clicks++,1===this.clicks?this.timer=setTimeout((function(){e.clicks=0}),700):(clearTimeout(this.timer),this.clicks=0,this.start=0,this.end=this.hex.match(/.{1,2}/g).length-1)},mouseLeaveHandler:function(){this.active=-1,this.selectionMode&&this.$q.platform.is.desktop&&(this.end=this.hex.match(/.{1,2}/g).length-1)},getContent:function(e,t){var i=this,s="";switch(e){case"hex":if(t&&this.selected.length){var n=this.hex.match(/.{1,2}/g);s=this.selected.map((function(e){return n[e]})).join("")}else s=this.hex;break;case"text":var o=this.hex.match(/.{1,2}/g),c=t&&this.selected.length?this.selected.map((function(e){return o[e]})):o;s=c.map((function(e){return String.fromCharCode(parseInt(e,16))})).join("");break;case"view":if("text"===this.view){var r=t&&this.selected.length?this.selected.map((function(e){return i.bytesArray[e]})):this.bytesArray;s=r.map((function(e){var t=i.replaceByteWithMnemo(e);return"0A"===e&&(t+="\n"),t})).join("")}else{var a=t&&this.selected.length,l=se()(Object.keys(this.hex.match(/.{1,2}/g)),16),d=a?l.reduce((function(e,t){var s=!0,n=t.reduce((function(e,n,o){return n<i.selected[0]||n>i.selected[i.selected.length-1]?e.push(null):(e.push(n),s=!1),o===t.length-1&&(e=s?null:e),e}),[]);return e.push(n),e}),[]):l;d.forEach((function(e,t){if(!e)return!1;s+="".concat(i.addresses[t].toString(16).padStart(7,0).toUpperCase(),"   ");var n=i.bytesArray[t],o="",c="";e.forEach((function(e,t){e?(o+=n[t],c+=i.replaceByteWithDot(n[t])):(o+="  ",c+=" "),o+=" "})),s+=o,s+="   ",s+="".padEnd(32-2*e.length," "),s+="".padEnd(16-e.length," "),s+=c,s+="\n"}))}break}return s},copy:function(e){var t=this,i=this.getContent(e,!0);Object(w["a"])(i).then((function(i){t.$q.notify({type:"positive",icon:"content_copy",message:"".concat(e," copied"),timeout:1e3})}),(function(i){t.$q.notify({type:"negative",icon:"content_copy",message:"Error coping ".concat(e),timeout:1e3})}))},exportData:function(e){var t="hex"===e?"application/octet-stream":"text/plain",i=document.createElement("a"),s=this.getContent(e,!0),n=new Blob([s],{type:t}),o=URL.createObjectURL(n);i.setAttribute("href",o),i.setAttribute("download","data.txt"),i.style.display="none",document.body.appendChild(i),i.click(),document.body.removeChild(i)}}},oe=ne,ce=(i("b0ac"),Object(S["a"])(oe,ee,te,!1,null,null,null)),re=ce.exports,ae=i("a99a"),le=i("2f62"),de=i("286e"),me=i("9b02"),ue=i.n(me);function he(e,t){var i=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),i.push.apply(i,s)}return i}function pe(e){for(var t=1;t<arguments.length;t++){var i=null!=arguments[t]?arguments[t]:{};t%2?he(Object(i),!0).forEach((function(t){d()(e,t,i[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(i)):he(Object(i)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(i,t))}))}return e}var fe={name:"PageHexViewer",props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[de["a"]],data:function(){return{active:null,activeConnection:null,isInit:!1,isItemsInit:!1,needShowGetDeletedAction:!0,selectedMessages:"",typeOfHexView:"hex",left:!0,filter:"",connectionPreview:null}},computed:pe({},Object(le["d"])({isEmptyMessages:function(e){return this.config.messages&&e[this.config.messages.vuexModuleName]&&!e[this.config.messages.vuexModuleName].messages.length},tokenType:function(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},PROXY_PROTOCOL_ID:function(e){var t=e.protocols||{};return Object.keys(t).reduce((function(e,i){return"proxy"===t[i]&&(e=parseInt(i)),e}),0)},items:function(e){var t=this;return Object.values(e.channels||{}).filter((function(e){return t.PROXY_PROTOCOL_ID&&e.protocol_id===t.PROXY_PROTOCOL_ID}))}}),{filteredItems:function(){var e=this.filter.toLowerCase(),t=this.filter?this.items.filter((function(t){return t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0})):this.items;return t.sort((function(e,t){if(!e.name)return-1;if(!t.name)return 1;var i=e.name.toLowerCase(),s=t.name.toLowerCase();return i<s?-1:1})),t},selectedItem:function(){var e=this;return this.items.filter((function(t){return t.id===e.active}))[0]||null},hex:function(){return!(!this.selectedMessages||!this.activeConnection)&&this.selectedMessages.reduce((function(e,t){return e+=t["proxy.payload.hex"]||"",e}),"")}}),methods:pe({},Object(le["b"])(["getDeleted"]),{filterItems:function(e,t){var i=this;if(this.isItemsInit)t();else{var s="channels";this.itemsLoad(s,t,this.active,(function(){i.isItemsInit=!0}))}},unselect:function(){this.$refs.messages.unselect()},getDeletedHandler:function(){var e=this;return a()(c.a.mark((function t(){return c.a.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.getDeleted("channels");case 2:e.needShowGetDeletedAction=!1,e.$refs.itemSelect.reset();case 4:case"end":return t.stop()}}),t)})))()},viewLogsHandler:function(){this.$router.push("/channels/".concat(this.active)).catch((function(e){return e}))},init:function(){var e=this,t="tools/hex",i=ue()(this.settings,"entities[".concat(t,"]"),void 0);this.isInit=!0,this.$route.params&&this.$route.params.id?this.items.filter((function(t){return t.id===Number(e.$route.params.id)})).length?this.active=Number(this.$route.params.id):this.active=null:i&&this.items.filter((function(e){return e.id===i})).length&&(this.active=i),this.$emit("inited")}}),watch:{$route:function(e){e.params&&e.params.id?this.items.filter((function(t){return t.id===Number(e.params.id)})).length?this.active=Number(e.params.id):this.isInit&&(this.active=null):e.params&&!e.params.id&&(this.active=null)},active:function(e){this.activeConnection=null,this.selectedMessages="";var t=this.items.filter((function(t){return t.id===e}))[0]||{};e?(this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:"tools/hex"},value:t.id}),this.$router.push("/tools/hex/".concat(e)).catch((function(e){return e}))):this.$router.push("/tools/hex").catch((function(e){return e}))}},components:{messages:W,HexViewer:re,EntitiesToolbar:ae["a"],MessagePreviewItem:Z}},ve=fe,ge=(i("0472"),Object(S["a"])(ve,s,n,!1,null,null,null));t["default"]=ge.exports},"9a81":function(e,t,i){},a50c:function(e,t,i){"use strict";var s=i("282c"),n=i.n(s);n.a},b0ac:function(e,t,i){"use strict";var s=i("09b6"),n=i.n(s);n.a},c954:function(e,t,i){"use strict";var s=i("9a81"),n=i.n(s);n.a},dd18:function(e,t,i){}}]);