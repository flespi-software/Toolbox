(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[2],{"013f":function(t,e,o){"use strict";o.r(e);var i=function(){var t=this,e=t._self._c;return e("div",{staticClass:"login-page window-height window-width bg-light column items-center no-wrap"},[t.$q.platform.is.mobile&&t.$q.platform.within.iframe?t._e():e("a",{attrs:{href:"https://github.com/flespi-software/Toolbox/",target:"_blank"}},[e("img",{staticClass:"absolute-top-right",staticStyle:{border:"0",width:"149px",height:"149px"},attrs:{src:"right-graphite@2x.png",alt:"Fork me on GitHub"}})]),e("div",{staticClass:"login-back flex items-center justify-center"},[e("div",{staticClass:"login-code flex justify-center"},[e("img",{staticStyle:{"max-width":"80vw"},style:{maxHeight:t.$q.platform.is.mobile?"80px":"18vw"},attrs:{src:"toolbox.png",alt:"Toolbox"}}),t.$route.params.token?e("div",[e("div",{staticClass:"login-card shadow-4 bg-white column items-center justify-center no-wrap"},[e("q-circular-progress",{staticStyle:{width:"100%",height:"45px"},attrs:{indeterminate:"",color:"green-6"}})],1)]):e("div",[!t.canLogin||t.$q.platform.within.iframe?e("div",{staticClass:"login-card shadow-4 bg-white column items-center justify-center no-wrap"},[e("div",{staticClass:"row full-width"},[e("div",{staticClass:"col-12 text-center text-red text-bold"},[e("big",[t._v("Token has been expired or revoked")])],1)])]):e("div",{staticClass:"login-card shadow-4 bg-white column items-center justify-center no-wrap"},[e("p",{staticClass:"text-center text-grey-9"},[t._v("Swiss knife to view and analyze flespi data")]),e("div",{staticClass:"row full-width"},[e("div",{staticClass:"col-12 text-center"},[e("q-btn",{attrs:{icon:"mdi-account-circle",color:"red-7",rounded:"",label:"login / register",size:t.$q.platform.is.mobile?"md":"lg"},on:{click:function(e){return t.openWindow(`${t.$authHost}/login/#/providers`)}}})],1)])])])])])])},n=[],s=(o("14d9"),o("2b0e")),r=o("2f62"),a={data(){return{token:"",icons:{facebook:"mdi-facebook-box",google:"mdi-google-plus-box",live:"mdi-windows",github:"mdi-github-box",email:"mdi-at"},canLogin:!0}},computed:{...Object(r["d"])({sessionSettings:t=>t.sessionSettings}),model:{get(){return this.token},set(t){this.token=t}},tokenInfo(){return this.$store.state.tokenInfo}},methods:{...Object(r["b"])(["initConnection"]),...Object(r["c"])(["setRegions","setToken","setToolboxSessionSettings"]),goto(t){if(this.tokenInfo)this.$router.push(t).catch((t=>t));else{let e=!1,o=!1;const i=()=>{this.$router.push(t).catch((t=>t)),e&&s["default"].connector.socket.off("connect",e),o&&s["default"].connector.socket.off("error",o)};e=s["default"].connector.socket.on("connect",i),o=s["default"].connector.socket.on("error",i)}},logIn(t){this.initConnection({token:this.token,region:t}).then((()=>{this.$nextTick((()=>{this.$route.params&&this.$route.params.goto?this.goto(this.$route.params.goto):this.goto("/")}))}))},autoLogin(){this.initConnection({token:this.$route.params.token}).then((()=>{this.goto("/")}))},checkHasToken(){const t=this.sessionSettings||{},e=t.token,o=t.region;this.$route.params&&this.$route.params.token?this.autoLogin():e&&(this.token=e,this.logIn(o))},openWindow(t,e="auth"){const o=500,i=600,n=void 0!==window.screenLeft?window.screenLeft:screen.left,s=void 0!==window.screenTop?window.screenTop:screen.top,r=window.innerWidth?window.innerWidth:document.documentElement.clientWidth?document.documentElement.clientWidth:screen.width,a=window.innerHeight?window.innerHeight:document.documentElement.clientHeight?document.documentElement.clientHeight:screen.height,c=r/2-o/2+n,l=a/2-i/2+s,d=window.open(t,e,"toolbar=no,location=no,status=yes,resizable=yes,scrollbars=yes, width="+o+", height="+i+", top="+l+", left="+c);window.focus&&d.focus()},regionInitFromAuth(t){this.setRegions({[t.name]:t}),this.setToolboxSessionSettings({region:t}),this.$connector.setRegion(t)}},watch:{$route(t){t.params&&t.params.token&&this.autoLogin()}},created(){this.sessionSettings&&this.sessionSettings.isVisibleToolbar&&(this.canLogin=this.sessionSettings.isVisibleToolbar);const t=e=>{if("string"===typeof e.data&&~e.data.indexOf("FlespiLogin|token:")){window.removeEventListener("message",t);let o=e.data;o=o.replace("FlespiLogin|token:",""),o=JSON.parse(o),this.token=o.token,this.logIn(o.region)}};window.addEventListener("message",t),this.checkHasToken()}},c=a,l=(o("e845"),o("2877")),d=o("9c40"),h=o("58ea"),g=o("eebe"),u=o.n(g),w=Object(l["a"])(c,i,n,!1,null,null,null);e["default"]=w.exports;u()(w,"components",{QBtn:d["a"],QCircularProgress:h["a"]})},"410d":function(t,e,o){},e845:function(t,e,o){"use strict";o("410d")}}]);