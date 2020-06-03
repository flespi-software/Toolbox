const locale = new Date().toString().match(/([-+][0-9]+)\s/)[1]
export default {
  platform: {
    label: 'Platform',
    icon: 'icon-flespi2-02-01',
    type: 'viewer',
    isDrawable: false,
    logs: {
      vuexModuleName: 'platformLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: 'Make sure you have some active instances in the flespi platform, e.g. channels receiving messages, streams forwarding data, MQTT sessions, etc.', wclass: ['col-6', 'col-sm-6'] },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right.", wclass: ['col-6', 'col-sm-6'] },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>.", wclass: ['col-6', 'col-sm-6'] }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 450,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'host',
          width: 150,
          display: true,
          description: "Connected device's address (source) or IP address from which HTTP request was received (host)"
        }
      ],
      actions: [],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  channels: {
    label: 'Channels',
    icon: 'merge_type',
    type: 'viewer',
    acl: ['protocols', 'channels'],
    isDrawable: false,
    logs: {
      vuexModuleName: 'channelsLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: "Make sure your trackers are correctly pointed to this channel’s <span class='text-bold'>IP:port</span> and they are currently sending messages." },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 400,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'ident',
          width: 150,
          display: true,
          description: "Connected device's identification string"
        },
        {
          name: 'msgs',
          title: 'messages',
          width: 85,
          display: true,
          description: 'Number of messages received'
        },
        {
          name: 'recv',
          title: 'received',
          width: 85,
          display: true,
          description: 'Number of bytes received'
        },
        {
          name: 'send',
          title: 'sent',
          width: 85,
          display: true,
          description: 'Number of bytes sent'
        },
        {
          name: 'host',
          width: 150,
          display: true,
          description: "Connected device's address (source) or IP address from which HTTP request was received (host)"
        },
        {
          name: 'duration',
          width: 85,
          display: true,
          description: 'Connection duration in seconds'
        },
        {
          name: 'transport',
          width: 85,
          display: true,
          description: "Connected device's transport: tcp, udp, http etc"
        }
      ],
      actions: [],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    },
    messages: {
      vuexModuleName: 'channelsMessages',
      emptyState: {
        label: 'Messages not found',
        sublabel: 'If you expect to see the device messages here',
        hints: [
          { html: "Make sure your trackers are correctly pointed to this channel’s <span class='text-bold'>IP:port</span> and they are currently sending messages.", wclass: ['col-6', 'col-sm-6'] },
          { html: "Check the <span class='text-bold'>messages TTL</span> in the channel settings — if it’s set to 0, messages will not show.", wclass: ['col-6', 'col-sm-6'] }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'copy',
          classes: '',
          type: 'copy'
        }
      ],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  calcs: {
    label: 'Calcs',
    icon: 'mdi-calculator-variant',
    type: 'viewer',
    acl: ['calcs'],
    isDrawable: false,
    logs: {
      vuexModuleName: 'calcsLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: "Make sure you <a class='text-white' href='https://flespi.com/kb/working-with-devices-assigned-to-calculator' target='_blank'>assigned</a> this calculator to one or more devices and that these devices have messages to perform calculations with." },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 400,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'host',
          width: 150,
          display: true,
          description: "Connected device's address (source) or IP address from which HTTP request was received (host)"
        }
      ],
      actions: [],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  devices: {
    label: 'Devices',
    icon: 'mdi-developer-board',
    type: 'viewer',
    acl: ['devices'],
    isDrawable: false,
    logs: {
      vuexModuleName: 'devicesLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: "Make sure the respective physical tracker correctly points to the proper channel’s <span class='text-bold'>IP:port</span> and is currently sending messages." },
          { html: "Make sure you specified the correct device <span class='text-bold'>ident</span> and picked the proper <span class='text-bold'>device type</span>." },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 400,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'name',
          title: 'setting',
          width: 80,
          display: true,
          description: 'Setting name'
        },
        {
          name: 'ident',
          width: 150,
          display: true,
          description: "Connected device's identification string"
        },
        {
          name: 'msgs',
          title: 'messages',
          width: 85,
          display: true,
          description: 'Number of messages received'
        },
        {
          name: 'recv',
          title: 'received',
          width: 85,
          display: true,
          description: 'Number of bytes received'
        },
        {
          name: 'send',
          title: 'sent',
          width: 85,
          display: true,
          description: 'Number of bytes sent'
        },
        {
          name: 'source',
          width: 150,
          display: true,
          description: "Connected device's address"
        },
        {
          name: 'host',
          width: 150,
          display: true,
          description: 'IP address from which HTTP request was received'
        },
        {
          name: 'duration',
          width: 85,
          display: true,
          description: 'Connection duration in seconds'
        },
        {
          name: 'transport',
          width: 85,
          display: true,
          description: "Connected device's transport: tcp, udp, http etc"
        }
      ],
      actions: [],
      itemSettings: {},
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    },
    messages: {
      vuexModuleName: 'devicesMessages',
      emptyState: {
        label: 'Messages not found',
        sublabel: 'If you expect to see the device messages here',
        hints: [
          { html: "Make sure the respective physical tracker correctly points to the proper channel’s <span class='text-bold'>IP:port</span> and is currently sending messages." },
          { html: "Make sure you specified the correct device <span class='text-bold'>ident</span> and picked the proper <span class='text-bold'>device type</span>." },
          { html: "Check the <span class='text-bold'>messages TTL</span> in the device settings — if it’s set to 0, messages will not show." },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'copy',
          classes: '',
          type: 'copy'
        }
      ],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    },
    intervals: {
      vuexModuleName: 'intervals',
      emptyState: {
        label: 'Intervals not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: 'Make sure the selected device has messages to perform intervals calculations with.' },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'copy',
          classes: '',
          type: 'copy'
        },
        {
          icon: 'mdi-map',
          label: 'show on map',
          classes: '',
          type: 'map'
        }
      ],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      },
      devicesMessages: {
        actions: [
          {
            icon: 'mdi-content-copy',
            label: 'copy',
            classes: '',
            type: 'copy'
          }
        ],
        viewConfig: {
          needShowFilter: true
        },
        theme: {
          color: 'white',
          bgColor: 'grey-9',
          contentInverted: true,
          controlsInverted: true
        },
        vuexModuleName: 'intervalsDevicesMessages',
        emptyState: {
          label: 'Messages not found',
          sublabel: 'If you expect to see the device messages here',
          hints: [
            { html: "Make sure the respective physical tracker correctly points to the proper channel’s <span class='text-bold'>IP:port</span> and is currently sending messages." },
            { html: "Make sure you specified the correct device <span class='text-bold'>ident</span> and picked the proper <span class='text-bold'>device type</span>." },
            { html: "Check the <span class='text-bold'>messages TTL</span> in the device settings — if it’s set to 0, messages will not show." },
            { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
            { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
          ]
        }
      }
    }
  },
  streams: {
    label: 'Streams',
    icon: 'mdi-call-split',
    type: 'viewer',
    acl: ['streams'],
    isDrawable: false,
    logs: {
      vuexModuleName: 'streamsLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: "Make sure you <a class='text-white' href='https://flespi.com/kb/stream-forward-data-from-gateway' target='_blank'>subscribed</a> this stream to one or more channels and/or devices." },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 450,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'accepted',
          width: 100,
          display: true,
          description: 'Messages count has accepted'
        },
        {
          name: 'read',
          width: 100,
          display: true,
          description: 'Messages count has read'
        },
        {
          name: 'rejected',
          width: 100,
          display: true,
          description: 'Messages count has rejected'
        },
        {
          name: 'skipped',
          width: 100,
          display: true,
          description: 'Messages count has skipped'
        },
        {
          name: 'host',
          width: 150,
          display: true,
          description: 'IP address from which HTTP request was received'
        }
      ],
      actions: [],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  modems: {
    label: 'Modems',
    icon: 'router',
    type: 'viewer',
    acl: ['modems'],
    isDrawable: false,
    logs: {
      vuexModuleName: 'modemsLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: 'Make sure your modem is configured correctly.' },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 450,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'address',
          width: 100,
          display: true,
          description: 'SMS source address or SMS destination address'
        },
        {
          name: 'type',
          width: 100,
          display: true,
          description: 'hex or text'
        },
        {
          name: 'text',
          width: 150,
          display: true,
          description: 'textual SMS contents'
        },
        {
          name: 'hex',
          width: 150,
          display: true,
          description: 'hex representation of binary SMS contents'
        }
      ],
      actions: [],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  containers: {
    label: 'Containers',
    icon: 'featured_play_list',
    type: 'viewer',
    acl: ['containers'],
    isDrawable: false,
    logs: {
      vuexModuleName: 'containersLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 450,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'host',
          width: 80,
          display: true,
          description: 'IP address from which HTTP request was received'
        }
      ],
      actions: [],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  mqtt: {
    label: 'MQTT',
    icon: 'mdi-access-point-network',
    acl: ['mqtt'],
    type: 'viewer',
    isDrawable: false,
    logs: {
      vuexModuleName: 'mqttLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: "Make sure you have active MQTT sessions communicating with the flespi MQTT broker using <a class='text-white' href='https://flespi.com/tools/mqtt-board' target='_blank'>MQTT board</a> tool." },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 450,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'client_id',
          width: 150,
          display: true,
          description: 'session client id'
        },
        {
          name: 'published',
          width: 80,
          display: true,
          description: 'amount of messages published by session'
        },
        {
          name: 'received',
          width: 80,
          display: true,
          description: 'amount of messages received by session'
        }
      ],
      actions: [],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  cdns: {
    label: 'CDNS',
    icon: 'mdi-harddisk',
    type: 'viewer',
    acl: ['cdns'],
    isDrawable: false,
    logs: {
      vuexModuleName: 'cdnsLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      cols: [
        {
          name: 'timestamp',
          width: 165,
          display: true,
          description: 'Log event time',
          addition: `${locale.slice(0, 3)}:${locale.slice(3)}`
        },
        {
          name: 'event_code',
          title: 'event',
          width: 450,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'host',
          width: 150,
          display: true,
          description: 'IP address from which HTTP request was received'
        },
        {
          name: 'mime',
          width: 80,
          display: true,
          description: 'mime type of file'
        },
        {
          name: 'name',
          width: 250,
          display: true,
          description: 'name of file'
        },
        {
          name: 'size',
          width: 80,
          display: true,
          description: ''
        }
      ],
      actions: [],
      viewConfig: {
        needShowFilter: true,
        needShowDateRange: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  hexViewer: {
    label: 'Hex Viewer',
    path: 'tools/hex',
    type: 'tools',
    icon: 'mdi-matrix',
    acl: ['protocols', 'channels'],
    isDrawable: false,
    messages: {
      vuexModuleName: 'hexMessages',
      emptyState: {
        label: 'Connections not found',
        sublabel: 'If you expect to see the raw messages here',
        hints: [
          { html: "Check your <a class='text-white' href='https://flespi.com/protocols/proxy' target='_blank'>proxy channel</a> configuration.", wclass: ['col-12'] },
          { html: "Make sure your trackers are correctly pointed to this channel’s <span class='text-bold'>IP:port</span> and they are currently sending messages.", wclass: ['col-12'] },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right.", wclass: ['col-12'] },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>.", wclass: ['col-12'] }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'copy',
          classes: '',
          type: 'copy'
        }
      ],
      viewConfig: {
        needShowFilter: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  trafficViewer: {
    label: 'Traffic  Viewer',
    path: 'tools/traffic',
    type: 'tools',
    icon: 'mdi-download-network-outline',
    acl: ['protocols', 'channels'],
    isDrawable: false,
    messages: {
      vuexModuleName: 'trafficMessages',
      emptyState: {
        label: 'Traffic not found',
        sublabel: 'If you expect to see the raw messages here',
        hints: [
          { html: "Make sure your trackers are correctly pointed to this channel’s <span class='text-bold'>IP:port</span> and they are currently sending messages.", wclass: ['col-12'] },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right.", wclass: ['col-12'] },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>.", wclass: ['col-12'] }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'copy',
          classes: '',
          type: 'copy'
        }
      ],
      viewConfig: {
        needShowFilter: true
      },
      theme: {
        color: 'white',
        bgColor: 'grey-9',
        contentInverted: true,
        controlsInverted: true
      }
    }
  },
  mqttClient: {
    label: 'Mqtt Board',
    path: 'tools/mqtt',
    type: 'tools',
    icon: 'mdi-view-dashboard-variant',
    isDrawable: false
  }
}
