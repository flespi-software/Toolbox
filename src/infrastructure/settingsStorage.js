import { LocalStorage } from 'quasar'

const DB_NAME = 'flespi-toolbox'
const DB_VERSION = 1
const STORE_NAME = 'settings'
const SETTINGS_KEY = 'flespi-toolbox-settings'
/* marks the localStorage record as already imported, so a stale snapshot is never brought back */
const IMPORTED_FLAG = `${SETTINGS_KEY}.imported`
/* qvirtualscroll keeps the columns of every list under `<SETTINGS_KEY>.cols.<list>` */
const COLS_NAMESPACE = `${SETTINGS_KEY}.cols`
const WRITE_DEBOUNCE = 300
/* the format tag of an exported settings file */
const EXPORT_FORMAT = 'flespi-toolbox-settings'
const EXPORT_VERSION = 1

/*
 * Toolbox used to be served from flespi.io/toolbox and is served from toolbox.flespi.io now. It is the
 * same build, but storage is per origin, so the settings saved under the old URL stayed with flespi.io.
 * `public/settings-bridge.html`, loaded from there in a hidden iframe, hands them over once.
 */
const LEGACY_ORIGIN = 'https://flespi.io'
const LEGACY_BRIDGE_URL = `${LEGACY_ORIGIN}/toolbox/settings-bridge.html`
const LEGACY_IMPORT_ORIGINS = ['https://toolbox.flespi.io']
const LEGACY_MESSAGE_TYPE = 'flespi-toolbox-settings-bridge'
/* the bridge is asked once per browser, whatever comes of it */
const LEGACY_IMPORT_FLAG = `${SETTINGS_KEY}.legacy-origin-imported`
const LEGACY_BRIDGE_TIMEOUT = 2000
/* the bridge answers right after it has read the storage — a loaded page that is silent is not the bridge */
const LEGACY_BRIDGE_GRACE = 500

/*
 * Settings used to live in a single localStorage record. Column schemas are stored per device type
 * and used to carry the whole protocol schema, so the record grew towards the ~5MB origin quota and
 * every column change rewrote all of it synchronously.
 *
 * They are kept in IndexedDB now, one record per list, and a list is read only when it is shown.
 * Reads are synchronous all over the app, so a record is cached in memory once loaded: `getItemAsync`
 * (used by qvirtualscroll) loads it, `getItem` serves it from the cache afterwards. Without
 * IndexedDB (private mode, old browser) everything falls back to localStorage.
 */
const cache = {}
const pendingWrites = new Set()
let db = null
let writeTimer = null

/*
 * A storage failure must never reach the app: a full localStorage used to throw on write and leave
 * the interface unable to start, and a half-written or foreign record used to be handed over as is.
 */
function lsGet (name) {
  try {
    return LocalStorage.getItem(name)
  } catch (e) {
    return null
  }
}

function lsSet (name, value) {
  try {
    LocalStorage.set(name, value)
  } catch (e) {
    /* out of quota or storage disabled — the app keeps the value in memory for this session */
  }
}

function lsRemove (name) {
  try {
    LocalStorage.remove(name)
  } catch (e) {}
}

