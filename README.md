# ToolboX

> A diagnostic tool for all instances inside the flespi platform ([flespi.io](https://flespi.io)). Convenient access to the platform, channel, device, stream, storage, and MQTT logs. Detailed view of channels and devices messages. Real-time and history modes. Also includes a HEX viewer to analyze raw telematics data and MQTT Board to play with MQTT connections.

## Live
[Toolbox](https://toolbox.flespi.io/)

![Screenshot](/misc/screenshot.png?raw=true "ToolboX")

## Features
* ES6 Javascript
* Vue.js
* Writing .vue files
* Vuex
* Webpack
* Responsive layout
* NPM ecosystems
* Material theme
* Dev Hot Reload
* and many more!

## Prerequisites:

- [Node.js](https://nodejs.org/en/) (>=9.x)
- npm version 5+ and [Git](https://git-scm.com/).

## Build Setup

``` bash
# clone the repo
$ git clone https://github.com/flespi-software/toolbox.git mytoolbox

# go into app's directory and install dependencies
$ cd mytoolbox
$ npm install

# serve with hot reload at localhost:7007 for flespi.io
$ npm run dev

# build for production with minification for flespi.io
$ npm run build

# lint code
$ quasar lint

# serve with hot reload at localhost:7007 for localhost:9005
$ npm run dev_local
```

## Requirements:
You need to have a separate token with at least the following ACLs:

| Entity | REST | MQTT |
|---|---|---|
| Platform | https://flespi.io/platform/customer/logs | flespi/log/platform/customer/+/# |
| Channels | https://flespi.io/gw/channels/{selector}/logs<br />https://flespi.io/gw/channels/{selector}/messages | flespi/state/gw/channels/{selector}<br />flespi/log/gw/channels/{selector}/#<br />flespi/message/gw/channels/{selector}/+ |
| Devices | https://flespi.io/gw/devices/{selector}/logs<br />https://flespi.io/gw/devices/{selector}/messages<br />https://flespi.io/gw/protocols/all/device-types/all | flespi/state/gw/devices/{selector}<br />flespi/log/gw/devices/{selector}/#<br />flespi/message/gw/devices/{selector}/# |
| Intervals<br/>(all devices requarements needed) | https://flespi.io/gw/calcs/{calcSelector}/devices/{deviceSelector}/intervals/all | flespi/state/gw/calcs/+/devices/+/+<br/>flespi/state/gw/calcs/+ |
| Calcs | https://flespi.io/gw/calcs/{selector}/logs | flespi/state/gw/calcs/{selector}<br />flespi/log/gw/calcs/{selector}/# |
| Streams | https://flespi.io/gw/streams/{selector}/logs | state/gw/streams/{selector}<br />flespi/log/gw/streams/{selector}/# |
| Modems | https://flespi.io/gw/modems/{selector}/logs | flespi/state/gw/modems/{selector}<br />flespi/log/gw/modems/{selector}/# |
| HexViewer | https://flespi.io/gw/channels/{proxy-channel-id}/messages | flespi/state/gw/channels/{selector}<br />flespi/message/gw/channels/{proxy-channel-id}/+ |
| Containers | https://flespi.io/storage/containers/{selector}/logs | flespi/state/storage/containers/{selector}<br />flespi/log/storage/containers/{selector}/# |
| Abques | https://flespi.io/storage/abques/{selector}/logs | flespi/state/storage/abques/{selector}<br />flespi/log/storage/abques/{selector}/# |
| CDNS | https://flespi.io/storage/cdns/{selector}/logs | flespi/state/storage/cdns/{selector}<br />flespi/log/storage/cdns/{selector}/# |
| MQTT(section) | https://flespi.io/mqtt/logs | flespi/log/mqtt/+/# |


## License
[MIT](https://github.com/flespi-software/Toolbox/blob/master/LICENSE) license.
