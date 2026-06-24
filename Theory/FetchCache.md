The Fetch API cache option tells the browser how to interact with its existing HTTP cache for a specific request. The server defines the cache rules. The Fetch API decides how the browser should use those rules for a particular request.

Example: The browser may use the cached response for up to 1 hour.
fetch("/api/data", { cache: "reload" }) - Forced refresh. The browser ignores the cached copy and requests fresh data from the server, even though the cached response is still valid.

# cache: "default" (default behavior)
This is what happens if you don’t specify anything.
- Uses normal HTTP caching rules (Cache-Control, ETag, etc.)
- May return a cached response or go to network depending on freshness
- Can revalidate with server (e.g. 304 Not Modified)


# cache: "no-store"
- Never uses cache
- Always goes to network
- Does not store response in cache

Use when data must always be fresh (e.g. banking, auth, real-time data)


# cache: "reload"
- Always goes to network
- BUT still stores the response in cache after fetching

Use when you want a fresh copy but still want caching updated


# cache: "no-cache"
- May use cache, BUT must revalidate with server first
- Browser sends conditional request (ETag / If-Modified-Since)
- Server can respond 304 Not Modified

Use when you want correctness but still allow caching


# cache: "force-cache"
- Always tries cache first
- Only goes to network if nothing is cached (or cache expired per HTTP rules)

Use when offline support or performance is priority


# cache: "only-if-cached"
- Only returns cached response
- If nothing is cached - request fails
- Only works in same-origin requests + special modes

fetch("/api/data", { cache: "only-if-cached", mode: "same-origin" })


# Real-world usage patterns
- Always fresh API data - { cache: "no-store" }
- Always revalidate but allow caching - { cache: "no-cache" }
- Performance-first static data - { cache: "force-cache" }
