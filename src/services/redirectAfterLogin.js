/*
 * The Vue 2 build handed the route to come back to through `router.push({ params: { goto: route } })`.
 * Vue Router 4 dropped support for non-string route params, so the pending location is kept here
 * instead — it never needed to be in the URL.
 */
let pending = null

export function setPendingRoute (route) {
  pending = route ? route.fullPath : null
}

export function takePendingRoute () {
  const route = pending
  pending = null
  return route
}
