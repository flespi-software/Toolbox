## Routes:

### Platform
/#/platform/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/platform/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>} <br/>
### Channels
/#/channels/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/channels/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>}&messages={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>}&view_mode=<b>{messages | logs | both}</b> <br/>
### Devices
/#/devices/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br />
/#/devices/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>}&messages={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>}&view_mode=<b>{messages | logs | both}</b> <br />
### Streams
/#/streams/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/streams/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>} <br/>
### Modems
/#/modems/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/modems/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>} <br/>
### Calcs
/#/calcs/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/calcs/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>} <br/>
### Plugins
/#/plugins/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/plugins/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>} <br/>
### Containers
/#/containers/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/containers/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>} <br/>
### CDNS
/#/cdns/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/cdns/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>} <br/>
### MQTT
/#/mqtt/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br/>
/#/mqtt/<b>ID</b>?logs={"filter":<b>FILTER</b>,"from":<b>UTC_TIMESTAMP</b>,"to":<b>UTC_TIMESTAMP</b>} <br/>
### Intervals
/#/device/<b>DEVICE_ID</b>/calc/<b>CALC_ID</b>/intervals?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b> <br />
/#/device/<b>DEVICE_ID</b>/calc/<b>CALC_ID</b>/intervals?intervals={"filter":<b>FILTER</b>} <br />
/#/device/<b>DEVICE_ID</b>/calc/<b>CALC_ID</b>/intervals?related_intervals={"filter":<b>FILTER</b>}&related=<b>{intervals | messages}</b> <br />
/#/device/<b>DEVICE_ID</b>/calc/<b>CALC_ID</b>/intervals?messages={"filter":<b>FILTER</b>}&related=<b>{intervals | messages}</b> <br />
### HexViewer
/#/tools/hex/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b>&filter=<b>FILTER</b> <br />
/#/tools/hex/<b>ID</b>/ident/<b>IDENT</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b>&filter=<b>FILTER</b> <br/>
### TrafficViewer
/#/tools/traffic/<b>ID</b>?filter=<b>CONNECTION_FILTER</b>
/#/tools/traffic/<b>ID</b>/ident/<b>IDENT</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b>
### DeviceTraffic
/#/tools/device-traffic/<b>ID</b>?from=<b>UTC_TIMESTAMP</b>&to=<b>UTC_TIMESTAMP</b>
