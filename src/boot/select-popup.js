import { defineBoot } from '#q-app'
/* the very module the templates use — importing QSelect from 'quasar' may give another copy */
import QSelect from 'quasar/src/components/select/QSelect.js'

/*
 * Viewers rewrite the route query while messages/logs are streaming (scroll position, filters),
 * and Quasar dismisses every popup on route change.
 *
 * Quasar 1 had no way to pass `no-route-dismiss` through QSelect to its inner QMenu/QDialog, so the
 * Vue 2 build patched QSelect's render functions. Quasar 2 exposes it as `popup-no-route-dismiss`,
 * and the default is flipped here so that it keeps applying to every select in the app rather than
 * having to be remembered at each of them.
 */
QSelect.props.popupNoRouteDismiss = { type: Boolean, default: true }

export default defineBoot(() => {
})
