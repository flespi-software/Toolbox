
## Used API resurces:

| Entity | REST | MQTT |
|---|---|---|
| Platform | https://flespi.io/platform/customer/logs | flespi/log/platform/customer/+/#<br />flespi/state/platform/subaccounts/+ |
| Channels | https://flespi.io/gw/channels/{selector}/logs<br />https://flespi.io/gw/channels/{selector}/messages | flespi/state/gw/channels/{selector}<br />flespi/log/gw/channels/{selector}/#<br />flespi/message/gw/channels/{selector}/+ |
| Devices | https://flespi.io/gw/devices/{selector}/logs<br />https://flespi.io/gw/devices/{selector}/messages<br />https://flespi.io/gw/protocols/all/device-types/all<br />https://flespi.io/gw/devices/{selector}/telemetry<br />https://flespi.io/gw/channels/{selector} | flespi/state/gw/devices/{selector}<br />flespi/log/gw/devices/{selector}/#<br />flespi/message/gw/devices/{selector}/#<br />flespi/state/gw/calcs/+/devices/{device_id}/+<br /> |
| Intervals | https://flespi.io/gw/calcs/{calcSelector}/devices/{deviceSelector}/intervals/all | flespi/state/gw/calcs/+/devices/+/+<br/>flespi/state/gw/calcs/+<br />flespi/state/gw/devices/+ |
| Calcs | https://flespi.io/gw/calcs/{selector}/logs | flespi/state/gw/calcs/{selector}<br />flespi/log/gw/calcs/{selector}/# |
| Streams | https://flespi.io/gw/streams/{selector}/logs | state/gw/streams/{selector}<br />flespi/log/gw/streams/{selector}/# |
| Modems | https://flespi.io/gw/modems/{selector}/logs | flespi/state/gw/modems/{selector}<br />flespi/log/gw/modems/{selector}/# |
| HexViewer | https://flespi.io/gw/channels/{proxy-channel-id}/messages | flespi/state/gw/channels/{selector}<br />flespi/message/gw/channels/{proxy-channel-id}/+ |
| Containers | https://flespi.io/storage/containers/{selector}/logs | flespi/state/storage/containers/{selector}<br />flespi/log/storage/containers/{selector}/# |
| CDNS | https://flespi.io/storage/cdns/{selector}/logs | flespi/state/storage/cdns/{selector}<br />flespi/log/storage/cdns/{selector}/# |
| MQTT(section) | https://flespi.io/mqtt/logs | flespi/log/mqtt/+/#<br />flespi/state/platform/subaccounts/+ |
