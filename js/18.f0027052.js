(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[18],{"77ed":function(e,t,s){"use strict";s.r(t);var i=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("q-page",{staticClass:"bg-white flex flex-center full-width full-height"},[s("iframe",{ref:"iframe",staticClass:"full-width full-height absolute-top-left absolute-bottom-right",attrs:{src:e.host,frameborder:"0",name:e.name}})])},a=[],n=(s("e9c4"),s("286e")),o={name:"MQTTClient",props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config"],data(){return{name:"mqttboard",host:"https://mqttboard.flespi.io/#/integration",mqttBoardConfig:{settings:{clientId:`toolbox-mqtt-board-${Math.random().toString(16).substr(2,8)}`,host:this.$flespiSocketServer,username:`FlespiToken ${this.$store.state.token}`},whiteLabel:"MQTT Clients",useLS:!1,clientsCloseable:!1}}},mixins:[n["a"]],methods:{send(e,t){e=`MQTTBoard${this.name?`|${this.name}`:""}|${e}${t?`=>${JSON.stringify(t)}`:""}`,this.$refs.iframe.contentWindow.postMessage(e,"*")},messageProcess(e){let t="",s=null;if("string"===typeof e&&0===e.indexOf("MQTTBoard|")){let a=e.split("|");a=a[this.name?2:1].split("=>"),t=a[0];try{s=JSON.parse(a[1])}catch(i){s=a[1]}}return{cmd:t,payload:s,name:this.name}},setSettings(e){this.send("SetSettings",e)}},created(){window.addEventListener("message",(({data:e})=>{const{cmd:t,name:s}=this.messageProcess(e);s===this.name&&t&&"ready"===t&&this.setSettings(this.mqttBoardConfig)}))}},r=o,l=s("2877"),d=s("9989"),m=s("eebe"),h=s.n(m),c=Object(l["a"])(r,i,a,!1,null,null,null);t["default"]=c.exports;h()(c,"components",{QPage:d["a"]})}}]);