/*
 * Column schemas are kept in one storage record per list (`<lsNamespace>.<name>`), so an app can
 * load only the schemas of the lists it shows instead of the whole settings blob. A storage that
 * cannot serve every record synchronously (IndexedDB and the like) may expose an async
 * `getItemAsync` next to the synchronous `getItem`: reads go through it, and by the time a list
 * saves its columns the record is already in the storage cache, so writes stay synchronous.
 *
 * The `_protocol` schema is never saved: it is rebuilt from the protocol message parameters on
 * every getCols and holds a column per protocol parameter (thousands of them for some device types).
 */
function getStorageKey (lsNamespace, name) {
  return lsNamespace ? `${lsNamespace}.${name}` : name
}

function splitSchemas (cols) {
  const customColsSchema = {
    ...cols.schemas,
    _default: undefined,
    _protocol: undefined,
    _unsaved: undefined
  }
  const defaultColsSchema = {
    activeSchema: cols.activeSchema,
    schemas: {
      _default: cols.schemas._default,
      /* the unsaved state is worth keeping only while it is in use — stored otherwise it outlives
       * the session and comes back as a preset of its own named Modified */
      _unsaved: cols.activeSchema === '_unsaved' ? cols.schemas._unsaved : undefined
    }
  }
  return { customColsSchema, defaultColsSchema }
}

function isObject (value) {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

/*
 * Storage is the one input nobody validates: a quota error while saving, a half-written record or a
 * value left by an older version used to reach the lists as is and take the whole app down with a
 * blank screen, curable only by clearing the storage by hand. Anything that does not look like a
 * schema is dropped here instead.
 */
function sanitizeSchemas (schemas) {
  return Object.keys(schemas).reduce((res, name) => {
    const schema = schemas[name]
    if (isObject(schema) && Array.isArray(schema.cols)) { res[name] = schema }
    return res
  }, {})
}

/* an entry without a usable `_default` is worse than no entry: the list has nothing to fall back to */
function sanitizeEntry (entry) {
  if (!isObject(entry) || !isObject(entry.schemas)) { return null }
  const schemas = sanitizeSchemas(entry.schemas)
  if (!schemas._default) { return null }
  const activeSchema = typeof entry.activeSchema === 'string' ? entry.activeSchema : '_default'
  /* records written by the versions that kept it around still carry a stale one */
  if (activeSchema !== '_unsaved') { delete schemas._unsaved }
  return { activeSchema, schemas }
}

function sanitizeCols (colsFromStorage) {
  if (!isObject(colsFromStorage)) { return {} }
  return Object.keys(colsFromStorage).reduce((res, key) => {
    const value = colsFromStorage[key]
    if (key === 'custom-cols-schemas') {
      if (isObject(value)) {
        const schemas = sanitizeSchemas(value)
        /* only named presets belong here — a built-in one would shadow the entry it is merged into */
        delete schemas._default
        delete schemas._protocol
        delete schemas._unsaved
        res[key] = schemas
      }
    } else {
      const entry = sanitizeEntry(value)
      if (entry) { res[key] = entry }
    }
    return res
  }, {})
}

async function getColsLS (LocalStorage, lsNamespace, name) {
  const key = getStorageKey(lsNamespace, name)
  try {
    const colsFromStorage = typeof LocalStorage.getItemAsync === 'function'
      ? await LocalStorage.getItemAsync(key)
      : LocalStorage.getItem(key)
    return sanitizeCols(colsFromStorage)
  } catch (e) {
    return {}
  }
}

function setColsLS (LocalStorage, lsNamespace, name, active, cols) {
  const key = getStorageKey(lsNamespace, name)
  try {
    const colsFromStorage = sanitizeCols(LocalStorage.getItem(key))
    const { customColsSchema, defaultColsSchema } = splitSchemas(cols)
    colsFromStorage[active] = defaultColsSchema
    colsFromStorage['custom-cols-schemas'] = { ...customColsSchema }
    LocalStorage.set(key, colsFromStorage)
  } catch (e) {
    /* columns the user cannot store are still columns the user can work with */
  }
}

export {
  getColsLS,
  setColsLS
}
