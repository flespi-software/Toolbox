(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["app"],{0:function(e,t,n){e.exports=n("2f39")},1:function(e,t){},"1e5d":function(e,t,n){},2:function(e,t){},"2f39":function(e,t,n){"use strict";n.r(t);n("ac6a"),n("4a91"),n("a114"),n("d14b"),n("113c"),n("a4a9"),n("908f"),n("1e5d"),n("7e6d");var o=n("2b0e"),i=n("e84f"),a=n("7051"),r=n("2040"),s=n("cf12"),c=n("46a9"),d=n("32a1"),l=n("f30c"),u=n("ce67"),f=n("482e"),p=n("52b5"),m=n("1180"),h=n("1e55"),v=n("506f"),w=n("b8d9"),g=n("7d43"),b=n("9541"),y=n("91c8"),S=n("5d8b"),k=n("d3e7"),C=n("cc4a"),I=n("363b"),x=n("c563"),M=n("db7b"),L=n("c081"),Q=n("9413"),O=n("b5b8"),T=n("206e"),_=n("895f"),D=n("0952"),N=n("2a70"),P=n("03d8"),E=n("5931"),q=n("4bf4"),j=n("94e3"),F=n("bc9b"),R=n("3d5b"),H=n("6186"),V=n("79e9"),A=n("525b"),J=n("ac83"),$=n("ce1c"),B=n("09fa"),z=n("7646"),G=n("6580"),U=n("3a08"),X=n("3054"),W=n("6ddb"),K=n("2bd2"),Y=n("28c4"),Z=n("f62b"),ee=n("133b"),te=n("6780"),ne=n("f9d8"),oe=n("37c5");o["default"].use(i["a"],{config:{},components:{QLayout:a["a"],QLayoutHeader:r["a"],QLayoutDrawer:s["a"],QPageContainer:c["a"],QPage:d["a"],QToolbar:l["a"],QToolbarTitle:u["a"],QBtn:f["a"],QIcon:p["a"],QList:m["a"],QListHeader:h["a"],QItem:v["a"],QItemMain:w["a"],QItemSide:g["a"],QItemTile:b["a"],QItemSeparator:y["a"],QInput:S["a"],QProgress:k["a"],QWindowResizeObservable:C["a"],QResizeObservable:I["a"],QTabs:x["a"],QTab:M["a"],QTabPane:L["a"],QRouteTab:Q["a"],QPopover:O["a"],QInnerLoading:T["a"],QSpinnerGears:_["a"],QModal:D["a"],QModalLayout:N["a"],QTooltip:P["a"],QSelect:E["a"],QChip:q["a"],QSlider:j["a"],QToggle:F["a"],QDatetime:R["a"],QSearch:H["a"],QField:V["a"],QCheckbox:A["a"],QCollapsible:J["a"],QContextMenu:$["a"],QBtnToggle:B["a"],QCard:z["a"],QCardTitle:G["a"],QCardMain:U["a"],QCardSeparator:X["a"],QCardActions:W["a"]},directives:{CloseOverlay:K["a"],TouchSwipe:Y["a"],TouchPan:Z["a"]},plugins:{Notify:ee["a"],Dialog:te["a"],LocalStorage:ne["a"],SessionStorage:oe["a"]}});var ie=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"q-app"}},[n("router-view"),n("offline")],1)},ae=[],re=function(){var e=this,t=e.$createElement,n=e._self._c||t;return e.$store.state.token&&(e.$store.state.offline||e.$store.state.socketOffline)?n("div",{staticClass:"offline-page window-height window-width bg-light column items-center no-wrap"},[n("div",{staticClass:"offline-back"},[n("div",{staticClass:"offline-code"}),n("div",{staticClass:"offline-line"},e._l(Array(20),function(t){return n("span",{key:t},[e._v("offline")])}))])]):e._e()},se=[],ce={name:"offline",data:function(){return{intervalId:0}},created:function(){var e=this;this.intervalId=setInterval(function(){e.$store.dispatch("checkConnection")},5e3)}},de=ce,le=(n("85c2"),n("2877")),ue=Object(le["a"])(de,re,se,!1,null,null,null);ue.options.__file="Offline.vue";var fe=ue.exports,pe={name:"App",components:{Offline:fe}},me=pe,he=(n("7faf"),Object(le["a"])(me,ie,ae,!1,null,null,null));he.options.__file="App.vue";var ve=he.exports,we=n("2f62"),ge=n("3156"),be=n.n(ge),ye=(n("f751"),n("551c"),n("cadf"),n("9523")),Se=n.n(ye),ke=(n("6b54"),n("28a5"),n("7f7f"),n("96cf"),n("c973")),Ce=n.n(ke),Ie={devices:"/gw/devices",channels:"/gw/channels",calcs:"/gw/calcs",streams:"/gw/streams",modems:"/gw/modems",containers:"/storage/containers",cdns:"/storage/cdns",tasks:"/gw/calcs/+/devices",subaccounts:"/platform/subaccounts"},xe=0,Me=1;function Le(e,t){return Qe.apply(this,arguments)}function Qe(){return Qe=Ce()(regeneratorRuntime.mark(function e(t,n){var i,a,r,s,c,d,l,u,f,p,m,h,v,w;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(i=t.state,a=t.commit,r="",s=null,c="items",d=xe,"string"===typeof n?r=n:(r=n.entity,n.id&&(s=n.id),n.addition&&(c="addition.".concat(r)),n.mode&&(d=n.mode)),!r){e.next=28;break}if(l="flespi/state".concat(Ie[r],"/").concat(s||"+").concat(d===Me?"/+":""),!i.token){e.next=28;break}if(e.prev=6,"channels"!==r||i.protocols){e.next=13;break}return e.next=10,o["default"].connector.gw.getProtocols("all",{fields:"name,id"});case 10:u=e.sent,f=u.data.result.reduce(function(e,t){return e[t.id]=t.name,e},{}),o["default"].set(i,"protocols",f);case 13:return p={},m=l.split("/").reverse().slice(1),h=function(e,t,n){var s=t.split("/").reverse(),d=m.reduce(function(e,t,n){return"+"===t&&e.push(s[n]),e},[]).reverse(),l=d.length<=1?parseInt(s.shift()):d.join("-"),u=w?i[c]:p;e.length?o["default"].set(u,l,JSON.parse(e.toString())):a("deleteItem",{id:l,mode:"tasks"===r,source:u})},v=function(e,t,n){var s=t.split("/").reverse(),d=s.shift(),l=m.reduce(function(e,t,n){return"+"===t&&e.push(s[n]),e},[]).reverse(),u=0===l.length?parseInt(s.shift()):l.join("-"),f=w?i[c]:p;return"deleted"===d?(a("deleteItem",{id:u,mode:"tasks"===r,source:f}),!1):!!e.length&&void(f[u]?o["default"].set(f[u],d,JSON.parse(e.toString())):o["default"].set(f,u,Se()({id:u},d,JSON.parse(e.toString()))))},e.next=19,o["default"].connector.socket.subscribe({name:l,handler:d===xe?h:v});case 19:return w=e.sent,o["default"].set(i,c,p),e.abrupt("return",w);case 24:e.prev=24,e.t0=e["catch"](6),a("reqFailed",e.t0),a("setItems",{});case 28:case"end":return e.stop()}},e,null,[[6,24]])})),Qe.apply(this,arguments)}function Oe(e,t){return Te.apply(this,arguments)}function Te(){return Te=Ce()(regeneratorRuntime.mark(function e(t,n){var i,a,r,s,c,d;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(i=t.state,a=t.commit,r="",s=null,c=xe,"string"===typeof n?r=n:(r=n.entity,n.id&&(s=n.id),n.addition&&o["default"].delete(i,"addition.".concat(r)),n.mode&&(c=n.mode)),!r){e.next=14;break}return d="flespi/state".concat(Ie[r],"/").concat(s||"+").concat(c===Me?"/+":""),e.prev=5,e.next=8,o["default"].connector.socket.unsubscribe(d);case 8:return e.abrupt("return",e.sent);case 11:e.prev=11,e.t0=e["catch"](5),a("reqFailed",e.t0);case 14:case"end":return e.stop()}},e,null,[[5,11]])})),Te.apply(this,arguments)}function _e(e,t){return De.apply(this,arguments)}function De(){return De=Ce()(regeneratorRuntime.mark(function e(t,n){var i,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return i=t.state,o["default"].set(i,"isLoading",!0),e.next=4,Promise.all(n.map(function(e){return Le(t,e)}));case 4:return a=e.sent,o["default"].set(i,"isLoading",!1),e.abrupt("return",a);case 7:case"end":return e.stop()}},e)})),De.apply(this,arguments)}function Ne(e,t){return Pe.apply(this,arguments)}function Pe(){return Pe=Ce()(regeneratorRuntime.mark(function e(t,n){var i,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return i=t.state,o["default"].set(i,"isLoading",!0),e.next=4,Promise.all(n.map(function(e){return Oe(t,e)}));case 4:return a=e.sent,o["default"].set(i,"isLoading",!1),e.abrupt("return",a);case 7:case"end":return e.stop()}},e)})),Pe.apply(this,arguments)}function Ee(e,t){return qe.apply(this,arguments)}function qe(){return qe=Ce()(regeneratorRuntime.mark(function e(t,n){var i,a,r,s,c,d,l;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(i=t.state,a=t.commit,!n){e.next=42;break}r={fields:"item_data",count:2e3,reverse:!0},e.t0=n,e.next="devices"===e.t0?6:"channels"===e.t0?8:"streams"===e.t0?10:"calcs"===e.t0?12:"modems"===e.t0?14:"containers"===e.t0?16:"cdns"===e.t0?18:20;break;case 6:return r=Object.assign(r,{filter:"event_origin=gw/devices/*,event_code=3"}),e.abrupt("break",20);case 8:return r=Object.assign(r,{filter:"event_origin=gw/channels/*,event_code=3"}),e.abrupt("break",20);case 10:return r=Object.assign(r,{filter:"event_origin=gw/streams/*,event_code=3"}),e.abrupt("break",20);case 12:return r=Object.assign(r,{filter:"event_origin=gw/calcs/*,event_code=3"}),e.abrupt("break",20);case 14:return r=Object.assign(r,{filter:"event_origin=gw/modems/*,event_code=3"}),e.abrupt("break",20);case 16:return r=Object.assign(r,{filter:"event_origin=storage/containers/*,event_code=3"}),e.abrupt("break",20);case 18:return r=Object.assign(r,{filter:"event_origin=storage/cdns/*,event_code=3"}),e.abrupt("break",20);case 20:if(!i.token){e.next=42;break}if(e.prev=21,"undefined"!==typeof i.isLoading&&o["default"].set(i,"isLoading",!0),s=[],1!==i.tokenInfo.access.type){e.next=31;break}return e.next=27,o["default"].connector.platform.getCustomerLogs({data:JSON.stringify(r)});case 27:c=e.sent,d=c.data,d.errors&&d.errors.forEach(function(e){a("addError",e.reason)}),s=d.result&&d.result.length?d.result.reverse():[];case 31:s.length||ee["a"].create({message:"No deleted ".concat(n," found."),timeout:1e3}),l=be()({},i.items,s.reduce(function(e,t){var n=t.item_data;return n.deleted=!0,e[n.id]=n,e},{})),a("setItems",l),"undefined"!==typeof i.isLoading&&o["default"].set(i,"isLoading",!1),e.next=42;break;case 37:e.prev=37,e.t1=e["catch"](21),a("reqFailed",e.t1),a("setItems",{}),"undefined"!==typeof i.isLoading&&o["default"].set(i,"isLoading",!1);case 42:case"end":return e.stop()}},e,null,[[21,37]])})),qe.apply(this,arguments)}function je(e){return Fe.apply(this,arguments)}function Fe(){return Fe=Ce()(regeneratorRuntime.mark(function e(t){var n,i,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.state,i=t.commit,e.abrupt("return",!1);case 3:return e.prev=3,e.next=6,o["default"].connector.http.external.get("./statics/icons/favicon-16x16.png?_=".concat((new Date).getTime()));case 6:a=e.sent,200===a.status&&n.offline&&i("setOfflineFlag",!1),e.next=14;break;case 10:e.prev=10,e.t0=e["catch"](3),n.offline||i("setOfflineFlag",!0);case 14:case"end":return e.stop()}},e,null,[[3,10]])})),Fe.apply(this,arguments)}var Re={getItems:Le,unsubscribeItems:Oe,checkConnection:je,getDeleted:Ee,getEntities:_e,removeEntities:Ne},He=n("448a"),Ve=n.n(He);n("6762"),n("2fdb"),n("456d"),n("4917"),n("a481");function Ae(e){0}function Je(e,t){if(t.response&&t.response.status)switch(t.response.status){case 0:Ge(e,!0),o["default"].set(e,"token","");break;case 401:Xe(e);break;default:t.response.data&&t.response.data.errors&&t.response.data.errors.length&&t.response.data.errors.forEach(function(t){Ke(e,t.reason)})}else Ke(e,t.message),2!==t.code&&134!==t.code&&135!==t.code||Xe(e)}function $e(e,t){var n=t.id,i=t.mode,a=t.source;i?o["default"].delete(a,n):o["default"].set(a[n],"deleted",!0)}function Be(e,t){o["default"].set(e,"items",t)}function ze(e){o["default"].set(e,"items",{})}function Ge(e,t){o["default"].set(e,"offline",t)}function Ue(e,t){var n=t.replace("FlespiToken ","");if(n===e.token)return!1;t&&n.match(/^[a-z0-9]+$/i)?oe["a"].set("toolbox-token",n):(n="",Xe(e)),o["default"].connector.token="FlespiToken ".concat(n),o["default"].set(e,"token",n),Ye(e)}function Xe(e){oe["a"].remove("toolbox-token"),o["default"].connector.token="",o["default"].set(e,"token",""),et(e),Object.keys(e.config).forEach(function(t){o["default"].set(e.config[t],"isDrawable",!1)})}function We(e,t){o["default"].set(e,"config",t)}function Ke(e,t){if(!e.token)return!1;console.trace(),ee["a"].create({type:"negative",icon:"warning",message:"".concat(t),timeout:1e3}),e.newNotificationCounter++,e.errors.push(t)}function Ye(e){e.errors=[]}function Ze(e,t){switch(o["default"].set(e,"tokenInfo",t),t.access.type){case 0:Object.keys(e.config).forEach(function(t){if("platform"===t)return!1;o["default"].set(e.config[t],"isDrawable",!0)});break;case 1:Object.keys(e.config).forEach(function(t){o["default"].set(e.config[t],"isDrawable",!0)});break;case 2:o["default"].set(e.config.platform,"isDrawable",!1);var n=t.access.acl.reduce(function(e,t){if("gw"===t.uri)return t.methods.includes("GET")?Ve()(e).concat(["channels","calcs","devices","streams","modems","protocols"]):e;if("storage"===t.uri)return t.methods.includes("GET")?Ve()(e).concat(["containers","cdns"]):e;var n=t.uri.split("/")[1]||t.uri.split("/")[0];return!e.includes(n)&&(!t.methods||t.methods&&t.methods.includes("GET"))&&e.push(n),e},[]);Object.keys(e.config).forEach(function(t){var i=e.config[t];if(!i.acl)return!1;var a=i.acl.reduce(function(e,t){return e&&n.includes(t)},!0);a&&o["default"].set(e.config[t],"isDrawable",!0)});break}}function et(e){e.tokenInfo=null}function tt(e,t){o["default"].set(e,"socketOffline",t)}function nt(e){e.newNotificationCounter=0}var ot={reqStart:Ae,setItems:Be,deleteItem:$e,reqFailed:Je,setToken:Ue,clearToken:Xe,setOfflineFlag:Ge,clearItems:ze,setConfig:We,addError:Ke,clearErrors:Ye,setTokenInfo:Ze,clearTokenInfo:et,setSocketOffline:tt,clearNotificationCounter:nt},it=n("7dc5");o["default"].use(we["a"]);var at={token:"",items:{},offline:!1,socketOffline:!1,isLoading:!1,config:JSON.parse(JSON.stringify(it)),errors:[],tokenInfo:null,newNotificationCounter:0},rt=new we["a"].Store({state:at,actions:Re,mutations:ot}),st=rt,ct=n("8c4f"),dt=n("8103"),lt=n.n(dt);function ut(e){return Object.keys(e).reduce(function(t,o){var i=lt()(o),a=e[o].type,r=e[o].path||o,s={path:r,component:function(){return n("a383")("./".concat(a,"/").concat(i))},meta:{moduleName:o},children:[{path:":id",meta:{moduleName:o}}]};return"devices"===o&&t.push({path:"devices/:id/calc/:calcId/intervals",component:function(){return n("f32d")("./".concat(a,"/Intervals"))},meta:{moduleName:"intervals"}}),t.push(s),t},[])}var ft=[{path:"/",component:function(){return n.e("35170d12").then(n.bind(null,"b831"))},children:Ve()(ut(it)).concat([{path:"view/:type/:id",name:"module",component:function(){return n.e("35170d12").then(n.bind(null,"b831"))}}])},{path:"/token/:token/type/:type/id/:id",component:function(){return n.e("35170d12").then(n.bind(null,"b831"))}},{path:"/token/:token/group/:group",component:function(){return n.e("35170d12").then(n.bind(null,"b831"))}},{path:"/token/:token/type/:type/id/:id/fullscreen/:fullscreen",component:function(){return n.e("35170d12").then(n.bind(null,"b831"))}},{path:"/token/:token/type/:type/id/:id/fullscreen/:fullscreen/noselect/:noselect",component:function(){return n.e("35170d12").then(n.bind(null,"b831"))}},{path:"/login",component:function(){return n.e("0a37bb42").then(n.bind(null,"013f"))},name:"simpleLogin"},{path:"/login/:token",component:function(){return n.e("0a37bb42").then(n.bind(null,"013f"))}},{path:"/login/:token/flespi",component:function(){return n.e("0a37bb42").then(n.bind(null,"013f"))}}];o["default"].use(ct["a"]);var pt=new ct["a"]({mode:"hash",base:"",scrollBehavior:function(){return{y:0}},routes:ft}),mt=pt,ht=function(){var e="function"===typeof st?st():st,t="function"===typeof mt?mt({store:e}):mt;e.$router=t;var n={el:"#q-app",router:t,store:e,render:function(e){return e(ve)}};return{app:n,store:e,router:t}},vt=n("a925"),wt={failed:"Action failed",success:"Action was successful"},gt={en:wt},bt=function(e){var t=e.app,n=e.Vue;n.use(vt["a"]),t.i18n=new vt["a"]({locale:"en",fallbackLocale:"en",messages:gt})},yt=n("41dc"),St=n("9224"),kt={protocolVersion:5,wsOptions:{objectMode:!1,perMessageDeflate:!0}},Ct={socketConfig:{clientId:"toolbox-".concat(St["version"],"-").concat(Math.random().toString(16).substr(2,8)),mqttSettings:kt}};-1===window.location.host.indexOf("localhost:9004")&&-1===window.location.host.indexOf("localhost:9005")&&-1===window.location.host.indexOf("localhost:7004")||(Ct={httpConfig:{server:"https://localhost",port:9005},socketConfig:{server:"wss://localhost:9017",clientId:"toolbox-".concat(St["version"],"-dev-").concat(Math.random().toString(16).substr(2,8)),mqttSettings:kt}}),"flespi"===window.location.hash.split("/").slice(-1)[0]&&(Ct={socketConfig:{clientId:"toolbox-".concat(St["version"],"-").concat(Math.random().toString(16).substr(2,8)),mqttSettings:kt}});var It=function(e){var t=e.Vue,n=e.store;t.prototype.$flespiServer=Ct.httpConfig&&Ct.httpConfig.server?"".concat(Ct.httpConfig.server,":").concat(Ct.httpConfig.port):"https://flespi.io",t.use(yt["a"],Ct),t.connector.socket.on("connect",function(e){var t=JSON.parse(e.properties.userProperties.token);n.commit("setTokenInfo",t),n.commit("setSocketOffline",!1)}),t.connector.socket.on("error",function(e){n.commit("reqFailed",e)}),t.connector.socket.on("offline",function(){n.commit("setSocketOffline",!0)}),window&&window.addEventListener("beforeunload",function(){t.connector.socket.close(!0)})},xt=n("4eb5"),Mt=n.n(xt),Lt=function(e){var t=e.Vue;t.use(Mt.a)},Qt=(n("4d6b"),function(){}),Ot=ht(),Tt=Ot.app,_t=Ot.store,Dt=Ot.router;[bt,It,Lt,Qt].forEach(function(e){e({app:Tt,router:Dt,store:_t,Vue:o["default"],ssrContext:null})}),new o["default"](Tt)},3:function(e,t){},4:function(e,t){},"4d6b":function(e,t,n){},"4d8e":function(e,t,n){},6292:function(e,t,n){},"7dc5":function(e){e.exports={platform:{label:"Platform",icon:"icon-flespi2-02-01",type:"viewer",isDrawable:!1,logs:{vuexModuleName:"platformLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:450,display:!0,description:"Log event code and description"},{name:"host",width:150,display:!0,description:"Connected device's address (source) or IP address from which HTTP request was received (host)"}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},channels:{label:"Channels",icon:"merge_type",type:"viewer",acl:["protocols","channels"],isDrawable:!1,logs:{vuexModuleName:"channelsLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:400,display:!0,description:"Log event code and description"},{name:"ident",width:150,display:!0,description:"Connected device's identification string"},{name:"msgs",title:"messages",width:85,display:!0,description:"Number of messages received"},{name:"recv",title:"received",width:85,display:!0,description:"Number of bytes received"},{name:"send",title:"sent",width:85,display:!0,description:"Number of bytes sent"},{name:"host",width:150,display:!0,description:"Connected device's address (source) or IP address from which HTTP request was received (host)"},{name:"duration",width:85,display:!0,description:"Connection duration in seconds"},{name:"transport",width:85,display:!0,description:"Connected device's transport: tcp, udp, http etc"}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}},messages:{vuexModuleName:"channelsMessages",actions:[{icon:"mdi-content-copy",label:"copy",classes:"",type:"copy"}],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},calcs:{label:"Calcs",icon:"mdi-calculator-variant",type:"viewer",acl:["calcs"],isDrawable:!1,logs:{vuexModuleName:"calcsLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:400,display:!0,description:"Log event code and description"},{name:"host",width:150,display:!0,description:"Connected device's address (source) or IP address from which HTTP request was received (host)"}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},devices:{label:"Devices",icon:"mdi-developer-board",type:"viewer",acl:["devices"],isDrawable:!1,logs:{vuexModuleName:"devicesLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:400,display:!0,description:"Log event code and description"},{name:"name",title:"setting",width:80,display:!0,description:"Setting name"},{name:"ident",width:150,display:!0,description:"Connected device's identification string"},{name:"msgs",title:"messages",width:85,display:!0,description:"Number of messages received"},{name:"recv",title:"received",width:85,display:!0,description:"Number of bytes received"},{name:"send",title:"sent",width:85,display:!0,description:"Number of bytes sent"},{name:"source",width:150,display:!0,description:"Connected device's address"},{name:"host",width:150,display:!0,description:"IP address from which HTTP request was received"},{name:"duration",width:85,display:!0,description:"Connection duration in seconds"},{name:"transport",width:85,display:!0,description:"Connected device's transport: tcp, udp, http etc"}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}},messages:{vuexModuleName:"devicesMessages",actions:[{icon:"mdi-content-copy",label:"copy",classes:"",type:"copy"}],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}},intervals:{vuexModuleName:"intervals",actions:[{icon:"mdi-content-copy",label:"copy",classes:"",type:"copy"},{icon:"mdi-map",label:"on map",classes:"",type:"map"}],viewConfig:{needShowFilter:!0,needShowDateRange:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},streams:{label:"Streams",icon:"mdi-call-split",type:"viewer",acl:["streams"],isDrawable:!1,logs:{vuexModuleName:"streamsLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:450,display:!0,description:"Log event code and description"},{name:"messages",width:100,display:!0,description:"Number of messages has sent"},{name:"host",width:150,display:!0,description:"IP address from which HTTP request was received"}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},modems:{label:"Modems",icon:"router",type:"viewer",acl:["modems"],isDrawable:!1,logs:{vuexModuleName:"modemsLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:450,display:!0,description:"Log event code and description"},{name:"address",width:100,display:!0,description:"SMS source address or SMS destination address"},{name:"type",width:100,display:!0,description:"hex or text"},{name:"text",width:150,display:!0,description:"textual SMS contents"},{name:"hex",width:150,display:!0,description:"hex representation of binary SMS contents"}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},containers:{label:"Containers",icon:"featured_play_list",type:"viewer",acl:["containers"],isDrawable:!1,logs:{vuexModuleName:"containersLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:450,display:!0,description:"Log event code and description"},{name:"host",width:80,display:!0,description:"IP address from which HTTP request was received"}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},mqtt:{label:"MQTT",icon:"mdi-access-point-network",acl:["mqtt"],type:"viewer",isDrawable:!1,logs:{vuexModuleName:"mqttLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:450,display:!0,description:"Log event code and description"},{name:"client_id",width:150,display:!0,description:"session client id"},{name:"published",width:80,display:!0,description:"amount of messages published by session"},{name:"received",width:80,display:!0,description:"amount of messages received by session"}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},cdns:{label:"CDNS",icon:"mdi-harddisk",type:"viewer",acl:["cdns"],isDrawable:!1,logs:{vuexModuleName:"cdnsLogs",cols:[{name:"timestamp",width:165,display:!0,description:"Log event time"},{name:"event_code",title:"event",width:450,display:!0,description:"Log event code and description"},{name:"host",width:150,display:!0,description:"IP address from which HTTP request was received"},{name:"mime",width:80,display:!0,description:"mime type of file"},{name:"name",width:250,display:!0,description:"name of file"},{name:"size",width:80,display:!0,description:""}],actions:[],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right left",needShowDate:!0,needShowEtc:!0},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},hexViewer:{label:"Hex Viewer",path:"tools/hex",type:"tools",icon:"mdi-matrix",acl:["protocols","channels"],isDrawable:!1,messages:{vuexModuleName:"hexMessages",actions:[{icon:"mdi-content-copy",label:"copy",classes:"",type:"copy"}],viewConfig:{needShowFilter:!0,needShowMode:!1,needShowPageScroll:"right",needShowDate:!1},theme:{color:"white",bgColor:"dark",contentInverted:!0,controlsInverted:!0}}},mqttClient:{label:"Mqtt Board",path:"tools/mqtt",type:"tools",icon:"mdi-view-dashboard-variant",isDrawable:!1}}},"7e6d":function(e,t,n){},"7faf":function(e,t,n){"use strict";var o=n("6292"),i=n.n(o);i.a},"85c2":function(e,t,n){"use strict";var o=n("4d8e"),i=n.n(o);i.a},9224:function(e){e.exports={name:"toolbox",version:"0.18.6",description:"ToolboX",productName:"ToolboX",cordovaId:"org.cordova.quasar.app",author:"Sergei Buntsevich <sebu@gurtam.com>",private:!0,scripts:{lint:"eslint --ext .js,.vue src",dev:'node ./build.js "dev -m spa" "flespi"',build:'node ./build.js "build -m spa" "flespi"',dev_local:'node ./build.js "dev -m spa" "local"',deploy:"rm -rf dist && npm run build && rm -rf deploy && mkdir deploy && cp -R dist/spa-mat/* misc CNAME LICENSE package.json deploy && cp README.md deploy/README.md && node_modules/git-directory-deploy/bin/git-directory-deploy.sh -ddeploy -bgh-pages -rhttps://git.gurtam.net/flespi/frontend/toolbox.git && rm -rf deploy && git push github gh-pages"},dependencies:{"flespi-io-js":"git+https://github.com/flespi-software/flespi-io-js.git",leaflet:"^1.5.1",lodash:"^4.17.15","mqtt-board":"git+https://github.com/flespi-software/MQTT-Board.git",qvirtualscroll:"git+https://github.com/flespi-software/QVirtualScroll.git",shelljs:"^0.8.3","vue-clipboard2":"0.0.8","vue-draggable-resizable":"^1.7.5","vue-i18n":"^7.8.1","vue-virtual-scroll-list":"^1.4.2"},devDependencies:{"babel-eslint":"^8.2.6",eslint:"^4.19.1","eslint-config-standard":"^11.0.0","eslint-friendly-formatter":"^3.0.0","eslint-loader":"^2.2.1","eslint-plugin-import":"^2.18.2","eslint-plugin-node":"^6.0.1","eslint-plugin-promise":"^3.8.0","eslint-plugin-standard":"^3.1.0","eslint-plugin-vue":"^4.7.1","git-directory-deploy":"^1.5.1","quasar-cli":"^0.17.26","strip-ansi":"^3.0.1"},engines:{node:">= 8.9.0",npm:">= 5.6.0"},browserslist:["> 1%","last 2 versions","not ie <= 10"]}},a383:function(e,t,n){var o={"./404":["ee5d","4b4818b8"],"./404.vue":["ee5d","4b4818b8"],"./Login":["013f","0a37bb42"],"./Login.vue":["013f","0a37bb42"],"./tools/HexViewer":["56bd","3e5606ca","b7fa7940","03b8b158"],"./tools/HexViewer.vue":["56bd","3e5606ca","b7fa7940","03b8b158"],"./tools/MqttClient":["77ed","3e5606ca","792f72dc"],"./tools/MqttClient.vue":["77ed","3e5606ca","792f72dc"],"./viewer/Calcs":["c5ce","3e5606ca","b7fa7940","4e65cf83","12ea4ec8"],"./viewer/Calcs.vue":["c5ce","3e5606ca","b7fa7940","4e65cf83","12ea4ec8"],"./viewer/Cdns":["d1d0","3e5606ca","b7fa7940","4e65cf83","e118a4c6"],"./viewer/Cdns.vue":["d1d0","3e5606ca","b7fa7940","4e65cf83","e118a4c6"],"./viewer/Channels":["2985","3e5606ca","b7fa7940","4e65cf83","6e495059"],"./viewer/Channels.vue":["2985","3e5606ca","b7fa7940","4e65cf83","6e495059"],"./viewer/Containers":["aaff","3e5606ca","b7fa7940","4e65cf83","de349256"],"./viewer/Containers.vue":["aaff","3e5606ca","b7fa7940","4e65cf83","de349256"],"./viewer/Devices":["c4c9","3e5606ca","b7fa7940","4e65cf83","2d0de305","3ad7bba5"],"./viewer/Devices.vue":["c4c9","3e5606ca","b7fa7940","4e65cf83","2d0de305","3ad7bba5"],"./viewer/Intervals":["33b4","3e5606ca","b7fa7940","2d0de305","53bafc90"],"./viewer/Intervals.vue":["33b4","3e5606ca","b7fa7940","2d0de305","53bafc90"],"./viewer/Modems":["3a96","3e5606ca","b7fa7940","4e65cf83","68fef877"],"./viewer/Modems.vue":["3a96","3e5606ca","b7fa7940","4e65cf83","68fef877"],"./viewer/Mqtt":["7d52","3e5606ca","b7fa7940","4e65cf83","473c3de4"],"./viewer/Mqtt.vue":["7d52","3e5606ca","b7fa7940","4e65cf83","473c3de4"],"./viewer/Platform":["c34e","3e5606ca","b7fa7940","4e65cf83","6139efb2"],"./viewer/Platform.vue":["c34e","3e5606ca","b7fa7940","4e65cf83","6139efb2"],"./viewer/Streams":["8116","3e5606ca","b7fa7940","4e65cf83","ed632dd2"],"./viewer/Streams.vue":["8116","3e5606ca","b7fa7940","4e65cf83","ed632dd2"]};function i(e){var t=o[e];return t?Promise.all(t.slice(1).map(n.e)).then(function(){var e=t[0];return n(e)}):Promise.resolve().then(function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t})}i.keys=function(){return Object.keys(o)},i.id="a383",e.exports=i},f32d:function(e,t,n){var o={"./viewer/Intervals":["33b4","3e5606ca","b7fa7940","2d0de305","53bafc90"]};function i(e){var t=o[e];return t?Promise.all(t.slice(1).map(n.e)).then(function(){var e=t[0];return n(e)}):Promise.resolve().then(function(){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t})}i.keys=function(){return Object.keys(o)},i.id="f32d",e.exports=i}},[[0,"runtime","vendor"]]]);