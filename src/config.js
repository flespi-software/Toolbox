const locale = new Date().toString().match(/([-+][0-9]+)\s/)[1]
export const ACTION_MODE_SINGLE = 1,
  ACTION_MODE_MULTI = 2
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
        },
        {
          name: 'app',
          width: 150,
          display: true,
          description: "Request app"
        },
        {
          name: 'method',
          width: 150,
          display: true,
          description: "REST API method"
        },
        {
          name: 'uri',
          width: 150,
          display: true,
          description: "Request URI"
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  channels: {
    label: 'Channels',
    icon: 'merge_type',
    type: 'viewer',
    acl: [{
      name: 'channels',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] },
        { name: 'messages', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    logs: {
      vuexModuleName: 'channelsLogs',
      itemSettings: {},
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
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
          icon: 'mdi-content-save',
          label: 'Copy message',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-save',
          label: 'Copy messages',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  geofences: {
    label: 'Geofences',
    icon: 'mdi-vector-polygon',
    type: 'viewer',
    acl: [{
      name: 'geofences',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    logs: {
      vuexModuleName: 'geofencesLogs',
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
          name: 'reason',
          title: 'reason',
          width: 400,
          display: true,
          description: 'Log event reason'
        },
        {
          name: 'host',
          width: 150,
          display: true,
          description: "Connected device's address (source) or IP address from which HTTP request was received (host)"
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  plugins: {
    label: 'Plugins',
    icon: 'mdi-puzzle',
    type: 'viewer',
    acl: [{
      name: 'plugins',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    logs: {
      vuexModuleName: 'pluginsLogs',
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
          name: 'reason',
          title: 'reason',
          width: 400,
          display: true,
          description: 'Log event reason'
        },
        {
          name: 'host',
          width: 150,
          display: true,
          description: "Connected device's address (source) or IP address from which HTTP request was received (host)"
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
    acl: [{
      name: 'calcs',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] }
      ]
    }],
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
        },
        {
          name: 'device_id',
          width: 150,
          display: true,
          description: "Device ID"
        },
        {
          name: 'interval_id',
          width: 150,
          display: true,
          description: "Interval ID"
        },
        {
          name: 'interval_begin',
          width: 150,
          display: true,
          description: "Interval begin timestamp"
        },
        {
          name: 'interval_end',
          width: 150,
          display: true,
          description: "Interval end timestamp"
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  devices: {
    label: 'Devices',
    icon: 'mdi-developer-board',
    type: 'viewer',
    acl: [{
      name: 'devices',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] },
        { name: 'messages', methods: ['GET'] }
      ]
    }],
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
          title: 'name',
          width: 80,
          display: true,
          description: 'Name'
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
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
          type: 'copy'
        }
      ],
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
          { html: "Make sure the respective physical tracker correctly points to the proper channel`s <span class='text-bold'>IP:port</span> and is currently sending messages." },
          { html: "Make sure you specified the correct device <span class='text-bold'>ident</span> and picked the proper <span class='text-bold'>device type</span>." },
          { html: "Check the <span class='text-bold'>messages TTL</span> in the device settings — if it`s set to 0, messages will not show." },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy message',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-information-outline',
          label: 'Show message',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'show'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy messages',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  groups: {
    label: 'Groups',
    icon: 'mdi-folder-table',
    type: 'viewer',
    acl: [{
      name: 'groups',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    logs: {
      vuexModuleName: 'groupsLogs',
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
          width: 115,
          display: true,
          description: 'IP address from which HTTP request was received'
        },
        {
          name: 'token_id',
          title: 'token',
          width: 80,
          display: true,
          description: 'Token'
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  intervals: {
    label: 'Intervals',
    icon: 'mdi-set-center',
    path: 'device/:deviceId?/calc/:calcId?/intervals',
    type: 'viewer',
    acl: [
      {
        name: 'devices',
        methods: ['GET'],
        submodules: [
          { name: 'messages', methods: ['GET'] }
        ]
      },
      {
        name: 'calcs',
        methods: ['GET'],
        submodules: [
          { name: 'devices', methods: ['GET'] }
        ]
      }
    ],
    isDrawable: false,
    intervals: {
      vuexModuleName: 'intervals',
      emptyState: {
        label: 'Intervals not found',
        sublabel: 'If you expect to see the intervals here',
        hints: [
          { html: 'Make sure the selected device has messages to perform intervals calculations with.' },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy interval',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-information-outline',
          label: 'Show interval',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'show'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy intervals',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
    relatedIntervals: {
      vuexModuleName: 'relatedIntervals',
      mode: 'secondary',
      emptyState: {
        label: 'Intervals not found',
        sublabel: 'If you expect to see the intervals here',
        hints: [
          { html: 'Make sure the selected device has messages to perform intervals calculations with.' },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy interval',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-information-outline',
          label: 'Show interval',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'show'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy intervals',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
    },
    messages: {
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy message',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-information-outline',
          label: 'Show message',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'show'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy messages',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
      }
    }
  },
  streams: {
    label: 'Streams',
    icon: 'mdi-call-split',
    type: 'viewer',
    acl: [{
      name: 'streams',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] }
      ]
    }],
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
          name: 'ack_latency',
          title: 'latency',
          width: 100,
          display: true,
          description: 'ACK latency'
        },
        {
          name: 'ident',
          width: 180,
          display: true,
          description: 'Device ident'
        },
        {
          name: 'device_id',
          width: 100,
          display: true,
          description: 'Device ID'
        },
        {
          name: 'reason',
          width: 200,
          display: true,
          description: 'Messages count has skipped'
        },
        {
          name: 'message_timestamp',
          width: 200,
          display: true,
          description: 'Message timestamp'
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  webhooks: {
    label: 'Webhooks',
    icon: 'mdi-webhook',
    type: 'viewer',
    // acl: [{
    //   name: 'webhooks',
    //   methods: ['GET'],
    //   submodules: [
    //     { name: 'logs', methods: ['GET'] }
    //   ]
    // }],
    isDrawable: false,
    logs: {
      vuexModuleName: 'webhooksLogs',
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
          title: 'Event',
          width: 200,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'response_code',
          title: 'Response code',
          width: 100,
          display: true,
          description: ''
        },
        {
          name: 'message',
          width: 200,
          display: true,
          description: 'MQTT message'
        },
        {
          name: 'request_body',
          title: 'Request body',
          width: 200,
          display: true,
          description: 'HTTP request body'
        },
        {
          name: 'response',
          width: 100,
          display: true,
          description: 'HTTP server response'
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  grants: {
    label: 'Grants',
    icon: 'mdi-hand-extended',
    type: 'viewer',
    // acl: [{
    //   name: 'grants',
    //   methods: ['GET'],
    //   submodules: [
    //     { name: 'logs', methods: ['GET'] }
    //   ]
    // }],
    isDrawable: false,
    logs: {
      vuexModuleName: 'grantsLogs',
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
          title: 'Event',
          width: 200,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'token_id',
          title: 'Token id',
          width: 100,
          display: true,
          description: ''
        },
        {
          name: 'origin_id',
          width: 100,
          display: true,
          description: 'ID'
        },
        {
          name: 'host',
          title: 'Host',
          width: 200,
          display: true,
          description: 'Host'
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  realms: {
    label: 'Realms',
    icon: 'mdi-folder-account',
    type: 'viewer',
    // acl: [{
    //   name: 'realms',
    //   methods: ['GET'],
    //   submodules: [
    //     { name: 'logs', methods: ['GET'] }
    //   ]
    // }],
    isDrawable: false,
    logs: {
      vuexModuleName: 'realmsLogs',
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
          title: 'Event',
          width: 200,
          display: true,
          description: 'Log event code and description'
        },
        {
          name: 'token_id',
          title: 'Token id',
          width: 100,
          display: true,
          description: ''
        },
        {
          name: 'origin_id',
          width: 100,
          display: true,
          description: 'ID'
        },
        {
          name: 'host',
          title: 'Host',
          width: 200,
          display: true,
          description: 'Host'
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  modems: {
    label: 'Modems',
    icon: 'router',
    type: 'viewer',
    acl: [{
      name: 'modems',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] }
      ]
    }],
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
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  assets: {
    label: 'Assets',
    icon: 'mdi-timeline',
    type: 'viewer',
    acl: [{
      name: 'assets',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    logs: {
      vuexModuleName: 'assetsLogs',
      emptyState: {
        label: 'Log entries not found',
        sublabel: 'If you expect to see the log records here',
        hints: [
          { html: 'Make sure your asset is configured correctly.' },
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
          name: 'app',
          width: 150,
          display: true,
          description: "Request app"
        }
      ],
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  containers: {
    label: 'Containers',
    icon: 'featured_play_list',
    type: 'viewer',
    acl: [{
      name: 'containers',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] },
        { name: 'messages', methods: ['GET'] }
      ]
    }],
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
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
    messages: {
      vuexModuleName: 'containersMessages',
      emptyState: {
        label: 'Messages not found',
        sublabel: 'If you expect to see the container messages here',
        hints: [
          // { html: "Make sure the respective physical tracker correctly points to the proper channel`s <span class='text-bold'>IP:port</span> and is currently sending messages." },
          // { html: "Make sure you specified the correct device <span class='text-bold'>ident</span> and picked the proper <span class='text-bold'>device type</span>." },
          // { html: "Check the <span class='text-bold'>messages TTL</span> in the device settings — if it`s set to 0, messages will not show." },
          { html: "Pick a specific date and time using the <span class='text-bold'>date/time picker</span> on the top right." },
          { html: "Narrow down the search by specifying the desired parameter values in the <span class='text-bold'>filter control</span>." }
        ]
      },
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy message',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-information-outline',
          label: 'Show message',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'show'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy messages',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  mqtt: {
    label: 'MQTT',
    icon: 'mdi-access-point-network',
    acl: [{
      name: 'mqtt',
      methods: ['GET']
    }],
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
          name: 'topic',
          width: 150,
          display: true,
          description: 'session topic'
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
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  cdns: {
    label: 'CDNS',
    icon: 'mdi-harddisk',
    type: 'viewer',
    acl: [{
      name: 'cdns',
      methods: ['GET'],
      submodules: [
        { name: 'logs', methods: ['GET'] }
      ]
    }],
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
      actions: [
        {
          icon: 'mdi-content-copy',
          label: 'Copy log object',
          classes: '',
          mode: ACTION_MODE_SINGLE,
          type: 'copy'
        },
        {
          icon: 'mdi-content-copy',
          label: 'Copy log objects',
          classes: '',
          mode: ACTION_MODE_MULTI,
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
  hexViewer: {
    label: 'Hex Viewer',
    path: 'tools/hex',
    type: 'tools',
    icon: 'mdi-matrix',
    acl: [{
      name: 'channels',
      methods: ['GET'],
      submodules: [
        { name: 'messages', methods: ['GET'] }
      ]
    }],
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
    acl: [{
      name: 'channels',
      methods: ['GET'],
      submodules: [
        { name: 'idents', methods: ['GET'] }
      ]
    }],
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
  deviceTraffic: {
    label: 'Device traffic',
    path: 'tools/device-traffic',
    type: 'tools',
    icon: 'mdi-download-network-outline',
    acl: [{
      name: 'devices',
      methods: ['GET'],
      submodules: [
        { name: 'packets', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    messages: {
      vuexModuleName: 'deviceTraffic',
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

  streamTraffic: {
    label: 'Stream traffic',
    path: 'tools/stream-traffic',
    type: 'tools',
    icon: 'mdi-download-network-outline',
    acl: [{
      name: 'streams',
      methods: ['GET'],
      submodules: [
        { name: 'packets', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    messages: {
      vuexModuleName: 'streamTraffic',
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
  webhookTraffic: {
    label: 'Webhook traffic',
    path: 'tools/webhook-traffic',
    type: 'tools',
    icon: 'mdi-download-network-outline',
    acl: [{
      name: 'webhooks',
      methods: ['GET'],
      submodules: [
        { name: 'packets', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    messages: {
      vuexModuleName: 'webhookTraffic',
      emptyState: {
        label: 'Traffic not found',
        sublabel: 'If you expect to see the raw messages here',
        hints: [
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
  pluginTraffic: {
    label: 'Plugin traffic',
    path: 'tools/plugin-traffic',
    type: 'tools',
    icon: 'mdi-download-network-outline',
    acl: [{
      name: 'plugins',
      methods: ['GET'],
      submodules: [
        { name: 'packets', methods: ['GET'] }
      ]
    }],
    isDrawable: false,
    messages: {
      vuexModuleName: 'pluginTraffic',
      emptyState: {
        label: 'Traffic not found',
        sublabel: 'If you expect to see the raw messages here',
        hints: [
          { html: "Make sure your trackers are correctly pointed to the channel’s <span class='text-bold'>IP:port</span> and they are currently sending messages.", wclass: ['col-12'] },
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
