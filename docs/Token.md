## Requirements:
You need to have a separate token with at least the following ACLs:

| Entity | REST |
|---|---|
| Platform | master token only |
| Channels | https://flespi.io/gw/channels/{selector}<br />https://flespi.io/gw/channels/{selector}/logs<br />https://flespi.io/gw/channels/{selector}/messages<br />https://flespi.io/gw/channels/{selector}/idents |
| Devices | https://flespi.io/gw/devices/{selector}<br />https://flespi.io/gw/devices/{selector}/logs<br />https://flespi.io/gw/devices/{selector}/messages<br />https://flespi.io/gw/devices/{selector}/packets |
| Intervals | https://flespi.io/gw/devices/{selector}<br />https://flespi.io/gw/calcs/{selector}<br />https://flespi.io/gw/calcs/{calcSelector}/devices/{deviceSelector}<br />https://flespi.io/gw/calcs/{calcSelector}/devices/{deviceSelector}/intervals/all |
| Calcs | https://flespi.io/gw/calcs/{selector}<br />https://flespi.io/gw/calcs/{selector}/logs |
| Streams | https://flespi.io/gw/streams/{selector}<br />https://flespi.io/gw/streams/{selector}/logs |
| Modems | https://flespi.io/gw/modems/{selector}<br />https://flespi.io/gw/modems/{selector}/logs |
| HexViewer | https://flespi.io/gw/channels/{proxy-channel-id}/messages |
| Containers | https://flespi.io/gw/containers/{selector}<br />https://flespi.io/storage/containers/{selector}/logs |
| CDNS | https://flespi.io/gw/cdns/{selector}<br />https://flespi.io/storage/cdns/{selector}/logs |
| MQTT(section) | https://flespi.io/mqtt/logs |
