"use strict";function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}var precacheConfig=[["app.d28d7a1f1eab97873512bacbe935619b.css","29431577bc1ef8ff824bc54db131f416"],["fonts/MaterialIcons-Regular.012cf6a.woff","012cf6a10129e2275d79d6adac7f3b02"],["fonts/Roboto-Bold.ad140ff.woff","ad140ff02a7091257e2b31619106194e"],["fonts/Roboto-Light.37fbbba.woff","37fbbbad5577a95bdf058307c717c882"],["fonts/Roboto-Medium.303ded6.woff","303ded6436dcf7ea75157e2aeff876ce"],["fonts/Roboto-Regular.081b11e.woff","081b11ebaca8ad30fd092e01451015dc"],["fonts/Roboto-Thin.90d3804.woff","90d3804f0231704c15ccc5861245e8ce"],["fonts/materialdesignicons-webfont.1eccbc4.ttf","1eccbc4c41d49fd81840aef3eaabe862"],["fonts/materialdesignicons-webfont.4b13596.woff2","4b1359677a76d07aa0526d2fddbd77b7"],["fonts/materialdesignicons-webfont.6473d7d.woff","6473d7d5a01bb3f8fccd5bbeaf2be312"],["img/right-graphite@2x.f2e09a9.png","f2e09a9743fdb0c7f4dcbe4242441a5d"],["img/toolbox.1da4d62.png","1da4d62342ca95dcdb743a987cfa677a"],["index.html","5e0458d3c8b3e1a2f6141bed2cfb344f"],["js/0.3e6a392c4131e85f8c92.js","e97cb93868ec167f6a5ec6494f012eb8"],["js/1.0c796d76791d8c562c15.js","289dc7be6533c3ddb48d43cea7c20543"],["js/10.7a4f382a7854782b92b0.js","6553c8cea975601f6af2ed3b84459a50"],["js/11.7f19294a5228cc27032b.js","03d982ebdfec97fcbfd3fb8603683e4c"],["js/12.1bb31f1160be0b3e4e92.js","43580015a23a7109840350f465ca8df0"],["js/13.91496c977372cb795df8.js","d48cf3e795f0c04d94604e2c0668a03b"],["js/14.b7b1e679957b1dafa25f.js","948f1976eb7252b7a3121f8237750e56"],["js/15.ab3ae5250eee915baed9.js","fcd4b7c9d7cfbc11bbf2ce9f3aeb21da"],["js/16.a852c981c9ef83a2e138.js","9c9d6b7b2c755b6dc640ee2e950b2265"],["js/17.2646e5d2808eb8564aec.js","27b38f7000c8cd92b943990e34cde018"],["js/2.3e26249ae1e64dcfe918.js","61727dc6fcd63882857066ec20dbcc89"],["js/3.c0f1e86d212576fd65b5.js","be52f2a3bbe269fec3ea8913b481c497"],["js/4.cdeffba770dbcb98b3dd.js","dbffe50834f2ff8f413a9dbd7e97da44"],["js/5.c27778f3cb5c3cbf56dc.js","763034ebe9367f2cb8798490565f3f21"],["js/6.6d77e6553ffd9a7d52b6.js","73d10edc872fbdb7a7a56a144187684d"],["js/7.e7605c31230ba9b20c2d.js","6d981a24c4ca0dacf7b10bbf599af495"],["js/8.f14524ff7360c376c018.js","fb070dc32680331ecf40e174d4fb5f65"],["js/9.3214fb5e5097aefc9a0b.js","8545dbc652772c6864bcacc7fcb522db"],["js/app.js","0211c673be524161280a50e93f2b889c"],["js/manifest.js","eb30c3035ed897bd9f590471259814d7"],["js/vendor.js","68f00a55df3a0fc69fc0043d2bf02f9d"],["statics/flespi_logo_black.svg","82f983ec2277961e9878f2bf014b13fc"],["statics/icons/apple-icon-152x152.png","d5da697eec032a743f6a94d6ef4470be"],["statics/icons/favicon-16x16.png","fa908e7babb7cad954beac016f56d11e"],["statics/icons/favicon-32x32.png","c3d58f5c2a54890cd4e03371aaaf1e11"],["statics/icons/icon-192x192.png","14d6cca701394318ed367e336cf50847"],["statics/icons/icon-512x512.png","823133d6375e12d5237785194dd12c74"],["statics/icons/ms-icon-144x144.png","838698af837cf35dfead7869b02ce5b8"],["statics/manifest.json","e1e0f9f6bf639012521b000d6066edfd"],["statics/mountain.svg","1e3d1da4cf6d85e6e28cc3aae77e3ead"],["statics/right-graphite@2x.png","f2e09a9743fdb0c7f4dcbe4242441a5d"],["statics/toolbox.png","1da4d62342ca95dcdb743a987cfa677a"],["statics/toolbox50.png","525061fbc60090f9b92f626b25a2a976"],["statics/toolbox_mobile.png","cf46c82e435aa040daecaf16508027a3"]],cacheName="sw-precache-v3-toolbox-0.6.6-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,c){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=c),a.toString()},cleanResponse=function(e){if(!e.redirected)return Promise.resolve(e);return("body"in e?Promise.resolve(e.body):e.blob()).then(function(c){return new Response(c,{headers:e.headers,status:e.status,statusText:e.statusText})})},createCacheKey=function(e,c,a,t){var n=new URL(e);return t&&n.pathname.match(t)||(n.search+=(n.search?"&":"")+encodeURIComponent(c)+"="+encodeURIComponent(a)),n.toString()},isPathWhitelisted=function(e,c){if(0===e.length)return!0;var a=new URL(c).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,c){var a=new URL(e);return a.hash="",a.search=a.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return c.every(function(c){return!c.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),a.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var c=e[0],a=e[1],t=new URL(c,self.location),n=createCacheKey(t,hashParamName,a,!1);return[t.toString(),n]}));self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(c){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(a){if(!c.has(a)){var t=new Request(a,{credentials:"same-origin"});return fetch(t).then(function(c){if(!c.ok)throw new Error("Request for "+a+" returned a response with status "+c.status);return cleanResponse(c).then(function(c){return e.put(a,c)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var c=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(a){return Promise.all(a.map(function(a){if(!c.has(a.url))return e.delete(a)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var c,a=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching),t="index.html";(c=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,t),c=urlsToCacheKeys.has(a));c&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(c){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,c),fetch(e.request)}))}});