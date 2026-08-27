/*
 * Vuex let a list register its module under a name and drop it again on unmount. Pinia keys a store
 * by its id and ignores a second definition with the same id, so the definitions are cached here:
 * asking for the same name twice hands back the same store, and `disposeListStore` is the
 * `unregisterModule` of the Vue 2 build.
 */
const definitions = new Map()

/*
 * Returns the store for `config.name`, creating it the first time it is asked for. Whether the list
 * itself has been set up before is tracked by the store's own `initialized` flag rather than by who
 * got here first — a page reads the same store as the list it contains, and gets there earlier.
 */
export function useListStore (create, config) {
  const { name } = config
  if (!definitions.has(name)) {
    definitions.set(name, create(config))
  }
  return definitions.get(name)()
}

/*
 * The store already registered under `name`, or null. Vuex let any component reach a module by name
 * alone; here the definition has to exist already, which it does for anything rendered under the
 * component that created it.
 */
export function getListStore (name) {
  const definition = definitions.get(name)
  return definition ? definition() : null
}

export function disposeListStore (name, store) {
  definitions.delete(name)
  if (store) { store.$dispose() }
}
