(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"0QMv":function(e,t,i){},"75Vb":function(e,t,i){"use strict";i("pIFo"),i("a1Th"),i("SRfc"),i("KKXr");t["a"]={methods:{filterMessages:function(e,t){function i(e){var t=e.split(",");return t.reduce(function(e,t){var i=[],s="";return-1!==t.indexOf("!=")?(i=t.split("!="),s="!="):-1!==t.indexOf("<=")?(i=t.split("<="),s="<="):-1!==t.indexOf(">=")?(i=t.split(">="),s=">="):-1!==t.indexOf("=")?(i=t.split("="),s="="):-1!==t.indexOf("<")?(i=t.split("<"),s="<"):-1!==t.indexOf(">")?(i=t.split(">"),s=">"):(i=[t,null],s="exist"),s&&e.push({operation:s,field:i[0],value:i[1]}),e},[])}if(this.filter){var s=i(e);return t.filter(function(e){var t=s.reduce(function(t,i){switch(i.operation){case"!=":return t&&!!e[i.field]&&e[i.field]!=i.value;case"<=":return t&&!!e[i.field]&&e[i.field]<=i.value;case">=":return t&&!!e[i.field]&&e[i.field]>=i.value;case"=":return t&&!!JSON.stringify(e[i.field])&&!!e[i.field].toString().match("^".concat(i.value.replace(/\*/g,".*"),"$"));case"<":return t&&!!e[i.field]&&e[i.field]<i.value;case">":return t&&!!e[i.field]&&e[i.field]>i.value;default:return t&&void 0!==e[i.field]}},!0);return t&&(e["x-flespi-filter-fields"]=s.map(function(e){return e.field})),t})}return 0===this.mode?t.map(function(e){return e["x-flespi-filter-fields"]&&delete e["x-flespi-filter-fields"],e}):t}}}},a9U1:function(e,t,i){"use strict";var s=i("y86T"),n=i.n(s);n.a},nONl:function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("virtual-scroll-list",{ref:"scrollList",attrs:{cols:e.cols,actions:e.actions,items:e.messages,date:e.from,mode:e.mode,viewConfig:e.viewConfig,colsConfigurator:"toolbar",i18n:e.i18n,filter:e.filter,theme:e.theme,title:"Messages"},on:{"change:filter":e.filterChangeHandler,"change:pagination-next":e.paginationNextChangeHandler,"change:mode":e.modeChange,"update:cols":e.updateColsHandler},scopedSlots:e._u([{key:"items",fn:function(t){var s=t.item,n=t.index,o=t.actions,c=t.cols,a=t.etcVisible,r=t.actionsVisible,l=t.itemHeight,m=t.rowWidth;return i("messages-list-item",{key:""+JSON.stringify(s)+n,attrs:{item:s,index:n,actions:o,cols:c,itemHeight:l,rowWidth:m,etcVisible:a,actionsVisible:r,selected:n===e.selected},on:{action:e.actionHandler,"item-click":e.viewMessagesHandler}})}}])})],1)},n=[],o=(i("ls82"),i("yXPU")),c=i.n(o),a=i("3kWr"),r=i("Kw5r"),l=i("9JDm"),m=i("75Vb"),u=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{style:{height:e.itemHeight+"px",width:e.rowWidth+"px"}},[e.item["__connectionStatus"]||e.item["x-flespi-filter-prev"]||e.item["x-flespi-filter-next"]?e.item["x-flespi-filter-prev"]||e.item["x-flespi-filter-next"]?i("div",{style:{height:e.itemHeight+"px",width:e.rowWidth+"px",color:"#000",fontWeight:"bold",backgroundColor:e.item["x-flespi-filter-prev"]?"#819002":"#ccb300",overflow:"hidden"}},[i("span",{staticClass:"uppercase text-white",staticStyle:{padding:"0 5px"}},[e._v(e._s(e.item["x-flespi-filter-next"]?'Next results will be filtered by: "'+e.item["x-flespi-filter-next"]+'"':'Filter removed: "'+e.item["x-flespi-filter-prev"]+'"'))])]):i("div",{style:{height:e.itemHeight+"px",width:e.rowWidth+"px",border:"solid 1px #000",color:"#000",fontWeight:"bold",backgroundColor:"offline"===e.item.__connectionStatus?"#ff0":"#0f0",backgroundImage:"url(./statics/police.png)",overflow:"hidden",opacity:".7"},attrs:{title:e.date.formatDate(1e3*e.item.timestamp,"DD/MM/YYYY HH:mm:ss")}},e._l(Array(10),function(t){return i("span",{key:t,staticClass:"uppercase",staticStyle:{padding:"0 5px","margin-left":"150px"},style:{backgroundColor:"offline"===e.item.__connectionStatus?"#ff0":"#0f0"}},[e._v(e._s(e.item["__connectionStatus"]))])})):i("div",{staticClass:"cursor-pointer",class:[e.item.__status?"missed-items":""],style:{height:e.itemHeight+"px",width:e.rowWidth+"px",backgroundColor:e.selected?"rgba(255,255,255,0.7)":"",color:e.selected?"#333":""},on:{click:function(t){e.itemClickHandler(e.index,e.item)}}},[e.actionsVisible?i("span",{staticClass:"list__item item_actions"},e._l(e.actions,function(t,s){return i("q-icon",{key:s,staticClass:"cursor-pointer on-left",class:t.classes,attrs:{name:t.icon},nativeOn:{click:function(i){i.stopPropagation(),e.clickHandler(e.index,t.type,e.item)}}},[i("q-tooltip",[e._v(e._s(t.label))])],1)})):e._e(),e._l(e.cols,function(t,s){return i("span",{key:t.name+s,staticClass:"list__item",class:(n={},n["item_"+s]=!0,n),style:{color:e.item["x-flespi-filter-fields"]&&e.item["x-flespi-filter-fields"].includes(t.name)?"#4caf50":""},attrs:{title:JSON.stringify(e.values[t.name].value)}},[e._v("\n    "+e._s(e.values[t.name].value)+"\n  ")]);var n}),e.etcVisible?i("span",{staticClass:"list__item item_etc"},[e._v("\n    "+e._s(e.values.etc.value||"*Empty*")+"\n  ")]):e._e()],2)])},f=[],d=i("lSNA"),h=i.n(d),p=i("cDf5"),g=i.n(p),v=(i("KKXr"),i("yt8O"),i("RW0V"),i("rGqo"),i("f3/d"),{props:["item","index","actions","cols","itemHeight","etcVisible","rowWidth","actionsVisible","selected"],data:function(){return{date:l["d"]}},computed:{values:function(){var e=this,t=this.cols.reduce(function(e,t,i,s){return e[t.name]={value:null},i===s.length-1&&(e.etc={value:""}),e},{});return Object.keys(this.item).forEach(function(i){if(-1!==i.indexOf("#")){var s=i.split("#"),n=s[0],o=s[1];if(t[n]){if(t[n].value){if("object"!==g()(t[n].value)){var c=t[n].value;t[n].value=h()({},o-1,c)}}else t[n].value={};t[n].value[o]=JSON.stringify(e.item[i])}else t.etc.value+="".concat(i,": ").concat(JSON.stringify(e.item[i]),"; ")}else if(t[i]){var a=e.item[i];-1!==i.indexOf("timestamp")&&(a=l["d"].formatDate(1e3*a,"DD/MM/YYYY HH:mm:ss")),-1!==i.indexOf("image.bin.")&&(a="<binary image>"),t[i].value=JSON.stringify(a)}else{if("__status"===i||"x-flespi-filter-fields"===i||"x-flespi-filter-next"===i||"x-flespi-filter-prev"===i)return!1;t.etc.value+="".concat(i,": ").concat(JSON.stringify(e.item[i]),"; ")}}),Object.keys(t).forEach(function(e){if("object"===g()(t[e].value)&&t[e].value)if(t[e].value instanceof Array){var i=t[e].value.reduce(function(e,t,i,s){return e+=t,i!==s.length-1&&(e+=", "),e},"");t[e].value=i}else if(t[e].value instanceof Object){var s=Object.keys(t[e].value).reduce(function(i,s,n,o){return i+="".concat(s,": ").concat(t[e].value[s]),n!==o.length-1&&(i+=", "),i},"");t[e].value=s}}),t}},methods:{clickHandler:function(e,t,i){this.$emit("action",{index:e,type:t,content:i})},itemClickHandler:function(e,t){this.$emit("item-click",{index:e,content:t})}}}),x=v,N=(i("a9U1"),i("KHd+")),$=Object(N["a"])(x,u,f,!1,null,null,null),y=$.exports,_={props:["mode","date","activeId","limit","config"],data:function(){return{theme:this.config.theme,i18n:{},viewConfig:this.config.viewConfig,actions:this.config.actions,moduleName:this.config.vuexModuleName}},computed:{messages:{get:function(){var e=this.$store.state[this.moduleName].messages;return this.setTranslation(e),1===this.mode?e:this.filterMessages(this.filter,e)},set:function(e){this.$store.commit("".concat(this.moduleName,"/setMessages"),e)}},active:{get:function(){return this.$store.state[this.moduleName].active},set:function(){var e=c()(regeneratorRuntime.mark(function e(t){var i;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.$store.dispatch("".concat(this.moduleName,"/unsubscribePooling"));case 2:return this.$store.commit("".concat(this.moduleName,"/setActive"),t),i=this.$store.state.items.filter(function(e){return t===e.id})[0]||{},r["default"].set(this.config.viewConfig,"needShowEtc",i.protocol_name&&("http"===i.protocol_name||"mqtt"===i.protocol_name)),e.next=7,this.$store.dispatch("".concat(this.moduleName,"/getCols"));case 7:this.modeChange(this.mode),this.$store.dispatch("".concat(this.moduleName,"/pollingGet"));case 9:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},cols:{get:function(){return this.$store.state[this.moduleName].cols},set:function(e){this.$store.commit("".concat(this.moduleName,"/updateCols"),e)}},filter:{get:function(){return this.$store.state[this.moduleName].filter},set:function(e){e?this.$store.commit("".concat(this.moduleName,"/setFilter"),e):this.$store.commit("".concat(this.moduleName,"/setFilter"),"")}},from:{get:function(){return this.$store.state[this.moduleName].from},set:function(e){e?this.$store.commit("".concat(this.moduleName,"/setFrom"),e):this.$store.commit("".concat(this.moduleName,"/setFrom"),0)}},to:{get:function(){return this.$store.state[this.moduleName].to},set:function(e){e?this.$store.commit("".concat(this.moduleName,"/setTo"),e):this.$store.commit("".concat(this.moduleName,"/setTo"),0)}},currentLimit:{get:function(){return this.$store.state[this.moduleName].limit},set:function(e){e?this.$store.commit("".concat(this.moduleName,"/setLimit"),e):this.$store.commit("".concat(this.moduleName,"/setLimit"),1e3)}},selected:{get:function(){return this.$store.state[this.moduleName].selected},set:function(e){this.$store.commit("".concat(this.moduleName,"/setSelected"),e)}}},methods:{resetParams:function(){this.$refs.scrollList.resetParams()},filterChangeHandler:function(e){this.filter!==e&&(this.filter=e)},setTranslation:function(e){this.i18n.to=e.length?"Next batch from ".concat(l["d"].formatDate(1e3*this.from,"HH:mm:ss")):"Next"},modeChange:function(e){switch(e=+e,this.$store.commit("".concat(this.moduleName,"/clearMessages")),this.$store.commit("".concat(this.moduleName,"/setMode"),e),e){case 0:this.active&&this.$store.dispatch("".concat(this.moduleName,"/get"));break}},updateColsHandler:function(e){this.cols=e},paginationNextChangeHandler:function(){this.$store.dispatch("".concat(this.moduleName,"/get"))},actionHandler:function(e){var t=e.index,i=e.type,s=e.content;switch(i){case"view":this.viewMessagesHandler({index:t,content:s});break;case"copy":this.copyMessageHandler({index:t,content:s});break}},viewMessagesHandler:function(e){var t=e.index,i=e.content;this.selected=t,this.$emit("view-data",i)},copyMessageHandler:function(e){var t=this,i=(e.index,e.content);this.$copyText(JSON.stringify(i)).then(function(e){t.$q.notify({type:"positive",icon:"content_copy",message:"Message copied",timeout:1e3})},function(e){t.$q.notify({type:"negative",icon:"content_copy",message:"Error coping messages",timeout:1e3})})},unselect:function(){this.selected&&(this.selected=null)}},watch:{activeId:function(e){this.active=e},mode:function(e){this.modeChange(e)},limit:function(e){this.currentLimit=e}},created:function(){var e=c()(regeneratorRuntime.mark(function e(){var t,i=this;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(this.$store.state[this.moduleName]?this.$store.commit("".concat(this.moduleName,"/clear")):this.$store.registerModule(this.moduleName,Object(a["b"])({Vue:r["default"],LocalStorage:this.$q.localStorage,name:this.moduleName,errorHandler:function(e){i.$store.commit("reqFailed",e)},filterHandler:this.filterMessages})),this.currentLimit=this.limit,!this.activeId){e.next=8;break}return this.$store.commit("".concat(this.moduleName,"/setActive"),this.activeId),t=this.$store.state.items.filter(function(e){return i.activeId===e.id})[0]||{},r["default"].set(this.config.viewConfig,"needShowEtc",t.protocol_name&&("http"===t.protocol_name||"mqtt"===t.protocol_name)),e.next=8,this.$store.dispatch("".concat(this.moduleName,"/getCols"));case 8:null===this.$store.state[this.moduleName].mode&&(this.modeChange(this.mode),this.$store.dispatch("".concat(this.moduleName,"/pollingGet"))),r["default"].connector.socket.on("offline",function(){1===i.mode&&(i.$store.commit("".concat(i.moduleName,"/setOffline"),1===i.mode),i.$store.commit("setSocketOffline",!0))}),r["default"].connector.socket.on("connect",function(){i.$store.state[i.moduleName].offline&&(i.$store.commit("".concat(i.moduleName,"/setReconnected"),1===i.mode),i.$store.commit("setSocketOffline",!1))});case 11:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),destroyed:function(){r["default"].connector.socket.off("offline"),r["default"].connector.socket.off("connect"),this.$store.commit("".concat(this.moduleName,"/clear"))},mixins:[m["a"]],components:{VirtualScrollList:a["a"],MessagesListItem:y}},b=_,w=(i("r4WM"),Object(N["a"])(b,s,n,!1,null,null,null));t["default"]=w.exports},r4WM:function(e,t,i){"use strict";var s=i("0QMv"),n=i.n(s);n.a},y86T:function(e,t,i){}}]);