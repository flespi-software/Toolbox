(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"06b0":function(e,t,s){"use strict";s("5288")},"14a7":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",[s("entities-toolbar",{attrs:{item:e.selectedItem}},[s("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[s("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,"hide-dropdown-icon":!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("devices")>-1,label:e.active?"Device":"SELECT DEVICE",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("devices")>-1,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+48+(e.filteredItems.length?0:4)+"px"}},on:{filter:function(t,s){return e.filterItems("devices",t,s)}},scopedSlots:e._u([{key:"no-option",fn:function(){return[s("div",{staticStyle:{"min-height":"77px"}},[s("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),s("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(t){return[e.selectedItem?s("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(e.selectedItem.configuration&&e.selectedItem.configuration.ident?e.selectedItem.configuration.ident:"<no ident>"))])])],1),s("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?s("q-item-label",{staticClass:"q-pa-none text-right"},[s("small",{staticClass:"cheap-modifier"},[e._v("DELETED")])]):e._e(),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[s("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},{key:"option",fn:function(t){return[s("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":t.opt.deleted},attrs:{clickable:""},on:{click:function(s){e.active=t.opt.id}}},"q-item",t.itemProps,!1),t.itemEvents),[s("q-item-section",[s("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(t.opt.name||"<noname>"))]),s("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[s("small",[e._v(e._s(t.opt.configuration&&t.opt.configuration.ident?t.opt.configuration.ident:"<no ident>"))])])],1),s("q-item-section",{attrs:{side:""}},[t.opt.deleted?s("q-item-label",{staticClass:"q-pa-xs text-right"},[s("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),s("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[s("small",[e._v("#"+e._s(t.opt.id))])])],1)],1)]}}])},[s("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[s("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:function(t){return e.$refs.itemSelect.filter(t)}},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[s("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1)]),e.$q.platform.is.desktop&&e.selectedItem&&!e.selectedItem.deleted?s("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[s("q-btn",{key:"device",staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"60px"},attrs:{title:"View devices",flat:"",dense:""},on:{click:e.goToDevice}},[s("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-developer-board"}}),s("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Device")])],1)],1):e._e()],1)]),e.active?s("traffic-viewer",{staticClass:"flex",attrs:{active:e.active,isVisibleToolbar:e.isVisibleToolbar,config:e.config}}):e._e(),!e.items.length&&e.isItemsInit?s("div",{staticClass:"text-center text-grey-3 q-mt-lg",staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Devices not found"))]):e._e()],1)},a=[],o=s("ded3"),n=s.n(o),l=(s("4e82"),function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",[s("messages",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&!e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"}],ref:"messages",style:{height:"calc(100vh - "+(e.isVisibleToolbar?"100px":"50px")+")",position:"relative",width:e.$q.platform.is.desktop?"25%":"100%",minWidth:"250px"},attrs:{activeId:e.active,limit:e.limit,config:e.config.messages,view:e.typeOfHexView},on:{"view-data":function(t){e.selectedMessages=t},close:function(){e.selectedMessages=""}}}),s("div",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)"}],style:{width:e.$q.platform.is.desktop?"75%":"100%",maxWidth:e.$q.platform.is.desktop?"calc(100% - 250px)":""}},[e.active?s("q-toolbar",{staticClass:"bg-grey-9"},[e.$q.platform.is.mobile?s("q-icon",{staticClass:"cursor-pointer",attrs:{color:"white",size:"1.5rem",name:"mdi-close"},nativeOn:{click:function(t){return function(){e.selectedMessages=""}.apply(null,arguments)}}}):e._e(),s("q-toolbar-title"),s("q-btn",{attrs:{color:"white",flat:"",dense:"",label:"hex"===e.typeOfHexView?"text":"hex","icon-right":"hex"===e.typeOfHexView?"mdi-format-text":"mdi-matrix"},on:{click:function(t){e.typeOfHexView="hex"===e.typeOfHexView?"text":"hex"}}},[s("q-tooltip",[e._v("Change view mode to "+e._s("hex"===e.typeOfHexView?"text":"hex"))])],1),e.active?s("q-btn",{attrs:{color:"white",flat:"",dense:"",icon:"mdi-export-variant"}},[s("q-tooltip",[e._v("Export")]),s("q-menu",[s("q-list",{staticClass:"bg-grey-8 text-white",staticStyle:{"min-width":"150px"}},[s("div",{staticClass:"q-pa-sm"},[s("div",{staticStyle:{"font-size":".8rem"}},[e._v("Copy selected packets as")]),s("div",[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"shown"},on:{click:function(t){return e.copySelected()}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"hex"},on:{click:function(t){return e.copySelected("hex")}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"raw"},on:{click:function(t){return e.copySelected("text")}}})],1)]),s("q-separator"),s("div",{staticClass:"q-pa-sm"},[s("div",{staticStyle:{"font-size":".8rem"}},[e._v("Export selected packets as")]),s("div",[s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"shown"},on:{click:function(t){return e.exportSelected()}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"hex"},on:{click:function(t){return e.exportSelected("hex")}}}),s("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"raw"},on:{click:function(t){return e.exportSelected("text")}}})],1)]),s("q-separator"),s("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){e.$refs.messages&&e.$refs.messages.exportModalOpen()}}},[s("q-item-section",[e._v("Export by time")])],1)],1)],1)],1):e._e()],1):e._e(),e.selectedMessages.length?s("packet-view",{style:{height:"calc(100vh - "+(e.isVisibleToolbar?"150px":"100px")+")",position:"relative",overflow:"auto"},attrs:{packets:e.selectedMessages,view:e.typeOfHexView}}):s("div",{staticStyle:{"text-align":"center",color:"#9e9e9e","font-size":"3rem","padding-top":"40px"}},[s("div",[e._v("Find message")]),s("q-icon",{attrs:{name:"mdi-arrow-down-bold-outline",size:"3rem"}}),s("div",[e._v("Analyze data")])],1)],1)],1)}),r=[],c=(s("13d5"),function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{ref:"wrapper"},[s("q-resize-observer",{on:{resize:e.wrapperResizeHandler}}),s("div",[s("q-toolbar",{staticClass:"bg-grey-9"},[s("date-range-modal",{staticClass:"flex flex-center",attrs:{date:e.dateRange,theme:e.theme},on:{save:e.dateRangeChange}})],1),e.loadingFlag&&e.itemsCount>0?s("div",{staticClass:"absolute-bottom-right absolute-top-left",staticStyle:{overflow:"hidden",top:"50px"}},e._l(new Array(e.itemsCount).fill(""),(function(e,t){return s("message-skeleton",{key:t})})),1):!e.loadingFlag&&e.messages.length?[s("VirtualList",{ref:"scroller",class:{"bg-grey-9":!0,"text-white":!0,"cursor-pointer":!0},style:{position:"absolute",top:"50px",bottom:0,right:0,left:0,height:"auto"},attrs:{onscroll:e.listScroll,size:e.itemHeight,remain:e.itemsCount,wclass:"q-w-list"}},e._l(e.messages,(function(t,i){return s("messages-list-item",{key:i,attrs:{item:t,index:i,actions:e.actions,itemHeight:e.itemHeight,selected:e.selected.includes(i),view:e.view},on:{action:e.actionHandler,"item-click":e.messageClickHandler},nativeOn:{mouseenter:function(s){return e.highlightConn(t.conn)},mouseleave:function(t){return e.highlightConn(null)}}})})),1)]:s("empty-pane",{attrs:{config:e.config.emptyState}})],2),s("export-modal",{ref:"export",attrs:{format:e.view,dateRange:e.dateRange,config:e.config,"item-id":e.active}})],1)}),d=[],m=(s("ddb0"),s("89c1")),h=s.n(m),p=s("9b02"),u=s.n(p),g=s("0f32"),f=s.n(g),v=s("de45"),w=s("cdde"),$=s("e812"),x=s("121a"),b=s("3ba5"),y=s("5a3a"),q=s.n(y),M=s("5de8"),N=s("6126"),S=s("c853"),C={props:["activeId","limit","config","view"],data(){return{theme:this.config.theme,viewConfig:this.config.viewConfig,actions:this.config.actions,moduleName:this.config.vuexModuleName,itemHeight:53,itemsCount:0,wrapperHeight:0,needAutoScroll:!0,selected:[],scrollerScrollTop:0,isInit:!1}},computed:{active:{get(){return this.$store.state[this.moduleName].active},async set(e){this.realtimeEnabled&&await this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.$store.commit(`${this.moduleName}/setActive`,e),await this.$store.dispatch(`${this.moduleName}/initTime`),await this.$store.dispatch(`${this.moduleName}/getMessagesTail`),this.to>Date.now()&&await this.$store.dispatch(`${this.moduleName}/pollingGetMessages`),this.dateRangeChange(this.dateRange)}},messages:{get(){return this.$store.state[this.moduleName].messages},set(e){this.$store.commit(`${this.moduleName}/setMessages`,e)}},currentLimit:{get(){return this.$store.state[this.moduleName].limit},set(e){this.$store.commit(`${this.moduleName}/setLimit`,e)}},dateRange(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},from:{get(){return this.$store.state[this.moduleName].from},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setFrom`,e)}},to:{get(){return this.$store.state[this.moduleName].to},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setTo`,e)}},realtimeEnabled(){return this.$store.state[this.moduleName].messagePolling},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)}},methods:{resetParams(){if(!this.$refs.wrapper)return!1;if(this.wrapperHeight=this.$refs.wrapper.offsetHeight-this.itemHeight,this.itemsCount=Math.ceil(this.wrapperHeight/this.itemHeight),this.$refs.scroller&&this.$refs.scroller.forceRender(),this.$refs.scroller&&this.$refs.scroller.$el){const e=this.$refs.scroller.$el;e.scrollTop+=1}},dateRangeChange(e){this.updateRoute({query:{from:e[0]/1e3,to:e[1]/1e3}})},dateRangeChangeHandler(e){const t=e[0],s=e[1];if(this.from===t&&this.to===s)return!1;this.from=t,this.to=s,this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.needAutoScroll&&s<=Date.now()&&(this.needAutoScroll=!1),this.$store.commit(`${this.moduleName}/clearMessages`),this.$store.dispatch(`${this.moduleName}/getMessages`).then((()=>{s>Date.now()&&this.$store.dispatch(`${this.moduleName}/pollingGetMessages`)}))},clearSelected(){this.selected=[]},wrapperResizeHandler(){this.resetParams()},getScrollDirection(e){let t=null;return t=e>this.currentScrollTop?"bottom":e<this.currentScrollTop?"top":"none",t},listScroll:function(e,t){const{offset:s}=t;this.currentScrollTop||(this.currentScrollTop=s);const i=u()(this.$refs,"scroller.$el",void 0);if(!i)return!1;const a=i.scrollHeight-i.clientHeight,o=this.getScrollDirection(s),n=.1*a;this.allScrollTop=this.$refs.scroller?this.$refs.scroller.$el.scrollHeight-this.$refs.scroller.$el.clientHeight:0,this.messages.length&&(s<this.currentScrollTop&&this.needAutoScroll?this.needAutoScroll=!1:!this.needAutoScroll&&this.realtimeEnabled&&s>=this.allScrollTop&&(this.needAutoScroll=!0),this.currentScrollTop=s),o&&("top"===o||"none"===o)&&s<n?this.debouncedGetMessagesPrev():o&&("bottom"===o||"none"===o)&&s+n>=a&&this.debouncedGetMessagesNext()},getMessagesPrev(){const e=u()(this.$refs,"scroller.$el",void 0),t=e.scrollHeight-e.clientHeight,s=e.scrollTop;this.$store.dispatch(`${this.moduleName}/getMessagesPrev`).then((i=>{if(i&&i.length){const i=e.scrollHeight-e.clientHeight;e.scrollTop=i-t+s}}))},getMessagesNext(){this.$store.dispatch(`${this.moduleName}/getMessagesNext`)},actionHandler({index:e,type:t,content:s}){switch(t){case"view":this.viewMessagesHandler({index:e,content:s});break;case"copy":this.copyMessageHandler({index:e,content:s});break}},viewMessagesHandler({index:e,content:t}){this.selected=[e],this.$root.$emit("view-data",t)},messageClickHandler({index:e,content:t,event:s}){if(s.shiftKey)this.selected[0]?this.selected[0]>e?this.selected=q()(e,this.selected[0]+1):this.selected=q()(this.selected[0],e+1):this.selected=[e];else if(s.ctrlKey||s.metaKey)if(this.selected.includes(e)){const t=this.selected;t.splice(this.selected.indexOf(e),1),this.selected=t}else this.selected=[...this.selected,e];else this.selected=[e];this.needAutoScroll&&(this.needAutoScroll=!1),this.selected.sort(((e,t)=>e-t)),this.$emit("view-data",this.selected.map((e=>n()(n()({},this.messages[e]),{},{index:e}))))},copyMessageHandler({index:e,content:t}){Object(w["a"])(JSON.stringify(t)).then((e=>{this.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(e=>{this.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},unselect(){this.selected.length&&(this.selected=[])},clear(){this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.$store.commit(`${this.moduleName}/clearMessages`)},exportModalOpen(){this.$refs.export.show()},highlightIncoming(e){const t=this.messages.findIndex((e=>2===e.type)),s=this.messages.findIndex((t=>2===t.type&&Math.floor(t.timestamp)===Math.floor(e)));s>-1?this.messageClickHandler({index:s,event:{}}):t>-1&&this.messageClickHandler({index:t,event:{}})},async init(){this.currentLimit=this.limit,this.activeId&&!this.$store.state[this.moduleName].active&&this.$store.commit(`${this.moduleName}/setActive`,this.activeId);const e=1e3*this.$route.query.from,t=1e3*this.$route.query.to,s=this.$route.query.highlight||e;e&&t?(this.from=e,this.to=t,await this.$store.dispatch(`${this.moduleName}/getMessages`),this.$nextTick((()=>this.highlightIncoming(s)))):(await this.$store.dispatch(`${this.moduleName}/initTime`),await this.$store.dispatch(`${this.moduleName}/getMessagesTail`)),this.to>Date.now()&&await this.$store.dispatch(`${this.moduleName}/pollingGetMessages`),this.updateRoute({query:{from:this.from/1e3,to:this.to/1e3}},!0),this.isInit=!0}},watch:{activeId(e){this.clear(),this.active=e},limit(e){this.currentLimit=e},$route(e){const t=1e3*e.query.from,s=1e3*e.query.to;t&&s&&(this.dateRange[0]!==t||this.dateRange[1]!==s)&&this.dateRangeChangeHandler([t,s])}},created(){this.debouncedGetMessagesPrev=f()(this.getMessagesPrev,2e3,{trailing:!1}),this.debouncedGetMessagesNext=f()(this.getMessagesNext,2e3,{trailing:!1}),this.init()},mounted(){this.resetParams()},updated(){this.messages.length?this.needAutoScroll&&this.$refs.scroller&&this.$refs.scroller.$el&&(this.$refs.scroller.$el.scrollTop=this.$refs.scroller.$el.scrollHeight):this.currentScrollTop=0},destroyed(){this.highlightConn(null),this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.$store.commit(`${this.moduleName}/clearMessages`),this.to=0,this.from=0},mixins:[N["a"],S["a"]],components:{MessagesListItem:$["a"],VirtualList:h.a,EmptyPane:x["a"],MessageSkeleton:b["a"],DateRangeModal:v["a"],ExportModal:M["a"]}},k=C,I=s("2877"),_=s("3980"),T=s("65c6"),H=s("eebe"),D=s.n(H),E=Object(I["a"])(k,c,d,!1,null,null,null),P=E.exports;D()(E,"components",{QResizeObserver:_["a"],QToolbar:T["a"]});var L=s("73bb"),O=(s("26e9"),s("2b0e"));function R(e){const t=e||Date.now(),s=new Date(t).setHours(0,0,0,0),i=s+86399999.999;return{from:s,to:i}}async function Q({state:e,commit:t}){let s=Date.now();try{const t=await O["default"].connector.gw.getDevicesPackets(e.active,{data:{count:1,reverse:!0}});s=u()(t,"data.result[0].timestamp",Math.floor(Date.now()/1e3)),s=Math.round(1e3*s)}catch(a){}const i=R(s);t("setFrom",i.from),t("setTo",i.to)}async function V({state:e,commit:t}){"undefined"!==typeof e.isLoading&&O["default"].set(e,"isLoading",!0);try{const s=Date.now(),i=e.to>s?s:e.to,a=await O["default"].connector.gw.getDevicesPackets(e.active,{data:{from:e.from/1e3,to:i/1e3,count:e.limit}}),o=u()(a,"data.result",[]);t("setMessages",o)}catch(s){t("reqFailed",s)}"undefined"!==typeof e.isLoading&&O["default"].set(e,"isLoading",!1)}async function A({state:e,commit:t}){"undefined"!==typeof e.isLoading&&O["default"].set(e,"isLoading",!0);try{const s=Date.now(),i=e.to>s?s:e.to,a=await O["default"].connector.gw.getDevicesPackets(e.active,{data:{count:e.limit,reverse:!0,from:e.from/1e3,to:i/1e3}}),o=u()(a,"data.result",[]);o.reverse(),t("setMessages",o)}catch(s){t("reqFailed",s)}"undefined"!==typeof e.isLoading&&O["default"].set(e,"isLoading",!1)}let F=!1;async function z({state:e,commit:t}){if(!e.messages.length||F||e.messagePolling)return;F=!0;let s=[];try{const i=e.messages[e.messages.length-1].timestamp+1e-6,a=await O["default"].connector.gw.getDevicesPackets(e.active,{data:{count:e.limit,from:i,to:e.to/1e3}});s=u()(a,"data.result",[]),t("setMessagesAppend",s)}catch(i){t("reqFailed",i)}return F=!1,s}async function G({state:e,commit:t}){if(!e.messages.length||F)return;F=!0;let s=[];try{const i=e.messages[0].timestamp-1e-6,a=await O["default"].connector.gw.getDevicesPackets(e.active,{data:{count:e.limit,from:e.from/1e3,to:i,reverse:!0}});s=u()(a,"data.result",[]),s.reverse(),t("setMessagesPrepend",s)}catch(i){t("reqFailed",i)}return F=!1,s}let j=0;function B({state:e,commit:t}){j=setInterval((async()=>{try{const s=e.messages[e.messages.length-1].timestamp+1e-6,i=Math.ceil(Date.now()/1e3),a=await O["default"].connector.gw.getDevicesPackets(e.active,{data:{from:s,to:i}}),o=u()(a,"data.result",[]);t("setMessagesAppend",o)}catch(s){t("reqFailed",s)}}),1e4),e.messagePolling=!0}function J({state:e,commit:t}){clearInterval(j),j=0,e.messagePolling=!1}async function K({state:e},{from:t,to:s}){let i=[];try{const a=await O["default"].connector.gw.getDevicesPackets(e.active,{data:{from:t,to:s}});i=u()(a,"data.result",[])}catch(a){}return i}var W={initTime:Q,getMessages:V,getMessagesTail:A,getMessagesNext:z,getMessagesPrev:G,pollingGetMessages:B,removePollingGetMessages:J,getExportData:K};function U(e,t){e.limit=t}function Y(e,t){e.active=t}function X(e){e.messages=[]}function Z(e,t){e.messages=t}function ee(e,t){e.messages.splice(e.messages.length,0,...t)}function te(e,t){e.messages.splice(0,0,...t)}function se(e,t){e.to=t}function ie(e,t){e.from=t}function ae(e){e.messages=[],e.to=0,e.from=0,e.active=null}function oe(e,t){}var ne={setLimit:U,setActive:Y,clearMessages:X,setMessages:Z,setMessagesAppend:ee,setMessagesPrepend:te,clean:ae,setTo:se,setFrom:ie,reqFailed:oe};const le={messages:[],active:null,limit:0,from:0,to:0,isLoading:!1,realtimeEnabled:!1,messagePolling:!1};var re={namespaced:!0,state:le,actions:W,mutations:ne},ce=s("798f"),de={props:["active","isVisibleToolbar","config","deviceCloseble"],data(){return{typeOfHexView:"hex",limit:1e3,selectedMessages:"",moduleName:this.config.messages.vuexModuleName}},computed:{hex(){return!(!this.selectedMessages||!this.active)&&this.selectedMessages.reduce(((e,t)=>(e+=this.base64ToHex(t.data)||"",e)),"")}},methods:{getContentBySelected(e){return this.selectedMessages.reduce(((t,s)=>(t+=this.getHeader(s),t+="\r\n",s.data&&(t+=this.getContent(e,this.base64ToHex(s.data),this.typeOfHexView)),t+="\r\n",t)),"")},copySelected(e="view"){const t=this.getContentBySelected(e);this.copy(t,e)},exportSelected(e="view"){const t=this.getContentBySelected(e);this.exportData(t,e)}},created(){this.$store.state[this.moduleName]||this.$store.registerModule(this.moduleName,re)},destroyed(){this.$store.commit(`${this.moduleName}/clean`),this.$store.unregisterModule(this.moduleName)},watch:{active(){this.selectedMessages=""}},mixins:[ce["a"]],components:{Messages:P,PacketView:L["a"]}},me=de,he=s("0016"),pe=s("6ac5"),ue=s("9c40"),ge=s("05c0"),fe=s("4e73"),ve=s("1c1c"),we=s("eb85"),$e=s("66e5"),xe=s("4074"),be=s("7f67"),ye=Object(I["a"])(me,l,r,!1,null,null,null),qe=ye.exports;D()(ye,"components",{QToolbar:T["a"],QIcon:he["a"],QToolbarTitle:pe["a"],QBtn:ue["a"],QTooltip:ge["a"],QMenu:fe["a"],QList:ve["a"],QSeparator:we["a"],QItem:$e["a"],QItemSection:xe["a"]}),D()(ye,"directives",{ClosePopup:be["a"]});var Me=s("a99a"),Ne=s("2f62"),Se=s("286e"),Ce={name:"PageDeviceTraffic",props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[Se["a"]],data(){return{active:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,filter:"",prevEntity:null,prevRoute:null,isIntegration:this.$q.platform.within.iframe}},computed:n()(n()({},Object(Ne["d"])({tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},items(e){return Object.values(e.devices||{})}})),{},{filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const s=e.name.toLowerCase(),i=t.name.toLowerCase();return s<i?-1:1})),t},selectedItem(){return this.items.filter((e=>e.id===this.active))[0]||null}}),methods:{unselect(){this.$refs.messages.unselect()},goToDevice(){"devices"===this.prevEntity&&this.prevRoute&&this.prevRoute.params.id===this.active?this.$router.push(this.prevRoute).catch((e=>e)):this.$router.push(`/devices/${this.active}`).catch((e=>e))},init(){const e="tools/deviceTraffic",t=u()(this.settings,`entities[${e}]`,void 0);this.isInit=!0,this.$route.params&&this.$route.params.id?this.items.filter((e=>e.id===Number(this.$route.params.id))).length?this.active=Number(this.$route.params.id):this.active=null:t&&this.items.filter((e=>e.id===t)).length&&(this.active=t),this.$emit("inited")}},watch:{$route(e){e.params&&e.params.id?this.items.filter((t=>t.id===Number(e.params.id))).length?this.active=Number(e.params.id):this.isInit&&(this.active=null):e.params&&!e.params.id&&(this.active=null)},active(e){const t=this.items.filter((t=>t.id===e))[0]||{};e&&this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:"tools/deviceTraffic"},value:t.id})}},beforeRouteEnter(e,t,s){s((e=>{e.prevRoute=t,e.prevEntity=t.meta.moduleName}))},components:{TrafficViewer:qe,EntitiesToolbar:Me["a"]}},ke=Ce,Ie=(s("06b0"),s("9989")),_e=s("ddd8"),Te=s("27f9"),He=s("0170"),De=s("8572"),Ee=Object(I["a"])(ke,i,a,!1,null,null,null);t["default"]=Ee.exports;D()(Ee,"components",{QPage:Ie["a"],QSelect:_e["a"],QInput:Te["a"],QIcon:he["a"],QItem:$e["a"],QItemSection:xe["a"],QItemLabel:He["a"],QBtn:ue["a"],QField:De["a"]})},5288:function(e,t,s){}}]);