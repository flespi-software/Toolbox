(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[4],{1635:function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",[s("entities-toolbar",{attrs:{item:e.selectedItem}},[s("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[s("div",{staticStyle:{display:"inline-flex"},style:{maxWidth:e.needShowBackToChannel&&e.needShowBackToDevice?"calc(100% - 150px)":e.needShowBackToChannel||e.needShowBackToDevice?"calc(100% - 80px)":"100%"}},[s("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,label:e.active?"Channel":"SELECT CHANNEL",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("channels")>-1,"hide-dropdown-icon":!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("channels")>-1,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+48+"px"}},on:{filter:function(t,s){return e.filterItems("channels",t,s)}},scopedSlots:e._u([{key:"no-option",fn:function(){return[s("div",[s("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),s("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(t){return[e.selectedItem?s("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(e.selectedItem.uri||"<no uri>"))])])],1),s("q-item-section",{staticClass:"text-white",attrs:{side:""}},[s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[s("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},e.filteredItems.length?{key:"option",fn:function(t){return[s("q-item",e._g(e._b({staticClass:"q-pa-xs",attrs:{clickable:""},on:{click:function(s){e.active=t.opt.id}}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(t.opt.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(t.opt.uri||"<no uri>"))])])],1),s("q-item-section",{attrs:{side:""}},[s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[s("small",[e._v("#"+e._s(t.opt.id))])])],1)],1)]}}:null],null,!0)},[s("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[s("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1)])],1),s("transition-group",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[e.needShowBackToChannel?s("q-btn",{key:"channel",staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"60px"},attrs:{title:"View channels",flat:"",dense:""},on:{click:e.viewLogsHandler}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"merge_type"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Channel")])],1):e._e(),e.needShowBackToDevice?s("q-btn",{key:"device",staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"60px"},attrs:{title:"View devices",flat:"",dense:""},on:{click:e.goToDevice}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-developer-board"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Device")])],1):e._e()],1)],1)]),e.active?s("traffic-viewer",{staticClass:"flex",attrs:{active:e.active,"active-device":e.activeDevice,isVisibleToolbar:e.isVisibleToolbar,"device-closeble":e.needShowBackToChannel,config:e.config},on:{"change-active-device":e.changeActiveDeviceHandler}}):e._e(),!e.items.length&&e.isItemsInit?s("div",{staticClass:"text-center text-grey-3 q-mt-lg",staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Compatible channels not found"))]):e._e()],1)},a=[],n=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[e.activeDevice?s("messages",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&!e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"}],ref:"messages",style:{height:"calc(100vh - "+(e.isVisibleToolbar?"100px":"50px")+")",position:"relative",width:e.$q.platform.is.desktop?"25%":"100%",minWidth:"250px"},attrs:{activeId:e.active,limit:e.limit,config:e.config.messages,"device-closeble":e.deviceCloseble,device:e.activeDevice,view:e.typeOfHexView},on:{"view-data":function(t){e.selectedMessages=t},close:function(){e.$emit("change-active-device",null),e.selectedMessages=""}}}):s("devices",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&!e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"}],ref:"devices",style:{height:"calc(100vh - "+(e.isVisibleToolbar?"100px":"50px")+")",position:"relative",width:e.$q.platform.is.desktop?"25%":"100%",minWidth:"250px"},attrs:{activeId:e.active,config:e.config.messages,device:e.activeDevice,view:e.typeOfHexView},on:{"view-data":function(t){e.selectedMessages=t},"change:device":function(t){e.$emit("change-active-device",t)},close:function(){e.$emit("change-active-device",null),e.selectedMessages=""},"device:preview":e.previewShow,"device:preview-hide":e.previewHide}}),s("div",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)"}],style:{width:e.$q.platform.is.desktop?"75%":"100%",maxWidth:e.$q.platform.is.desktop?"calc(100% - 250px)":""}},[e.activeDevice?s("q-toolbar",{staticClass:"bg-grey-9"},[e.$q.platform.is.mobile?s("q-icon",{staticClass:"cursor-pointer",attrs:{color:"white",size:"1.5rem",name:"mdi-close"},nativeOn:{click:function(t){return function(){e.selectedMessages=""}.apply(null,arguments)}}}):e._e(),s("q-toolbar-title",[s("div",{staticClass:"text-white"},[e._v(e._s(e.activeDevice.ident))])]),s("q-btn",{attrs:{color:"white",flat:"",dense:"",label:"hex"===e.typeOfHexView?"text":"hex","icon-right":"hex"===e.typeOfHexView?"mdi-format-text":"mdi-matrix"},on:{click:function(t){e.typeOfHexView="hex"===e.typeOfHexView?"text":"hex"}}},[s("q-tooltip",[e._v("Change view mode to "+e._s("hex"===e.typeOfHexView?"text":"hex"))])],1),e.activeDevice?s("q-btn",{attrs:{color:"white",flat:"",dense:"",icon:"mdi-export-variant"}},[s("q-tooltip",[e._v("Export")]),s("q-menu",{attrs:{"no-route-dismiss":""}},[s("q-list",{staticClass:"bg-grey-8 text-white",staticStyle:{"min-width":"150px"}},[s("div",{staticClass:"q-pa-sm"},[s("div",{staticStyle:{"font-size":".8rem"}},[e._v("Copy selected packets as")]),s("div",[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"shown"},on:{click:function(t){return e.copySelected()}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"hex"},on:{click:function(t){return e.copySelected("hex")}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"raw"},on:{click:function(t){return e.copySelected("text")}}})],1)]),s("q-separator"),s("div",{staticClass:"q-pa-sm"},[s("div",{staticStyle:{"font-size":".8rem"}},[e._v("Export selected packets as")]),s("div",[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"shown"},on:{click:function(t){return e.exportSelected()}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"hex"},on:{click:function(t){return e.exportSelected("hex")}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"raw"},on:{click:function(t){return e.exportSelected("text")}}})],1)]),s("q-separator"),s("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){e.$refs.messages&&e.$refs.messages.exportModalOpen()}}},[s("q-item-section",[e._v("Export by time")])],1)],1)],1)],1):e._e()],1):e._e(),e.activeDevice?s("packet-view",{style:{height:"calc(100vh - "+(e.isVisibleToolbar&&e.activeDevice?"150px":"100px")+")",position:"relative",overflow:"auto"},attrs:{packets:e.selectedMessages,view:e.typeOfHexView}}):e.$q.platform.is.desktop&&e.devicePreview&&e.devicePreviewMessages.length?s("div",{staticClass:"q-pa-md",staticStyle:{overflow:"hidden","max-height":"calc(100vh - 100px)"}},[s("q-timeline",{attrs:{layout:"loose",color:"white",dark:""}},e._l(e.devicePreviewMessages,(function(t,i){return s("message-preview-item",{key:i,attrs:{message:t,view:e.typeOfHexView}})})),1)],1):s("div",{staticStyle:{"text-align":"center",color:"#9e9e9e","font-size":"3rem","padding-top":"40px"}},[s("div",[e._v("Select ident")]),s("q-icon",{attrs:{name:"mdi-arrow-down-bold-outline",size:"3rem"}}),s("div",[e._v("Find message")]),s("q-icon",{attrs:{name:"mdi-arrow-down-bold-outline",size:"3rem"}}),s("div",[e._v("Analyze data")])],1)],1)],1)},o=[],l=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{ref:"wrapper"},[s("q-resize-observer",{on:{resize:e.wrapperResizeHandler}}),s("div",[s("q-toolbar",{staticClass:"bg-grey-9"},[e.deviceCloseble?s("q-btn",{staticClass:"text-white",attrs:{flat:"",dense:"",rounded:"",icon:"mdi-arrow-left"},on:{click:e.closeDevice}},[s("q-tooltip",[e._v("Close current device")])],1):e._e(),e.deviceCloseble?s("q-toolbar-title"):e._e(),s("date-range-modal",{staticClass:"flex flex-center",attrs:{date:e.dateRange,theme:e.theme},on:{save:e.dateRangeChange}})],1),e.loadingFlag&&e.itemsCount>0?s("div",{staticClass:"absolute-bottom-right absolute-top-left",staticStyle:{overflow:"hidden",top:"50px"}},e._l(new Array(e.itemsCount).fill(""),(function(e,t){return s("message-skeleton",{key:t})})),1):!e.loadingFlag&&e.messages.length?[s("VirtualList",{ref:"scroller",class:{"bg-grey-9":!0,"text-white":!0,"cursor-pointer":!0},style:{position:"absolute",top:"50px",bottom:0,right:0,left:0,height:"auto"},attrs:{onscroll:e.listScroll,size:e.itemHeight,remain:e.itemsCount,wclass:"q-w-list"}},e._l(e.messages,(function(t,i){return s("messages-list-item",{key:i,attrs:{item:t,index:i,actions:e.actions,itemHeight:e.itemHeight,selected:e.selected.includes(i),view:e.view},on:{action:e.actionHandler,"item-click":e.messageClickHandler},nativeOn:{mouseenter:function(s){return e.highlightConn(t.conn)},mouseleave:function(t){return e.highlightConn(null)}}})})),1)]:s("empty-pane",{attrs:{config:e.config.emptyState}})],2),s("export-modal",{ref:"export",attrs:{format:e.view,dateRange:e.dateRange,config:e.config,ident:e.device.ident,"item-id":e.activeId}})],1)},r=[],c=(s("ddb0"),s("e9c4"),s("89c1")),d=s.n(c),h=s("9b02"),m=s.n(h),u=s("0f32"),p=s.n(u),g=s("de45"),v=s("cdde"),f=s("e812"),w=s("121a"),$=s("3ba5"),b=s("5a3a"),x=s.n(b),y=s("5de8"),q=s("6126"),C=s("c853"),k={props:["activeId","device","limit","config","view","deviceCloseble"],data(){return{theme:this.config.theme,viewConfig:this.config.viewConfig,actions:this.config.actions,moduleName:this.config.vuexModuleName,itemHeight:53,itemsCount:0,wrapperHeight:0,needAutoScroll:!0,selected:[],scrollerScrollTop:0,isInit:!1}},computed:{messages:{get(){return this.$store.state[this.moduleName].messages},set(e){this.$store.commit(`${this.moduleName}/setMessages`,e)}},currentLimit:{get(){return this.$store.state[this.moduleName].limit},set(e){this.$store.commit(`${this.moduleName}/setLimit`,e)}},dateRange(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},from:{get(){return this.$store.state[this.moduleName].from},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setFrom`,e)}},to:{get(){return this.$store.state[this.moduleName].to},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setTo`,e)}},realtimeEnabled(){return this.$store.state[this.moduleName].messagePolling},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)}},methods:{resetParams(){if(!this.$refs.wrapper)return!1;if(this.wrapperHeight=this.$refs.wrapper.offsetHeight-this.itemHeight,this.itemsCount=Math.ceil(this.wrapperHeight/this.itemHeight),this.$refs.scroller&&this.$refs.scroller.forceRender(),this.$refs.scroller&&this.$refs.scroller.$el){const e=this.$refs.scroller.$el;e.scrollTop+=1}},dateRangeChangeHandler(e){const t=e[0],s=e[1];if(this.from===t&&this.to===s)return!1;this.from=t,this.to=s,this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.needAutoScroll&&s<=Date.now()&&(this.needAutoScroll=!1),this.$store.commit(`${this.moduleName}/clearMessages`),this.$store.dispatch(`${this.moduleName}/getMessages`).then((()=>{s>Date.now()&&this.$store.dispatch(`${this.moduleName}/pollingGetMessages`)}))},dateRangeChange(e){this.updateRoute({query:{from:e[0]/1e3,to:e[1]/1e3}})},clearSelected(){this.selected=[]},wrapperResizeHandler(){this.resetParams()},getScrollDirection(e){let t=null;return t=e>this.currentScrollTop?"bottom":e<this.currentScrollTop?"top":"none",t},listScroll:function(e,t){const{offset:s}=t;this.currentScrollTop||(this.currentScrollTop=s);const i=m()(this.$refs,"scroller.$el",void 0);if(!i)return!1;const a=i.scrollHeight-i.clientHeight,n=this.getScrollDirection(s),o=.1*a;this.allScrollTop=this.$refs.scroller?this.$refs.scroller.$el.scrollHeight-this.$refs.scroller.$el.clientHeight:0,this.messages.length&&(s<this.currentScrollTop&&this.needAutoScroll?this.needAutoScroll=!1:!this.needAutoScroll&&this.realtimeEnabled&&s>=this.allScrollTop&&(this.needAutoScroll=!0),this.currentScrollTop=s),n&&("top"===n||"none"===n)&&s<o?this.debouncedGetMessagesPrev():n&&("bottom"===n||"none"===n)&&s+o>=a&&this.debouncedGetMessagesNext()},getMessagesPrev(){const e=m()(this.$refs,"scroller.$el",void 0),t=e.scrollHeight-e.clientHeight,s=e.scrollTop;this.$store.dispatch(`${this.moduleName}/getMessagesPrev`).then((i=>{if(i&&i.length){const i=e.scrollHeight-e.clientHeight;e.scrollTop=i-t+s}}))},getMessagesNext(){this.$store.dispatch(`${this.moduleName}/getMessagesNext`)},actionHandler({index:e,type:t,content:s}){switch(t){case"view":this.viewMessagesHandler({index:e,content:s});break;case"copy":this.copyMessageHandler({index:e,content:s});break}},viewMessagesHandler({index:e,content:t}){this.selected=[e],this.$root.$emit("view-data",t)},messageClickHandler({index:e,content:t,event:s}){if(s.shiftKey)this.selected[0]?this.selected[0]>e?this.selected=x()(e,this.selected[0]+1):this.selected=x()(this.selected[0],e+1):this.selected=[e];else if(s.ctrlKey||s.metaKey)if(this.selected.includes(e)){const t=this.selected;t.splice(this.selected.indexOf(e),1),this.selected=t}else this.selected=[...this.selected,e];else this.selected=[e];this.needAutoScroll&&(this.needAutoScroll=!1),this.selected.sort(((e,t)=>e-t)),this.$emit("view-data",this.selected.map((e=>({...this.messages[e],index:e}))))},copyMessageHandler({index:e,content:t}){Object(v["a"])(JSON.stringify(t)).then((e=>{this.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(e=>{this.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},unselect(){this.selected.length&&(this.selected=[])},closeDevice(){this.$emit("close")},clear(){this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.$store.commit(`${this.moduleName}/clearMessages`),this.closeDevice()},exportModalOpen(){this.$refs.export.show()},highlightIncoming(e){const t=e=>2===e||130===e||66===e||34===e,{incomingMessageIndex:s,incomingMessageIndexEnd:i}=this.messages.reduce(((s,i,a)=>(t(i.type)&&(-1===s.incomingMessageIndex&&(s.incomingMessageIndex=a),2===i.type&&Math.floor(i.timestamp)===Math.floor(e)&&-1===s.incomingMessageIndexEnd&&(s.incomingMessageIndexEnd=a),2!=i.type&&Math.floor(i.timestamp)===Math.floor(e)&&(s.incomingMessageIndexEnd=a)),s)),{incomingMessageIndex:-1,incomingMessageIndexEnd:-1});i>-1?this.messageClickHandler({index:i,event:{}}):s>-1&&this.messageClickHandler({index:s,event:{}})},async init(){this.currentLimit=this.limit,this.activeId&&!this.$store.state[this.moduleName].active&&this.$store.commit(`${this.moduleName}/setActive`,this.activeId),this.device&&!this.$store.state[this.moduleName].ident&&this.$store.commit(`${this.moduleName}/setIdent`,this.device.ident);this.$route.query.error&&JSON.parse(this.$route.query.error);const e=1e3*this.$route.query.from,t=1e3*this.$route.query.to,s=this.$route.query.highlight||e;e&&t?(this.from=e,this.to=t,await this.$store.dispatch(`${this.moduleName}/getMessages`),this.$nextTick((()=>this.highlightIncoming(s)))):(await this.$store.dispatch(`${this.moduleName}/initTime`),await this.$store.dispatch(`${this.moduleName}/getMessagesTail`)),this.to>Date.now()&&await this.$store.dispatch(`${this.moduleName}/pollingGetMessages`),this.updateRoute({query:{from:this.from/1e3,to:this.to/1e3}},!0),this.isInit=!0}},watch:{activeId(e){this.clear()},limit(e){this.currentLimit=e},$route(e){const t=1e3*e.query.from,s=1e3*e.query.to;t&&s&&(this.dateRange[0]!==t||this.dateRange[1]!==s)&&this.dateRangeChangeHandler([t,s])}},created(){this.debouncedGetMessagesPrev=p()(this.getMessagesPrev,2e3,{trailing:!1}),this.debouncedGetMessagesNext=p()(this.getMessagesNext,2e3,{trailing:!1}),this.init()},mounted(){this.resetParams()},updated(){this.messages.length?this.needAutoScroll&&this.$refs.scroller&&this.$refs.scroller.$el&&(this.$refs.scroller.$el.scrollTop=this.$refs.scroller.$el.scrollHeight):this.currentScrollTop=0},destroyed(){this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.$store.commit(`${this.moduleName}/clearMessages`),this.to=0,this.from=0},mixins:[q["a"],C["a"]],components:{MessagesListItem:f["a"],VirtualList:d.a,EmptyPane:w["a"],MessageSkeleton:$["a"],DateRangeModal:g["a"],ExportModal:y["a"]}},M=k,S=s("2877"),I=s("3980"),N=s("65c6"),D=s("9c40"),_=s("05c0"),H=s("6ac5"),T=s("eebe"),P=s.n(T),E=Object(S["a"])(M,l,r,!1,null,null,null),L=E.exports;P()(E,"components",{QResizeObserver:I["a"],QToolbar:N["a"],QBtn:D["a"],QTooltip:_["a"],QToolbarTitle:H["a"]});var O=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{ref:"wrapper"},[s("q-resize-observer",{on:{resize:e.wrapperResizeHandler}}),s("div",[s("q-toolbar",{staticClass:"bg-grey-9"},[s("q-input",{staticClass:"full-width",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"ident",debounce:500},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1),e.loadingFlag&&e.itemsCount>0?s("div",{staticClass:"absolute-bottom-right absolute-top-left",staticStyle:{overflow:"hidden",top:"50px"}},e._l(new Array(e.itemsCount).fill(""),(function(e,t){return s("device-skeleton",{key:t})})),1):!e.loadingFlag&&e.devicesByIndex.length?[s("VirtualList",{ref:"scroller",class:{"bg-grey-9":!0,"text-white":!0,"cursor-pointer":!0},style:{position:"absolute",top:"50px",bottom:0,right:0,left:0,height:"auto"},attrs:{size:e.itemHeight,remain:e.itemsCount,wclass:"q-w-list"}},e._l(e.devices,(function(t,i){return s("device-list-item",{key:t.ident,attrs:{item:t,index:i,itemHeight:e.itemHeight},on:{"item-click":e.deviceClickHandler},nativeOn:{mouseenter:function(s){return e.previewDeviceHandler(t)},mouseleave:function(s){return e.previewDeviceCloseHandler(t)}}})})),1)]:s("empty-pane",{attrs:{config:e.config.emptyState}})],2)],1)},Q=[],R=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-item",{staticClass:"q-py-none",attrs:{clickable:""},on:{click:function(t){e.itemClickHandler(e.index,e.item,t)}}},[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis text-white q-pa-none",attrs:{header:""}},[e._v(e._s(e.ident))]),s("q-item-label",{staticClass:"ellipsis overflow-hidden text-grey-5",attrs:{caption:""}},[e._v(e._s(e.item.size?e.format.humanStorageSize(e.item.size):"new"))])],1)],1)},z=[],F=s("bd4c"),A=s("7937"),V={props:["item","index","itemHeight"],data(){return{date:F["a"],format:A["c"],ident:this.item.ident}},methods:{itemClickHandler(e,t,s){this.$emit("item-click",{index:e,content:t,event:s})}}},B=V,G=s("66e5"),j=s("4074"),J=s("0170"),W=Object(S["a"])(B,R,z,!1,null,null,null),Y=W.exports;P()(W,"components",{QItem:G["a"],QItemSection:j["a"],QItemLabel:J["a"]});var K=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-item",{staticClass:"bg-grey-9"},[s("q-item-section",[s("q-item-label",{staticClass:"q-pa-none bg-white full-width skeleton--modificator",staticStyle:{height:"16px"},attrs:{header:""}}),s("q-item-label",{staticClass:"bg-grey-6  full-width skeleton--modificator",staticStyle:{height:"15px"},attrs:{caption:""}})],1)],1)},U=[],X=(s("29e0"),{}),Z=Object(S["a"])(X,K,U,!1,null,null,null),ee=Z.exports;P()(Z,"components",{QItem:G["a"],QItemSection:j["a"],QItemLabel:J["a"]});var te={props:["activeId","device","config","view"],data(){return{theme:this.config.theme,viewConfig:this.config.viewConfig,actions:this.config.actions,moduleName:this.config.vuexModuleName,itemHeight:48,itemsCount:0,wrapperHeight:0}},computed:{selectedChannel(){const e=this.$store.state.channels[this.activeId],t=this.$store.state.channelsProtocols[e.protocol_id].features;return e.features=t,e},devices:{get(){return this.$store.state[this.moduleName].devices},set(e){this.$store.commit(`${this.moduleName}/setDevices`,e)}},devicesByIndex(){return Object.values(this.$store.state[this.moduleName].devices)},filter:{get(){return this.$store.state[this.moduleName].deviceFilter},set(e){this.$store.commit(`${this.moduleName}/setDeviceFilter`,e),this.$store.dispatch(`${this.moduleName}/getDevices`).then((()=>{this.$nextTick((()=>{this.$refs.scroller&&this.$refs.scroller.forceRender()}))}))}},active:{get(){return this.$store.state[this.moduleName].active},async set(e){this.realtimeEnabled&&await this.$store.dispatch(`${this.moduleName}/removePollingGetDevices`),this.$store.commit(`${this.moduleName}/setActive`,e),this.$store.commit(`${this.moduleName}/clearDevices`),await this.$store.dispatch(`${this.moduleName}/getDevices`),this.selectedChannel.features.shared_connection||await this.$store.dispatch(`${this.moduleName}/pollingGetDevices`)}},realtimeEnabled(){return this.$store.state[this.moduleName].realtimeEnabled},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)}},methods:{resetParams(){if(!this.$refs.wrapper)return!1;this.wrapperHeight=this.$refs.wrapper.offsetHeight-this.itemHeight,this.itemsCount=Math.ceil(this.wrapperHeight/this.itemHeight),this.$refs.scroller&&this.$refs.scroller.forceRender()},wrapperResizeHandler(){this.resetParams()},deviceClickHandler({index:e,content:t,event:s}){this.$store.commit(`${this.moduleName}/setIdent`,t.ident),this.$emit("change:device",t)},previewDeviceHandler(e){this.$emit("device:preview",e)},previewDeviceCloseHandler(e){this.$emit("device:preview-hide",e)},clearDevices(){this.devices={}}},watch:{activeId(e){this.active=e}},created(){const e=this.$route.query.filter;e&&this.$store.commit(`${this.moduleName}/setDeviceFilter`,e),this.activeId&&(this.active=this.activeId)},mounted(){this.resetParams()},beforeDestroy(){this.$store.dispatch(`${this.moduleName}/removePollingGetDevices`)},components:{VirtualList:d.a,DeviceListItem:Y,EmptyPane:w["a"],DeviceSkeleton:ee}},se=te,ie=s("27f9"),ae=s("0016"),ne=Object(S["a"])(se,O,Q,!1,null,null,null),oe=ne.exports;P()(ne,"components",{QResizeObserver:I["a"],QToolbar:N["a"],QInput:ie["a"],QIcon:ae["a"]});var le=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-timeline-entry",{staticClass:"hex-viewer__timeline-element",attrs:{side:2===e.message.type||130===e.message.type?"left":"right",color:e.eventsColors[e.message.type]+"-6"}},[s("div",{attrs:{slot:"title"},slot:"title"},[s("div",{staticStyle:{"line-height":"18px"}},[s("span",[e._v(e._s(e.eventsDesc[e.message.type]))])]),s("div",{staticClass:"text-grey-5",staticStyle:{"font-size":".7rem"}},[e._v("\n      "+e._s(e.date.formatDate(1e3*e.message.timestamp,"DD/MM/YYYY HH:mm:ss.SSS"))+"\n      "),s("small",{staticClass:"rounded-borders q-mx-xs q-px-xs text-white",class:{"bg-blue":"tcp"===e.transport,"bg-pink-4":"udp"===e.transport,"bg-green-9":"http"===e.transport,"bg-purple-9":"mqtt"===e.transport}},[e._v(e._s(e.transport))])])]),s("div",{staticClass:"ellipsis",staticStyle:{"word-break":"break-all","font-size":".8rem",height:"1rem"}},[e._v(e._s(e.dataPreview))])])},re=[],ce=s("c423"),de={props:["message","view"],data(){return{date:F["a"],transports:{2:"tcp",66:"http",67:"http",130:"udp",3:"tcp",131:"udp",32:"mqtt",33:"mqtt",34:"mqtt",35:"mqtt"},eventsColors:{0:"green",32:"green",1:"red",33:"red",2:"purple",130:"purple",66:"purple",34:"purple",3:"yellow",67:"yellow",131:"yellow",35:"yellow"},eventsDesc:{0:"Connect",32:"Connect",1:"Disconnect",33:"Disconnect",2:"Data received",130:"Data received",66:"Data received",34:"Data received",3:"Data sent",67:"Data sent",131:"Data sent",35:"Data sent"},eventIcons:{0:"mdi-lan-connect",32:"mdi-lan-connect",1:"mdi-lan-disconnect",33:"mdi-lan-disconnect",2:"mdi-arrow-right-thick",130:"mdi-arrow-right-thick",66:"mdi-arrow-right-thick",34:"mdi-arrow-right-thick",3:"mdi-arrow-left-thick",67:"mdi-arrow-left-thick",35:"mdi-arrow-left-thick",131:"mdi-arrow-left-thick"}}},computed:{dataPreview(){let e=this.base64ToHex(this.message.data)||"";if("text"===this.view&&e){const t=e.match(/.{1,2}/g);e=t.map((e=>this.replaceByteWithMnemo(e))).join("")}return e},transport(){return this.transports[this.message.type]}},mixins:[ce["a"]]},he=de,me=(s("cb33"),s("74af")),ue=s("05eb"),pe=Object(S["a"])(he,le,re,!1,null,null,null),ge=pe.exports;P()(pe,"components",{QTimelineEntry:me["a"],QTimeline:ue["a"]});var ve=s("73bb"),fe=(s("26e9"),s("2b0e"));function we(e){const t=e||Date.now(),s=new Date(t).setHours(0,0,0,0),i=s+86399999.999;return{from:s,to:i}}async function $e({state:e,commit:t}){let s=Date.now();try{const t=await fe["default"].connector.gw.getChannelsIdentsPackets(e.active,e.ident,{data:{count:1,reverse:!0}});s=m()(t,"data.result[0].timestamp",Math.floor(Date.now()/1e3)),s=Math.round(1e3*s)}catch(a){}const i=we(s);t("setFrom",i.from),t("setTo",i.to)}async function be({state:e,commit:t}){"undefined"!==typeof e.isLoading&&fe["default"].set(e,"isLoading",!0);try{const s=await fe["default"].connector.gw.getChannelsIdents(e.active,e.deviceFilter?`*${e.deviceFilter}*`:"*");let i=m()(s,"data.result",[]);i=i.reduce(((e,{ident:t,size:s})=>(e[t]={ident:t,size:s},e)),{}),t("setDevices",i)}catch(s){t("reqFailed",s)}"undefined"!==typeof e.isLoading&&fe["default"].set(e,"isLoading",!1)}async function xe({state:e,commit:t}){"undefined"!==typeof e.isLoading&&fe["default"].set(e,"isLoading",!0);try{const s=Date.now(),i=e.to>s?s:e.to,a=await fe["default"].connector.gw.getChannelsIdentsPackets(e.active,e.ident,{data:{from:e.from/1e3,to:i/1e3,count:e.limit}}),n=m()(a,"data.result",[]);t("setMessages",n)}catch(s){t("reqFailed",s)}"undefined"!==typeof e.isLoading&&fe["default"].set(e,"isLoading",!1)}async function ye({state:e,commit:t}){"undefined"!==typeof e.isLoading&&fe["default"].set(e,"isLoading",!0);try{const s=Date.now(),i=e.to>s?s:e.to,a=await fe["default"].connector.gw.getChannelsIdentsPackets(e.active,e.ident,{data:{count:e.limit,reverse:!0,from:e.from/1e3,to:i/1e3}}),n=m()(a,"data.result",[]);n.reverse(),t("setMessages",n)}catch(s){t("reqFailed",s)}"undefined"!==typeof e.isLoading&&fe["default"].set(e,"isLoading",!1)}let qe=!1;async function Ce({state:e,commit:t}){if(!e.messages.length||qe||e.messagePolling)return;qe=!0;let s=[];try{const i=e.messages[e.messages.length-1].timestamp+1e-6,a=await fe["default"].connector.gw.getChannelsIdentsPackets(e.active,e.ident,{data:{count:e.limit,from:i,to:e.to/1e3}});s=m()(a,"data.result",[]),t("setMessagesAppend",s)}catch(i){t("reqFailed",i)}return qe=!1,s}async function ke({state:e,commit:t}){if(!e.messages.length||qe)return;qe=!0;let s=[];try{const i=e.messages[0].timestamp-1e-6,a=await fe["default"].connector.gw.getChannelsIdentsPackets(e.active,e.ident,{data:{count:e.limit,from:e.from/1e3,to:i,reverse:!0}});s=m()(a,"data.result",[]),s.reverse(),t("setMessagesPrepend",s)}catch(i){t("reqFailed",i)}return qe=!1,s}async function Me({state:e,commit:t}){await fe["default"].connector.socket.subscribe({name:`flespi/log/gw/channels/${e.active}/connections/+/identified`,handler:(t,s,i)=>{t=JSON.parse(t.toString());const a=t.ident;e.devices[a]||-1===a.indexOf(e.deviceFilter)||fe["default"].set(e.devices,a,{ident:a})}}),e.realtimeEnabled=!0}async function Se({state:e,commit:t}){e.realtimeEnabled=!1,await fe["default"].connector.socket.unsubscribe(`flespi/log/gw/channels/${e.active}/connections/+/identified`)}let Ie=0;function Ne({state:e,commit:t}){Ie=setInterval((async()=>{try{const s=e.messages[e.messages.length-1].timestamp+1e-6,i=Math.ceil(Date.now()/1e3),a=await fe["default"].connector.gw.getChannelsIdentsPackets(e.active,e.ident,{data:{from:s,to:i}}),n=m()(a,"data.result",[]);t("setMessagesAppend",n)}catch(s){t("reqFailed",s)}}),1e4),e.messagePolling=!0}function De({state:e,commit:t}){clearInterval(Ie),Ie=0,e.messagePolling=!1}async function _e({state:e},t){let s=[];try{const i=await fe["default"].connector.gw.getChannelsIdentsPackets(e.active,t.ident,{data:{count:20,reverse:!0}});s=m()(i,"data.result",[])}catch(i){}return s}async function He({state:e},{from:t,to:s}){let i=[];try{const a=await fe["default"].connector.gw.getChannelsIdentsPackets(e.active,e.ident,{data:{from:t,to:s}});i=m()(a,"data.result",[])}catch(a){}return i}var Te={initTime:$e,getMessages:xe,getMessagesTail:ye,getMessagesNext:Ce,getMessagesPrev:ke,getDevices:be,pollingGetDevices:Me,removePollingGetDevices:Se,pollingGetMessages:Ne,removePollingGetMessages:De,getDevicePreview:_e,getExportData:He};function Pe(e,t){e.limit=t}function Ee(e,t){e.active=t}function Le(e){e.messages=[]}function Oe(e){e.devices=[]}function Qe(e,t){e.devices=t}function Re(e,t){e.messages=t}function ze(e,t){t.length&&e.messages.splice(e.messages.length,0,...t)}function Fe(e,t){t.length&&e.messages.splice(0,0,...t)}function Ae(e,t){e.to=t}function Ve(e,t){e.from=t}function Be(e,t){e.deviceFilter=t}function Ge(e,t){e.ident=t}function je(e){e.devices={},e.messages=[],e.to=0,e.from=0,e.active=null,e.ident=null}function Je(e,t){}var We={setLimit:Pe,setActive:Ee,clearMessages:Le,clearDevices:Oe,setDevices:Qe,setMessages:Re,setMessagesAppend:ze,setMessagesPrepend:Fe,clean:je,setTo:Ae,setFrom:Ve,setDeviceFilter:Be,setIdent:Ge,reqFailed:Je};const Ye={devices:{},messages:[],active:null,ident:null,limit:0,deviceFilter:"",from:0,to:0,isLoading:!1,realtimeEnabled:!1,messagePolling:!1};var Ke={namespaced:!0,state:Ye,actions:Te,mutations:We},Ue=s("798f"),Xe={props:["active","activeDevice","isVisibleToolbar","config","deviceCloseble"],data(){return{devicePreview:null,typeOfHexView:"hex",limit:1e3,selectedMessages:"",moduleName:this.config.messages.vuexModuleName,devicePreviewMessages:[]}},computed:{hex(){return!(!this.selectedMessages||!this.activeDevice)&&this.selectedMessages.reduce(((e,t)=>(e+=this.base64ToHex(t.data)||"",e)),"")}},methods:{async previewShow(e){this.devicePreview=e,this.devicePreviewMessages=await this.$store.dispatch(`${this.moduleName}/getDevicePreview`,e)},previewHide(e){this.devicePreview=null},getContentBySelected(e){return this.selectedMessages.reduce(((t,s)=>(t+=this.getHeader(s),t+="\r\n",s.data&&(t+=this.getContent(e,this.base64ToHex(s.data),this.typeOfHexView)),t+="\r\n",t)),"")},copySelected(e="view"){const t=this.getContentBySelected(e);this.copy(t,e)},exportSelected(e="view"){const t=this.getContentBySelected(e);this.exportData(t,e)}},created(){this.$store.state[this.moduleName]||this.$store.registerModule(this.moduleName,Ke)},destroyed(){this.$store.commit(`${this.moduleName}/clean`),this.$store.unregisterModule(this.moduleName)},watch:{active(){this.selectedMessages="",this.devicePreview=null}},mixins:[Ue["a"]],components:{Devices:oe,Messages:L,MessagePreviewItem:ge,PacketView:ve["a"]}},Ze=Xe,et=s("4e73"),tt=s("1c1c"),st=s("eb85"),it=s("7f67"),at=Object(S["a"])(Ze,n,o,!1,null,null,null),nt=at.exports;P()(at,"components",{QToolbar:N["a"],QIcon:ae["a"],QToolbarTitle:H["a"],QBtn:D["a"],QTooltip:_["a"],QMenu:et["a"],QList:tt["a"],QSeparator:st["a"],QItem:G["a"],QItemSection:j["a"],QTimeline:ue["a"]}),P()(at,"directives",{ClosePopup:it["a"]});var ot=s("a99a"),lt=s("2f62"),rt=s("286e"),ct={name:"PageTrafficViewer",props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[rt["a"]],data(){return{active:null,activeDevice:null,relatedDeviceId:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,filter:"",prevEntity:null,prevRoute:null,isIntegration:this.$q.platform.within.iframe}},computed:{...Object(lt["d"])({tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},items(e){return Object.values(e.channels||{}).filter((t=>e.channelsProtocols[t.protocol_id].features.raw_packets))}}),filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const s=e.name.toLowerCase(),i=t.name.toLowerCase();return s<i?-1:1})),t},selectedItem(){return this.items.filter((e=>e.id===this.active))[0]||null},needShowBackToChannel(){return this.active&&(!this.isIntegration||this.isIntegration&&("channels"===this.prevEntity&&!this.isNeedSelect||this.isNeedSelect&&!("string"===typeof this.isNeedSelect&&this.isNeedSelect.indexOf("channels")>-1)))},needShowBackToDevice(){return this.active&&this.activeDevice&&this.relatedDeviceId&&(!this.isIntegration||this.isIntegration&&("devices"===this.prevEntity&&!this.isNeedSelect||this.isNeedSelect))}},methods:{changeActiveDeviceHandler(e){this.setActiveDevice(e),this.active?this.activeDevice?this.$router.push(`/tools/traffic/${this.active}/ident/${e.ident}`).catch((e=>e)):this.$router.push(`/tools/traffic/${this.active}`).catch((e=>e)):this.$router.push("/tools/traffic").catch((e=>e))},unselect(){this.$refs.messages.unselect()},viewLogsHandler(){"channels"===this.prevEntity&&this.prevRoute&&this.prevRoute.params.id===this.active?this.$router.push(this.prevRoute).catch((e=>e)):this.$router.push(`/channels/${this.active}`).catch((e=>e))},setActiveDevice(e){this.activeDevice=e,this.getRelatedDeviceId()},getRelatedDeviceId(){this.activeDevice?this.$connector.gw.getChannelProtocolsDeviceTypes(this.selectedItem.protocol_id,"all",{fields:"id"}).then((e=>{const t=m()(e,"data.result",[]);return t.map((e=>e.id))})).then((e=>{this.$connector.gw.getDevices(`configuration.ident=${this.activeDevice.ident}`,{fields:"id,device_type_id"}).then((t=>{const s=m()(t,"data.result",[]),i=s.reduce(((t,s)=>t||(e.includes(s.device_type_id)?s.id:t)),0);this.relatedDeviceId=i}))})):this.relatedDeviceId=null},goToDevice(){"devices"===this.prevEntity&&this.prevRoute&&this.prevRoute.params.id===this.relatedDeviceId?this.$router.push(this.prevRoute).catch((e=>e)):this.$router.push(`/devices/${this.relatedDeviceId}`).catch((e=>e))},init(){const e="tools/traffic",t=m()(this.settings,`entities[${e}]`,void 0);this.isInit=!0,this.$route.params&&this.$route.params.id?this.items.filter((e=>e.id===Number(this.$route.params.id))).length?(this.active=Number(this.$route.params.id),this.$route.params.ident&&this.setActiveDevice({ident:this.$route.params.ident})):this.active=null:t&&this.items.filter((e=>e.id===t)).length&&(this.active=t),this.$emit("inited")}},beforeRouteEnter(e,t,s){s((e=>{e.prevRoute=t,e.prevEntity=t.meta.moduleName}))},watch:{$route(e){e.params&&e.params.id?this.items.filter((t=>t.id===Number(e.params.id))).length?(this.active=Number(e.params.id),this.$route.params.ident&&this.setActiveDevice({ident:this.$route.params.ident})):this.isInit&&(this.active=null):e.params&&!e.params.id&&(this.active=null)},active(e){const t=this.items.filter((t=>t.id===e))[0]||{};e&&this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:"tools/traffic"},value:t.id})}},components:{TrafficViewer:nt,EntitiesToolbar:ot["a"]}},dt=ct,ht=(s("8b7b"),s("9989")),mt=s("ddd8"),ut=s("8572"),pt=Object(S["a"])(dt,i,a,!1,null,null,null);t["default"]=pt.exports;P()(pt,"components",{QPage:ht["a"],QSelect:mt["a"],QInput:ie["a"],QIcon:ae["a"],QItem:G["a"],QItemSection:j["a"],QItemLabel:J["a"],QBtn:D["a"],QField:ut["a"]})},2510:function(e,t,s){},"29e0":function(e,t,s){"use strict";s("69d5b")},"69d5b":function(e,t,s){},"8b7b":function(e,t,s){"use strict";s("2510")},cb33:function(e,t,s){"use strict";s("efe3")},efe3:function(e,t,s){}}]);