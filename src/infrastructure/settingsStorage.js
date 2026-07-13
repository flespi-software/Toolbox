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

function flush () {
  writeTimer = null
  if (!db || !pendingWrites.size) { return }
  const names = [...pendingWrites]
  pendingWrites.clear()
  try {
    const store = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME)
    names.forEach(name => {
      if (cache[name] === undefined) {
        store.delete(name)
      } else {
        /* structured clone rejects the observers Vue puts on the objects it tracks */
        store.put(JSON.parse(JSON.stringify(cache[name])), name)
      }
    })
  } catch (e) {
    /* an aborted transaction costs the user the last settings change, not the session */
  }
}

function scheduleWrite (name) {
  pendingWrites.add(name)
  if (!db) { return }
  if (writeTimer) { clearTimeout(writeTimer) }
  writeTimer = setTimeout(flush, WRITE_DEBOUNCE)
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

  /* settings and the columns of every list used to share one record, so a reset wiped them together */
  clear () {
    /* the pre-migration snapshot goes too, a reset is meant to leave nothing to come back from */
    lsRemove(SETTINGS_KEY)
    lsRemove(IMPORTED_FLAG)
    if (!db) { return }
    Object.keys(cache).forEach(name => { delete cache[name] })
    pendingWrites.clear()
    try {
      db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).clear()
    } catch (e) {}
  }
}
