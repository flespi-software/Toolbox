/* distance from the bottom (px) that still counts as the list being pinned to the last item */
const TAIL_THRESHOLD = 4

export default {
  methods: {
    /*
     * While a real-time list is pinned to the bottom, its scroll position is just "the latest data":
     * keeping it in the route would rewrite the query on every incoming message, and a shared link
     * is expected to open on the fresh tail anyway. Scroll positions are stored only once the user
     * leaves the bottom.
     */
    isLiveTail (event) {
      if (!this.realtimeEnabled) { return false }
      const el = event && event.target
      if (!el) { return false }
      return el.scrollHeight - el.scrollTop - el.clientHeight <= TAIL_THRESHOLD
    }
  }
}
