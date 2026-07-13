/* the very module the templates use — importing QSelect from 'quasar' may give another copy */
import QSelect from 'quasar/src/components/select/QSelect.js'

/*
 * Viewers rewrite the route query while messages/logs are streaming (scroll position, filters),
 * and Quasar dismisses every popup on route change. QSelect has no prop to pass `no-route-dismiss`
 * to its inner QMenu/QDialog, so it is set on the vnode of the popup here.
 *
 * Both `options` and `extendOptions` are patched: Vue rebuilds `options` from `extendOptions`
 * whenever a global mixin is installed, which would drop a patch applied to `options` alone.
 */
function keepPopupOnRouteChange (methods, name) {
  const render = methods[name]
  if (typeof render !== 'function') { return }
  methods[name] = function (h) {
    const vnode = render.call(this, h)
    if (vnode && vnode.componentOptions) {
      vnode.componentOptions.propsData.noRouteDismiss = true
    }
    return vnode
  }
}

const patchTargets = [QSelect.options.methods, QSelect.extendOptions.methods]

patchTargets.forEach(methods => {
  if (!methods) { return }
  keepPopupOnRouteChange(methods, '__getMenu')
  keepPopupOnRouteChange(methods, '__getDialog')
})
