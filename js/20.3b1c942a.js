(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[20],{"4d85":function(t,e,i){"use strict";i("a371")},a371:function(t,e,i){},b831:function(t,e,i){"use strict";i.r(e);var s=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("q-layout",{ref:"layout",staticClass:"bg-grey-9",attrs:{view:"hHh LpR lFf"}},[t.isVisibleToolbar?i("q-header",[i("q-toolbar",{staticClass:"header__main-toolbar bg-grey-9"},[t.dashMode?t._e():i("q-btn",{attrs:{flat:"",round:"",icon:"mdi-menu"},on:{click:t.toggleMenu}}),i("q-toolbar-title",{style:{minWidth:t.$q.platform.is.mobile?"60px":"210px"}},[i("img",{staticClass:"gt-sm cursor-pointer",staticStyle:{height:"30px"},attrs:{src:"toolbox50.png",alt:"Toolbox"},on:{click:t.goToMain}}),i("img",{staticClass:"lt-md cursor-pointer",staticStyle:{height:"30px"},attrs:{src:"toolbox_mobile.png",alt:"Toolbox"},on:{click:t.goToMain}}),i("sup",{staticClass:"version"},[t._v(t._s(t.version)+"("+t._s(t.localeName)+")")]),t.configByEntity?i("span",{staticStyle:{position:"relative",top:"-5px","margin-left":"10px"}},[t._v(t._s(t.configByEntity.label))]):t._e()]),t.errors.length?i("q-btn",{attrs:{small:"",flat:"",round:"",icon:"notifications"},on:{click:t.clearNotificationCounter}},[t.newNotificationCounter?i("q-chip",{staticClass:"absolute-top-right q-ma-none text-white",attrs:{color:"red",size:"xs"}},[t._v(t._s(t.newNotificationCounter))]):t._e(),i("q-menu",{ref:"popoverError",attrs:{fit:"","no-route-dismiss":""}},[i("q-list",{staticClass:"scroll q-py-none",staticStyle:{"max-height":"200px"},attrs:{separator:""}},t._l(t.errors,(function(e,s){return i("q-item",{key:s,staticStyle:{cursor:"default"}},[i("q-item-section",[i("q-item-label",{attrs:{header:""}},[t._v(t._s(e))])],1)],1)})),1)],1)],1):t._e(),t.dashMode?t._e():i("q-btn",{attrs:{small:"",flat:"",round:"",icon:"mdi-cog"},on:{click:t.settingsHandler}},[i("settings",{ref:"settings",attrs:{limit:t.limit},on:{input:t.saveSettings,clear:t.clearSettings}})],1),i("q-btn",{staticClass:"within-iframe-hide",attrs:{small:"",flat:"",round:"",icon:"mdi-exit-to-app"},on:{click:t.confirmExitHandler}})],1)],1):t._e(),t.isVisibleToolbar&&!t.dashMode?i("q-drawer",{attrs:{side:"left","content-class":{"bg-grey-7":!0}},model:{value:t.sides.left,callback:function(e){t.$set(t.sides,"left",e)},expression:"sides.left"}},[i("left-menu",{attrs:{config:t.config,entities:t.renderEntities,entity:t.entity}})],1):t._e(),i("q-page-container",{staticClass:"bg-grey-9"},[t.configByEntity&&t.isInit?i("router-view",{ref:"main",attrs:{limit:t.limit,isLoading:t.loadingFlag,isVisibleToolbar:t.isVisibleToolbar,isNeedSelect:t.isNeedSelect,config:t.configByEntity,settings:t.settings},on:{"update:settings":t.updateSettingsHandler,inited:function(e){t.entityInited=!0},uninited:function(e){t.entityInited=!1}}}):t._e(),t.entity?t._e():i("dash",{attrs:{config:t.config,entities:t.renderEntities}})],1)],1),i("q-inner-loading",{staticStyle:{"z-index":"2001"},attrs:{showing:t.loadingFlag,dark:""}},[i("q-spinner-gears",{attrs:{size:"100px",color:"white"}})],1)],1)},n=[],o=i("2b0e"),a=i("2f62"),c=i("9224"),r=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-list",{staticClass:"q-py-none",attrs:{separator:""}},[t.entities.includes("platform")?i("q-item",{attrs:{to:"/platform","active-class":"bg-grey-6 text-white"}},[i("q-item-section",{attrs:{avatar:""}},[i("q-icon",{attrs:{name:t.config.platform.icon,color:"red"}})],1),i("q-item-section",{staticClass:"text-white"},[t._v("\n      "+t._s(t.config.platform.label)+"\n    ")])],1):t._e(),t.entities.includes("channels")||t.entities.includes("devices")||t.entities.includes("streams")||t.entities.includes("modems")?i("q-expansion-item",{attrs:{group:"menu",label:"Telematics Hub",icon:"mdi-sitemap",value:t.hubGroupModel,dark:""}},[i("div",[i("q-list",{staticClass:"row q-py-none"},[t.entities.includes("channels")?i("q-item",{staticClass:"col-6",attrs:{to:"/channels","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.channels.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.channels.label))])])],1):t._e(),t.entities.includes("devices")?i("q-item",{staticClass:"col-6",attrs:{to:"/devices","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.devices.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.devices.label))])])],1):t._e(),t.entities.includes("streams")?i("q-item",{staticClass:"col-6",attrs:{to:"/streams","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.streams.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.streams.label))])])],1):t._e(),t.entities.includes("modems")?i("q-item",{staticClass:"col-6",attrs:{to:"/modems","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.modems.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.modems.label))])])],1):t._e(),t.entities.includes("channels")||t.entities.includes("devices")||t.entities.includes("streams")||t.entities.includes("modems")?i("q-separator",{staticStyle:{width:"100%"}}):t._e(),t.entities.includes("calcs")?i("q-item",{staticClass:"col-6",attrs:{to:"/calcs","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.calcs.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.calcs.label))])])],1):t._e(),t.entities.includes("plugins")?i("q-item",{staticClass:"col-6",attrs:{to:"/plugins","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.plugins.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.plugins.label))])])],1):t._e()],1)],1)]):t._e(),t.entities.includes("containers")||t.entities.includes("cdns")?i("q-expansion-item",{attrs:{group:"menu",label:"Storage",icon:"mdi-database",value:t.storageGroupModel,dark:""}},[i("div",[i("q-list",{staticClass:"row q-py-none"},[t.entities.includes("containers")?i("q-item",{staticClass:"col-6",attrs:{to:"/containers","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.containers.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.containers.label))])])],1):t._e(),t.entities.includes("cdns")?i("q-item",{staticClass:"col-6",attrs:{to:"/cdns","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.cdns.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.cdns.label))])])],1):t._e()],1)],1)]):t._e(),t.entities.includes("mqtt")||t.entities.includes("mqttClient")?i("q-expansion-item",{attrs:{group:"menu",label:"MQTT",icon:"mdi-access-point-network",value:t.mqttGroupModel,dark:""}},[i("div",[i("q-list",{staticClass:"row q-py-none"},[t.entities.includes("mqtt")?i("q-item",{staticClass:"col-6",attrs:{to:"/mqtt","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.mqtt.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.mqtt.label))])])],1):t._e(),t.entities.includes("mqtt")?i("q-separator",{staticStyle:{width:"100%"}}):t._e(),i("q-item-label",{staticClass:"col-12 text-white",attrs:{header:""}},[t._v("Tools")]),i("q-item",{staticClass:"col-6",attrs:{to:"/tools/mqtt","active-class":"bg-grey-6"}},[i("q-item-section",{staticClass:"text-center text-white"},[i("div",[i("q-icon",{attrs:{name:t.config.mqttClient.icon,size:"2.6em"}})],1),i("div",[t._v(t._s(t.config.mqttClient.label))])])],1)],1)],1)]):t._e()],1)},l=[],d={props:["config","entities","entity"],computed:{hubGroupModel(){const t=this.entity;return"channels"===t||"calcs"===t||"intervals"===t||"plugins"===t||"devices"===t||"streams"===t||"modems"===t||"hexViewer"===t||"trafficViewer"===t||"intervals"===t},storageGroupModel(){const t=this.entity;return"containers"===t||"cdns"===t},mqttGroupModel(){const t=this.entity;return"mqtt"===t||"mqttClient"===t}}},m=d,u=i("2877"),h=i("1c1c"),g=i("66e5"),p=i("4074"),f=i("0016"),b=i("3b73"),q=i("eb85"),v=i("0170"),y=i("eebe"),x=i.n(y),_=Object(u["a"])(m,r,l,!1,null,null,null),C=_.exports;x()(_,"components",{QList:h["a"],QItem:g["a"],QItemSection:p["a"],QIcon:f["a"],QExpansionItem:b["a"],QSeparator:q["a"],QItemLabel:v["a"]});var w=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-page",{staticClass:"dash",attrs:{padding:""}},[i("q-list",{staticClass:"row absolute-top-left absolute-bottom-right"},t._l(t.renderEntities,(function(e,s){return i("q-item",{key:s,staticClass:"dash__element col-1 col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-12 bg-grey-8",class:{"dash__element--mobile":t.$q.platform.is.mobile},attrs:{to:e.route,"active-class":"bg-grey-9"}},[i("q-item-section",{staticClass:"text-center text-white full-width q-ma-lg"},[i("div",[i("q-icon",{attrs:{name:e.icon,color:e.color,size:"7em"}})],1),i("div",{staticClass:"text-h5 ellipsis full-width"},[t._v(t._s(e.label))])])],1)})),1)],1)},S=[],k={props:["config","entities"],data(){return{routes:{platform:"/platform",channels:"/channels",devices:"/devices",streams:"/streams",modems:"/modems",calcs:"/calcs",plugins:"/plugins",containers:"/containers",cdns:"/cdns",mqtt:"/mqtt",mqttClient:"/tools/mqtt"}}},computed:{renderEntities(){return this.entities.filter((t=>this.routes[t])).map((t=>({route:this.routes[t],label:this.config[t].label,icon:this.config[t].icon,color:"platform"===t?"red-6":void 0})))}}},T=k,Q=(i("4d85"),i("9989")),E=Object(u["a"])(T,w,S,!1,null,null,null),$=E.exports;x()(E,"components",{QPage:Q["a"],QList:h["a"],QItem:g["a"],QItemSection:p["a"],QIcon:f["a"]});var I=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("q-dialog",{attrs:{persistent:"","no-route-dismiss":""},model:{value:t.opened,callback:function(e){t.opened=e},expression:"opened"}},[i("q-card",{staticClass:"bg-grey-9 text-white",staticStyle:{"min-width":"350px"}},[i("q-card-section",[i("div",{staticClass:"text-h6"},[t._v("Settings")])]),i("q-card-section",{staticClass:"q-pt-none"},[i("q-input",{attrs:{dense:"",outlined:"",label:"Page row count",dark:"",color:"white",type:"number",autofocus:""},model:{value:t.dataLimit,callback:function(e){t.dataLimit=t._n(e)},expression:"dataLimit"}})],1),i("q-card-section",{staticClass:"q-pt-none row justify-center"},[t.clearSure?i("q-btn",{attrs:{flat:"",label:"Are you sure?",color:"yellow-7"},on:{click:t.clear}}):i("q-btn",{attrs:{flat:"",label:"Set Toolbox to default",color:"red-7"},on:{click:function(e){t.clearSure=!0}}})],1),i("q-card-actions",{attrs:{align:"right"}},[i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Cancel"}}),i("q-btn",{directives:[{name:"close-popup",rawName:"v-close-popup"}],attrs:{flat:"",label:"Save"}})],1)],1)],1)},L=[],N={props:["limit"],data(){return{opened:!1,dataLimit:this.limit,clearSure:!1}},methods:{show(){this.opened=!0},hide(){this.opened=!1},save(){this.$emit("input",{limit:+this.dataLimit})},clear(){this.$emit("clear"),this.clearSure=!1,this.hide()}}},M=N,P=i("24e8"),V=i("f09f"),H=i("a370"),z=i("27f9"),G=i("9c40"),D=i("4b7e"),B=i("7f67"),F=Object(u["a"])(M,I,L,!1,null,null,null),j=F.exports;x()(F,"components",{QDialog:P["a"],QCard:V["a"],QCardSection:H["a"],QInput:z["a"],QBtn:G["a"],QCardActions:D["a"]}),x()(F,"directives",{ClosePopup:B["a"]});i("0644");var O={data(){return{version:c.version,sides:{left:!this.$q.platform.within.iframe&&!this.$q.platform.is.mobile,right:!1},currentLimit:1e3,rawConfig:{},entity:"",isVisibleToolbar:!0,toolboxMode:void 0,connectFlag:!1,isTabsVisible:!0,entityByGroup:["platform","channels","devices","streams","calcs","intervals","plugins","hexViewer","trafficViewer","deviceTraffic","modems","containers","cdns","mqtt","mqttClient"],isNeedSelect:!0,entityInited:!1,isInit:o["default"].connector.socket.connected()}},computed:{...Object(a["d"])({token:t=>t.token,isLoading(t){return t.isLoading&&!this.entityInited},config:t=>t.config,errors:t=>t.errors,newNotificationCounter:t=>t.newNotificationCounter,settings:t=>t.settings,localeName:t=>t.sessionSettings&&t.sessionSettings.region&&t.sessionSettings.region.name,sessionSettings:t=>t.sessionSettings}),loadingFlag(){return this.connectFlag||this.isLoading},configByEntity(){return this.config[this.entity]},renderEntities(){return this.entityByGroup.filter((t=>this.config[t].isDrawable))},limit:{get(){return this.currentLimit},set(t){t<100?(this.$q.notify({type:"negative",message:"Please set the count to more than 100.",timeout:1500}),this.currentLimit=100):t>2e3&&this.currentLimit<=2e3?this.$q.notify({color:"amber-9",icon:"warning",timeout:1e4,message:"You are setting the row count to more than 2000. This can affect your browser performance. Do you want to continue?",position:"top-right",actions:[{label:"Agree",handler:()=>{this.currentLimit=t}},{label:"Abort",handler:this.settingsClickHandler}]}):this.currentLimit=t}},dashMode(){return!this.entity}},methods:{...Object(a["c"])(["setCid","clearToken","reqFailed","addError","clearNotificationCounter","clearToolboxSettings","setToolboxSessionSettings"]),...Object(a["b"])(["initConnection"]),toggleMenu(){this.sides.left=!this.sides.left},confirmExitHandler(){this.$q.dialog({title:"Confirm",message:"Do you really want to exit?",color:"grey-9",cancel:!0,ok:!0,noRouteDismiss:!0}).onOk((()=>{this.reset()})).onCancel((()=>{}))},settingsHandler(){this.$refs.settings.show()},saveSettings({limit:t}){this.limit=t},clearSettings(){this.limit=1e3,this.clearToolboxSettings(),document.location.reload(!0)},getGroups(t){return t.reduce(((t,e)=>{if(["platform","hub","storage","mqtt"].includes(e))switch(e){case"hub":t.push("channels"),t.push("devices"),t.push("streams"),t.push("intervals"),t.push("calcs"),t.push("plugins"),t.push("modems"),t.push("hexViewer"),t.push("trafficViewer"),t.push("deviceTraffic");break;case"storage":t.push("containers"),t.push("cdns");break;case"mqtt":t.push("mqtt"),t.push("mqttClient");break;case"platform":t.push("platform");break}return t}),[])},reset(t){this.clearToken(),this.setToolboxSessionSettings({region:void 0}),this.$router.push("/login").catch((t=>t)),t&&this.addError(t)},setEntity(t){this.entity!==t&&(this.entityInited=!1,this.entity=t)},setDefaultEntity(){this.renderEntities.length?(this.$router.push("/").catch((t=>t)),this.setEntity(""),this.entityInited=!0):this.reset("Nothing to show by current token")},routeProcess(t){const e=o["default"].connector.socket.on("connect",(()=>{if(t.query.group){const e=t.query.group.split(","),i=this.getGroups(e);i.length&&(this.entityByGroup=i,this.setDefaultEntity())}const i=t.meta.moduleName;i&&(this.renderEntities.includes(i)?this.setEntity(i):this.reset("Nothing to show by current token")),o["default"].connector.socket.off("connect",e)}));t.query.token&&!this.token?this.initConnection({token:t.query.token}):this.token?this.routeMainProcess(t):(o["default"].connector.socket.off("connect",e),this.$router.push({name:"simpleLogin",params:{goto:t}}).catch((t=>t)))},routeParamsProcess(t){const e=t.query.noselect;this.isNeedSelect=!0,e&&(this.isNeedSelect="all"!==e&&e),this.isVisibleToolbar=!t.query.fullscreen,this.toolboxMode=!t.query.mode},routeMainProcess(t){"/"===t.path?this.setDefaultEntity():this.$route.meta.moduleName&&this.setEntity(this.$route.meta.moduleName)},connectionPreserveHandler(){this.isInit=!0,this.connectFlag=!1},updateSettingsHandler(t){this.$store.commit("setToolboxSettings",t)},goToMain(){this.$router.push("/").catch((t=>t))}},watch:{token(t){t||this.$router.push("/login").catch((t=>t))},$route(t){this.routeProcess(t)}},beforeCreate(){this.$store.commit("getToolboxSettings")},created(){this.routeParamsProcess(this.$route),this.routeProcess(this.$route);const t=this.sessionSettings||{};void 0!==t.isNeedSelect&&(this.isNeedSelect=t.isNeedSelect),void 0!==t.isVisibleToolbar&&(this.isVisibleToolbar=t.isVisibleToolbar),void 0!==t.mode&&(this.toolboxMode=t.mode),this.isInit||(this.connectFlag=!0,this.connectionPreserveHandlerIndex=o["default"].connector.socket.on("connect",this.connectionPreserveHandler)),this.setToolboxSessionSettings({isNeedSelect:this.isNeedSelect,isVisibleToolbar:this.isVisibleToolbar,mode:this.toolboxMode})},beforeDestroy(){void 0!==this.connectionPreserveHandlerIndex&&o["default"].connector.socket.off("connect",this.connectionPreserveHandlerIndex)},components:{LeftMenu:C,Settings:j,Dash:$}},A=O,J=(i("fc11"),i("4d5a")),R=i("e359"),W=i("65c6"),Y=i("6ac5"),K=i("b047"),U=i("4e73"),X=i("9404"),Z=i("09e3"),tt=i("74f7"),et=i("cf57"),it=Object(u["a"])(A,s,n,!1,null,null,null);e["default"]=it.exports;x()(it,"components",{QLayout:J["a"],QHeader:R["a"],QToolbar:W["a"],QBtn:G["a"],QToolbarTitle:Y["a"],QChip:K["a"],QMenu:U["a"],QList:h["a"],QItem:g["a"],QItemSection:p["a"],QItemLabel:v["a"],QDrawer:X["a"],QPageContainer:Z["a"],QInnerLoading:tt["a"],QSpinnerGears:et["a"]})},f6b1:function(t,e,i){},fc11:function(t,e,i){"use strict";i("f6b1")}}]);