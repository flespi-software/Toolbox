(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{"4d85":function(t,e,i){"use strict";var s=i("8101"),n=i.n(s);n.a},8101:function(t,e,i){},9285:function(t,e,i){},b831:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("q-layout",{ref:"layout",staticClass:"bg-grey-9",attrs:{view:"hHh LpR lFf"}},[t.isVisibleToolbar?i("q-header",[i("q-toolbar",{staticClass:"header__main-toolbar bg-grey-9"},[t.dashMode?t._e():i("q-btn",{attrs:{flat:"",round:"",icon:"mdi-menu"},on:{click:t.toggleMenu}}),i("q-toolbar-title",{style:{minWidth:t.$q.platform.is.mobile?"60px":"210px"}},[i("img",{staticClass:"gt-sm cursor-pointer",staticStyle:{height:"30px"},attrs:{src:"statics/toolbox50.png",alt:"Toolbox"},on:{click:t.goToMain}}),i("img",{staticClass:"lt-md cursor-pointer",staticStyle:{height:"30px"},attrs:{src:"statics/toolbox_mobile.png",alt:"Toolbox"},on:{click:t.goToMain}}),i("sup",{staticClass:"version"},[t._v(t._s(t.version)+"("+t._s(t.localeName)+")")]),t.configByEntity?i("span",{staticStyle:{position:"relative",top:"-5px","margin-left":"10px"}},[t._v(t._s(t.configByEntity.label))]):t._e()]),t.errors.length?i("q-btn",{attrs:{small:"",flat:"",round:"",icon:"notifications"},on:{click:t.clearNotificationCounter}},[t.newNotificationCounter?i("q-chip",{staticClass:"absolute-top-right q-ma-none text-white",attrs:{color:"red",size:"xs"}},[t._v(t._s(t.newNotificationCounter))]):t._e(),i("q-menu",{ref:"popoverError",attrs:{fit:""}},[i("q-list",{staticClass:"scroll q-py-none",staticStyle:{"max-height":"200px"},attrs:{separator:""}},t._l(t.errors,(function(e,s){return i("q-item",{key:s,staticStyle:{cursor:"default"}},[i("q-item-section",[i("q-item-label",{attrs:{header:""}},[t._v(t._s(e))])],1)],1)})),1)],1)],1):t._e(),t.dashMode?t._e():i("q-btn",{attrs:{small:"",flat:"",round:"",icon:"mdi-settings"},on:{click:t.settingsHandler}},[i("settings",{ref:"settings",attrs:{limit:t.limit},on:{input:t.saveSettings,clear:t.clearSettings}})],1),i("q-btn",{staticClass:"within-iframe-hide",attrs:{small:"",flat:"",round:"",icon:"mdi-exit-to-app"},on:{click:t.confirmExitHandler}})],1)],1):t._e(),t.isVisibleToolbar&&!t.dashMode?i("q-drawer",{attrs:{side:"left","content-class":{"bg-grey-7":!0}},model:{value:t.sides.left,callback:function(e){t.$set(t.sides,"left",e)},expression:"sides.left"}},[i("left-menu",{attrs:{config:t.config,entities:t.renderEntities,entity:t.entity}})],1):t._e(),i("q-page-container",{staticClass:"bg-grey-9"},[t.configByEntity&&t.isInit?i("router-view",{ref:"main",attrs:{limit:t.limit,isLoading:t.loadingFlag,isVisibleToolbar:t.isVisibleToolbar,isNeedSelect:t.isNeedSelect,config:t.configByEntity,settings:t.settings},on:{"update:settings":t.updateSettingsHandler,inited:function(e){t.entityInited=!0},uninited:function(e){t.entityInited=!1}}}):t._e(),t.entity?t._e():i("dash",{attrs:{config:t.config,entities:t.renderEntities}})],1)],1),i("q-inner-loading",{staticStyle:{"z-index":"2001"},attrs:{showing:t.loadingFlag,dark:""}},[i("q-spinner-gears",{attrs:{size:"100px",color:"white"}})],1)],1)},n=[],o=(i("8e6e"),i("8a81"),i("ac6a"),i("cadf"),i("06db"),i("456d"),i("28a5"),i("6762"),i("2fdb"),i("7f7f"),i("c47a")),c=i.n(o),a=i("2b0e"),r=i("2f62"),l=i("9224"),u=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-list",{staticClass:"q-py-none",attrs:{separator:""}},[t.entities.includes("platform")?i("q-item",{attrs:{to:"/platform","active-class":"bg-grey-6 text-white"}},[i("q-item-section",{attrs:{avatar:""}},[i("q-icon",{attrs:{name:t.config.platform.icon,color:"red"}})],1),i("q-item-section",{staticClass:"text-white"},[t._v("\n      "+t._s(t.config.platform.label)+"\n    ")])],1):t._e(),t.entities.includes("channels")||t.entities.includes("devices")||t.entities.includes("streams")||t.entities.includes("modems")?i("q-expansion-item",{attrs:{group:"menu",label:"Telematics Hub",icon:"mdi-sitemap",value:t.hubGroupModel,dark:""}},[i("div",[i("q-list",{staticClass:"row q-py-none"},[t.entities.includes("channels")?i("q-item",{staticClass:"col-6",attrs:{to:"/channels","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.channels.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.channels.label))])])],1):t._e(),t.entities.includes("devices")?i("q-item",{staticClass:"col-6",attrs:{to:"/devices","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.devices.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.devices.label))])])],1):t._e(),t.entities.includes("streams")?i("q-item",{staticClass:"col-6",attrs:{to:"/streams","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.streams.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.streams.label))])])],1):t._e(),t.entities.includes("modems")?i("q-item",{staticClass:"col-6",attrs:{to:"/modems","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.modems.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.modems.label))])])],1):t._e(),t.entities.includes("channels")||t.entities.includes("devices")||t.entities.includes("streams")||t.entities.includes("modems")?i("q-separator",{staticStyle:{width:"100%"}}):t._e(),t.entities.includes("calcs")?i("q-item",{staticClass:"col-6",attrs:{to:"/calcs","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.calcs.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.calcs.label))])])],1):t._e(),t.entities.includes("plugins")?i("q-item",{staticClass:"col-6",attrs:{to:"/plugins","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.plugins.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.plugins.label))])])],1):t._e(),t.entities.includes("intervals")||t.entities.includes("calcs")||t.entities.includes("plugins")?i("q-separator",{staticStyle:{width:"100%"}}):t._e(),t.entities.includes("hexViewer")||t.entities.includes("trafficViewer")?i("q-item-label",{staticClass:"col-12 text-white",attrs:{header:""}},[t._v("Tools")]):t._e(),t.entities.includes("hexViewer")?i("q-item",{staticClass:"col-6",attrs:{to:"/tools/hex","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.hexViewer.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.hexViewer.label))])])],1):t._e(),t.entities.includes("trafficViewer")?i("q-item",{staticClass:"col-6",attrs:{to:"/tools/traffic","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.trafficViewer.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.trafficViewer.label))])])],1):t._e()],1)],1)]):t._e(),t.entities.includes("containers")||t.entities.includes("cdns")?i("q-expansion-item",{attrs:{group:"menu",label:"Storage",icon:"mdi-database",value:t.storageGroupModel,dark:""}},[i("div",[i("q-list",{staticClass:"row q-py-none"},[t.entities.includes("containers")?i("q-item",{staticClass:"col-6",attrs:{to:"/containers","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.containers.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.containers.label))])])],1):t._e(),t.entities.includes("cdns")?i("q-item",{staticClass:"col-6",attrs:{to:"/cdns","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.cdns.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.cdns.label))])])],1):t._e()],1)],1)]):t._e(),t.entities.includes("mqtt")||t.entities.includes("mqttClient")?i("q-expansion-item",{attrs:{group:"menu",label:"MQTT",icon:"mdi-access-point-network",value:t.mqttGroupModel,dark:""}},[i("div",[i("q-list",{staticClass:"row q-py-none"},[t.entities.includes("mqtt")?i("q-item",{staticClass:"col-6",attrs:{to:"/mqtt","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.mqtt.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.mqtt.label))])])],1):t._e(),t.entities.includes("mqtt")?i("q-separator",{staticStyle:{width:"100%"}}):t._e(),i("q-item-label",{staticClass:"col-12 text-white",attrs:{header:""}},[t._v("Tools")]),i("q-item",{staticClass:"col-6",attrs:{to:"/tools/mqtt","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.mqttClient.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.mqttClient.label))])])],1)],1)],1)]):t._e()],1)},d=[],m={props:["config","entities","entity"],computed:{hubGroupModel:function(){var t=this.entity;return"channels"===t||"calcs"===t||"intervals"===t||"plugins"===t||"devices"===t||"streams"===t||"modems"===t||"hexViewer"===t||"trafficViewer"===t||"intervals"===t},storageGroupModel:function(){var t=this.entity;return"containers"===t||"cdns"===t},mqttGroupModel:function(){var t=this.entity;return"mqtt"===t||"mqttClient"===t}}},f=m,h=i("2877"),g=Object(h["a"])(f,u,d,!1,null,null,null),p=g.exports,b=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-page",{staticClass:"dash",attrs:{padding:""}},[i("q-list",{staticClass:"row absolute-top-left absolute-bottom-right"},t._l(t.renderEntities,(function(e,s){return i("q-item",{key:s,staticClass:"dash__element col-1 col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-12 bg-grey-8",class:{"dash__element--mobile":t.$q.platform.is.mobile},attrs:{to:e.route,"active-class":"bg-grey-9"}},[i("q-item-section",{staticClass:"text-center text-white full-width q-ma-lg"},[i("div",[i("q-icon",{attrs:{name:e.icon,color:e.color,size:"7em"}})],1),i("div",{staticClass:"text-h5 ellipsis full-width"},[t._v(t._s(e.label))])])],1)})),1)],1)},v=[],q={props:["config","entities"],data:function(){return{routes:{platform:"/platform",channels:"/channels",devices:"/devices",streams:"/streams",modems:"/modems",calcs:"/calcs",plugins:"/plugins",hexViewer:"/tools/hex",trafficViewer:"/tools/traffic",containers:"/containers",cdns:"/cdns",mqtt:"/mqtt",mqttClient:"/tools/mqtt"}}},computed:{renderEntities:function(){var t=this;return this.entities.filter((function(e){return t.routes[e]})).map((function(e){return{route:t.routes[e],label:t.config[e].label,icon:t.config[e].icon,color:"platform"===e?"red-6":void 0}}))}}},y=q,x=(i("4d85"),Object(h["a"])(y,b,v,!1,null,null,null)),w=x.exports,_=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-dialog",{attrs:{persistent:""},model:{value:t.opened,callback:function(e){t.opened=e},expression:"opened"}},[i("q-card",{staticClass:"bg-grey-9 text-white",staticStyle:{"min-width":"350px"}},[i("q-card-section",[i("div",{staticClass:"text-h6"},[t._v("Settings")])]),i("q-card-section",{staticClass:"q-pt-none"},[i("q-input",{attrs:{dense:"",outlined:"",label:"Page row count",dark:"",color:"white",type:"number",autofocus:""},model:{value:t.dataLimit,callback:function(e){t.dataLimit=t._n(e)},expression:"dataLimit"}})],1),i("q-card-section",{staticClass:"q-pt-none row justify-center"},[t.clearSure?i("q-btn",{attrs:{flat:"",label:"Are you sure?",color:"yellow-7"},on:{click:t.clear}}):i("q-btn",{attrs:{flat:"",label:"Set Toolbox to default",color:"red-7"},on:{click:function(e){t.clearSure=!0}}})],1),i("q-card-actions",{attrs:{align:"right"}},[i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Cancel"}}),i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Save"}})],1)],1)],1)},C=[],S={props:["limit"],data:function(){return{opened:!1,dataLimit:this.limit,clearSure:!1}},methods:{show:function(){this.opened=!0},hide:function(){this.opened=!1},save:function(){this.$emit("input",{limit:+this.dataLimit})},clear:function(){this.$emit("clear"),this.clearSure=!1,this.hide()}}},k=S,T=Object(h["a"])(k,_,C,!1,null,null,null),E=T.exports;function V(t,e){var i=Object.keys(t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(t);e&&(s=s.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),i.push.apply(i,s)}return i}function $(t){for(var e=1;e<arguments.length;e++){var i=null!=arguments[e]?arguments[e]:{};e%2?V(Object(i),!0).forEach((function(e){c()(t,e,i[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(i)):V(Object(i)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(i,e))}))}return t}var N={data:function(){return{version:l.version,sides:{left:!this.$q.platform.within.iframe&&!this.$q.platform.is.mobile,right:!1},currentLimit:1e3,rawConfig:{},entity:"",isVisibleToolbar:!0,toolboxMode:void 0,connectFlag:!1,isTabsVisible:!0,entityByGroup:["platform","channels","devices","streams","calcs","intervals","plugins","hexViewer","trafficViewer","modems","containers","cdns","mqtt","mqttClient"],isNeedSelect:!0,entityInited:!1,isInit:a["default"].connector.socket.connected()}},computed:$($({},Object(r["d"])({token:function(t){return t.token},isLoading:function(t){return t.isLoading&&!this.entityInited},config:function(t){return t.config},errors:function(t){return t.errors},newNotificationCounter:function(t){return t.newNotificationCounter},settings:function(t){return t.settings},localeName:function(t){return t.sessionSettings&&t.sessionSettings.region&&t.sessionSettings.region.name},sessionSettings:function(t){return t.sessionSettings}})),{},{loadingFlag:function(){return this.connectFlag||this.isLoading},configByEntity:function(){return this.config[this.entity]},renderEntities:function(){var t=this;return this.entityByGroup.filter((function(e){return t.config[e].isDrawable}))},limit:{get:function(){return this.currentLimit},set:function(t){var e=this;t<100?(this.$q.notify({type:"negative",message:"Please set the count to more than 100.",timeout:1500}),this.currentLimit=100):t>2e3&&this.currentLimit<=2e3?this.$q.notify({color:"amber-9",icon:"warning",timeout:1e4,message:"You are setting the row count to more than 2000. This can affect your browser performance. Do you want to continue?",position:"top-right",actions:[{label:"Agree",handler:function(){e.currentLimit=t}},{label:"Abort",handler:this.settingsClickHandler}]}):this.currentLimit=t}},dashMode:function(){return!this.entity}}),methods:$($($({},Object(r["c"])(["setCid","clearToken","reqFailed","addError","clearNotificationCounter","clearToolboxSettings","setToolboxSessionSettings"])),Object(r["b"])(["initConnection"])),{},{toggleMenu:function(){this.sides.left=!this.sides.left},confirmExitHandler:function(){var t=this;this.$q.dialog({title:"Confirm",message:"Do you really want to exit?",color:"grey-9",cancel:!0,ok:!0}).onOk((function(){t.reset()})).onCancel((function(){}))},settingsHandler:function(){this.$refs.settings.show()},saveSettings:function(t){var e=t.limit;this.limit=e},clearSettings:function(){this.limit=1e3,this.clearToolboxSettings(),document.location.reload(!0)},getGroups:function(t){return t.reduce((function(t,e){if(["platform","hub","storage","mqtt"].includes(e))switch(e){case"hub":t.push("channels"),t.push("devices"),t.push("streams"),t.push("intervals"),t.push("calcs"),t.push("plugins"),t.push("modems"),t.push("hexViewer"),t.push("trafficViewer");break;case"storage":t.push("containers"),t.push("cdns");break;case"mqtt":t.push("mqtt"),t.push("mqttClient");break;case"platform":t.push("platform");break}return t}),[])},reset:function(t){this.clearToken(),this.setToolboxSessionSettings({region:void 0}),this.$router.push("/login").catch((function(t){return t})),t&&this.addError(t)},setEntity:function(t){this.entity!==t&&(this.entityInited=!1,this.entity=t)},setDefaultEntity:function(){this.renderEntities.length?(this.$router.push("/").catch((function(t){return t})),this.setEntity(""),this.entityInited=!0):this.reset("Nothing to show by current token")},routeProcess:function(t){var e=this,i=a["default"].connector.socket.on("connect",(function(){if(t.query.group){var s=t.query.group.split(","),n=e.getGroups(s);n.length&&(e.entityByGroup=n,e.setDefaultEntity())}var o=t.meta.moduleName;o&&(e.renderEntities.includes(o)?e.setEntity(o):e.reset("Nothing to show by current token")),a["default"].connector.socket.off("connect",i)}));t.query.token?this.initConnection({token:t.query.token}):this.token?this.routeMainProcess(t):(a["default"].connector.socket.off("connect",i),this.$router.push({name:"simpleLogin",params:{goto:t}}).catch((function(t){return t})))},routeParamsProcess:function(t){var e=t.query.noselect;this.isNeedSelect=!0,e&&(this.isNeedSelect="all"!==e&&e),this.isVisibleToolbar=!t.query.fullscreen,this.toolboxMode=!t.query.mode},routeMainProcess:function(t){"/"===t.path?this.setDefaultEntity():this.$route.meta.moduleName&&this.setEntity(this.$route.meta.moduleName)},connectionPreserveHandler:function(){this.isInit=!0,this.connectFlag=!1},updateSettingsHandler:function(t){this.$store.commit("setToolboxSettings",t)},goToMain:function(){this.$router.push("/").catch((function(t){return t}))}}),watch:{token:function(t){t||this.$router.push("/login").catch((function(t){return t}))},$route:function(t){this.routeProcess(t)}},beforeCreate:function(){this.$store.commit("getToolboxSettings")},created:function(){this.routeParamsProcess(this.$route),this.routeProcess(this.$route);var t=this.sessionSettings||{};void 0!==t.isNeedSelect&&(this.isNeedSelect=t.isNeedSelect),void 0!==t.isVisibleToolbar&&(this.isVisibleToolbar=t.isVisibleToolbar),void 0!==t.mode&&(this.toolboxMode=t.mode),this.isInit||(this.connectFlag=!0,this.connectionPreserveHandlerIndex=a["default"].connector.socket.on("connect",this.connectionPreserveHandler)),this.setToolboxSessionSettings({isNeedSelect:this.isNeedSelect,isVisibleToolbar:this.isVisibleToolbar,mode:this.toolboxMode})},beforeDestroy:function(){void 0!==this.connectionPreserveHandlerIndex&&a["default"].connector.socket.off("connect",this.connectionPreserveHandlerIndex)},components:{LeftMenu:p,Settings:E,Dash:w}},O=N,P=(i("fc11"),Object(h["a"])(O,s,n,!1,null,null,null));e["default"]=P.exports},fc11:function(t,e,i){"use strict";var s=i("9285"),n=i.n(s);n.a}}]);