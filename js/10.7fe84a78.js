(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[10],{"2ed3":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e._self._c;return t("q-page",[t("entities-toolbar",{attrs:{item:e.selectedItem}},[t("div",{staticClass:"flex",class:{"middle-modificator":!e.active},attrs:{slot:"selects"},slot:"selects"},[t("q-select",{ref:"itemSelect",staticClass:"items__select",class:{"items__select--no-selected":!e.active},attrs:{value:e.active,options:e.filteredItems,filled:"",loading:e.isItemsInitStart&&!e.isItemsInit,"hide-dropdown-icon":!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("streams")>-1,label:e.active?"Stream":"SELECT STREAM",dark:"","hide-bottom-space":"",dense:"",color:"white",disable:!e.isNeedSelect||"string"===typeof e.isNeedSelect&&e.isNeedSelect.indexOf("streams")>-1,"popup-content-class":"items__popup","popup-content-style":{height:48*(e.filteredItems.length>6?6:e.filteredItems.length)+48+(e.filteredItems.length?0:4)+"px"}},on:{filter:(t,s)=>e.filterItems("streams",t,s)},scopedSlots:e._u([{key:"no-option",fn:function(){return[t("div",{staticStyle:{"min-height":"77px"}},[t("q-input",{staticClass:"q-ma-xs",attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:t=>e.$refs.itemSelect.filter(t)},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[t("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1),t("div",{staticClass:"text-center"},[e._v("No results")])],1)]},proxy:!0},{key:"selected-item",fn:function(s){return[e.selectedItem?t("q-item",e._g(e._b({staticClass:"q-pa-none",staticStyle:{"min-height":"20px","margin-top":"2px","max-width":"100%"}},"q-item",s.itemProps,!1),s.itemEvents),[t("q-item-section",[t("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-none text-white",attrs:{header:""}},[e._v(e._s(e.selectedItem.name||"<noname>"))]),t("q-item-label",{staticClass:"q-pa-none q-mt-none text-white ellipsis",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[t("small",[e._v(e._s(e.selectedItem.configuration&&e.selectedItem.configuration.ident?e.selectedItem.configuration.ident:"<no ident>"))])])],1),t("q-item-section",{staticClass:"text-white",attrs:{side:""}},[e.selectedItem.deleted?t("q-item-label",{staticClass:"q-pa-none text-right"},[t("small",{staticClass:"cheap-modifier"},[e._v("DELETED")])]):e._e(),t("q-item-label",{staticClass:"q-pa-none q-mt-none text-right"},[t("small",[e._v("#"+e._s(e.selectedItem.id))])])],1)],1):e._e()]}},{key:"option",fn:function(s){return[t("q-item",e._g(e._b({staticClass:"q-pa-xs",class:{"text-grey-8":s.opt.deleted},attrs:{clickable:""},on:{click:function(t){e.active=s.opt.id}}},"q-item",s.itemProps,!1),s.itemEvents),[t("q-item-section",[t("q-item-label",{staticClass:"ellipsis overflow-hidden q-pa-xs",attrs:{header:""}},[e._v(e._s(s.opt.name||"<noname>"))]),t("q-item-label",{staticClass:"q-pa-none q-mt-none",staticStyle:{"line-height":"0.75rem!important","margin-top":"1px"},attrs:{caption:""}},[t("small",[e._v(e._s(s.opt.configuration&&s.opt.configuration.ident?s.opt.configuration.ident:"<no ident>"))])])],1),t("q-item-section",{attrs:{side:""}},[s.opt.deleted?t("q-item-label",{staticClass:"q-pa-xs text-right"},[t("small",{staticClass:"cheap-modifier cheap-modifier--item",class:{"cheap-modifier--mobile":e.$q.platform.is.mobile}},[e._v("DELETED")])]):e._e(),t("q-item-label",{staticClass:"q-pa-none q-mt-none text-right",class:{"q-pr-xs":e.$q.platform.is.mobile}},[t("small",[e._v("#"+e._s(s.opt.id))])])],1)],1)]}}])},[t("div",{staticClass:"bg-dark q-pa-xs select__filter",attrs:{slot:"before-options"},slot:"before-options"},[t("q-input",{attrs:{outlined:"","hide-bottom-space":"",rounded:"",dense:"",color:"white",dark:"",placeholder:"Filter",autofocus:""},on:{input:t=>e.$refs.itemSelect.filter(t)},model:{value:e.filter,callback:function(t){e.filter=t},expression:"filter"}},[t("q-icon",{attrs:{slot:"prepend",name:"mdi-magnify",color:"white"},slot:"prepend"})],1)],1)]),e.$q.platform.is.desktop&&e.selectedItem&&!e.selectedItem.deleted?t("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[t("q-btn",{key:"stream",staticClass:"on-right pull-right text-center rounded-borders q-px-xs q-py-none text-white",staticStyle:{width:"60px"},attrs:{title:"View streams",flat:"",dense:""},on:{click:e.goToStream}},[t("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-call-split"}}),t("div",{staticStyle:{"font-size":".7rem","line-height":".7rem"}},[e._v("Stream")])],1)],1):e._e()],1)]),e.active?t("traffic-viewer",{staticClass:"flex",attrs:{active:e.active,isVisibleToolbar:e.isVisibleToolbar,config:e.config}}):e._e(),!e.items.length&&e.isItemsInit?t("div",{staticClass:"text-center text-grey-3 q-mt-lg",staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Streams not found"))]):e._e()],1)},a=[],o=(s("14d9"),function(){var e=this,t=e._self._c;return t("div",[t("messages",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&!e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && !selectedMessages)"}],ref:"messages",style:{height:`calc(100vh - ${e.isVisibleToolbar?"100px":"50px"})`,position:"relative",width:e.$q.platform.is.desktop?"25%":"100%",minWidth:"250px"},attrs:{activeId:e.active,limit:e.limit,config:e.config.messages,view:e.typeOfHexView},on:{"view-data":t=>{e.selectedMessages=t},close:()=>{e.selectedMessages=""}}}),t("div",{directives:[{name:"show",rawName:"v-show",value:e.$q.platform.is.desktop||e.$q.platform.is.mobile&&e.selectedMessages,expression:"$q.platform.is.desktop || ($q.platform.is.mobile && selectedMessages)"}],style:{width:e.$q.platform.is.desktop?"75%":"100%",maxWidth:e.$q.platform.is.desktop?"calc(100% - 250px)":""}},[e.active?t("q-toolbar",{staticClass:"bg-grey-9"},[e.$q.platform.is.mobile?t("q-icon",{staticClass:"cursor-pointer",attrs:{color:"white",size:"1.5rem",name:"mdi-close"},nativeOn:{click:function(t){return(()=>{e.selectedMessages=""}).apply(null,arguments)}}}):e._e(),t("q-toolbar-title"),t("q-btn",{attrs:{color:"white",flat:"",dense:"",label:"hex"===e.typeOfHexView?"text":"hex","icon-right":"hex"===e.typeOfHexView?"mdi-format-text":"mdi-matrix"},on:{click:function(t){e.typeOfHexView="hex"===e.typeOfHexView?"text":"hex"}}},[t("q-tooltip",[e._v("Change view mode to "+e._s("hex"===e.typeOfHexView?"text":"hex"))])],1),e.active?t("q-btn",{attrs:{color:"white",flat:"",dense:"",icon:"mdi-export-variant"}},[t("q-tooltip",[e._v("Export")]),t("q-menu",{attrs:{"no-route-dismiss":""}},[t("q-list",{staticClass:"bg-grey-8 text-white",staticStyle:{"min-width":"150px"}},[t("div",{staticClass:"q-pa-sm"},[t("div",{staticStyle:{"font-size":".8rem"}},[e._v("Copy selected packets as")]),t("div",[t("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"shown"},on:{click:function(t){return e.copySelected()}}}),t("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"hex"},on:{click:function(t){return e.copySelected("hex")}}}),t("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"raw"},on:{click:function(t){return e.copySelected("text")}}})],1)]),t("q-separator"),t("div",{staticClass:"q-pa-sm"},[t("div",{staticStyle:{"font-size":".8rem"}},[e._v("Export selected packets as")]),t("div",[t("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"shown"},on:{click:function(t){return e.exportSelected()}}}),t("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"hex"},on:{click:function(t){return e.exportSelected("hex")}}}),t("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{disable:!e.selectedMessages.length,dense:"",flat:"",label:"raw"},on:{click:function(t){return e.exportSelected("text")}}})],1)]),t("q-separator"),t("q-item",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{clickable:""},on:{click:function(t){e.$refs.messages&&e.$refs.messages.exportModalOpen()}}},[t("q-item-section",[e._v("Export by time")])],1)],1)],1)],1):e._e()],1):e._e(),e.selectedMessages.length?t("packet-view",{style:{height:`calc(100vh - ${e.isVisibleToolbar?"150px":"100px"})`,position:"relative",overflow:"auto"},attrs:{packets:e.selectedMessages,view:e.typeOfHexView}}):t("div",{staticStyle:{"text-align":"center",color:"#9e9e9e","font-size":"3rem","padding-top":"40px"}},[t("div",[e._v("Find message")]),t("q-icon",{attrs:{name:"mdi-arrow-down-bold-outline",size:"3rem"}}),t("div",[e._v("Analyze data")])],1)],1)],1)}),n=[],l=function(){var e=this,t=e._self._c;return t("div",{ref:"wrapper"},[t("q-resize-observer",{on:{resize:e.wrapperResizeHandler}}),t("div",[t("q-toolbar",{staticClass:"bg-grey-9"},[t("date-range-modal",{staticClass:"flex flex-center",attrs:{date:e.dateRange,theme:e.theme},on:{save:e.dateRangeChange}})],1),e.loadingFlag&&e.itemsCount>0?t("div",{staticClass:"absolute-bottom-right absolute-top-left",staticStyle:{overflow:"hidden",top:"50px"}},e._l(new Array(e.itemsCount).fill(""),(function(e,s){return t("message-skeleton",{key:s})})),1):!e.loadingFlag&&e.messages.length?[t("VirtualList",{ref:"scroller",class:{"bg-grey-9":!0,"text-white":!0,"cursor-pointer":!0},style:{position:"absolute",top:"50px",bottom:0,right:0,left:0,height:"auto"},attrs:{onscroll:e.listScroll,size:e.itemHeight,remain:e.itemsCount,wclass:"q-w-list"}},e._l(e.messages,(function(s,i){return t("messages-list-item",{key:i,attrs:{item:s,index:i,actions:e.actions,itemHeight:e.itemHeight,selected:e.selected.includes(i),view:e.view},on:{action:e.actionHandler,"item-click":e.messageClickHandler},nativeOn:{mouseenter:function(t){return e.highlightConn(s.conn)},mouseleave:function(t){return e.highlightConn(null)}}})})),1)]:t("empty-pane",{attrs:{config:e.config.emptyState}})],2),t("export-modal",{ref:"export",attrs:{format:e.view,dateRange:e.dateRange,config:e.config,"item-id":e.active}})],1)},r=[],c=s("89c1"),m=s.n(c),d=s("9b02"),h=s.n(d),g=s("0f32"),p=s.n(g),u=s("de45"),f=s("cdde"),v=s("e812"),$=s("121a"),x=s("3ba5"),w=s("5a3a"),b=s.n(w),y=s("5de8"),q=s("6126"),M=s("c853"),S={props:["activeId","limit","config","view"],data(){return{theme:this.config.theme,viewConfig:this.config.viewConfig,actions:this.config.actions,moduleName:this.config.vuexModuleName,itemHeight:53,itemsCount:0,wrapperHeight:0,needAutoScroll:!0,selected:[],scrollerScrollTop:0,isInit:!1}},computed:{active:{get(){return this.$store.state[this.moduleName].active},async set(e){this.realtimeEnabled&&await this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.$store.commit(`${this.moduleName}/setActive`,e),await this.$store.dispatch(`${this.moduleName}/initTime`),await this.$store.dispatch(`${this.moduleName}/getMessagesTail`),this.to>Date.now()&&await this.$store.dispatch(`${this.moduleName}/pollingGetMessages`),this.dateRangeChange(this.dateRange)}},messages:{get(){return this.$store.state[this.moduleName].messages},set(e){this.$store.commit(`${this.moduleName}/setMessages`,e)}},currentLimit:{get(){return this.$store.state[this.moduleName].limit},set(e){this.$store.commit(`${this.moduleName}/setLimit`,e)}},dateRange(){return[this.$store.state[this.moduleName].from,this.$store.state[this.moduleName].to]},from:{get(){return this.$store.state[this.moduleName].from},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setFrom`,e)}},to:{get(){return this.$store.state[this.moduleName].to},set(e){e=e||0,this.$store.commit(`${this.moduleName}/setTo`,e)}},realtimeEnabled(){return this.$store.state[this.moduleName].messagePolling},loadingFlag(){const e=this.$store.state;return!(!e[this.config.vuexModuleName]||!e[this.config.vuexModuleName].isLoading)}},methods:{resetParams(){if(!this.$refs.wrapper)return!1;if(this.wrapperHeight=this.$refs.wrapper.offsetHeight-this.itemHeight,this.itemsCount=Math.ceil(this.wrapperHeight/this.itemHeight),this.$refs.scroller&&this.$refs.scroller.forceRender(),this.$refs.scroller&&this.$refs.scroller.$el){const e=this.$refs.scroller.$el;e.scrollTop+=1}},dateRangeChange(e){this.updateRoute({query:{from:e[0]/1e3,to:e[1]/1e3}})},dateRangeChangeHandler(e){const t=e[0],s=e[1];if(this.from===t&&this.to===s)return!1;this.from=t,this.to=s,this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.needAutoScroll&&s<=Date.now()&&(this.needAutoScroll=!1),this.$store.commit(`${this.moduleName}/clearMessages`),this.$store.dispatch(`${this.moduleName}/getMessages`).then((()=>{s>Date.now()&&this.$store.dispatch(`${this.moduleName}/pollingGetMessages`)}))},clearSelected(){this.selected=[]},wrapperResizeHandler(){this.resetParams()},getScrollDirection(e){let t=null;return t=e>this.currentScrollTop?"bottom":e<this.currentScrollTop?"top":"none",t},listScroll:function(e,t){const{offset:s}=t;this.currentScrollTop||(this.currentScrollTop=s);const i=h()(this.$refs,"scroller.$el",void 0);if(!i)return!1;const a=i.scrollHeight-i.clientHeight,o=this.getScrollDirection(s),n=.1*a;this.allScrollTop=this.$refs.scroller?this.$refs.scroller.$el.scrollHeight-this.$refs.scroller.$el.clientHeight:0,this.messages.length&&(s<this.currentScrollTop&&this.needAutoScroll?this.needAutoScroll=!1:!this.needAutoScroll&&this.realtimeEnabled&&s>=this.allScrollTop&&(this.needAutoScroll=!0),this.currentScrollTop=s),o&&("top"===o||"none"===o)&&s<n?this.debouncedGetMessagesPrev():o&&("bottom"===o||"none"===o)&&s+n>=a&&this.debouncedGetMessagesNext()},getMessagesPrev(){const e=h()(this.$refs,"scroller.$el",void 0),t=e.scrollHeight-e.clientHeight,s=e.scrollTop;this.$store.dispatch(`${this.moduleName}/getMessagesPrev`).then((i=>{if(i&&i.length){const i=e.scrollHeight-e.clientHeight;e.scrollTop=i-t+s}}))},getMessagesNext(){this.$store.dispatch(`${this.moduleName}/getMessagesNext`)},actionHandler({index:e,type:t,content:s}){switch(t){case"view":this.viewMessagesHandler({index:e,content:s});break;case"copy":this.copyMessageHandler({index:e,content:s});break}},viewMessagesHandler({index:e,content:t}){this.selected=[e],this.$root.$emit("view-data",t)},messageClickHandler({index:e,content:t,event:s}){if(s.shiftKey)this.selected[0]?this.selected[0]>e?this.selected=b()(e,this.selected[0]+1):this.selected=b()(this.selected[0],e+1):this.selected=[e];else if(s.ctrlKey||s.metaKey)if(this.selected.includes(e)){const t=this.selected;t.splice(this.selected.indexOf(e),1),this.selected=t}else this.selected=[...this.selected,e];else this.selected=[e];this.needAutoScroll&&(this.needAutoScroll=!1),this.selected.sort(((e,t)=>e-t)),this.$emit("view-data",this.selected.map((e=>({...this.messages[e],index:e}))))},copyMessageHandler({index:e,content:t}){Object(f["a"])(JSON.stringify(t)).then((e=>{this.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})}),(e=>{this.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})}))},unselect(){this.selected.length&&(this.selected=[])},clear(){this.realtimeEnabled&&this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.$store.commit(`${this.moduleName}/clearMessages`)},exportModalOpen(){this.$refs.export.show()},highlightIncoming(e){const t=e=>2===e||130===e||66===e||34===e,{incomingMessageIndex:s,incomingMessageIndexEnd:i}=this.messages.reduce(((s,i,a)=>(t(i.type)&&(-1===s.incomingMessageIndex&&(s.incomingMessageIndex=a),2===i.type&&Math.floor(i.timestamp)===Math.floor(e)&&-1===s.incomingMessageIndexEnd&&(s.incomingMessageIndexEnd=a),2!=i.type&&Math.floor(i.timestamp)===Math.floor(e)&&(s.incomingMessageIndexEnd=a)),s)),{incomingMessageIndex:-1,incomingMessageIndexEnd:-1});i>-1?this.messageClickHandler({index:i,event:{}}):s>-1&&this.messageClickHandler({index:s,event:{}})},async init(){this.currentLimit=this.limit,this.activeId&&!this.$store.state[this.moduleName].active&&this.$store.commit(`${this.moduleName}/setActive`,this.activeId);const e=1e3*this.$route.query.from,t=1e3*this.$route.query.to,s=this.$route.query.highlight||e;e&&t?(this.from=e,this.to=t,await this.$store.dispatch(`${this.moduleName}/getMessages`),this.$nextTick((()=>this.highlightIncoming(s)))):(await this.$store.dispatch(`${this.moduleName}/initTime`),await this.$store.dispatch(`${this.moduleName}/getMessagesTail`)),this.to>Date.now()&&await this.$store.dispatch(`${this.moduleName}/pollingGetMessages`),this.updateRoute({query:{from:this.from/1e3,to:this.to/1e3}},!0),this.isInit=!0}},watch:{activeId(e){this.clear(),this.active=e},limit(e){this.currentLimit=e},$route(e){const t=1e3*e.query.from,s=1e3*e.query.to;t&&s&&(this.dateRange[0]!==t||this.dateRange[1]!==s)&&this.dateRangeChangeHandler([t,s])}},created(){this.debouncedGetMessagesPrev=p()(this.getMessagesPrev,2e3,{trailing:!1}),this.debouncedGetMessagesNext=p()(this.getMessagesNext,2e3,{trailing:!1}),this.init()},mounted(){this.resetParams()},updated(){this.messages.length?this.needAutoScroll&&this.$refs.scroller&&this.$refs.scroller.$el&&(this.$refs.scroller.$el.scrollTop=this.$refs.scroller.$el.scrollHeight):this.currentScrollTop=0},destroyed(){this.highlightConn(null),this.$store.dispatch(`${this.moduleName}/removePollingGetMessages`),this.$store.commit(`${this.moduleName}/clearMessages`),this.to=0,this.from=0},mixins:[q["a"],M["a"]],components:{MessagesListItem:v["a"],VirtualList:m.a,EmptyPane:$["a"],MessageSkeleton:x["a"],DateRangeModal:u["a"],ExportModal:y["a"]}},N=S,k=s("2877"),I=s("3980"),T=s("65c6"),C=s("eebe"),_=s.n(C),H=Object(k["a"])(N,l,r,!1,null,null,null),P=H.exports;_()(H,"components",{QResizeObserver:I["a"],QToolbar:T["a"]});var E=s("73bb"),L=s("2b0e");function O(e){const t=e||Date.now(),s=new Date(t).setHours(0,0,0,0),i=s+86399999.999;return{from:s,to:i}}async function R({state:e,commit:t}){let s=Date.now();try{const i={data:{count:1,reverse:!0}},a=await L["default"].connector.gw.getStreamsPackets(e.active,i);L["default"].$logger.info("[streamTraffic]getMessages"),t("reqStart",{endpoint:"getStreamsPackets",ids:e.active,params:i}),s=h()(a,"data.result[0].timestamp",Math.floor(Date.now()/1e3)),s=Math.round(1e3*s)}catch(a){}const i=O(s);t("setFrom",i.from),t("setTo",i.to)}async function D({state:e,commit:t}){"undefined"!==typeof e.isLoading&&L["default"].set(e,"isLoading",!0);try{const s=Date.now(),i=e.to>s?s:e.to,a={data:{from:e.from/1e3,to:i/1e3,count:e.limit}},o=await L["default"].connector.gw.getStreamsPackets(e.active,a);L["default"].$logger.info("[streamTraffic]getMessages"),t("reqStart",{endpoint:"getStreamsPackets",ids:e.active,params:a});const n=h()(o,"data.result",[]);t("setMessages",n)}catch(s){console.log("------------- 1"),t("reqFailed",s)}"undefined"!==typeof e.isLoading&&L["default"].set(e,"isLoading",!1)}async function Q({state:e,commit:t}){"undefined"!==typeof e.isLoading&&L["default"].set(e,"isLoading",!0);try{const s=Date.now(),i=e.to>s?s:e.to,a={data:{count:e.limit,reverse:!0,from:e.from/1e3,to:i/1e3}},o=await L["default"].connector.gw.getStreamsPackets(e.active,a);L["default"].$logger.info("[streamTraffic]getMessagesTail"),t("reqStart",{endpoint:"getStreamsPackets",ids:e.active,params:a});const n=h()(o,"data.result",[]);n.reverse(),t("setMessages",n)}catch(s){console.log("------------- 2"),t("reqFailed",s)}"undefined"!==typeof e.isLoading&&L["default"].set(e,"isLoading",!1)}let A=!1;async function V({state:e,commit:t}){if(!e.messages.length||A||e.messagePolling)return;A=!0;let s=[];try{const i=e.messages[e.messages.length-1].timestamp+1e-6,a={data:{count:e.limit,from:i,to:e.to/1e3}},o=await L["default"].connector.gw.getStreamsPackets(e.active,a);L["default"].$logger.info("[streamTraffic]getMessagesNext"),t("reqStart",{endpoint:"getStreamsPackets",ids:e.active,params:a}),s=h()(o,"data.result",[]),t("setMessagesAppend",s)}catch(i){console.log("------------- 3"),t("reqFailed",i)}return A=!1,s}async function F({state:e,commit:t}){if(!e.messages.length||A)return;A=!0;let s=[];try{const i=e.messages[0].timestamp-1e-6,a={data:{count:e.limit,from:e.from/1e3,to:i,reverse:!0}},o=await L["default"].connector.gw.getStreamsPackets(e.active,a);L["default"].$logger.info("[streamTraffic]getMessagesPrev"),t("reqStart",{endpoint:"getStreamsPackets",ids:e.active,params:a}),s=h()(o,"data.result",[]),s.reverse(),t("setMessagesPrepend",s)}catch(i){console.log("------------- 4"),t("reqFailed",i)}return A=!1,s}let G=0;function z({state:e,commit:t}){G=setInterval((async()=>{try{const s=e.messages[e.messages.length-1].timestamp+1e-6,i=Math.ceil(Date.now()/1e3),a={data:{from:s,to:i}},o=await L["default"].connector.gw.getStreamsPackets(e.active,a);L["default"].$logger.info("[streamTraffic]pollingGetMessages"),t("reqStart",{endpoint:"getStreamsPackets",ids:e.active,params:a});const n=h()(o,"data.result",[]);t("setMessagesAppend",n)}catch(s){console.log("------------- 5"),t("reqFailed",s)}}),1e4),e.messagePolling=!0}function j({state:e,commit:t}){clearInterval(G),G=0,e.messagePolling=!1,L["default"].$logger.info("[streamTraffic]removePollingGetMessages")}async function B({state:e,commit:t},{from:s,to:i}){let a=[];try{const o={data:{from:s,to:i}},n=await L["default"].connector.gw.getStreamsPackets(e.active,o);L["default"].$logger.info("[streamTraffic]getExportData"),t("reqStart",{endpoint:"getStreamsPackets",ids:e.active,params:o}),a=h()(n,"data.result",[])}catch(o){console.log("------------- 6"),t("reqFailed",o)}return a}var J={initTime:R,getMessages:D,getMessagesTail:Q,getMessagesNext:V,getMessagesPrev:F,pollingGetMessages:z,removePollingGetMessages:j,getExportData:B};function K(e,t){e.limit=t}function W(e,t){e.active=t}function U(e){e.messages=[]}function Y(e,t){e.messages=t}function X(e,t){e.messages.splice(e.messages.length,0,...t)}function Z(e,t){e.messages.splice(0,0,...t)}function ee(e,t){e.to=t}function te(e,t){e.from=t}function se(e){e.messages=[],e.to=0,e.from=0,e.active=null}function ie(e,t){L["default"].$logger.info(`[streamTraffic]reqStart: ${JSON.stringify(t)}`)}function ae(e,t){L["default"].$logger.info(`[streamTraffic]reqFailed: ${JSON.stringify(t)}`)}var oe={setLimit:K,setActive:W,clearMessages:U,setMessages:Y,setMessagesAppend:X,setMessagesPrepend:Z,clean:se,setTo:ee,setFrom:te,reqFailed:ae,reqStart:ie};const ne={messages:[],active:null,limit:0,from:0,to:0,isLoading:!1,realtimeEnabled:!1,messagePolling:!1};var le={namespaced:!0,state:ne,actions:J,mutations:oe},re=s("798f"),ce={props:["active","isVisibleToolbar","config","streamCloseble"],data(){return{typeOfHexView:"hex",limit:1e3,selectedMessages:"",moduleName:this.config.messages.vuexModuleName}},computed:{hex(){return!(!this.selectedMessages||!this.active)&&this.selectedMessages.reduce(((e,t)=>(e+=this.base64ToHex(t.data)||"",e)),"")}},methods:{getContentBySelected(e){return this.selectedMessages.reduce(((t,s)=>(t+=this.getHeader(s),t+="\r\n",s.data&&(t+=this.getContent(e,this.base64ToHex(s.data),this.typeOfHexView)),t+="\r\n",t)),"")},copySelected(e="view"){const t=this.getContentBySelected(e);this.copy(t,e)},exportSelected(e="view"){const t=this.getContentBySelected(e);this.exportData(t,e)}},created(){console.log("----------------------- streamTraffic"),this.$store.state[this.moduleName]||this.$store.registerModule(this.moduleName,le)},destroyed(){this.$store.commit(`${this.moduleName}/clean`),this.$store.unregisterModule(this.moduleName)},watch:{active(){this.selectedMessages=""}},mixins:[re["a"]],components:{Messages:P,PacketView:E["a"]}},me=ce,de=s("0016"),he=s("6ac5"),ge=s("9c40"),pe=s("05c0"),ue=s("4e73"),fe=s("1c1c"),ve=s("eb85"),$e=s("66e5"),xe=s("4074"),we=s("7f67"),be=Object(k["a"])(me,o,n,!1,null,null,null),ye=be.exports;_()(be,"components",{QToolbar:T["a"],QIcon:de["a"],QToolbarTitle:he["a"],QBtn:ge["a"],QTooltip:pe["a"],QMenu:ue["a"],QList:fe["a"],QSeparator:ve["a"],QItem:$e["a"],QItemSection:xe["a"]}),_()(be,"directives",{ClosePopup:we["a"]});var qe=s("a99a"),Me=s("2f62"),Se=s("286e"),Ne={name:"PageStreamTraffic",props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config","settings"],mixins:[Se["a"]],data(){return{active:null,isInit:!1,isItemsInit:!1,isItemsInitStart:!1,filter:"",prevEntity:null,prevRoute:null,isIntegration:this.$q.platform.within.iframe}},computed:{...Object(Me["d"])({tokenType(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},items(e){return Object.values(e.streams||{})}}),filteredItems(){const e=this.filter.toLowerCase(),t=this.filter?this.items.filter((t=>t&&"undefined"!==typeof t.name&&null!==t.name&&t.name.toLowerCase().indexOf(e)>=0||t&&"undefined"!==typeof t.id&&null!==t.id&&(t.id+"").indexOf(e)>=0)):this.items;return t.sort(((e,t)=>{if(!e.name)return-1;if(!t.name)return 1;const s=e.name.toLowerCase(),i=t.name.toLowerCase();return s<i?-1:1})),t},selectedItem(){return this.items.filter((e=>e.id===this.active))[0]||null}},methods:{unselect(){this.$refs.messages.unselect()},goToStream(){"streams"===this.prevEntity&&this.prevRoute&&this.prevRoute.params.id===this.active?this.$router.push(this.prevRoute).catch((e=>e)):this.$router.push(`/streams/${this.active}`).catch((e=>e))},init(){const e="tools/streamTraffic",t=h()(this.settings,`entities[${e}]`,void 0);this.isInit=!0,this.$route.params&&this.$route.params.id?this.items.filter((e=>e.id===Number(this.$route.params.id))).length?this.active=Number(this.$route.params.id):this.active=null:t&&this.items.filter((e=>e.id===t)).length&&(this.active=t),this.$emit("inited")}},watch:{$route(e){e.params&&e.params.id?this.items.filter((t=>t.id===Number(e.params.id))).length?this.active=Number(e.params.id):this.isInit&&(this.active=null):e.params&&!e.params.id&&(this.active=null)},active(e){const t=this.items.filter((t=>t.id===e))[0]||{};e&&this.$emit("update:settings",{type:"ENTITY_CHANGE",opt:{entity:"tools/streamTraffic"},value:t.id})}},beforeRouteEnter(e,t,s){s((e=>{e.prevRoute=t,e.prevEntity=t.meta.moduleName}))},components:{TrafficViewer:ye,EntitiesToolbar:qe["a"]}},ke=Ne,Ie=(s("be1c"),s("9989")),Te=s("ddd8"),Ce=s("27f9"),_e=s("0170"),He=s("8572"),Pe=Object(k["a"])(ke,i,a,!1,null,null,null);t["default"]=Pe.exports;_()(Pe,"components",{QPage:Ie["a"],QSelect:Te["a"],QInput:Ce["a"],QIcon:de["a"],QItem:$e["a"],QItemSection:xe["a"],QItemLabel:_e["a"],QBtn:ge["a"],QField:He["a"]})},3674:function(e,t,s){},be1c:function(e,t,s){"use strict";s("3674")}}]);