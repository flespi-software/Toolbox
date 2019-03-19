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
You need to have a separate token with at least the following ACLs:<br />
https://flespi.io/auth/oauth/providers<br />
https://flespi.io/auth/info<br />
Platform<br />
REST<br />
https://flespi.io/platform/customer/logs<br />
MQTT<br />
flespi/log/platform/customer/+/#<br />
Channels<br />
REST<br />
/gw/protocols/all<br />
https://flespi.io/gw/channels/{selector}/logs<br />
https://flespi.io/gw/channels/{selector}/messages<br />
MQTT<br />
flespi/state/gw/channels/{selector}/+<br />
flespi/log/gw/channels/{selector}/#<br />
flespi/message/gw/channels/{selector}/+<br />
Devices<br />
REST<br />
https://flespi.io/gw/devices/{selector}/logs<br />
https://flespi.io/gw/devices/{selector}/messages<br />
MQTT<br />
state/gw/devices/{selector}/+<br />
flespi/log/gw/devices/{selector}/#<br />
flespi/message/gw/devices/{selector}/#<br />
Streams<br />
REST<br />
https://flespi.io/gw/streams/{selector}/logs<br />
MQTT<br />
state/gw/streams/{selector}/+<br />
flespi/log/gw/streams/{selector}/#<br />
Modems<br />
REST<br />
https://flespi.io/gw/modems/{selector}/logs<br />
MQTT<br />
flespi/state/gw/modems/{selector}/+<br />
flespi/log/gw/modems/{selector}/#<br />
HexViewer<br />
REST<br />
/gw/channels/{proxy-channel-id}/messages<br />
MQTT<br />
flespi/state/gw/channels/{selector}/+<br />
flespi/message/gw/channels/{proxy-channel-id}/+<br />
Containers<br />
REST<br />
https://flespi.io/storage/containers/{selector}/logs<br />
MQTT<br />
flespi/state/storage/containers/{selector}/+<br />
flespi/log/storage/containers/{selector}/#<br />
Abques<br />
REST<br />
https://flespi.io/storage/abques/{selector}/logs<br />
MQTT<br />
flespi/state/storage/abques/{selector}/+<br />
flespi/log/storage/abques/{selector}/#<br />
CDNS<br />
REST<br />
https://flespi.io/storage/cdns/{selector}/logs<br />
MQTT<br />
flespi/state/storage/cdns/{selector}/+<br />
flespi/log/storage/cdns/{selector}/#<br />
MQTT(section)<br />
REST<br />
https://flespi.io/mqtt/logs<br />
MQTT<br />
flespi/log/mqtt/+/#<br />

## License
[MIT](https://github.com/flespi-software/Toolbox/blob/master/LICENSE) license.
