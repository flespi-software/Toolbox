# ToolboX

> ToolboX is app for display channel info from [flespi.io](https://flespi.io).

## Live
[Toolbox](https://flespi-software.github.io/Toolbox/)

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

## Requirements:
You need to have a separate token with at least the following ACLs:
https://flespi.io/auth/oauth/providers
https://flespi.io/auth/info
Platform
REST
https://flespi.io/platform/customer/logs
MQTT
flespi/log/platform/customer/+/#
Channels
REST
/gw/protocols/all
https://flespi.io/gw/channels/{selector}/logs
https://flespi.io/gw/channels/{selector}/messages
MQTT
flespi/state/gw/channels/{selector}/+
flespi/log/gw/channels/{selector}/#
flespi/message/gw/channels/{selector}/+
Devices
REST
https://flespi.io/gw/devices/{selector}/logs
https://flespi.io/gw/devices/{selector}/messages
MQTT
state/gw/devices/{selector}/+
flespi/log/gw/devices/{selector}/#
flespi/message/gw/devices/{selector}/#
Streams
REST
https://flespi.io/gw/streams/{selector}/logs
MQTT
state/gw/streams/{selector}/+
flespi/log/gw/streams/{selector}/#
Modems
REST
https://flespi.io/gw/modems/{selector}/logs
MQTT
flespi/state/gw/modems/{selector}/+
flespi/log/gw/modems/{selector}/#
HexViewer
REST
/gw/channels/{proxy-channel-id}/messages
MQTT
flespi/state/gw/channels/{selector}/+
flespi/message/gw/channels/{proxy-channel-id}/+
Containers
REST
https://flespi.io/storage/containers/{selector}/logs
MQTT
flespi/state/storage/containers/{selector}/+
flespi/log/storage/containers/{selector}/#
Abques
REST
https://flespi.io/storage/abques/{selector}/logs
MQTT
flespi/state/storage/abques/{selector}/+
flespi/log/storage/abques/{selector}/#
CDNS
REST
https://flespi.io/storage/cdns/{selector}/logs
MQTT
flespi/state/storage/cdns/{selector}/+
flespi/log/storage/cdns/{selector}/#
MQTT(section)
REST
https://flespi.io/mqtt/logs
MQTT
flespi/log/mqtt/+/#

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

## License
[MIT](https://github.com/flespi-software/Toolbox/blob/master/LICENSE) license.