function openDb () {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not available'))
      return
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const openedDb = request.result
      if (!openedDb.objectStoreNames.contains(STORE_NAME)) {
        openedDb.createObjectStore(STORE_NAME)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function readRecord (name) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(name)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

function readAllRecords () {
  return new Promise((resolve, reject) => {
    const records = {}
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).openCursor()
    request.onsuccess = () => {
      const cursor = request.result
      if (!cursor) {
        resolve(records)
        return
      }
      records[cursor.key] = cursor.value
      cursor.continue()
    }
    request.onerror = () => reject(request.error)
  })
}

/* resolves once the written records are committed, so a reload right after it loses nothing */
function flush () {
  if (writeTimer) { clearTimeout(writeTimer) }
  writeTimer = null
  if (!db || !pendingWrites.size) { return Promise.resolve() }
  const names = [...pendingWrites]
  pendingWrites.clear()
  try {
    const transaction = db.transaction(STORE_NAME, 'readwrite')
    const committed = new Promise(resolve => {
      transaction.oncomplete = transaction.onerror = transaction.onabort = () => resolve()
    })
    const store = transaction.objectStore(STORE_NAME)
    names.forEach(name => {
      if (cache[name] === undefined) {
        store.delete(name)
      } else {
        /* structured clone rejects the observers Vue puts on the objects it tracks */
        store.put(JSON.parse(JSON.stringify(cache[name])), name)
      }
    })
    return committed
  } catch (e) {
    /* an aborted transaction costs the user the last settings change, not the session */
    return Promise.resolve()
  }
}

function scheduleWrite (name) {
  pendingWrites.add(name)
  if (!db) { return }
  if (writeTimer) { clearTimeout(writeTimer) }
  writeTimer = setTimeout(() => { flush() }, WRITE_DEBOUNCE)
}

function isObject (value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

/* the protocol schema is rebuilt from the protocol message parameters on every load — never store it */
function dropProtocolSchemas (listCols) {
  if (!isObject(listCols)) { return {} }
  Object.keys(listCols).forEach(entry => {
    const schemas = listCols[entry] && listCols[entry].schemas
    if (schemas) { delete schemas._protocol }
  })
  return listCols
}

/* settings of all lists used to sit in one record under `cols` — split them into a record per list */
function migrateEmbeddedCols (settings) {
  if (!settings || !settings.cols) { return settings }
  Object.keys(settings.cols).forEach(list => {
    const key = `${COLS_NAMESPACE}.${list}`
    if (cache[key] !== undefined) { return }
    cache[key] = dropProtocolSchemas(settings.cols[list] || {})
    scheduleWrite(key)
  })
  delete settings.cols
  cache[SETTINGS_KEY] = settings
  scheduleWrite(SETTINGS_KEY)
  return settings
}

function isToolboxKey (name) {
  return name === SETTINGS_KEY || (typeof name === 'string' && name.indexOf(`${COLS_NAMESPACE}.`) === 0)
}

/*
 * Brings records from another storage (an exported file, the old origin) to the current shape: only
 * the toolbox records, columns split into a record per list, no protocol schemas. The records are
 * copied, they come from outside and are not to be shared with the cache.
 */
function normalizeRecords (records) {
  const result = {}
  if (!isObject(records)) { return result }
  Object.keys(records).forEach(name => {
    if (isToolboxKey(name) && isObject(records[name])) {
      result[name] = JSON.parse(JSON.stringify(records[name]))
    }
  })
  const settings = result[SETTINGS_KEY]
  if (settings && 'cols' in settings) {
    if (isObject(settings.cols)) {
      Object.keys(settings.cols).forEach(list => {
        const key = `${COLS_NAMESPACE}.${list}`
        if (result[key] === undefined && isObject(settings.cols[list])) { result[key] = settings.cols[list] }
      })
    }
    delete settings.cols
  }
  Object.keys(result).forEach(name => {
    if (name !== SETTINGS_KEY) { result[name] = dropProtocolSchemas(result[name]) }
  })
  return result
}

function mergeObjects (incoming, existing) {
  return { ...(isObject(incoming) ? incoming : {}), ...(isObject(existing) ? existing : {}) }
}

/* what the user has already set up here wins, the incoming record only fills in what is missing */
function mergeRecord (name, incoming, existing) {
  if (!isObject(existing)) { return incoming }
  if (name === SETTINGS_KEY) {
    return {
      ...incoming,
      ...existing,
      entities: mergeObjects(incoming.entities, existing.entities),
      viewSettings: mergeObjects(incoming.viewSettings, existing.viewSettings)
    }
  }
  const merged = { ...incoming, ...existing }
  if (incoming['custom-cols-schemas'] || existing['custom-cols-schemas']) {
    merged['custom-cols-schemas'] = mergeObjects(incoming['custom-cols-schemas'], existing['custom-cols-schemas'])
  }
  return merged
}

function requestLegacyRecords () {
  return new Promise(resolve => {
    const iframe = document.createElement('iframe')
    let timer = null
    const finish = records => {
      clearTimeout(timer)
      window.removeEventListener('message', messageHandler)
      iframe.remove()
      resolve(records)
    }
    const messageHandler = event => {
      if (event.origin !== LEGACY_ORIGIN || event.source !== iframe.contentWindow) { return }
      if (!isObject(event.data) || event.data.type !== LEGACY_MESSAGE_TYPE) { return }
      finish(isObject(event.data.records) ? event.data.records : {})
    }
    window.addEventListener('message', messageHandler)
    timer = setTimeout(() => finish(null), LEGACY_BRIDGE_TIMEOUT)
    iframe.onload = () => {
      clearTimeout(timer)
      timer = setTimeout(() => finish(null), LEGACY_BRIDGE_GRACE)
    }
    iframe.style.display = 'none'
    iframe.setAttribute('aria-hidden', 'true')
    iframe.src = LEGACY_BRIDGE_URL
    ;(document.body || document.documentElement).appendChild(iframe)
  })
}

async function importLegacyOrigin (storage) {
  if (!LEGACY_IMPORT_ORIGINS.includes(window.location.origin)) { return }
  if (lsGet(LEGACY_IMPORT_FLAG)) { return }
  /*
   * marked before the request, so a bridge that is not reachable, a failed import or a tab closed
   * halfway never cost another start; a storage that cannot keep the mark is not asked at all,
   * it would have the bridge loaded on every start
   */
  lsSet(LEGACY_IMPORT_FLAG, true)
  if (lsGet(LEGACY_IMPORT_FLAG) !== true) { return }
  const records = await requestLegacyRecords()
  if (records) { await storage.importRecords(records) }
}

export default {
  async init () {
    try {
      db = await openDb()
      let settings = await readRecord(SETTINGS_KEY)
      if (settings === undefined && !lsGet(IMPORTED_FLAG)) {
        /*
         * the previous versions kept everything in localStorage; the record is left there on purpose
         * as a snapshot to roll back to, and is to be removed a few releases later
         */
        settings = lsGet(SETTINGS_KEY)
        if (settings !== null && settings !== undefined) {
          lsSet(IMPORTED_FLAG, true)
        }
      }
      /* a record left broken by a failed write is no reason to keep the app from starting */
      if (isObject(settings)) {
        cache[SETTINGS_KEY] = settings
        scheduleWrite(SETTINGS_KEY)
        migrateEmbeddedCols(settings)
      }
      flush()
    } catch (e) {
      db = null
    }
    try {
      await importLegacyOrigin(this)
    } catch (e) {
      /* the old settings are a nice-to-have, never a reason to keep the app from starting */
    }
  },

  getItem (name) {
    if (!db) { return lsGet(name) }
    return cache[name] !== undefined ? cache[name] : null
  },

  async getItemAsync (name) {
    if (!db) { return lsGet(name) }
    if (cache[name] === undefined) {
      try {
        const record = await readRecord(name)
        cache[name] = record === undefined ? null : record
      } catch (e) {
        cache[name] = null
      }
    }
    return cache[name]
  },

  set (name, value) {
    if (!db) {
      lsSet(name, value)
      return
    }
    cache[name] = value
    scheduleWrite(name)
  },

  remove (name) {
    if (!db) {
      lsRemove(name)
      return
    }
    delete cache[name]
    scheduleWrite(name)
  },

  /*
   * Merges records from another storage into this one: `overwrite` replaces everything with them
   * (import of a file the user picked), otherwise they only fill in what is missing here.
   * Returns the number of records written.
   */
  async importRecords (records, { overwrite = false } = {}) {
    const incoming = normalizeRecords(records)
    const names = Object.keys(incoming)
    if (overwrite) { this.clear() }
    for (const name of names) {
      const existing = overwrite ? null : await this.getItemAsync(name)
      this.set(name, mergeRecord(name, incoming[name], existing))
    }
    await flush()
    return names.length
  },

  async exportRecords () {
    let records = {}
    if (db) {
      await flush()
      records = await readAllRecords()
    } else {
      try {
        LocalStorage.getAllKeys().forEach(name => { records[name] = lsGet(name) })
      } catch (e) {}
    }
    return {
      format: EXPORT_FORMAT,
      version: EXPORT_VERSION,
      origin: window.location.origin,
      date: new Date().toISOString(),
      records: normalizeRecords(records)
    }
  },

  /* throws on anything that is not a settings export, so the user is told instead of left guessing */
  async importExport (data) {
    if (!isObject(data) || data.format !== EXPORT_FORMAT || !isObject(data.records)) {
      throw new Error('The file is not a Toolbox settings export')
    }
    const count = await this.importRecords(data.records, { overwrite: true })
    if (!count) { throw new Error('The file contains no settings') }
    return count
  },

  /* settings and the columns of every list used to share one record, so a reset wiped them together */
  clear () {
    /* the pre-migration snapshot goes too, a reset is meant to leave nothing to come back from */
    lsRemove(SETTINGS_KEY)
    lsRemove(IMPORTED_FLAG)
    /* nor is the old origin to bring its settings back after a reset */
    lsSet(LEGACY_IMPORT_FLAG, true)
    if (!db) { return }
    Object.keys(cache).forEach(name => { delete cache[name] })
    pendingWrites.clear()
    try {
      db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).clear()
    } catch (e) {}
  }
}
