(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["de349256"],{"377f":function(e,t,i){},8416:function(e,t,i){"use strict";var s=i("377f"),a=i.n(s);a.a},aaff:function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("q-page",[i("q-toolbar",{staticClass:"justify-between",attrs:{color:"dark"}},[e.items.length?i("div",{class:{"middle-modificator":!e.active},staticStyle:{"max-width":"50%"}},[i("q-item",{staticClass:"no-padding",style:{cursor:e.isNeedSelect?"":"default!important"}},[i("q-item-main",[i("q-item-tile",{staticClass:"ellipsis overflow-hidden",style:{maxWidth:"140px"},attrs:{label:""}},[e._v(e._s(e.active?e.selectedItem.name||"<noname>":"SELECT CONTAINER"))]),e.active?i("q-item-tile",{staticStyle:{"font-size":"0.8rem"},attrs:{sublabel:""}},[e._v(e._s(e.selectedItem.id))]):e._e()],1),i("q-item-side",{staticClass:"text-right"},[e.active?i("q-item-tile",{staticClass:"text-center",staticStyle:{display:"inline-block"},attrs:{stamp:"",color:"white"}},[e.selectedItem.deleted?i("div",{staticClass:"cheap-modifier"},[i("small",[e._v("DELETED")])]):e._e(),e._v("#"+e._s(e.selectedItem.id.toString()))]):e._e(),e.isNeedSelect?i("q-item-tile",{staticStyle:{display:"inline-block"},attrs:{stamp:"",color:"white",size:"2rem",icon:"mdi-menu-down"}}):e._e()],1),e.isNeedSelect?i("q-popover",{ref:"popoverActive",attrs:{fit:"",anchor:e.active?void 0:"bottom middle",self:e.active?void 0:"top middle"}},[i("q-list",{staticClass:"scroll",attrs:{link:"",separator:""}},[i("VirtualList",{attrs:{size:40,remain:e.items.length>6?6:e.items.length}},e._l(e.items,function(t,s){return i("q-item",{key:s,staticClass:"cursor-pointer",class:{"text-grey-8":t.deleted},attrs:{highlight:""},nativeOn:{click:function(i){e.active=t.id,e.$refs.popoverActive.hide(),e.$emit("view-data-hide")}}},[i("q-item-main",[i("q-item-tile",{staticClass:"ellipsis overflow-hidden",attrs:{label:""}},[e._v(e._s(t.name||"<noname>"))])],1),i("q-item-side",{staticClass:"text-center"},[t.deleted?i("q-item-tile",{staticClass:"cheap-modifier"},[i("small",[e._v("DELETED")])]):e._e(),i("q-item-tile",[i("small",[e._v("#"+e._s(t.id.toString()))])])],1)],1)}))],1),e.needShowGetDeletedAction&&1===e.tokenType?i("q-btn",{staticClass:"deleted-action",attrs:{icon:"mdi-download"},on:{click:e.getDeletedHandler}},[e._v("see deleted")]):e._e()],1):e._e()],1)],1):e._e(),e.active&&!e.selectedItem.deleted?i("q-btn",{staticClass:"on-right pull-right text-center round-borders q-px-xs q-py-none",staticStyle:{"min-width":"70px","max-width":"70px"},attrs:{flat:"",dense:"",color:"white"},on:{click:function(t){e.modeModel=!e.modeModel}}},[i("q-icon",{attrs:{size:"1.5rem",color:"white",name:e.modeModel?"playlist_play":"history"}}),i("div",{staticStyle:{"font-size":".7rem"}},[e._v(e._s(e.modeModel?"Real-time":"History"))]),e.newMessagesCount?i("div",{staticClass:"bg-red text-white q-pa-xs round-borders cursor-pointer absolute-top-right",staticStyle:{"font-size":".6rem"}},[e._v(e._s(e.newMessagesCount))]):e._e(),i("q-tooltip",[e._v("Mode (Real-time/History)")])],1):e._e(),e.active?i("div",{staticClass:"flex",staticStyle:{width:"46px"}},[i("transition",{attrs:{appear:"","enter-active-class":"animated bounceInDown","leave-active-class":"animated bounceOutUp"}},[e.modeModel&&!e.isEmptyMessages?i("q-btn",{staticClass:"on-left pull-right text-center q-py-none",staticStyle:{width:"60px"},attrs:{title:"Clear all panes",flat:"",dense:""},on:{click:e.clearHandler}},[i("q-icon",{attrs:{size:"1.5rem",color:"white",name:"mdi-playlist-remove"}}),i("div",{staticStyle:{"font-size":".7rem"}},[e._v("Clear")])],1):e._e()],1)],1):e._e()],1),e.isInit&&e.active?i("logs",{ref:"logs",style:{minHeight:"calc(100vh - "+(e.isVisibleToolbar?"100px":"50px")+")",position:"relative"},attrs:{mode:e.mode,item:e.selectedItem,limit:e.limit,originPattern:"storage/containers/:id",isEnabled:!0,config:e.config.logs},on:{"view-log-message":e.viewLogMessagesHandler}}):e._e(),e.items.length?e._e():i("div",{staticClass:"text-center text-grey-3 q-mt-lg"},[i("div",{staticStyle:{"font-size":"2rem"}},[e._v(e._s(e.isLoading?"Fetching data..":"Containers not found"))]),!e.isLoading&&e.needShowGetDeletedAction&&1===e.tokenType?i("q-btn",{staticClass:"q-mt-sm",attrs:{icon:"mdi-download",label:"see deleted"},on:{click:e.getDeletedHandler}}):e._e()],1)],1)},a=[],n=(i("96cf"),i("c973")),l=i.n(n),o=(i("c5f6"),i("ac6a"),i("cadf"),i("8615"),i("3156")),c=i.n(o),r=i("2ce0"),d=i("2f62"),m=i("89c1"),u=i.n(m),h=i("286e"),v={props:["limit","isLoading","isVisibleToolbar","isNeedSelect","config"],mixins:[h["a"]],data:function(){return{mode:1,active:null,isInit:!1,needShowGetDeletedAction:!0}},computed:c()({},Object(d["d"])({newMessagesCount:function(e){return e[this.config.logs.vuexModuleName]?e[this.config.logs.vuexModuleName].newMessagesCount:0},isEmptyMessages:function(e){return!!e[this.config.logs.vuexModuleName]&&!e[this.config.logs.vuexModuleName].messages.length},tokenType:function(e){return e.tokenInfo&&e.tokenInfo.access?e.tokenInfo.access.type:-1},itemsCollection:function(e){return e.items},items:function(e){return Object.values(e.items)}}),{selectedItem:function(){var e=this.itemsCollection[this.active]||null;return e&&e.deleted&&this.deletedHandler(),e},modeModel:{get:function(){return!!this.mode},set:function(e){var t=Date.now();this.date=e?0:t-t%864e5,this.mode=Number(e),this.$emit("view-data-hide")}}}),methods:c()({},Object(d["b"])(["getDeleted"]),{viewDataHandler:function(e){this.$emit("view-data",e)},viewLogMessagesHandler:function(e){this.$emit("view-log-message",e)},clearHandler:function(){var e=this;this.$q.dialog({title:"Confirm",message:"Do you really want to clear all data from the panes?",ok:!0,cancel:!0}).then(function(){e.$store.commit("".concat(e.config.logs.vuexModuleName,"/clearMessages"))}).catch(function(){})},getDeletedHandler:function(){var e=l()(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,this.getDeleted("containers");case 2:this.needShowGetDeletedAction=!1;case 3:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),clearActive:function(){this.active=null},deletedHandler:function(){this.mode=0},init:function(){var e="containers",t=this.$q.localStorage.get.item(e),i=this.$route.params&&this.$route.params.id?Number(this.$route.params.id):null;this.isInit=!0,i?this.itemsCollection[i]?this.active=i:this.active=null:t&&this.itemsCollection[t]&&(this.active=t),this.selectedItem&&this.selectedItem.deleted&&this.deletedHandler()}}),watch:{$route:function(e){if(e.params&&e.params.id){var t=Number(e.params.id);this.itemsCollection[t]?this.active=t:this.isInit&&(this.active=null)}else e.params&&!e.params.id&&(this.active=null)},active:function(e){var t=this.itemsCollection[e]||null;e?(this.$q.localStorage.set("containers",e),this.$router.push("/containers/".concat(e))):this.$router.push("/containers"),t.deleted&&this.deletedHandler()}},components:{logs:r["a"],VirtualList:u.a}},f=v,p=(i("8416"),i("2877")),g=Object(p["a"])(f,s,a,!1,null,null,null);g.options.__file="Containers.vue";t["default"]=g.exports}}]);